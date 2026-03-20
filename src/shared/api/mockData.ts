import type {
  Case,
  Patent,
  JurisdictionSelection,
  PaginatedResponse,
} from '@/types';

// ── Shared patent ──
const MOCK_PATENT: Patent = {
  title: 'WATER-SOLUBLE FERTILIZER COMPOSITION FOR AGRICULTURAL USE',
  applicationNumber: 'PCT/EP2021/062584',
  publicationNumber: 'WO/2021228919',
  publicationDate: '2021-11-18',
  publicationLanguage: 'English',
  receivingOffice: 'European Patent Office (EP)',
  filingDate: '2021-05-12',
  priorityDate: '2020-05-13',
  deadline30Month: '2022-11-13',
  deadline31Month: '2022-12-13',
};

// ── Cases list ──
const MOCK_CASES: Case[] = [
  {
    id: 'case-001',
    status: 'quote_incomplete',
    title: 'Water-soluble fertilizer',
    applicationNumber: 'PCT/EP2021/062584',
    clientReference: 'AG-2021-FRT',
    date: '2025-10-15',
    total: 5347.51,
    currency: 'EUR',
    quoteStoppedAt: 'Service Selection',
    orders: [],
    patent: MOCK_PATENT,
  },
  {
    id: 'case-002',
    status: 'order_placed',
    title: 'Biodegradable polymer packaging',
    applicationNumber: 'PCT/US2022/014379',
    clientReference: 'PKG-2022-BIO',
    date: '2025-09-28',
    total: 12480.00,
    currency: 'EUR',
    quoteStoppedAt: null,
    orders: [
      { id: 'ord-101', date: '2025-09-30', jurisdiction: 'Germany (DE)', hasReferences: true },
      { id: 'ord-102', date: '2025-09-30', jurisdiction: 'France (FR)', hasReferences: false },
      { id: 'ord-103', date: '2025-10-01', jurisdiction: 'Japan (JP)', hasReferences: true },
    ],
    patent: {
      ...MOCK_PATENT,
      title: 'BIODEGRADABLE POLYMER PACKAGING MATERIAL',
      applicationNumber: 'PCT/US2022/014379',
      publicationNumber: 'WO/2022165012',
      publicationDate: '2022-08-04',
      filingDate: '2022-01-28',
      priorityDate: '2021-02-01',
      deadline30Month: '2023-08-01',
      deadline31Month: '2023-09-01',
    },
  },
  {
    id: 'case-003',
    status: 'quote_complete',
    title: 'Lithium-ion battery thermal management',
    applicationNumber: 'PCT/KR2023/005891',
    clientReference: 'BAT-2023-THM',
    date: '2025-11-02',
    total: 8915.30,
    currency: 'EUR',
    quoteStoppedAt: null,
    orders: [],
    patent: {
      ...MOCK_PATENT,
      title: 'THERMAL MANAGEMENT SYSTEM FOR LITHIUM-ION BATTERIES',
      applicationNumber: 'PCT/KR2023/005891',
      publicationNumber: 'WO/2023219845',
      publicationDate: '2023-11-16',
      filingDate: '2023-04-27',
      priorityDate: '2022-05-12',
      deadline30Month: '2024-11-12',
      deadline31Month: '2024-12-12',
    },
  },
  {
    id: 'case-004',
    status: 'pending_order',
    title: 'Wireless power transfer for EV charging',
    applicationNumber: 'PCT/JP2022/038471',
    clientReference: 'EV-WPT-2022',
    date: '2025-08-18',
    total: 6230.75,
    currency: 'EUR',
    quoteStoppedAt: 'Word Count',
    orders: [],
    patent: {
      ...MOCK_PATENT,
      title: 'WIRELESS POWER TRANSFER APPARATUS FOR ELECTRIC VEHICLE CHARGING',
      applicationNumber: 'PCT/JP2022/038471',
      publicationNumber: 'WO/2023068192',
      publicationDate: '2023-04-27',
      filingDate: '2022-10-14',
      priorityDate: '2021-10-22',
      deadline30Month: '2024-04-22',
      deadline31Month: '2024-05-22',
    },
  },
  {
    id: 'case-005',
    status: 'cancelled',
    title: 'CRISPR gene editing method',
    applicationNumber: 'PCT/GB2021/051203',
    clientReference: 'BIO-CRISPR-21',
    date: '2025-06-10',
    total: 3450.00,
    currency: 'EUR',
    quoteStoppedAt: null,
    orders: [],
    patent: {
      ...MOCK_PATENT,
      title: 'METHOD FOR CRISPR-MEDIATED GENE EDITING IN PLANT CELLS',
      applicationNumber: 'PCT/GB2021/051203',
      publicationNumber: 'WO/2021224618',
      publicationDate: '2021-11-11',
      filingDate: '2021-05-07',
      priorityDate: '2020-05-08',
      deadline30Month: '2022-11-08',
      deadline31Month: '2022-12-08',
    },
  },
];

// ── Jurisdictions ──
const agents = {
  saba: { id: 'agt-1', name: 'Saba Intellectual Property', email: 'saba@ipfirm.com' },
  destek: { id: 'agt-2', name: 'Destek Patent SA', email: 'contact@destek.com' },
  adams: { id: 'agt-3', name: 'Adams & Adams', email: 'patents@adams.com' },
  hanschell: { id: 'agt-4', name: 'Hanschell & Company', email: 'info@hanschell.com' },
};

const MOCK_JURISDICTIONS: JurisdictionSelection[] = [
  { code: 'EG', name: 'Egypt', region: 'Africa', selected: true, agent: agents.saba, basis: 'as_filed', description: 'el', claims: 'sq', officialFee: 3.30, serviceFee: 1390.00, translationFee: 0, totalFee: 1393.30, deadlinePassed: true },
  { code: 'LY', name: 'Libya', region: 'Africa', selected: true, agent: agents.saba, basis: 'as_filed', description: '-', claims: 'sq', officialFee: 12.56, serviceFee: 990.00, translationFee: 0, totalFee: 1002.56, deadlinePassed: false },
  { code: 'BB', name: 'Barbados', region: 'Caribbean', selected: true, agent: agents.hanschell, basis: 'as_filed', description: '-', claims: 'sq', officialFee: 321.70, serviceFee: 940.00, translationFee: 0, totalFee: 1261.70, deadlinePassed: false },
  { code: 'OA', name: 'OAPI', region: 'Africa', selected: true, agent: agents.adams, basis: 'as_filed', description: 'fr', claims: 'sq', officialFee: 3707.51, serviceFee: 1640.00, translationFee: 0, totalFee: 5347.51, deadlinePassed: true },
  { code: 'DE', name: 'Germany', region: 'Europe', selected: false, agent: agents.destek, basis: 'as_filed', description: 'de', claims: 'sq', officialFee: 290.00, serviceFee: 550.00, translationFee: 1200.00, totalFee: 2040.00, deadlinePassed: false },
  { code: 'FR', name: 'France', region: 'Europe', selected: false, agent: agents.destek, basis: 'as_filed', description: 'fr', claims: 'sq', officialFee: 245.00, serviceFee: 480.00, translationFee: 980.00, totalFee: 1705.00, deadlinePassed: false },
  { code: 'JP', name: 'Japan', region: 'Asia', selected: false, agent: agents.saba, basis: 'art19_amended', description: 'ja', claims: 'sq', officialFee: 1520.00, serviceFee: 1100.00, translationFee: 2400.00, totalFee: 5020.00, deadlinePassed: false },
  { code: 'CN', name: 'China', region: 'Asia', selected: false, agent: agents.saba, basis: 'as_filed', description: 'zh', claims: 'sq', officialFee: 890.00, serviceFee: 750.00, translationFee: 1850.00, totalFee: 3490.00, deadlinePassed: false },
  { code: 'IN', name: 'India', region: 'Asia', selected: false, agent: agents.adams, basis: 'as_filed', description: 'hi', claims: 'sq', officialFee: 180.00, serviceFee: 620.00, translationFee: 0, totalFee: 800.00, deadlinePassed: false },
  { code: 'BR', name: 'Brazil', region: 'South America', selected: false, agent: agents.adams, basis: 'voluntary', description: 'pt', claims: 'sq', officialFee: 410.00, serviceFee: 880.00, translationFee: 1600.00, totalFee: 2890.00, deadlinePassed: false },
];

// ── Helpers ──

export function getMockCases(_filters?: Record<string, string>): PaginatedResponse<Case> {
  return {
    count: MOCK_CASES.length,
    page: 1,
    pageSize: 20,
    results: MOCK_CASES,
  };
}

export function getMockCase(caseId: string): Case {
  return MOCK_CASES.find((c) => c.id === caseId) ?? MOCK_CASES[0]!;
}

export function getMockJurisdictions(): JurisdictionSelection[] {
  return MOCK_JURISDICTIONS;
}

export function getMockPatent(): Patent {
  return MOCK_PATENT;
}
