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

export default function InstitutionSchedulePage() {
  const SCHEDULE = [
    { teacher: 'Ms. Priya S.', subject: 'Science / Design - Batch B', slots: ['10:00 AM', '11:00 AM', '12:00 PM'], room: 'Virtual Lab A' },
    { teacher: 'Mr. Rajesh K.', subject: 'Technology (Web Basics) - Batch A', slots: ['01:00 PM', '02:00 PM'], room: 'Virtual Lab B' },
    { teacher: 'Mr. Arjun Das', subject: 'Communication Showcase - Batch C', slots: ['03:30 PM'], room: 'Auditorium V' },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Amit Sen" userRole="Institution Head" avatarInitials="AS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Campus Faculty Schedules"
          subtitle="Hitech City Branch · Operational teaching timetable"
          notificationCount={4}
          userName="Amit Sen"
          avatarInitials="AS"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          <GlassCard title="Today's Faculty Timetable & Room Allocations">
            <div className="space-y-4">
              {SCHEDULE.map((s, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">{s.teacher}</h4>
                    <p className="text-xs text-[#D4A843]">{s.subject} · {s.room}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.slots.map((time, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-lg text-xs font-mono font-bold text-white bg-white/10">
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
