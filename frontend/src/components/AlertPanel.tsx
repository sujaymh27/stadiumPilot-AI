/**
 * AlertPanel.tsx
 * Displays a compact list of real-time stadium alerts.
 * Uses mock data — no backend required.
 */

import { memo } from 'react';
import { AlertTriangle, Info } from 'lucide-react';

type AlertSeverity = 'warning' | 'info';

interface StadiumAlert {
  readonly id: string;
  readonly severity: AlertSeverity;
  readonly message: string;
}

const MOCK_ALERTS: readonly StadiumAlert[] = [
  {
    id: 'alert-1',
    severity: 'warning',
    message: 'Gate C has increased foot traffic. Consider using Gate A or Gate D.',
  },
  {
    id: 'alert-2',
    severity: 'warning',
    message: 'Parking Lot P2 is nearly full. Lots P3 and P4 have availability.',
  },
  {
    id: 'alert-3',
    severity: 'info',
    message: 'Rain is expected before kickoff. Covered concourses are recommended.',
  },
  {
    id: 'alert-4',
    severity: 'info',
    message: 'Match starts in 30 minutes. Gates are now open on all levels.',
  },
] as const;

function AlertPanel() {
  return (
    <section className="panel alert-panel" aria-label="Stadium alerts">
      <h2 className="panel-title">
        <AlertTriangle size={16} aria-hidden="true" />
        Live Alerts
      </h2>
      <ul className="alert-list" aria-label="Current stadium alerts" role="list">
        {MOCK_ALERTS.map((alert) => (
          <li key={alert.id} className={`alert-item alert-item--${alert.severity}`}>
            <span className="alert-item-icon" aria-hidden="true">
              {alert.severity === 'warning' ? (
                <AlertTriangle size={13} />
              ) : (
                <Info size={13} />
              )}
            </span>
            <span className="alert-item-text">{alert.message}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default memo(AlertPanel);
