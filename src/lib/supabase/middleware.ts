import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ROLE_HOME: Record<string, string> = {
  admin: '/dashboard/admin',
  institution_head: '/dashboard/institution',
  teacher: '/dashboard/teacher',
  student: '/dashboard/student',
  money_management: '/dashboard/admin/finance',
};

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = pathname === '/change-password' || pathname === '/dashboard' || pathname.startsWith('/dashboard/');

  const redirect = (pathname: string) => {
    const redirectResponse = NextResponse.redirect(new URL(pathname, request.url));
    response.cookies.getAll().forEach(cookie => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  };

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder') || supabaseKey.includes('placeholder')) {
    if (isProtectedRoute) {
      return redirect('/login');
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: '', ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value: '', ...options });
      },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser();

  if (isProtectedRoute && (!user || error)) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach(cookie => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  if (isProtectedRoute && user) {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, status, force_password_change')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return redirect('/login');
    }

    if (profile.status !== 'active') {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('Failed to sign out inactive user:', signOutError);
      }
      return redirect('/login');
    }

    const roleHome = ROLE_HOME[String(profile.role)];

    if (!roleHome) {
      return redirect('/login');
    }

    if (pathname === '/change-password') {
      return response;
    }

    if (profile.force_password_change) {
      return redirect('/change-password');
    }

    if (profile.role === 'student' && pathname === '/dashboard/student/courses') {
      const { data: courseBundle, error: courseBundleError } = await supabase
        .from('student_course_bundles')
        .select('student_id')
        .eq('student_id', user.id)
        .maybeSingle();

      if (courseBundleError) {
        console.error('Failed to verify student course access:', courseBundleError);
        return redirect(roleHome);
      }

      if (!courseBundle) {
        return redirect(roleHome);
      }
    }

    if (pathname === '/dashboard') {
      return redirect(roleHome);
    }

    const isAdminFinance = pathname === '/dashboard/admin/finance';
    const isProfileRoute = pathname === '/dashboard/profile';
    const hasRoleAccess =
      isProfileRoute
        ? true
        : profile.role === 'admin'
        ? pathname === '/dashboard/admin' || pathname.startsWith('/dashboard/admin/')
        : profile.role === 'money_management'
        ? isAdminFinance
        : pathname === roleHome || pathname.startsWith(`${roleHome}/`);

    if (!hasRoleAccess) {
      return redirect(roleHome);
    }
  }

  return response;
}
