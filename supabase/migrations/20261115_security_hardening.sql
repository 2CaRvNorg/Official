CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role
  FROM public.profiles
  WHERE id = auth.uid()
    AND status = 'active';
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  assigned_role public.user_role := 'student';
  trusted_role TEXT := NEW.raw_app_meta_data->>'role';
BEGIN
  IF trusted_role IN ('institution_head', 'teacher', 'student', 'money_management') THEN
    assigned_role := trusted_role::public.user_role;
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role, force_password_change)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    assigned_role,
    TRUE
  )
  ON CONFLICT (id) DO UPDATE
  SET role = EXCLUDED.role,
      full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);

  IF assigned_role = 'student' THEN
    INSERT INTO public.learner_gamification (student_id)
    VALUES (NEW.id)
    ON CONFLICT (student_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() = OLD.id
    AND public.get_current_role() IS DISTINCT FROM 'admin'
    AND (
      NEW.role IS DISTINCT FROM OLD.role
      OR NEW.status IS DISTINCT FROM OLD.status
    )
  THEN
    RAISE EXCEPTION 'Users cannot change their own role or account status'
      USING ERRCODE = '42501';
  END IF;

  RETURN NEW;
END;
$$;

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

  DELETE FROM public.learner_gamification WHERE student_id = target_id;

  RETURN 'Success: ' || target_email || ' is now an administrator.';
END;
$$;

REVOKE ALL ON FUNCTION public.promote_to_super_admin(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.promote_to_super_admin(TEXT) TO authenticated, service_role;

UPDATE public.profiles
SET force_password_change = TRUE
WHERE lower(email) = lower('admin@2carvn.academy')
  AND role = 'admin';
