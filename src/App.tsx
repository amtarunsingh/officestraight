import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/shared/components/AppLayout';
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

export function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingScreen />}>
              <MyCases />
            </Suspense>
          }
        />
        {/* Quote Phase */}
        <Route
          path="case/:caseId/service-selection"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <ServiceSelection />
            </Suspense>
          }
        />
        <Route
          path="case/:caseId/word-count"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <WordCount />
            </Suspense>
          }
        />
        <Route
          path="case/:caseId/quote-details"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <QuoteDetails />
            </Suspense>
          }
        />
        {/* Order Phase */}
        <Route
          path="case/:caseId/instructions"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Instructions />
            </Suspense>
          }
        />
        <Route
          path="case/:caseId/inventors"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Inventors />
            </Suspense>
          }
        />
        <Route
          path="case/:caseId/annuities"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Annuities />
            </Suspense>
          }
        />
        <Route
          path="case/:caseId/billing"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Billing />
            </Suspense>
          }
        />
        <Route
          path="case/:caseId/confirmation"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Confirmation />
            </Suspense>
          }
        />
        {/* Order Detail (read-only view) */}
        <Route
          path="order/:orderId"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <OrderDetail />
            </Suspense>
          }
        />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
