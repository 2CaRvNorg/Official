CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
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

DROP TRIGGER IF EXISTS prevent_profile_privilege_changes ON public.profiles;
CREATE TRIGGER prevent_profile_privilege_changes
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_profile_privilege_changes();
