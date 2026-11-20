import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  emptyReportSummary,
  type InstitutionAlert,
  type InstitutionBatch,
  type InstitutionBranch,
  type InstitutionDashboardData,
  type InstitutionDetails,
  type InstitutionLiveClass,
  type InstitutionReportBatch,
  type InstitutionStudent,
  type InstitutionTeacherAssignment,
} from '@/lib/institution';

export const dynamic = 'force-dynamic';

type SupabaseRow = Record<string, any>;

function one<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return (value[0] as T | undefined) ?? null;
  return (value as T | undefined) ?? null;
}

function percentage(present: number, total: number): number | null {
  if (total <= 0) return null;
  return Math.round((present / total) * 1000) / 10;
}

function completionRate(startDate: string, endDate: string, status: string): number | null {
  if (status === 'completed' || status === 'archived') return 100;
  if (status === 'upcoming') return 0;

  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;

  return Math.min(100, Math.max(0, Math.round(((Date.now() - start) / (end - start)) * 100)));
}

function severityRank(severity: InstitutionAlert['severity']) {
  return severity === 'high' ? 0 : severity === 'medium' ? 1 : 2;
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes('placeholder') ||
    supabaseAnonKey.includes('placeholder')
  ) {
    return NextResponse.json({ error: 'Authentication is not configured.' }, { status: 503 });
  }

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, status')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Failed to load institution head profile:', profileError);
    return NextResponse.json({ error: 'Unable to verify account permissions.' }, { status: 500 });
  }

  if (profile.status !== 'active') {
    return NextResponse.json({ error: 'An active account is required.' }, { status: 403 });
  }

  if (profile.role !== 'institution_head') {
    return NextResponse.json({ error: 'Institution head access required.' }, { status: 403 });
  }

  const viewer = {
    id: user.id,
    fullName: profile.full_name || profile.email || 'Institution Head',
    email: profile.email || '',
    role: profile.role,
  };

  const { data: institutionRow, error: institutionError } = await supabase
    .from('institutions')
    .select(`
      id, name, code, contact_person, email, phone, status, created_at, head_user_id,
      branches(id, name, code, city, address)
    `)
    .eq('head_user_id', user.id)
    .limit(1)
    .maybeSingle();

  if (institutionError) {
    console.error('Failed to load institution for head:', institutionError);
    return NextResponse.json({ error: 'Failed to load your institution.' }, { status: 500 });
  }

  if (!institutionRow) {
    const empty: InstitutionDashboardData = {
      viewer,
      institution: null,
      batches: [],
      students: [],
      liveClasses: [],
      teacherAssignments: [],
      reports: emptyReportSummary(),
      alerts: [],
      generatedAt: new Date().toISOString(),
    };
    return NextResponse.json(empty);
  }

  const institutionRecord = institutionRow as SupabaseRow;
  const branchRows = Array.isArray(institutionRecord.branches)
    ? (institutionRecord.branches as SupabaseRow[])
    : [];

  const branches: InstitutionBranch[] = branchRows.map((branch) => ({
    id: String(branch.id),
    name: String(branch.name ?? 'Unnamed branch'),
    code: String(branch.code ?? ''),
    city: branch.city ? String(branch.city) : null,
    address: branch.address ? String(branch.address) : null,
  }));

  const institution: InstitutionDetails = {
    id: String(institutionRecord.id),
    name: String(institutionRecord.name ?? 'Unnamed institution'),
    code: String(institutionRecord.code ?? ''),
    contactPerson: institutionRecord.contact_person ? String(institutionRecord.contact_person) : null,
    email: institutionRecord.email ? String(institutionRecord.email) : null,
    phone: institutionRecord.phone ? String(institutionRecord.phone) : null,
    status: String(institutionRecord.status ?? 'active'),
    createdAt: String(institutionRecord.created_at ?? ''),
    headUserId: institutionRecord.head_user_id ? String(institutionRecord.head_user_id) : null,
    branches,
  };

  const branchIds = branches.map((branch) => branch.id);
  if (branchIds.length === 0) {
    const empty: InstitutionDashboardData = {
      viewer,
      institution,
      batches: [],
      students: [],
      liveClasses: [],
      teacherAssignments: [],
      reports: {
        ...emptyReportSummary(),
        totalBranches: 0,
      },
      alerts: [],
      generatedAt: new Date().toISOString(),
    };
    return NextResponse.json(empty);
  }

  const { data: batchData, error: batchError } = await supabase
    .from('batches')
    .select(`
      id, name, grade, status, start_date, end_date, teacher_names, branch_id,
      programme:programmes(name, code),
      branch:branches(id, name)
    `)
    .in('branch_id', branchIds)
    .order('start_date', { ascending: false });

  if (batchError) {
    console.error('Failed to load institution batches:', batchError);
    return NextResponse.json({ error: 'Failed to load institution batches.' }, { status: 500 });
  }

  const batchRows = (batchData ?? []) as SupabaseRow[];
  const batchIds = batchRows.map((batch) => String(batch.id));

  let membershipRows: SupabaseRow[] = [];
  let liveClassRows: SupabaseRow[] = [];
  let teacherAssignmentRows: SupabaseRow[] = [];
  let attendanceRows: SupabaseRow[] = [];

  if (batchIds.length > 0) {
    const [membershipsResult, liveClassesResult, teacherAssignmentsResult] = await Promise.all([
      supabase
        .from('student_batch_memberships')
        .select(`
          id, student_id, batch_id, status, enrolled_at,
          student:profiles(id, full_name, email, phone, status),
          batch:batches(id, name, grade)
        `)
        .in('batch_id', batchIds)
        .eq('status', 'active'),
      supabase
        .from('live_classes')
        .select(`
          id, title, meet_url, scheduled_start, scheduled_end, status, is_live, batch_id,
          teacher:profiles(id, full_name),
          subject:subjects(name),
          batch:batches(id, name)
        `)
        .in('batch_id', batchIds)
        .order('scheduled_start', { ascending: false }),
      supabase
        .from('teacher_assignments')
        .select(`
          id, teacher_id, batch_id,
          teacher:profiles(id, full_name, email),
          subject:subjects(name),
          batch:batches(id, name)
        `)
        .in('batch_id', batchIds),
    ]);

    if (membershipsResult.error) {
      console.error('Failed to load institution students:', membershipsResult.error);
      return NextResponse.json({ error: 'Failed to load institution students.' }, { status: 500 });
    }
    if (liveClassesResult.error) {
      console.error('Failed to load institution live classes:', liveClassesResult.error);
      return NextResponse.json({ error: 'Failed to load institution schedule.' }, { status: 500 });
    }
    if (teacherAssignmentsResult.error) {
      console.error('Failed to load institution teacher assignments:', teacherAssignmentsResult.error);
      return NextResponse.json({ error: 'Failed to load institution faculty assignments.' }, { status: 500 });
    }

    membershipRows = (membershipsResult.data ?? []) as SupabaseRow[];
    liveClassRows = (liveClassesResult.data ?? []) as SupabaseRow[];
    teacherAssignmentRows = (teacherAssignmentsResult.data ?? []) as SupabaseRow[];

    const liveClassIds = liveClassRows.map((liveClass) => String(liveClass.id));
    if (liveClassIds.length > 0) {
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance_records')
        .select('student_id, live_class_id, status')
        .in('live_class_id', liveClassIds);

      if (attendanceError) {
        console.error('Failed to load institution attendance:', attendanceError);
        return NextResponse.json({ error: 'Failed to load institution attendance.' }, { status: 500 });
      }
      attendanceRows = (attendanceData ?? []) as SupabaseRow[];
    }
  }

  const membershipsByBatch = new Map<string, SupabaseRow[]>();
  for (const membership of membershipRows) {
    const batchId = String(membership.batch_id ?? '');
    const existing = membershipsByBatch.get(batchId) ?? [];
    existing.push(membership);
    membershipsByBatch.set(batchId, existing);
  }

  const classBatchMap = new Map<string, string>();
  for (const liveClass of liveClassRows) {
    classBatchMap.set(String(liveClass.id), String(liveClass.batch_id ?? ''));
  }

  const attendanceByStudent = new Map<string, { present: number; total: number }>();
  const attendanceByBatch = new Map<string, { present: number; total: number }>();

  for (const record of attendanceRows) {
    const studentId = String(record.student_id ?? '');
    const batchId = classBatchMap.get(String(record.live_class_id ?? ''));
    if (!batchId) continue;

    const attended = record.status === 'present' || record.status === 'late';
    if (studentId) {
      const studentAttendance = attendanceByStudent.get(studentId) ?? { present: 0, total: 0 };
      studentAttendance.total += 1;
      if (attended) studentAttendance.present += 1;
      attendanceByStudent.set(studentId, studentAttendance);
    }

    const batchAttendance = attendanceByBatch.get(batchId) ?? { present: 0, total: 0 };
    batchAttendance.total += 1;
    if (attended) batchAttendance.present += 1;
    attendanceByBatch.set(batchId, batchAttendance);
  }

  const batches: InstitutionBatch[] = batchRows.map((batch) => {
    const batchId = String(batch.id);
    const programme = one<SupabaseRow>(batch.programme);
    const branch = one<SupabaseRow>(batch.branch);
    const batchAttendance = attendanceByBatch.get(batchId) ?? { present: 0, total: 0 };
    const startDate = String(batch.start_date ?? '');
    const endDate = String(batch.end_date ?? '');
    const status = String(batch.status ?? 'active');

    return {
      id: batchId,
      name: String(batch.name ?? 'Untitled batch'),
      grade: batch.grade ? String(batch.grade) : null,
      status,
      startDate,
      endDate,
      branchId: String(batch.branch_id ?? ''),
      branchName: branch?.name ? String(branch.name) : 'Unknown branch',
      programmeName: programme?.name ? String(programme.name) : 'Programme not set',
      programmeCode: programme?.code ? String(programme.code) : '',
      teachers: Array.isArray(batch.teacher_names) ? batch.teacher_names.map((teacher: unknown) => String(teacher)) : [],
      studentCount: membershipsByBatch.get(batchId)?.length ?? 0,
      attendanceRate: percentage(batchAttendance.present, batchAttendance.total),
      completionRate: completionRate(startDate, endDate, status),
    };
  });

  const students: InstitutionStudent[] = membershipRows.map((membership): InstitutionStudent => {
    const student = one<SupabaseRow>(membership.student);
    const batch = one<SupabaseRow>(membership.batch);
    const studentId = String(membership.student_id ?? '');
    const studentAttendance = attendanceByStudent.get(studentId) ?? { present: 0, total: 0 };
    const rate = percentage(studentAttendance.present, studentAttendance.total);

    return {
      id: String(membership.id ?? `${studentId}-${membership.batch_id}`),
      studentId,
      name: student?.full_name ? String(student.full_name) : student?.email ? String(student.email) : 'Unknown learner',
      email: student?.email ? String(student.email) : '',
      phone: student?.phone ? String(student.phone) : null,
      accountStatus: student?.status ? String(student.status) : 'active',
      batchId: String(membership.batch_id ?? ''),
      batchName: batch?.name ? String(batch.name) : 'Unknown batch',
      grade: batch?.grade ? String(batch.grade) : null,
      attendanceRate: rate,
      attendancePresent: studentAttendance.present,
      attendanceTotal: studentAttendance.total,
      pacingHealth: rate == null ? 'No attendance' : rate >= 90 ? 'Stable' : rate >= 75 ? 'Watch' : 'Intervention',
      flag: rate == null ? 'Active' : rate >= 90 ? 'Active' : rate >= 75 ? 'Warning' : 'Critical',
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const liveClasses: InstitutionLiveClass[] = liveClassRows.map((liveClass) => {
    const teacher = one<SupabaseRow>(liveClass.teacher);
    const subject = one<SupabaseRow>(liveClass.subject);
    const batch = one<SupabaseRow>(liveClass.batch);

    return {
      id: String(liveClass.id),
      title: String(liveClass.title ?? 'Untitled class'),
      meetUrl: String(liveClass.meet_url ?? ''),
      scheduledStart: String(liveClass.scheduled_start ?? ''),
      scheduledEnd: String(liveClass.scheduled_end ?? ''),
      status: String(liveClass.status ?? 'scheduled'),
      isLive: Boolean(liveClass.is_live),
      batchId: String(liveClass.batch_id ?? ''),
      batchName: batch?.name ? String(batch.name) : 'Unknown batch',
      subjectName: subject?.name ? String(subject.name) : 'General',
      teacherName: teacher?.full_name ? String(teacher.full_name) : null,
    };
  });

  const teacherAssignments: InstitutionTeacherAssignment[] = teacherAssignmentRows.map((assignment) => {
    const teacher = one<SupabaseRow>(assignment.teacher);
    const subject = one<SupabaseRow>(assignment.subject);
    const batch = one<SupabaseRow>(assignment.batch);

    return {
      id: String(assignment.id),
      teacherId: String(assignment.teacher_id ?? ''),
      teacherName: teacher?.full_name ? String(teacher.full_name) : 'Unassigned teacher',
      teacherEmail: teacher?.email ? String(teacher.email) : '',
      batchId: String(assignment.batch_id ?? ''),
      batchName: batch?.name ? String(batch.name) : 'Unknown batch',
      subjectName: subject?.name ? String(subject.name) : 'Subject not set',
    };
  }).sort((a, b) => a.teacherName.localeCompare(b.teacherName));

  const reportBatches: InstitutionReportBatch[] = batches.map((batch) => {
    const batchAttendance = attendanceByBatch.get(batch.id) ?? { present: 0, total: 0 };
    const classCount = liveClassRows.filter((liveClass) => String(liveClass.batch_id) === batch.id).length;

    return {
      batchId: batch.id,
      batchName: batch.name,
      status: batch.status,
      grade: batch.grade,
      programmeName: batch.programmeName,
      studentCount: batch.studentCount,
      classCount,
      attendanceRate: percentage(batchAttendance.present, batchAttendance.total),
      completionRate: batch.completionRate,
    };
  });

  const totalPresent = attendanceRows.filter((record) => record.status === 'present' || record.status === 'late').length;
  const totalAttendance = attendanceRows.length;
  const uniqueStudentIds = new Set(membershipRows.map((membership) => String(membership.student_id ?? '')).filter(Boolean));

  const reports = {
    totalStudents: uniqueStudentIds.size,
    totalBatches: batches.length,
    activeBatches: batches.filter((batch) => batch.status === 'active').length,
    totalBranches: branches.length,
    totalClasses: liveClasses.length,
    attendanceRate: percentage(totalPresent, totalAttendance),
    attendancePresent: totalPresent,
    attendanceTotal: totalAttendance,
    batches: reportBatches,
  };

  const alerts: InstitutionAlert[] = [];
  const alertedStudents = new Set<string>();

  for (const student of students) {
    if (student.attendanceRate == null || student.attendanceRate >= 75 || alertedStudents.has(student.studentId)) {
      continue;
    }
    alertedStudents.add(student.studentId);
    alerts.push({
      id: `student-${student.studentId}`,
      title: `${student.name} — low attendance`,
      description: `${Math.round(student.attendanceRate)}% attendance across ${student.attendanceTotal} recorded classes in ${student.batchName}.`,
      severity: student.attendanceRate < 60 ? 'high' : 'medium',
      studentId: student.studentId,
      batchId: student.batchId,
    });
  }

  for (const batch of reportBatches) {
    if (batch.attendanceRate == null || batch.attendanceRate >= 75 || batch.classCount === 0) continue;
    alerts.push({
      id: `batch-${batch.batchId}`,
      title: `${batch.batchName} — attendance needs attention`,
      description: `Batch attendance is ${Math.round(batch.attendanceRate)}% across ${batch.classCount} scheduled classes.`,
      severity: batch.attendanceRate < 60 ? 'high' : 'medium',
      batchId: batch.batchId,
    });
  }

  alerts.sort((a, b) => severityRank(a.severity) - severityRank(b.severity));

  const payload: InstitutionDashboardData = {
    viewer,
    institution,
    batches,
    students,
    liveClasses,
    teacherAssignments,
    reports,
    alerts,
    generatedAt: new Date().toISOString(),
  };

  return NextResponse.json(payload);
}
