'use client';

import { useState } from 'react';
import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';
import { type CourseId } from '@/lib/student-courses';
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

const WEEKLY_CLASSES: Array<{ title: string; teacher: string; day: string; time: string; course: CourseId }> = [
  { title: 'Designing: Color Harmony & UI Palettes', teacher: 'Ms. Priya Nair', day: 'Tomorrow', time: '01:00 PM – 02:00 PM', course: 'design' },
  { title: 'Communication: Pitching Your Interactive Project', teacher: 'Mr. Arjun Das', day: 'Friday', time: '11:00 AM – 12:00 PM', course: 'communication' },
  { title: 'Tech Lab: Canvas Animation Collision Checkpoints', teacher: 'Ms. Sharma', day: 'Next Monday', time: '10:00 AM – 11:00 AM', course: 'tech' },
];

export default function StudentLivePage() {
  const { courses, error, isLoading } = useStudentCourses();

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Rohit Sharma" userRole="Student · Grade 7" avatarInitials="RS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Live Classes & Schedule"
          subtitle="Join Google Meet live instruction for Batch 7A"
          notificationCount={1}
          userName="Rohit Sharma"
          avatarInitials="RS"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          {error ? (
            <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          ) : isLoading || !courses ? (
            <p role="status" className="text-sm text-[#888]">Checking your course access…</p>
          ) : (
          <>
          {/* Active Live Class Hero Banner */}
          {courses.includes('tech') ? <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(212,168,67,0.2) 0%, rgba(13,13,13,0.95) 100%)',
              border: '1px solid rgba(212,168,67,0.4)',
              boxShadow: '0 15px 40px rgba(212,168,67,0.1)',
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-red-400 uppercase tracking-widest">
                    LIVE NOW ON GOOGLE MEET
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Web Basics & Canvas Vector Graphics
                </h2>
                <p className="text-xs text-[#AAA] mb-2">
                  Instructor: Ms. Sharma · Time: 10:00 AM – 11:00 AM · Batch 7A
                </p>
                <div className="text-[11px] text-[#D4A843] flex items-center gap-1 font-semibold">
                  <span>ℹ️</span> Attendance will be automatically imported via Google Meet session detector.
                </div>
              </div>

              <a
                href="https://meet.google.com/abc-2carvn-xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl text-sm font-bold text-[#0D0D0D] bg-[#D4A843] hover:brightness-110 shadow-2xl transition-all flex items-center gap-2 animate-pulse"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                <span>Join Google Meet</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </a>
            </div>
          </div> : (
            <div className="rounded-2xl p-6 border border-white/10 bg-white/[0.02] text-sm text-[#888]">
              No live Technology class is available in your course bundle.
            </div>
          )}

          {/* Upcoming Schedule for this week */}
          <GlassCard title="This Week's Timetable">
            <div className="space-y-3">
              {WEEKLY_CLASSES.filter(c => courses.includes(c.course)).map((c, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4A843] font-bold text-xs">
                      {c.day.slice(0, 3)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{c.title}</div>
                      <div className="text-[11px] text-[#777]">{c.teacher} · {c.time}</div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-[#D4A843] bg-[#D4A843]/10">
                    {c.day}
                  </span>
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
