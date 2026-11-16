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

export default function AdminAssessmentPage() {
  const [minPassScore, setMinPassScore] = useState(60);
  const [minAttendance, setMinAttendance] = useState(80);
  const [weightHomework, setWeightHomework] = useState(40);
  const [weightProjects, setWeightProjects] = useState(30);
  const [weightParticipation, setWeightParticipation] = useState(10);
  const [weightFinalExam, setWeightFinalExam] = useState(20);
  const [saveToast, setSaveToast] = useState(false);

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Super Admin" userRole="Administrator" avatarInitials="SA" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Assessment & Certificate Rules"
          subtitle="Configure grading scales, weightages & auditable graduation criteria"
          notificationCount={1}
          userName="Super Admin"
          avatarInitials="SA"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          {saveToast && (
            <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between">
              <span>✓ Assessment and graduation policy updated! Stored in auditable rule version history.</span>
              <button onClick={() => setSaveToast(false)} className="text-white/50 hover:text-white">✕</button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Grading Policy & Certification Standards
              </h2>
              <p className="text-xs text-[#888]">
                PRD REQ-042 & REQ-044: Custom grading rules and versioned completion criteria
              </p>
            </div>
          </div>

          <form onSubmit={handleSavePolicy} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Column 1: Assessment Weightages */}
            <div className="lg:col-span-2 space-y-5">
              <GlassCard title="1. Overall Mark Distribution (% Weightage)">
                <div className="space-y-4">
                  <p className="text-xs text-[#888]">
                    Define how final grade percentages are synthesized across coursework categories:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#0D0D0D] border border-white/10 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white">Homework & Assignments</span>
                        <span className="font-mono text-[#D4A843] font-bold">{weightHomework}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={weightHomework}
                        onChange={(e) => setWeightHomework(Number(e.target.value))}
                        className="w-full accent-[#D4A843]"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-[#0D0D0D] border border-white/10 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white">Hands-on Capstone Projects</span>
                        <span className="font-mono text-[#D4A843] font-bold">{weightProjects}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={weightProjects}
                        onChange={(e) => setWeightProjects(Number(e.target.value))}
                        className="w-full accent-[#D4A843]"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-[#0D0D0D] border border-white/10 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white">Live Class Participation</span>
                        <span className="font-mono text-[#D4A843] font-bold">{weightParticipation}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={weightParticipation}
                        onChange={(e) => setWeightParticipation(Number(e.target.value))}
                        className="w-full accent-[#D4A843]"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-[#0D0D0D] border border-white/10 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white">Final Comprehensive Assessment</span>
                        <span className="font-mono text-[#D4A843] font-bold">{weightFinalExam}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={weightFinalExam}
                        onChange={(e) => setWeightFinalExam(Number(e.target.value))}
                        className="w-full accent-[#D4A843]"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex justify-between items-center text-xs">
                    <span className="text-[#888]">Sum of Weightages:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {weightHomework + weightProjects + weightParticipation + weightFinalExam}%
                    </span>
                  </div>
                </div>
              </GlassCard>

              {/* Certificate Template Preview */}
              <GlassCard title="2. Certificate of Achievement Structure">
                <div
                  className="rounded-2xl p-6 border border-[#D4A843]/40 space-y-4 text-center relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.08) 0%, rgba(13,13,13,0.95) 100%)' }}
                >
                  <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-[#D4A843]/20 border border-[#D4A843]">
                    🎓
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-widest uppercase" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    2CARVN ACADEMY CERTIFICATE
                  </h3>
                  <p className="text-xs text-[#AAA] max-w-sm mx-auto">
                    This credential certifies that the recipient has satisfactorily completed the 6-Month Intensive Programme with distinguished proficiency.
                  </p>
                  <div className="pt-2 flex justify-center items-center gap-6 text-[11px] font-mono text-[#D4A843]">
                    <span>Rule Ver: v2026.11</span>
                    <span>•</span>
                    <span>Signatories: Founder CEO & MD CFO</span>
                    <span>•</span>
                    <span>Unique Hash Verified</span>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Column 2: Eligibility Rules */}
            <div className="space-y-5">
              <GlassCard title="Graduation Criteria">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#AAA] mb-1">
                      Minimum Passing Score (%):
                    </label>
                    <input
                      type="number"
                      min={40}
                      max={90}
                      value={minPassScore}
                      onChange={(e) => setMinPassScore(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold text-white bg-[#1A1A1A] border border-white/10 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#AAA] mb-1">
                      Minimum Live Attendance (%):
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={100}
                      value={minAttendance}
                      onChange={(e) => setMinAttendance(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl text-xs font-mono font-bold text-white bg-[#1A1A1A] border border-white/10 outline-none"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] space-y-2 text-xs">
                    <div className="text-white font-semibold">Mandatory Requirements:</div>
                    <div className="text-[#888] flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> Both parallel subjects completed
                    </div>
                    <div className="text-[#888] flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> All capstone milestones submitted
                    </div>
                    <div className="text-[#888] flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span> Zero unresolved honor code flags
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-xs text-[#0D0D0D] transition-all hover:brightness-110 shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                      fontFamily: 'Space Grotesk, sans-serif'
                    }}
                  >
                    Save & Lock Policy Rules
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
