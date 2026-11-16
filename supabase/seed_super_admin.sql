-- ==============================================================================
-- 2Carvn Academy - Super Admin Setup
-- Run after the Supabase migrations have been applied.
-- Create the Auth user in Supabase Dashboard or via a trusted server first.
-- Use a unique temporary password and change it immediately after first login.
-- ==============================================================================

DO $$
BEGIN
  IF to_regclass('public.profiles') IS NULL THEN
    RAISE EXCEPTION 'public.profiles does not exist. Apply the Supabase schema migrations first.';
  END IF;

  IF to_regtype('public.user_role') IS NULL THEN
    RAISE EXCEPTION 'public.user_role does not exist. Apply the Supabase schema migrations first.';
  END IF;
END $$;

DO $$
DECLARE
  admin_row RECORD;
BEGIN
  SELECT id, email
  INTO admin_row
  FROM auth.users
  WHERE lower(email) = lower('admin@2carvn.academy');

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Create and confirm admin@2carvn.academy through Supabase Auth before running this script.';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, force_password_change, status)
  VALUES (
    admin_row.id,
    admin_row.email,
    'Super Admin',
    'admin'::public.user_role,
    TRUE,
    'active'
  )
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin'::public.user_role,
      full_name = 'Super Admin',
      force_password_change = TRUE,
      status = 'active';

  DELETE FROM public.learner_gamification WHERE student_id = admin_row.id;

  RAISE NOTICE 'Super Admin configured for % (id: %)', admin_row.email, admin_row.id;
END $$;

CREATE OR REPLACE FUNCTION public.promote_to_super_admin(target_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_id UUID;
BEGIN
  IF COALESCE(auth.role(), '') <> 'service_role'
    AND NOT EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'admin'
        AND status = 'active'
    )
  THEN
    RAISE EXCEPTION 'Active administrator access is required.'
      USING ERRCODE = '42501';
  END IF;

  SELECT id
  INTO target_id
  FROM auth.users
  WHERE lower(email) = lower(target_email);

  IF target_id IS NULL THEN
    RETURN 'Error: user not found in auth.users.';
  END IF;

  UPDATE public.profiles
  SET role = 'admin'::public.user_role,
      force_password_change = TRUE,
      status = 'active'
  WHERE id = target_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'The target user does not have a profile.'
      USING ERRCODE = 'P0002';
  END IF;

  RETURN 'Success: ' || target_email || ' is now an administrator.';
END;
$$;

REVOKE ALL ON FUNCTION public.promote_to_super_admin(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.promote_to_super_admin(TEXT) TO authenticated, service_role;
