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

export default function InstitutionStudentsPage() {
  const STUDENTS = [
    { name: 'Aarav K.', batch: 'Batch A - 7th', attendance: '95%', tracker: 'Stable', status: 'Active' },
    { name: 'Physics L.', batch: 'Batch B - 8th', attendance: '95%', tracker: 'Stable', status: 'Active' },
    { name: 'Chemistry J.', batch: 'Batch B - 8th', attendance: '72%', tracker: 'Intervention', status: 'Warning' },
    { name: 'English K.', batch: 'Batch C - 9th', attendance: '65%', tracker: 'Low', status: 'Warning' },
    { name: 'Aarav K.', batch: 'Batch C - 9th', attendance: '72%', tracker: 'Intervention', status: 'Warning' },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Amit Sen" userRole="Institution Head" avatarInitials="AS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Campus Learner Directory & Attendance Tracker"
          subtitle="Hitech City Branch · 450 Enrolled Students"
          notificationCount={4}
          userName="Amit Sen"
          avatarInitials="AS"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          <GlassCard title="Enrolled Students (Hitech City Branch)">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Learner Name', 'Cohort Batch', 'Attendance %', 'Pacing Health', 'Flag'].map(h => (
                      <th key={h} className="text-left pb-3 pr-4 text-[11px] font-semibold text-[#888] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {STUDENTS.map((s, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 pr-4 font-semibold text-white text-sm">{s.name}</td>
                      <td className="py-3.5 pr-4 text-xs text-[#AAA]">{s.batch}</td>
                      <td className="py-3.5 pr-4 text-xs font-mono font-bold text-[#D4A843]">{s.attendance}</td>
                      <td className="py-3.5 pr-4 text-xs text-white/80">{s.tracker}</td>
                      <td className="py-3.5 pr-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
