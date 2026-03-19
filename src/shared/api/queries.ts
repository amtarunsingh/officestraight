import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
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
  const params = new URLSearchParams(filters).toString();
  return useQuery({
    queryKey: queryKeys.caseList(filters),
    queryFn: () => api.get<PaginatedResponse<Case>>(`/cases/?${params}`),
  });
}

export function useCase(caseId: string) {
  return useQuery({
    queryKey: queryKeys.caseDetail(caseId),
    queryFn: () => api.get<Case>(`/cases/${caseId}/`),
    enabled: !!caseId,
  });
}

// ── Jurisdictions for a case ──
export function useJurisdictions(caseId: string) {
  return useQuery({
    queryKey: queryKeys.jurisdictions(caseId),
    queryFn: () => api.get<JurisdictionSelection[]>(`/cases/${caseId}/jurisdictions/`),
    enabled: !!caseId,
  });
}

// ── Quote ──
export function useQuote(caseId: string) {
  return useQuery({
    queryKey: queryKeys.quote(caseId),
    queryFn: () => api.get(`/cases/${caseId}/quote/`),
    enabled: !!caseId,
  });
}

// ── Mutations ──
export function useCreateCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (applicationNumber: string) =>
      api.post<Case>('/cases/', { applicationNumber }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cases });
    },
  });
}

export function useSaveWizardStep(caseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { step: string; payload: unknown }) =>
      api.patch(`/cases/${caseId}/${data.step}/`, data.payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.caseDetail(caseId) });
    },
  });
}

export function usePlaceOrder(caseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post(`/cases/${caseId}/place-order/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cases });
      qc.invalidateQueries({ queryKey: queryKeys.caseDetail(caseId) });
    },
  });
}

export function useCancelCase(caseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.post(`/cases/${caseId}/cancel/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cases });
    },
  });
}

// ── Order Detail ──
export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: queryKeys.orderDetail(orderId),
    queryFn: () => api.get(`/orders/${orderId}/`),
    enabled: !!orderId,
  });
}

// ── WIPO Lookup ──
export function usePatentLookup(applicationNumber: string) {
  return useQuery({
    queryKey: queryKeys.patent(applicationNumber),
    queryFn: () => api.get(`/wipo/lookup/?q=${encodeURIComponent(applicationNumber)}`),
    enabled: false, // Manual trigger only
  });
}
