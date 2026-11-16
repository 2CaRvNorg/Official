'use client';

import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/teacher', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'My Batches', href: '/dashboard/teacher/batches', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { label: 'Calendar', href: '/dashboard/teacher/calendar', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: 'Lesson Builder', href: '/dashboard/teacher/lessons', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  { label: 'Live Classes', href: '/dashboard/teacher/live', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> },
  { label: 'Assignments & Grading', href: '/dashboard/teacher/grading', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg> },
  { label: 'Student Progress', href: '/dashboard/teacher/progress', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
];

export default function TeacherProgressPage() {
  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Ms. Sharma" userRole="Teacher · Designing" avatarInitials="MS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Student Progress & Intervention Alerts"
          subtitle="Track syllabus completion, identify falling grades & trigger academic interventions"
          notificationCount={2}
          userName="Ms. Sharma"
          avatarInitials="MS"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Urgent Intervention Flags */}
            <GlassCard title="Active Academic Intervention Flags (2)">
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Aarav K. · Batch 7A</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold text-amber-400 bg-amber-500/20">Attendance Alert</span>
                  </div>
                  <p className="text-xs text-[#AAA]">
                    Missed 3 consecutive Google Meet sessions. Attendance dropped to 72% (below 80% certification floor).
                  </p>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => alert('Dispatched remedial reminder to Aarav K. & guardian contact.')}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0D0D0D] bg-[#D4A843] hover:brightness-110"
                    >
                      Trigger Intervention →
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">Batch 7A · Geometry HW 3</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold text-red-400 bg-red-500/20">Deadline Passed</span>
                  </div>
                  <p className="text-xs text-[#AAA]">
                    4 students have unsubmitted coursework. Late penalty automatically active per PRD REQ-041.
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Batch Syllabus Completion */}
            <GlassCard title="Syllabus Pacing & Progress">
              <div className="space-y-4">
                {[
                  { batch: 'Batch 7A - Design & Comm', progress: 78, color: '#D4A843' },
                  { batch: 'Batch 8B - Web & Design', progress: 65, color: '#00BCD4' },
                ].map((b, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">{b.batch}</span>
                      <span className="font-mono text-[#D4A843] font-bold">{b.progress}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${b.progress}%`, background: b.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  );
}
