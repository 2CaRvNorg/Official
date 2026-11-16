'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';
import { COURSE_CATALOG, isElectiveCourse, type ElectiveCourse } from '@/lib/student-courses';

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

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'institution_head' | 'student' | 'money_management';
  status: 'Active' | 'Pending First Login' | 'Inactive';
  lastLogin?: string;
  createdAt: string;
  phone?: string | null;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  batches: string[];
  status: 'Active' | 'Pending First Login' | 'Inactive';
}

interface ParsedCSVRow {
  fullName: string;
  username: string;
  grade: string;
  batch: string;
  guardianPhone: string;
  electiveCourse: ElectiveCourse | '';
  isValid: boolean;
  error?: string;
}

export default function UsersManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'users' | 'teachers' | 'import'>('users');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Create User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const roleSelectRef = useRef<HTMLSelectElement>(null);
  const focusRoleOnOpen = useRef(false);
  const [createForm, setCreateForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'student',
    phone: '',
    elective_course: '',
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const action = new URLSearchParams(window.location.search).get('action');
    if (action !== 'create' && action !== 'roles') return;

    focusRoleOnOpen.current = action === 'roles';
    setShowCreateModal(true);
    router.replace('/dashboard/admin/users', { scroll: false });
  }, [router]);

  useEffect(() => {
    if (!showCreateModal || !focusRoleOnOpen.current) return;

    roleSelectRef.current?.focus();
    focusRoleOnOpen.current = false;
  }, [showCreateModal]);

  // Bulk CSV Import State
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedCSVRow[]>([]);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);
  const [bulkCredentials, setBulkCredentials] = useState<Array<{ name: string; email: string; password: string }>>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadUsers = async () => {
      try {
        const response = await fetch('/api/admin/users');
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to load users.');
        if (!active) return;

        setUsers(result.users.map((user: {
          id: string;
          full_name: string;
          email: string;
          role: UserRecord['role'];
          status: string;
          force_password_change: boolean;
          created_at: string;
          phone: string | null;
        }) => ({
          id: user.id,
          name: user.full_name,
          email: user.email,
          role: user.role,
          status: (user.status === 'active'
            ? user.force_password_change ? 'Pending First Login' : 'Active'
            : 'Inactive') as UserRecord['status'],
          createdAt: new Date(user.created_at).toLocaleDateString(),
          phone: user.phone,
        })));
        setLoadError(null);
      } catch (error) {
        if (active) setLoadError(error instanceof Error ? error.message : 'Failed to load users.');
      } finally {
        if (active) setIsLoadingUsers(false);
      }
    };

    void loadUsers();
    return () => { active = false; };
  }, []);

  const teachers = useMemo<Teacher[]>(() => users
    .filter(user => user.role === 'teacher')
    .map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      subjects: [],
      batches: [],
      status: user.status,
    })), [users]);

  const filteredUsers = users.filter(user =>
    `${user.name} ${user.email} ${user.role}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBulkImport = async () => {
    const validRows = parsedRows.filter(row => row.isValid);
    if (validRows.length === 0) return;

    setIsImporting(true);
    setImportError(null);
    setImportSuccessMsg(null);
    setBulkCredentials([]);

    const createdUsers: UserRecord[] = [];
    const credentials: Array<{ name: string; email: string; password: string }> = [];
    const failedRows: ParsedCSVRow[] = parsedRows.filter(row => !row.isValid);

    for (const row of validRows) {
      try {
        const randomBytes = new Uint8Array(24);
        window.crypto.getRandomValues(randomBytes);
        const password = `${Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('')}Aa1!`;
        const response = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: row.fullName,
            email: row.username,
            password,
            role: 'student',
            grade: row.grade,
            batch_name: row.batch,
            guardian_phone: row.guardianPhone,
            elective_course: row.electiveCourse,
          }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to create account.');

        createdUsers.push({
          id: result.user.id,
          name: result.user.full_name,
          email: result.user.email,
          role: 'student',
          status: result.user.force_password_change ? 'Pending First Login' : 'Active',
          createdAt: new Date(result.user.created_at).toLocaleDateString(),
          phone: result.user.phone,
        });
        credentials.push({ name: row.fullName, email: row.username, password });
      } catch (error) {
        failedRows.push({
          ...row,
          isValid: false,
          error: error instanceof Error ? error.message : 'Unable to create account.',
        });
      }
    }

    setUsers(current => [...createdUsers, ...current]);
    setBulkCredentials(credentials);
    setParsedRows(failedRows);
    setImportSuccessMsg(
      createdUsers.length ? `Created ${createdUsers.length} student account${createdUsers.length === 1 ? '' : 's'}.` : null
    );
    if (failedRows.length) {
      setImportError(`${failedRows.length} row${failedRows.length === 1 ? '' : 's'} were not imported. Review the errors and try again.`);
    }
    if (createdUsers.length === 0 && failedRows.length === 0) {
      setImportError('No accounts were created.');
    }
    setIsImporting(false);
  };

  const downloadCredentials = () => {
    const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csv = [
      'full_name,email,temporary_password',
      ...bulkCredentials.map(user => [user.name, user.email, user.password].map(escapeCsv).join(',')),
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'student-temporary-credentials.csv';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.full_name || !createForm.email || !createForm.password) {
      setCreateError('All fields are required');
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setCreateError(data.error || 'Failed to create user');
        return;
      }

      // Add to users list
      const newUser: UserRecord = {
        id: data.user.id,
        name: data.user.full_name,
        email: data.user.email,
        role: data.user.role as UserRecord['role'],
        status: data.user.force_password_change ? 'Pending First Login' : 'Active',
        createdAt: new Date().toLocaleDateString(),
        phone: data.user.phone,
      };

      setUsers(current => [newUser, ...current]);
      setShowCreateModal(false);
      setCreateForm({ full_name: '', email: '', password: '', role: 'student', phone: '', elective_course: '' });

      // If student, show password display
      if (data.user.role === 'student') {
        alert(`✅ Student created!\n\nEmail: ${data.user.email}\nTemporary Password: ${data.user.force_password_change ? 'Assigned (will be prompted to change on first login)' : 'No password required'}\n\nShare these credentials securely with the student.`);
      }
    } catch (err) {
      setCreateError('Network error. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // ... rest of the component continues below

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Super Admin" userRole="Administrator" avatarInitials="SA" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="User & Enrolment Management"
          subtitle="Admin-generated accounts, temporary credentials & CSV bulk enrolment"
          notificationCount={1}
          userName="Super Admin"
          avatarInitials="SA"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          {/* Top Bar with Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'users'
                    ? 'bg-[#D4A843] text-[#0D0D0D] shadow-md'
                    : 'text-[#888] hover:text-white'
                }`}
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                All Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('teachers')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'teachers'
                    ? 'bg-[#D4A843] text-[#0D0D0D] shadow-md'
                    : 'text-[#888] hover:text-white'
                }`}
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Faculty / Teachers ({teachers.length})
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'import'
                    ? 'bg-[#D4A843] text-[#0D0D0D] shadow-md'
                    : 'text-[#D4A843] hover:text-white'
                }`}
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Bulk CSV Import
              </button>
            </div>

            {activeTab === 'users' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110 flex items-center gap-1.5 shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create New User
              </button>
            )}
          </div>

          {/* TAB 1: USERS LIST */}
          {activeTab === 'users' && (
            <GlassCard title="All Users & Account Status">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={event => setSearchQuery(event.target.value)}
                  placeholder="Search users by name, email or role"
                  aria-label="Search users"
                  className="w-full max-w-sm rounded-xl border border-white/10 bg-[#1A1A1A] px-3 py-2 text-sm text-white outline-none focus:border-[#D4A843]"
                />
                <span className="text-xs text-[#888]">{filteredUsers.length} users</span>
              </div>
              {loadError && (
                <div role="alert" className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                  {loadError}
                </div>
              )}
              {isLoadingUsers ? (
                <p className="py-8 text-center text-sm text-[#888]">Loading users…</p>
              ) : filteredUsers.length === 0 ? (
                <p className="py-8 text-center text-sm text-[#888]">
                  {users.length === 0 ? 'No users found.' : 'No users match your search.'}
                </p>
              ) : <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      {['User Name', 'Email Address', 'Role', 'Phone', 'Status', 'Created', 'User ID'].map((h) => (
                        <th key={h} className="text-left pb-3 pr-4 text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 pr-4">
                          <div className="font-semibold text-white text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            {user.name}
                          </div>
                        </td>
                        <td className="py-3.5 pr-4 text-xs font-mono text-[#DDD]">
                          {user.email}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.role === 'admin' ? 'text-yellow-400 bg-yellow-500/10' :
                            user.role === 'teacher' ? 'text-purple-400 bg-purple-500/10' :
                            user.role === 'institution_head' ? 'text-emerald-400 bg-emerald-500/10' :
                            user.role === 'student' ? 'text-cyan-400 bg-cyan-500/10' :
                            'text-orange-400 bg-orange-500/10'
                          }`}>
                            {user.role.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            user.status === 'Active'
                              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                              : user.status === 'Pending First Login'
                                ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                                : 'text-gray-400 bg-gray-500/10 border border-gray-500/20'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 text-xs text-[#AAA]">
                          {user.phone || '—'}
                        </td>
                        <td className="py-3.5 pr-4 text-xs text-[#888]">
                          {user.createdAt}
                        </td>
                        <td className="py-3.5">
                          <span className="font-mono text-[10px] text-[#777]" title={user.id}>
                            {user.id.slice(0, 8)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>}
            </GlassCard>
          )}

          {/* TAB 2: TEACHERS LIST */}
          {activeTab === 'teachers' && (
            <GlassCard title="Active Teaching Faculty">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      {['Teacher Name', 'Official Email & Phone', 'Subject Expertise', 'Assigned Batches', 'Status'].map((h) => (
                        <th key={h} className="text-left pb-3 pr-4 text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {teachers.map((teacher) => (
                      <tr key={teacher.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 pr-4">
                          <div className="font-semibold text-white text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                            {teacher.name}
                          </div>
                        </td>
                        <td className="py-3.5 pr-4 text-xs">
                          <div className="text-white/90">{teacher.email}</div>
                          <div className="text-[#777]">{teacher.phone || '—'}</div>
                        </td>
                        <td className="py-3.5 pr-4">
                          {teacher.subjects.length === 0 ? '—' : teacher.subjects.map((s, idx) => (
                            <span key={idx} className="inline-block mr-1.5 px-2 py-0.5 rounded text-[11px] font-medium text-[#D4A843] bg-[#D4A843]/10 border border-[#D4A843]/20">
                              {s}
                            </span>
                          ))}
                        </td>
                        <td className="py-3.5 pr-4 text-xs text-[#AAA]">
                          {teacher.batches.length ? teacher.batches.join(', ') : '—'}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            teacher.status === 'Active'
                              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                              : teacher.status === 'Pending First Login'
                              ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                              : 'text-gray-400 bg-gray-500/10 border border-gray-500/20'
                          }`}>
                            {teacher.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}

          {/* TAB 3: BULK CSV IMPORT */}
          {activeTab === 'import' && (
            <div className="space-y-5">
              <div
                className="rounded-2xl p-6"
                style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      Bulk Student Enrolment (CSV / Excel Import)
                    </h3>
                    <p className="text-xs text-[#888]">
                      Upload or paste student records to validate duplicates and automatically generate first-time login credentials.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">                      <button
                        onClick={() => {
                          const sample = `full_name,email_or_username,grade,batch_name,guardian_phone,elective_course\nAnanya Rao,ananya.rao@2carvn.edu,Grade 7,Batch 7A - Design & Comm,+91 98765 12345,design\nDevansh Singhania,devansh.s@2carvn.edu,Grade 8,Batch 8B - Web & Design,+91 98765 54321,tech\nSana Merchant,sana.m@2carvn.edu,Grade 9,Batch 9A - Web & Design,+91 98765 67890,design`;
                          setCsvText(sample);
                          setParsedRows([]);
                          setImportError(null);
                          setBulkCredentials([]);
                          const lines = sample.trim().split('\n');
                          const rows: ParsedCSVRow[] = [];
                          for (let i = 1; i < lines.length; i++) {
                            const line = lines[i].trim();
                            if (!line) continue;
                            const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
                            const fullName = parts[0] || '';
                            const username = parts[1] || '';
                            const grade = parts[2] || '';
                            const batch = parts[3] || 'Batch 7A - Design & Comm';
                            const guardianPhone = parts[4] || '';
                            const electiveCourse = isElectiveCourse(parts[5]) ? parts[5] : '';
                            let isValid = true;
                            let error = '';
                            if (!fullName) { isValid = false; error = 'Full name missing'; }
                            else if (!username || !username.includes('@')) { isValid = false; error = 'Invalid email format'; }
                            else if (!grade) { isValid = false; error = 'Grade required'; }
                            else if (!electiveCourse) { isValid = false; error = 'Elective must be design or tech'; }
                            rows.push({ fullName, username, grade, batch, guardianPhone, electiveCourse, isValid, error });
                          }
                          setParsedRows(rows);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        Load Sample Data
                      </button>

                      <button
                        onClick={() => {
                          const sample = `full_name,email_or_username,grade,batch_name,guardian_phone,elective_course\nAnanya Rao,ananya.rao@2carvn.edu,Grade 7,Batch 7A - Design & Comm,+91 98765 12345,design\nDevansh Singhania,devansh.s@2carvn.edu,Grade 8,Batch 8B - Web & Design,+91 98765 54321,tech\nSana Merchant,sana.m@2carvn.edu,Grade 9,Batch 9A - Web & Design,+91 98765 67890,design`;
                          const blob = new Blob([sample], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = '2carvn_student_enrolment_template.csv';
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-[#D4A843] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-[#D4A843]/30 transition-colors flex items-center gap-1.5"
                      >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download CSV Template
                    </button>
                  </div>
                </div>

                {/* Textarea for CSV */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-[#AAA] mb-1.5">
                    Paste CSV Data (Headers: full_name, email_or_username, grade, batch_name, guardian_phone, elective_course; elective must be design or tech)
                  </label>
                  <textarea
                    rows={5}
                    value={csvText}
                    onChange={(e) => {
                      setCsvText(e.target.value);
                      setParsedRows([]);
                      setImportSuccessMsg(null);
                      setImportError(null);
                      setBulkCredentials([]);
                      const raw = e.target.value.trim();
                      if (raw.split('\n').length <= 1) return;
                      const lines = raw.split('\n');
                      const existingEmails = new Set(users.filter(u => u.role === 'student').map(u => u.email.toLowerCase()));
                      const rows: ParsedCSVRow[] = [];
                      for (let i = 1; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (!line) continue;
                        const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
                        const fullName = parts[0] || '';
                        const username = parts[1] || '';
                        const grade = parts[2] || '';
                        const batch = parts[3] || 'Batch 7A';
                        const guardianPhone = parts[4] || '';
                        const electiveCourse = isElectiveCourse(parts[5]) ? parts[5] : '';
                        let isValid = true;
                        let error = '';
                        if (!fullName) { isValid = false; error = 'Full name missing'; }
                        else if (!username || !username.includes('@')) { isValid = false; error = 'Invalid email'; }
                        else if (existingEmails.has(username.toLowerCase())) { isValid = false; error = 'Duplicate'; }
                        else if (!grade) { isValid = false; error = 'Grade required'; }
                        else if (!electiveCourse) { isValid = false; error = 'Elective must be design or tech'; }
                        rows.push({ fullName, username, grade, batch, guardianPhone, electiveCourse, isValid, error });
                      }
                      setParsedRows(rows);
                    }}
                    placeholder="full_name,email_or_username,grade,batch_name,guardian_phone,elective_course&#10;Aarav K,aarav.k@2carvn.edu,Grade 7,Batch 7A - Design & Comm,+91 98765 00000,design"
                    className="w-full px-4 py-3 rounded-xl text-xs font-mono text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                  />
                </div>

                {importSuccessMsg && (
                  <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold flex items-center gap-2">
                    <span>✓</span>
                    <span>{importSuccessMsg}</span>
                  </div>
                )}
                {importError && (
                  <div role="alert" className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                    {importError}
                  </div>
                )}
                {bulkCredentials.length > 0 && (
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
                    <p className="text-xs text-amber-200">
                      Temporary passwords are available only in this session. Download and share them securely.
                    </p>
                    <button
                      type="button"
                      onClick={downloadCredentials}
                      className="rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-black"
                    >
                      Download credentials CSV
                    </button>
                  </div>
                )}

                {/* Validation Preview Table */}
                {parsedRows.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-semibold text-white">Parsed Rows: {parsedRows.length}</span>
                        <span className="text-emerald-400">Valid: {parsedRows.filter(r => r.isValid).length}</span>
                        {parsedRows.filter(r => !r.isValid).length > 0 && (
                          <span className="text-red-400">Errors: {parsedRows.filter(r => !r.isValid).length}</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => void handleBulkImport()}
                        disabled={isImporting || parsedRows.filter(r => r.isValid).length === 0}
                        className="px-5 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110 disabled:opacity-40"
                        style={{
                          background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                          fontFamily: 'Space Grotesk, sans-serif',
                        }}
                      >
                        {isImporting ? 'Creating accounts…' : `Create Accounts (${parsedRows.filter(r => r.isValid).length}) →`}
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-white/10">
                      <table className="w-full text-xs">
                        <thead className="bg-white/[0.04]">
                          <tr>
                            {['Status', 'Full Name', 'Username / Email', 'Grade', 'Batch Name', 'Guardian Phone', 'Elective', 'Validation Notes'].map(h => (
                              <th key={h} className="text-left p-2.5 text-[#888] font-semibold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {parsedRows.map((row, idx) => (
                            <tr key={idx} className={row.isValid ? 'bg-white/[0.01]' : 'bg-red-500/[0.05]'}>
                              <td className="p-2.5">
                                {row.isValid ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 bg-emerald-500/10">Ready</span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold text-red-400 bg-red-500/10">Error</span>
                                )}
                              </td>
                              <td className="p-2.5 text-white font-medium">{row.fullName}</td>
                              <td className="p-2.5 font-mono text-[#AAA]">{row.username}</td>
                              <td className="p-2.5 text-[#DDD]">{row.grade}</td>
                              <td className="p-2.5 text-[#DDD]">{row.batch}</td>
                              <td className="p-2.5 text-[#888]">{row.guardianPhone}</td>
                              <td className="p-2.5 text-[#DDD]">{row.electiveCourse || '—'}</td>
                              <td className="p-2.5 text-red-400 font-medium">{row.error || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl p-6 relative"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Create New User
                </h3>
                <p className="text-xs text-[#888]">Admin-created account with secure credentials</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#AAA] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={createForm.full_name}
                  onChange={(e) => setCreateForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAA] mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="user@2carvn.academy"
                  className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAA] mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={createForm.password}
                  onChange={(e) => setCreateForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min 8 characters"
                  className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                />
                <p className="mt-1 text-[10px] text-[#666]">Use a strong password. Students will be forced to change on first login.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Role</label>
                  <select
                    ref={roleSelectRef}
                    value={createForm.role}
                    onChange={(e) => setCreateForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="institution_head">Institution Head</option>
                    <option value="money_management">Money Management</option>
                  </select>
                  <p className="mt-1 text-[10px] text-[#666]">Admin role is for existing super admin accounts only.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Phone (Optional)</label>
                  <input
                    type="tel"
                    value={createForm.phone}
                    onChange={(e) => setCreateForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+91 98765 12345"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                  />
                </div>
              </div>

              {createForm.role === 'student' && (
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Student Course Bundle *</label>
                  <p className="text-[11px] text-[#777] mb-2">
                    Communication is mandatory. Select one elective to unlock with it.
                  </p>
                  <select
                    required
                    value={createForm.elective_course}
                    onChange={(e) => setCreateForm(form => ({ ...form, elective_course: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                  >
                    <option value="">Select Design or Tech</option>
                    {COURSE_CATALOG.filter(course => !course.mandatory).map(course => (
                      <option key={course.id} value={course.id}>{course.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#AAA]">
                <div className="font-semibold text-white mb-1">🔐  Security Notes:</div>
                <ul className="space-y-1">
                  <li>• Admin-generated credentials are secure and tamper-proof</li>
                  <li>• Students must change password on first login (PRD REQ-028)</li>
                  <li>• Passwords are hashed in Supabase Auth — never stored in plain text</li>
                  <li>• All creations are logged in the Security Audit Trail</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110 disabled:opacity-50 flex items-center gap-1.5"
                  style={{
                    background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                    fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  {isCreating ? (
                    <>
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 4.373 0 12h4z"/>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
