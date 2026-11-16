'use client';

import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/institution', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'Batches & Progress', href: '/dashboard/institution/batches', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { label: 'Student Roster', href: '/dashboard/institution/students', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { label: 'Teacher Schedule', href: '/dashboard/institution/schedule', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: 'Support & Alerts', href: '/dashboard/institution/alerts', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> },
  { label: 'Reports', href: '/dashboard/institution/reports', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
];

export default function InstitutionReportsPage() {
  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Amit Sen" userRole="Institution Head" avatarInitials="AS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Campus Reports & Academic Performance"
          subtitle="Hitech City Branch · Audited performance reports"
          notificationCount={4}
          userName="Amit Sen"
          avatarInitials="AS"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard title="Monthly Campus Completion Summary">
              <div className="space-y-3">
                <p className="text-xs text-[#AAA] leading-relaxed">
                  Export aggregated attendance, assignment turnaround, and graduation readiness data for Hitech City Branch.
                </p>
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => alert('Exporting Campus Performance Report (XLSX)...')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] bg-[#D4A843] hover:brightness-110 shadow-md"
                  >
                    Download Campus Report (.xlsx) →
                  </button>
                </div>
              </div>
            </GlassCard>

            <GlassCard title="Authorized Fee & Payment Status Overview">
              <div className="space-y-3">
                <p className="text-xs text-[#AAA] leading-relaxed">
                  View aggregated fee payment status for authorized enrolled students (PRD REQ-082: Institution Head permitted payment status view only; no financial modifications).
                </p>
                <div className="flex justify-between items-center text-xs pt-2">
                  <span className="text-[#888]">Status: <strong className="text-emerald-400">92% Settled</strong></span>
                  <span className="text-[#D4A843] font-bold">8 Outstandings</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  );
}
