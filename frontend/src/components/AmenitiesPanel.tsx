import { useEffect, useState, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchAmenities } from '../api/client';
import type { Amenity } from '../api/client';
import { Utensils, Droplets, HeartPulse, ShieldCheck, ShoppingBag } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────

type AmenityType = Amenity['type'];

// ─── Constants (defined outside component — no re-creation per render) ────

/** Icon map keyed by amenity type */
const TYPE_ICONS: Readonly<Record<string, React.ReactNode>> = {
  food:        <Utensils size={15} aria-hidden="true" />,
  restroom:    <Droplets size={15} aria-hidden="true" />,
  medical:     <HeartPulse size={15} aria-hidden="true" />,
  security:    <ShieldCheck size={15} aria-hidden="true" />,
  merchandise: <ShoppingBag size={15} aria-hidden="true" />,
};

const FILTER_TYPES: readonly AmenityType[] = [
  'food', 'restroom', 'medical', 'security', 'merchandise',
];

/** Maximum items to display in the panel to avoid overflow */
const MAX_DISPLAY = 6;

// ─── Component ────────────────────────────────────────────────────────────

function AmenitiesPanel() {
  const { t } = useTranslation();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [filter, setFilter] = useState<AmenityType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAmenities = useCallback(async (type: AmenityType | null) => {
    setIsLoading(true);
    setError(null);
    try {
      const data: Amenity[] = await fetchAmenities(type ?? undefined);
      setAmenities(data);
    } catch {
      setError('Failed to load amenities. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAmenities(filter);
  }, [filter, loadAmenities]);

  const displayed = amenities.slice(0, MAX_DISPLAY);

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
        {FILTER_TYPES.map((type) => (
          <button
            key={type}
            className={`amenity-filter-btn ${filter === type ? 'amenity-filter-btn--active' : ''}`}
            onClick={() => setFilter(type)}
            aria-pressed={filter === type}
            aria-label={`Filter by ${type}`}
          >
            {TYPE_ICONS[type]}
            <span className="sr-only">{type}</span>
          </button>
        ))}
      </div>

      {isLoading && <p className="panel-loading" role="status">Loading amenities...</p>}
      {error && <p className="panel-error" role="alert">{error}</p>}

      {!isLoading && !error && displayed.length === 0 && (
        <p className="panel-empty">No amenities found.</p>
      )}

      {!isLoading && !error && displayed.length > 0 && (
        <ul className="amenity-list" aria-label="Nearby amenities">
          {displayed.map((a) => (
            <li key={a.id} className="amenity-item">
              <div className="amenity-icon" aria-hidden="true">
                {TYPE_ICONS[a.type] ?? <Utensils size={15} />}
              </div>
              <div className="amenity-info">
                <span className="amenity-name">{a.name}</span>
                <span className="amenity-desc">{a.description}</span>
                <span className="amenity-meta">
                  Level {a.level} · Section {a.section} · {a.hours}
                </span>
              </div>
              {a.accessible && (
                <span className="amenity-accessible" aria-label="Wheelchair accessible">
                  ♿
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default memo(AmenitiesPanel);
