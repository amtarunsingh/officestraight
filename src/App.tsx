import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/shared/components/AppLayout';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { LoadingScreen } from '@/shared/components/LoadingScreen';

// Lazy-load all page-level components for code splitting
const MyCases = lazy(() => import('@/features/cases/MyCasesPage'));
const ServiceSelection = lazy(() => import('@/features/ordering-wizard/steps/ServiceSelectionPage'));
const WordCount = lazy(() => import('@/features/ordering-wizard/steps/WordCountPage'));
const QuoteDetails = lazy(() => import('@/features/ordering-wizard/steps/QuoteDetailsPage'));
const Instructions = lazy(() => import('@/features/ordering-wizard/steps/InstructionsPage'));
const Inventors = lazy(() => import('@/features/ordering-wizard/steps/InventorsPage'));
const Annuities = lazy(() => import('@/features/ordering-wizard/steps/AnnuitiesPage'));
const Billing = lazy(() => import('@/features/ordering-wizard/steps/BillingPage'));
const Confirmation = lazy(() => import('@/features/ordering-wizard/steps/ConfirmationPage'));
const OrderDetail = lazy(() => import('@/features/order-detail/OrderDetailPage'));

function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<PageSuspense><MyCases /></PageSuspense>} />
          {/* Quote Phase */}
          <Route path="case/:caseId/service-selection" element={<PageSuspense><ServiceSelection /></PageSuspense>} />
          <Route path="case/:caseId/word-count" element={<PageSuspense><WordCount /></PageSuspense>} />
          <Route path="case/:caseId/quote-details" element={<PageSuspense><QuoteDetails /></PageSuspense>} />
          {/* Order Phase */}
          <Route path="case/:caseId/instructions" element={<PageSuspense><Instructions /></PageSuspense>} />
          <Route path="case/:caseId/inventors" element={<PageSuspense><Inventors /></PageSuspense>} />
          <Route path="case/:caseId/annuities" element={<PageSuspense><Annuities /></PageSuspense>} />
          <Route path="case/:caseId/billing" element={<PageSuspense><Billing /></PageSuspense>} />
          <Route path="case/:caseId/confirmation" element={<PageSuspense><Confirmation /></PageSuspense>} />
          {/* Order Detail (read-only view) */}
          <Route path="order/:orderId" element={<PageSuspense><OrderDetail /></PageSuspense>} />
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
