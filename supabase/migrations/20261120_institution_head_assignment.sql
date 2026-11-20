-- ==============================================================================
-- Institution Head Assignment & Tenant Isolation
-- Adds institutions.head_user_id, helper functions, RLS policies and a scoped
-- reporting view for institution heads.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Link an institution to exactly one institution head profile.
--    public.profiles is the public mirror of auth.users and already has the
--    ON DELETE CASCADE relationship to auth.users.
-- ------------------------------------------------------------------------------
ALTER TABLE public.institutions
  ADD COLUMN IF NOT EXISTS head_user_id UUID
  REFERENCES public.profiles(id) ON DELETE SET NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'institutions_head_user_id_key'
      AND conrelid = 'public.institutions'::regclass
  ) THEN
    ALTER TABLE public.institutions
      ADD CONSTRAINT institutions_head_user_id_key UNIQUE (head_user_id);
  END IF;
END $$;

-- ------------------------------------------------------------------------------
-- 2. Tenant helper functions
--    SECURITY DEFINER prevents RLS recursion while every helper is still
--    anchored to auth.uid().
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_institution_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT i.id
  FROM public.institutions i
  WHERE i.head_user_id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.institution_owns_branch(target_branch_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.branches b
    WHERE b.id = target_branch_id
      AND b.institution_id = public.current_institution_id()
  );
$$;

CREATE OR REPLACE FUNCTION public.institution_owns_batch(target_batch_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.batches b
    JOIN public.branches br ON br.id = b.branch_id
    WHERE b.id = target_batch_id
      AND br.institution_id = public.current_institution_id()
  );
$$;

CREATE OR REPLACE FUNCTION public.institution_owns_live_class(target_live_class_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.live_classes lc
    JOIN public.batches b ON b.id = lc.batch_id
    JOIN public.branches br ON br.id = b.branch_id
    WHERE lc.id = target_live_class_id
      AND br.institution_id = public.current_institution_id()
  );
$$;

CREATE OR REPLACE FUNCTION public.institution_owns_assessment(target_assessment_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.assessments a
    JOIN public.batches b ON b.id = a.batch_id
    JOIN public.branches br ON br.id = b.branch_id
    WHERE a.id = target_assessment_id
      AND br.institution_id = public.current_institution_id()
  );
$$;

CREATE OR REPLACE FUNCTION public.institution_owns_student(target_student_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.student_batch_memberships m
    JOIN public.batches b ON b.id = m.batch_id
    JOIN public.branches br ON br.id = b.branch_id
    WHERE m.student_id = target_student_id
      AND m.status = 'active'
      AND br.institution_id = public.current_institution_id()
  );
$$;

CREATE OR REPLACE FUNCTION public.institution_owns_teacher(target_teacher_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.teacher_assignments ta
    JOIN public.batches b ON b.id = ta.batch_id
    JOIN public.branches br ON br.id = b.branch_id
    WHERE ta.teacher_id = target_teacher_id
      AND br.institution_id = public.current_institution_id()
  );
$$;

REVOKE ALL ON FUNCTION public.current_institution_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.institution_owns_branch(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.institution_owns_batch(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.institution_owns_live_class(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.institution_owns_assessment(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.institution_owns_student(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.institution_owns_teacher(UUID) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.current_institution_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.institution_owns_branch(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.institution_owns_batch(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.institution_owns_live_class(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.institution_owns_assessment(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.institution_owns_student(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.institution_owns_teacher(UUID) TO authenticated;

-- ------------------------------------------------------------------------------
-- 3. Admin full access
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins manage institutions" ON public.institutions;
CREATE POLICY "Admins manage institutions"
  ON public.institutions FOR ALL TO authenticated
  USING (public.get_current_role() = 'admin')
  WITH CHECK (public.get_current_role() = 'admin');

DROP POLICY IF EXISTS "Admins manage branches" ON public.branches;
CREATE POLICY "Admins manage branches"
  ON public.branches FOR ALL TO authenticated
  USING (public.get_current_role() = 'admin')
  WITH CHECK (public.get_current_role() = 'admin');

DROP POLICY IF EXISTS "Admins manage batches" ON public.batches;
CREATE POLICY "Admins manage batches"
  ON public.batches FOR ALL TO authenticated
  USING (public.get_current_role() = 'admin')
  WITH CHECK (public.get_current_role() = 'admin');

DROP POLICY IF EXISTS "Admins manage student memberships" ON public.student_batch_memberships;
CREATE POLICY "Admins manage student memberships"
  ON public.student_batch_memberships FOR ALL TO authenticated
  USING (public.get_current_role() = 'admin')
  WITH CHECK (public.get_current_role() = 'admin');

DROP POLICY IF EXISTS "Admins manage teacher assignments" ON public.teacher_assignments;
CREATE POLICY "Admins manage teacher assignments"
  ON public.teacher_assignments FOR ALL TO authenticated
  USING (public.get_current_role() = 'admin')
  WITH CHECK (public.get_current_role() = 'admin');

DROP POLICY IF EXISTS "Admins manage attendance records" ON public.attendance_records;
CREATE POLICY "Admins manage attendance records"
  ON public.attendance_records FOR ALL TO authenticated
  USING (public.get_current_role() = 'admin')
  WITH CHECK (public.get_current_role() = 'admin');

DROP POLICY IF EXISTS "Admins manage assessments" ON public.assessments;
CREATE POLICY "Admins manage assessments"
  ON public.assessments FOR ALL TO authenticated
  USING (public.get_current_role() = 'admin')
  WITH CHECK (public.get_current_role() = 'admin');

DROP POLICY IF EXISTS "Admins manage submissions" ON public.submissions;
CREATE POLICY "Admins manage submissions"
  ON public.submissions FOR ALL TO authenticated
  USING (public.get_current_role() = 'admin')
  WITH CHECK (public.get_current_role() = 'admin');

DROP POLICY IF EXISTS "Admins manage programmes" ON public.programmes;
CREATE POLICY "Admins manage programmes"
  ON public.programmes FOR ALL TO authenticated
  USING (public.get_current_role() = 'admin')
  WITH CHECK (public.get_current_role() = 'admin');

DROP POLICY IF EXISTS "Admins manage subjects" ON public.subjects;
CREATE POLICY "Admins manage subjects"
  ON public.subjects FOR ALL TO authenticated
  USING (public.get_current_role() = 'admin')
  WITH CHECK (public.get_current_role() = 'admin');

-- ------------------------------------------------------------------------------
-- 4. Institution head read-only tenant policies
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Institution heads can view their institution" ON public.institutions;
CREATE POLICY "Institution heads can view their institution"
  ON public.institutions FOR SELECT TO authenticated
  USING (
    public.get_current_role() = 'institution_head'
    AND head_user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Institution heads can view their branches" ON public.branches;
CREATE POLICY "Institution heads can view their branches"
  ON public.branches FOR SELECT TO authenticated
  USING (
    public.get_current_role() = 'institution_head'
    AND institution_id = public.current_institution_id()
  );

DROP POLICY IF EXISTS "Institution heads can view their batches" ON public.batches;
CREATE POLICY "Institution heads can view their batches"
  ON public.batches FOR SELECT TO authenticated
  USING (
    public.get_current_role() = 'institution_head'
    AND public.institution_owns_batch(id)
  );

DROP POLICY IF EXISTS "Institution heads can view their student memberships" ON public.student_batch_memberships;
CREATE POLICY "Institution heads can view their student memberships"
  ON public.student_batch_memberships FOR SELECT TO authenticated
  USING (
    public.get_current_role() = 'institution_head'
    AND public.institution_owns_batch(batch_id)
  );

DROP POLICY IF EXISTS "Institution heads can view their students and teachers" ON public.profiles;
CREATE POLICY "Institution heads can view their students and teachers"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    public.get_current_role() = 'institution_head'
    AND (
      (role = 'student' AND public.institution_owns_student(id))
      OR (role = 'teacher' AND public.institution_owns_teacher(id))
    )
  );

DROP POLICY IF EXISTS "Institution heads can view their teacher assignments" ON public.teacher_assignments;
CREATE POLICY "Institution heads can view their teacher assignments"
  ON public.teacher_assignments FOR SELECT TO authenticated
  USING (
    public.get_current_role() = 'institution_head'
    AND public.institution_owns_batch(batch_id)
  );

DROP POLICY IF EXISTS "Institution heads can view their live classes" ON public.live_classes;
CREATE POLICY "Institution heads can view their live classes"
  ON public.live_classes FOR SELECT TO authenticated
  USING (
    public.get_current_role() = 'institution_head'
    AND public.institution_owns_batch(batch_id)
  );

DROP POLICY IF EXISTS "Institution heads can view their attendance" ON public.attendance_records;
CREATE POLICY "Institution heads can view their attendance"
  ON public.attendance_records FOR SELECT TO authenticated
  USING (
    public.get_current_role() = 'institution_head'
    AND public.institution_owns_live_class(live_class_id)
  );

DROP POLICY IF EXISTS "Institution heads can view their assessments" ON public.assessments;
CREATE POLICY "Institution heads can view their assessments"
  ON public.assessments FOR SELECT TO authenticated
  USING (
    public.get_current_role() = 'institution_head'
    AND public.institution_owns_batch(batch_id)
  );

DROP POLICY IF EXISTS "Institution heads can view their submissions" ON public.submissions;
CREATE POLICY "Institution heads can view their submissions"
  ON public.submissions FOR SELECT TO authenticated
  USING (
    public.get_current_role() = 'institution_head'
    AND public.institution_owns_assessment(assessment_id)
  );

DROP POLICY IF EXISTS "Institution heads can view programmes" ON public.programmes;
CREATE POLICY "Institution heads can view programmes"
  ON public.programmes FOR SELECT TO authenticated
  USING (public.get_current_role() = 'institution_head');

DROP POLICY IF EXISTS "Institution heads can view subjects" ON public.subjects;
CREATE POLICY "Institution heads can view subjects"
  ON public.subjects FOR SELECT TO authenticated
  USING (public.get_current_role() = 'institution_head');

-- ------------------------------------------------------------------------------
-- 5. Scoped reporting view
--    security_invoker makes the view honour the RLS policies above. This gives
--    institution heads a real, tenant-isolated reporting source without
--    exposing another institution's records.
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.institution_reports AS
WITH student_counts AS (
  SELECT
    m.batch_id,
    COUNT(*) FILTER (WHERE m.status = 'active') AS student_count
  FROM public.student_batch_memberships m
  GROUP BY m.batch_id
),
class_counts AS (
  SELECT
    lc.batch_id,
    COUNT(*) AS class_count
  FROM public.live_classes lc
  GROUP BY lc.batch_id
),
attendance_counts AS (
  SELECT
    lc.batch_id,
    COUNT(ar.id) AS attendance_total,
    COUNT(ar.id) FILTER (WHERE ar.status IN ('present', 'late')) AS attendance_present,
    COUNT(ar.id) FILTER (WHERE ar.status = 'absent') AS attendance_absent
  FROM public.live_classes lc
  LEFT JOIN public.attendance_records ar ON ar.live_class_id = lc.id
  GROUP BY lc.batch_id
)
SELECT
  i.id AS institution_id,
  i.name AS institution_name,
  b.id AS batch_id,
  b.name AS batch_name,
  b.grade,
  b.status AS batch_status,
  b.start_date,
  b.end_date,
  p.name AS programme_name,
  p.code AS programme_code,
  COALESCE(sc.student_count, 0) AS student_count,
  COALESCE(cc.class_count, 0) AS class_count,
  COALESCE(ac.attendance_total, 0) AS attendance_total,
  COALESCE(ac.attendance_present, 0) AS attendance_present,
  COALESCE(ac.attendance_absent, 0) AS attendance_absent,
  CASE
    WHEN COALESCE(ac.attendance_total, 0) > 0
      THEN ROUND(100.0 * ac.attendance_present / ac.attendance_total, 2)
    ELSE NULL
  END AS attendance_rate
FROM public.institutions i
JOIN public.branches br ON br.institution_id = i.id
JOIN public.batches b ON b.branch_id = br.id
LEFT JOIN public.programmes p ON p.id = b.programme_id
LEFT JOIN student_counts sc ON sc.batch_id = b.id
LEFT JOIN class_counts cc ON cc.batch_id = b.id
LEFT JOIN attendance_counts ac ON ac.batch_id = b.id;

ALTER VIEW public.institution_reports SET (security_invoker = true);

REVOKE ALL ON public.institution_reports FROM anon, authenticated;
GRANT SELECT ON public.institution_reports TO authenticated;
