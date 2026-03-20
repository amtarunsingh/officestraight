import { useState, useCallback, memo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
<<<<<<< HEAD
import { useCases, useCreateCase } from '@/shared/api/queries';
import { Button, Card, InputField, SelectField } from '@/shared/components/ui';
=======
import { useCases, useCreateCase, useCancelCase } from '@/shared/api/queries';
import { Button, Badge, Card, InputField, SelectField } from '@/shared/components/ui';
>>>>>>> 1be0058 (claude/fixes)
import { formatCurrency, formatDate } from '@/shared/lib/utils';
import type { Case, CaseOrder } from '@/types';

// ── Status config ──
const STATUS_CONFIG: Record<string, { label: string; color: string; badgeColor: 'warning' | 'success' | 'danger' | 'info' | 'pending' }> = {
  quote_incomplete: { label: 'QUOTE INCOMPLETE', color: 'text-amber-600', badgeColor: 'warning' },
  quote_complete: { label: 'QUOTE COMPLETE', color: 'text-blue-600', badgeColor: 'info' },
  pending_order: { label: 'PENDING ORDER', color: 'text-amber-600', badgeColor: 'pending' },
  order_placed: { label: 'ORDER PLACED', color: 'text-green-600', badgeColor: 'success' },
  cancelled: { label: 'CANCELLED ORDER', color: 'text-red-600', badgeColor: 'danger' },
};

// ── Order row inside expanded case ──
const OrderRow = memo(function OrderRow({ order, index, onView }: { order: CaseOrder; index: number; onView: (id: string) => void }) {
  return (
    <div className={`flex justify-between items-center px-4 py-3 border-b border-gray-300 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
      <div>
        <div className="text-gray-400 text-xs mb-0.5">{order.date}</div>
        <div className="text-sm font-medium">{order.jurisdiction}</div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Button variant="outline" size="sm" onClick={() => onView(order.id)}>View</Button>
        {order.hasReferences && (
          <span className="text-xs text-blue-600 underline cursor-pointer">References</span>
        )}
      </div>
    </div>
  );
});

// ── Expanded case detail ──
const CaseDetail = memo(function CaseDetail({ caseData, onNavigate }: { caseData: Case; onNavigate: (path: string) => void }) {
  return (
    <div className="border-t border-gray-300 mt-3 pt-3">
      {/* Quote section */}
      {(caseData.status === 'pending_order' || caseData.status === 'quote_incomplete' || caseData.status === 'quote_complete') && (
        <div className="bg-gray-50 border border-gray-300 rounded-md px-4 py-3 mb-2.5">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold text-sm text-navy mb-0.5">Quote</div>
              {caseData.quoteStoppedAt ? (
                <div className="text-xs text-amber-600">
                  You stopped here: <span className="font-semibold">{caseData.quoteStoppedAt}</span>
                </div>
              ) : (
                <div className="text-xs text-green-600">Quote complete</div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate(`/case/${caseData.id}/service-selection`)}
            >
              {caseData.quoteStoppedAt ? 'Resume Quote' : 'View Quote'}
            </Button>
          </div>
        </div>
      )}

      {/* Orders list */}
      {caseData.orders.length > 0 && (
        <div>
          <div className="flex justify-between items-center py-2 border-b border-gray-300">
            <span className="font-bold text-sm text-navy">List of orders</span>
          </div>
          {caseData.orders.map((order, i) => (
            <OrderRow
              key={order.id}
              order={order}
              index={i}
              onView={(id) => onNavigate(`/order/${id}`)}
            />
          ))}
        </div>
      )}

      {caseData.orders.length === 0 && !caseData.quoteStoppedAt && (
        <div className="px-4 py-3 text-xs text-gray-400 italic">No orders placed yet.</div>
      )}
    </div>
  );
});

// ── Case card ──
const CaseCard = memo(function CaseCard({
  caseData,
  isExpanded,
  onToggle,
  onNavigate,
  onCancel,
}: {
  caseData: Case;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (path: string) => void;
  onCancel: (caseId: string) => void;
}) {
  const config = STATUS_CONFIG[caseData.status] ?? { label: 'PENDING ORDER', color: 'text-amber-600', badgeColor: 'pending' as const };
  const canCancel = caseData.status !== 'cancelled' && caseData.status !== 'order_placed';

  return (
    <Card className="!p-4 !mb-3">
      {/* Status row */}
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-[11px] font-bold tracking-wide ${config.color}`}>
          {config.label}
        </span>
        {caseData.orders.length > 0 && (
          <span className="text-[11px] text-gray-500">
            / {caseData.orders.length} {caseData.orders.length === 1 ? 'ORDER' : 'ORDERS'}
          </span>
        )}
      </div>

      {/* Content row */}
      <div className="flex justify-between items-start">
        <div>
          <div className="font-bold text-[15px] text-navy mb-1">{caseData.title}</div>
          <div className="text-sm text-gray-500">
            <strong>{caseData.applicationNumber}</strong>
            {caseData.clientReference && <span className="text-gray-400 ml-2">{caseData.clientReference}</span>}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Date: <span className="text-gold">{formatDate(caseData.date)}</span>{' '}
            Total: <strong>{formatCurrency(caseData.total, caseData.currency)}</strong>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Button
            variant={isExpanded ? 'primary' : 'outline'}
            size="sm"
            onClick={onToggle}
          >
            {isExpanded ? 'Collapse' : 'View'}
          </Button>
          {canCancel && (
            <Button variant="ghost" size="sm" onClick={() => onCancel(caseData.id)}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Expanded */}
      {isExpanded && <CaseDetail caseData={caseData} onNavigate={onNavigate} />}
    </Card>
  );
});

// ── Start New Case Widget ──
function StartNewCaseWidget() {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const createCase = useCreateCase();

  const handleSearch = useCallback(async () => {
    if (!searchValue.trim()) return;
    try {
      const newCase = await createCase.mutateAsync(searchValue.trim());
      navigate(`/case/${newCase.id}/service-selection`);
    } catch {
      // Error handled by TanStack Query
    }
  }, [searchValue, createCase, navigate]);

  return (
    <div className="w-[280px] min-w-[280px]">
      <Card className="!bg-amber-50/50 !border-amber-200">
        <h3 className="text-center text-base font-bold text-navy mb-2">Start New Case</h3>
        <p className="text-xs text-gray-500 text-center italic mb-3">
          Search for a PCT application / publication number
        </p>
        <InputField
          placeholder="PCT/EP2025/052966 or WO/..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          variant="primary"
          size="lg"
          className="w-full justify-center"
          onClick={handleSearch}
          disabled={createCase.isPending}
        >
          {createCase.isPending ? 'Searching...' : 'Search'}
        </Button>
      </Card>
    </div>
  );
}

// ── Main Page ──
export default function MyCasesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchField, setSearchField] = useState('Application No.');
  const [searchTerm, setSearchTerm] = useState('');
  const showBanner = searchParams.get('orderPlaced') === 'true';

  const { data, isLoading } = useCases({ filter, ...(searchTerm ? { search: searchTerm, searchField } : {}) });
  const cases = data?.results ?? [];

  // Cancel case handler
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancelCase = useCallback((caseId: string) => {
    setCancellingId(caseId);
  }, []);

  const toggleExpand = useCallback((caseId: string) => {
    setExpandedCase((prev) => (prev === caseId ? null : caseId));
  }, []);

  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleSearch = useCallback(() => {
    // Trigger re-fetch — useCases already reads searchTerm from state
  }, []);

  return (
    <div>
      {/* Order success banner */}
      {showBanner && (
        <div className="px-5 py-3.5 bg-orange-50 border-2 border-amber-400 rounded-lg mb-5">
          <div className="font-bold text-amber-600 text-[15px]">Thank you for your order!</div>
          <div className="text-sm text-amber-800 italic">
            An acknowledgment of receipt has been sent to you. Valipat will get back to you shortly.
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Cases list */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-navy mb-3">My Cases</h2>

          {/* Filters */}
          <div className="flex gap-3 mb-4">
            {(['all', 'quotes', 'orders'] as const).map((f) => (
              <label key={f} className="text-sm cursor-pointer flex items-center gap-1.5">
                <input
                  type="radio"
                  name="filter"
                  checked={filter === f}
                  onChange={() => setFilter(f)}
                  className="accent-navy"
                />
                {f === 'all' ? 'All cases' : f === 'quotes' ? 'Quotes only' : 'Orders only'}
              </label>
            ))}
          </div>

          {/* Search */}
          <div className="flex gap-2 mb-4">
            <SelectField
              options={['Application No.', 'Publication No.', 'Client Reference']}
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="!w-[200px] !mb-0"
            />
            <InputField
              placeholder="Type here"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="!w-[300px] !mb-0"
            />
            <Button variant="primary" size="md" onClick={handleSearch}>Search Past Cases</Button>
          </div>

          {/* Results count */}
          <div className="flex justify-between items-center mb-3 text-sm">
            <span>
              Displaying <strong>1 - {cases.length}</strong> of <strong>{data?.count ?? '—'}</strong> in total
            </span>
            <span className="text-xs text-gray-400">
              {filter === 'all' ? 'All statuses selected' : filter === 'quotes' ? 'Quotes only' : 'Orders only'}
            </span>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="py-10 text-center text-gray-400">Loading cases...</div>
          )}

          {/* Case cards */}
          {cases.map((c) => (
            <CaseCard
              key={c.id}
              caseData={c}
              isExpanded={expandedCase === c.id}
              onToggle={() => toggleExpand(c.id)}
              onNavigate={handleNavigate}
              onCancel={handleCancelCase}
            />
          ))}

          {/* Empty state */}
          {!isLoading && cases.length === 0 && (
            <Card className="text-center py-10">
              <p className="text-gray-400">No cases found. Start a new case to begin.</p>
            </Card>
          )}
        </div>

        {/* Start New Case */}
        <StartNewCaseWidget />
      </div>

      {/* Cancel confirmation dialog */}
      {cancellingId && (
        <CancelDialog
          caseId={cancellingId}
          onClose={() => setCancellingId(null)}
        />
      )}
    </div>
  );
}

// ── Cancel Confirmation Dialog ──
function CancelDialog({ caseId, onClose }: { caseId: string; onClose: () => void }) {
  const cancelCase = useCancelCase(caseId);

  const handleConfirm = async () => {
    try {
      await cancelCase.mutateAsync();
      onClose();
    } catch {
      // Error handled by TanStack Query
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl w-[400px] p-6 border border-gray-300" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-bold text-navy mb-2">Cancel Case</h3>
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to cancel this case? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Go back</Button>
          <Button variant="danger" onClick={handleConfirm} disabled={cancelCase.isPending}>
            {cancelCase.isPending ? 'Cancelling...' : 'Yes, cancel case'}
          </Button>
        </div>
      </div>
    </div>
  );
}
