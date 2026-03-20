import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Patent } from '@/types';
import { formatDate, daysRemaining, isDeadlinePassed } from '@/shared/lib/utils';
import { cn } from '@/shared/lib/utils';

interface PatentSidebarProps {
  patent: Patent | null;
  /** Hide the back button (e.g. on the first step). Defaults to showing it. */
  hideBack?: boolean;
}

/** Memoised — only re-renders when patent data actually changes */
export const PatentSidebar = memo(function PatentSidebar({ patent, hideBack }: PatentSidebarProps) {
  const navigate = useNavigate();

  if (!patent) {
    return (
      <div className="w-[260px] min-w-[260px] sticky top-4">
        {!hideBack && <BackButton onClick={() => navigate(-1)} />}
        <div className="bg-amber-50/50 rounded-lg border border-amber-200 p-4 text-xs">
          <div className="text-gold font-bold text-sm mb-3">Patent Summary</div>
          <p className="text-gray-400 italic">Loading patent data...</p>
        </div>
      </div>
    );
  }

  const days30 = daysRemaining(patent.deadline30Month);
  const passed30 = isDeadlinePassed(patent.deadline30Month);
  const passed31 = isDeadlinePassed(patent.deadline31Month);

  return (
    <div className="w-[260px] min-w-[260px] sticky top-4">
      {!hideBack && <BackButton onClick={() => navigate(-1)} />}
      <aside className="bg-amber-50/50 rounded-lg border border-amber-200 p-4 text-xs">
        <div className="text-gold font-bold text-sm mb-3">Patent Summary</div>

      {/* General info */}
      {([
        ['Title', patent.title],
        ['Application No.', patent.applicationNumber],
        ['Publication No.', patent.publicationNumber],
        ['Language', patent.publicationLanguage],
        ['Receiving Office', patent.receivingOffice],
      ] as const).map(([label, value]) => (
        <div key={label} className="mb-1.5">
          <div className="text-gray-400 text-[11px]">{label}</div>
          <div className="text-navy font-medium">{value}</div>
        </div>
      ))}

      <hr className="border-gray-300 my-4" />

      {/* Milestones */}
      {([
        ['Filing Date', formatDate(patent.filingDate), false],
        ['Priority Date', formatDate(patent.priorityDate), false],
        ['30-month deadline', formatDate(patent.deadline30Month), passed30],
        ['31-month deadline', formatDate(patent.deadline31Month), passed31],
      ] as const).map(([label, value, warn]) => (
        <div key={label} className="mb-1.5">
          <div className={cn('text-[11px]', warn ? 'text-amber-600' : 'text-gray-400')}>{label}</div>
          <div className={cn('font-semibold', warn ? 'text-amber-600' : 'text-navy')}>
            {value}
            {warn && <span className="text-[10px] font-normal ml-1">(passed)</span>}
          </div>
        </div>
      ))}

      {/* Deadline status */}
      <div className={cn(
        'mt-3 p-2 rounded-md border text-[11px]',
        passed30
          ? 'bg-red-50 border-red-200 text-red-700'
          : 'bg-amber-50 border-amber-300 text-amber-800',
      )}>
        <div className="font-bold">
          {passed30 ? '⚠ Deadline Passed' : '⚠ Deadline Status'}
        </div>
        <div>
          {passed30
            ? 'The 30-month deadline has passed. Late surcharges may apply.'
            : `${days30} days remaining — Normal pricing`}
        </div>
      </div>
    </aside>
    </div>
  );
});

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm text-navy font-semibold mb-3 ml-auto hover:text-gold transition-colors"
    >
      <span className="text-base">←</span> Back
    </button>
  );
}
