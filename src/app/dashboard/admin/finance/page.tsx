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

interface FinancialTransaction {
  id: string;
  type: 'Income' | 'Expense' | 'Refund';
  category: string;
  institution: string;
  studentOrEntity: string;
  amount: number;
  method: 'UPI' | 'Bank Transfer' | 'Cash';
  recordedBy: string;
  date: string;
  correctionPending: boolean;
}

const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'TXN-1001',
    type: 'Income',
    category: 'Programme Fees',
    institution: 'Partner School Alpha',
    studentOrEntity: 'Rohit Sharma (Grade 7)',
    amount: 18500,
    method: 'UPI',
    recordedBy: 'Accounts Lead',
    date: '10 Nov 2026',
    correctionPending: false,
  },
  {
    id: 'TXN-1002',
    type: 'Income',
    category: 'Programme Fees',
    institution: 'Partner School Alpha',
    studentOrEntity: 'Priya Reddy (Grade 8)',
    amount: 18500,
    method: 'Bank Transfer',
    recordedBy: 'Accounts Lead',
    date: '09 Nov 2026',
    correctionPending: false,
  },
  {
    id: 'TXN-1003',
    type: 'Expense',
    category: 'Digital Studio Software Licenses',
    institution: 'Central Academy',
    studentOrEntity: 'Figma & Tooling Subscriptions',
    amount: 12400,
    method: 'Bank Transfer',
    recordedBy: 'Operations',
    date: '08 Nov 2026',
    correctionPending: false,
  },
  {
    id: 'TXN-1004',
    type: 'Refund',
    category: 'Admission Fee Refund',
    institution: 'Partner School Beta',
    studentOrEntity: 'Vikram Mehta (Relocation)',
    amount: 5000,
    method: 'Bank Transfer',
    recordedBy: 'Accounts Lead',
    date: '05 Nov 2026',
    correctionPending: true,
  },
];

export default function FinanceManagementPage() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState<FinancialTransaction | null>(null);
  const [correctionReason, setCorrectionReason] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Transaction Form State
  const [newType, setNewType] = useState<'Income' | 'Expense' | 'Refund'>('Income');
  const [newCategory, setNewCategory] = useState('Programme Fees');
  const [newInstitution, setNewInstitution] = useState('Partner School Alpha');
  const [newEntity, setNewEntity] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newMethod, setNewMethod] = useState<'UPI' | 'Bank Transfer' | 'Cash'>('UPI');

  // Stats calculation (INR)
  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunds = transactions
    .filter(t => t.type === 'Refund')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense - totalRefunds;

  const handleRecordTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(newAmount);
    if (isNaN(amountVal) || amountVal <= 0) return;

    const newTxn: FinancialTransaction = {
      id: `TXN-${1000 + transactions.length + 1}`,
      type: newType,
      category: newCategory,
      institution: newInstitution,
      studentOrEntity: newEntity || 'General Allocation',
      amount: amountVal,
      method: newMethod,
      recordedBy: 'Money Management',
      date: 'Today',
      correctionPending: false,
    };

    setTransactions([newTxn, ...transactions]);
    setShowAddModal(false);
    setNewEntity('');
    setNewAmount('');
    setToastMsg(`Transaction ${newTxn.id} recorded immediately into ledger.`);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleRequestCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCorrectionModal || !correctionReason) return;

    setTransactions(prev =>
      prev.map(t =>
        t.id === showCorrectionModal.id
          ? { ...t, correctionPending: true }
          : t
      )
    );

    setShowCorrectionModal(null);
    setCorrectionReason('');
    setToastMsg('Correction request submitted! Dispatched for Super Admin audit approval.');
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Super Admin" userRole="Administrator" avatarInitials="SA" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Internal Financial Recordkeeping"
          subtitle="Money Management ledger, immutable correction approvals & cashbook audit"
          notificationCount={1}
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
                Academy Financial Overview (INR ₹)
              </h2>
              <p className="text-xs text-[#888]">
                Strict internal ledger. Students have zero financial record access (PRD REQ-020, REQ-073)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => alert('Exporting encrypted Financial Ledger (PDF/Excel) as approved by Admin...')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export PDF / XLSX
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110 flex items-center gap-1.5 shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Record Entry
              </button>
            </div>
          </div>

          {/* KPI Financial Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Programme Income', value: `₹${totalIncome.toLocaleString('en-IN')}`, color: '#4CAF50' },
              { label: 'Operating Expenses', value: `₹${totalExpense.toLocaleString('en-IN')}`, color: '#FF9800' },
              { label: 'Refunds Settled', value: `₹${totalRefunds.toLocaleString('en-IN')}`, color: '#FF5252' },
              { label: 'Net Available Balance', value: `₹${netBalance.toLocaleString('en-IN')}`, color: '#D4A843' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-4 flex flex-col justify-between"
                style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-xs text-[#888] font-medium">{stat.label}</span>
                <span className="text-xl font-bold mt-2" style={{ color: stat.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Transactions Ledger */}
          <GlassCard title="Financial Transactions Ledger (Immutable Audit Trail)">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Txn ID / Date', 'Type & Category', 'Institution / Beneficiary', 'Payment Mode', 'Amount (INR)', 'Audit Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left pb-3 pr-4 text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="font-mono text-xs font-bold text-white">{txn.id}</div>
                        <div className="text-[11px] text-[#777]">{txn.date}</div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            txn.type === 'Income'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : txn.type === 'Expense'
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-red-400 bg-red-500/10'
                          }`}
                        >
                          {txn.type}
                        </span>
                        <div className="text-xs text-white/90 mt-1">{txn.category}</div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="text-xs text-white font-medium">{txn.studentOrEntity}</div>
                        <div className="text-[11px] text-[#777]">{txn.institution}</div>
                      </td>
                      <td className="py-3.5 pr-4 text-xs font-medium text-[#AAA]">
                        {txn.method}
                      </td>
                      <td className="py-3.5 pr-4 font-mono font-bold text-sm text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        ₹{txn.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 pr-4 text-xs">
                        {txn.correctionPending ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30">
                            Correction Pending Approval
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-semibold text-[11px]">
                            ✓ Recorded & Audited
                          </span>
                        )}
                      </td>
                      <td className="py-3.5">
                        <button
                          onClick={() => setShowCorrectionModal(txn)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#D4A843] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
                        >
                          Request Correction
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </main>
      </div>

      {/* Record Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl p-6 relative"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Record Financial Entry
                </h3>
                <p className="text-xs text-[#888]">Internal cashbook logging (INR ₹)</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-white/50 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleRecordTransaction} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {(['Income', 'Expense', 'Refund'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNewType(t)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      newType === t
                        ? 'bg-[#D4A843] text-[#0D0D0D] border-[#D4A843]'
                        : 'bg-[#1A1A1A] text-white/70 border-white/10'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAA] mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Programme Fees, Admission, Software License"
                  className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Amount (INR ₹) *</label>
                  <input
                    type="number"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    placeholder="e.g. 18500"
                    className="w-full px-3 py-2 rounded-xl text-xs text-white font-mono font-bold bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#AAA] mb-1">Payment Method</label>
                  <select
                    value={newMethod}
                    onChange={(e: any) => setNewMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#AAA] mb-1">Linked Student / Beneficiary</label>
                <input
                  type="text"
                  value={newEntity}
                  onChange={(e) => setNewEntity(e.target.value)}
                  placeholder="e.g. Student Name or Vendor Entity"
                  className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] text-[#888]">
                ⚠️ PRD REQ-081: Once recorded, transactions cannot be directly deleted. Any modifications require an Admin-approved correction request.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110"
                  style={{ background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)' }}
                >
                  Record into Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Correction Modal (REQ-081) */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-md rounded-2xl p-6 relative"
            style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.8)' }}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Request Transaction Correction
                </h3>
                <p className="text-xs text-[#888] font-mono">{showCorrectionModal.id} · ₹{showCorrectionModal.amount}</p>
              </div>
              <button onClick={() => setShowCorrectionModal(null)} className="text-white/50 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleRequestCorrection} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#AAA] mb-1.5">
                  Detailed Reason for Correction *
                </label>
                <textarea
                  rows={3}
                  required
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="Explain why this entry needs adjustment (e.g. incorrect UPI reference, bank fee deduction, batch reallocation)..."
                  className="w-full px-3 py-2 rounded-xl text-xs text-white bg-[#1A1A1A] border border-white/10 outline-none focus:border-[#D4A843]"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                Notice: The original transaction remains preserved in the audit history. The correction will take effect only upon Super Admin sign-off.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white/70 hover:text-white bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110"
                  style={{ background: 'linear-gradient(135deg, #D4A843 0%, #F5A623 100%)' }}
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
