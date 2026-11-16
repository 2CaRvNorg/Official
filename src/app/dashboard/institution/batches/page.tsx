'use client';

import { useState } from 'react';
import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/institution', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'Batches & Progress', href: '/dashboard/institution/batches', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { label: 'Student Roster', href: '/dashboard/institution/students', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { label: 'Teacher Schedule', href: '/dashboard/institution/schedule', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: 'Support & Alerts', href: '/dashboard/institution/alerts', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> },
  { label: 'Reports', href: '/dashboard/institution/reports', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
];

export default function InstitutionBatchesPage() {
  const BATCHES = [
    { name: 'Batch A - 7th Grade', programme: 'Designing + Communication', students: 42, completion: '84%', attendance: '95%' },
    { name: 'Batch B - 8th Grade', programme: 'Technology (Web Basics) + Designing', students: 38, completion: '72%', attendance: '92%' },
    { name: 'Batch C - 9th Grade', programme: 'Designing + Communication', students: 45, completion: '78%', attendance: '90%' },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Amit Sen" userRole="Institution Head" avatarInitials="AS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Campus Batches & Progress Monitoring"
          subtitle="Hitech City Branch · Authorized cohort visibility (PRD REQ-018)"
          notificationCount={4}
          userName="Amit Sen"
          avatarInitials="AS"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BATCHES.map((b, idx) => (
              <GlassCard key={idx} title={b.name}>
                <div className="space-y-3">
                  <div className="text-xs text-[#D4A843] font-medium">{b.programme}</div>
                  <div className="flex justify-between text-xs text-[#AAA] pt-2 border-t border-white/[0.06]">
                    <span>Enrolled: {b.students}</span>
                    <span>Avg Att: {b.attendance}</span>
                  </div>
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-[#888]">Checkpoint Completion:</span>
                      <span className="font-mono text-emerald-400 font-bold">{b.completion}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-[#D4A843]" style={{ width: b.completion }} />
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
