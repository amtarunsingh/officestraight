import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { PhaseTabBar } from './PhaseTabBar';

export function AppLayout() {
  const location = useLocation();

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
