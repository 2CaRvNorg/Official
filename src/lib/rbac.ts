export type UserRole =
  | 'admin'
  | 'institution_head'
  | 'teacher'
  | 'student'
  | 'money_management';

export const ROLE_HOME: Record<UserRole, string> = {
  admin: '/dashboard/admin',
  institution_head: '/dashboard/institution',
  teacher: '/dashboard/teacher',
  student: '/dashboard/student',
  money_management: '/dashboard/admin/finance',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  institution_head: 'Institution Head',
  teacher: 'Teacher',
  student: 'Student',
  money_management: 'Money Management',
};

/**
 * Every authenticated role has its own profile route. The shared
 * `/dashboard/profile` route remains available as a safe fallback.
 */
export const ROLE_PROFILE_HOME: Record<UserRole, string> = {
  admin: '/dashboard/admin/profile',
  institution_head: '/dashboard/institution/profile',
  teacher: '/dashboard/teacher/profile',
  student: '/dashboard/student/profile',
  money_management: '/dashboard/admin/finance/profile',
};

/** Routes that are available to every signed-in role. */
export const SHARED_ROUTES = [
  '/dashboard/profile',
  '/dashboard/notifications',
  '/change-password',
] as const;

/**
 * Money Management is deliberately scoped to the finance ledger, financial
 * reports and the audit trail. It does not get academy administration routes
 * such as Users, Institutions, Classes or Settings.
 */
const MONEY_MANAGEMENT_ROUTES = [
  '/dashboard/admin/finance',
  '/dashboard/admin/reports',
  '/dashboard/admin/security',
] as const;

export function normalizeRole(role: string | null | undefined): UserRole | null {
  if (!role) return null;
  return role in ROLE_HOME ? (role as UserRole) : null;
}

export function isPathWithin(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function getRoleHome(role: string | null | undefined): string | null {
  const normalized = normalizeRole(role);
  return normalized ? ROLE_HOME[normalized] : null;
}

export function getProfileHref(role: string | null | undefined): string {
  const normalized = normalizeRole(role);
  return normalized ? ROLE_PROFILE_HOME[normalized] : '/dashboard/profile';
}

/**
 * Best-effort profile link when the role has not loaded yet (for example while
 * the Supabase profile request is in flight). The longest matching dashboard
 * section wins so `/dashboard/admin/finance` resolves to the finance profile.
 */
export function getProfileHrefFromPathname(pathname: string): string {
  const sections: Array<{ prefix: string; href: string }> = [
    { prefix: '/dashboard/admin/finance', href: ROLE_PROFILE_HOME.money_management },
    { prefix: '/dashboard/admin', href: ROLE_PROFILE_HOME.admin },
    { prefix: '/dashboard/institution', href: ROLE_PROFILE_HOME.institution_head },
    { prefix: '/dashboard/teacher', href: ROLE_PROFILE_HOME.teacher },
    { prefix: '/dashboard/student', href: ROLE_PROFILE_HOME.student },
  ];

  const match = sections.find(({ prefix }) => isPathWithin(pathname, prefix));
  return match?.href ?? '/dashboard/profile';
}

export function canAccessPath(role: string | null | undefined, pathname: string): boolean {
  const normalized = normalizeRole(role);
  if (!normalized) return false;

  if (SHARED_ROUTES.some((route) => isPathWithin(pathname, route))) {
    return true;
  }

  if (isPathWithin(pathname, ROLE_PROFILE_HOME[normalized])) {
    return true;
  }

  if (normalized === 'money_management') {
    return MONEY_MANAGEMENT_ROUTES.some((route) => isPathWithin(pathname, route));
  }

  return isPathWithin(pathname, ROLE_HOME[normalized]);
}
