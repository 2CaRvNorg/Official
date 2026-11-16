'use client';

import { useState } from 'react';
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

interface Submission {
  id: string;
  studentName: string;
  avatarInitials: string;
  batch: string;
  submittedAt: string;
  isLate: boolean;
  score: number | null;
  feedback: string;
  attachmentUrl?: string;
}

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    studentName: 'Rohit Sharma',
    avatarInitials: 'RS',
    batch: 'Batch 7A - Design & Comm',
    submittedAt: 'Today at 08:45 AM',
    isLate: false,
    score: null,
    feedback: '',
    attachmentUrl: 'rohit_geometry_art.fig',
  },
  {
    id: 'sub-2',
    studentName: 'Priya K.',
    avatarInitials: 'PK',
    batch: 'Batch 7A - Design & Comm',
    submittedAt: 'Yesterday at 04:20 PM',
    isLate: false,
    score: 85,
    feedback: 'Excellent spatial balance and clean typography choice. Check border radius consistency.',
    attachmentUrl: 'priya_typography_grid.pdf',
  },
  {
    id: 'sub-3',
    studentName: 'Aarav Kumar',
    avatarInitials: 'AK',
    batch: 'Batch 7A - Design & Comm',
    submittedAt: '2 hours ago (Late submission)',
    isLate: true,
    score: null,
    feedback: '',
    attachmentUrl: 'aarav_vector_sketch.png',
  },
  {
    id: 'sub-4',
    studentName: 'Sneha Roy',
    avatarInitials: 'SR',
    batch: 'Batch 7A - Design & Comm',
    submittedAt: 'Yesterday at 02:15 PM',
    isLate: false,
    score: 92,
    feedback: 'Outstanding vector execution! Very close to production grade.',
    attachmentUrl: 'sneha_layout_comp.fig',
  },
];

export default function GradingPage() {
  const [selectedAssignment, setSelectedAssignment] = useState('Geometry HW 3: Vector Layouts');
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [activeScoreInput, setActiveScoreInput] = useState<Record<string, string>>({
    'sub-1': '',
    'sub-3': '',
  });
  const [activeFeedbackInput, setActiveFeedbackInput] = useState<Record<string, string>>({
    'sub-1': '',
    'sub-3': '',
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleGradeSubmit = (submissionId: string) => {
    const rawScore = activeScoreInput[submissionId];
    const scoreVal = parseInt(rawScore, 10);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
      alert('Please enter a valid grade between 0 and 100 marks.');
      return;
    }

    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === submissionId
          ? {
              ...sub,
              score: scoreVal,
              feedback: activeFeedbackInput[submissionId] || 'Great effort.',
            }
          : sub
      )
    );

    setToastMsg(`Grade ${scoreVal}/100 submitted successfully! Updated student report.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const pendingCount = submissions.filter(s => s.score === null).length;
  const gradedCount = submissions.filter(s => s.score !== null).length;

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Ms. Sharma" userRole="Teacher · Designing" avatarInitials="MS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Homework & Assessment Grading"
          subtitle="Rubric scoring, feedback review & grade audit tracking"
          notificationCount={2}
          userName="Ms. Sharma"
          avatarInitials="MS"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          {toastMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between">
              <span>✓ {toastMsg}</span>
              <button onClick={() => setToastMsg(null)} className="text-white/50 hover:text-white">✕</button>
            </div>
          )}

          {/* Assignment Selector & Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Submissions Review
              </h2>
              <p className="text-xs text-[#888]">
                Review learner work, apply rubrics, and record transparent grades (PRD REQ-042)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[#AAA] font-medium hidden sm:inline">Active Assignment:</span>
              <select
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#D4A843] bg-[#1A1A1A] border border-white/10 outline-none"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                <option value="Geometry HW 3: Vector Layouts">Geometry HW 3: Vector Layouts</option>
                <option value="Color Theory Project: Contrast Matrix">Color Theory Project: Contrast Matrix</option>
                <option value="Web Basics Quiz 2: Box Model">Web Basics Quiz 2: Box Model</option>
              </select>
            </div>
          </div>

          {/* Quick Stats Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Submissions', value: submissions.length, color: '#D4A843' },
              { label: 'Pending Grading', value: pendingCount, color: '#FF9800' },
              { label: 'Graded & Audited', value: gradedCount, color: '#4CAF50' },
              { label: 'Batch Average', value: '88.5%', color: '#00BCD4' },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-xl p-4 flex flex-col justify-between"
                style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-xs text-[#888] font-medium">{m.label}</span>
                <span className="text-2xl font-bold mt-2" style={{ color: m.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Submissions Grading List */}
          <div className="space-y-4">
            {submissions.map((sub) => {
              const isGraded = sub.score !== null;
              return (
                <div
                  key={sub.id}
                  className="rounded-2xl p-5 transition-all"
                  style={{
                    background: '#141414',
                    border: isGraded ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(212,168,67,0.3)',
                    boxShadow: isGraded ? 'none' : '0 10px 25px rgba(212,168,67,0.05)',
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ring-1 ring-[#D4A843]/40"
                        style={{
                          background: 'linear-gradient(135deg, rgba(212,168,67,0.3) 0%, rgba(212,168,67,0.1) 100%)',
                          color: '#D4A843',
                          fontFamily: 'Space Grotesk, sans-serif'
                        }}
                      >
                        {sub.avatarInitials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            {sub.studentName}
                          </span>
                          {isGraded ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                              Graded: {sub.score}/100
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20">
                              Ungraded
                            </span>
                          )}
                          {sub.isLate && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-red-400 bg-red-500/10">
                              Late Submission
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#777] mt-0.5">
                          {sub.batch} · Submitted: {sub.submittedAt}
                        </div>
                      </div>
                    </div>

                    {sub.attachmentUrl && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-[#AAA]">
                        <span>📎 {sub.attachmentUrl}</span>
                        <button className="text-[#D4A843] hover:underline font-semibold ml-1">
                          View Work
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Feedback and Scoring Form */}
                  <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2">
                      <label className="block text-[11px] font-medium text-[#AAA] mb-1">
                        Teacher Feedback & Qualitative Notes:
                      </label>
                      <input
                        type="text"
                        disabled={isGraded}
                        value={isGraded ? sub.feedback : activeFeedbackInput[sub.id] || ''}
                        onChange={(e) =>
                          setActiveFeedbackInput({ ...activeFeedbackInput, [sub.id]: e.target.value })
                        }
                        placeholder="Add constructive notes or specific rubric feedback..."
                        className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843] disabled:opacity-75"
                      />
                    </div>

                    <div className="flex items-center gap-3 justify-end">
                      <div>
                        <label className="block text-[11px] font-medium text-[#AAA] mb-1">
                          Score (Max 100):
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          disabled={isGraded}
                          value={isGraded ? sub.score! : activeScoreInput[sub.id] || ''}
                          onChange={(e) =>
                            setActiveScoreInput({ ...activeScoreInput, [sub.id]: e.target.value })
                          }
                          placeholder="e.g. 90"
                          className="w-20 px-3 py-2 rounded-xl text-xs text-white text-center font-bold bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843] disabled:opacity-75"
                        />
                      </div>

                      {!isGraded ? (
                        <button
                          type="button"
                          onClick={() => handleGradeSubmit(sub.id)}
                          className="mt-5 px-4 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110 shadow-md"
                          style={{
                            background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                            fontFamily: 'Space Grotesk, sans-serif'
                          }}
                        >
                          Submit Grade
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            // Enable editing
                            setSubmissions(prev =>
                              prev.map(s => (s.id === sub.id ? { ...s, score: null } : s))
                            );
                            setActiveScoreInput({ ...activeScoreInput, [sub.id]: String(sub.score) });
                            setActiveFeedbackInput({ ...activeFeedbackInput, [sub.id]: sub.feedback });
                          }}
                          className="mt-5 px-3 py-2 rounded-xl text-xs font-medium text-[#888] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                        >
                          Edit Grade
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
