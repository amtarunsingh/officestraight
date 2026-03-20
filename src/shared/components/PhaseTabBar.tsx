import { useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';

interface Phase {
  id: string;
  label: string;
  pathPrefix: string;
}

const PHASES: Phase[] = [
  { id: 'cases', label: 'My Cases', pathPrefix: '/' },
  { id: 'quote', label: 'Quote Phase', pathPrefix: '/case/' },
  { id: 'order', label: 'Order Phase', pathPrefix: '/case/' },
  { id: 'confirm', label: 'Confirmation', pathPrefix: '/case/' },
];

const QUOTE_PATHS = ['service-selection', 'word-count', 'quote-details'];
const ORDER_PATHS = ['instructions', 'inventors', 'annuities', 'billing'];
const CONFIRM_PATHS = ['confirmation'];

function getActivePhase(pathname: string): string {
  if (pathname === '/') return 'cases';
  if (pathname.startsWith('/order/')) return 'cases';

  const segment = pathname.split('/').pop() ?? '';
  if (QUOTE_PATHS.includes(segment)) return 'quote';
  if (ORDER_PATHS.includes(segment)) return 'order';
  if (CONFIRM_PATHS.includes(segment)) return 'confirm';

  return 'cases';
}

function extractCaseId(pathname: string): string | null {
  const match = pathname.match(/\/case\/([^/]+)\//);
  return match ? match[1] : null;
}

export function PhaseTabBar({ pathname }: { pathname: string }) {
  const navigate = useNavigate();
  const activePhase = getActivePhase(pathname);
  const caseId = extractCaseId(pathname);

  const handleClick = (phase: Phase) => {
    if (phase.id === 'cases') {
      navigate('/');
    } else if (caseId) {
      // Navigate to the first step of the target phase
      switch (phase.id) {
        case 'quote':
          navigate(`/case/${caseId}/service-selection`);
          break;
        case 'order':
          navigate(`/case/${caseId}/instructions`);
          break;
        case 'confirm':
          navigate(`/case/${caseId}/confirmation`);
          break;
      }
    }
  };

  return (
    <div className="bg-white border-b border-gray-300 px-6 overflow-x-auto">
      <div className="flex gap-0">
        {PHASES.map((ph) => {
          // Disable phase tabs when not in a case context (except "My Cases")
          const isDisabled = ph.id !== 'cases' && !caseId;

          return (
            <button
              key={ph.id}
              onClick={() => handleClick(ph)}
              disabled={isDisabled}
              className={cn(
                'px-5 py-3 text-sm font-normal whitespace-nowrap border-b-[2.5px] transition-colors',
                activePhase === ph.id
                  ? 'font-bold text-navy bg-indigo-50/50 border-navy'
                  : 'text-gray-400 bg-transparent border-transparent hover:text-gray-600',
                isDisabled && 'opacity-40 cursor-not-allowed hover:text-gray-400',
              )}
            >
              {ph.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
