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

interface AssignmentItem {
  id: string;
  title: string;
  subject: string;
  courseId: CourseId;
  dueDate: string;
  totalMarks: number;
  status: 'Pending' | 'Submitted' | 'Graded';
  score?: number;
  feedback?: string;
}

const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'a1',
    title: 'Geometry HW 3: Vector Layouts & Spatial Composition',
    subject: 'Design',
    courseId: 'design',
    dueDate: 'Tomorrow at 11:59 PM',
    totalMarks: 100,
    status: 'Pending',
  },
  {
    id: 'a2',
    title: 'Web Basics Lab 2: Flexbox & Grid Cards',
    subject: 'Tech',
    courseId: 'tech',
    dueDate: 'Completed on 10 Nov',
    totalMarks: 100,
    status: 'Graded',
    score: 92,
    feedback: 'Flawless layout logic and clean semantic HTML markup. Excellent work!',
  },
  {
    id: 'a3',
    title: 'Communication Speech: Pitching Your Digital Project',
    subject: 'Communication',
    courseId: 'communication',
    dueDate: '16 Nov 2026',
    totalMarks: 50,
    status: 'Pending',
  },
];

export default function StudentAssignmentsPage() {
  const { courses, error, isLoading } = useStudentCourses();
  const [assignments, setAssignments] = useState<AssignmentItem[]>(INITIAL_ASSIGNMENTS);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('a3');
  const [submissionText, setSubmissionText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const visibleAssignments = courses ? assignments.filter(item => courses.includes(item.courseId)) : [];
  const selected = visibleAssignments.find(a => a.id === selectedAssignmentId) || visibleAssignments[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText && !fileName) {
      alert('Please enter your project reflection or attach your submission file.');
      return;
    }

    setAssignments(prev =>
      prev.map(a =>
        a.id === selectedAssignmentId
          ? { ...a, status: 'Submitted' }
          : a
      )
    );

    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 3500);
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Rohit Sharma" userRole="Student · Grade 7" avatarInitials="RS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Assignments & Projects"
          subtitle="Submit coursework, review rubrics & read teacher feedback"
          notificationCount={2}
          userName="Rohit Sharma"
          avatarInitials="RS"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          {error ? (
            <div role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>
          ) : isLoading || !courses ? (
            <p role="status" className="text-sm text-[#888]">Checking your course access…</p>
          ) : !selected ? (
            <p className="text-sm text-[#888]">No assignments are available for your course bundle.</p>
          ) : (
          <>
          {submittedSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between shadow-lg">
              <span>✓ Assignment submitted to your teacher! Status is now under review.</span>
              <button onClick={() => setSubmittedSuccess(false)} className="text-white/50 hover:text-white">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left Column: Assignments List */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Course Assignments
              </h2>

              <div className="space-y-3">
                {visibleAssignments.map((item) => {
                  const isSelected = item.id === selectedAssignmentId;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedAssignmentId(item.id)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'border-[#D4A843] bg-[#D4A843]/10 shadow-md'
                          : 'border-white/[0.08] bg-[#141414] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold text-[#D4A843] uppercase tracking-wider">
                          {item.subject}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.status === 'Graded'
                              ? 'text-emerald-400 bg-emerald-500/15'
                              : item.status === 'Submitted'
                              ? 'text-cyan-400 bg-cyan-500/15'
                              : 'text-amber-400 bg-amber-500/15'
                          }`}
                        >
                          {item.status === 'Graded' ? `${item.score}/${item.totalMarks}` : item.status}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-white mb-1 leading-snug" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {item.title}
                      </h3>
                      <div className="text-[11px] text-[#777]">Due: {item.dueDate}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Submission Workshop */}
            <div className="lg:col-span-2 space-y-4">
              <GlassCard title={selected.title}>
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06] text-xs">
                    <div>
                      <span className="text-[#888]">Subject:</span>{' '}
                      <span className="text-[#D4A843] font-semibold">{selected.subject}</span>
                    </div>
                    <div>
                      <span className="text-[#888]">Total Marks:</span>{' '}
                      <span className="text-white font-semibold">{selected.totalMarks} Points</span>
                    </div>
                    <div>
                      <span className="text-[#888]">Due Date:</span>{' '}
                      <span className="text-white font-semibold">{selected.dueDate}</span>
                    </div>
                  </div>

                  {selected.status === 'Graded' ? (
                    /* Graded View */
                    <div className="p-5 rounded-2xl bg-[#0D0D0D] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                          ✓ Grade Finalized
                        </span>
                        <span className="text-xl font-bold text-[#D4A843]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {selected.score} / {selected.totalMarks} Marks
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#AAA] mb-1">Teacher Feedback:</div>
                        <p className="text-xs text-white/90 leading-relaxed italic bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                          "{selected.feedback}"
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Submission Form */
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-[#AAA] mb-1.5">
                          Project Reflection / Written Notes *
                        </label>
                        <textarea
                          rows={4}
                          value={submissionText}
                          onChange={(e) => setSubmissionText(e.target.value)}
                          placeholder="Describe your design choices, concepts applied, and any challenges encountered..."
                          className="w-full px-4 py-3 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                        />
                      </div>

                      {/* File Upload Area */}
                      <div>
                        <label className="block text-xs font-medium text-[#AAA] mb-1.5">
                          Upload File / Design Prototype (.fig, .pdf, .zip, .html)
                        </label>
                        <div
                          onClick={() => setFileName('rohit_sharma_final_project.zip')}
                          className="p-6 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-[#D4A843]/10 text-[#D4A843] flex items-center justify-center text-xl mb-2">
                            📁
                          </div>
                          {fileName ? (
                            <div className="text-xs font-bold text-emerald-400">
                              ✓ Attached: {fileName}
                            </div>
                          ) : (
                            <div>
                              <div className="text-xs font-semibold text-white">Click or Drag & Drop Project File</div>
                              <div className="text-[11px] text-[#777] mt-0.5">Maximum file size 25MB</div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                        <span className="text-[11px] text-[#777]">
                          ⚠️ PRD REQ-041: Submissions past deadline are marked with a late penalty.
                        </span>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110 shadow-lg"
                          style={{
                            background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                            fontFamily: 'Space Grotesk, sans-serif'
                          }}
                        >
                          Submit Assignment →
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
          </>
          )}
        </main>
      </div>
    </div>
  );
}
