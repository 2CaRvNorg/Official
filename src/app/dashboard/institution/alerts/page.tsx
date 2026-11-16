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

export default function InstitutionAlertsPage() {
  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Amit Sen" userRole="Institution Head" avatarInitials="AS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Campus Support & Intervention Alerts"
          subtitle="Hitech City Branch · Active academic alerts"
          notificationCount={4}
          userName="Amit Sen"
          avatarInitials="AS"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">⚠️ Aarav K. - Low Attendance</span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">Action Required</span>
              </div>
              <p className="text-xs text-[#AAA] leading-relaxed">
                Learner has missed 3 live classes consecutively. Attendance is at 72%. Campus coordinator counseling suggested.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => alert('Campus intervention scheduled for Aarav K.')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0D0D0D] bg-[#D4A843] hover:brightness-110"
                >
                  Schedule Counseling →
                </button>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">⚠️ Batch C - Missed Assignment Submissions</span>
                <span className="text-[10px] font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded">High Priority</span>
              </div>
              <p className="text-xs text-[#AAA] leading-relaxed">
                5 students in Batch C missed the milestone submission deadline for Capstone Project 1.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => alert('Batch remedial notification triggered.')}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0D0D0D] bg-[#D4A843] hover:brightness-110"
                >
                  Contact Batch Faculty →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
