'use client';

import InstitutionPage from '@/components/dashboard/institution/InstitutionPage';

export default function InstitutionAlertsPage() {
  return (
    <InstitutionPage
      title="Campus Support & Intervention Alerts"
      subtitle={(data) => data?.institution ? `${data.institution.name} · live alerts` : 'Real alerts for students or batches in need of support'}
    >
      {(data) => (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-5">
            {data.alerts.map((alert) => {
              const isHigh = alert.severity === 'high';
              const isMedium = alert.severity === 'medium';

              return (
                <div
                  key={alert.id}
                  className="p-5 rounded-2xl space-y-3"
                  style={{
                    background: isHigh ? 'rgba(255,82,82,0.10)' : isMedium ? 'rgba(255,152,0,0.10)' : 'rgba(24,92,205,0.10)',
                    border: `1px solid ${isHigh ? 'rgba(255,82,82,0.35)' : isMedium ? 'rgba(255,152,0,0.35)' : 'rgba(24,92,205,0.35)'}`,
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2">
                      <span className="text-lg" style={{ color: isHigh ? '#FF5252' : isMedium ? '#FF9800' : '#4A90E2' }}>
                        {isHigh ? '🚨' : isMedium ? '⚠️' : 'ℹ️'}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          {alert.title}
                        </div>
                        <div className="text-xs mt-0.5 leading-relaxed text-[#AAA]">{alert.description}</div>
                      </div>
                    </div>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase"
                      style={{
                        background: isHigh ? 'rgba(255,82,82,0.15)' : isMedium ? 'rgba(255,152,0,0.15)' : 'rgba(74,144,226,0.15)',
                        color: isHigh ? '#FF5252' : isMedium ? '#FF9800' : '#4A90E2',
                      }}
                    >
                      {alert.severity}
                    </span>
                  </div>
                </div>
              );
            })}
            {data.alerts.length === 0 && (
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 text-center text-sm text-[#888]">
                No active support or intervention alerts have been recorded for this institution.
              </div>
            )}
          </div>
          <div className="space-y-5">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
              <div className="text-sm font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Alert action guidance
              </div>
              <div className="mt-2 space-y-2 text-xs text-[#AAA]">
                <p>High and medium alerts are generated from real student attendance and batch performance data.</p>
                <p>Resolve the underlying attendance, task or assignment issue, then reload this view.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </InstitutionPage>
  );
}
