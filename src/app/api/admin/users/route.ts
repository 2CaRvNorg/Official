import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import { createClient as createRequestClient } from '@/lib/supabase/server';
import { isElectiveCourse } from '@/lib/student-courses';

const VALID_ROLES = ['institution_head', 'teacher', 'student', 'money_management'] as const;
type ManagedRole = (typeof VALID_ROLES)[number];

async function requireAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes('placeholder') ||
    supabaseAnonKey.includes('placeholder')
  ) {
    return { response: NextResponse.json({ error: 'Authentication is not configured.' }, { status: 503 }) };
  }

  const supabase = createRequestClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return { response: NextResponse.json({ error: 'Unauthorized.' }, { status: 401 }) };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Failed to verify admin profile:', profileError);
    return { response: NextResponse.json({ error: 'Unable to verify account permissions.' }, { status: 500 }) };
  }

  if (profile?.status !== 'active') {
    return { response: NextResponse.json({ error: 'An active account is required.' }, { status: 403 }) };
  }

  if (profile?.role !== 'admin') {
    return { response: NextResponse.json({ error: 'Admin access required.' }, { status: 403 }) };
  }

  return { supabase, userId: user.id };
}

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  return createSupabaseAdminClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function GET() {
  const authorization = await requireAdmin();
  if ('response' in authorization) return authorization.response;

  const { data, error } = await authorization.supabase
    .from('profiles')
    .select('id, full_name, email, role, status, force_password_change, created_at, phone')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load user profiles:', error);
    return NextResponse.json({ error: 'Failed to load users.' }, { status: 500 });
  }

  return NextResponse.json({ users: data });
}

export async function POST(request: NextRequest) {
  const authorization = await requireAdmin();
  if ('response' in authorization) return authorization.response;

  const adminClient = createAdminClient();
  if (!adminClient) {
    return NextResponse.json({ error: 'User administration is not configured.' }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const fullName = typeof input.full_name === 'string' ? input.full_name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  const password = typeof input.password === 'string' ? input.password : '';
  const phone = typeof input.phone === 'string' ? input.phone.trim() : '';
  const grade = typeof input.grade === 'string' ? input.grade.trim() : '';
  const batchName = typeof input.batch_name === 'string' ? input.batch_name.trim() : '';
  const electiveCourse = input.elective_course;
  const role = typeof input.role === 'string' ? input.role : 'student';

  if (!fullName || fullName.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Provide a valid name and email address.' }, { status: 400 });
  }

  if (password.length < 8 || password.length > 128) {
    return NextResponse.json({ error: 'Password must be between 8 and 128 characters.' }, { status: 400 });
  }

  if (!VALID_ROLES.includes(role as ManagedRole)) {
    return NextResponse.json({ error: 'Invalid user role.' }, { status: 400 });
  }

  if (role === 'student' && !isElectiveCourse(electiveCourse)) {
    return NextResponse.json({ error: 'Select Design or Tech as the student elective course.' }, { status: 400 });
  }

  let batchId: string | null = null;
  if (role === 'student' && batchName) {
    const { data: batch, error: batchError } = await adminClient
      .from('batches')
      .select('id')
      .eq('name', batchName)
      .maybeSingle();

    if (batchError) {
      console.error('Failed to validate student batch:', batchError);
      return NextResponse.json({ error: 'Failed to validate the selected batch.' }, { status: 500 });
    }
    if (!batch) {
      return NextResponse.json({ error: `Batch "${batchName}" was not found.` }, { status: 400 });
    }
    batchId = batch.id;
  }

  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
    app_metadata: { role },
  });

  if (authError || !authData.user) {
    const alreadyExists = authError?.message.toLowerCase().includes('already');
    if (alreadyExists) {
      return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
    }

    console.error('Failed to create auth user:', authError);
    return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
  }

  const userId = authData.user.id;
  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .upsert({
      id: userId,
      email,
      full_name: fullName,
      role,
      phone: phone || null,
      metadata: {
        ...(grade ? { grade } : {}),
        ...(typeof input.guardian_phone === 'string' && input.guardian_phone.trim()
          ? { guardian_phone: input.guardian_phone.trim() }
          : {}),
      },
      force_password_change: true,
      status: 'active',
    })
    .select('id, full_name, email, role, status, force_password_change, created_at, phone')
    .single();

  if (profileError || !profile) {
    const { error: rollbackError } = await adminClient.auth.admin.deleteUser(userId);
    if (rollbackError) {
      console.error('Failed to roll back auth user after profile creation failed:', rollbackError);
    }
    console.error('Failed to create user profile:', profileError);
    return NextResponse.json({ error: 'Failed to create user profile.' }, { status: 500 });
  }

  if (role === 'student') {
    const { error: gamificationError } = await adminClient
      .from('learner_gamification')
      .upsert({ student_id: userId }, { onConflict: 'student_id' });
    if (gamificationError) {
      console.error('Failed to initialize student gamification:', gamificationError);
      const { error: rollbackError } = await adminClient.auth.admin.deleteUser(userId);
      if (rollbackError) {
        console.error('Failed to roll back student after gamification initialization failed:', rollbackError);
      }
      return NextResponse.json({ error: 'Failed to initialize student profile.' }, { status: 500 });
    }

    if (batchId) {
      const { error: membershipError } = await adminClient
        .from('student_batch_memberships')
        .insert({ student_id: userId, batch_id: batchId });
      if (membershipError) {
        console.error('Failed to enroll student in batch:', membershipError);
        const { error: rollbackError } = await adminClient.auth.admin.deleteUser(userId);
        if (rollbackError) {
          console.error('Failed to roll back student after enrollment failed:', rollbackError);
        }
        return NextResponse.json({ error: 'Failed to enroll student in the selected batch.' }, { status: 500 });
      }
    }

    const { error: courseBundleError } = await adminClient
      .from('student_course_bundles')
      .insert({ student_id: userId, elective_course: electiveCourse });

    if (courseBundleError) {
      console.error('Failed to assign student course bundle:', courseBundleError);
      const { error: rollbackError } = await adminClient.auth.admin.deleteUser(userId);
      if (rollbackError) {
        console.error('Failed to roll back student after course assignment failed:', rollbackError);
      }
      return NextResponse.json({ error: 'Failed to assign the student course bundle.' }, { status: 500 });
    }
  }

  return NextResponse.json({ user: profile }, { status: 201 });
}
