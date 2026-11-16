CREATE TABLE public.student_course_bundles (
  student_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  elective_course TEXT NOT NULL CHECK (elective_course IN ('design', 'tech')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.student_course_bundles ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.student_course_bundles FROM anon, authenticated;
GRANT SELECT ON TABLE public.student_course_bundles TO authenticated;
GRANT ALL ON TABLE public.student_course_bundles TO service_role;

CREATE POLICY "Students can view their own course bundle"
  ON public.student_course_bundles FOR SELECT TO authenticated
  USING (
    student_id = auth.uid()
    AND public.get_current_role() = 'student'
  );

CREATE POLICY "Admins can view all course bundles"
  ON public.student_course_bundles FOR SELECT TO authenticated
  USING (public.get_current_role() = 'admin');

CREATE POLICY "Students can view mandatory and enrolled subjects"
  ON public.subjects FOR SELECT TO authenticated
  USING (
    public.get_current_role() = 'student'
    AND EXISTS (
      SELECT 1
      FROM public.student_course_bundles bundle
      WHERE bundle.student_id = auth.uid()
        AND (
          subjects.code = 'COMM-101'
          OR (subjects.code = 'DSG-101' AND bundle.elective_course = 'design')
          OR (subjects.code = 'TECH-101' AND bundle.elective_course = 'tech')
        )
    )
  );

CREATE POLICY "Students can view lessons for enrolled courses"
  ON public.lessons FOR SELECT TO authenticated
  USING (
    public.get_current_role() = 'student'
    AND status = 'published'
    AND (batch_id IS NULL OR EXISTS (
      SELECT 1
      FROM public.student_batch_memberships membership
      WHERE membership.student_id = auth.uid()
        AND membership.batch_id = lessons.batch_id
        AND membership.status = 'active'
    ))
    AND EXISTS (
      SELECT 1
      FROM public.subjects subject
      JOIN public.student_course_bundles bundle
        ON bundle.student_id = auth.uid()
      WHERE subject.id = lessons.subject_id
        AND (
          subject.code = 'COMM-101'
          OR (subject.code = 'DSG-101' AND bundle.elective_course = 'design')
          OR (subject.code = 'TECH-101' AND bundle.elective_course = 'tech')
        )
    )
  );

DROP POLICY IF EXISTS "Students can view live classes of their enrolled batches"
  ON public.live_classes;

CREATE POLICY "Students can view live classes for enrolled courses"
  ON public.live_classes FOR SELECT TO authenticated
  USING (
    public.get_current_role() = 'student'
    AND EXISTS (
      SELECT 1
      FROM public.student_batch_memberships membership
      WHERE membership.student_id = auth.uid()
        AND membership.batch_id = live_classes.batch_id
        AND membership.status = 'active'
    )
    AND EXISTS (
      SELECT 1
      FROM public.subjects subject
      JOIN public.student_course_bundles bundle
        ON bundle.student_id = auth.uid()
      WHERE subject.id = live_classes.subject_id
        AND (
          subject.code = 'COMM-101'
          OR (subject.code = 'DSG-101' AND bundle.elective_course = 'design')
          OR (subject.code = 'TECH-101' AND bundle.elective_course = 'tech')
        )
    )
  );

CREATE POLICY "Students can view assessments for enrolled courses"
  ON public.assessments FOR SELECT TO authenticated
  USING (
    public.get_current_role() = 'student'
    AND EXISTS (
      SELECT 1
      FROM public.student_batch_memberships membership
      WHERE membership.student_id = auth.uid()
        AND membership.batch_id = assessments.batch_id
        AND membership.status = 'active'
    )
    AND EXISTS (
      SELECT 1
      FROM public.subjects subject
      JOIN public.student_course_bundles bundle
        ON bundle.student_id = auth.uid()
      WHERE subject.id = assessments.subject_id
        AND (
          subject.code = 'COMM-101'
          OR (subject.code = 'DSG-101' AND bundle.elective_course = 'design')
          OR (subject.code = 'TECH-101' AND bundle.elective_course = 'tech')
        )
    )
  );
