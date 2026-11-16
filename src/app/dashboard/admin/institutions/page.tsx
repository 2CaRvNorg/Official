'use client';

import { useEffect, useState } from 'react';
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

interface Institution {
  id: string;
  name: string;
  code: string;
  head: string;
  email: string;
  phone: string;
  branches: number;
  batches: number;
  students: number;
  status: 'Active' | 'Pending';
}

const INITIAL_INSTITUTIONS: Institution[] = [
  { id: '1', name: 'Partner School Alpha', code: 'PSA-01', head: 'Anthem Schwoner', email: 'anthem@alpha.edu', phone: '+91 98765 43210', branches: 3, batches: 42, students: 640, status: 'Active' },
  { id: '2', name: 'Partner School Beta', code: 'PSB-02', head: 'Jeni Dimav', email: 'jeni@beta.edu', phone: '+91 98765 43211', branches: 2, batches: 16, students: 320, status: 'Active' },
  { id: '3', name: 'Partner School Gamma', code: 'PSG-03', head: 'Dathan Aiteman', email: 'dathan@gamma.edu', phone: '+91 98765 43212', branches: 1, batches: 2, students: 48, status: 'Active' },
  { id: '4', name: 'Sunrise Public Academy', code: 'SPA-04', head: 'Priya Nair', email: 'priya@sunrise.edu', phone: '+91 98765 43213', branches: 2, batches: 8, students: 180, status: 'Active' },
];

export default function InstitutionsPage() {
  const router = useRouter();
  const [institutions, setInstitutions] = useState<Institution[]>(INITIAL_INSTITUTIONS);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newHead, setNewHead] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBranchName, setNewBranchName] = useState('');

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('action') !== 'create') return;

    setShowModal(true);
    router.replace('/dashboard/admin/institutions', { scroll: false });
  }, [router]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCode) return;

    const newInst: Institution = {
      id: String(Date.now()),
      name: newName,
      code: newCode.toUpperCase(),
      head: newHead || 'Designated Head',
      email: newEmail,
      phone: newPhone,
      branches: 1,
      batches: 0,
      students: 0,
      status: 'Active',
    };

    setInstitutions([newInst, ...institutions]);
    setShowModal(false);
    // Reset form
    setNewName('');
    setNewCode('');
    setNewHead('');
    setNewEmail('');
    setNewPhone('');
    setNewBranchName('');
  };

  const filtered = institutions.filter(inst =>
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.head.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Super Admin" userRole="Administrator" avatarInitials="SA" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Institution Management"
          subtitle="Partner schools, campuses & branches"
          notificationCount={1}
          userName="Super Admin"
          avatarInitials="SA"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          {/* Header Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Partner Institutions ({institutions.length})
              </h2>
              <p className="text-xs text-[#888]">
                Manage affiliated schools, campuses, and authorized branch heads
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search institutions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3.5 py-2 pl-9 rounded-xl text-xs text-white placeholder:text-[#555] outline-none"
                  style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}
                />
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#777" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>

              <button
                onClick={() => setShowModal(true)}
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

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Institutions', value: institutions.length, color: '#D4A843' },
              { label: 'Active Branches', value: institutions.reduce((acc, i) => acc + i.branches, 0), color: '#00BCD4' },
              { label: 'Active Batches', value: institutions.reduce((acc, i) => acc + i.batches, 0), color: '#7C4DFF' },
              { label: 'Enrolled Learners', value: institutions.reduce((acc, i) => acc + i.students, 0), color: '#4CAF50' },
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

          {/* Institutions Table */}
          <GlassCard title="Institutions & Branch Roster">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Institution / Code', 'Branch / Contact Head', 'Branches', 'Batches', 'Students', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left pb-3 pr-4 text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map((inst) => (
                    <tr key={inst.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-white text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {inst.name}
                        </div>
                        <div className="text-[11px] text-[#D4A843] font-mono mt-0.5">
                          {inst.code}
                        </div>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="text-white text-sm">{inst.head}</div>
                        <div className="text-xs text-[#777]">{inst.email}</div>
                      </td>
                      <td className="py-4 pr-4 text-sm font-semibold text-white/90">
                        {inst.branches}
                      </td>
                      <td className="py-4 pr-4">
                        <span className="px-2 py-0.5 rounded-md text-xs font-bold text-[#D4A843] bg-[#D4A843]/10 border border-[#D4A843]/20">
                          {inst.batches} Batches
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-sm text-white/80 font-medium">
                        {inst.students} Learners
                      </td>
                      <td className="py-4 pr-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                          {inst.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={`/dashboard/admin/batches?institution=${inst.id}`}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#D4A843] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors"
                          >
                            View Batches
                          </a>
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

      {/* Add Institution Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-2xl p-6 relative"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Add Partner Institution
                </h3>
                <p className="text-xs text-[#888]">Register a school or academic partner</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
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
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Greenwood International School"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Unique Code *</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. GWIS-01"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843] uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Initial Campus / Branch</label>
                  <input
                    type="text"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    placeholder="e.g. Main Campus"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Head / Primary Contact Person</label>
                  <input
                    type="text"
                    value={newHead}
                    onChange={(e) => setNewHead(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Official Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="head@partner.edu"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98765 XXXXX"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110"
                  style={{
                    background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  Save & Register Institution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
