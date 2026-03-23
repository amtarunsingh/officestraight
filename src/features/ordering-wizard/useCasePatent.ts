import { useParams } from 'react-router-dom';
import { useCase } from '@/shared/api/queries';
import type { Patent } from '@/types';

/**
 * Convenience hook — every wizard page needs the patent for the sidebar.
 * Returns { patent, isLoading } derived from the case query.
 */
export function useCasePatent(): { patent: Patent | null; isLoading: boolean } {
  const { caseId } = useParams<{ caseId: string }>();
  const { data, isLoading } = useCase(caseId ?? '');
  return {
    patent: data?.patent ?? null,
    isLoading,
  };
}
