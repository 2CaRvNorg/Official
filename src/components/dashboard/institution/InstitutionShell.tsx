'use client';

import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';

export const INSTITUTION_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/institution', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'Batches & Progress', href: '/dashboard/institution/batches', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { label: 'Student Roster', href: '/dashboard/institution/students', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { label: 'Teacher Schedule', href: '/dashboard/institution/schedule', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: 'Support & Alerts', href: '/dashboard/institution/alerts', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> },
  { label: 'Reports', href: '/dashboard/institution/reports', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
];

interface InstitutionShellProps {
  title: string;
  subtitle?: string;
  viewerName?: string;
  avatarInitials?: string;
  notificationCount?: number;
  isLoading?: boolean;
  error?: string | null;
  unassigned?: boolean;
  onRetry?: () => void;
  children: React.ReactNode;
}

function LoadingState() {
  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div className="text-center">
        <div
          className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#D4A843', borderRightColor: 'rgba(212,168,67,0.25)' }}
        />
        <p className="text-sm text-[#888]">Loading institution data…</p>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <GlassCard title="Unable to load institution data">
      <div className="space-y-4">
        <p className="text-sm text-[#AAA]">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl px-4 py-2 text-xs font-bold text-[#0D0D0D]"
            style={{ background: '#D4A843', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Try again
          </button>
        )}
      </div>
    </GlassCard>
  );
}

function UnassignedState() {
  return (
    <GlassCard title="Institution not linked">
      <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
        <div
          className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
          style={{ background: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.28)' }}
        >
          🏫
        </div>
        <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Your account is not linked to an institution yet.
        </h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#999]">
          Please contact an administrator to assign your institution head account to a school or campus.
          Once linked, your dashboard will load only that institution&apos;s branches, batches, students and reports.
        </p>
      </div>
    </GlassCard>
  );
}

export default function InstitutionShell({
  title,
  subtitle,
  viewerName,
  avatarInitials,
  notificationCount = 0,
  isLoading = false,
  error = null,
  unassigned = false,
  onRetry,
  children,
}: InstitutionShellProps) {
  const resolvedName = viewerName || 'Institution Head';
  const resolvedInitials = avatarInitials || 'IH';

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar
        navItems={INSTITUTION_NAV_ITEMS}
        userName={resolvedName}
        userRole="Institution Head"
        avatarInitials={resolvedInitials}
      />

      <div className="flex flex-1 flex-col md:ml-[230px]">
        <TopBar
          title={title}
          subtitle={subtitle}
          notificationCount={notificationCount}
          userName={resolvedName}
          avatarInitials={resolvedInitials}
        />

        <main className="flex-1 space-y-5 p-5 pb-20 md:pb-6">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={onRetry} />
          ) : unassigned ? (
            <UnassignedState />
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
