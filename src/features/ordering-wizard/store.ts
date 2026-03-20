import { create } from 'zustand';
import { getMockJurisdictions } from '@/shared/api/mockData';
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
  wordCount: WordCountData;
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
  updateWordCount: <K extends keyof WordCountData>(field: K, value: number) => void;
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
  customerReference: 'AG-2021-FRT',
  personInCharge: 'Irena Pasic',
  poNumber: 'PO-98754',
  jurisdictions: getMockJurisdictions(),
  wordCount: {
    numberOfClaims: 14,
    wordsInClaims: 1032,
    independentClaims: 3,
    wordsInDescription: 9881,
    totalPages: 47,
    pagesOfClaims: 4,
    totalWords: 10913,
    pagesOfDescription: 28,
    pagesOfDrawings: 15,
    pagesOfSequenceListing: 0,
  } as WordCountData,
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

  updateWordCount: (field, value) =>
    set((state) => ({
      wordCount: { ...state.wordCount, [field]: value },
    })),

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
