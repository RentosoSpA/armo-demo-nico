import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import '../../../styles/components/_info-widgets.scss';

interface InfoWidgetProps {
  data?: any;
  loading?: boolean;
  widget?: any;
  config?: any;
}

const UpcomingEventsWidget: React.FC<InfoWidgetProps> = () => {
  const events = [
    {
      day: 'Hoy',
      items: [
        { time: '10:00', title: 'Visita Casa Las Condes', location: 'Las Condes' },
        { time: '15:30', title: 'Reunión con cliente', location: 'Oficina Central' }
      ]
    },
    {
      day: 'Mañana',
      items: [
        { time: '09:00', title: 'Firma de contrato', location: 'Notaría' },
        { time: '14:00', title: 'Inspección propiedad', location: 'Providencia' }
      ]
    },
    {
      day: 'Esta Semana',
      items: [
        { time: 'Jue 11:00', title: 'Open House', location: 'Vitacura' },
        { time: 'Vie 16:00', title: 'Cierre de ventas', location: 'Virtual' }
      ]
    }
  ];

  return (
    <div className="info-widget">
      <div className="info-widget__header">
        <h3 className="info-widget__title">Próximos Eventos</h3>
        <div className="info-widget__subtitle">Calendario de actividades</div>
      </div>
      <div className="info-widget__content">
        <div className="events-list">
          {events.map((group, groupIndex) => (
            <div key={groupIndex} className="event-group">
              <div className="event-group__day">{group.day}</div>
              <div className="event-group__items">
                {group.items.map((event, eventIndex) => (
                  <div key={eventIndex} className="event-item">
                    <div className="event-item__time">
                      <Clock size={14} />
                      {event.time}
                    </div>
                    <div className="event-item__details">
                      <div className="event-item__title">{event.title}</div>
                      <div className="event-item__location">
                        <MapPin size={12} />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventsWidget;
