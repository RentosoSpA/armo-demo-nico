import React, { memo } from 'react';
import { Card, Tag, Empty } from 'antd';
import { Calendar, MapPin, User } from 'lucide-react';
import type { Visit } from '../../types/rentoso';
import { formatVisitDateTime } from '../../utils/chatHelpers';

interface VisitsDisplayProps {
  visits: Visit[];
}

const VisitsDisplayComponent: React.FC<VisitsDisplayProps> = ({ visits }) => {
  if (!visits || visits.length === 0) {
    return (
      <Empty
        description="No hay visitas agendadas"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'Agendada':
        return 'blue';
      case 'Confirmada':
        return 'green';
      case 'Cancelada':
        return 'red';
      case 'Completada':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <div className="visits-list">
      {visits.map((visit) => (
        <Card 
          key={visit.id} 
          size="small"
          className="visit-card"
          style={{ marginBottom: 8 }}
        >
          <div className="visit-header">
            <Tag color={getStatusColor(visit.estado)}>{visit.estado}</Tag>
            <span className="visit-type">{visit.tipo_visita}</span>
          </div>
          
          <div className="visit-info">
            <div className="visit-info-item">
              <Calendar size={14} />
              <span>{formatVisitDateTime(visit.fecha_inicio)}</span>
            </div>
            
            <div className="visit-info-item">
              <MapPin size={14} />
              <span>{visit.propiedad.titulo}</span>
            </div>
            
            <div className="visit-info-item">
              <User size={14} />
              <span>{visit.prospecto.display_name || visit.prospecto.phone_e164}</span>
            </div>
          </div>
          
          {visit.observaciones && (
            <div className="visit-notes">
              <small>{visit.observaciones}</small>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

const VisitsDisplay = memo(VisitsDisplayComponent);
VisitsDisplay.displayName = 'VisitsDisplay';

export default VisitsDisplay;
