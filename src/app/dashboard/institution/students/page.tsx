'use client';

import GlassCard from '@/components/dashboard/GlassCard';
import InstitutionPage from '@/components/dashboard/institution/InstitutionPage';
import { attendanceColor, formatPercent, getInitials, type InstitutionDashboardData, type InstitutionStudent } from '@/lib/institution';

function StudentsTable({ students }: { students: InstitutionStudent[] }) {
  if (students.length === 0) {
    return (
      <div className="flex items-center justify-center px-4 py-10 text-sm text-[#888]">
        No enrolled students have been found for this institution yet.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {['Learner Name', 'Cohort Batch', 'Attendance %', 'Pacing Health', 'Flag'].map((heading) => (
              <th key={heading} className="py-3.5 pr-4 text-left text-[11px] font-semibold text-[#888] uppercase tracking-wider">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04]">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-white/[0.02]">
              <td className="py-3.5 pr-4">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: 'rgba(212,168,67,0.15)', color: '#D4A843', fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {getInitials(student.name).slice(0, 1)}
                  </div>
                  <span className="font-semibold text-white text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {student.name}
                  </span>
                </div>
              </td>
              <td className="py-3.5 pr-4 text-xs text-[#AAA]">{student.batchName}</td>
              <td className="py-3.5 pr-4">
                <span className="font-mono font-bold text-[#D4A843]" style={{ color: attendanceColor(student.attendanceRate) }}>
                  {formatPercent(student.attendanceRate)}
                </span>
              </td>
              <td className="py-3.5 pr-4 text-xs text-white/80">{student.pacingHealth}</td>
              <td className="py-3.5 pr-4">
                <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${student.flag === 'Active' ? 'text-emerald-400 bg-emerald-500/10' : student.flag === 'Warning' ? 'text-amber-400 bg-amber-500/10' : 'text-red-400 bg-red-500/10'}`}>
                  {student.flag}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function InstitutionStudentsPage() {
  return (
    <InstitutionPage
      title="Student Roster"
      subtitle={(data) => data?.institution ? `${data.institution.name} · ${data.reports.totalStudents} active learners` : 'Enrolled learners for your institution'}
    >
      {(data) => (
        <GlassCard title={`Enrolled Students (${data.reports.totalStudents})`}>
          {data.students.length === 0 && (data.institution?.branches.length ?? 0) === 0 && (
            <div className="px-4 py-10 text-center text-sm text-[#888]">
              No branches have been added to your institution yet, so there are no students to display.
            </div>
          )}
          {data.students.length > 0 && <StudentsTable students={data.students} />}
          {data.students.length === 0 && (data.institution?.branches.length ?? 0) > 0 && (
            <div className="px-4 py-10 text-center text-sm text-[#888]">
              No enrolled students have been found for this institution yet.
            </div>
          )}
        </GlassCard>
      )}
    </InstitutionPage>
  );
}
