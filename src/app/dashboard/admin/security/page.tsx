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

interface AuditEntry {
  id: string;
  actor: string;
  role: string;
  action: string;
  entityType: string;
  ipAddress: string;
  timestamp: string;
  severity: 'Info' | 'Notice' | 'Security';
}

const AUDIT_LOGS: AuditEntry[] = [
  { id: 'LOG-881', actor: 'Super Admin', role: 'admin', action: 'Approved financial correction request #TXN-1004', entityType: 'Finance', ipAddress: '157.48.20.11', timestamp: '10 mins ago', severity: 'Notice' },
  { id: 'LOG-882', actor: 'System Gatekeeper', role: 'system', action: 'Failed password attempt threshold triggered for user student.x', entityType: 'Auth', ipAddress: '49.37.112.98', timestamp: '35 mins ago', severity: 'Security' },
  { id: 'LOG-883', actor: 'Ms. Sharma', role: 'teacher', action: 'Published Lesson Module: Kinematics (v1.2)', entityType: 'Curriculum', ipAddress: '106.51.44.12', timestamp: '1 hour ago', severity: 'Info' },
  { id: 'LOG-884', actor: 'Super Admin', role: 'admin', action: 'Bulk CSV Enrolment: Added 3 new learners with temp credentials', entityType: 'UserLifecycle', ipAddress: '157.48.20.11', timestamp: '2 hours ago', severity: 'Info' },
  { id: 'LOG-885', actor: 'Money Management', role: 'money_management', action: 'Recorded fee transaction #TXN-1002 (INR 18,500)', entityType: 'Finance', ipAddress: '122.161.80.3', timestamp: '3 hours ago', severity: 'Notice' },
];

export default function AdminSecurityPage() {
  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Super Admin" userRole="Administrator" avatarInitials="SA" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Security, Audit & Governance"
          subtitle="Immutable system logs, login attempt lockouts & active session monitors"
          notificationCount={1}
          userName="Super Admin"
          avatarInitials="SA"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                System Security & Child Safeguarding Controls
              </h2>
              <p className="text-xs text-[#888]">
                PRD Section 12: Comprehensive audit of administrative mutations, auth attempts & data integrity
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Security State', value: 'Guarded / Clean', color: '#4CAF50' },
              { label: 'Active Sessions', value: '1,280 Learners', color: '#00BCD4' },
              { label: 'Inactivity Expiry', value: '30 Minutes', color: '#D4A843' },
              { label: 'Lockout Limit', value: '5 Failed Tries', color: '#FF9800' },
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

          {/* Audit Logs Table */}
          <GlassCard title="Comprehensive Platform Audit Trail (PRD REQ-089)">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Log ID / Time', 'Actor & Role', 'Action Executed', 'Entity Type', 'Origin IP', 'Severity'].map(h => (
                      <th key={h} className="text-left pb-3 pr-4 text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {AUDIT_LOGS.map(log => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pr-4">
                        <div className="font-mono text-xs font-bold text-white">{log.id}</div>
                        <div className="text-[11px] text-[#777]">{log.timestamp}</div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-white text-xs font-semibold">{log.actor}</div>
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono text-[#D4A843] bg-[#D4A843]/10">
                          {log.role}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-xs text-white/90 max-w-sm">
                        {log.action}
                      </td>
                      <td className="py-4 pr-4 text-xs text-[#AAA]">
                        {log.entityType}
                      </td>
                      <td className="py-4 pr-4 font-mono text-xs text-[#777]">
                        {log.ipAddress}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.severity === 'Security'
                              ? 'text-red-400 bg-red-500/15'
                              : log.severity === 'Notice'
                              ? 'text-amber-400 bg-amber-500/15'
                              : 'text-emerald-400 bg-emerald-500/15'
                          }`}
                        >
                          {log.severity}
                        </span>
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
