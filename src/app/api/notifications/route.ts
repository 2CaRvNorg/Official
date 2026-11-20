import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getNotificationsForRole } from '@/lib/notifications';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 403 });
  }

  return NextResponse.json({
    notifications: getNotificationsForRole(profile.role),
  });
}
