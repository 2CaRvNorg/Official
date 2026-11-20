'use client';

import GlassCard from '@/components/dashboard/GlassCard';
import InstitutionPage from '@/components/dashboard/institution/InstitutionPage';
import { attendanceColor, formatPercent, type InstitutionDashboardData, type InstitutionReportBatch } from '@/lib/institution';

function escapeCsv(value: string | number | null | undefined) {
  const text = value == null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadReports(data: InstitutionDashboardData) {
  const institutionName = data.institution?.name ?? 'Institution reports';
  const rows: string[][] = [
    ['Batch', 'Programme', 'Grade', 'Students', 'Classes', 'Attendance Rate', 'Completion Rate', 'Status'],
    ...data.reports.batches.map((batch) => [
      batch.batchName,
      batch.programmeName,
      batch.grade ?? 'Not set',
      String(batch.studentCount),
      String(batch.classCount),
      formatPercent(batch.attendanceRate),
      formatPercent(batch.completionRate),
      batch.status.charAt(0).toUpperCase() + batch.status.slice(1),
    ]),
  ];

  const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${institutionName.replace(/[^A-Za-z0-9]+/g, '-').toLowerCase()}-reports.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function ReportsGrid({ batches }: { batches: InstitutionReportBatch[] }) {
  if (batches.length === 0) {
    return <p className="px-5 py-10 text-center text-sm text-[#888]">No batches have been created for this institution yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {['Batch', 'Programme', 'Grade', 'Students', 'Classes', 'Attendance %', 'Completion %', 'Status'].map((heading) => (
              <th key={heading} className="text-left pb-3 pr-4 text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {batches.map((batch) => (
            <tr key={batch.batchId} className="hover:bg-white/[0.02]">
              <td className="py-3.5 pr-4 text-white font-medium" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{batch.batchName}</td>
              <td className="py-3.5 pr-4 text-[#AAA]">{batch.programmeName}</td>
              <td className="py-3.5 pr-4 text-xs text-[#AAA]">{batch.grade || 'Not set'}</td>
              <td className="py-3.5 pr-4 text-[#FFFFFF]">{batch.studentCount}</td>
              <td className="py-3.5 pr-4 text-[#FFFFFF]">{batch.classCount}</td>
              <td className="py-3.5 pr-4">
                <span className="font-mono text-[#D4A843] font-bold" style={{ color: attendanceColor(batch.attendanceRate) }}>
                  {formatPercent(batch.attendanceRate)}
                </span>
              </td>
              <td className="py-3.5 pr-4">
                <span className="font-mono text-[#4CAF50] font-bold">{formatPercent(batch.completionRate)}</span>
              </td>
              <td className="py-3.5 pr-4 text-[#888]">{batch.status.charAt(0).toUpperCase()}{batch.status.slice(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function InstitutionReportsPage() {
  return (
    <InstitutionPage
      title="Campus Reports & Academic Performance"
      subtitle={(data) => data?.institution ? `${data.institution.name} · live reports` : 'Real-time batch, student and attendance reports for your institution'}
    >
      {(data) => {
        const reports = data.reports;
        const summary = [
          { label: 'Total Students', value: reports.totalStudents.toLocaleString(), color: '#00BCD4' },
          { label: 'Active Batches', value: reports.activeBatches.toLocaleString(), color: '#D4A843' },
          { label: 'Attendance Rate', value: formatPercent(reports.attendanceRate), color: '#4CAF50' },
          { label: 'Recorded Classes', value: reports.totalClasses.toLocaleString(), color: '#7C4DFF' },
        ];

        return (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {summary.map((metric) => (
                <div key={metric.label} className="rounded-xl p-4" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-xs text-[#888] font-medium">{metric.label}</div>
                  <div className="text-xl font-bold mt-1" style={{ color: metric.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>

            <GlassCard title="Batch & Programme Reports">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-white font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {reports.activeBatches} active of {reports.totalBatches} batches
                    </p>
                    <p className="text-xs text-[#888]">Attendance and completion are calculated from real classes, rosters and attendance records.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => downloadReports(data)}
                    className="rounded-xl px-4 py-2 text-xs font-bold text-[#0D0D0D] transition-all hover:brightness-110"
                    style={{ background: '#D4A843', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    Download batch report
                  </button>
                </div>
                <ReportsGrid batches={reports.batches} />
              </div>
            </GlassCard>
          </>
        );
      }}
    </InstitutionPage>
  );
}
