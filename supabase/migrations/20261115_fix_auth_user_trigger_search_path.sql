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
