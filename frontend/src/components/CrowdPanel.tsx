import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore, type CrowdData } from '../store';
import { fetchCrowd } from '../api/client';
import { Users, AlertTriangle } from 'lucide-react';

export default function CrowdPanel() {
  const { t } = useTranslation();
  const crowdData = useAppStore(s => s.crowdData);
  const setCrowdData = useAppStore(s => s.setCrowdData);

  useEffect(() => {
    fetchCrowd().then((data: CrowdData) => setCrowdData(data)).catch(console.error);
    const interval = setInterval(
      () => fetchCrowd().then((data: CrowdData) => setCrowdData(data)).catch(console.error),
      30000
    );
    return () => clearInterval(interval);
  }, [setCrowdData]);

  const levelClass = (level: string) =>
    `crowd-bar crowd-bar--${level.replace('_', '-')}`;

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
            {crowdData.sections.slice(0, 8).map(sec => (
              <li key={sec.sectionId} className="crowd-item">
                <div className="crowd-item-header">
                  <span className="crowd-section-name">{sec.sectionName}</span>
                  <span className={`crowd-level-badge crowd-level-badge--${sec.level.replace('_', '-')}`}>
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
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
