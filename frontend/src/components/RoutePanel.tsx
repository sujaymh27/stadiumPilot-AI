import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { CheckCircle, Clock, MapPin } from 'lucide-react';

export default function RoutePanel() {
  const { t } = useTranslation();
  const route = useAppStore(s => s.currentRoute);

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
      <h2 className="panel-title">
        <MapPin size={16} aria-hidden="true" />
        {t('dashboard.route_title')}
      </h2>

      <div className="route-meta">
        <span className="route-badge">
          <Clock size={13} aria-hidden="true" />
          {route.estimatedMinutes} min walk
        </span>
        {route.accessible && (
          <span className="route-badge route-badge--accessible" role="status">
            Accessible route
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
