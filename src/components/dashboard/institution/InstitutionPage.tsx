'use client';

import { useInstitutionData } from '@/lib/use-institution-data';
import { getInitials, type InstitutionDashboardData } from '@/lib/institution';
import InstitutionShell from './InstitutionShell';

interface InstitutionPageProps {
  title: string;
  subtitle?: string | ((data: InstitutionDashboardData | null) => string | undefined);
  children: (data: InstitutionDashboardData) => React.ReactNode;
}

/**
 * Shared shell for every institution-head page. It resolves the signed-in
 * head's institution, renders loading/error/unassigned states, and only calls
 * the page renderer when real institution data is available.
 */
export default function InstitutionPage({ title, subtitle, children }: InstitutionPageProps) {
  const { data, isLoading, error, refresh } = useInstitutionData();
  const resolvedSubtitle = typeof subtitle === 'function' ? subtitle(data) : subtitle;

  return (
    <InstitutionShell
      title={title}
      subtitle={resolvedSubtitle}
      viewerName={data?.viewer.fullName}
      avatarInitials={data?.viewer.fullName ? getInitials(data.viewer.fullName) : undefined}
      notificationCount={data?.alerts.length ?? 0}
      isLoading={isLoading}
      error={error}
      unassigned={!isLoading && !error && !data?.institution}
      onRetry={refresh}
    >
      {data?.institution ? children(data) : null}
    </InstitutionShell>
  );
}
