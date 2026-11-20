'use client';

import GlassCard from '@/components/dashboard/GlassCard';
import InstitutionPage from '@/components/dashboard/institution/InstitutionPage';
import { formatPercent, type InstitutionBatch } from '@/lib/institution';

function BatchesGrid({ batches }: { batches: InstitutionBatch[] }) {
  if (batches.length === 0) {
    return (
      <div className="flex items-center justify-center px-4 py-10 text-sm text-[#888]">
        No batches have been created for this institution yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {batches.map((batch) => (
        <GlassCard key={batch.id} title={batch.name}>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-medium text-[#D4A843]">{batch.branchName}</div>
              <div className="text-[11px] font-medium" style={{ color: batch.status === 'active' ? '#4CAF50' : batch.status === 'completed' ? '#888888' : '#D4A843' }}>
                {batch.status.charAt(0).toUpperCase()}{batch.status.slice(1)}
              </div>
            </div>
            <div className="flex justify-between text-xs text-[#AAA] pt-2 border-t border-white/[0.06]">
              <span>Programme: {batch.programmeName}</span>
              <span>Grade: {batch.grade || 'Not set'}</span>
            </div>
            <div className="flex justify-between text-xs pt-1">
              <span className="text-[#888]">Enrolled: {batch.studentCount}</span>
              <span className="text-[#888888]">Attendance: {formatPercent(batch.attendanceRate)}</span>
            </div>
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#888888]">Completion:</span>
                <span className="font-mono font-bold text-emerald-400">{formatPercent(batch.completionRate)}</span>
              </div>
              <div className="w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-[#D4A843] transition-all duration-700"
                  style={{ width: `${Math.max(0, Math.min(100, batch.completionRate ?? 0))}%` }}
                />
              </div>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

export default function InstitutionBatchesPage() {
  return (
    <InstitutionPage
      title="Batches & Progress"
      subtitle={(data) => data?.institution ? `${data.institution.name} · ${data.reports.activeBatches} active of ${data.reports.totalBatches}` : 'Batch and cohort progress for your institution'}
    >
      {(data) => (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Batches', value: data.reports.totalBatches, color: '#D4A843' },
              { label: 'Active Batches', value: data.reports.activeBatches, color: '#4CAF50' },
              { label: 'Students', value: data.reports.totalStudents, color: '#00BCD4' },
              { label: 'Attendance', value: formatPercent(data.reports.attendanceRate), color: '#D4A843' },
            ].map((metric) => (
              <div key={metric.label} className="rounded-xl p-4 flex flex-col justify-between" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-xs text-[#888] font-medium">{metric.label}</span>
                <span className="text-2xl font-bold mt-2" style={{ color: metric.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                  {metric.value}
                </span>
              </div>
            ))}
          </div>
          <BatchesGrid batches={data.batches} />
        </>
      )}
    </InstitutionPage>
  );
}
