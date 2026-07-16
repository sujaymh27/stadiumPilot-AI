import { useEffect, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type CrowdData } from '../store';
import { fetchCrowd } from '../api/client';
import { Users, AlertTriangle } from 'lucide-react';

/** Interval between crowd data refreshes (30 seconds) */
const POLL_INTERVAL_MS = 30_000;

/** Map crowd level to CSS class name — extracted to avoid recomputation */
function levelClass(level: string): string {
  return `crowd-bar crowd-bar--${level.replace('_', '-')}`;
}

function CrowdPanel() {
  const { t } = useTranslation();
  const crowdData = useAppStore((s) => s.crowdData);
  const setCrowdData = useAppStore((s) => s.setCrowdData);

  const loadCrowd = useCallback(async () => {
    try {
      const data: CrowdData = await fetchCrowd();
      setCrowdData(data);
    } catch (err) {
      // Don't overwrite existing data on poll failure — just log silently
      console.warn('[CrowdPanel] Failed to fetch crowd data:', err);
    }
  }, [setCrowdData]);

  useEffect(() => {
    void loadCrowd();
    const interval = setInterval(loadCrowd, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadCrowd]);

  return (
    <section className="panel" aria-label={t('dashboard.crowd_title')}>
      <h2 className="panel-title">
        <Users size={16} aria-hidden="true" />
        {t('dashboard.crowd_title')}
      </h2>

      {!crowdData ? (
        <p className="panel-loading" role="status">Loading crowd data...</p>
      ) : (
        <>
          <div className="crowd-overview">
            <span className="crowd-phase" aria-label="Game phase">
              {t(`dashboard.phase.${crowdData.phase}`)}
            </span>
            <span className="crowd-density">
              Overall: {Math.round(crowdData.overallDensity * 100)}% capacity
            </span>
          </div>

          {crowdData.hotspots.length > 0 && (
            <div className="crowd-hotspot" role="alert">
              <AlertTriangle size={14} aria-hidden="true" />
              <span>Congested: {crowdData.hotspots.join(', ')}</span>
            </div>
          )}

          <ul className="crowd-list" aria-label="Crowd levels by section">
            {crowdData.sections.slice(0, 8).map((sec) => (
              <li key={sec.sectionId} className="crowd-item">
                <div className="crowd-item-header">
                  <span className="crowd-section-name">{sec.sectionName}</span>
                  <span
                    className={`crowd-level-badge crowd-level-badge--${sec.level.replace('_', '-')}`}
                  >
                    {t(`dashboard.crowd_level.${sec.level}`)}
                  </span>
                </div>
                <div
                  className="crowd-bar-track"
                  role="progressbar"
                  aria-valuenow={Math.round(sec.density * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${sec.sectionName} at ${Math.round(sec.density * 100)}% capacity`}
                >
                  <div
                    className={levelClass(sec.level)}
                    style={{ width: `${Math.round(sec.density * 100)}%` }}
                  />
                </div>
                {sec.recommendAlternate && (
                  <p className="crowd-alternate-hint" role="status">
                    Consider an alternate route
                  </p>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export default memo(CrowdPanel);
