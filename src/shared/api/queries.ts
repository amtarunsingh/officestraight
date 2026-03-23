import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMockCases, getMockCase, getMockJurisdictions } from './mockData';
import type { Case, PaginatedResponse, JurisdictionSelection } from '@/types';

// ── Query Keys (centralised to avoid stale cache bugs) ──
export const queryKeys = {
  cases: ['cases'] as const,
  caseList: (filters: Record<string, string>) => ['cases', 'list', filters] as const,
  caseDetail: (id: string) => ['cases', id] as const,
  jurisdictions: (caseId: string) => ['jurisdictions', caseId] as const,
  quote: (caseId: string) => ['quote', caseId] as const,
  orderDetail: (orderId: string) => ['order', orderId] as const,
  patent: (applicationNumber: string) => ['patent', applicationNumber] as const,
};

// ── Cases ──
export function useCases(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: queryKeys.caseList(filters),
    queryFn: (): PaginatedResponse<Case> => getMockCases(filters),
  });
}

export function useCase(caseId: string) {
  return useQuery({
    queryKey: queryKeys.caseDetail(caseId),
    queryFn: (): Case => getMockCase(caseId),
    enabled: !!caseId,
  });
}

// ── Jurisdictions for a case ──
export function useJurisdictions(caseId: string) {
  return useQuery({
    queryKey: queryKeys.jurisdictions(caseId),
    queryFn: (): JurisdictionSelection[] => getMockJurisdictions(),
    enabled: !!caseId,
  });
}

// ── Quote ──
export function useQuote(caseId: string) {
  return useQuery({
    queryKey: queryKeys.quote(caseId),
    queryFn: () => ({ caseId, total: 5347.51, currency: 'EUR' }),
    enabled: !!caseId,
  });
}

// ── Mutations (mock — resolve immediately) ──
export function useCreateCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_applicationNumber: string): Promise<Case> => {
      await delay(300);
      return getMockCase('case-001');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cases });
    },
  });
}

export function useSaveWizardStep(caseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (_data: { step: string; payload: unknown }) => {
      await delay(200);
      return { ok: true };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.caseDetail(caseId) });
    },
  });
}

export function usePlaceOrder(caseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await delay(500);
      return { ok: true };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cases });
      qc.invalidateQueries({ queryKey: queryKeys.caseDetail(caseId) });
    },
  });
}

export function useCancelCase(_caseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await delay(300);
      return { ok: true };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cases });
    },
  });
}

// ── Order Detail ──
export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: queryKeys.orderDetail(orderId),
    queryFn: () => ({ orderId, status: 'pending' }),
    enabled: !!orderId,
  });
}

// ── WIPO Lookup ──
export function usePatentLookup(applicationNumber: string) {
  return useQuery({
    queryKey: queryKeys.patent(applicationNumber),
    queryFn: () => getMockCase('case-001').patent,
    enabled: false,
  });
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
