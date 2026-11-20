import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseAdminClient, type SupabaseClient } from '@supabase/supabase-js';
import { createClient as createRequestClient } from '@/lib/supabase/server';

type AdminClient = SupabaseClient<any, 'public'>;
type SupabaseRow = Record<string, any>;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return (value[0] as T | undefined) ?? null;
  return (value as T | undefined) ?? null;
}

function makeCode(prefix: string, value: string) {
  const slug = value.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 28);
  const suffix = createHash('sha256').update(value.toLowerCase()).digest('hex').slice(0, 8).toUpperCase();
  return `${prefix}-${slug}-${suffix}`;
}

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
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

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

  if (profile.status !== 'active' || profile.role !== 'admin') {
    return { response: NextResponse.json({ error: 'Admin access required.' }, { status: 403 }) };
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return { response: NextResponse.json({ error: 'Institution administration is not configured.' }, { status: 503 }) };
  }

  return {
    adminClient: createSupabaseAdminClient<any>(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    }),
  };
}

async function validateHead(
  adminClient: AdminClient,
  headUserId: string,
  currentInstitutionId?: string,
) {
  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .select('id, full_name, role, status')
    .eq('id', headUserId)
    .maybeSingle();

  if (profileError) {
    console.error('Failed to validate institution head:', profileError);
    return { error: 'Unable to validate the selected institution head.', status: 500 } as const;
  }
  if (!profile) {
    return { error: 'The selected user could not be found.', status: 400 } as const;
  }
  if (profile.role !== 'institution_head') {
    return { error: 'The selected user does not have the institution head role.', status: 400 } as const;
  }
  if (profile.status !== 'active') {
    return { error: 'The selected institution head account is not active.', status: 400 } as const;
  }

  let existingQuery = adminClient
    .from('institutions')
    .select('id, name')
    .eq('head_user_id', headUserId);

  if (currentInstitutionId) {
    existingQuery = existingQuery.neq('id', currentInstitutionId);
  }

  const { data: existing, error: existingError } = await existingQuery.maybeSingle();
  if (existingError) {
    console.error('Failed to check existing institution head assignment:', existingError);
    return { error: 'Unable to validate the selected institution head.', status: 500 } as const;
  }
  if (existing) {
    return {
      error: `This user is already assigned as head of ${existing.name}. Remove that assignment first.`,
      status: 409,
    } as const;
  }

  return null;
}

export async function GET() {
  const authorization = await requireAdmin();
  if ('response' in authorization) return authorization.response;

  const [institutionsResult, headsResult] = await Promise.all([
    authorization.adminClient
      .from('institutions')
      .select(`
        id, name, code, contact_person, email, phone, status, created_at, head_user_id,
        head:profiles!institutions_head_user_id_fkey(id, full_name, email, phone),
        branches(
          id, name, code, city, address,
          batches(id, student_batch_memberships(count))
        )
      `)
      .order('name'),
    authorization.adminClient
      .from('profiles')
      .select('id, full_name, email, phone, role, status')
      .eq('role', 'institution_head')
      .order('full_name'),
  ]);

  if (institutionsResult.error) {
    console.error('Failed to load institutions:', institutionsResult.error);
    return NextResponse.json({ error: 'Failed to load institutions.' }, { status: 500 });
  }

  if (headsResult.error) {
    console.error('Failed to load institution heads:', headsResult.error);
    return NextResponse.json({ error: 'Failed to load eligible institution heads.' }, { status: 500 });
  }

  const institutions = ((institutionsResult.data ?? []) as SupabaseRow[]).map((row) => {
    const head = one<SupabaseRow>(row.head);
    const branches = Array.isArray(row.branches) ? (row.branches as SupabaseRow[]) : [];
    const batches = branches.flatMap((branch) =>
      Array.isArray(branch.batches) ? (branch.batches as SupabaseRow[]) : [],
    );
    const studentsCount = batches.reduce((total, batch) => {
      const membershipCount = one<SupabaseRow>(batch.student_batch_memberships);
      const count = typeof membershipCount?.count === 'number' ? membershipCount.count : 0;
      return total + count;
    }, 0);

    return {
      id: String(row.id),
      name: String(row.name ?? 'Unnamed institution'),
      code: String(row.code ?? ''),
      headUserId: row.head_user_id ? String(row.head_user_id) : null,
      headName: head?.full_name ? String(head.full_name) : null,
      headEmail: head?.email ? String(head.email) : null,
      headPhone: head?.phone ? String(head.phone) : null,
      contactPerson: row.contact_person ? String(row.contact_person) : null,
      email: row.email ? String(row.email) : null,
      phone: row.phone ? String(row.phone) : null,
      branchesCount: branches.length,
      batchesCount: batches.length,
      studentsCount,
      status: String(row.status ?? 'active'),
      createdAt: String(row.created_at ?? ''),
    };
  });

  return NextResponse.json({
    institutions,
    eligibleHeads: (headsResult.data ?? []).map((head: SupabaseRow) => ({
      id: String(head.id),
      fullName: String(head.full_name ?? head.email ?? 'Unnamed user'),
      email: String(head.email ?? ''),
      phone: head.phone ? String(head.phone) : null,
      role: String(head.role ?? ''),
      status: String(head.status ?? ''),
    })),
  });
}

export async function POST(request: NextRequest) {
  const authorization = await requireAdmin();
  if ('response' in authorization) return authorization.response;

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
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const code = typeof input.code === 'string' ? input.code.trim().toUpperCase() : '';
  const contactPerson = typeof input.contact_person === 'string' ? input.contact_person.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  const phone = typeof input.phone === 'string' ? input.phone.trim() : '';
  const branchName = typeof input.branch_name === 'string' ? input.branch_name.trim() : '';
  const headUserId = typeof input.head_user_id === 'string' && input.head_user_id.trim()
    ? input.head_user_id.trim()
    : null;

  if (!name || name.length > 160) {
    return NextResponse.json({ error: 'Provide an institution name of 160 characters or fewer.' }, { status: 400 });
  }
  if (!code || !/^[A-Z0-9][A-Z0-9-]{1,39}$/.test(code)) {
    return NextResponse.json({ error: 'Provide a unique code using letters, numbers and hyphens.' }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Provide a valid institution email address.' }, { status: 400 });
  }
  if (contactPerson.length > 160 || email.length > 160 || phone.length > 40 || branchName.length > 120) {
    return NextResponse.json({ error: 'One or more institution fields are too long.' }, { status: 400 });
  }
  if (headUserId && !UUID_PATTERN.test(headUserId)) {
    return NextResponse.json({ error: 'Select a valid institution head.' }, { status: 400 });
  }

  if (headUserId) {
    const headError = await validateHead(authorization.adminClient, headUserId);
    if (headError) {
      return NextResponse.json({ error: headError.error }, { status: headError.status });
    }
  }

  const { data: created, error: createError } = await authorization.adminClient
    .from('institutions')
    .insert({
      name,
      code,
      contact_person: contactPerson || null,
      email: email || null,
      phone: phone || null,
      status: 'active',
      head_user_id: headUserId,
    })
    .select('id')
    .single();

  if (createError || !created) {
    if (createError?.code === '23505') {
      return NextResponse.json({ error: 'An institution with this code already exists.' }, { status: 409 });
    }
    console.error('Failed to create institution:', createError);
    return NextResponse.json({ error: 'Failed to create institution.' }, { status: 500 });
  }

  if (branchName) {
    const { error: branchError } = await authorization.adminClient
      .from('branches')
      .insert({
        institution_id: created.id,
        name: branchName,
        code: makeCode('BR', branchName),
      });

    if (branchError) {
      console.error('Failed to create initial institution branch:', branchError);
      await authorization.adminClient.from('institutions').delete().eq('id', created.id);
      return NextResponse.json({ error: 'Failed to create the initial campus branch.' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, institutionId: created.id }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const authorization = await requireAdmin();
  if ('response' in authorization) return authorization.response;

  const institutionId = request.nextUrl.searchParams.get('id');
  if (!institutionId || !UUID_PATTERN.test(institutionId)) {
    return NextResponse.json({ error: 'A valid institution ID is required.' }, { status: 400 });
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
  if (!('head_user_id' in input)) {
    return NextResponse.json({ error: 'Provide a head_user_id value.' }, { status: 400 });
  }
  if (input.head_user_id !== null && typeof input.head_user_id !== 'string') {
    return NextResponse.json({ error: 'Select a valid institution head.' }, { status: 400 });
  }

  const headUserId = typeof input.head_user_id === 'string' && input.head_user_id.trim()
    ? input.head_user_id.trim()
    : null;

  if (headUserId && !UUID_PATTERN.test(headUserId)) {
    return NextResponse.json({ error: 'Select a valid institution head.' }, { status: 400 });
  }

  if (headUserId) {
    const headError = await validateHead(authorization.adminClient, headUserId, institutionId);
    if (headError) {
      return NextResponse.json({ error: headError.error }, { status: headError.status });
    }
  }

  const { data: updated, error: updateError } = await authorization.adminClient
    .from('institutions')
    .update({ head_user_id: headUserId })
    .eq('id', institutionId)
    .select('id')
    .maybeSingle();

  if (updateError) {
    if (updateError.code === '23505') {
      return NextResponse.json({ error: 'This user is already assigned to another institution.' }, { status: 409 });
    }
    console.error('Failed to assign institution head:', updateError);
    return NextResponse.json({ error: 'Failed to assign the institution head.' }, { status: 500 });
  }
  if (!updated) {
    return NextResponse.json({ error: 'Institution not found.' }, { status: 404 });
  }

  return NextResponse.json({ success: true, headUserId });
}
