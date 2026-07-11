import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchAmenities } from '../api/client';
import { Utensils, Droplets, HeartPulse, ShieldCheck, ShoppingBag } from 'lucide-react';

interface Amenity {
  id: string;
  type: string;
  name: string;
  description: string;
  section: string;
  level: number;
  accessible: boolean;
  hours: string;
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  food:        <Utensils size={15} aria-hidden="true" />,
  restroom:    <Droplets size={15} aria-hidden="true" />,
  medical:     <HeartPulse size={15} aria-hidden="true" />,
  security:    <ShieldCheck size={15} aria-hidden="true" />,
  merchandise: <ShoppingBag size={15} aria-hidden="true" />,
};

const FILTER_TYPES = ['food', 'restroom', 'medical', 'security', 'merchandise'] as const;

export default function AmenitiesPanel() {
  const { t } = useTranslation();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchAmenities(filter ?? undefined)
      .then((data: Amenity[]) => setAmenities(data))
      .catch(console.error);
  }, [filter]);

  const displayed = amenities.slice(0, 6);

  return (
    <section className="panel" aria-label={t('dashboard.amenities_title')}>
      <h2 className="panel-title">
        <Utensils size={16} aria-hidden="true" />
        {t('dashboard.amenities_title')}
      </h2>

      <div className="amenity-filters" role="group" aria-label="Filter amenities by type">
        <button
          className={`amenity-filter-btn ${filter === null ? 'amenity-filter-btn--active' : ''}`}
          onClick={() => setFilter(null)}
          aria-pressed={filter === null}
        >
          All
        </button>
        {FILTER_TYPES.map(type => (
          <button
            key={type}
            className={`amenity-filter-btn ${filter === type ? 'amenity-filter-btn--active' : ''}`}
            onClick={() => setFilter(type)}
            aria-pressed={filter === type}
          >
            {TYPE_ICONS[type]}
            <span className="sr-only">{type}</span>
          </button>
        ))}
      </div>

      <ul className="amenity-list" aria-label="Nearby amenities">
        {displayed.map(a => (
          <li key={a.id} className="amenity-item">
            <div className="amenity-icon" aria-hidden="true">
              {TYPE_ICONS[a.type] ?? <Utensils size={15} />}
            </div>
            <div className="amenity-info">
              <span className="amenity-name">{a.name}</span>
              <span className="amenity-desc">{a.description}</span>
              <span className="amenity-meta">Level {a.level} · Section {a.section} · {a.hours}</span>
            </div>
            {a.accessible && (
              <span className="amenity-accessible" aria-label="Wheelchair accessible">
                &#9855;
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
