import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStudentCourseBundle, isElectiveCourse } from '@/lib/student-courses';

export async function GET() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, status')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('Failed to verify student course access:', profileError);
    return NextResponse.json({ error: 'Unable to verify course access.' }, { status: 500 });
  }

  if (profile?.role !== 'student' || profile.status !== 'active') {
    return NextResponse.json({ error: 'Active student access is required.' }, { status: 403 });
  }

  const { data: bundle, error: bundleError } = await supabase
    .from('student_course_bundles')
    .select('elective_course')
    .eq('student_id', user.id)
    .maybeSingle();

  if (bundleError) {
    console.error('Failed to load student course bundle:', bundleError);
    return NextResponse.json({ error: 'Unable to load your course access.' }, { status: 500 });
  }

  if (!bundle || !isElectiveCourse(bundle.elective_course)) {
    return NextResponse.json({ error: 'Your course bundle has not been assigned. Contact an administrator.' }, { status: 403 });
  }

  return NextResponse.json({ courses: getStudentCourseBundle(bundle.elective_course) });
}
