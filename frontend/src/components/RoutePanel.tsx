import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { CheckCircle, Clock, MapPin, X, Accessibility } from 'lucide-react';

function RoutePanel() {
  const { t } = useTranslation();
  const route = useAppStore((s) => s.currentRoute);
  const clearRoute = useAppStore((s) => s.clearRoute);

  if (!route) {
    return (
      <section className="panel" aria-label={t('dashboard.route_title')}>
        <h2 className="panel-title">
          <MapPin size={16} aria-hidden="true" />
          {t('dashboard.route_title')}
        </h2>
        <p className="panel-empty">{t('dashboard.route_empty')}</p>
      </section>
    );
  }

  return (
    <section className="panel" aria-label={t('dashboard.route_title')}>
      <div className="route-panel-header">
        <h2 className="panel-title">
          <MapPin size={16} aria-hidden="true" />
          {t('dashboard.route_title')}
        </h2>
        <button
          type="button"
          className="route-clear-btn"
          onClick={clearRoute}
          aria-label="Clear current route"
          title="Clear route"
        >
          <X size={14} aria-hidden="true" />
        </button>
      </div>

      <div className="route-meta">
        <span className="route-badge">
          <Clock size={13} aria-hidden="true" />
          {route.estimatedMinutes} min walk
        </span>
        {route.accessible && (
          <span className="route-badge route-badge--accessible" role="status">
            <Accessibility size={13} aria-hidden="true" />
            Accessible route
          </span>
        )}
        {route.crowdAdjusted && (
          <span className="route-badge route-badge--crowd" role="status">
            Crowd-optimised
          </span>
        )}
        <span className="route-badge">
          {route.path.length} stops
        </span>
      </div>

      <ol className="route-steps" aria-label="Route instructions">
        {route.instructions.map((step, i) => (
          <li key={i} className="route-step">
            <CheckCircle size={14} className="route-step-icon" aria-hidden="true" />
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default memo(RoutePanel);
