'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/dashboard/admin', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'Institutions', href: '/dashboard/admin/institutions', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label: 'Batches', href: '/dashboard/admin/batches', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { label: 'Users', href: '/dashboard/admin/users', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { label: 'Curriculum', href: '/dashboard/admin/curriculum', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> },
  { label: 'Classes', href: '/dashboard/admin/classes', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> },
  { label: 'Assessment', href: '/dashboard/admin/assessment', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
  { label: 'Reports', href: '/dashboard/admin/reports', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { label: 'Security', href: '/dashboard/admin/security', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { label: 'Settings', href: '/dashboard/admin/settings', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2M4.93 19.07l1.41-1.41M19.07 19.07l-1.41-1.41"/></svg> },
];

interface InstitutionRecord {
  id: string;
  name: string;
  code: string;
  headUserId: string | null;
  headName: string | null;
  headEmail: string | null;
  headPhone: string | null;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  branchesCount: number;
  batchesCount: number;
  studentsCount: number;
  status: string;
  createdAt: string;
}

interface EligibleHead {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
}

interface Feedback {
  type: 'success' | 'error';
  message: string;
}

function statusLabel(value: string) {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
    .join(' ');
}

export default function InstitutionsPage() {
  const router = useRouter();
  const [institutions, setInstitutions] = useState<InstitutionRecord[]>([]);
  const [eligibleHeads, setEligibleHeads] = useState<EligibleHead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newHeadUserId, setNewHeadUserId] = useState('');
  const [newBranchName, setNewBranchName] = useState('');
  const [newContactPerson, setNewContactPerson] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const [assigningInstitution, setAssigningInstitution] = useState<InstitutionRecord | null>(null);
  const [assignHeadUserId, setAssignHeadUserId] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  const loadInstitutionData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await fetch('/api/admin/institutions', { cache: 'no-store' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(typeof result?.error === 'string' ? result.error : 'Failed to load institutions.');
      }
      setInstitutions(Array.isArray(result.institutions) ? result.institutions : []);
      setEligibleHeads(Array.isArray(result.eligibleHeads) ? result.eligibleHeads : []);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load institutions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInstitutionData();
  }, [loadInstitutionData]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('action') !== 'create') return;

    setShowCreateModal(true);
    router.replace('/dashboard/admin/institutions', { scroll: false });
  }, [router]);

  const assignedHeadIds = useMemo(
    () => new Set(institutions.map((institution) => institution.headUserId).filter(Boolean)),
    [institutions],
  );

  const activeHeads = useMemo(
    () => eligibleHeads.filter((head) => head.status === 'active' && !assignedHeadIds.has(head.id)),
    [eligibleHeads, assignedHeadIds],
  );

  const filtered = institutions.filter((institution) => {
    const query = searchQuery.toLowerCase();
    return (
      institution.name.toLowerCase().includes(query) ||
      institution.code.toLowerCase().includes(query) ||
      (institution.headName ?? '').toLowerCase().includes(query) ||
      (institution.headEmail ?? '').toLowerCase().includes(query)
    );
  });

  const totals = useMemo(() => ({
    branches: institutions.reduce((total, institution) => total + institution.branchesCount, 0),
    batches: institutions.reduce((total, institution) => total + institution.batchesCount, 0),
    students: institutions.reduce((total, institution) => total + institution.studentsCount, 0),
  }), [institutions]);

  const resetCreateForm = () => {
    setNewName('');
    setNewCode('');
    setNewHeadUserId('');
    setNewBranchName('');
    setNewContactPerson('');
    setNewEmail('');
    setNewPhone('');
    setCreateError(null);
  };

  const openCreateModal = () => {
    resetCreateForm();
    setShowCreateModal(true);
  };

  const closeCreateModal = () => {
    if (isCreating) return;
    setShowCreateModal(false);
    resetCreateForm();
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsCreating(true);
    setCreateError(null);

    try {
      const response = await fetch('/api/admin/institutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          code: newCode,
          head_user_id: newHeadUserId || null,
          branch_name: newBranchName,
          contact_person: newContactPerson,
          email: newEmail,
          phone: newPhone,
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(typeof result?.error === 'string' ? result.error : 'Failed to create institution.');
      }

      setShowCreateModal(false);
      resetCreateForm();
      setFeedback({ type: 'success', message: `${newName.trim()} was created successfully.` });
      await loadInstitutionData();
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : 'Failed to create institution.');
    } finally {
      setIsCreating(false);
    }
  };

  const openAssignModal = (institution: InstitutionRecord) => {
    setAssigningInstitution(institution);
    setAssignHeadUserId(institution.headUserId ?? '');
    setAssignError(null);
  };

  const closeAssignModal = () => {
    if (isAssigning) return;
    setAssigningInstitution(null);
    setAssignError(null);
  };

  const handleAssignHead = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!assigningInstitution) return;

    setIsAssigning(true);
    setAssignError(null);

    try {
      const response = await fetch(`/api/admin/institutions?id=${encodeURIComponent(assigningInstitution.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ head_user_id: assignHeadUserId || null }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(typeof result?.error === 'string' ? result.error : 'Failed to assign institution head.');
      }

      const head = eligibleHeads.find((candidate) => candidate.id === assignHeadUserId);
      setAssigningInstitution(null);
      setFeedback({
        type: 'success',
        message: head
          ? `${head.fullName} was assigned to ${assigningInstitution.name}.`
          : `${assigningInstitution.name} now has no assigned head.`,
      });
      await loadInstitutionData();
    } catch (error) {
      setAssignError(error instanceof Error ? error.message : 'Failed to assign institution head.');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Super Admin" userRole="Administrator" avatarInitials="SA" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Institution Management"
          subtitle="Partner schools, campuses & assigned institution heads"
          notificationCount={1}
          userName="Super Admin"
          avatarInitials="SA"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          {feedback && (
            <div
              role="status"
              className={`flex items-start justify-between gap-4 rounded-xl border p-3.5 text-xs font-semibold ${
                feedback.type === 'success'
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                  : 'border-red-500/30 bg-red-500/10 text-red-400'
              }`}
            >
              <span>{feedback.message}</span>
              <button type="button" onClick={() => setFeedback(null)} className="text-white/50 hover:text-white" aria-label="Dismiss message">
                ✕
              </button>
            </div>
          )}

          {loadError && (
            <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400">
              <span>{loadError}</span>
              <button
                type="button"
                onClick={() => void loadInstitutionData()}
                className="rounded-lg border border-red-500/30 px-3 py-1.5 font-bold hover:bg-red-500/10"
              >
                Retry
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Partner Institutions ({institutions.length})
              </h2>
              <p className="text-xs text-[#888]">
                Manage affiliated schools, campuses, and assign one institution head per institution
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search institutions..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="px-3.5 py-2 pl-9 rounded-xl text-xs text-white placeholder:text-[#555] outline-none"
                  style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110 flex items-center gap-1.5 shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Institution
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Institutions', value: institutions.length, color: '#D4A843' },
              { label: 'Active Branches', value: totals.branches, color: '#00BCD4' },
              { label: 'Active Batches', value: totals.batches, color: '#7C4DFF' },
              { label: 'Enrolled Learners', value: totals.students, color: '#4CAF50' },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl p-4 flex flex-col justify-between"
                style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-xs text-[#888] font-medium">{metric.label}</span>
                <span className="text-2xl font-bold mt-2" style={{ color: metric.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {metric.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <GlassCard title="Institutions & Branch Roster">
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Institution / Code', 'Institution Head', 'Branches', 'Batches', 'Students', 'Status', 'Actions'].map((heading) => (
                      <th key={heading} className="text-left pb-3 pr-4 text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-sm text-[#888]">Loading institutions…</td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-sm text-[#888]">
                        {institutions.length === 0
                          ? 'No institutions have been registered yet.'
                          : 'No institutions match your search.'}
                      </td>
                    </tr>
                  ) : (
                    filtered.map((institution) => (
                      <tr key={institution.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 pr-4">
                          <div className="font-semibold text-white text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            {institution.name}
                          </div>
                          <div className="text-[11px] text-[#D4A843] font-mono mt-0.5">
                            {institution.code}
                          </div>
                        </td>
                        <td className="py-4 pr-4">
                          {institution.headName ? (
                            <>
                              <div className="text-white text-sm">{institution.headName}</div>
                              <div className="text-xs text-[#777]">{institution.headEmail || institution.headPhone || 'Institution head'}</div>
                            </>
                          ) : (
                            <>
                              <div className="text-sm font-medium text-amber-400">Unassigned</div>
                              <div className="text-xs text-[#777]">Assign an institution head</div>
                            </>
                          )}
                        </td>
                        <td className="py-4 pr-4 text-sm font-semibold text-white/90 whitespace-normal overflow-wrap:break-word">
                          {institution.branchesCount}
                        </td>
                        <td className="py-4 pr-4">
                          <span className="px-2 py-0.5 rounded-md text-xs font-bold text-[#D4A843] bg-[#D4A843]/10 border border-[#D4A843]/20">
                            {institution.batchesCount} Batches
                          </span>
                        </td>
                        <td className="py-4 pr-4 text-sm text-white/80 font-medium">
                          {institution.studentsCount} Learners
                        </td>
                        <td className="py-4 pr-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            institution.status.toLowerCase() === 'active'
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                              : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                          }`}>
                            {statusLabel(institution.status)}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openAssignModal(institution)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#D4A843] hover:text-white bg-[#D4A843]/10 hover:bg-[#D4A843]/20 border border-[#D4A843]/20 transition-colors"
                            >
                              Assign Head
                            </button>
                            <a
                              href={`/dashboard/admin/batches?institution=${institution.id}`}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white/70 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
                            >
                              View Batches
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </main>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Add Partner Institution
                </h3>
                <p className="text-xs text-[#888]">Register a school or academic partner and optionally assign its head</p>
              </div>
              <button
                type="button"
                onClick={closeCreateModal}
                className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                aria-label="Close create institution dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Institution Full Name *</label>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    value={newName}
                    onChange={(event) => setNewName(event.target.value)}
                    placeholder="e.g. Greenwood International School"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Unique Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={40}
                    value={newCode}
                    onChange={(event) => setNewCode(event.target.value.toUpperCase())}
                    placeholder="e.g. GWIS-01"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843] uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Initial Campus / Branch</label>
                  <input
                    type="text"
                    maxLength={120}
                    value={newBranchName}
                    onChange={(event) => setNewBranchName(event.target.value)}
                    placeholder="e.g. Main Campus"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAA] mb-1">Institution Head</label>
                <select
                  value={newHeadUserId}
                  onChange={(event) => setNewHeadUserId(event.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                >
                  <option value="">Unassigned</option>
                  {activeHeads.map((head) => (
                    <option key={head.id} value={head.id}>
                      {head.fullName} {head.email ? `— ${head.email}` : ''}
                    </option>
                  ))}
                </select>
                {activeHeads.length === 0 && (
                  <p className="mt-1 text-[11px] text-amber-400">
                    No active institution head users found. Create one from the{' '}
                    <a href="/dashboard/admin/users?action=create" className="underline">Users page</a> first.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Contact Person</label>
                  <input
                    type="text"
                    maxLength={160}
                    value={newContactPerson}
                    onChange={(event) => setNewContactPerson(event.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Official Email</label>
                  <input
                    type="email"
                    maxLength={160}
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                    placeholder="head@partner.edu"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    maxLength={40}
                    value={newPhone}
                    onChange={(event) => setNewPhone(event.target.value)}
                    placeholder="+91 98765 XXXXX"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                  />
                </div>
              </div>

              {createError && (
                <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  {createError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  disabled={isCreating}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110 disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  {isCreating ? 'Saving…' : 'Save & Register Institution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {assigningInstitution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl p-6 relative"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Assign Institution Head
                </h3>
                <p className="text-xs text-[#888]">
                  {assigningInstitution.name} · {assigningInstitution.code}
                </p>
              </div>
              <button
                type="button"
                onClick={closeAssignModal}
                className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                aria-label="Close assign head dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignHead} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#AAA] mb-1">Institution Head</label>
                <select
                  value={assignHeadUserId}
                  onChange={(event) => setAssignHeadUserId(event.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                >
                  <option value="">Unassigned</option>
                  {eligibleHeads.map((head) => (
                    <option key={head.id} value={head.id} disabled={head.status !== 'active' && head.id !== assigningInstitution.headUserId}>
                      {head.fullName} {head.email ? `— ${head.email}` : ''}{head.status !== 'active' ? ' (inactive)' : ''}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-[11px] leading-relaxed text-[#777]">
                  A user can lead only one institution. Selecting a head here will update the institution immediately.
                </p>
                {eligibleHeads.length === 0 && (
                  <p className="mt-1 text-[11px] text-amber-400">
                    No institution head users exist yet. Create one from the{' '}
                    <a href="/dashboard/admin/users?action=create" className="underline">Users page</a>.
                  </p>
                )}
              </div>

              {assignError && (
                <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                  {assignError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={closeAssignModal}
                  disabled={isAssigning}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110 disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  {isAssigning ? 'Saving…' : 'Save Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
