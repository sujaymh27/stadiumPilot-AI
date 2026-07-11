import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import AIAssistant from '../components/AIAssistant';
import CrowdPanel from '../components/CrowdPanel';
import AmenitiesPanel from '../components/AmenitiesPanel';
import TransportPanel from '../components/TransportPanel';
import RoutePanel from '../components/RoutePanel';

const StadiumMap = lazy(() => import('../components/StadiumMap'));

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <main id="main-content" className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{t('dashboard.title')}</h1>
        <p className="dashboard-sub">MetLife Stadium — East Rutherford, NJ</p>
      </div>

      <div className="dashboard-grid">
        {/* Left column */}
        <div className="dashboard-col dashboard-col--left">
          <AIAssistant />
          <RoutePanel />
        </div>

        {/* Center — Map */}
        <div className="dashboard-col dashboard-col--center">
          <section className="panel map-panel" aria-label={t('dashboard.map_title')}>
            <h2 className="panel-title">{t('dashboard.map_title')}</h2>
            <Suspense fallback={<div className="map-loading" role="status">Loading map...</div>}>
              <StadiumMap />
            </Suspense>
          </section>
        </div>

        {/* Right column */}
        <div className="dashboard-col dashboard-col--right">
          <CrowdPanel />
          <AmenitiesPanel />
          <TransportPanel />
        </div>
      </div>
    </main>
  );
}
