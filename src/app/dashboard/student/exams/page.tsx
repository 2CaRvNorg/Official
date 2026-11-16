'use client';

import { useState } from 'react';
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

export default function StudentExamsPage() {
  const { courses, error, isLoading } = useStudentCourses();
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAns, setSelectedAns] = useState<number | null>(null);

  const handleQuizSubmit = () => {
    if (selectedAns === 1) {
      setQuizScore(100);
    } else {
      setQuizScore(50);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Rohit Sharma" userRole="Student · Grade 7" avatarInitials="RS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Exams & Quizzes"
          subtitle="Formative quizzes, milestone assessments & final evaluation"
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
                Assessment Milestones
              </h2>
              <p className="text-xs text-[#888]">
                Pass threshold: 60% minimum overall score to qualify for Academy Certificate (PRD REQ-044)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Assessment Card 1 */}
            {courses.includes('tech') && <GlassCard title="Mid-Term Comprehensive Exam: Web Basics & Canvas">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#888]">Status: <strong className="text-emerald-400">Completed & Passed</strong></span>
                  <span className="font-mono text-[#D4A843] font-bold">92 / 100 Marks</span>
                </div>
                <p className="text-xs text-[#AAA] leading-relaxed">
                  Covered coordinate mapping, vector velocity calculations, DOM events, and semantic layout structure.
                </p>
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#777]">
                  <span>Attempts Used: 1 of 2</span>
                  <span className="text-emerald-400 font-semibold">Distinction</span>
                </div>
              </div>
            </GlassCard>}

            {/* Assessment Card 2 - Interactive Quiz */}
            {courses.includes('design') && <GlassCard title="Checkpoint Quiz: Visual Contrast & Typography">
              {!activeQuiz ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#888]">Status: <strong className="text-amber-400">Ready to Take</strong></span>
                    <span className="text-white font-mono">10 Questions · 15 Mins</span>
                  </div>
                  <p className="text-xs text-[#AAA] leading-relaxed">
                    Test your understanding of WCAG color contrast ratios, font pairings, and spatial scale before the final capstone.
                  </p>
                  <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] text-[#777]">Max Attempts: 3</span>
                    <button
                      onClick={() => setActiveQuiz(true)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] bg-[#D4A843] hover:brightness-110 shadow-md"
                    >
                      Start Checkpoint Quiz →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-xs font-bold text-[#D4A843]">
                    Question 1 of 5:
                  </div>
                  <p className="text-xs text-white font-semibold">
                    What is the minimum WCAG 2.2 AA contrast ratio required for normal body text against dark backgrounds?
                  </p>

                  <div className="space-y-2">
                    {[
                      '3.0 : 1',
                      '4.5 : 1 (Correct standard)',
                      '7.0 : 1',
                      '2.5 : 1',
                    ].map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedAns(i)}
                        className={`w-full p-2.5 rounded-xl text-xs text-left transition-all border ${
                          selectedAns === i
                            ? 'bg-[#D4A843]/20 border-[#D4A843] text-white font-bold'
                            : 'bg-[#1A1A1A] border-white/10 text-white/70 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {quizScore !== null ? (
                    <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex justify-between items-center">
                      <span>Quiz Result: {quizScore}% Passed! +30 XP added!</span>
                      <button onClick={() => { setActiveQuiz(false); setQuizScore(null); }} className="text-xs underline text-white">Done</button>
                    </div>
                  ) : (
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleQuizSubmit}
                        disabled={selectedAns === null}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] bg-[#D4A843] disabled:opacity-40"
                      >
                        Submit Answer
                      </button>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>}
          </div>
          </>
          )}
        </main>
      </div>
    </div>
  );
}
