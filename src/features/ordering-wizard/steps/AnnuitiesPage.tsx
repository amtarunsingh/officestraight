import { useNavigate, useParams } from 'react-router-dom';
import { useWizardStore } from '@/features/ordering-wizard/store';
import { useCasePatent } from '@/features/ordering-wizard/useCasePatent';
import { PatentSidebar } from '@/shared/components/PatentSidebar';
import { Card, Steps, Checkbox, RadioGroup, InputField, Divider, FooterActions } from '@/shared/components/ui';

const ORDER_STEPS = ['Instructions', 'Inventors', 'Annuities & Special Requests', 'Billing / Email Info'];
const ORDER_ROUTES = ['instructions', 'inventors', 'annuities', 'billing'];

const SOURCE_OPTIONS = [
  { label: 'Refer to the B1 or the text intended for grant', value: 'b1_text' },
  { label: 'I will send to support@valipat.com a file', value: 'send_later' },
  { label: 'I upload now a file', value: 'upload_now' },
];

export default function AnnuitiesPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const store = useWizardStore();
  const { patent } = useCasePatent();

  // Derive offices from selected jurisdictions in store, fall back to defaults
  const selectedJurisdictions = store.jurisdictions.filter((j) => j.selected);
  const offices = selectedJurisdictions.length > 0
    ? selectedJurisdictions.map((j) => j.code)
    : ['EG', 'LY', 'BB'];

  return (
    <div className="flex items-start gap-5">
      <div className="flex-1">
        <Steps steps={ORDER_STEPS} current={3} onStepClick={(n) => navigate(`/case/${caseId}/${ORDER_ROUTES[n - 1]}`)} />

        <Card>
          <h3 className="text-base font-bold text-navy mb-3">Renewal Fees</h3>
          <Checkbox
            label="Pay the first renewal fees"
            checked={store.payRenewalFees}
            onChange={(v) => store.setField('payRenewalFees', v)}
          />
          <p className="text-xs text-gold italic my-3">
            Valipat will send your order to your preferred Renewal Fee Provider at the publication of the mention of grant or shortly after your order should the grant decision already have been published.
          </p>
          <div className="flex gap-4 items-center mb-4">
            <span className="text-xs font-semibold">Choose Offices</span>
            {offices.map((code) => (
              <Checkbox
                key={code}
                label={code}
                checked={store.renewalOffices.includes(code)}
                onChange={(checked) => {
                  const current = store.renewalOffices;
                  store.setField(
                    'renewalOffices',
                    checked ? [...current, code] : current.filter((c) => c !== code),
                  );
                }}
              />
            ))}
            <span className="text-[11px] text-blue-600 cursor-pointer">All</span>
            <span className="text-gray-400">|</span>
            <span className="text-[11px] text-blue-600 cursor-pointer">None</span>
          </div>

          <Divider />

          <h3 className="text-base font-bold text-navy mb-3">Invoicing Preferences</h3>
          <Checkbox
            label="Separate invoices for each jurisdiction (by default, invoices are consolidated)"
            checked={store.separateInvoices}
            onChange={(v) => store.setField('separateInvoices', v)}
          />
          <Checkbox
            label="Invoice sent together with the formal acknowledgment of receipt of my order (by default, invoices are sent upon completion of the order)"
            checked={store.invoiceWithAcknowledgment}
            onChange={(v) => store.setField('invoiceWithAcknowledgment', v)}
          />

          <Divider />

          <h3 className="text-base font-bold text-navy mb-3">Operational Requests</h3>
          <h4 className="text-sm font-bold text-navy mb-1.5">Source document</h4>
          <p className="text-xs text-gray-500 italic mb-2">
            Specify below which text should be used for the translation.
          </p>
          <RadioGroup
            name="source"
            options={SOURCE_OPTIONS}
            value={store.sourceDocument}
            onChange={(v) => store.setField('sourceDocument', v)}
          />

          <div className="mt-3">
            <InputField
              label="Special requests for translator(s)"
              placeholder="Specify any additional request for translator(s)."
              value={store.translatorRequests}
              onChange={(e) => store.setField('translatorRequests', e.target.value)}
            />
          </div>

          <Divider />

          <InputField
            label="Additional information"
            placeholder="Specify any additional request or comment you may have for the Valipat team."
            value={store.additionalInfo}
            onChange={(e) => store.setField('additionalInfo', e.target.value)}
          />
        </Card>

        <FooterActions
          onCancel={() => navigate('/')}
          onSave={() => navigate(`/case/${caseId}/billing`)}
        />
      </div>

      <PatentSidebar patent={patent} />
    </div>
  );
}
