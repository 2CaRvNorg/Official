'use client';

import GlassCard from '@/components/dashboard/GlassCard';
import InstitutionPage from '@/components/dashboard/institution/InstitutionPage';
import { formatDateTime } from '@/lib/institution';

function ScheduleCard({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: Array<{ id: string; title: string; subtitle: string; detail: string; actionLabel?: string; actionHref?: string }>;
  emptyMessage: string;
}) {
  return (
    <GlassCard title={title}>
      {items.length === 0 ? (
        <div className="flex items-center justify-center px-4 py-10 text-sm text-[#888]">{emptyMessage}</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl p-4 bg-white/[0.02] border border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-[#D4A843]">{item.subtitle}</p>
                <p className="text-xs text-[#888]">{item.detail}</p>
              </div>
              <div className="flex items-center gap-2">
                {item.actionLabel && item.actionHref && (
                  <a href={item.actionHref} className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors">
                    {item.actionLabel}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}

export default function InstitutionSchedulePage() {
  return (
    <InstitutionPage
      title="Campus Faculty Schedules"
      subtitle={(data) => data?.institution ? `${data.institution.name} · live schedules` : 'Live teaching timetable for your institution'}
    >
      {(data) => {
        const classItems = data.liveClasses.map((liveClass) => ({
          id: liveClass.id,
          title: liveClass.title,
          subtitle: `${liveClass.subjectName} · ${liveClass.batchName}`,
          detail: `${formatDateTime(liveClass.scheduledStart)} — ${formatDateTime(liveClass.scheduledEnd)}`,
          actionLabel: liveClass.meetUrl ? 'Join class' : undefined,
          actionHref: liveClass.meetUrl || undefined,
        }));

        const assignmentItems = data.teacherAssignments.map((assignment) => ({
          id: assignment.id,
          title: assignment.teacherName,
          subtitle: `${assignment.subjectName} · ${assignment.batchName}`,
          detail: assignment.teacherEmail ? assignment.teacherEmail : 'Email not recorded',
        }));

        return (
          <div className="space-y-5">
            <ScheduleCard
              title="Live & Upcoming Classes"
              items={classItems}
              emptyMessage="No live classes are scheduled for your institution right now."
            />
            <ScheduleCard
              title="Faculty Assignments"
              items={assignmentItems}
              emptyMessage="No faculty assignments have been recorded for your institution yet."
            />
          </div>
        );
      }}
    </InstitutionPage>
  );
}
