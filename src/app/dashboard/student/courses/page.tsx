'use client';

import { useEffect, useState } from 'react';
import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';
import { COURSE_CATALOG, isCourseId, type CourseId } from '@/lib/student-courses';
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

interface Module {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

const MODULES: Module[] = [
  { id: 'm1', title: '1. Introduction to Vector Canvas & Coordinates', duration: '14 mins', completed: true },
  { id: 'm2', title: '2. Velocity Vectors & Frame Rates (FPS)', duration: '22 mins', completed: true },
  { id: 'm3', title: '3. Boundary Detection & Wall Collisions', duration: '18 mins', completed: false },
  { id: 'm4', title: '4. Practice Challenge: Gravity Acceleration', duration: '25 mins', completed: false },
  { id: 'm5', title: '5. Understanding Check: 5-Question Quiz', duration: '10 mins', completed: false },
];

export default function StudentCoursesPage() {
  const { courses: allowedCourses, error: accessError, isLoading: isCheckingAccess } = useStudentCourses();
  const [activeSubject, setActiveSubject] = useState<CourseId>('communication');
  const [activeModuleId, setActiveModuleId] = useState('m3');
  const [completedModules, setCompletedModules] = useState<string[]>(['m1', 'm2']);
  const [xpAwarded, setXpAwarded] = useState(false);

  useEffect(() => {
    if (!allowedCourses) return;
    const requestedCourse = new URLSearchParams(window.location.search).get('course');
    setActiveSubject(
      isCourseId(requestedCourse) && allowedCourses.includes(requestedCourse)
        ? requestedCourse
        : allowedCourses[0]
    );
  }, [allowedCourses]);

  const handleMarkComplete = () => {
    if (!completedModules.includes(activeModuleId)) {
      setCompletedModules([...completedModules, activeModuleId]);
      setXpAwarded(true);
      setTimeout(() => setXpAwarded(false), 3000);
    }
  };
  const activeCourseName = COURSE_CATALOG.find(course => course.id === activeSubject)?.name ?? 'Course';

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Rohit Sharma" userRole="Student · Grade 7" avatarInitials="RS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Learning Room & Course Player"
          subtitle="Communication and your selected elective"
          notificationCount={2}
          userName="Rohit Sharma"
          avatarInitials="RS"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          {accessError ? (
            <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {accessError}
            </div>
          ) : isCheckingAccess || !allowedCourses ? (
            <p role="status" className="text-sm text-[#888]">Checking your course access…</p>
          ) : (
          <>
          {xpAwarded && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#D4A843]/20 via-[#F5A623]/20 to-transparent border border-[#D4A843]/40 text-[#D4A843] text-xs font-bold flex items-center justify-between shadow-lg animate-bounce">
              <span className="flex items-center gap-2">
                <span>🎉</span> Module Completed! +50 XP Earned towards Level 13!
              </span>
              <span className="font-mono text-white">3,290 / 5,000 XP</span>
            </div>
          )}

          {/* Subject Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              {COURSE_CATALOG.filter(course => allowedCourses.includes(course.id)).map(course => (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => setActiveSubject(course.id)}
                  aria-pressed={activeSubject === course.id}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSubject === course.id
                      ? 'bg-[#D4A843] text-[#0D0D0D] shadow-md'
                      : 'text-[#888] hover:text-white'
                  }`}
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {course.name}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#888]">
              Subject Completion: <span className="text-[#D4A843] font-bold">40%</span> (2/5 modules)
            </div>
          </div>

          {activeSubject === 'tech' ? (
          /* Player & Sidebar Layout */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Player Container */}
            <div className="lg:col-span-2 space-y-4">
              <div
                className="relative rounded-2xl overflow-hidden aspect-video flex flex-col justify-between p-6"
                style={{
                  background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                }}
              >
                {/* Dynamic Visible Watermark for child safety deterrence (PRD REQ-037) */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-15 select-none rotate-[-15deg]">
                  <span className="text-2xl font-mono text-white tracking-widest font-bold">
                    2CARVN • ROHIT SHARMA • ID: #2C-9841
                  </span>
                </div>

                {/* Top Overlay Controls */}
                <div className="relative z-10 flex items-center justify-between text-xs text-white/80">
                  <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 font-medium">
                    Module 3: Kinematics & Collisions
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-cyan-400 font-mono">
                    HD 1080p · Adaptive
                  </span>
                </div>

                {/* Center Play Button */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <button className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 bg-[#D4A843] text-[#0D0D0D]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </button>
                  <p className="text-xs text-white/70 mt-3 font-medium">
                    Click to Resume Interactive Playback
                  </p>
                </div>

                {/* Bottom Scrub Bar */}
                <div className="relative z-10 space-y-2">
                  <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden cursor-pointer">
                    <div className="h-full bg-[#D4A843] w-1/3 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-white/70 font-mono">
                    <span>06:12 / 18:00</span>
                    <span>Speed: 1.0x</span>
                  </div>
                </div>
              </div>

              {/* Lesson Exploration & Practice Details */}
              <GlassCard title="Interactive Exploration & Practice Notes">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-[#D4A843] uppercase tracking-wider mb-1">
                      Learning Goal
                    </h4>
                    <p className="text-xs text-white/90 leading-relaxed">
                      Understand how 2D vector coordinates update within a 60 FPS requestAnimationFrame loop to detect boundary hits and bounce particles.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0D0D0D] border border-white/10 font-mono text-xs text-white/80 space-y-1">
                    <div className="text-[#888]">// Collision Detection Snippet</div>
                    <div>{`if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {`}</div>
                    <div className="pl-4 text-cyan-400">{`ball.vx = -ball.vx; // Reverse horizontal velocity`}</div>
                    <div>{`}`}</div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-[#888]">
                      Finished watching? Mark this unit complete to claim XP.
                    </span>
                    <button
                      onClick={handleMarkComplete}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110 shadow-md"
                      style={{
                        background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}
                    >
                      ✓ Mark Module Complete
                    </button>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Sidebar: Modules List */}
            <div className="space-y-4">
              <GlassCard title="Course Modules & Timeline">
                <div className="space-y-2.5">
                  {MODULES.map((mod) => {
                    const isDone = completedModules.includes(mod.id);
                    const isActive = activeModuleId === mod.id;
                    return (
                      <div
                        key={mod.id}
                        onClick={() => setActiveModuleId(mod.id)}
                        className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                          isActive
                            ? 'border-[#D4A843] bg-[#D4A843]/10'
                            : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-semibold text-white mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                              {mod.title}
                            </div>
                            <div className="text-[11px] text-[#777]">{mod.duration}</div>
                          </div>
                          {isDone ? (
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">
                              ✓
                            </span>
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-white/10 text-white/40 text-xs flex items-center justify-center">
                              ○
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Live Class Prompt */}
              <div
                className="p-4 rounded-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(212,168,67,0.15) 0%, rgba(13,13,13,0.9) 100%)',
                  border: '1px solid rgba(212,168,67,0.3)',
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-[#D4A843] uppercase tracking-wider">
                    Next Live Class
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Web Basics & Canvas Lab
                </h4>
                <p className="text-xs text-[#888] mb-3">Today at 10:00 AM with Ms. Sharma</p>
                <a
                  href="https://meet.google.com/abc-2carvn-xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-[#0D0D0D] bg-[#D4A843] hover:brightness-110 flex items-center justify-center gap-1.5 transition-all"
                >
                  Join Google Meet Class →
                </a>
              </div>
            </div>
          </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <GlassCard title={`${activeCourseName} Course`}>
                  <p className="text-sm text-[#AAA]">
                    You are enrolled in {activeCourseName}. Learning materials for this course are not published yet.
                  </p>
                </GlassCard>
              </div>
              <GlassCard title="Your Course Bundle">
                <p className="text-xs text-[#AAA]">
                  Communication and your selected elective are available to you.
                </p>
              </GlassCard>
            </div>
          )}
          </>
          )}
        </main>
      </div>
    </div>
  );
}
