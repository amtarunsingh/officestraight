import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { LAST_CASE_ID_KEY } from '@/shared/lib/sessionKeys';
import { Header } from './Header';
import { PhaseTabBar } from './PhaseTabBar';

export function AppLayout() {
  const location = useLocation();

  useEffect(() => {
    const m = location.pathname.match(/^\/case\/([^/]+)(?:\/|$)/);
    if (m?.[1]) {
      try {
        sessionStorage.setItem(LAST_CASE_ID_KEY, m[1]);
      } catch {
        /* private mode / quota */
      }
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-surface font-sans text-navy">
      <Header />
      <PhaseTabBar pathname={location.pathname} />
      <div className="max-w-[1200px] mx-auto px-6 py-5">
        <Outlet />
      </div>
    </div>
  );
}
