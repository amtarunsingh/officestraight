import { useState, memo, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrderDetail } from '@/shared/api/queries';
import { Button, Badge, Card, Divider } from '@/shared/components/ui';
import { formatCurrency, cn } from '@/shared/lib/utils';

const TABS = ['Summary', 'Quote', 'Client', 'Documents', 'Entry basis', 'Progress follow-up'] as const;

// ── Shared detail row ──
function DetailRow({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-gray-300 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={cn('font-medium text-right', warn && 'text-red-600')}>{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="font-bold text-sm text-navy py-3 border-b-2 border-navy mb-2">{children}</div>;
}

function OrderFooter() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-end items-center gap-2.5 mt-5">
      <Button variant="link" size="sm" onClick={() => navigate('/')}>Back To</Button>
      <span className="text-gray-400">Or</span>
      <Button variant="primary" size="md" onClick={() => navigate('/')}>Start Case</Button>
    </div>
  );
}

// ── Tab: Summary ──
function SummaryTab() {
  // TODO: Replace with data from useOrderDetail
  return (
    <div>
      <SectionTitle>Status</SectionTitle>
      <div className="py-2 pb-4">
        <Badge color="pending">Pending</Badge>
        <span className="text-gray-500 text-sm ml-2">This order is awaiting acceptation by Valipat</span>
      </div>

      <SectionTitle>General information</SectionTitle>
      <DetailRow label="Title" value="Water-soluble fertilizer" />
      <DetailRow label="Application number" value="PCT/EP2021/062584" />
      <DetailRow label="Publication number" value="WO/2021228919" />
      <DetailRow label="Publication date" value="2021-11-18" />
      <DetailRow label="Publication language" value="English" />
      <DetailRow label="Receiving office" value="European Patent Office (EP)" />

      <SectionTitle>References</SectionTitle>
      <DetailRow label="Your reference" value="Not specified" warn />
      <DetailRow label="Person in charge" value="Not specified" warn />
      <DetailRow label="Valipat reference" value="PCT00016422" />
      <DetailRow label="Quote creation date" value="2025-10-22" />
      <DetailRow label="Order date" value="2025-10-22" />

      <SectionTitle>Owner(s)</SectionTitle>
      <DetailRow label="Full name" value="LIMA EUROPE" />
      <DetailRow label="Address" value="Doelhaagstraat 77 bus 1 2840 Rumst" />
      <DetailRow label="Country" value="Belgium" />

      <SectionTitle>Word count</SectionTitle>
      <DetailRow label="Words in desc." value="12059" />
      <DetailRow label="Words in claims" value="1831" />
      <DetailRow label="Pages of desc." value="44" />
      <DetailRow label="Pages of claims" value="9" />
      <DetailRow label="Number of claims" value="16" />
      <DetailRow label="Number of independent claims" value="1" />
      <DetailRow label="Pages of drawings" value="0" />

      <SectionTitle>Milestones</SectionTitle>
      <DetailRow label="Filing date" value="2021-05-12" />
      <DetailRow label="Priority date" value="2020-05-13" />
      <DetailRow label="30 months deadline" value="2022-11-13" />
      <DetailRow label="31 months deadline" value="2022-12-13" />

      <OrderFooter />
    </div>
  );
}

// ── Tab: Quote ──
function QuoteTab() {
  return (
    <div>
      <SectionTitle>Quote calculation</SectionTitle>
      <Card className="!border-navy !border-[1.5px] !p-6">
        <div className="font-bold text-xl text-navy mb-4">Quotation for PCT00016422</div>
        <div className="flex justify-end mb-3">
          <Button variant="outline" size="sm">Download as XLS</Button>
        </div>
        <div className="flex gap-4 mb-4 text-xs">
          <div><div className="text-gray-400">Generated on</div><div className="font-semibold">October 22, 2025</div></div>
          <div><div className="text-gray-400">Valid until</div><div className="font-semibold">November 13, 2025</div></div>
          <div><div className="text-gray-400">Late surcharges as of</div><div className="font-semibold">November 06, 2022</div></div>
          <div className="flex-1 p-3 bg-gray-50 rounded-md border border-gray-300 text-[11px]">
            <strong>From</strong><br />VALIPAT BV<br />Louizalaan 54, 1050 Brussels, BELGIUM
            <div className="mt-2"><strong>To</strong><br />Valipat S.A.</div>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          {[
            { label: 'Official', value: 'EUR 3 707.51', color: 'text-blue-600' },
            { label: 'Service', value: 'EUR 1640.00', color: 'text-gray-500' },
            { label: 'Translation', value: 'EUR 0.00', color: 'text-gray-500' },
            { label: 'Total', value: 'EUR 5 347.51', color: 'text-red-600' },
          ].map((f) => (
            <div key={f.label} className="flex-1 p-3 border border-gray-300 rounded-md">
              <div className={`text-[11px] font-semibold mb-1 ${f.color}`}>{f.label}</div>
              <div className="font-bold text-[15px]">{f.value}</div>
            </div>
          ))}
        </div>

        <SectionTitle>In OAPI</SectionTitle>
        <table className="w-full text-xs mb-3">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="p-2 text-left text-gray-500 font-semibold" />
              <th className="p-2 text-right text-gray-500 font-semibold">Official</th>
              <th className="p-2 text-right text-gray-500 font-semibold">Service</th>
              <th className="p-2 text-right text-gray-500 font-semibold">Translation</th>
              <th className="p-2 text-right text-navy font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="p-2">
                <div className="font-semibold text-navy">Filing a patent application</div>
                <div className="text-[11px] text-gray-500">for PCT/EP2021/062584</div>
                <div className="text-[11px] text-gray-400">With Adams & Adams</div>
              </td>
              <td className="p-2 text-right">EUR 3707.51</td>
              <td className="p-2 text-right">EUR 1640.00</td>
              <td className="p-2 text-right">—</td>
              <td className="p-2 text-right font-bold text-gold">EUR 5347.51</td>
            </tr>
          </tbody>
        </table>
      </Card>

      <SectionTitle>Disclaimers</SectionTitle>
      <details className="text-xs text-gray-500 mb-1">
        <summary className="cursor-pointer font-semibold">General Principles</summary>
        <p className="mt-2 leading-relaxed">Our quote does not include surcharges for late filings, PoA forms, registration changes, or additional official fees.</p>
      </details>
      <details className="text-xs text-gray-500">
        <summary className="cursor-pointer font-semibold">Translations</summary>
        <p className="mt-2 leading-relaxed">Translation costs are based on word count and may vary by language pair and urgency.</p>
      </details>

      <OrderFooter />
    </div>
  );
}

// ── Tab: Client ──
function ClientTab() {
  return (
    <div>
      <SectionTitle>Billing information</SectionTitle>
      <DetailRow label="Company" value="Valipat SRL" />
      <DetailRow label="Address" value="Uitbreidingstraat 72 - 5" />
      <DetailRow label="City" value="Antwerp" />
      <DetailRow label="Postcode" value="2600" />
      <DetailRow label="Country" value="Belgium (BE)" />
      <DetailRow label="VAT number" value="BE0806735439" />
      <DetailRow label="Paper invoices?" value="No" />
      <DetailRow label="One invoice per country?" value="No" />

      <SectionTitle>Mailing information</SectionTitle>
      <DetailRow label="To" value="irena.pasic@valipat.com" />
      <DetailRow label="CC" value="" />

      <OrderFooter />
    </div>
  );
}

// ── Tab: Documents ──
function DocumentsTab() {
  return (
    <div>
      <SectionTitle>Powers of Attorney I requested</SectionTitle>
      <p className="py-3 text-sm text-gray-500 italic">No PoAs</p>

      <SectionTitle>Files for translations I provide</SectionTitle>
      <div className="border-b border-gray-300">
        <div className="flex justify-between py-2.5 text-sm">
          <span>A1 or A2</span><span />
        </div>
        <div className="flex justify-between py-2.5 border-t border-gray-300 text-sm">
          <span>Translation for english</span>
          <span className="text-gray-400 italic">No file</span>
        </div>
      </div>

      <OrderFooter />
    </div>
  );
}

// ── Tab: Entry basis ──
function EntryBasisTab() {
  return (
    <div>
      <SectionTitle>Entry basis</SectionTitle>
      <div className="flex justify-between py-2.5 border-b border-gray-300 text-sm">
        <span>African Intellectual Property Organization – OAPI (OA)</span>
        <span className="font-medium">A1 or A2 – Adams & Adams</span>
      </div>

      <SectionTitle>Annuities</SectionTitle>
      <div className="flex justify-between py-2.5 border-b border-gray-300 text-sm">
        <span>African Intellectual Property Organization – OAPI (OA)</span>
        <span className="font-medium">No</span>
      </div>

      <OrderFooter />
    </div>
  );
}

// ── Tab: Progress ──
function ProgressTab() {
  // TODO: Replace with real data
  const entries = [
    { country: 'OAPI (OA)', orderSent: true, entryFiled: false, filingReceipt: false, transfer: false },
  ];

  return (
    <div>
      <SectionTitle>Progress follow-up</SectionTitle>
      <table className="w-full text-sm mb-3">
        <thead>
          <tr className="bg-slate-50">
            {['Country/region', 'Order sent', 'Entry filed', 'Filing receipt', 'Transfer'].map((h) => (
              <th key={h} className="p-2.5 text-left text-navy font-bold text-xs border-b-2 border-navy">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.map((r) => (
            <tr key={r.country} className="border-b border-gray-300">
              <td className="p-2.5 font-medium">{r.country}</td>
              {[r.orderSent, r.entryFiled, r.filingReceipt, r.transfer].map((val, i) => (
                <td key={i} className="p-2.5">
                  <span className={cn(
                    'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                    val ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400',
                  )}>
                    {val ? 'Y' : 'N'}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <OrderFooter />
    </div>
  );
}

// ── Tab components map (avoid switch statement) ──
const TAB_COMPONENTS = [SummaryTab, QuoteTab, ClientTab, DocumentsTab, EntryBasisTab, ProgressTab];

// ── Main Page ──
export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [activeTab, setActiveTab] = useState(0);

  // TODO: const { data, isLoading } = useOrderDetail(orderId!);

  const ActiveTabComponent = TAB_COMPONENTS[activeTab]!;

  // Order detail sidebar (different from patent sidebar)
  const OrderDetailSidebar = () => (
    <aside className="w-[260px] min-w-[260px] bg-amber-50/50 rounded-lg border border-amber-200 p-4 text-xs h-fit sticky top-4">
      <div className="text-gold font-bold text-sm mb-3">Patent summary</div>
      <div className="font-semibold text-xs text-navy mb-2">General information</div>
      {[
        ['Title:', 'WATER-SOLUBLE FERTILIZER'],
        ['Application Number:', 'PCT/EP2021/062584'],
        ['Publication Number:', 'WO/2021228919'],
        ['Publication Date:', '18 Nov 2021'],
        ['Publication language:', 'English'],
        ['Receiving office:', 'European Patent Office'],
      ].map(([k, v]) => (
        <div key={k} className="mb-1"><div className="text-gray-400 text-[11px]">{k}</div><div className="text-navy font-medium text-xs">{v}</div></div>
      ))}
      <hr className="border-gray-300 my-4" />
      <div className="font-semibold text-xs text-navy mb-2">Milestones</div>
      <div className="mb-1"><div className="text-gray-400 text-[11px]">Filing date:</div><div className="text-navy font-medium">12 May 2021</div></div>
      <div className="mb-1"><div className="text-gray-400 text-[11px]">Priority date:</div><div className="text-navy font-medium">13 May 2020</div></div>
      <div className="mb-1"><div className="text-amber-600 text-[11px]">30 months deadline:</div><div className="text-amber-600 font-semibold">13 Nov 2022 (passed)</div></div>
      <div className="mb-1"><div className="text-amber-600 text-[11px]">31 months deadline:</div><div className="text-amber-600 font-semibold">13 Dec 2022 (passed)</div></div>
    </aside>
  );

  return (
    <div>
      {/* Order header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-navy mb-1">Order / Summary</h2>
        <div className="text-sm text-gold italic">
          Order PCT00016422 placed on 2025-10-22 <span className="text-gray-500">You Can</span>
        </div>
      </div>

      {/* Internal tab bar */}
      <div className="flex gap-0 border-b border-gray-300 mb-5">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={cn(
              'px-4 py-2.5 text-sm -mb-px transition-colors',
              activeTab === i
                ? 'font-semibold text-navy bg-white border border-gray-300 border-b-white rounded-t-md'
                : 'text-gray-500 border border-transparent',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content + Sidebar */}
      <div className="flex gap-5">
        <div className="flex-1">
          <ActiveTabComponent />
        </div>
        <OrderDetailSidebar />
      </div>
    </div>
  );
}
