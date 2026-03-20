import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWizardStore } from '@/features/ordering-wizard/store';
import { useCasePatent } from '@/features/ordering-wizard/useCasePatent';
import { usePlaceOrder } from '@/shared/api/queries';
import { PatentSidebar } from '@/shared/components/PatentSidebar';
import { Card, Button, Checkbox, Divider } from '@/shared/components/ui';
import { formatCurrency, isDeadlinePassed } from '@/shared/lib/utils';

export default function ConfirmationPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [approved, setApproved] = useState(false);
  const [showDeadlinePopup, setShowDeadlinePopup] = useState(false);
  const [deadlineAcknowledged, setDeadlineAcknowledged] = useState(false);
  const placeOrder = usePlaceOrder(caseId!);
  const store = useWizardStore();
  const { patent } = useCasePatent();

  // Derive deadlinePassed from actual patent data
  const deadlinePassed = patent
    ? isDeadlinePassed(patent.deadline30Month) || isDeadlinePassed(patent.deadline31Month)
    : false;

  // Calculate order total from selected jurisdictions
  const selectedJurisdictions = store.jurisdictions.filter((j) => j.selected);
  const orderTotal = selectedJurisdictions.length > 0
    ? selectedJurisdictions.reduce((sum, j) => sum + j.totalFee, 0)
    : 3661.05; // Fallback when no jurisdictions loaded yet

  const confirmOrder = useCallback(async () => {
    setShowDeadlinePopup(false);
    try {
      await placeOrder.mutateAsync();
      navigate('/?orderPlaced=true');
    } catch {
      // Error handled by TanStack Query
    }
  }, [placeOrder, navigate]);

  const handlePlaceOrder = useCallback(() => {
    if (!approved) return;
    if (deadlinePassed) {
      setShowDeadlinePopup(true);
    } else {
      confirmOrder();
    }
  }, [approved, deadlinePassed, confirmOrder]);

  return (
    <div className="flex gap-5">
      <div className="flex-1">
        <Card>
          <h3 className="text-base font-bold text-navy mb-3">Order Confirmation</h3>
          <p className="text-xs text-gold italic mb-4">By clicking below you confirm:</p>
          <ul className="list-disc ml-5 text-sm leading-8 mb-4">
            <li>
              That you confirm the Order total of <strong>{formatCurrency(orderTotal)}</strong>
            </li>
            <li>
              Terms and Conditions available{' '}
              <span className="text-blue-600 underline cursor-pointer">here</span>, (the "Agreement") shall govern your Order.
            </li>
          </ul>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            By clicking on "I approve all of the above" below you (a) acknowledge that you have read and understand the Agreement; (b) represent and warrant that you have the right, power, and authority to enter into this Agreement and, if entering into this Agreement for an organization, that you have the legal authority to bind that organization; and (c) accept this Agreement and agree that you are legally bound by its terms.
          </p>
          <Checkbox
            label="I approve all of the above"
            checked={approved}
            onChange={setApproved}
          />

          <Divider />

          <h4 className="text-sm font-bold text-navy mb-2">Next Steps</h4>
          <p className="text-xs text-gray-500">
            Once the order has been placed, Valipat will send an automated acknowledgement of receipt followed within 2 business days by a more detailed communication accepting or clarifying the order.
          </p>
        </Card>

        <div className="flex justify-end items-center gap-2.5 mt-5">
          <Button variant="link" size="sm" onClick={() => navigate('/')}>cancel</Button>
          <span className="text-gray-400">or</span>
          <Button
            variant="gold"
            size="lg"
            onClick={handlePlaceOrder}
            disabled={!approved || placeOrder.isPending}
          >
            {placeOrder.isPending ? 'Placing order...' : 'Place order now'}
          </Button>
        </div>
      </div>

      <PatentSidebar patent={patent} />

      {/* Deadline Warning Popup */}
      {showDeadlinePopup && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowDeadlinePopup(false)}
        >
          <div
            className="bg-white rounded-xl border-2 border-red-600 w-[480px] max-w-[90vw] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-red-50 px-6 py-4 border-b border-red-200 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-lg shrink-0">
                ⚠️
              </div>
              <div>
                <div className="font-bold text-[15px] text-red-600">Deadline Warning</div>
                <div className="text-xs text-red-800">Please review before confirming</div>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-sm leading-relaxed mb-3">
                The <strong>30/31 month deadline has passed</strong> for one or more jurisdictions in your order. This may result in:
              </p>
              <ul className="list-disc ml-5 text-sm leading-7 mb-4">
                <li>Additional <strong>surcharges</strong> for late national phase entry</li>
                <li>Potential <strong>rejection</strong> by certain patent offices</li>
                <li>Requirement for <strong>restoration of rights</strong> applications</li>
              </ul>
              <div className="p-3 bg-amber-50 rounded-md border border-amber-300 mb-4">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Affected jurisdictions:</strong> Please verify the deadline status for each selected jurisdiction. Additional fees may apply and will be communicated by the Valipat team after order placement.
                </p>
              </div>
              <Checkbox
                label="I acknowledge the deadline has passed and wish to proceed with the order"
                checked={deadlineAcknowledged}
                onChange={setDeadlineAcknowledged}
              />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-300 flex justify-end gap-2.5">
              <Button variant="ghost" onClick={() => setShowDeadlinePopup(false)}>
                Go back and review
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={confirmOrder}
                disabled={!deadlineAcknowledged}
              >
                Confirm and place order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
