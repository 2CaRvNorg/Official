'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { createClient } from '@/lib/supabase/client';
import {
  canAccessPath,
  getProfileHref,
  getProfileHrefFromPathname,
} from '@/lib/rbac';

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  hasChevron?: boolean;
}

interface SidebarProps {
  navItems: NavItem[];
  userName: string;
  userRole: string;
  avatarInitials: string;
}

export default function Sidebar({ navItems, userName, userRole, avatarInitials }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; role: string } | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const notificationsHref = '/dashboard/notifications';
  const profileHref = profile ? getProfileHref(profile.role) : getProfileHrefFromPathname(pathname);

  // Hide sections the signed-in role is not allowed to open. This keeps the
  // Money Management sidebar focused on finance, reports and audit while still
  // exposing the shared Notifications and Profile routes to every role.
  const roleNavItems = profile
    ? navItems.filter((item) => canAccessPath(profile.role, item.href))
    : navItems;

  const navItemsWithSharedRoutes: NavItem[] = roleNavItems.map((item) =>
    item.href === '/dashboard/profile' ? { ...item, href: profileHref } : item
  );

  if (!navItemsWithSharedRoutes.some((item) => item.href === notificationsHref)) {
    navItemsWithSharedRoutes.push({
      label: 'Notifications',
      href: notificationsHref,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    });
  }

  if (!navItemsWithSharedRoutes.some((item) => item.href === profileHref)) {
    navItemsWithSharedRoutes.push({
      label: 'Profile',
      href: profileHref,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M5 21a7 7 0 0 1 14 0" />
        </svg>
      ),
    });
  }

  const sidebarNavItems = navItemsWithSharedRoutes;

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        if (active) setProfileError('Unable to load account profile.');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, role')
        .eq('id', user.id)
        .single();

      if (!active) return;
      if (error || !data) {
        setProfileError('Unable to load account profile.');
        return;
      }
      setProfile(data);
    };

    void loadProfile();
    return () => { active = false; };
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setSignOutError(null);
    try {
      const { error } = await createClient().auth.signOut();
      if (error) throw error;
      router.replace('/login');
      router.refresh();
    } catch (error) {
      setSignOutError(error instanceof Error ? error.message : 'Unable to sign out.');
    } finally {
      setIsSigningOut(false);
    }
  };
  const displayName = profileError ? 'Profile unavailable' : profile?.full_name || userName;
  const roleLabels: Record<string, string> = {
    admin: 'Administrator',
    institution_head: 'Institution Head',
    teacher: 'Teacher',
    student: 'Student',
    money_management: 'Money Management',
  };
  const displayRole = profileError ? 'Account details unavailable' : profile ? roleLabels[profile.role] || profile.role : userRole;
  const displayInitials = profile?.full_name
    ? profile.full_name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()
    : avatarInitials;

  // Match the most specific route so a nested page (for example
  // /dashboard/admin/finance/profile) does not also highlight its parent.
  const activeHref = sidebarNavItems
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col fixed top-0 left-0 h-screen z-40 transition-all duration-300"
        style={{
          width: collapsed ? 76 : 230,
          background: '#0D0D0D',
          borderRight: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Brand Header */}
        <div
          className="flex items-center justify-between px-4 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/2carvn-mark.png"
              alt="2Carvn Academy"
              width={40}
              height={40}
              className="flex-shrink-0 h-10 w-10 object-contain drop-shadow-[0_0_10px_rgba(212,168,67,0.2)]"
            />
            {!collapsed && (
              <div>
                <span className="block font-bold text-white text-base tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  2CARVN
                </span>
                <span className="block text-[10px] text-[#A0A0A0] tracking-wider uppercase">
                  A Way for Creativity
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {collapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
            </svg>
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {sidebarNavItems.map((item) => {
            const isActive = activeHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'font-semibold shadow-md'
                    : 'text-[#9A9A9A] hover:text-white hover:bg-white/5'
                )}
                style={
                  isActive
                    ? {
                        background: '#D4A843',
                        color: '#0D0D0D',
                      }
                    : {}
                }
                title={collapsed ? item.label : undefined}
              >
                <span
                  className="flex-shrink-0"
                  style={{ color: isActive ? '#0D0D0D' : 'rgba(255,255,255,0.5)' }}
                >
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="flex-1 truncate" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {item.label}
                  </span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      background: isActive ? '#0D0D0D' : '#D4A843',
                      color: isActive ? '#D4A843' : '#0D0D0D',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
                {!collapsed && item.hasChevron && !isActive && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Card */}
        <div
          className="p-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {signOutError && <p role="alert" className="mb-2 px-2 text-[11px] text-red-400">{signOutError}</p>}
          <Link
            href={profileHref}
            className="flex w-full items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors text-left"
            aria-label="View profile"
          >
            <div
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-1 ring-[#D4A843]/40"
              style={{
                background: 'linear-gradient(135deg, rgba(212,168,67,0.3) 0%, rgba(212,168,67,0.1) 100%)',
                color: '#D4A843',
                fontFamily: 'Space Grotesk, sans-serif'
              }}
            >
              {displayInitials}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {displayName}
                </p>
                <p className="text-[11px] text-[#777777] truncate">
                  {displayRole}
                </p>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="mt-1 flex w-full items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors text-left text-white/50 disabled:opacity-50"
            aria-label="Sign out"
          >
            <svg className="flex-shrink-0 ml-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5M21 12H9" />
            </svg>
            {!collapsed && <span className="text-[11px]">{isSigningOut ? 'Signing out…' : 'Sign out'}</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 overflow-x-auto"
        style={{
          background: 'rgba(13,13,13,0.95)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        aria-label="Dashboard navigation"
      >
        <div className="flex w-max min-w-full items-center justify-start gap-1 py-2 px-2">
          {sidebarNavItems.map((item) => {
            const isActive = activeHref === item.href;
            return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={clsx(
                'flex min-w-[68px] max-w-[104px] flex-none flex-col items-center gap-1 py-1 px-2 rounded-xl text-[10px] font-medium transition-colors',
                isActive ? 'text-[#D4A843]' : 'text-[#777777]'
              )}
            >
              <span style={{ color: isActive ? '#D4A843' : 'inherit' }}>
                {item.icon}
              </span>
              <span className="w-full truncate text-center">{item.label}</span>
            </Link>
            );
          })}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex min-w-[68px] flex-none flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-medium text-[#777] disabled:opacity-50"
            aria-label="Sign out"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span>{isSigningOut ? 'Signing out' : 'Sign out'}</span>
          </button>
        </div>
      </nav>
      {signOutError && (
        <div role="alert" className="md:hidden fixed bottom-20 left-3 right-3 z-[60] rounded-xl border border-red-500/30 bg-[#141414] p-3 text-xs text-red-400">
          {signOutError}
        </div>
      )}
    </>
  );
}
