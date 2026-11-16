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

export default function TeacherBatchesPage() {
  const [selectedBatch, setSelectedBatch] = useState('b1');

  const BATCHES = [
    { id: 'b1', name: 'Batch 7A - Design & Comm', grade: 'Grade 7', students: 28, subject: 'Designing', avgAttendance: '94.2%', progress: '78%' },
    { id: 'b2', name: 'Batch 8B - Web & Design', grade: 'Grade 8', students: 30, subject: 'Designing', avgAttendance: '91.0%', progress: '65%' },
  ];

  const STUDENTS = [
    { id: '1', name: 'Rohit Sharma', attendance: '96%', avgScore: '92/100', status: 'Exemplary' },
    { id: '2', name: 'Aarav Kumar', attendance: '72%', avgScore: '78/100', status: 'Intervention Flag' },
    { id: '3', name: 'Priya Reddy', attendance: '98%', avgScore: '95/100', status: 'Exemplary' },
    { id: '4', name: 'Kiran Patel', attendance: '88%', avgScore: '84/100', status: 'Good Progress' },
    { id: '5', name: 'Meera Joshi', attendance: '92%', avgScore: '89/100', status: 'Good Progress' },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Ms. Sharma" userRole="Teacher · Designing" avatarInitials="MS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Assigned Batches & Student Directory"
          subtitle="Scoped to batches and subjects under teacher allocation (PRD REQ-019)"
          notificationCount={2}
          userName="Ms. Sharma"
          avatarInitials="MS"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Assigned Teaching Cohorts
              </h2>
              <p className="text-xs text-[#888]">
                Enforce teacher boundaries: Access restricted to authorized student profiles
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BATCHES.map(b => (
              <div
                key={b.id}
                onClick={() => setSelectedBatch(b.id)}
                className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                  selectedBatch === b.id
                    ? 'border-[#D4A843] bg-[#D4A843]/10 shadow-lg'
                    : 'border-white/[0.08] bg-[#141414] hover:border-white/20'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-[#D4A843] uppercase tracking-wider">{b.subject}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white/90 bg-white/10">{b.grade}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {b.name}
                </h3>
                <div className="text-xs text-[#AAA] flex items-center gap-4 mt-3 pt-3 border-t border-white/[0.06]">
                  <span>{b.students} Learners</span>
                  <span>•</span>
                  <span>Avg Att: {b.avgAttendance}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{b.progress} Syllabus Done</span>
                </div>
              </div>
            ))}
          </div>

          {/* Student Roster in this batch */}
          <GlassCard title="Learner Roster & Attendance Matrix">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Student Name', 'Attendance Rate', 'Average Score', 'Learning Status', 'Action'].map(h => (
                      <th key={h} className="text-left pb-3 pr-4 text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {STUDENTS.map(s => (
                    <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pr-4 font-semibold text-white text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {s.name}
                      </td>
                      <td className="py-3.5 pr-4 text-xs font-mono text-white/90">
                        {s.attendance}
                      </td>
                      <td className="py-3.5 pr-4 text-xs font-mono font-bold text-[#D4A843]">
                        {s.avgScore}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.status === 'Exemplary'
                              ? 'text-emerald-400 bg-emerald-500/15'
                              : s.status === 'Intervention Flag'
                              ? 'text-red-400 bg-red-500/15'
                              : 'text-cyan-400 bg-cyan-500/15'
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <a
                          href={`/dashboard/teacher/grading`}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#D4A843] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
                        >
                          Review Work →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}
