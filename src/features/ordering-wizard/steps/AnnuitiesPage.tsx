import { useNavigate, useParams } from 'react-router-dom';
import { useWizardStore } from '@/features/ordering-wizard/store';
import { PatentSidebar } from '@/shared/components/PatentSidebar';
import { Card, Steps, Checkbox, RadioGroup, InputField, Divider, FooterActions } from '@/shared/components/ui';

const ORDER_STEPS = ['Instructions', 'Inventors', 'Annuities & Special Requests', 'Billing / Email Info'];

const SOURCE_OPTIONS = [
  { label: 'Refer to the B1 or the text intended for grant', value: 'b1_text' },
  { label: 'I will send to support@valipat.com a file', value: 'send_later' },
  { label: 'I upload now a file', value: 'upload_now' },
];

// Country code → name mapping for display
const COUNTRY_NAMES: Record<string, string> = {
  EG: 'Egypt',
  LY: 'Libya',
  BB: 'Barbados',
  OA: 'OAPI',
  MA: 'Morocco',
  TN: 'Tunisia',
  DZ: 'Algeria',
  SA: 'Saudi Arabia',
  AE: 'United Arab Emirates',
  IL: 'Israel',
  IN: 'India',
  CN: 'China',
  JP: 'Japan',
  KR: 'South Korea',
  BR: 'Brazil',
  MX: 'Mexico',
  ZA: 'South Africa',
  NG: 'Nigeria',
  KE: 'Kenya',
  PH: 'Philippines',
  TH: 'Thailand',
  VN: 'Vietnam',
  MY: 'Malaysia',
  SG: 'Singapore',
  ID: 'Indonesia',
};

export default function AnnuitiesPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const store = useWizardStore();

  // TODO: Get selected jurisdiction codes from store
  const offices = ['EG', 'LY', 'BB'];

  return (
    <div className="flex gap-5">
      <div className="flex-1">
        <Steps steps={ORDER_STEPS} current={3} />

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
                label={`${code} — ${COUNTRY_NAMES[code] ?? code}`}
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

      <PatentSidebar patent={null} />
    </div>
  );
}
