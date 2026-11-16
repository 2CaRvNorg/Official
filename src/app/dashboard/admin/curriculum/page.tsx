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

interface CurriculumModule {
  id: string;
  title: string;
  subject: string;
  programme: string;
  submittedBy: string;
  version: string;
  status: 'Published' | 'Pending Review' | 'Archived';
  lessonsCount: number;
}

const INITIAL_MODULES: CurriculumModule[] = [
  {
    id: 'MOD-1',
    title: 'Visual Design Fundamentals & Design Thinking',
    subject: 'Designing',
    programme: 'Programme A & B',
    submittedBy: 'Ms. Priya Nair',
    version: 'v2.1',
    status: 'Published',
    lessonsCount: 12,
  },
  {
    id: 'MOD-2',
    title: 'Modern Web Basics: HTML5, CSS Flexbox & Grid',
    subject: 'Technology (Web Basics)',
    programme: 'Programme B',
    submittedBy: 'Mr. Rajesh Kumar',
    version: 'v1.4',
    status: 'Published',
    lessonsCount: 16,
  },
  {
    id: 'MOD-3',
    title: 'Effective Public Speaking & Pitch Presentation',
    subject: 'Communication',
    programme: 'Programme A',
    submittedBy: 'Mr. Arjun Das',
    version: 'v1.0',
    status: 'Pending Review',
    lessonsCount: 8,
  },
  {
    id: 'MOD-4',
    title: 'JavaScript DOM Manipulation & Canvas Basics',
    subject: 'Technology (Web Basics)',
    programme: 'Programme B',
    submittedBy: 'Mr. Rajesh Kumar',
    version: 'v1.1',
    status: 'Pending Review',
    lessonsCount: 10,
  },
];

export default function AdminCurriculumPage() {
  const [modules, setModules] = useState<CurriculumModule[]>(INITIAL_MODULES);
  const [filterSubject, setFilterSubject] = useState('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setModules(prev =>
      prev.map(m => (m.id === id ? { ...m, status: 'Published' } : m))
    );
    setToastMsg('Module approved and published to all authorized cohorts!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filtered = modules.filter(m =>
    filterSubject === 'all' ? true : m.subject === filterSubject
  );

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Super Admin" userRole="Administrator" avatarInitials="SA" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Central Curriculum & Content Library"
          subtitle="Admin approval workflow, master syllabi & multi-cohort reusable lessons"
          notificationCount={2}
          userName="Super Admin"
          avatarInitials="SA"
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
                Curriculum Modules ({modules.length})
              </h2>
              <p className="text-xs text-[#888]">
                PRD REQ-034 & REQ-035: Reusable content library shared across authorized batches with version control
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-3.5 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
              >
                <option value="all">All Subjects</option>
                <option value="Designing">Designing</option>
                <option value="Technology (Web Basics)">Technology (Web Basics)</option>
                <option value="Communication">Communication</option>
              </select>

              <button
                onClick={() => alert('New master module template created in central repository.')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110 flex items-center gap-1.5 shadow-md"
                style={{ background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)' }}
              >
                + Create Master Module
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Published Modules', value: modules.filter(m => m.status === 'Published').length, color: '#4CAF50' },
              { label: 'Pending Admin Review', value: modules.filter(m => m.status === 'Pending Review').length, color: '#FF9800' },
              { label: 'Total Content Units', value: modules.reduce((a, b) => a + b.lessonsCount, 0), color: '#D4A843' },
              { label: 'Active Programmes', value: '2 Programmes', color: '#00BCD4' },
            ].map(m => (
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

          {/* Modules Table */}
          <GlassCard title="Master Syllabus Library & Publishing Approvals">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Module Title & Scope', 'Subject', 'Programme Mapping', 'Author', 'Version', 'Lessons', 'Status', 'Publishing Action'].map(h => (
                      <th key={h} className="text-left pb-3 pr-4 text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map(mod => (
                    <tr key={mod.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-white text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {mod.title}
                        </div>
                        <div className="text-[11px] text-[#777] font-mono mt-0.5">{mod.id}</div>
                      </td>
                      <td className="py-4 pr-4 text-xs font-semibold text-[#D4A843]">
                        {mod.subject}
                      </td>
                      <td className="py-4 pr-4 text-xs text-white/80">
                        {mod.programme}
                      </td>
                      <td className="py-4 pr-4 text-xs text-[#AAA]">
                        {mod.submittedBy}
                      </td>
                      <td className="py-4 pr-4 text-xs font-mono text-cyan-400">
                        {mod.version}
                      </td>
                      <td className="py-4 pr-4 text-xs text-white/90 font-medium">
                        {mod.lessonsCount} Units
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            mod.status === 'Published'
                              ? 'text-emerald-400 bg-emerald-500/15'
                              : 'text-amber-400 bg-amber-500/15'
                          }`}
                        >
                          {mod.status}
                        </span>
                      </td>
                      <td className="py-4">
                        {mod.status === 'Pending Review' ? (
                          <button
                            onClick={() => handleApprove(mod.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#0D0D0D] bg-[#D4A843] hover:brightness-110 shadow-md"
                          >
                            Approve & Publish
                          </button>
                        ) : (
                          <span className="text-xs text-[#666]">Live across batches</span>
                        )}
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
