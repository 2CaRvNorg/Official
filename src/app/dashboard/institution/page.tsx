'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlassCard from '@/components/dashboard/GlassCard';
import InstitutionPage from '@/components/dashboard/institution/InstitutionPage';
import {
  attendanceColor,
  formatDate,
  formatDateTime,
  formatPercent,
  getInitials,
  statusLabel,
  type InstitutionDashboardData,
  type InstitutionStudent,
} from '@/lib/institution';

function combinedAttendance(students: InstitutionStudent[]) {
  const total = students.reduce((sum, student) => sum + student.attendanceTotal, 0);
  const present = students.reduce((sum, student) => sum + student.attendancePresent, 0);
  if (total === 0) return null;
  return Math.round((present / total) * 1000) / 10;
}

function DashboardContent({ data }: { data: InstitutionDashboardData }) {
  const institution = data.institution;
  const [branchId, setBranchId] = useState('all');

  if (!institution) return null;

  const branches = institution.branches;
  const batches = branchId === 'all'
    ? data.batches
    : data.batches.filter((batch) => batch.branchId === branchId);
  const batchIds = new Set(batches.map((batch) => batch.id));
  const students = branchId === 'all'
    ? data.students
    : data.students.filter((student) => batchIds.has(student.batchId));
  const alerts = branchId === 'all'
    ? data.alerts
    : data.alerts.filter((alert) => !alert.batchId || batchIds.has(alert.batchId));
  const branchLiveClasses = branchId === 'all'
    ? data.liveClasses
    : data.liveClasses.filter((liveClass) => batchIds.has(liveClass.batchId));

  const activeBatches = batches.filter((batch) => batch.status === 'active').length;
  const enrolledStudents = new Set(students.map((student) => student.studentId)).size;
  const attendanceRate = branchId === 'all' ? data.reports.attendanceRate : combinedAttendance(students);
  const selectedBranch = branches.find((branch) => branch.id === branchId);

  const quickStats = [
    { label: 'Active Batches', value: activeBatches.toLocaleString(), icon: '📚', color: '#D4A843' },
    { label: 'Enrolled Students', value: enrolledStudents.toLocaleString(), icon: '🎓', color: '#00BCD4' },
    { label: 'Attendance Rate', value: formatPercent(attendanceRate), icon: '✅', color: '#4CAF50' },
    { label: 'Support Alerts', value: alerts.length.toLocaleString(), icon: '⚠️', color: '#FF9800' },
  ];

  return (
    <>
      <div
        className="rounded-xl p-5"
        style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.18) 0%, rgba(13,13,13,0) 100%)', border: '1px solid rgba(212,168,67,0.2)' }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs text-[#888]">
              Institution Head · {institution.name} · {institution.code}
            </p>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Hello, {data.viewer.fullName}! 👋 Welcome back.
            </h2>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-[#888]">
              <span>{branches.length} branch{branches.length === 1 ? '' : 'es'}</span>
              {institution.contactPerson && <span>Contact: {institution.contactPerson}</span>}
              {institution.email && <span>{institution.email}</span>}
              {institution.phone && <span>{institution.phone}</span>}
            </div>
          </div>

          {branches.length > 1 && (
            <label className="text-[11px] text-[#888]">
              <span className="mb-1 block">Campus / branch</span>
              <select
                value={branchId}
                onChange={(event) => setBranchId(event.target.value)}
                className="rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)', color: '#D4A843', fontFamily: 'Space Grotesk, sans-serif' }}
              >
                <option value="all" style={{ background: '#1A1A1A', color: '#fff' }}>All branches</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id} style={{ background: '#1A1A1A', color: '#fff' }}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {quickStats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 rounded-xl p-5"
            style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl"
              style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}25` }}
            >
              {stat.icon}
            </div>
            <div>
              <div className="text-xl font-bold" style={{ color: stat.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                {stat.value}
              </div>
              <div className="text-xs text-[#888]">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <GlassCard
            title={selectedBranch ? `Batch Progress · ${selectedBranch.name}` : 'Batch Progress'}
            action={<Link href="/dashboard/institution/batches" className="text-xs text-[#D4A843] hover:underline">View all</Link>}
          >
            {batches.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#888]">
                {branches.length === 0
                  ? 'No branches have been added to your institution yet.'
                  : 'No batches have been created for this institution yet.'}
              </p>
            ) : (
              <div className="space-y-5">
                {batches.slice(0, 6).map((batch) => (
                  <div key={batch.id}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {batch.name}
                        </div>
                        <div className="mt-0.5 text-xs text-[#666]">
                          {batch.programmeName} · {batch.grade || 'Grade not set'} · {batch.branchName}
                        </div>
                      </div>
                      <span className="text-sm font-bold" style={{ color: attendanceColor(batch.completionRate), fontFamily: 'Space Grotesk, sans-serif' }}>
                        {formatPercent(batch.completionRate)}
                      </span>
                    </div>
                    <div className="relative h-3 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div
                        className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.max(0, Math.min(100, batch.completionRate ?? 0))}%`, background: 'linear-gradient(90deg, #D4A843, #D4A843aa)' }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-[9px] text-[#555]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      <span>{formatDate(batch.startDate)}</span>
                      <span>{formatDate(batch.endDate)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard
            title="Student Attendance & Performance"
            action={<Link href="/dashboard/institution/students" className="text-xs text-[#D4A843] hover:underline">View roster</Link>}
          >
            {students.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#888]">No enrolled students have been found for this institution yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      {['Name', 'Batch', 'Attendance %', 'Pacing'].map((heading) => (
                        <th key={heading} className="pb-3 pr-4 text-left" style={{ color: '#555', fontSize: 11, fontWeight: 500, fontFamily: 'Space Grotesk, sans-serif' }}>
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0, 10).map((student) => (
                      <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                              style={{ background: 'rgba(212,168,67,0.15)', color: '#D4A843', fontFamily: 'Space Grotesk, sans-serif' }}
                            >
                              {getInitials(student.name).slice(0, 1)}
                            </div>
                            <span className="text-sm font-medium text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-xs text-[#888]">{student.batchName}</td>
                        <td className="py-3 pr-4">
                          <span className="text-sm font-bold" style={{ color: attendanceColor(student.attendanceRate), fontFamily: 'Space Grotesk, sans-serif' }}>
                            {formatPercent(student.attendanceRate)}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="rounded px-2 py-0.5 text-[10px] font-bold" style={{
                            color: student.flag === 'Active' ? '#4CAF50' : student.flag === 'Warning' ? '#FF9800' : '#FF5252',
                            background: student.flag === 'Active' ? 'rgba(76,175,80,0.1)' : student.flag === 'Warning' ? 'rgba(255,152,0,0.1)' : 'rgba(255,82,82,0.1)',
                          }}>
                            {student.pacingHealth}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>

        <div className="space-y-5">
          <GlassCard
            title="Teacher Schedules"
            action={<Link href="/dashboard/institution/schedule" className="text-xs text-[#D4A843] hover:underline">View all</Link>}
          >
            {branchLiveClasses.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#888]">No live classes have been scheduled yet.</p>
            ) : (
              <div className="space-y-3">
                {branchLiveClasses.slice(0, 4).map((liveClass) => (
                  <div
                    key={liveClass.id}
                    className="rounded-xl p-3"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="mb-0.5 text-sm font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {liveClass.title}
                    </div>
                    <div className="mb-1 text-xs text-[#888]">
                      {liveClass.subjectName} · {liveClass.batchName}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#666]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {formatDateTime(liveClass.scheduledStart)}
                      {liveClass.teacherName ? ` · ${liveClass.teacherName}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard
            title="Urgent Support & Intervention Alerts"
            action={<Link href="/dashboard/institution/alerts" className="text-xs text-[#D4A843] hover:underline">View all</Link>}
          >
            {alerts.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#888]">No active intervention alerts for this institution.</p>
            ) : (
              <div className="space-y-3">
                {alerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="rounded-xl p-4"
                    style={{
                      background: alert.severity === 'high' ? 'rgba(255,82,82,0.06)' : 'rgba(255,152,0,0.06)',
                      border: `1px solid ${alert.severity === 'high' ? 'rgba(255,82,82,0.3)' : 'rgba(255,152,0,0.3)'}`,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{alert.severity === 'high' ? '🚨' : '⚠️'}</span>
                      <div>
                        <div className="mb-0.5 text-sm font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {alert.title}
                        </div>
                        <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                          {alert.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          <GlassCard title="Institution Details">
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-[#777]">Status</dt>
                <dd className="font-semibold text-emerald-400">{statusLabel(institution.status)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#777]">Branches</dt>
                <dd className="text-white">{branches.length}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#777]">Batches</dt>
                <dd className="text-white">{data.reports.totalBatches}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#777]">Recorded classes</dt>
                <dd className="text-white">{data.reports.totalClasses}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[#777]">Attendance records</dt>
                <dd className="text-white">{data.reports.attendanceTotal}</dd>
              </div>
            </dl>
          </GlassCard>
        </div>
      </div>
    </>
  );
}

export default function InstitutionDashboard() {
  return (
    <InstitutionPage
      title="Institution Dashboard"
      subtitle={(data) => data?.institution
        ? `${data.institution.name} · ${data.institution.code} · Live institution data`
        : 'Live institution overview'}
    >
      {(data) => <DashboardContent data={data} />}
    </InstitutionPage>
  );
}
