/**
 * MapControls.tsx
 * Compact filter button strip rendered above the existing stadium map.
 * Clicking a button highlights that category with a lightweight DOM overlay.
 * Does NOT replace or modify the existing Leaflet map.
 */

import { memo, useCallback, useState } from 'react';

interface MapCategory {
  readonly id: string;
  readonly label: string;
  /** Descriptive location hint shown in the overlay */
  readonly hint: string;
}

const MAP_CATEGORIES: readonly MapCategory[] = [
  { id: 'gates', label: 'Gates', hint: 'Gates A–F: North, South, East & West entrances' },
  { id: 'food', label: 'Food Courts', hint: 'Food courts on all levels — Sections 101, 201, 301 area' },
  { id: 'restrooms', label: 'Restrooms', hint: 'Restrooms near Sections 101, 120, 201, 220, 301, 320' },
  { id: 'parking', label: 'Parking', hint: 'Lots 1–12 surrounding the stadium; accessible Lots A & B' },
  { id: 'medical', label: 'Medical', hint: 'Aid stations: Gate B (Level 0), Gate D (Level 0), Section 215 (Level 1)' },
  { id: 'merchandise', label: 'Merchandise', hint: 'Pro Shop at Gate A; stores at Gate A (L0) and Gate C (L1)' },
  { id: 'helpdesk', label: 'Help Desk', hint: 'Guest Services: Gate A (Level 0)' },
  { id: 'accessibility', label: 'Accessibility', hint: 'Elevators 1–4; ramp access at Gates A–E' },
  { id: 'security', label: 'Security', hint: 'Security posts at all gates and concourse intersections' },
  { id: 'fanzone', label: 'Fan Zone', hint: 'Fan Zone: Lot 17 East Plaza (opens 3 hrs before kickoff)' },
  { id: 'emergency', label: 'Emergency Exit', hint: 'Emergency exits marked on all levels; assembly points in each lot sector' },
] as const;

type CategoryId = (typeof MAP_CATEGORIES)[number]['id'];

function MapControls() {
  const [active, setActive] = useState<CategoryId | null>(null);

  const handleClick = useCallback(
    (id: CategoryId) => () => {
      setActive((prev) => (prev === id ? null : id));
    },
    [],
  );

  const activeCategory = MAP_CATEGORIES.find((c) => c.id === active);

  return (
    <div className="map-controls" role="group" aria-label="Map filter controls">
      <div className="map-control-buttons" role="toolbar" aria-label="Highlight map locations">
        {MAP_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            id={`map-ctrl-${cat.id}`}
            className={`map-control-btn${active === cat.id ? ' map-control-btn--active' : ''}`}
            onClick={handleClick(cat.id as CategoryId)}
            aria-pressed={active === cat.id}
            aria-label={`Show ${cat.label} on map`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {activeCategory && (
        <div
          className="map-overlay-hint"
          role="status"
          aria-live="polite"
          aria-label={`${activeCategory.label} location information`}
        >
          <span className="map-overlay-hint-label">{activeCategory.label}:</span>
          <span className="map-overlay-hint-text">{activeCategory.hint}</span>
        </div>
      )}
    </div>
  );
}

export default memo(MapControls);
