import React, { useEffect, useRef } from 'react';
import type { ActivityEvent } from '../../types/activity';
import { useLiveFeed } from '../../hooks/useLiveFeed';

interface OsoActivityFeedProps {
  osoName: string;
}

function StatusPill({ s }: { s: ActivityEvent['status'] }) {
  const statusClass = s.toLowerCase().replace(' ', '-');
  return (
    <span className={`oso-activity-status status-${statusClass}`}>
      {s}
    </span>
  );
}

function ActivityRow({ ev }: { ev: ActivityEvent }) {
  return (
    <li className="oso-activity-item">
      <div className="oso-activity-icon">
        <span>🐻</span>
      </div>
      <div className="oso-activity-content">
        <div className="oso-activity-header">
          <StatusPill s={ev.status} />
          <time className="oso-activity-time" dateTime={ev.timestamp}>
            {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </time>
        </div>
        <p className="oso-activity-description">{ev.description}</p>
      </div>
    </li>
  );
}

const OsoActivityFeed: React.FC<OsoActivityFeedProps> = ({ osoName }) => {
  const { events } = useLiveFeed({ maxItems: 20 });
  const topRef = useRef<HTMLDivElement>(null);

  // Filtrar eventos solo de este oso
  const filteredEvents = events.filter(ev => ev.agent === osoName);

  useEffect(() => {
    if (filteredEvents.length > 0) {
      topRef.current?.animate([{ opacity: 0.5 }, { opacity: 1 }], { duration: 300 });
    }
  }, [filteredEvents.length]);

  return (
    <div className="oso-activity-feed">
      <div className="oso-activity-feed-header">
        <h3 className="oso-activity-feed-title">Actividad Reciente</h3>
        <span className="oso-activity-feed-count">{filteredEvents.length} eventos</span>
      </div>

      <div ref={topRef} className="oso-activity-feed-container">
        {filteredEvents.length === 0 ? (
          <div className="oso-activity-empty">
            <span className="oso-activity-empty-icon">💤</span>
            <p>Sin actividad reciente</p>
          </div>
        ) : (
          <ul className="oso-activity-feed-list">
            {filteredEvents.slice(0, 10).map(ev => (
              <ActivityRow key={ev.id} ev={ev} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default OsoActivityFeed;
