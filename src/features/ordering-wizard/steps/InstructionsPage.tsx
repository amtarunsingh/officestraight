import { useNavigate, useParams } from 'react-router-dom';
import { useWizardStore } from '@/features/ordering-wizard/store';
import { PatentSidebar } from '@/shared/components/PatentSidebar';
import { Card, Steps, RadioGroup, Divider, FooterActions } from '@/shared/components/ui';
import type { InstructionAnswer, OperationalInstructions } from '@/types';

const ORDER_STEPS = ['Instructions', 'Inventors', 'Annuities & Special Requests', 'Billing / Email Info'];

const ANSWER_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
  { label: 'Provide later', value: 'provide_later' },
];

export default function InstructionsPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const store = useWizardStore();
  const instructions = store.instructions;

  const updateField = (field: keyof OperationalInstructions, value: string) => {
    store.setField('instructions', {
      ...instructions,
      [field]: value as InstructionAnswer,
    });
  };

  return (
    <div className="flex gap-5">
      <div className="flex-1">
        <Steps steps={ORDER_STEPS} current={1} />

        <Card>
          <h3 className="text-base font-bold text-navy mb-1">Operational Instructions</h3>
          <p className="text-xs text-gray-500 mb-4">
            Answer the following. Select "Provide later" if unsure.
          </p>

          <h4 className="text-sm font-bold text-navy mb-2">Applicants / Inventors</h4>
          <RadioGroup
            label="Are the applicants in the national phase the same as in the international phase?"
            name="q1"
            options={ANSWER_OPTIONS}
            value={instructions.sameApplicants}
            onChange={(v) => updateField('sameApplicants', v)}
          />
          <RadioGroup
            label="Have any changes been made?"
            name="q2"
            options={ANSWER_OPTIONS}
            value={instructions.changesMade}
            onChange={(v) => updateField('changesMade', v)}
          />
          <RadioGroup
            label="Is a worldwide assignment available?"
            name="q3"
            options={ANSWER_OPTIONS}
            value={instructions.worldwideAssignment}
            onChange={(v) => updateField('worldwideAssignment', v)}
          />
          <RadioGroup
            label="Were the inventors salaried workers at the time of filing?"
            name="q4"
            options={ANSWER_OPTIONS}
            value={instructions.salariedInventors}
            onChange={(v) => updateField('salariedInventors', v)}
          />

          <Divider />

          <h4 className="text-sm font-bold text-navy mb-2">Priority Claims</h4>
          <RadioGroup
            label="Was the priority document submitted to the International Bureau?"
            name="q5"
            options={ANSWER_OPTIONS}
            value={instructions.priorityDocSubmitted}
            onChange={(v) => updateField('priorityDocSubmitted', v)}
          />

          <h4 className="text-sm font-bold text-navy mt-3 mb-2">Type of Protection</h4>
          <RadioGroup
            label="Do you wish to file a utility model instead of/in parallel to a patent?"
            name="q6"
            options={ANSWER_OPTIONS}
            value={instructions.utilityModel}
            onChange={(v) => updateField('utilityModel', v)}
          />
        </Card>

        <FooterActions
          onCancel={() => navigate('/')}
          onSave={() => navigate(`/case/${caseId}/inventors`)}
        />
      </div>

      <PatentSidebar patent={null} />
    </div>
  );
}
