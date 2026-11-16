'use client';

import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';
import { useStudentCourses } from '@/hooks/useStudentCourses';

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/student', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'My Courses', href: '/dashboard/student/courses', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> },
  { label: 'Live Classes', href: '/dashboard/student/live', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> },
  { label: 'Assignments', href: '/dashboard/student/assignments', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { label: 'Exams', href: '/dashboard/student/exams', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { label: 'Games', href: '/dashboard/student/games', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg> },
  { label: 'Progress', href: '/dashboard/student/progress', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { label: 'Rewards', href: '/dashboard/student/rewards', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg> },
  { label: 'Settings', href: '/dashboard/student/settings', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg> },
];

export default function StudentProgressPage() {
  const { courses, error, isLoading } = useStudentCourses();

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Rohit Sharma" userRole="Student · Grade 7" avatarInitials="RS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Personal Learning Mastery & Progress"
          subtitle="Progress across your enrolled course bundle"
          notificationCount={1}
          userName="Rohit Sharma"
          avatarInitials="RS"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          {error ? (
            <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>
          ) : isLoading || !courses ? (
            <p role="status" className="text-sm text-[#888]">Checking your course access…</p>
          ) : (
          <>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Your Academic Journey
              </h2>
              <p className="text-xs text-[#888]">
                PRD REQ-064: Confidential personal progress tracking with zero public pressure
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Overall Completion', value: '74%', color: '#D4A843' },
              { label: 'Attendance Rate', value: '95.2%', color: '#4CAF50' },
              { label: 'Average Marks', value: '88.5 / 100', color: '#00BCD4' },
              { label: 'Certificate Status', value: 'On Track', color: '#7C4DFF' },
            ].map(m => (
              <div
                key={m.label}
                className="rounded-xl p-4 flex flex-col justify-between"
                style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-xs text-[#888] font-medium">{m.label}</span>
                <span className="text-xl font-bold mt-2" style={{ color: m.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Subject Mastery Progress Bars */}
          <GlassCard title="Parallel Subject Mastery Breakdown">
            <div className="space-y-5">
              {[
                { course: 'tech' as const, subject: 'Tech (Web Basics)', teacher: 'Mr. Rajesh Kumar', pct: 78, color: '#00BCD4', completedUnits: '12 / 16 Units' },
                { course: 'design' as const, subject: 'Design (UI/UX Thinking)', teacher: 'Ms. Priya Nair', pct: 85, color: '#7C4DFF', completedUnits: '14 / 16 Units' },
                { course: 'communication' as const, subject: 'Communication & Showcase', teacher: 'Mr. Arjun Das', pct: 60, color: '#D4A843', completedUnits: '6 / 10 Units' },
              ].filter(s => courses.includes(s.course)).map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{s.subject}</span>
                      <span className="text-[#777] ml-2">({s.teacher})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[#AAA]">{s.completedUnits}</span>
                      <span className="font-mono font-bold" style={{ color: s.color }}>{s.pct}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
          </>
          )}
        </main>
      </div>
    </div>
  );
}
