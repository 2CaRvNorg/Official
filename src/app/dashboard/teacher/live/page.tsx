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

interface LiveSession {
  id: string;
  title: string;
  subject: string;
  batch: string;
  time: string;
  meetUrl: string;
  isLiveNow: boolean;
  attendanceImported: boolean;
}

interface StudentAttendance {
  studentId: string;
  name: string;
  meetDetected: 'Present' | 'Absent';
  finalStatus: 'Present' | 'Absent' | 'Late' | 'Excused';
  adjusted: boolean;
}

const INITIAL_SESSIONS: LiveSession[] = [
  {
    id: 's1',
    title: 'Kinematics & Vector Math in Canvas',
    subject: 'Technology (Web Basics)',
    batch: 'Batch 7A - Design & Comm',
    time: '10:00 AM – 11:00 AM',
    meetUrl: 'https://meet.google.com/abc-2carvn-xyz',
    isLiveNow: true,
    attendanceImported: true,
  },
  {
    id: 's2',
    title: 'Visual Balance & Color Contrast Principles',
    subject: 'Designing',
    batch: 'Batch 7A - Design & Comm',
    time: '01:00 PM – 02:00 PM',
    meetUrl: 'https://meet.google.com/def-2carvn-uvw',
    isLiveNow: false,
    attendanceImported: false,
  },
  {
    id: 's3',
    title: 'CSS Grid & Modern Web Layouts',
    subject: 'Technology (Web Basics)',
    batch: 'Batch 8B - Web & Design',
    time: '03:30 PM – 04:30 PM',
    meetUrl: 'https://meet.google.com/ghi-2carvn-rst',
    isLiveNow: false,
    attendanceImported: false,
  },
];

const INITIAL_ATTENDANCE: StudentAttendance[] = [
  { studentId: '1', name: 'Rohit Sharma', meetDetected: 'Present', finalStatus: 'Present', adjusted: false },
  { studentId: '2', name: 'Aarav Kumar', meetDetected: 'Absent', finalStatus: 'Late', adjusted: true },
  { studentId: '3', name: 'Priya Reddy', meetDetected: 'Present', finalStatus: 'Present', adjusted: false },
  { studentId: '4', name: 'Kiran Patel', meetDetected: 'Absent', finalStatus: 'Absent', adjusted: false },
  { studentId: '5', name: 'Meera Joshi', meetDetected: 'Present', finalStatus: 'Present', adjusted: false },
];

export default function TeacherLivePage() {
  const [sessions, setSessions] = useState<LiveSession[]>(INITIAL_ATTENDANCE.length ? INITIAL_SESSIONS : []);
  const [attendance, setAttendance] = useState<StudentAttendance[]>(INITIAL_ATTENDANCE);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState('s1');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Class Form State
  const [newTitle, setNewTitle] = useState('');
  const [newBatch, setNewBatch] = useState('Batch 7A - Design & Comm');
  const [newSubject, setNewSubject] = useState('Designing');
  const [newDate, setNewDate] = useState('2026-11-12');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newDuration, setNewDuration] = useState('60 mins');
  const [isRecurring, setIsRecurring] = useState(false);

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newClass: LiveSession = {
      id: `s-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      batch: newBatch,
      time: `${newTime} (${newDuration})`,
      meetUrl: `https://meet.google.com/${Math.random().toString(36).substring(7)}`,
      isLiveNow: false,
      attendanceImported: false,
    };

    setSessions([newClass, ...sessions]);
    setShowScheduleModal(false);
    setNewTitle('');
    setToastMsg('Google Meet class scheduled! Automated reminders queued (15m before & start).');
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleStatusChange = (studentId: string, newStatus: 'Present' | 'Absent' | 'Late' | 'Excused') => {
    setAttendance(prev =>
      prev.map(item =>
        item.studentId === studentId
          ? {
              ...item,
              finalStatus: newStatus,
              adjusted: newStatus !== item.meetDetected,
            }
          : item
      )
    );
  };

  const activeSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Ms. Sharma" userRole="Teacher · Designing" avatarInitials="MS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Live Classes & Timetable"
          subtitle="Google Meet scheduling, recurring timetables & attendance audit"
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

          {/* Action Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Google Meet Live Sessions
              </h2>
              <p className="text-xs text-[#888]">
                Schedule live instruction and verify provisional Google Meet attendance (PRD REQ-053)
              </p>
            </div>

            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110 flex items-center gap-1.5 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Schedule Google Meet Class
            </button>
          </div>

          {/* Live Sessions Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sessions.map((cls) => {
              const isSelected = cls.id === selectedSessionId;
              return (
                <div
                  key={cls.id}
                  onClick={() => setSelectedSessionId(cls.id)}
                  className={`rounded-2xl p-4 cursor-pointer transition-all border ${
                    cls.isLiveNow
                      ? 'border-[#D4A843] shadow-[0_0_20px_rgba(212,168,67,0.15)] bg-gradient-to-br from-[#D4A843]/10 to-transparent'
                      : isSelected
                      ? 'border-white/30 bg-white/[0.04]'
                      : 'border-white/[0.08] bg-[#141414] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#D4A843] uppercase tracking-wider">
                      {cls.subject}
                    </span>
                    {cls.isLiveNow && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-red-400 bg-red-500/15 border border-red-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        LIVE NOW
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {cls.title}
                  </h3>
                  <div className="text-xs text-[#888] mb-3">{cls.batch} · {cls.time}</div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                    <a
                      href={cls.meetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#0D0D0D] bg-[#D4A843] hover:brightness-110 transition-all flex items-center gap-1"
                    >
                      <span>Join Meet</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                      </svg>
                    </a>

                    <span className="text-[11px] text-[#888]">
                      {cls.attendanceImported ? 'Attendance Imported' : 'Attendance Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Attendance Review & Teacher Correction Panel (PRD REQ-053 & REQ-054) */}
          <GlassCard title={`Attendance Verification: ${activeSession?.title || 'Selected Class'}`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <p className="text-[#888]">
                Google Meet provisional attendance is imported automatically. As assigned teacher, please review and make manual corrections where needed.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-semibold">
                  Present: {attendance.filter(a => a.finalStatus === 'Present').length}
                </span>
                <span className="text-[#777]">|</span>
                <span className="text-amber-400 font-semibold">
                  Late: {attendance.filter(a => a.finalStatus === 'Late').length}
                </span>
                <span className="text-[#777]">|</span>
                <span className="text-red-400 font-semibold">
                  Absent: {attendance.filter(a => a.finalStatus === 'Absent').length}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Enrolled Learner', 'Google Meet Detected', 'Teacher Confirmed Status', 'Audit Status', 'Quick Actions'].map((h) => (
                      <th key={h} className="text-left pb-3 pr-4 text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {attendance.map((att) => (
                    <tr key={att.studentId} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pr-4">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(att.studentId, att.finalStatus === 'Present' ? 'Absent' : 'Present')}
                          aria-label={`Mark ${att.name} ${att.finalStatus === 'Present' ? 'absent' : 'present'}`}
                          title="Click to toggle Present / Absent"
                          className="font-semibold text-white text-sm hover:text-[#D4A843] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4A843] rounded"
                          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                        >
                          {att.name}
                        </button>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                            att.meetDetected === 'Present'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-red-400 bg-red-500/10'
                          }`}
                        >
                          {att.meetDetected}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-bold ${
                            att.finalStatus === 'Present'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : att.finalStatus === 'Late'
                              ? 'text-amber-400 bg-amber-500/10'
                              : att.finalStatus === 'Excused'
                              ? 'text-cyan-400 bg-cyan-500/10'
                              : 'text-red-400 bg-red-500/10'
                          }`}
                        >
                          {att.finalStatus}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-xs">
                        {att.adjusted ? (
                          <span className="text-amber-400 font-semibold flex items-center gap-1">
                            <span>✏️</span> Adjusted by Teacher
                          </span>
                        ) : (
                          <span className="text-[#666]">Confirmed as detected</span>
                        )}
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleStatusChange(att.studentId, 'Late')}
                            className="px-2 py-1 rounded text-[11px] font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                          >
                            Late
                          </button>
                          <button
                            onClick={() => handleStatusChange(att.studentId, 'Excused')}
                            className="px-2 py-1 rounded text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20"
                          >
                            Excused
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </main>
      </div>

      {/* Schedule Live Class Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-2xl p-6 relative"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Schedule Live Google Meet Class
                </h3>
                <p className="text-xs text-[#888]">Generates meeting link & queues in-app notifications</p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#AAA] mb-1">Class Topic / Session Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Layout Prototyping & Glassmorphism Design"
                  className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Subject</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                  >
                    <option value="Designing">Designing</option>
                    <option value="Technology (Web Basics)">Technology (Web Basics)</option>
                    <option value="Communication">Communication</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Batch</label>
                  <select
                    value={newBatch}
                    onChange={(e) => setNewBatch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                  >
                    <option value="Batch 7A - Design & Comm">Batch 7A - Design & Comm</option>
                    <option value="Batch 8B - Web & Design">Batch 8B - Web & Design</option>
                    <option value="Batch 9A - Web & Design">Batch 9A - Web & Design</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Duration</label>
                  <select
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                  >
                    <option value="45 mins">45 mins</option>
                    <option value="60 mins">60 mins</option>
                    <option value="90 mins">90 mins</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rec"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded bg-[#1A1A1A] border-white/10 text-[#D4A843]"
                />
                <label htmlFor="rec" className="text-xs text-[#AAA] cursor-pointer">
                  Recurring weekly class schedule (Mon / Wed / Fri)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110"
                  style={{
                    background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  Confirm & Schedule Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
