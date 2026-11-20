'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';
import { createClient } from '@/lib/supabase/client';
import { getNotificationsForRole, type AppNotification, type NotificationCategory } from '@/lib/notifications';
import { getProfileHref, getRoleHome, ROLE_LABELS } from '@/lib/rbac';

const READ_STORAGE_KEY = '2carvn-read-notifications';

const DASHBOARD_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const CATEGORY_STYLES: Record<NotificationCategory, { label: string; color: string; background: string; icon: React.ReactNode }> = {
  finance: {
    label: 'Finance',
    color: '#D4A843',
    background: 'rgba(212,168,67,0.12)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  academic: {
    label: 'Academics',
    color: '#00BCD4',
    background: 'rgba(0,188,212,0.12)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  account: {
    label: 'Account',
    color: '#7C4DFF',
    background: 'rgba(124,77,255,0.12)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  system: {
    label: 'System',
    color: '#4CAF50',
    background: 'rgba(76,175,80,0.12)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
};

interface ProfileSummary {
  full_name: string;
  role: string;
}

export default function NotificationsPage() {
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(READ_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setReadIds(parsed.filter((id): id is string => typeof id === 'string'));
      }
    } catch {
      // Ignore malformed local storage and start with a clean read state.
    }
  }, []);

  useEffect(() => {
    let active = true;

    const loadNotifications = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          if (active) setErrorMessage('Unable to verify your session. Please sign in again.');
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, role')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError || !profileData) {
          if (active) setErrorMessage('Unable to load your notifications right now.');
          return;
        }

        if (active) setProfile(profileData);

        try {
          const response = await fetch('/api/notifications', { cache: 'no-store' });
          if (!response.ok) throw new Error('Notifications API unavailable');
          const payload = await response.json();
          if (active) setNotifications(payload.notifications ?? []);
        } catch {
          // The API is a convenience layer; keep the page usable with the
          // same role-scoped data if the request fails.
          if (active) setNotifications(getNotificationsForRole(profileData.role));
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
        if (active) setErrorMessage('Unable to load your notifications right now.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void loadNotifications();
    return () => {
      active = false;
    };
  }, []);

  const persistReadIds = (nextIds: string[]) => {
    setReadIds(nextIds);
    try {
      window.localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(nextIds));
    } catch {
      // Read state is a progressive enhancement; ignore storage failures.
    }
  };

  const isRead = (notification: AppNotification) =>
    notification.read || readIds.includes(notification.id);

  const markAsRead = (notification: AppNotification) => {
    if (isRead(notification)) return;
    persistReadIds([...readIds, notification.id]);
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((notification) => notification.id);
    persistReadIds(Array.from(new Set([...readIds, ...allIds])));
  };

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !isRead(notification)).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [notifications, readIds]
  );

  const visibleNotifications = useMemo(
    () =>
      filter === 'unread'
        ? notifications.filter((notification) => !isRead(notification))
        : notifications,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filter, notifications, readIds]
  );

  const roleHome = profile ? getRoleHome(profile.role) : null;
  const navItems: NavItem[] = roleHome
    ? [{ label: 'Dashboard', href: roleHome, icon: DASHBOARD_ICON }]
    : [];
  const initials = profile?.full_name
    ? profile.full_name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    : 'NA';
  const roleLabel = profile ? ROLE_LABELS[profile.role as keyof typeof ROLE_LABELS] ?? profile.role : 'Notifications';

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar
        navItems={navItems}
        userName={profile?.full_name ?? 'Account'}
        userRole={roleLabel}
        avatarInitials={initials}
      />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Notifications"
          subtitle="Updates across your dashboard"
          notificationCount={unreadCount}
          userName={profile?.full_name ?? 'Account'}
          avatarInitials={initials}
          profileHref={profile ? getProfileHref(profile.role) : undefined}
        />

        <main className="flex-1 p-5 pb-20 md:pb-6">
          <div className="mx-auto max-w-4xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Your notifications
                </h2>
                <p className="text-xs text-[#888888]">
                  {unreadCount > 0 ? `${unreadCount} unread update${unreadCount === 1 ? '' : 's'}` : 'You are all caught up'}
                </p>
              </div>
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold text-white/80 transition-colors hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Mark all as read
              </button>
            </div>

            <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1" role="tablist" aria-label="Notification filters">
              {(['all', 'unread'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={filter === value}
                  onClick={() => setFilter(value)}
                  className="rounded-lg px-4 py-1.5 text-xs font-semibold capitalize transition-colors"
                  style={
                    filter === value
                      ? { background: '#D4A843', color: '#0D0D0D' }
                      : { color: '#888888' }
                  }
                >
                  {value}
                  {value === 'unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}
                </button>
              ))}
            </div>

            {isLoading ? (
              <GlassCard title="Loading notifications">
                <p className="text-sm text-white/60" role="status">Loading your notifications…</p>
              </GlassCard>
            ) : errorMessage ? (
              <GlassCard title="Notifications unavailable">
                <p className="text-sm text-red-400" role="alert">{errorMessage}</p>
              </GlassCard>
            ) : visibleNotifications.length === 0 ? (
              <GlassCard title="Nothing here yet">
                <p className="text-sm text-white/60">
                  {filter === 'unread' ? 'You have read every notification.' : 'No notifications have been sent to your role yet.'}
                </p>
              </GlassCard>
            ) : (
              <ul className="space-y-3">
                {visibleNotifications.map((notification) => {
                  const category = CATEGORY_STYLES[notification.category];
                  const notificationIsRead = isRead(notification);
                  return (
                    <li
                      key={notification.id}
                      className="rounded-2xl border p-4 transition-colors"
                      style={{
                        background: notificationIsRead ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.045)',
                        borderColor: notificationIsRead ? 'rgba(255,255,255,0.07)' : 'rgba(212,168,67,0.22)',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                          style={{ background: category.background, color: category.color }}
                          aria-hidden="true"
                        >
                          {category.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                              {notification.title}
                            </h3>
                            {!notificationIsRead && (
                              <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: '#D4A843', color: '#0D0D0D' }}>
                                New
                              </span>
                            )}
                            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: category.background, color: category.color }}>
                              {category.label}
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-white/60">{notification.message}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-3">
                            <span className="text-[11px] text-white/40">{notification.time}</span>
                            {notification.href && (
                              <Link
                                href={notification.href}
                                onClick={() => markAsRead(notification)}
                                className="text-[11px] font-semibold text-[#D4A843] hover:underline"
                              >
                                Open
                              </Link>
                            )}
                            {!notificationIsRead && (
                              <button
                                type="button"
                                onClick={() => markAsRead(notification)}
                                className="text-[11px] font-semibold text-white/50 hover:text-white"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
