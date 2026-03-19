import { useNavigate, useParams } from 'react-router-dom';
import { PatentSidebar } from '@/shared/components/PatentSidebar';
import { Button, Card, Steps, Divider } from '@/shared/components/ui';
import { formatCurrency } from '@/shared/lib/utils';

const QUOTE_STEPS = ['Service Selection', 'Word Count', 'Quote Details'];

// TODO: Replace with data from useQuote(caseId)
const PLACEHOLDER_WORD_COUNT = [
  ['Words in description', '9881'],
  ['Pages of description', '28'],
  ['Number of claims', '14'],
  ['Words in claims', '1032'],
  ['Pages of claims', '4'],
  ['Pages of drawings', '15'],
  ['Total number of words', '10913'],
  ['Total number of pages', '47'],
];

const PLACEHOLDER_REFS = [
  ['Your reference', 'Not specified', true],
  ['Person in charge', 'Not specified', true],
  ['Project name', 'Not specified', true],
  ["Valipat's reference", 'VAL00297345', false],
];

const PLACEHOLDER_JURISDICTIONS = [
  { country: 'Barbados', desc: '-', claims: 'sq', agent: 'Hanschell & Company', off: 321.70, svc: 940.00, trl: 0, total: 1261.70 },
  { country: 'Egypt', desc: 'el', claims: 'sq', agent: 'Saba Intellectual Property', off: 3.30, svc: 1390.00, trl: 0, total: 1393.30 },
  { country: 'Libya', desc: '-', claims: 'sq', agent: 'Saba Intellectual Property', off: 12.56, svc: 990.00, trl: 0, total: 1002.56 },
];

export default function QuoteDetailsPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const grandTotal = {
    official: PLACEHOLDER_JURISDICTIONS.reduce((s, j) => s + j.off, 0),
    service: PLACEHOLDER_JURISDICTIONS.reduce((s, j) => s + j.svc, 0),
    translation: PLACEHOLDER_JURISDICTIONS.reduce((s, j) => s + j.trl, 0),
    total: PLACEHOLDER_JURISDICTIONS.reduce((s, j) => s + j.total, 0),
  };

  return (
    <div className="flex gap-5">
      <div className="flex-1">
        <Steps steps={QUOTE_STEPS} current={3} />

        <Card>
          <h3 className="text-base font-bold text-navy mb-3">Word count and references</h3>
          <p className="text-xs text-gold italic mb-3">
            The following shows the word count calculated according to the selected word count methodology and used to calculate your online quote.
          </p>

          <div className="flex gap-10 mb-4">
            {/* Word count */}
            <div className="text-xs space-y-0.5">
              {PLACEHOLDER_WORD_COUNT.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-5">
                  <span className="text-gray-500">{k}</span>
                  <strong>{v}</strong>
                </div>
              ))}
            </div>
            {/* References */}
            <div className="text-xs space-y-0.5">
              {PLACEHOLDER_REFS.map(([k, v, isWarning]) => (
                <div key={k as string} className="flex justify-between gap-5">
                  <span className="text-gray-500">{k as string}</span>
                  <strong className={isWarning ? 'text-red-600' : ''}>{v as string}</strong>
                </div>
              ))}
            </div>
          </div>

          <Divider />

          <h4 className="text-sm font-bold text-navy mb-2">
            Jurisdictions where you want the patent to be effective
          </h4>

          <table className="w-full border-collapse text-xs mb-3">
            <thead>
              <tr className="bg-slate-50">
                {['Countries (3)', 'Description', 'Claims', 'Agent', 'Official', 'Service', 'Translation', 'Total'].map((h, i) => (
                  <th key={h} className={`p-2 text-navy font-bold text-[11px] border-b-2 border-navy ${i >= 4 ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLACEHOLDER_JURISDICTIONS.map((r) => (
                <tr key={r.country} className="border-b border-gray-300">
                  <td className="p-2">{r.country}</td>
                  <td className="p-2 text-gray-500">{r.desc}</td>
                  <td className="p-2 text-gray-500">{r.claims}</td>
                  <td className="p-2 text-gray-500 text-[11px]">{r.agent}</td>
                  <td className="p-2 text-right">{formatCurrency(r.off)}</td>
                  <td className="p-2 text-right">{formatCurrency(r.svc)}</td>
                  <td className="p-2 text-right">{r.trl > 0 ? formatCurrency(r.trl) : '—'}</td>
                  <td className="p-2 text-right font-bold text-gold">{formatCurrency(r.total)}</td>
                </tr>
              ))}
              <tr className="bg-slate-50">
                <td colSpan={4} className="p-2 font-bold">Grand Total</td>
                <td className="p-2 text-right font-bold">{formatCurrency(grandTotal.official)}</td>
                <td className="p-2 text-right font-bold">{formatCurrency(grandTotal.service)}</td>
                <td className="p-2 text-right font-bold">{formatCurrency(grandTotal.translation)}</td>
                <td className="p-2 text-right font-bold text-gold text-sm">{formatCurrency(grandTotal.total)}</td>
              </tr>
            </tbody>
          </table>

          <p className="text-xs text-gray-500 mb-2">
            If based on the word count performed by Valipat, our quote is valid for 28 days.
          </p>
          <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
            Our quote does not include the following surcharges: additional service and translation costs for orders placed less than 16 days before the official validation deadline; surcharges for the filing of Power of Attorney forms after the official validation deadline; costs related to the registration of changes; additional official fees.
          </p>

          <div className="flex justify-end gap-3 mt-4">
            <span className="text-xs text-blue-600 cursor-pointer">📄 Export to PDF</span>
            <span className="text-xs text-blue-600 cursor-pointer">📊 Export to Excel</span>
          </div>
        </Card>

        <div className="flex justify-end items-center gap-2.5 mt-2">
          <Button variant="link" size="sm" onClick={() => navigate('/')}>Back to cases</Button>
          <span className="text-gray-400">or</span>
          <Button variant="gold" size="lg" onClick={() => navigate(`/case/${caseId}/instructions`)}>
            Proceed to order
          </Button>
        </div>
      </div>

      <PatentSidebar patent={null} />
    </div>
  );
}
