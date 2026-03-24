import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWizardStore } from '@/features/ordering-wizard/store';
import { useCasePatent } from '@/features/ordering-wizard/useCasePatent';
import { PatentSidebar } from '@/shared/components/PatentSidebar';
import { Button, Card, Steps, Divider } from '@/shared/components/ui';
import { formatCurrency } from '@/shared/lib/utils';

const PLACEHOLDER_JURISDICTIONS = [
  { country: 'Barbados', desc: '-', claims: 'sq', agent: 'Hanschell & Company', off: 321.70, svc: 940.00, trl: 0, total: 1261.70 },
  { country: 'Egypt', desc: 'el', claims: 'sq', agent: 'Saba Intellectual Property', off: 3.30, svc: 1390.00, trl: 0, total: 1393.30 },
  { country: 'Libya', desc: '-', claims: 'sq', agent: 'Saba Intellectual Property', off: 12.56, svc: 990.00, trl: 0, total: 1002.56 },
];

export default function QuoteDetailsPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const store = useWizardStore();
  const { patent } = useCasePatent();

  // Determine steps based on whether word count was pre-filled (guaranteed)
  const wordCountReady = store.wordCountReady;
  const quoteSteps = wordCountReady
    ? ['Service Selection', 'Quote Details']
    : ['Service Selection', 'Word Count', 'Quote Details'];
  const quoteRoutes = wordCountReady
    ? ['service-selection', 'quote-details']
    : ['service-selection', 'word-count', 'quote-details'];
  const currentStep = wordCountReady ? 2 : 3;

  // Use store data when available
  const storeWordCount = store.wordCount;
  const hasStoreWordCount = Object.values(storeWordCount).some((v) => v > 0);

  const wordCountLeft = hasStoreWordCount
    ? [
        ['Words in description', String(storeWordCount.wordsInDescription)],
        ['Pages of description', String(storeWordCount.pagesOfDescription)],
        ['Number of claims', String(storeWordCount.numberOfClaims)],
        ['Words in claims', String(storeWordCount.wordsInClaims)],
        ['Pages of claims', String(storeWordCount.pagesOfClaims)],
        ['Pages of drawings', String(storeWordCount.pagesOfDrawings)],
        ['Total number of words', String(storeWordCount.totalWords)],
        ['Total number of pages', String(storeWordCount.totalPages)],
      ]
    : [
        ['Words in description', '9881'],
        ['Pages of description', '28'],
        ['Number of claims', '14'],
        ['Words in claims', '1032'],
        ['Pages of claims', '4'],
        ['Pages of drawings', '15'],
        ['Total number of words', '10913'],
        ['Total number of pages', '47'],
      ];

  const storeRefs = [
    ['Your reference', store.customerReference || 'Not specified', !store.customerReference],
    ['Person in charge', store.personInCharge || 'Not specified', !store.personInCharge],
    ['PO Number', store.poNumber || 'Not specified', !store.poNumber],
    ["Valipat's reference", 'VAL00297345', false],
  ];

  // Use selected jurisdictions from store when available
  const selectedJurisdictions = store.jurisdictions.filter((j) => j.selected);
  const hasStoreJurisdictions = selectedJurisdictions.length > 0;
  const jurisdictionRows = hasStoreJurisdictions
    ? selectedJurisdictions.map((j) => ({
        country: j.name,
        desc: j.description,
        claims: j.claims,
        agent: j.agent.name,
        off: j.officialFee,
        svc: j.serviceFee,
        trl: j.translationFee,
        total: j.totalFee,
      }))
    : PLACEHOLDER_JURISDICTIONS;

  const grandTotal = {
    official: jurisdictionRows.reduce((s, j) => s + j.off, 0),
    service: jurisdictionRows.reduce((s, j) => s + j.svc, 0),
    translation: jurisdictionRows.reduce((s, j) => s + j.trl, 0),
    total: jurisdictionRows.reduce((s, j) => s + j.total, 0),
  };

  // 8-second popup state
  const [showPopup, setShowPopup] = useState(false);
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    if (!showPopup) return;
    if (countdown <= 0) {
      navigate('/?wordCountPending=true');
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [showPopup, countdown, navigate]);

  const handleSaveAndContinue = useCallback(() => {
    if (wordCountReady) {
      navigate(`/case/${caseId}/instructions`);
      return;
    }
    setShowPopup(true);
  }, [wordCountReady, caseId, navigate]);

  return (
    <div className="flex items-start gap-5">
      <div className="flex-1">
        <Steps steps={quoteSteps} current={currentStep} onStepClick={(n) => navigate(`/case/${caseId}/${quoteRoutes[n - 1]}`)} />

        <Card>
          <h3 className="text-lg font-bold text-navy mb-2">Word count and references</h3>
          <p className="text-sm text-gold italic mb-4">
            The following shows the word count calculated according to the selected word count methodology and used to calculate your online quote.
          </p>

          {/* Word count + References side by side — matching screenshot layout */}
          <div className="flex gap-12 mb-4">
            {/* Word count column */}
            <div className="min-w-[280px]">
              {wordCountLeft.map(([label, value]) => (
                <div key={label} className="flex justify-between py-1 text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-bold text-navy ml-6">{value}</span>
                </div>
              ))}
            </div>

            {/* References column */}
            <div className="min-w-[280px]">
              {storeRefs.map(([label, value, isWarning]) => (
                <div key={label as string} className="flex justify-between py-1 text-sm">
                  <span className="text-gray-500">{label as string}</span>
                  <span className={`font-bold ml-6 ${isWarning ? 'text-red-600' : 'text-navy'}`}>
                    {value as string}
                  </span>
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
                {[`Countries (${jurisdictionRows.length})`, 'Description', 'Claims', 'Agent', 'Official', 'Service', 'Translation', 'Total'].map((h, i) => (
                  <th key={h} className={`p-2 text-navy font-bold text-[11px] border-b-2 border-navy ${i >= 4 ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jurisdictionRows.map((r) => (
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
            <span className="text-xs text-blue-600 cursor-pointer">Export to PDF</span>
            <span className="text-xs text-blue-600 cursor-pointer">Export to Excel</span>
          </div>
        </Card>

        <div className="flex justify-end items-center gap-2.5 mt-2">
          <Button variant="link" size="sm" onClick={() => navigate('/')}>Cancel</Button>
          <span className="text-gray-400">or</span>
          <Button variant="gold" size="lg" onClick={handleSaveAndContinue}>
            Save and continue
          </Button>
        </div>
      </div>

      <PatentSidebar patent={patent} />

      {/* 8-second popup overlay */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-[460px] p-8 border border-gray-300 text-center">
            <div className="text-4xl mb-3">&#9889;</div>
            <h3 className="text-lg font-bold text-navy mb-2">Word count in progress</h3>
            <p className="text-sm text-gray-600 mb-3">
              Valipat will perform the official word count and prepare your guaranteed quote.
              We will notify you by email when it is ready.
            </p>
            <div className="text-xs text-gray-400 mb-4">
              Redirecting to My Cases in <strong>{countdown}s</strong>...
            </div>
            <Button variant="gold" size="md" onClick={() => navigate('/?wordCountPending=true')}>
              Go to My Cases now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
