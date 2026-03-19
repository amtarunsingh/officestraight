// ── Domain Types ──
// These mirror the Django backend models. Dynamic data will come from API.

export interface Patent {
  title: string;
  applicationNumber: string;
  publicationNumber: string;
  publicationDate: string;
  publicationLanguage: string;
  receivingOffice: string;
  filingDate: string;
  priorityDate: string;
  deadline30Month: string;
  deadline31Month: string;
}

export interface Owner {
  fullName: string;
  address: string;
  country: string;
}

export interface WordCountData {
  wordsInDescription: number;
  wordsInClaims: number;
  pagesOfDescription: number;
  pagesOfClaims: number;
  numberOfClaims: number;
  independentClaims: number;
  pagesOfDrawings: number;
  pagesOfSequenceListing: number;
  totalWords: number;
  totalPages: number;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
}

export type BasisOption = 'as_filed' | 'art19_amended' | 'voluntary';

export interface JurisdictionSelection {
  code: string;
  name: string;
  region: string;
  selected: boolean;
  agent: Agent;
  basis: BasisOption;
  description: string;
  claims: string;
  officialFee: number;
  serviceFee: number;
  translationFee: number;
  totalFee: number;
  deadlinePassed: boolean;
}

export type CaseStatus =
  | 'quote_incomplete'
  | 'quote_complete'
  | 'pending_order'
  | 'order_placed'
  | 'cancelled';

export interface CaseOrder {
  id: string;
  date: string;
  jurisdiction: string;
  hasReferences: boolean;
}

export interface Case {
  id: string;
  status: CaseStatus;
  title: string;
  applicationNumber: string;
  clientReference: string;
  date: string;
  total: number;
  currency: string;
  quoteStoppedAt: string | null;
  orders: CaseOrder[];
  patent: Patent;
}

export interface QuoteReference {
  customerReference: string;
  personInCharge: string;
  poNumber: string;
  valipatReference: string;
  quoteCreationDate: string;
  orderDate: string;
}

export type InstructionAnswer = 'yes' | 'no' | 'provide_later';

export interface OperationalInstructions {
  sameApplicants: InstructionAnswer;
  changesMade: InstructionAnswer;
  worldwideAssignment: InstructionAnswer;
  salariedInventors: InstructionAnswer;
  priorityDocSubmitted: InstructionAnswer;
  utilityModel: InstructionAnswer;
}

export interface Inventor {
  id: string;
  fullName: string;
  citizenship: string;
  preFilledFromWipo: boolean;
}

export interface BillingInfo {
  company: string;
  address: string;
  city: string;
  postcode: string;
  country: string;
  vatNumber: string;
  emailTo: string;
  emailCc: string;
}

// ── Order Detail Types ──
export type OrderDetailTab =
  | 'summary'
  | 'quote'
  | 'client'
  | 'documents'
  | 'entry_basis'
  | 'progress';

export interface ProgressEntry {
  country: string;
  orderSent: boolean;
  entryFiled: boolean;
  filingReceipt: boolean;
  transfer: boolean;
}

// ── API Response wrappers ──
export interface PaginatedResponse<T> {
  count: number;
  page: number;
  pageSize: number;
  results: T[];
}
