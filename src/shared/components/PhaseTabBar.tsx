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

export function PhaseTabBar({ pathname }: { pathname: string }) {
  const navigate = useNavigate();
  const activePhase = getActivePhase(pathname);

  const handleClick = (phase: Phase) => {
    if (phase.id === 'cases') {
      navigate('/');
    }
    // Quote/Order/Confirm phases only navigate when within a case context
    // The actual navigation happens via wizard buttons, not the tab bar
  };

  return (
    <div className="bg-white border-b border-gray-300 px-6 overflow-x-auto">
      <div className="flex gap-0">
        {PHASES.map((ph) => (
          <button
            key={ph.id}
            onClick={() => handleClick(ph)}
            className={cn(
              'px-5 py-3 text-sm font-normal whitespace-nowrap border-b-[2.5px] transition-colors',
              activePhase === ph.id
                ? 'font-bold text-navy bg-indigo-50/50 border-navy'
                : 'text-gray-400 bg-transparent border-transparent hover:text-gray-600',
            )}
          >
            {ph.label}
          </button>
        ))}
      </div>
    </div>
  );
}
