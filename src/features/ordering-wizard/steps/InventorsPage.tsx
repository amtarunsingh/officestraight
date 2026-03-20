import { useNavigate, useParams } from 'react-router-dom';
import { useWizardStore } from '@/features/ordering-wizard/store';
import { useCasePatent } from '@/features/ordering-wizard/useCasePatent';
import { PatentSidebar } from '@/shared/components/PatentSidebar';
import { Card, Steps, InputField, SelectField, Badge, Divider, FooterActions } from '@/shared/components/ui';

const ORDER_STEPS = ['Instructions', 'Inventors', 'Annuities & Special Requests', 'Billing / Email Info'];

const NATIONALITY_OPTIONS = [
  'United Arab Emirates', 'United States', 'France', 'Germany',
  'United Kingdom', 'Japan', 'China', 'India', 'Brazil', 'Canada', 'Australia', 'Other...',
];

export default function InventorsPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const store = useWizardStore();
  const { patent } = useCasePatent();

  // TODO: Replace with data from API — inventors pre-filled from WIPO
  const inventors = store.inventors.length > 0
    ? store.inventors
    : [
        { id: '1', fullName: 'JONES, Neil', citizenship: 'United Arab Emirates', preFilledFromWipo: true },
        { id: '2', fullName: 'OUIDA, Julien', citizenship: 'United Arab Emirates', preFilledFromWipo: true },
      ];

  return (
    <div className="flex gap-5">
      <div className="flex-1">
        <Steps steps={ORDER_STEPS} current={2} />

        <Card>
          <h3 className="text-base font-bold text-navy mb-1">Applicants / Inventors</h3>
          <p className="text-xs text-gray-500 mb-4">
            Data pre-filled from WIPO. Edit any field if corrections needed.
          </p>

          {inventors.map((inv, i) => (
            <div
              key={inv.id}
              className={`p-4 rounded-lg mb-3 border border-gray-300 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
            >
              <div className="flex justify-between items-center mb-2.5">
                <span className="font-bold text-sm text-navy">Inventor {i + 1}</span>
                {inv.preFilledFromWipo && <Badge color="success">Pre-filled from WIPO</Badge>}
              </div>
              <div className="flex gap-3">
                <InputField
                  label="Full Name"
                  defaultValue={inv.fullName}
                  className="!w-1/2"
                />
                <SelectField
                  label="Citizenship / Nationality"
                  options={NATIONALITY_OPTIONS}
                  defaultValue={inv.citizenship}
                  className="!w-1/2"
                />
              </div>
            </div>
          ))}

          <Divider />
          <InputField
            label="Additional information"
            placeholder="Any additional info about the inventors..."
          />
        </Card>

        <FooterActions
          onCancel={() => navigate('/')}
          onSave={() => navigate(`/case/${caseId}/annuities`)}
        />
      </div>

      <PatentSidebar patent={patent} />
    </div>
  );
}
