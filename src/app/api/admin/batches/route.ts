import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { createClient as createSupabaseAdminClient, type SupabaseClient } from '@supabase/supabase-js';
import { createClient as createRequestClient } from '@/lib/supabase/server';

const PROGRAMMES = {
  'PRG-A': 'Programme A: Designing + Communication',
  'PRG-B': 'Programme B: Technology (Web Basics) + Designing',
} as const;

type ProgrammeCode = keyof typeof PROGRAMMES;
type BatchStatus = 'active' | 'upcoming' | 'completed' | 'archived';
type AdminClient = SupabaseClient<any, 'public'>;

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

  if (profile.status !== 'active' || profile.role !== 'admin') {
    return { response: NextResponse.json({ error: 'Admin access required.' }, { status: 403 }) };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    return { response: NextResponse.json({ error: 'Batch administration is not configured.' }, { status: 503 }) };
  }

  return {
    adminClient: createSupabaseAdminClient<any>(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    }),
  };
}

function isProgrammeCode(value: unknown): value is ProgrammeCode {
  return value === 'PRG-A' || value === 'PRG-B';
}

function isBatchStatus(value: unknown): value is BatchStatus {
  return value === 'active' || value === 'upcoming' || value === 'completed' || value === 'archived';
}

function getInput(body: unknown) {
  if (!body || typeof body !== 'object') return null;

  const input = body as Record<string, unknown>;
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const institution = typeof input.institution === 'string' ? input.institution.trim() : '';
  const branch = typeof input.branch === 'string' ? input.branch.trim() : '';
  const grade = typeof input.grade === 'string' ? input.grade.trim() : '';
  const startDate = typeof input.start_date === 'string' ? input.start_date : '';
  const endDate = typeof input.end_date === 'string' ? input.end_date : '';
  const programmeCode = input.programme_code;
  const status = input.status;
  const teachers = Array.isArray(input.teachers) && input.teachers.every((teacher): teacher is string => typeof teacher === 'string')
    ? input.teachers.map(teacher => teacher.trim()).filter(Boolean)
    : null;

  if (
    !name || name.length > 120 ||
    !institution || institution.length > 120 ||
    !branch || branch.length > 120 ||
    !/^Grade (6|7|8|9|10)$/.test(grade) ||
    !isProgrammeCode(programmeCode) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(endDate) ||
    !isCalendarDate(startDate) ||
    !isCalendarDate(endDate) ||
    startDate >= endDate ||
    !teachers || teachers.length > 2 || teachers.some(teacher => teacher.length > 120) ||
    (status !== undefined && !isBatchStatus(status))
  ) {
    return null;
  }

  return {
    name,
    institution,
    branch,
    grade,
    startDate,
    endDate,
    programmeCode,
    status: isBatchStatus(status) ? status : 'upcoming',
    teachers,
  };
}

function isCalendarDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function makeCode(prefix: string, value: string) {
  const slug = value.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 28);
  const suffix = createHash('sha256').update(value.toLowerCase()).digest('hex').slice(0, 8).toUpperCase();
  return `${prefix}-${slug}-${suffix}`;
}

async function findOrCreateOrganization(
  adminClient: AdminClient,
  institutionName: string,
  branchName: string,
) {
  const knownInstitutionCodes: Record<string, string> = {
    'Partner School Alpha': 'PSA-01',
    'Partner School Beta': 'PSB-02',
    'Sunrise Public Academy': 'SPA-04',
  };
  const institutionCode = knownInstitutionCodes[institutionName] ?? makeCode('INST', institutionName);

  const { data: existingInstitution, error: existingInstitutionError } = await adminClient
    .from('institutions')
    .select('id')
    .eq('name', institutionName)
    .limit(1)
    .maybeSingle();

  if (existingInstitutionError) {
    console.error('Failed to find batch institution:', existingInstitutionError);
    return { error: 'Unable to load the selected institution.' } as const;
  }

  let institutionId = existingInstitution?.id;
  if (!institutionId) {
    const { data: institution, error: institutionError } = await adminClient
      .from('institutions')
      .upsert({ name: institutionName, code: institutionCode }, { onConflict: 'code', ignoreDuplicates: true })
      .select('id')
      .maybeSingle();

    if (institutionError) {
      console.error('Failed to resolve batch institution:', institutionError);
      return { error: 'Unable to save the selected institution.' } as const;
    }

    institutionId = institution?.id;
    if (!institutionId) {
      const { data: matchedInstitution, error: lookupError } = await adminClient
        .from('institutions')
        .select('id, name')
        .eq('code', institutionCode)
        .single();
      if (lookupError || !matchedInstitution) {
        console.error('Failed to reload batch institution:', lookupError);
        return { error: 'Unable to load the selected institution.' } as const;
      }
      if (matchedInstitution.name !== institutionName) {
        return { error: 'The institution code conflicts with another institution.' } as const;
      }
      institutionId = matchedInstitution.id;
    }
  }

  const { data: existingBranch, error: existingBranchError } = await adminClient
    .from('branches')
    .select('id')
    .eq('institution_id', institutionId)
    .eq('name', branchName)
    .limit(1)
    .maybeSingle();

  if (existingBranchError) {
    console.error('Failed to find batch branch:', existingBranchError);
    return { error: 'Unable to load the selected branch.' } as const;
  }
  if (existingBranch) return { branchId: existingBranch.id } as const;

  const branchCode = makeCode('BR', branchName);
  const { data: branch, error: branchError } = await adminClient
    .from('branches')
    .upsert({
      institution_id: institutionId,
      name: branchName,
      code: branchCode,
    }, { onConflict: 'institution_id,code', ignoreDuplicates: true })
    .select('id')
    .maybeSingle();

  if (branchError) {
    console.error('Failed to resolve batch branch:', branchError);
    return { error: 'Unable to save the selected branch.' } as const;
  }

  if (branch) return { branchId: branch.id } as const;

  const { data: matchedBranch, error: branchLookupError } = await adminClient
    .from('branches')
    .select('id, name')
    .eq('institution_id', institutionId)
    .eq('code', branchCode)
    .single();

  if (branchLookupError || !matchedBranch) {
    console.error('Failed to reload batch branch:', branchLookupError);
    return { error: 'Unable to load the selected branch.' } as const;
  }
  if (matchedBranch.name !== branchName) {
    return { error: 'The branch code conflicts with another branch.' } as const;
  }

  return { branchId: matchedBranch.id } as const;
}

export async function GET() {
  const authorization = await requireAdmin();
  if ('response' in authorization) return authorization.response;

  const { data, error } = await authorization.adminClient
    .from('batches')
    .select(`
      id, name, grade, start_date, end_date, status, teacher_names,
      branch:branches(name, institution:institutions(name)),
      programme:programmes(name, code),
      student_batch_memberships(count)
    `)
    .order('start_date', { ascending: false });

  if (error) {
    console.error('Failed to load batches:', error);
    return NextResponse.json({ error: 'Failed to load batches.' }, { status: 500 });
  }

  const batches = data.map(batch => {
    const branch = Array.isArray(batch.branch) ? batch.branch[0] : batch.branch;
    const institution = branch && (Array.isArray(branch.institution) ? branch.institution[0] : branch.institution);
    const programme = Array.isArray(batch.programme) ? batch.programme[0] : batch.programme;
    const memberships = Array.isArray(batch.student_batch_memberships) ? batch.student_batch_memberships[0] : null;

    return {
      id: batch.id,
      name: batch.name,
      institution: institution?.name ?? 'Unknown institution',
      branch: branch?.name ?? 'Unknown branch',
      programme: programme?.name ?? 'Unknown programme',
      programmeCode: programme?.code ?? '',
      grade: batch.grade ?? 'Grade not set',
      startDate: batch.start_date,
      endDate: batch.end_date,
      studentsCount: memberships?.count ?? 0,
      teachers: batch.teacher_names ?? [],
      status: batch.status === 'active'
        ? 'Active'
        : batch.status === 'completed'
        ? 'Completed'
        : batch.status === 'archived'
        ? 'Archived'
        : 'Upcoming',
    };
  });

  return NextResponse.json({ batches });
}

async function saveBatch(request: NextRequest, batchId?: string) {
  const authorization = await requireAdmin();
  if ('response' in authorization) return authorization.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const input = getInput(body);
  if (!input) {
    return NextResponse.json({ error: 'Provide valid batch details and a valid date range.' }, { status: 400 });
  }

  const { data: programme, error: programmeError } = await authorization.adminClient
    .from('programmes')
    .select('id')
    .eq('code', input.programmeCode)
    .single();

  if (programmeError || !programme) {
    console.error('Failed to resolve batch programme:', programmeError);
    return NextResponse.json({ error: 'The selected programme is not available.' }, { status: 400 });
  }

  const organization = await findOrCreateOrganization(
    authorization.adminClient,
    input.institution,
    input.branch,
  );
  if ('error' in organization) {
    return NextResponse.json({ error: organization.error }, { status: 500 });
  }

  const values = {
    name: input.name,
    branch_id: organization.branchId,
    programme_id: programme.id,
    grade: input.grade,
    start_date: input.startDate,
    end_date: input.endDate,
    status: input.status,
    teacher_names: input.teachers,
  };

  if (batchId) {
    const { data, error } = await authorization.adminClient
      .from('batches')
      .update(values)
      .eq('id', batchId)
      .select('id')
      .maybeSingle();

    if (error) {
      console.error('Failed to update batch:', error);
      return NextResponse.json({ error: 'Failed to update batch.' }, { status: 500 });
    }
    if (!data) return NextResponse.json({ error: 'Batch not found.' }, { status: 404 });
  } else {
    const { error } = await authorization.adminClient.from('batches').insert(values);
    if (error) {
      console.error('Failed to create batch:', error);
      return NextResponse.json({ error: 'Failed to create batch.' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true }, { status: batchId ? 200 : 201 });
}

export async function POST(request: NextRequest) {
  return saveBatch(request);
}

export async function PATCH(request: NextRequest) {
  const batchId = request.nextUrl.searchParams.get('id');
  if (!batchId) return NextResponse.json({ error: 'A batch ID is required.' }, { status: 400 });
  return saveBatch(request, batchId);
}
