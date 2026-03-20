import { useState, useCallback, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWizardStore } from '@/features/ordering-wizard/store';
import { useCasePatent } from '@/features/ordering-wizard/useCasePatent';
import { useSaveWizardStep } from '@/shared/api/queries';
import { PatentSidebar } from '@/shared/components/PatentSidebar';
import { Button, Card, InputField, SelectField, Steps, Divider, FooterActions } from '@/shared/components/ui';
import { formatCurrency, cn } from '@/shared/lib/utils';
import type { BasisOption, JurisdictionSelection } from '@/types';

const QUOTE_STEPS = ['Service Selection', 'Word Count', 'Quote Details'];
const QUOTE_ROUTES = ['service-selection', 'word-count', 'quote-details'];
const BASIS_OPTIONS = [
  { label: 'As filed', value: 'as_filed' },
  { label: 'Art 19 amended', value: 'art19_amended' },
  { label: 'Voluntary (Art 28/41)', value: 'voluntary' },
];

// ── Agent Change Popup ──
function AgentPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <Card className="!w-[400px] !p-6" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <h3 className="text-base font-bold text-navy mb-3">Change Agent</h3>
        <SelectField
          label="Select Agent"
          options={[
            'Saba Intellectual Property',
            'Destek Patent SA',
            'Custom Agent — enter details below',
          ]}
        />
        {/* TODO: Show custom fields conditionally when "Custom Agent" selected */}
        <InputField label="Custom Agent Name" placeholder="Enter agent name (if custom selected)" />
        <InputField label="Custom Agent Email" placeholder="agent@firm.com" />
        <div className="flex justify-end gap-2 mt-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="gold" onClick={onClose}>Ok</Button>
        </div>
      </Card>
    </div>
  );
}

// ── Jurisdiction row (memoised for table perf) ──
const JurisdictionRow = memo(function JurisdictionRow({
  jurisdiction,
  showFullNames,
  onToggle,
  onBasisChange,
  onAgentClick,
}: {
  jurisdiction: JurisdictionSelection;
  showFullNames: boolean;
  onToggle: (code: string) => void;
  onBasisChange: (code: string, basis: BasisOption) => void;
  onAgentClick: () => void;
}) {
  const j = jurisdiction;
  return (
    <tr className="border-b border-gray-300">
      <td className="p-2.5">
        <input
          type="checkbox"
          checked={j.selected}
          onChange={() => onToggle(j.code)}
          className="accent-navy"
        />
      </td>
      <td className={cn('p-2.5 font-semibold', j.deadlinePassed && 'text-amber-600')}>
        {showFullNames ? `${j.name} (${j.code})` : j.code}
        {j.deadlinePassed && <span className="text-[10px] ml-1">⚠</span>}
      </td>
      <td className="p-2.5 text-gray-500">{j.description}</td>
      <td className="p-2.5 text-gray-500">{j.claims}</td>
      <td className="p-2.5">
        <span
          className="text-gold text-xs underline cursor-pointer"
          onClick={onAgentClick}
        >
          {j.agent.name}
        </span>
      </td>
      <td className="p-2.5">
        <select
          value={j.basis}
          onChange={(e) => onBasisChange(j.code, e.target.value as BasisOption)}
          className="px-1.5 py-1 border border-gray-300 rounded text-[11px]"
        >
          {BASIS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </td>
      <td className="p-2.5 text-right">{formatCurrency(j.officialFee)}</td>
      <td className="p-2.5 text-right">{formatCurrency(j.serviceFee)}</td>
      <td className="p-2.5 text-right">
        {j.translationFee > 0 ? formatCurrency(j.translationFee) : '—'}
      </td>
      <td className="p-2.5 text-right font-bold text-gold">{formatCurrency(j.totalFee)}</td>
    </tr>
  );
});

export default function ServiceSelectionPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'region' | 'alpha'>('region');
  const [showNames, setShowNames] = useState(false);
  const [showAgentPopup, setShowAgentPopup] = useState(false);

  const store = useWizardStore();
  const { patent } = useCasePatent();
  useSaveWizardStep(caseId!);

  // TODO: Replace with real data from useJurisdictions(caseId!)
  const jurisdictions = store.jurisdictions;
  const anyDeadlinePassed = jurisdictions.some((j) => j.deadlinePassed);

  const selectedJurisdictions = jurisdictions.filter((j) => j.selected);
  const grandTotal = {
    official: selectedJurisdictions.reduce((s, j) => s + j.officialFee, 0),
    service: selectedJurisdictions.reduce((s, j) => s + j.serviceFee, 0),
    translation: selectedJurisdictions.reduce((s, j) => s + j.translationFee, 0),
    total: selectedJurisdictions.reduce((s, j) => s + j.totalFee, 0),
  };

  const handleSave = useCallback(async () => {
    // TODO: saveMutation.mutateAsync({ step: 'service-selection', payload: { ... } });
    navigate(`/case/${caseId}/word-count`);
  }, [caseId, navigate]);

  return (
    <div className="flex items-start gap-5">
      <div className="flex-1">
        <Steps steps={QUOTE_STEPS} current={1} onStepClick={(n) => navigate(`/case/${caseId}/${QUOTE_ROUTES[n - 1]}`)} />

        {anyDeadlinePassed && (
          <div className="p-2.5 bg-amber-50 rounded-md border border-amber-300 mb-3 text-xs text-amber-800">
            <strong>⚠ Note:</strong> 30/31 month deadline has passed for some jurisdictions. Please check affected jurisdictions below.
          </div>
        )}

        <Card>
          <h3 className="text-base font-bold text-navy mb-3">National Phase Entry</h3>

          {/* References */}
          <div className="flex gap-3 mb-3">
            <InputField
              label="Customer reference"
              placeholder="Your ref"
              className="!w-1/3"
              value={store.customerReference}
              onChange={(e) => store.setField('customerReference', e.target.value)}
            />
            <InputField
              label="Person in charge"
              placeholder="Name"
              className="!w-1/3"
              value={store.personInCharge}
              onChange={(e) => store.setField('personInCharge', e.target.value)}
            />
            <InputField
              label="PO Number / Invoice ref."
              placeholder="PO-12345"
              className="!w-1/3"
              value={store.poNumber}
              onChange={(e) => store.setField('poNumber', e.target.value)}
            />
          </div>

          <Divider />

          {/* View toggles */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'region' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('region')}
              >
                Region View
              </Button>
              <Button
                variant={viewMode === 'alpha' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('alpha')}
              >
                Alphabetical View
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowNames(!showNames)}>
              {showNames ? 'Show ISO Codes' : 'Show Full Names'}
            </Button>
          </div>

          {/* Jurisdiction table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50">
                  {['☑', `Jurisdictions (${jurisdictions.length})`, 'Desc', 'Claims', 'Agent', 'Basis', 'Official', 'Service', 'Translation', 'Total'].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        'p-2.5 text-navy font-bold text-[11px] border-b-2 border-navy',
                        i >= 6 && 'text-right',
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jurisdictions.map((j) => (
                  <JurisdictionRow
                    key={j.code}
                    jurisdiction={j}
                    showFullNames={showNames}
                    onToggle={store.toggleJurisdiction}
                    onBasisChange={store.setJurisdictionBasis}
                    onAgentClick={() => setShowAgentPopup(true)}
                  />
                ))}
                {/* Grand total */}
                <tr className="bg-slate-50">
                  <td colSpan={6} className="p-2.5 font-bold">Grand Total</td>
                  <td className="p-2.5 text-right font-bold">{formatCurrency(grandTotal.official)}</td>
                  <td className="p-2.5 text-right font-bold">{formatCurrency(grandTotal.service)}</td>
                  <td className="p-2.5 text-right font-bold">{formatCurrency(grandTotal.translation)}</td>
                  <td className="p-2.5 text-right font-bold text-gold text-sm">{formatCurrency(grandTotal.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-2">
            <Button variant="outline" size="sm">Update total</Button>
          </div>
        </Card>

        {showAgentPopup && <AgentPopup onClose={() => setShowAgentPopup(false)} />}

        <FooterActions onCancel={() => navigate('/')} onSave={handleSave} />
      </div>

      <PatentSidebar patent={patent} />
    </div>
  );
}
