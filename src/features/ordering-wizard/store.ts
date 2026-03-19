import { create } from 'zustand';
import type {
  JurisdictionSelection,
  WordCountData,
  OperationalInstructions,
  Inventor,
  BillingInfo,
  BasisOption,
} from '@/types';

interface WizardState {
  // ── Quote Phase ──
  caseId: string | null;
  customerReference: string;
  personInCharge: string;
  poNumber: string;
  jurisdictions: JurisdictionSelection[];
  wordCount: WordCountData | null;
  wordCountMode: 'estimate' | 'guaranteed';
  guaranteedQuoteComment: string;

  // ── Order Phase ──
  instructions: OperationalInstructions;
  inventors: Inventor[];
  payRenewalFees: boolean;
  renewalOffices: string[];
  separateInvoices: boolean;
  invoiceWithAcknowledgment: boolean;
  sourceDocument: string;
  translatorRequests: string;
  additionalInfo: string;
  billing: BillingInfo | null;

  // ── Actions ──
  setCaseId: (id: string) => void;
  setField: <K extends keyof WizardState>(key: K, value: WizardState[K]) => void;
  updateJurisdiction: (code: string, updates: Partial<JurisdictionSelection>) => void;
  toggleJurisdiction: (code: string) => void;
  setJurisdictionBasis: (code: string, basis: BasisOption) => void;
  reset: () => void;
}

const defaultInstructions: OperationalInstructions = {
  sameApplicants: 'provide_later',
  changesMade: 'provide_later',
  worldwideAssignment: 'provide_later',
  salariedInventors: 'provide_later',
  priorityDocSubmitted: 'provide_later',
  utilityModel: 'provide_later',
};

const initialState = {
  caseId: null,
  customerReference: '',
  personInCharge: '',
  poNumber: '',
  jurisdictions: [],
  wordCount: null,
  wordCountMode: 'estimate' as const,
  guaranteedQuoteComment: '',
  instructions: defaultInstructions,
  inventors: [],
  payRenewalFees: true,
  renewalOffices: [],
  separateInvoices: false,
  invoiceWithAcknowledgment: false,
  sourceDocument: 'b1_text',
  translatorRequests: '',
  additionalInfo: '',
  billing: null,
};

export const useWizardStore = create<WizardState>()((set) => ({
  ...initialState,

  setCaseId: (id) => set({ caseId: id }),

  setField: (key, value) => set({ [key]: value }),

  updateJurisdiction: (code, updates) =>
    set((state) => ({
      jurisdictions: state.jurisdictions.map((j) =>
        j.code === code ? { ...j, ...updates } : j,
      ),
    })),

  toggleJurisdiction: (code) =>
    set((state) => ({
      jurisdictions: state.jurisdictions.map((j) =>
        j.code === code ? { ...j, selected: !j.selected } : j,
      ),
    })),

  setJurisdictionBasis: (code, basis) =>
    set((state) => ({
      jurisdictions: state.jurisdictions.map((j) =>
        j.code === code ? { ...j, basis } : j,
      ),
    })),

  reset: () => set(initialState),
}));
