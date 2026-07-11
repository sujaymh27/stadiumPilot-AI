import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchTransport } from '../api/client';
import { Train, Bus, Car, Clock } from 'lucide-react';

interface TransportData {
  rail: { id: string; name: string; line: string; description: string; walkTime: number; schedule: string }[];
  bus: { id: string; name: string; description: string; walkTime: number; schedule: string }[];
  rideshare: { pickupZone: string; notes: string };
  generalNotes: string;
}

export default function TransportPanel() {
  const { t } = useTranslation();
  const [transport, setTransport] = useState<TransportData | null>(null);

  useEffect(() => {
    fetchTransport().then((data: TransportData) => setTransport(data)).catch(console.error);
  }, []);

  return (
    <section className="panel" aria-label={t('dashboard.transport_title')}>
      <h2 className="panel-title">
        <Train size={16} aria-hidden="true" />
        {t('dashboard.transport_title')}
      </h2>

      {!transport ? (
        <p className="panel-loading" role="status">Loading transport info...</p>
      ) : (
        <div className="transport-list">
          {transport.rail.map(r => (
            <article key={r.id} className="transport-item">
              <div className="transport-icon transport-icon--rail" aria-hidden="true">
                <Train size={16} />
              </div>
              <div className="transport-info">
                <h3 className="transport-name">{r.name}</h3>
                <p className="transport-line">{r.line}</p>
                <p className="transport-desc">{r.description}</p>
                <p className="transport-schedule">
                  <Clock size={12} aria-hidden="true" />
                  {r.schedule}
                </p>
              </div>
              <span className="transport-walk">
                {r.walkTime} min walk
              </span>
            </article>
          ))}

          {transport.bus.map(b => (
            <article key={b.id} className="transport-item">
              <div className="transport-icon transport-icon--bus" aria-hidden="true">
                <Bus size={16} />
              </div>
              <div className="transport-info">
                <h3 className="transport-name">{b.name}</h3>
                <p className="transport-desc">{b.description}</p>
                <p className="transport-schedule">
                  <Clock size={12} aria-hidden="true" />
                  {b.schedule}
                </p>
              </div>
              <span className="transport-walk">
                {b.walkTime} min walk
              </span>
            </article>
          ))}

          <article className="transport-item">
            <div className="transport-icon transport-icon--rideshare" aria-hidden="true">
              <Car size={16} />
            </div>
            <div className="transport-info">
              <h3 className="transport-name">Rideshare</h3>
              <p className="transport-desc">{transport.rideshare.pickupZone}</p>
              <p className="transport-schedule">{transport.rideshare.notes}</p>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
