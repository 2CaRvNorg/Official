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

interface LessonItem {
  id: string;
  title: string;
  subject: string;
  batch: string;
  goal: string;
  contentType: 'Video' | 'Notes' | 'Quiz' | 'Interactive';
  version: number;
  status: 'Published' | 'Draft' | 'Pending Approval';
  lastUpdated: string;
}

const INITIAL_LESSONS: LessonItem[] = [
  {
    id: 'l1',
    title: 'Kinematics: Velocity & Position Vectors',
    subject: 'Technology (Web Basics)',
    batch: 'Batch 7A - Design & Comm',
    goal: 'Understand vectors and apply them in 2D coordinate canvas graphics',
    contentType: 'Interactive',
    version: 2,
    status: 'Published',
    lastUpdated: 'Today at 09:30 AM',
  },
  {
    id: 'l2',
    title: 'Visual Hierarchy & Golden Ratio',
    subject: 'Designing',
    batch: 'Batch 7A - Design & Comm',
    goal: 'Learn layout balance, proportions, and UI whitespace',
    contentType: 'Video',
    version: 1,
    status: 'Published',
    lastUpdated: 'Yesterday',
  },
  {
    id: 'l3',
    title: 'CSS Grid & Responsive Spatial Cards',
    subject: 'Technology (Web Basics)',
    batch: 'Batch 8B - Web & Design',
    goal: 'Master grid-template-columns and glassmorphism styling',
    contentType: 'Interactive',
    version: 1,
    status: 'Pending Approval',
    lastUpdated: '2 days ago',
  },
];

export default function LessonBuilderPage() {
  const [lessons, setLessons] = useState<LessonItem[]>(INITIAL_LESSONS);
  const [activeTab, setActiveTab] = useState<'create' | 'library'>('create');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Builder form state
  const [lessonTitle, setLessonTitle] = useState('Kinematics: Spatial Coordinates & Canvas Animation');
  const [subject, setSubject] = useState('Technology (Web Basics)');
  const [batch, setBatch] = useState('Batch 7A - Design & Comm');
  const [learningGoal, setLearningGoal] = useState('By the end of this module, learners will create an interactive bouncing particle using vector mathematics.');
  const [conceptExplanation, setConceptExplanation] = useState('In computer graphics, every point on screen has an (X, Y) coordinate. When we add velocity vectors (Vx, Vy) in each animation frame, motion is simulated smoothly.');
  const [practiceActivities, setPracticeActivities] = useState('Task 1: Change ball color on wall collision.\nTask 2: Add gravity acceleration vector (+0.2y per tick).');
  const [contentType, setContentType] = useState<'Video' | 'Notes' | 'Quiz' | 'Interactive'>('Interactive');
  const [selectedFile, setSelectedFile] = useState<string | null>('kinematics_canvas_starter.zip');

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    const newLesson: LessonItem = {
      id: `l-${Date.now()}`,
      title: lessonTitle,
      subject,
      batch,
      goal: learningGoal,
      contentType,
      version: 1,
      status: 'Draft',
      lastUpdated: 'Just now',
    };
    setLessons([newLesson, ...lessons]);
    triggerToast('Lesson saved to drafts successfully!');
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const newLesson: LessonItem = {
      id: `l-${Date.now()}`,
      title: lessonTitle,
      subject,
      batch,
      goal: learningGoal,
      contentType,
      version: 1,
      status: 'Published',
      lastUpdated: 'Just now',
    };
    setLessons([newLesson, ...lessons]);
    triggerToast('Lesson published! Enrolled learners can now access this material.');
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Ms. Sharma" userRole="Teacher · Designing" avatarInitials="MS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Interactive Lesson Builder"
          subtitle="Support goals, explanation, exploration, practice & review"
          notificationCount={2}
          userName="Ms. Sharma"
          avatarInitials="MS"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          {saveToast && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between">
              <span>✓ {saveToast}</span>
              <button onClick={() => setSaveToast(null)} className="text-white/50 hover:text-white">✕</button>
            </div>
          )}

          {/* Action Header & Mode Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Lesson Workshop
              </h2>
              <p className="text-xs text-[#888]">
                Construct structured 6-phase lessons with protected video, practice code, and auto-quizzes
              </p>
            </div>

            <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'create'
                    ? 'bg-[#D4A843] text-[#0D0D0D] shadow-md'
                    : 'text-[#888] hover:text-white'
                }`}
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Lesson Editor
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'library'
                    ? 'bg-[#D4A843] text-[#0D0D0D] shadow-md'
                    : 'text-[#888] hover:text-white'
                }`}
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Published Library ({lessons.length})
              </button>
            </div>
          </div>

          {activeTab === 'create' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Left Column: Main Editor */}
              <div className="lg:col-span-2 space-y-5">
                <GlassCard title="1. Lesson Overview & Core Identity">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-[#AAA] mb-1.5">
                        Lesson Topic / Title *
                      </label>
                      <input
                        type="text"
                        value={lessonTitle}
                        onChange={(e) => setLessonTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-sm font-semibold text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#AAA] mb-1.5">Target Subject</label>
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                        >
                          <option value="Designing">Designing</option>
                          <option value="Technology (Web Basics)">Technology (Web Basics)</option>
                          <option value="Communication">Communication</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#AAA] mb-1.5">Assigned Batch</label>
                        <select
                          value={batch}
                          onChange={(e) => setBatch(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                        >
                          <option value="Batch 7A - Design & Comm">Batch 7A - Design & Comm</option>
                          <option value="Batch 8B - Web & Design">Batch 8B - Web & Design</option>
                          <option value="Batch 9A - Web & Design">Batch 9A - Web & Design</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#AAA] mb-1.5">
                        Learning Goal (PRD REQ-033 Component)
                      </label>
                      <textarea
                        rows={2}
                        value={learningGoal}
                        onChange={(e) => setLearningGoal(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                      />
                    </div>
                  </div>
                </GlassCard>

                <GlassCard title="2. Concept Explanation & Practice Activities">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-[#AAA] mb-1.5">
                        Concept Explanation (Rich Theory & Real-World Analogy)
                      </label>
                      <textarea
                        rows={4}
                        value={conceptExplanation}
                        onChange={(e) => setConceptExplanation(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#AAA] mb-1.5">
                        Practice & Check-Understanding Activities
                      </label>
                      <textarea
                        rows={3}
                        value={practiceActivities}
                        onChange={(e) => setPracticeActivities(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-xs font-mono text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                      />
                    </div>

                    {/* Attachment / Starter Code */}
                    <div className="p-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#D4A843]/10 border border-[#D4A843]/30 flex items-center justify-center text-[#D4A843]">
                          📁
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">{selectedFile || 'No files attached'}</div>
                          <div className="text-[11px] text-[#777]">Downloadable starter resources & code templates</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile('design_assets_pack_v1.zip')}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/80 hover:text-white bg-white/10 hover:bg-white/15 transition-colors"
                      >
                        Change File
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Right Column: Content Type & Publishing Actions */}
              <div className="space-y-5">
                <GlassCard title="Format & Delivery">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-[#AAA] mb-2">Content Mode</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['Interactive', 'Video', 'Notes', 'Quiz'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setContentType(type)}
                            className={`p-3 rounded-xl text-xs font-bold transition-all text-center border ${
                              contentType === type
                                ? 'bg-[#D4A843]/20 border-[#D4A843] text-[#D4A843]'
                                : 'bg-[#1A1A1A] border-white/10 text-white/70 hover:text-white'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
                      <div className="flex justify-between text-[#888]">
                        <span>Author:</span>
                        <span className="text-white font-medium">Ms. Sharma</span>
                      </div>
                      <div className="flex justify-between text-[#888]">
                        <span>Version:</span>
                        <span className="text-[#D4A843] font-mono font-bold">v1.2 (Active)</span>
                      </div>
                      <div className="flex justify-between text-[#888]">
                        <span>Approval Policy:</span>
                        <span className="text-emerald-400">Direct Publishing</span>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2.5">
                      <button
                        onClick={handlePublish}
                        className="w-full py-3.5 rounded-xl font-bold text-xs text-[#0D0D0D] transition-all hover:brightness-110 shadow-lg flex items-center justify-center gap-2"
                        style={{
                          background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                          fontFamily: 'Space Grotesk, sans-serif'
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Publish to Students
                      </button>

                      <button
                        onClick={handleSaveDraft}
                        className="w-full py-2.5 rounded-xl font-semibold text-xs text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                      >
                        Save as Draft
                      </button>
                    </div>
                  </div>
                </GlassCard>

                {/* PRD Compliance Callout */}
                <div className="p-4 rounded-xl bg-[#D4A843]/5 border border-[#D4A843]/20 text-xs space-y-1.5">
                  <div className="font-bold text-[#D4A843]">PRD REQ-037 Protected Playback:</div>
                  <p className="text-[#AAA] text-[11px] leading-relaxed">
                    Uploaded video lectures are distributed via signed short-lived tokens and dynamic user watermarking to protect minors and prevent unauthorized scraping.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* TAB: PUBLISHED LIBRARY */
            <GlassCard title="Central Curriculum & Published Repository">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      {['Lesson Title', 'Subject & Batch', 'Format', 'Version', 'Status', 'Last Updated', 'Actions'].map((h) => (
                        <th key={h} className="text-left pb-3 pr-4 text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {lessons.map((lesson) => (
                      <tr key={lesson.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 pr-4">
                          <div className="font-semibold text-white text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            {lesson.title}
                          </div>
                          <div className="text-xs text-[#888] truncate max-w-xs">{lesson.goal}</div>
                        </td>
                        <td className="py-3.5 pr-4 text-xs">
                          <div className="text-[#D4A843] font-medium">{lesson.subject}</div>
                          <div className="text-[#777]">{lesson.batch}</div>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium text-white/90 bg-white/10">
                            {lesson.contentType}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-xs font-mono text-white/80">
                          v{lesson.version}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              lesson.status === 'Published'
                                ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                                : lesson.status === 'Draft'
                                ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                                : 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                            }`}
                          >
                            {lesson.status}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-xs text-[#777]">
                          {lesson.lastUpdated}
                        </td>
                        <td className="py-3.5">
                          <button
                            onClick={() => {
                              setLessonTitle(lesson.title);
                              setLearningGoal(lesson.goal);
                              setActiveTab('create');
                            }}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#D4A843] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
                          >
                            Edit Lesson
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}
        </main>
      </div>
    </div>
  );
}
