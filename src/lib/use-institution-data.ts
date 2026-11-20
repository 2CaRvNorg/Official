'use client';

import { useCallback, useEffect, useState } from 'react';
import type { InstitutionDashboardData } from '@/lib/institution';

interface UseInstitutionDataResult {
  data: InstitutionDashboardData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Loads the signed-in institution head's dashboard data from the authenticated
 * API. The API performs the head_user_id lookup and all related queries, so no
 * institution or sample data is ever hardcoded in the UI.
 */
export function useInstitutionData(): UseInstitutionDataResult {
  const [data, setData] = useState<InstitutionDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => {
    setReloadKey((value) => value + 1);
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/institution/data', { cache: 'no-store' });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(typeof result?.error === 'string' ? result.error : 'Failed to load institution data.');
        }
        if (!active) return;
        setData(result as InstitutionDashboardData);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : 'Failed to load institution data.');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [reloadKey]);

  return { data, isLoading, error, refresh };
}
