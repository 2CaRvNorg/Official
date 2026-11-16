'use client';

import { useEffect, useState } from 'react';
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

interface Batch {
  id: string;
  name: string;
  institution: string;
  branch: string;
  programme: string;
  programmeCode: 'PRG-A' | 'PRG-B' | '';
  grade: string;
  startDate: string;
  endDate: string;
  studentsCount: number;
  teachers: string[];
  status: 'Active' | 'Upcoming' | 'Completed' | 'Archived';
}

type ProgrammeCode = 'PRG-A' | 'PRG-B';
type BatchStatus = 'active' | 'upcoming' | 'completed' | 'archived';

async function loadBatchRecords(): Promise<Batch[]> {
  const response = await fetch('/api/admin/batches');
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Failed to load batches.');
  if (!Array.isArray(result.batches)) throw new Error('The batches response was invalid.');
  return result.batches as Batch[];
}

export default function BatchesPage() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoadingBatches, setIsLoadingBatches] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [filterProgramme, setFilterProgramme] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [newBatchName, setNewBatchName] = useState('');
  const [newInstitution, setNewInstitution] = useState('Partner School Alpha');
  const [newBranch, setNewBranch] = useState('Main Campus');
  const [newProgramme, setNewProgramme] = useState<ProgrammeCode>('PRG-A');
  const [newGrade, setNewGrade] = useState('Grade 7');
  const [newStartDate, setNewStartDate] = useState('2026-12-01');
  const [newEndDate, setNewEndDate] = useState('2027-05-31');
  const [newTeacher1, setNewTeacher1] = useState('Ms. Priya Nair');
  const [newTeacher2, setNewTeacher2] = useState('Mr. Arjun Das');
  const [newStatus, setNewStatus] = useState<BatchStatus>('upcoming');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const records = await loadBatchRecords();
        if (active) {
          setBatches(records);
          setLoadError(null);
        }
      } catch (error) {
        if (active) setLoadError(error instanceof Error ? error.message : 'Failed to load batches.');
      } finally {
        if (active) setIsLoadingBatches(false);
      }
    };
    void load();
    return () => { active = false; };
  }, []);

  const resetForm = () => {
    setNewBatchName('');
    setNewInstitution('Partner School Alpha');
    setNewBranch('Main Campus');
    setNewProgramme('PRG-A');
    setNewGrade('Grade 7');
    setNewStartDate('2026-12-01');
    setNewEndDate('2027-05-31');
    setNewTeacher1('Ms. Priya Nair');
    setNewTeacher2('Mr. Arjun Das');
    setNewStatus('upcoming');
    setEditingBatchId(null);
    setFormError(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (batch: Batch) => {
    setEditingBatchId(batch.id);
    setNewBatchName(batch.name);
    setNewInstitution(batch.institution);
    setNewBranch(batch.branch);
    setNewProgramme(batch.programmeCode || 'PRG-A');
    setNewGrade(batch.grade.startsWith('Grade ') ? batch.grade : '');
    setNewStartDate(batch.startDate);
    setNewEndDate(batch.endDate);
    setNewTeacher1(batch.teachers[0] ?? '');
    setNewTeacher2(batch.teachers[1] ?? '');
    setNewStatus(
      batch.status === 'Active' ? 'active' :
      batch.status === 'Completed' ? 'completed' :
      batch.status === 'Archived' ? 'archived' :
      'upcoming'
    );
    setFormError(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      const response = await fetch(
        editingBatchId ? `/api/admin/batches?id=${encodeURIComponent(editingBatchId)}` : '/api/admin/batches',
        {
          method: editingBatchId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newBatchName,
            institution: newInstitution,
            branch: newBranch,
            programme_code: newProgramme,
            grade: newGrade,
            start_date: newStartDate,
            end_date: newEndDate,
            status: newStatus,
            teachers: [newTeacher1, newTeacher2],
          }),
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to save batch.');

      setShowModal(false);
      resetForm();
      try {
        setBatches(await loadBatchRecords());
        setLoadError(null);
      } catch (error) {
        setLoadError(error instanceof Error ? `Batch saved, but the list could not be refreshed: ${error.message}` : 'Batch saved, but the list could not be refreshed.');
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Failed to save batch.');
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = batches.filter(batch => {
    const matchesSearch =
      batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.grade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProg = filterProgramme === 'all' || batch.programme.includes(filterProgramme);
    return matchesSearch && matchesProg;
  });

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Super Admin" userRole="Administrator" avatarInitials="SA" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Batch & Cohort Operations"
          subtitle="6-Month parallel curriculum batches across grades 6–10"
          notificationCount={1}
          userName="Super Admin"
          avatarInitials="SA"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          {/* Action Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Batches & Cohorts ({batches.length})
              </h2>
              <p className="text-xs text-[#888]">
                Configure fixed 6-month cohorts with parallel subject delivery & teacher assignments
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={filterProgramme}
                onChange={(e) => setFilterProgramme(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
              >
                <option value="all">All Programmes</option>
                <option value="Programme A">Programme A (Design + Comm)</option>
                <option value="Programme B">Programme B (Tech + Design)</option>
              </select>

              <button
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
                Create New Batch
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Active Batches', value: batches.filter(b => b.status === 'Active').length, color: '#D4A843' },
              { label: 'Upcoming Batches', value: batches.filter(b => b.status === 'Upcoming').length, color: '#00BCD4' },
              { label: 'Prog A (Design+Comm)', value: batches.filter(b => b.programme.includes('Programme A')).length, color: '#F5A623' },
              { label: 'Prog B (Tech+Design)', value: batches.filter(b => b.programme.includes('Programme B')).length, color: '#7C4DFF' },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl p-4 flex flex-col justify-between"
                style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-xs text-[#888] font-medium">{metric.label}</span>
                <span className="text-2xl font-bold mt-2" style={{ color: metric.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>

          {/* Batches Table */}
          <GlassCard title="Active & Upcoming Academic Batches">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Batch / Grade', 'Institution & Campus', 'Programme & Scope', 'Dates & Duration', 'Students', 'Faculty Assigned', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left pb-3 pr-4 text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {loadError && (
                    <tr>
                      <td colSpan={8} role="alert" className="py-4 text-sm text-red-400">{loadError}</td>
                    </tr>
                  )}
                  {isLoadingBatches ? (
                    <tr><td colSpan={8} role="status" className="py-8 text-center text-sm text-[#888]">Loading batches…</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={8} className="py-8 text-center text-sm text-[#888]">No batches found.</td></tr>
                  ) : filtered.map((batch) => (
                    <tr key={batch.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-white text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {batch.name}
                        </div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold text-white bg-white/10">
                          {batch.grade}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-white text-sm">{batch.institution}</div>
                        <div className="text-xs text-[#777]">{batch.branch}</div>
                      </td>
                      <td className="py-4 pr-4 max-w-[200px]">
                        <div className="text-xs font-medium text-[#D4A843] truncate" title={batch.programme}>
                          {batch.programme}
                        </div>
                        <div className="text-[10px] text-[#888] mt-0.5">Taught in parallel</div>
                      </td>
                      <td className="py-4 pr-4 text-xs text-[#AAA]">
                        <div>{batch.startDate} to</div>
                        <div>{batch.endDate}</div>
                      </td>
                      <td className="py-4 pr-4">
                        <span className="font-semibold text-white text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {batch.studentsCount}
                        </span>
                        <span className="text-xs text-[#777] ml-1">students</span>
                      </td>
                      <td className="py-4 pr-4 text-xs text-[#DDD]">
                        {batch.teachers.map((t, idx) => (
                          <div key={idx} className="truncate max-w-[150px] text-[11px] text-[#BBB]">
                            • {t}
                          </div>
                        ))}
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            batch.status === 'Active'
                              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                              : 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                          }`}
                        >
                          {batch.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`/dashboard/admin/users?batch=${batch.id}`}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#D4A843] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
                          >
                            Enrol Students
                          </a>
                          <button
                            type="button"
                            onClick={() => openEditModal(batch)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </main>
      </div>

      {/* Create Batch Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {editingBatchId ? 'Edit Cohort Batch' : 'Create New Cohort Batch'}
                </h3>
                <p className="text-xs text-[#888]">Fixed 6-month programme schedule</p>
              </div>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div role="alert" className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#AAA] mb-1">Batch Name *</label>
                <input
                  type="text"
                  required
                  value={newBatchName}
                  onChange={(e) => setNewBatchName(e.target.value)}
                  placeholder="e.g. Batch 7B - Technology & Designing"
                  className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Target Grade *</label>
                  <select
                    required
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                  >
                    <option value="">Select grade</option>
                    {['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Institution Campus</label>
                  <input
                    type="text"
                    required
                    value={newInstitution}
                    onChange={(e) => setNewInstitution(e.target.value)}
                    placeholder="Institution name"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAA] mb-1">Branch / Campus *</label>
                <input
                  type="text"
                  required
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  placeholder="e.g. Main Campus"
                  className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAA] mb-1">Programme Curriculum *</label>
                <select
                  value={newProgramme}
                  onChange={(e) => setNewProgramme(e.target.value === 'PRG-B' ? 'PRG-B' : 'PRG-A')}
                  className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none text-[#D4A843]"
                >
                  <option value="PRG-A">Programme A: Designing + Communication</option>
                  <option value="PRG-B">Programme B: Technology (Web Basics) + Designing</option>
                </select>
                <p className="text-[11px] text-[#777] mt-1">Programme curriculum for this batch.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Batch Start Date</label>
                  <input
                    type="date"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Batch End Date (6 mo.)</label>
                  <input
                    type="date"
                    required
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAA] mb-1">Batch Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(
                    e.target.value === 'active' || e.target.value === 'completed' || e.target.value === 'archived'
                      ? e.target.value
                      : 'upcoming'
                  )}
                  className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Assigned Teacher 1</label>
                  <input
                    type="text"
                    value={newTeacher1}
                    onChange={(e) => setNewTeacher1(e.target.value)}
                    placeholder="e.g. Ms. Priya Nair"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Assigned Teacher 2</label>
                  <input
                    type="text"
                    value={newTeacher2}
                    onChange={(e) => setNewTeacher2(e.target.value)}
                    placeholder="e.g. Mr. Rajesh K."
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110 disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  {isSaving ? 'Saving…' : editingBatchId ? 'Save Changes' : 'Confirm & Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
