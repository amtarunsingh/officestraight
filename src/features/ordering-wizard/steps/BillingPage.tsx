import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCasePatent } from '@/features/ordering-wizard/useCasePatent';
import { PatentSidebar } from '@/shared/components/PatentSidebar';
import { Card, Steps, Button, SelectField, InputField, Divider, FooterActions } from '@/shared/components/ui';

const ORDER_STEPS = ['Instructions', 'Inventors', 'Annuities & Special Requests', 'Billing / Email Info'];
const ORDER_ROUTES = ['instructions', 'inventors', 'annuities', 'billing'];

// ── Change Billing Address Dialog ──
function ChangeBillingDialog({
  billing,
  onSave,
  onClose,
}: {
  billing: { company: string; address: string; city: string; postcode: string; country: string; vat: string };
  onSave: (data: typeof billing) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(billing);
  const update = (key: keyof typeof form, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl w-[500px] p-6 border border-gray-300" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-bold text-navy mb-4">Change Billing Address</h3>

        <InputField
          label="Company name"
          value={form.company}
          onChange={(e) => update('company', e.target.value)}
        />
        <InputField
          label="Address"
          value={form.address}
          onChange={(e) => update('address', e.target.value)}
        />
        <div className="flex gap-3">
          <InputField
            label="City"
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
            className="flex-1"
          />
          <InputField
            label="Postcode"
            value={form.postcode}
            onChange={(e) => update('postcode', e.target.value)}
            className="w-[120px]"
          />
        </div>
        <div className="flex gap-3">
          <SelectField
            label="Country"
            options={[
              { label: 'Belgium (BE)', value: 'BE' },
              { label: 'France (FR)', value: 'FR' },
              { label: 'Germany (DE)', value: 'DE' },
              { label: 'Netherlands (NL)', value: 'NL' },
              { label: 'United Kingdom (GB)', value: 'GB' },
              { label: 'United States (US)', value: 'US' },
            ]}
            value={form.country}
            onChange={(e) => update('country', e.target.value)}
            className="flex-1"
          />
          <InputField
            label="VAT number"
            value={form.vat}
            onChange={(e) => update('vat', e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="gold" onClick={() => onSave(form)}>Save changes</Button>
        </div>
      </div>
    </div>
  );
}

// ── Change Email Dialog ──
function ChangeEmailDialog({
  emailTo,
  emailCc,
  onSave,
  onClose,
}: {
  emailTo: string;
  emailCc: string;
  onSave: (data: { emailTo: string; emailCc: string }) => void;
  onClose: () => void;
}) {
  const [to, setTo] = useState(emailTo);
  const [cc, setCc] = useState(emailCc);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl w-[460px] p-6 border border-gray-300" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-bold text-navy mb-4">Change Emailing Address</h3>

        <InputField
          label="To (primary email)"
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="email@company.com"
        />
        <InputField
          label="CC (optional)"
          type="email"
          value={cc}
          onChange={(e) => setCc(e.target.value)}
          placeholder="cc@company.com"
        />
        <p className="text-xs text-gray-400 italic mb-4">
          For further mailing options concerning invoices and original documents, please contact support@valipat.com.
        </p>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="gold" onClick={() => onSave({ emailTo: to, emailCc: cc })}>Save changes</Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──
export default function BillingPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { patent } = useCasePatent();

  const [billing, setBilling] = useState({
    company: 'Valipat SRL',
    address: 'Uitbreidingstraat 72 - 5',
    city: 'Antwerp',
    postcode: '2600',
    country: 'BE',
    vat: 'BE0806735439',
  });

  const [email, setEmail] = useState({
    emailTo: 'irena.pasic@valipat.com',
    emailCc: '',
  });

  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  return (
    <div className="flex items-start gap-5">
      <div className="flex-1">
        <Steps steps={ORDER_STEPS} current={4} onStepClick={(n) => navigate(`/case/${caseId}/${ORDER_ROUTES[n - 1]}`)} />

        <Card>
          <h3 className="text-base font-bold text-navy mb-1">Billing Information</h3>
          <p className="text-xs text-gold italic mb-3">
            Modify the billing/emailing address if different than the one specified in your profile. For further mailing options concerning invoices and original documents, please contact support@valipat.com.
          </p>
          <SelectField options={[billing.company]} defaultValue={billing.company} />
          <div className="mb-3">
            <div className="font-bold text-[15px]">{billing.company}</div>
            <div className="text-sm text-gray-500">
              {billing.address}<br />
              {billing.city}, {billing.postcode}, {billing.country}<br />
              VAT number: {billing.vat}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowBillingDialog(true)}>
            Change Billing Address
          </Button>

          <Divider />

          <h3 className="text-base font-bold text-navy mb-1">Email Details</h3>
          <p className="text-xs text-gold italic mb-3">
            Modify the billing/emailing address if different than the one specified in your profile. For further mailing options concerning invoices and original documents, please contact support@valipat.com.
          </p>
          <div className="text-sm mb-1">
            To: <span className="text-blue-600">{email.emailTo}</span>
          </div>
          <div className="text-sm mb-3">Cc: {email.emailCc || '—'}</div>
          <Button variant="outline" size="sm" onClick={() => setShowEmailDialog(true)}>
            Change Emailing Address
          </Button>
        </Card>

        <FooterActions
          onCancel={() => navigate('/')}
          onSave={() => navigate(`/case/${caseId}/confirmation`)}
        />
      </div>

      <PatentSidebar patent={patent} />

      {/* Dialogs */}
      {showBillingDialog && (
        <ChangeBillingDialog
          billing={billing}
          onSave={(data) => {
            setBilling(data);
            setShowBillingDialog(false);
          }}
          onClose={() => setShowBillingDialog(false)}
        />
      )}
      {showEmailDialog && (
        <ChangeEmailDialog
          emailTo={email.emailTo}
          emailCc={email.emailCc}
          onSave={(data) => {
            setEmail(data);
            setShowEmailDialog(false);
          }}
          onClose={() => setShowEmailDialog(false)}
        />
      )}
    </div>
  );
}
