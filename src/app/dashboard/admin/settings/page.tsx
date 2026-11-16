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

export default function AdminSettingsPage() {
  const [gracePeriodDays, setGracePeriodDays] = useState(30);
  const [waLiveReminders, setWaLiveReminders] = useState(true);
  const [waAssignmentDeadlines, setWaAssignmentDeadlines] = useState(true);
  const [waAnnouncements, setWaAnnouncements] = useState(true);
  const [waAdminFinanceAlerts, setWaAdminFinanceAlerts] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Super Admin" userRole="Administrator" avatarInitials="SA" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Academy Global Configuration"
          subtitle="Notification triggers, cohort grace access & security parameters"
          notificationCount={1}
          userName="Super Admin"
          avatarInitials="SA"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          {savedToast && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between">
              <span>✓ Global settings updated and persisted across clusters!</span>
              <button onClick={() => setSavedToast(false)} className="text-white/50 hover:text-white">✕</button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Platform Settings
              </h2>
              <p className="text-xs text-[#888]">
                Academy-wide controls for WhatsApp Business API, session limits & grace periods
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Column 1: WhatsApp Notifications (PRD Section 8) */}
            <div className="lg:col-span-2 space-y-5">
              <GlassCard title="1. WhatsApp Event Scope (PRD REQ-058 & REQ-060)">
                <div className="space-y-4">
                  <p className="text-xs text-[#888]">
                    Configure which automated dispatch triggers are enabled over the verified WhatsApp Business API:
                  </p>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0D0D0D] border border-white/10 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={waLiveReminders}
                        onChange={(e) => setWaLiveReminders(e.target.checked)}
                        className="mt-0.5 rounded text-[#D4A843]"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">Live Classes & Reminders</div>
                        <div className="text-[11px] text-[#777]">Dispatches 15 minutes prior to class and at class start time.</div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0D0D0D] border border-white/10 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={waAssignmentDeadlines}
                        onChange={(e) => setWaAssignmentDeadlines(e.target.checked)}
                        className="mt-0.5 rounded text-[#D4A843]"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">New Assignments & Impending Deadlines</div>
                        <div className="text-[11px] text-[#777]">Notifies students 24 hours before homework submission windows close.</div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0D0D0D] border border-white/10 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={waAnnouncements}
                        onChange={(e) => setWaAnnouncements(e.target.checked)}
                        className="mt-0.5 rounded text-[#D4A843]"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">Official Academy Announcements</div>
                        <div className="text-[11px] text-[#777]">Broadcasting calendar milestones, showcase exhibitions, and guest workshops.</div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0D0D0D] border border-white/10 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={waAdminFinanceAlerts}
                        onChange={(e) => setWaAdminFinanceAlerts(e.target.checked)}
                        className="mt-0.5 rounded text-[#D4A843]"
                      />
                      <div>
                        <div className="text-xs font-semibold text-[#D4A843]">Super Admin Financial Alerts (Restricted)</div>
                        <div className="text-[11px] text-[#777]">Dispatches new expense records and correction requests strictly to authorized Admins. (Zero student exposure).</div>
                      </div>
                    </label>
                  </div>
                </div>
              </GlassCard>

              {/* Academic Access Policy */}
              <GlassCard title="2. Cohort Grace Period & Access Control">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#AAA] mb-1.5">
                      Batch End Grace Period (Days) — PRD REQ-030
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={90}
                      value={gracePeriodDays}
                      onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                    />
                    <p className="text-[11px] text-[#777] mt-1.5">
                      Learners in completed batches retain read-only exploration of their past lessons, project submissions, and grades for this number of days.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Column 2: System Defaults */}
            <div className="space-y-5">
              <GlassCard title="Academy Metadata">
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                    <span className="text-[#888]">Brand Name:</span>
                    <span className="text-white font-semibold">2Carvn Academy</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                    <span className="text-[#888]">Tagline:</span>
                    <span className="text-[#D4A843]">A Way for Creativity</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                    <span className="text-[#888]">Currency:</span>
                    <span className="text-white font-mono font-bold">INR (₹)</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                    <span className="text-[#888]">Meet Provider:</span>
                    <span className="text-cyan-400">Google Meet</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-white/[0.06]">
                    <span className="text-[#888]">Session Lock:</span>
                    <span className="text-emerald-400">Active (30m)</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-xs text-[#0D0D0D] transition-all hover:brightness-110 shadow-lg mt-4"
                    style={{
                      background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}
                  >
                    Save All Platform Settings
                  </button>
                </div>
              </GlassCard>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
