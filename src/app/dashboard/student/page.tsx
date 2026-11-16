'use client';

import Link from 'next/link';
import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';
import { type CourseId } from '@/lib/student-courses';
import { useStudentCourses } from '@/hooks/useStudentCourses';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/student', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'My Courses', href: '/dashboard/student/courses', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> },
  { label: 'Live Classes', href: '/dashboard/student/live', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> },
  { label: 'Assignments', href: '/dashboard/student/assignments', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { label: 'Exams', href: '/dashboard/student/exams', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { label: 'Games', href: '/dashboard/student/games', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg> },
  { label: 'Progress', href: '/dashboard/student/progress', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { label: 'Rewards', href: '/dashboard/student/rewards', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg> },
  { label: 'Settings', href: '/dashboard/student/settings', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg> },
];

const COURSES: Array<{ id: CourseId; name: string; chapter: string; progress: number; color: string; emoji: string }> = [
  { id: 'communication', name: 'Communication', chapter: 'Speaking & Collaboration', progress: 72, color: '#D4A843', emoji: '💬' },
  { id: 'design', name: 'Design', chapter: 'Creative UI/UX', progress: 55, color: '#7C4DFF', emoji: '🎨' },
  { id: 'tech', name: 'Tech', chapter: 'Web Basics', progress: 85, color: '#00BCD4', emoji: '⚡' },
];

const PROGRESS_DATA = [
  { week: 'W1', games: 40, assignments: 60, exams: 20 },
  { week: 'W2', games: 55, assignments: 45, exams: 35 },
  { week: 'W3', games: 70, assignments: 80, exams: 50 },
  { week: 'W4', games: 60, assignments: 70, exams: 65 },
  { week: 'W5', games: 85, assignments: 75, exams: 80 },
  { week: 'W6', games: 92, assignments: 88, exams: 75 },
];

const TOP_SUBJECTS: Array<{ id: CourseId; name: string; pct: number; color: string }> = [
  { id: 'communication', name: 'Communication', pct: 92, color: '#D4A843' },
  { id: 'design', name: 'Design', pct: 78, color: '#7C4DFF' },
  { id: 'tech', name: 'Tech', pct: 85, color: '#00BCD4' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1A1A1A', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 10, padding: '10px 14px' }}>
        <p style={{ color: '#D4A843', fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color, fontSize: 12 }}>
            {entry.name}: <strong style={{ color: '#fff' }}>{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function StudentDashboard() {
  const XP_CURRENT = 3240;
  const XP_MAX = 5000;
  const xpPct = (XP_CURRENT / XP_MAX) * 100;
  const { courses: allowedCourses, error: courseAccessError } = useStudentCourses();

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Rohit Verma" userRole="Student · Grade 9" avatarInitials="RV" />

      <div className="flex-1 flex flex-col md:ml-[220px]">
        <TopBar
          title="Student Dashboard"
          subtitle="Your learning overview"
          notificationCount={2}
          userName="Rohit Verma"
          avatarInitials="RV"
        />

        <main className="flex-1 p-5 pb-20 md:pb-5 space-y-5">
          {/* Hero Banner */}
          <div
            className="rounded-xl p-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.2) 0%, rgba(124,77,255,0.1) 60%, rgba(13,13,13,0) 100%)', border: '1px solid rgba(212,168,67,0.2)' }}
          >
            <div className="flex flex-wrap items-start justify-between gap-6">
              {/* Left text */}
              <div className="flex-1 min-w-[200px]">
                <p className="text-sm mb-1" style={{ color: '#888888' }}>Good morning! 👋</p>
                <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Keep Learning,<br />Keep Growing!
                </h2>
                <p className="text-sm mb-5" style={{ color: '#888888', maxWidth: 280 }}>
                  You're on a 7-day streak. Don't break it — your next class is in 2 hours.
                </p>
                {allowedCourses ? (
                  <Link
                    href="/dashboard/student/courses"
                    className="inline-block px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                    style={{ background: '#D4A843', color: '#0D0D0D', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Continue Learning →
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold opacity-50 cursor-not-allowed"
                    style={{ background: '#D4A843', color: '#0D0D0D', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Continue Learning →
                  </button>
                )}
              </div>

              {/* Center avatar */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                  style={{ background: 'rgba(212,168,67,0.15)', border: '2px solid rgba(212,168,67,0.3)' }}
                >
                  🧑‍🎓
                </div>
                <span className="text-xs text-white/60">Rohit Verma</span>
              </div>

              {/* Right: Streak + XP */}
              <div className="flex flex-col gap-3 min-w-[160px]">
                {/* Streak */}
                <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="text-2xl">🔥</span>
                  <div>
                    <div className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>7 Days</div>
                    <div className="text-xs" style={{ color: '#888' }}>Current Streak</div>
                  </div>
                </div>
                {/* Level + XP */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Level 12 ⭐</span>
                  </div>
                  <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{ width: `${xpPct}%`, background: 'linear-gradient(90deg, #D4A843, #F5A623)' }}
                    />
                  </div>
                  <div className="text-xs mt-1.5" style={{ color: '#888' }}>
                    {XP_CURRENT.toLocaleString()} / {XP_MAX.toLocaleString()} XP
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'My Courses', value: '5 Active', icon: '📚', color: '#D4A843' },
              { label: 'Assignments', value: '3 Pending', icon: '📝', color: '#FF9800' },
              { label: 'Exams', value: '2 Upcoming', icon: '📋', color: '#00BCD4' },
              { label: 'League', value: 'Bronze 🥉', icon: '🏆', color: '#7C4DFF' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-4 flex items-center gap-3"
                style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <div className="text-sm font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif', color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="text-xs" style={{ color: '#666' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Left 2 cols */}
            <div className="xl:col-span-2 space-y-5">
              {courseAccessError && (
                <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                  {courseAccessError}
                </div>
              )}
              {!allowedCourses && !courseAccessError && (
                <p className="text-xs text-[#888]" role="status">Checking your course access…</p>
              )}

              {/* Continue Learning */}
              <GlassCard title="Continue Learning">
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {COURSES.map((course) => (
                    <div
                      key={course.name}
                      className="flex-shrink-0 rounded-xl p-4 w-48"
                      style={{
                        background: allowedCourses?.includes(course.id) ? `${course.color}18` : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${allowedCourses?.includes(course.id) ? `${course.color}25` : 'rgba(255,255,255,0.08)'}`,
                        opacity: allowedCourses?.includes(course.id) ? 1 : 0.6,
                      }}
                    >
                      <div className="text-2xl mb-2">{course.emoji}</div>
                      <div className="text-sm font-bold text-white mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {course.name}
                      </div>
                      {allowedCourses?.includes(course.id) ? (
                        <>
                          <div className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>{course.chapter}</div>
                          <div className="relative h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.1)' }}>
                            <div
                              className="absolute left-0 top-0 h-full rounded-full"
                              style={{ width: `${course.progress}%`, background: course.color }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{course.progress}%</span>
                            <Link
                              href={`/dashboard/student/courses?course=${course.id}`}
                              className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                              style={{ background: course.color, color: '#0D0D0D' }}
                              aria-label={`Play ${course.name}`}
                            >
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            </Link>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/50">Locked course</span>
                          <button
                            type="button"
                            disabled
                            aria-label={`${course.name} is locked`}
                            className="w-7 h-7 rounded-full flex items-center justify-center cursor-not-allowed"
                            style={{ background: 'rgba(255,255,255,0.1)', color: '#888' }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="11" width="18" height="11" rx="2" />
                              <path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Progress Chart */}
              <GlassCard title="Game Zones & Progress">
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={PROGRESS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4A843" stopOpacity={0.3}/><stop offset="95%" stopColor="#D4A843" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00BCD4" stopOpacity={0.3}/><stop offset="95%" stopColor="#00BCD4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.3}/><stop offset="95%" stopColor="#4CAF50" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                    <XAxis dataKey="week" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTooltip />}/>
                    <Area type="monotone" dataKey="games" name="Games" stroke="#D4A843" fill="url(#gGold)" strokeWidth={2}/>
                    <Area type="monotone" dataKey="assignments" name="Assignments" stroke="#00BCD4" fill="url(#gBlue)" strokeWidth={2}/>
                    <Area type="monotone" dataKey="exams" name="Exams" stroke="#4CAF50" fill="url(#gGreen)" strokeWidth={2}/>
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Quick Actions */}
              <section aria-label="Quick actions" className="space-y-3">
                <h2 className="text-sm font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Quick Actions
                </h2>
                <Link
                  href="/dashboard/student/live"
                  className="block p-4 rounded-xl transition-all hover:-translate-y-0.5 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4A843]"
                  style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.25)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Join Live Class
                      </div>
                      <div className="text-xs" style={{ color: '#888' }}>Classes for your enrolled courses</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4A843" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/dashboard/student/exams"
                  className="block p-4 rounded-xl transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00BCD4]"
                  style={{ background: 'rgba(0,188,212,0.08)', border: '1px solid rgba(0,188,212,0.2)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Take a Quiz
                      </div>
                      <div className="text-xs" style={{ color: '#888' }}>Mathematics — Algebra Quiz 3</div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00BCD4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
                <Link
                  href="/dashboard/student/games"
                  className="block p-4 rounded-xl transition-all hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C4DFF]"
                  style={{ background: 'rgba(124,77,255,0.08)', border: '1px solid rgba(124,77,255,0.2)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        Play a Game
                      </div>
                      <div className="text-xs" style={{ color: '#888' }}>Explore interactive practice</div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C4DFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </Link>
              </section>

              {/* Top Subjects */}
              <GlassCard title="Top Subjects">
                <div className="space-y-4">
                  {TOP_SUBJECTS.filter(subj => allowedCourses?.includes(subj.id)).map((subj) => (
                    <div key={subj.name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{subj.name}</span>
                        <span className="text-xs font-bold" style={{ color: subj.color }}>{subj.pct}%</span>
                      </div>
                      <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div
                          className="absolute left-0 top-0 h-full rounded-full"
                          style={{ width: `${subj.pct}%`, background: subj.color, transition: 'width 1s ease' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
