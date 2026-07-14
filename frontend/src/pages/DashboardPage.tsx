import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import AIAssistant from '../components/AIAssistant';
import CrowdPanel from '../components/CrowdPanel';
import AmenitiesPanel from '../components/AmenitiesPanel';
import TransportPanel from '../components/TransportPanel';
import RoutePanel from '../components/RoutePanel';
import MapControls from '../components/MapControls';

// Lazy-loaded panels — keeps initial bundle small
const StadiumMap = lazy(() => import('../components/StadiumMap'));
const AlertPanel = lazy(() => import('../components/AlertPanel'));
const CrowdStatus = lazy(() => import('../components/CrowdStatus'));

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <main id="main-content" className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">{t('dashboard.title')}</h1>
        <p className="dashboard-sub">MetLife Stadium — East Rutherford, NJ</p>
      </div>

      {/*
       * 12-column CSS Grid layout — desktop only (≥1024px).
       * Mobile/tablet: single column via media query.
       *
       * Row 1: Map (span 8) | AI Chat (span 4)
       * Row 2: Live Alerts (span 4) | Crowd Status (span 4) | Gate Status (span 4)
       * Row 3: Amenities (span 6) | Transport (span 6)
       * Row 4: Route panel (full width, only visible when a route exists)
       */}
      <div className="db-grid">

        {/* ── Row 1, col 1–8: Map ───────────────────────────────────────── */}
        <div className="db-cell db-cell--map">
          <section className="panel map-panel" aria-label={t('dashboard.map_title')}>
            <h2 className="panel-title">{t('dashboard.map_title')}</h2>
            <MapControls />
            <Suspense fallback={<div className="map-loading" role="status">Loading map...</div>}>
              <StadiumMap />
            </Suspense>
          </section>
        </div>

        {/* ── Row 1, col 9–12: AI Chat ──────────────────────────────────── */}
        <div className="db-cell db-cell--chat">
          <AIAssistant />
        </div>

        {/* ── Row 2, col 1–4: Live Alerts ───────────────────────────────── */}
        <div className="db-cell db-cell--alerts">
          <Suspense fallback={null}>
            <AlertPanel />
          </Suspense>
        </div>

        {/* ── Row 2, col 5–8: Crowd Status (mock) ───────────────────────── */}
        <div className="db-cell db-cell--crowd-status">
          <Suspense fallback={null}>
            <CrowdStatus />
          </Suspense>
        </div>

        {/* ── Row 2, col 9–12: Gate / Live Crowd data (from API) ─────────── */}
        <div className="db-cell db-cell--crowd">
          <CrowdPanel />
        </div>

        {/* ── Row 3, col 1–6: Amenities ─────────────────────────────────── */}
        <div className="db-cell db-cell--amenities">
          <AmenitiesPanel />
        </div>

        {/* ── Row 3, col 7–12: Transport ────────────────────────────────── */}
        <div className="db-cell db-cell--transport">
          <TransportPanel />
        </div>

        {/* ── Row 4: Route (full width, conditionally rendered) ─────────── */}
        <div className="db-cell db-cell--route">
          <RoutePanel />
        </div>

      </div>
    </main>
  );
}
