'use client';

import { useState } from 'react';
import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';
import MiniSparkline from '@/components/dashboard/MiniSparkline';

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/institution', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'Batches & Progress', href: '/dashboard/institution/batches', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { label: 'Student Roster', href: '/dashboard/institution/students', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { label: 'Teacher Schedule', href: '/dashboard/institution/schedule', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: 'Support & Alerts', href: '/dashboard/institution/alerts', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> },
  { label: 'Reports', href: '/dashboard/institution/reports', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
];

const QUICK_STATS = [
  { label: 'Active Batches', value: 12, icon: '📚', color: '#D4A843' },
  { label: 'Enrolled Students', value: 450, icon: '🎓', color: '#00BCD4' },
  { label: 'Teacher Attendance', value: '96%', icon: '👩‍🏫', color: '#4CAF50' },
  { label: 'Support Alerts', value: 4, icon: '⚠️', color: '#FF9800' },
];

const BATCHES = [
  {
    name: 'Batch A — 7th Grade',
    subject: 'Design + Communication',
    checkpoints: [100, 90, 70, 20, 0],
    labels: ['Week 1', 'Week 4', 'Week 8', 'Week 16', 'Week 24'],
    color: '#D4A843',
    progress: 55,
  },
  {
    name: 'Batch B — 8th Grade',
    subject: 'Web Basics + Design',
    checkpoints: [100, 85, 50, 0, 0],
    labels: ['Week 1', 'Week 4', 'Week 8', 'Week 16', 'Week 24'],
    color: '#00BCD4',
    progress: 38,
  },
  {
    name: 'Batch C — 9th Grade',
    subject: 'Design + Communication',
    checkpoints: [100, 95, 88, 60, 10],
    labels: ['Week 1', 'Week 4', 'Week 8', 'Week 16', 'Week 24'],
    color: '#7C4DFF',
    progress: 72,
  },
];

const STUDENTS = [
  { name: 'Aarav Kumar', batch: 'Batch A', attendance: 68, sparkline: [70, 65, 60, 72, 68] },
  { name: 'Meera Joshi', batch: 'Batch B', attendance: 94, sparkline: [90, 95, 92, 94, 93] },
  { name: 'Rahul Singh', batch: 'Batch C', attendance: 88, sparkline: [80, 85, 90, 88, 86] },
  { name: 'Priya Reddy', batch: 'Batch A', attendance: 97, sparkline: [95, 96, 98, 97, 97] },
  { name: 'Kiran Patel', batch: 'Batch C', attendance: 75, sparkline: [80, 76, 72, 74, 75] },
];

const TEACHER_SCHEDULES = [
  { name: 'Ms. Priya Nair', subject: 'Design · Batch A', time: '10:00–11:00 AM', day: 'Mon, Wed, Fri' },
  { name: 'Mr. Rahul Verma', subject: 'Web Dev · Batch B', time: '1:00–2:00 PM', day: 'Tue, Thu' },
  { name: 'Ms. Anjali Roy', subject: 'Communication · Batch A', time: '3:00–4:00 PM', day: 'Mon, Wed' },
  { name: 'Mr. Dev Kumar', subject: 'Design · Batch C', time: '11:00 AM–12:00 PM', day: 'Tue, Thu, Sat' },
];

const ALERTS = [
  {
    student: 'Aarav K.',
    issue: 'Low attendance (3 missed classes)',
    severity: 'high',
    batch: 'Batch A',
  },
  {
    student: 'Batch C',
    issue: 'Missed assignment submission deadline',
    severity: 'medium',
    batch: 'Batch C',
  },
];

export default function InstitutionDashboard() {
  const [branch, setBranch] = useState('Hitech City Branch');

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Amit Sen" userRole="Institution Head" avatarInitials="AS" />

      <div className="flex-1 flex flex-col md:ml-[220px]">
        {/* Custom top bar with branch selector */}
        <header
          className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 px-5 py-3"
          style={{ background: 'rgba(13,13,13,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Branch selector */}
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white outline-none"
            style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)', color: '#D4A843', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {['Hitech City Branch', 'Madhapur Branch', 'Gachibowli Branch'].map((b) => (
              <option key={b} value={b} style={{ background: '#1A1A1A', color: '#fff' }}>{b}</option>
            ))}
          </select>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input type="text" placeholder="Search..." className="bg-transparent outline-none text-xs text-white placeholder:text-[#555555] w-28"/>
            </div>
            <button className="relative p-2 rounded-xl hover:bg-white/5" aria-label="Notifications">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: '#D4A843', color: '#0D0D0D', fontFamily: 'Space Grotesk, sans-serif' }}>4</span>
            </button>
            {/* Date filter */}
            <div className="px-3 py-2 rounded-xl text-xs font-medium" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', color: '#888', fontFamily: 'Space Grotesk, sans-serif' }}>
              Nov 2026
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(212,168,67,0.2)', color: '#D4A843', border: '1px solid rgba(212,168,67,0.3)', fontFamily: 'Space Grotesk, sans-serif' }}>
              AS
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 pb-20 md:pb-5 space-y-5">
          {/* Welcome Banner */}
          <div
            className="rounded-xl p-5"
            style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.18) 0%, rgba(13,13,13,0) 100%)', border: '1px solid rgba(212,168,67,0.2)' }}
          >
            <p className="text-xs mb-1" style={{ color: '#888' }}>Institution Head · {branch}</p>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Hello, Amit Sen! 👋 Welcome back.
            </h2>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {QUICK_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-5 flex items-center gap-4"
                style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}25` }}
                >
                  {stat.icon}
                </div>
                <div>
                  <div className="text-xl font-bold" style={{ color: stat.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {stat.value}
                  </div>
                  <div className="text-xs" style={{ color: '#888' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Left */}
            <div className="xl:col-span-2 space-y-5">
              {/* Batch Progress */}
              <GlassCard title="Batch Progress">
                <div className="space-y-5">
                  {BATCHES.map((batch) => (
                    <div key={batch.name}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            {batch.name}
                          </div>
                          <div className="text-xs mt-0.5" style={{ color: '#666' }}>{batch.subject}</div>
                        </div>
                        <span className="text-sm font-bold" style={{ color: batch.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                          {batch.progress}%
                        </span>
                      </div>
                      {/* Stacked progress bar with checkpoint markers */}
                      <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div
                          className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${batch.progress}%`, background: `linear-gradient(90deg, ${batch.color}, ${batch.color}aa)` }}
                        />
                      </div>
                      {/* Checkpoint labels */}
                      <div className="flex justify-between mt-1">
                        {batch.labels.map((label) => (
                          <span key={label} className="text-[9px]" style={{ color: '#444', fontFamily: 'Space Grotesk, sans-serif' }}>
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Student Attendance Table */}
              <GlassCard title="Student Attendance & Performance">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        {['Name', 'Batch', 'Attendance %', 'Tracker'].map((h) => (
                          <th key={h} className="text-left pb-3 pr-4" style={{ color: '#555', fontSize: 11, fontWeight: 500, fontFamily: 'Space Grotesk, sans-serif' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {STUDENTS.map((student) => (
                        <tr key={student.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{ background: 'rgba(212,168,67,0.15)', color: '#D4A843', fontFamily: 'Space Grotesk, sans-serif' }}
                              >
                                {student.name[0]}
                              </div>
                              <span className="text-sm font-medium text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                                {student.name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-xs" style={{ color: '#888' }}>{student.batch}</td>
                          <td className="py-3 pr-4">
                            <span
                              className="text-sm font-bold"
                              style={{
                                color: student.attendance >= 90 ? '#4CAF50' : student.attendance >= 75 ? '#FF9800' : '#FF5252',
                                fontFamily: 'Space Grotesk, sans-serif',
                              }}
                            >
                              {student.attendance}%
                            </span>
                          </td>
                          <td className="py-3">
                            <MiniSparkline
                              values={student.sparkline}
                              color={student.attendance >= 90 ? '#4CAF50' : student.attendance >= 75 ? '#FF9800' : '#FF5252'}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Teacher Schedules */}
              <GlassCard title="Teacher Schedules">
                <div className="space-y-3">
                  {TEACHER_SCHEDULES.map((teacher) => (
                    <div
                      key={teacher.name}
                      className="p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <div className="text-sm font-semibold text-white mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {teacher.name}
                      </div>
                      <div className="text-xs mb-1" style={{ color: '#888' }}>{teacher.subject}</div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: '#666' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {teacher.time} · {teacher.day}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Alerts */}
              <GlassCard title="Urgent Support & Intervention Alerts">
                <div className="space-y-3">
                  {ALERTS.map((alert, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl"
                      style={{
                        background: alert.severity === 'high' ? 'rgba(255,82,82,0.06)' : 'rgba(255,152,0,0.06)',
                        border: `1px solid ${alert.severity === 'high' ? 'rgba(255,82,82,0.3)' : 'rgba(255,152,0,0.3)'}`,
                      }}
                    >
                      <div className="flex items-start gap-2 mb-3">
                        <span className="text-lg">{alert.severity === 'high' ? '🚨' : '⚠️'}</span>
                        <div>
                          <div className="text-sm font-semibold text-white mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            {alert.student}
                          </div>
                          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                            {alert.issue}
                          </div>
                        </div>
                      </div>
                      <button
                        className="w-full py-2 rounded-lg text-xs font-semibold transition-all hover:-translate-y-0.5"
                        style={{
                          background: alert.severity === 'high' ? 'rgba(255,82,82,0.15)' : 'rgba(255,152,0,0.15)',
                          border: `1px solid ${alert.severity === 'high' ? 'rgba(255,82,82,0.4)' : 'rgba(255,152,0,0.4)'}`,
                          color: alert.severity === 'high' ? '#FF5252' : '#FF9800',
                          fontFamily: 'Space Grotesk, sans-serif',
                        }}
                      >
                        Action required →
                      </button>
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
