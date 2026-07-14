/**
 * CrowdStatus.tsx
 * Displays mock crowd information for key stadium locations.
 * Status labels only — no emojis.
 * No backend required; uses static mock data updated on each render cycle.
 */

import { memo } from 'react';

type CrowdLevel = 'Low' | 'Moderate' | 'High' | 'Available' | 'Nearly Full';

interface CrowdStatusItem {
  readonly id: string;
  readonly location: string;
  readonly status: CrowdLevel;
}

const MOCK_CROWD_STATUS: readonly CrowdStatusItem[] = [
  { id: 'cs-gate-a', location: 'Gate A', status: 'Low' },
  { id: 'cs-gate-b', location: 'Gate B', status: 'Moderate' },
  { id: 'cs-gate-c', location: 'Gate C', status: 'High' },
  { id: 'cs-gate-d', location: 'Gate D', status: 'Moderate' },
  { id: 'cs-parking-p1', location: 'Parking P1', status: 'Available' },
  { id: 'cs-parking-p2', location: 'Parking P2', status: 'Nearly Full' },
  { id: 'cs-food-north', location: 'Food Court North', status: 'Moderate' },
  { id: 'cs-medical', location: 'Medical Centre', status: 'Available' },
] as const;

const STATUS_CLASS: Record<CrowdLevel, string> = {
  Low: 'crowd-status-badge--low',
  Moderate: 'crowd-status-badge--moderate',
  High: 'crowd-status-badge--high',
  Available: 'crowd-status-badge--available',
  'Nearly Full': 'crowd-status-badge--nearly-full',
};

function CrowdStatus() {
  return (
    <section className="panel crowd-status-panel" aria-label="Crowd status by location">
      <h2 className="panel-title">Crowd Status</h2>
      <ul className="crowd-status-list" aria-label="Location crowd levels" role="list">
        {MOCK_CROWD_STATUS.map((item) => (
          <li key={item.id} className="crowd-status-item">
            <span className="crowd-status-location">{item.location}</span>
            <span
              className={`crowd-status-badge ${STATUS_CLASS[item.status]}`}
              aria-label={`${item.location}: ${item.status}`}
            >
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default memo(CrowdStatus);
