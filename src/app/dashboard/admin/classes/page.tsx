'use client';

import { useState } from 'react';
import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/dashboard/admin', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'Institutions', href: '/dashboard/admin/institutions', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label: 'Batches', href: '/dashboard/admin/batches', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { label: 'Users', href: '/dashboard/admin/users', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { label: 'Finance & Accounts', href: '/dashboard/admin/finance', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { label: 'Curriculum', href: '/dashboard/admin/curriculum', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> },
  { label: 'Classes', href: '/dashboard/admin/classes', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> },
  { label: 'Assessment', href: '/dashboard/admin/assessment', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { label: 'Reports', href: '/dashboard/admin/reports', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { label: 'Security', href: '/dashboard/admin/security', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { label: 'Settings', href: '/dashboard/admin/settings', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg> },
];

interface ClassSlot {
  id: string;
  topic: string;
  institution: string;
  batch: string;
  teacher: string;
  time: string;
  meetUrl: string;
  isLive: boolean;
  attendanceRate: string;
}

const INITIAL_CLASSES: ClassSlot[] = [
  {
    id: 'CLS-101',
    topic: 'Kinematics & Vector Math in Canvas',
    institution: 'Partner School Alpha',
    batch: 'Batch 7A - Design & Comm',
    teacher: 'Ms. Sharma',
    time: '10:00 AM – 11:00 AM',
    meetUrl: 'https://meet.google.com/abc-2carvn-xyz',
    isLive: true,
    attendanceRate: '96% (27/28)',
  },
  {
    id: 'CLS-102',
    topic: 'CSS Grid & Modern Web Layouts',
    institution: 'Partner School Alpha',
    batch: 'Batch 8B - Web & Design',
    teacher: 'Mr. Rajesh Kumar',
    time: '01:00 PM – 02:00 PM',
    meetUrl: 'https://meet.google.com/def-2carvn-uvw',
    isLive: false,
    attendanceRate: 'Upcoming',
  },
  {
    id: 'CLS-103',
    topic: 'Visual Balance & Typography Contrast',
    institution: 'Partner School Beta',
    batch: 'Batch 9A - Web & Design',
    teacher: 'Ms. Priya Nair',
    time: '03:30 PM – 04:30 PM',
    meetUrl: 'https://meet.google.com/ghi-2carvn-rst',
    isLive: false,
    attendanceRate: 'Upcoming',
  },
];

export default function AdminClassesPage() {
  const [classes] = useState<ClassSlot[]>(INITIAL_CLASSES);
  const [selectedInst, setSelectedInst] = useState('all');

  const filtered = classes.filter(c =>
    selectedInst === 'all' ? true : c.institution === selectedInst
  );

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Super Admin" userRole="Administrator" avatarInitials="SA" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Academy Live Classes Oversight"
          subtitle="Google Meet schedule, active sessions & campus attendance audit"
          notificationCount={2}
          userName="Super Admin"
          avatarInitials="SA"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                All Cohort Schedules
              </h2>
              <p className="text-xs text-[#888]">
                Central Google Meet tracking with automated participant detection & teacher adjustments
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={selectedInst}
                onChange={(e) => setSelectedInst(e.target.value)}
                className="px-3.5 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
              >
                <option value="all">All Partner Schools</option>
                <option value="Partner School Alpha">Partner School Alpha</option>
                <option value="Partner School Beta">Partner School Beta</option>
              </select>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Sessions Today', value: '8 Scheduled', color: '#D4A843' },
              { label: 'Currently Live', value: '1 Active Class', color: '#FF5252' },
              { label: 'Avg Attendance', value: '94.2%', color: '#4CAF50' },
              { label: 'Integrations', value: 'Google Meet', color: '#00BCD4' },
            ].map(m => (
              <div
                key={m.label}
                className="rounded-xl p-4 flex flex-col justify-between"
                style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-xs text-[#888] font-medium">{m.label}</span>
                <span className="text-xl font-bold mt-2" style={{ color: m.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Class List Table */}
          <GlassCard title="Master Live Sessions Ledger">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Session Topic', 'Institution & Batch', 'Faculty Assigned', 'Schedule Time', 'Live Status', 'Attendance Import', 'Meet Link'].map(h => (
                      <th key={h} className="text-left pb-3 pr-4 text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map(cls => (
                    <tr key={cls.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-white text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {cls.topic}
                        </div>
                        <div className="text-[11px] text-[#777] font-mono mt-0.5">{cls.id}</div>
                      </td>
                      <td className="py-4 pr-4 text-xs">
                        <div className="text-white/90 font-medium">{cls.institution}</div>
                        <div className="text-[#D4A843]">{cls.batch}</div>
                      </td>
                      <td className="py-4 pr-4 text-xs text-[#AAA]">
                        {cls.teacher}
                      </td>
                      <td className="py-4 pr-4 text-xs text-white/80 font-mono">
                        {cls.time}
                      </td>
                      <td className="py-4 pr-4">
                        {cls.isLive ? (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-red-400 bg-red-500/15 border border-red-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            LIVE NOW
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-[#888] bg-white/5">
                            Scheduled
                          </span>
                        )}
                      </td>
                      <td className="py-4 pr-4 text-xs font-semibold text-emerald-400">
                        {cls.attendanceRate}
                      </td>
                      <td className="py-4">
                        <a
                          href={cls.meetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#0D0D0D] bg-[#D4A843] hover:brightness-110 flex items-center gap-1 w-max"
                        >
                          Join Session →
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
