import { useLiveFeed } from '../../hooks/useLiveFeed';
import type { ActivityEvent } from '../../types/activity';
import { useEffect, useRef } from 'react';

function StatusPill({ s }: { s: ActivityEvent['status'] }) {
  const statusClass = s.toLowerCase().replace(' ', '-');
  return (
    <span className={`activity-status status-${statusClass}`}>
      {s}
    </span>
  );
}

function Row({ ev }: { ev: ActivityEvent }) {
  return (
    <li
      role="article"
      aria-label={`${ev.agent} ${ev.status}`}
      className="activity-item"
    >
      <div className="activity-icon">
        <span>🐻</span>
      </div>
      <div className="activity-content">
        <div className="activity-header">
          <p className="activity-agent">{ev.agent}</p>
          <StatusPill s={ev.status} />
        </div>
        <p className="activity-description">{ev.description}</p>
      </div>
      <time className="activity-time" dateTime={ev.timestamp}>
        {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </time>
    </li>
  );
}

export default function LiveActivityFeed() {
  const { events, connected } = useLiveFeed({ maxItems: 40 });
  const topRef = useRef<HTMLDivElement>(null);

  // Debug logs
  console.log('🐻 LiveActivityFeed - Eventos:', events.length);
  console.log('🐻 LiveActivityFeed - Conectado:', connected);

  // auto-scroll suave hacia arriba al llegar nuevos eventos (marcar foco visual)
  useEffect(() => {
    topRef.current?.animate([{ opacity: 0.5 }, { opacity: 1 }], { duration: 300 });
  }, [events.length]);

  return (
    <section aria-labelledby="live-activity-title" className="live-activity-feed">
      <div className="feed-header">
        <h2 id="live-activity-title" className="feed-title">
          Feed de Actividad en Vivo
        </h2>
        <span className={`feed-status-badge ${connected ? 'connected' : 'demo'}`}>
          {connected ? 'En línea' : 'Modo demo'}
        </span>
      </div>

      <div ref={topRef} className="feed-container">
        <ul role="feed" className="feed-list">
          {events.map(ev => <Row key={ev.id} ev={ev} />)}
        </ul>
      </div>
    </section>
  );
}
