import { useNavigate, useParams } from 'react-router-dom';
import { useCasePatent } from '@/features/ordering-wizard/useCasePatent';
import { PatentSidebar } from '@/shared/components/PatentSidebar';
import { Card, Steps, Button, SelectField, Divider, FooterActions } from '@/shared/components/ui';

const ORDER_STEPS = ['Instructions', 'Inventors', 'Annuities & Special Requests', 'Billing / Email Info'];

export default function BillingPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { patent } = useCasePatent();

  // TODO: Replace with data from API
  const billing = {
    company: 'Valipat SRL',
    address: 'Uitbreidingstraat 72 - 5',
    city: 'Antwerp',
    postcode: '2600',
    country: 'BE',
    vat: 'BE0806735439',
    emailTo: 'irena.pasic@valipat.com',
    emailCc: '',
  };

  return (
    <div className="flex gap-5">
      <div className="flex-1">
        <Steps steps={ORDER_STEPS} current={4} />

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
          <Button variant="outline" size="sm">Change Billing Address</Button>

          <Divider />

          <h3 className="text-base font-bold text-navy mb-1">Email Details</h3>
          <p className="text-xs text-gold italic mb-3">
            Modify the billing/emailing address if different than the one specified in your profile. For further mailing options concerning invoices and original documents, please contact support@valipat.com.
          </p>
          <div className="text-sm mb-1">
            To: <span className="text-blue-600">{billing.emailTo}</span>
          </div>
          <div className="text-sm mb-3">Cc: {billing.emailCc || '—'}</div>
          <Button variant="outline" size="sm">Change Emailing Address</Button>
        </Card>

        <FooterActions
          onCancel={() => navigate('/')}
          onSave={() => navigate(`/case/${caseId}/confirmation`)}
        />
      </div>

      <PatentSidebar patent={patent} />
    </div>
  );
}
