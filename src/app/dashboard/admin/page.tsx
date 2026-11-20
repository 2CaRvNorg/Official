'use client';

import Link from 'next/link';
import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';
import { CircularProgressRing } from '@/components/dashboard/StatCard';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/dashboard/admin', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'Institutions', href: '/dashboard/admin/institutions', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label: 'Batches', href: '/dashboard/admin/batches', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { label: 'Users', href: '/dashboard/admin/users', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { label: 'Curriculum', href: '/dashboard/admin/curriculum', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> },
  { label: 'Classes', href: '/dashboard/admin/classes', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> },
  { label: 'Assessment', href: '/dashboard/admin/assessment', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
  { label: 'Reports', href: '/dashboard/admin/reports', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { label: 'Security', href: '/dashboard/admin/security', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { label: 'Settings', href: '/dashboard/admin/settings', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41"/></svg> },
];

const ACTIVITY_DATA = [
  { month: 'Jan', serverLoad: 42, activeUsers: 820, dataRequests: 310 },
  { month: 'Feb', serverLoad: 55, activeUsers: 940, dataRequests: 450 },
  { month: 'Mar', serverLoad: 48, activeUsers: 1050, dataRequests: 380 },
  { month: 'Apr', serverLoad: 61, activeUsers: 1100, dataRequests: 520 },
  { month: 'May', serverLoad: 52, activeUsers: 980, dataRequests: 410 },
  { month: 'Jun', serverLoad: 68, activeUsers: 1200, dataRequests: 600 },
  { month: 'Jul', serverLoad: 73, activeUsers: 1280, dataRequests: 650 },
  { month: 'Aug', serverLoad: 65, activeUsers: 1150, dataRequests: 580 },
  { month: 'Sep', serverLoad: 70, activeUsers: 1300, dataRequests: 700 },
  { month: 'Oct', serverLoad: 78, activeUsers: 1380, dataRequests: 740 },
  { month: 'Nov', serverLoad: 82, activeUsers: 1420, dataRequests: 780 },
  { month: 'Dec', serverLoad: 76, activeUsers: 1360, dataRequests: 720 },
];

const INSTITUTIONS = [
  { name: 'Partner School', sub: 'Enrolled Partner School', head: 'Anthem Schwoner', headRole: 'Primary Contact', batches: 42, status: 'Badged', statusColor: 'orange' },
  { name: 'Partner School', sub: 'Enrolled Partner School', head: 'Jeni Dimav', headRole: 'Primary Contact', batches: 16, status: 'Active', statusColor: 'green' },
  { name: 'Partner School', sub: 'Enrolled Partner School', head: 'Dathan Aiteman', headRole: 'Primary Contact', batches: 2, status: 'Badged', statusColor: 'orange' },
];

const LOGS = [
  { actor: 'Biol Ware', action: 'Batch 10 enrolled by rosshor', time: '05:20 AM' },
  { actor: 'Kommister', action: 'New teacher invite sent', time: '05:29 AM' },
  { actor: 'Bail Kare', action: 'New teacher invite sent', time: '05:20 AM' },
  { actor: 'Stoornister', action: 'New teacher invite sent', time: '05:30 AM' },
  { actor: 'Kolamister', action: 'New teacher invite sent', time: '05:30 PM' },
];

const KPI_STATS = [
  { label: 'Active Institutions', value: 12, progress: 80, color: '#D4A843' },
  { label: 'Total Batches', value: 42, progress: 70, color: '#00BCD4' },
  { label: 'Active Students', value: 1280, progress: 90, color: '#7C4DFF' },
  { label: 'Total Teachers', value: 56, progress: 65, color: '#D4A843' },
  { label: 'Avg. Attendance', value: '94.2%', progress: 94, color: '#4CAF50' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1A1A1A', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 10, padding: '10px 14px' }}>
        <p style={{ color: '#D4A843', fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} style={{ color: entry.color, fontSize: 12, marginBottom: 2 }}>
            {entry.name}: <strong style={{ color: '#fff' }}>{entry.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Super Admin" userRole="Administrator" avatarInitials="SA" />

      {/* Main content - offset for sidebar */}
      <div className="flex-1 flex flex-col md:ml-[220px]">
        <TopBar
          title="Admin Overview"
          subtitle="Global academy metrics"
          notificationCount={1}
          notificationHref="/dashboard/notifications"
          userName="Super Admin"
          avatarInitials="SA"
          alertText="Online student: 1,280"
        />

        <main className="flex-1 p-5 pb-20 md:pb-5 space-y-5">
          {/* Welcome Banner */}
          <div
            className="rounded-xl p-6 flex flex-wrap items-center justify-between gap-4"
            style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.15) 0%, rgba(212,168,67,0.04) 100%)', border: '1px solid rgba(212,168,67,0.2)' }}
          >
            <div>
              <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Welcome back, Admin! 👋
              </h2>
              <p style={{ color: '#888888', fontSize: 14 }}>Quick academy-wide KPIs at a glance.</p>
            </div>
            <button
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-[#D4A843] hover:text-black"
              style={{ border: '1px solid #D4A843', color: '#D4A843', fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Global academy metrics →
            </button>
          </div>

          {/* KPI Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {KPI_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-5 flex flex-col items-center gap-3"
                style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <CircularProgressRing
                  progress={stat.progress}
                  color={stat.color}
                  value={stat.value}
                  size={68}
                  stroke={5}
                />
                <div className="text-xs text-center font-medium" style={{ color: '#888888', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Left wider column */}
            <div className="xl:col-span-2 space-y-5">
              {/* Activity Chart */}
              <GlassCard title="System Health & Platform Activity">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={ACTIVITY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4A843" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#D4A843" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00BCD4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00BCD4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C4DFF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#7C4DFF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
                    <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomTooltip />}/>
                    <Legend wrapperStyle={{ fontSize: 11, color: '#888' }}/>
                    <Area type="monotone" dataKey="serverLoad" name="Server Load" stroke="#D4A843" fill="url(#goldGrad)" strokeWidth={2}/>
                    <Area type="monotone" dataKey="activeUsers" name="Active Users" stroke="#00BCD4" fill="url(#cyanGrad)" strokeWidth={2}/>
                    <Area type="monotone" dataKey="dataRequests" name="Data Requests" stroke="#7C4DFF" fill="url(#purpleGrad)" strokeWidth={2}/>
                  </AreaChart>
                </ResponsiveContainer>
              </GlassCard>

              {/* Institution Management Table */}
              <GlassCard title="Institution Management">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        {['Institution Name', 'Head / Contact', 'Active Batches', 'Status', 'Action'].map((h) => (
                          <th key={h} className="text-left pb-3 pr-4" style={{ color: '#888888', fontSize: 11, fontWeight: 500, fontFamily: 'Space Grotesk, sans-serif' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {INSTITUTIONS.map((inst) => (
                        <tr key={inst.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td className="py-3.5 pr-4 text-white text-sm font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            {inst.name}
                          </td>
                          <td className="py-3.5 pr-4 text-sm" style={{ color: '#888888' }}>{inst.head}</td>
                          <td className="py-3.5 pr-4">
                            <span className="text-sm font-semibold" style={{ color: '#D4A843', fontFamily: 'Space Grotesk, sans-serif' }}>
                              {inst.batches}
                            </span>
                          </td>
                          <td className="py-3.5 pr-4">
                            <span
                              className="px-2.5 py-1 rounded-full text-xs font-medium"
                              style={{
                                background: inst.status === 'Active' ? 'rgba(76,175,80,0.15)' : 'rgba(255,152,0,0.15)',
                                color: inst.status === 'Active' ? '#4CAF50' : '#FF9800',
                                border: `1px solid ${inst.status === 'Active' ? 'rgba(76,175,80,0.3)' : 'rgba(255,152,0,0.3)'}`,
                                fontFamily: 'Space Grotesk, sans-serif',
                              }}
                            >
                              {inst.status}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <button
                              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-[#D4A843] hover:text-black"
                              style={{ border: '1px solid rgba(212,168,67,0.4)', color: '#D4A843', fontFamily: 'Space Grotesk, sans-serif' }}
                            >
                              Create/Edit Batch
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>

            {/* Right narrower column */}
            <div className="space-y-5">
              {/* System Logs */}
              <GlassCard title="Recent System Logs">
                <div className="space-y-1">
                  <div className="grid grid-cols-3 gap-2 pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Actor', 'Action', 'Time'].map((h) => (
                      <span key={h} className="text-xs" style={{ color: '#555', fontFamily: 'Space Grotesk, sans-serif' }}>{h}</span>
                    ))}
                  </div>
                  {LOGS.map((log, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2 py-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <span className="text-xs text-white truncate" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{log.actor}</span>
                      <span className="text-xs truncate" style={{ color: '#888' }}>{log.action}</span>
                      <span className="text-xs" style={{ color: '#555' }}>{log.time}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Quick Actions */}
              <GlassCard title="Quick Actions">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Add Institution', href: '/dashboard/admin/institutions?action=create' },
                    { label: 'Invite User', href: '/dashboard/admin/users?action=create' },
                    { label: 'Configure Roles', href: '/dashboard/admin/users?action=roles' },
                    { label: 'System Audit Logs', href: '/dashboard/admin/security' },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="p-3 rounded-xl text-xs font-bold text-center transition-all hover:brightness-110 active:scale-95 shadow-md"
                      style={{
                        background: 'linear-gradient(135deg, #D4A843 0%, #C49535 100%)',
                        color: '#0D0D0D',
                        fontFamily: 'Space Grotesk, sans-serif',
                      }}
                    >
                      {action.label}
                    </Link>
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
