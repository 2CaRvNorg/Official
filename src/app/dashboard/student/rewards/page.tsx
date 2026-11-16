'use client';

import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';
import { COURSE_CATALOG, type CourseId } from '@/lib/student-courses';
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

export default function StudentRewardsPage() {
  const { courses, error, isLoading } = useStudentCourses();
  const elective = courses?.find(course => course !== 'communication');
  const electiveName = COURSE_CATALOG.find(course => course.id === elective)?.name;

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Rohit Sharma" userRole="Student · Grade 7" avatarInitials="RS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Badges, Rewards & Certificates"
          subtitle="Achievements earned across your 6-month academy programme"
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
                Your Trophy Cabinet
              </h2>
              <p className="text-xs text-[#888]">
                Level 12 Scholar · 3,240 XP Earned · Bronze League Tier
              </p>
            </div>
          </div>

          {/* Badges Grid */}
          <GlassCard title="Earned Badges & Distinctions">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { title: '7-Day Streak', icon: '🔥', desc: 'Maintained uninterrupted daily learning for a full week', unlocked: true, course: null },
                { title: 'Canvas Pioneer', icon: '⚡', desc: 'Completed first 2D interactive vector canvas exercise', unlocked: true, course: 'tech' as CourseId },
                { title: 'Typography Ace', icon: '🎨', desc: 'Scored 90%+ on layout hierarchy challenge', unlocked: true, course: 'design' as CourseId },
                { title: 'Speech Master', icon: '🎙️', desc: 'Recorded project showcase elevator pitch', unlocked: false, course: 'communication' as CourseId },
              ].filter(badge => badge.course === null || courses.includes(badge.course)).map((badge, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-2xl text-center border transition-all ${
                    badge.unlocked
                      ? 'bg-white/[0.03] border-[#D4A843]/40 shadow-lg'
                      : 'bg-white/[0.01] border-white/5 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <h4 className="text-xs font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-[#888] leading-tight">{badge.desc}</p>
                  <div className="mt-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.unlocked ? 'text-[#D4A843] bg-[#D4A843]/10' : 'text-[#666] bg-white/5'}`}>
                      {badge.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Certificate Status Card */}
          <GlassCard title="Official 2Carvn Academy Certificate Eligibility">
            <div className="p-6 rounded-2xl bg-[#0D0D0D] border border-[#D4A843]/30 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#D4A843] uppercase tracking-wider">
                  Graduation Credential (PRD REQ-045)
                </span>
                <h3 className="text-base font-bold text-white mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Certificate of Achievement in Communication & {electiveName}
                </h3>
                <p className="text-xs text-[#888] mt-1 max-w-lg">
                  Awarded to students upon completing all mandatory modules with &gt;=60% marks and &gt;=80% attendance.
                </p>
              </div>

              <button
                onClick={() => alert('Certificate preview generated! Your final certificate will unlock at batch completion.')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#0D0D0D] bg-[#D4A843] hover:brightness-110 shadow-md"
              >
                Preview Certificate Hash →
              </button>
            </div>
          </GlassCard>
          </>
          )}
        </main>
      </div>
    </div>
  );
}
