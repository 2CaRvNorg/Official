'use client';

import { useState } from 'react';
import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/teacher', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'My Batches', href: '/dashboard/teacher/batches', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { label: 'Calendar', href: '/dashboard/teacher/calendar', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: 'Lesson Builder', href: '/dashboard/teacher/lessons', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  { label: 'Live Classes', href: '/dashboard/teacher/live', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> },
  { label: 'Assignments & Grading', href: '/dashboard/teacher/grading', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg> },
  { label: 'Student Progress', href: '/dashboard/teacher/progress', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
];

const TODAY_CLASSES = [
  { batch: 'Batch 7A — Design', subject: 'Colour Theory & Typography', time: '10:00 AM – 11:00 AM', isLive: true },
  { batch: 'Batch 8B — Web Basics', subject: 'CSS Flexbox & Grid', time: '1:00 PM – 2:00 PM', isLive: false },
  { batch: 'Batch 9A — Design', subject: 'UI/UX Design Thinking', time: '3:30 PM – 4:30 PM', isLive: false },
];

// November 2026 calendar
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EVENTS: Record<number, { label: string; color: string }[]> = {
  3: [{ label: 'Batch 7A', color: '#D4A843' }],
  7: [{ label: 'Quiz', color: '#7C4DFF' }],
  10: [{ label: 'Batch 8B', color: '#00BCD4' }],
  14: [{ label: 'Review', color: '#4CAF50' }],
  17: [{ label: 'Batch 7A', color: '#D4A843' }],
  21: [{ label: 'Holiday', color: '#888888' }],
  24: [{ label: 'Batch 9A', color: '#FF9800' }],
  28: [{ label: 'Finals', color: '#FF5252' }],
};

const BATCH_PROGRESS = [
  { batch: 'Batch 7A', progress: 72 },
  { batch: 'Batch 8B', progress: 55 },
  { batch: 'Batch 9A', progress: 88 },
  { batch: 'Batch 10A', progress: 40 },
];

const STUDENTS_TO_GRADE = [
  { name: 'Priya S.', submission: 'Colour Theory HW', grade: null },
  { name: 'Arjun M.', submission: 'Colour Theory HW', grade: 85 },
  { name: 'Sneha R.', submission: 'Colour Theory HW', grade: null },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1A1A1A', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 10, padding: '10px 14px' }}>
        <p style={{ color: '#D4A843', fontSize: 12, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>{label}</p>
        <p style={{ color: '#fff', fontSize: 12 }}>{payload[0]?.value}% complete</p>
      </div>
    );
  }
  return null;
};

export default function TeacherDashboard() {
  const [selectedHW, setSelectedHW] = useState('Geometry HW 3');
  const [scores, setScores] = useState<Record<string, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});

  // Build November 2026 calendar — Nov 1 is Sunday
  const firstDay = 0; // 0 = Sunday
  const daysInMonth = 30;
  const calendarCells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const today = 11; // today's date in example

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Ms. Priya Nair" userRole="Teacher" avatarInitials="PN" />

      <div className="flex-1 flex flex-col md:ml-[220px]">
        <TopBar
          title="Teacher Dashboard"
          subtitle="November 2026"
          notificationCount={1}
          userName="Ms. Priya Nair"
          avatarInitials="PN"
        />

        <main className="flex-1 p-5 pb-20 md:pb-5">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Left column */}
            <div className="xl:col-span-2 space-y-5">
              {/* Today's Classes */}
              <GlassCard title="Today's Live Classes">
                <div className="space-y-3">
                  {TODAY_CLASSES.map((cls) => (
                    <div
                      key={cls.batch}
                      className="flex items-center justify-between gap-4 p-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <div className="flex items-center gap-3">
                        {cls.isLive && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(255,82,82,0.15)', color: '#FF5252', border: '1px solid rgba(255,82,82,0.3)', fontFamily: 'Space Grotesk, sans-serif' }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>
                            LIVE
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{cls.batch}</div>
                          <div className="text-xs" style={{ color: '#888' }}>{cls.subject} · {cls.time}</div>
                        </div>
                      </div>
                      <button
                        className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:-translate-y-0.5"
                        style={{ background: '#D4A843', color: '#0D0D0D', fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {cls.isLive ? 'Join Now' : 'View Details'}
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Calendar */}
              <GlassCard
                title="Operational Calendar — November 2026"
                action={
                  <span className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(212,168,67,0.1)', color: '#D4A843', border: '1px solid rgba(212,168,67,0.2)', fontFamily: 'Space Grotesk, sans-serif' }}>
                    Monthly View
                  </span>
                }
              >
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {DAYS.map((d) => (
                    <div key={d} className="text-center text-xs font-medium py-1" style={{ color: '#555', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {d}
                    </div>
                  ))}
                </div>
                {/* Cells */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map((day, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg p-1.5 min-h-[52px] flex flex-col"
                      style={{
                        background: day === today ? 'rgba(212,168,67,0.12)' : 'transparent',
                        border: day === today ? '1px solid rgba(212,168,67,0.3)' : '1px solid transparent',
                      }}
                    >
                      {day && (
                        <>
                          <span
                            className="text-xs font-medium mb-0.5"
                            style={{ color: day === today ? '#D4A843' : '#888', fontFamily: 'Space Grotesk, sans-serif' }}
                          >
                            {day}
                          </span>
                          {EVENTS[day]?.map((ev, ei) => (
                            <span
                              key={ei}
                              className="text-[9px] px-1.5 py-0.5 rounded font-medium truncate"
                              style={{ background: `${ev.color}25`, color: ev.color, fontFamily: 'Space Grotesk, sans-serif' }}
                            >
                              {ev.label}
                            </span>
                          ))}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Lesson Builder */}
              <GlassCard title="Lesson Builder: Kinematics">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: '#888', fontFamily: 'Space Grotesk, sans-serif' }}>Learning Goal</label>
                    <textarea
                      className="w-full p-3 rounded-xl text-sm text-white resize-none outline-none focus:border-[#D4A843] transition-colors"
                      rows={2}
                      placeholder="Students will understand uniform motion and acceleration..."
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.8)' }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-2 block" style={{ color: '#888', fontFamily: 'Space Grotesk, sans-serif' }}>Concept Explanation</label>
                    <textarea
                      className="w-full p-3 rounded-xl text-sm text-white resize-none outline-none focus:border-[#D4A843] transition-colors"
                      rows={3}
                      placeholder="Kinematics is the branch of classical mechanics that describes the motion of points, objects, and systems of bodies..."
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.8)' }}
                    />
                  </div>
                  {/* File upload area */}
                  <div
                    className="rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-all hover:border-[#D4A843]"
                    style={{ border: '1.5px dashed rgba(255,255,255,0.15)', textAlign: 'center' }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <div className="text-xs" style={{ color: '#555' }}>Drop files here or <span style={{ color: '#D4A843' }}>browse</span></div>
                    <div className="text-xs" style={{ color: '#444' }}>PDF, PPT, MP4 — up to 50MB</div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{ border: '1px solid rgba(255,255,255,0.15)', color: '#888', fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      Save Draft
                    </button>
                    <button
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
                      style={{ background: '#D4A843', color: '#0D0D0D', fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      Publish
                    </button>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Grading Panel */}
              <GlassCard title="Homework Grading Panel">
                <div className="space-y-4">
                  {/* Dropdown */}
                  <select
                    value={selectedHW}
                    onChange={(e) => setSelectedHW(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {['Geometry HW 3', 'Colour Theory HW 1', 'CSS Layout HW 2'].map((hw) => (
                      <option key={hw} value={hw} style={{ background: '#1A1A1A' }}>{hw}</option>
                    ))}
                  </select>

                  {/* Student submissions */}
                  {STUDENTS_TO_GRADE.map((student) => (
                    <div
                      key={student.name}
                      className="rounded-xl p-4 space-y-3"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {student.name}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: student.grade ? 'rgba(76,175,80,0.15)' : 'rgba(255,152,0,0.15)',
                            color: student.grade ? '#4CAF50' : '#FF9800',
                            border: `1px solid ${student.grade ? 'rgba(76,175,80,0.3)' : 'rgba(255,152,0,0.3)'}`,
                            fontFamily: 'Space Grotesk, sans-serif',
                          }}
                        >
                          {student.grade ? `Graded: ${student.grade}/100` : 'Ungraded'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          placeholder="Score (0-100)"
                          value={scores[student.name] || ''}
                          onChange={(e) => setScores((s) => ({ ...s, [student.name]: e.target.value }))}
                          className="flex-1 p-2 rounded-lg text-xs text-white outline-none"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Inter, sans-serif' }}
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Feedback..."
                        value={feedbacks[student.name] || ''}
                        onChange={(e) => setFeedbacks((f) => ({ ...f, [student.name]: e.target.value }))}
                        className="w-full p-2 rounded-lg text-xs text-white resize-none outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Inter, sans-serif' }}
                      />
                      <button
                        className="w-full py-2 rounded-lg text-xs font-semibold transition-all hover:-translate-y-0.5"
                        style={{ background: '#D4A843', color: '#0D0D0D', fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        Submit Grade
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Analytics */}
              <GlassCard title="Analytics & Progress">
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={BATCH_PROGRESS} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                    <XAxis dataKey="batch" tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill: '#666', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]}/>
                    <Tooltip content={<CustomTooltip />}/>
                    <Bar dataKey="progress" name="% Complete" fill="#D4A843" radius={[4, 4, 0, 0]} maxBarSize={28}/>
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
