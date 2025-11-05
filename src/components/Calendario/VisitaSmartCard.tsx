import React from 'react';
import { Typography, Button, Space, Avatar, Badge, Tooltip } from 'antd';
import { Phone, MapPin, Edit2, X, MessageCircle } from 'lucide-react';
import dayjs from 'dayjs';
import type { Visita } from '../../types/visita';

const { Text } = Typography;

interface VisitaSmartCardProps {
  visita: Visita;
  showActions?: boolean;
  compact?: boolean;
  onAction?: (action: 'whatsapp' | 'location' | 'edit' | 'cancel') => void;
}

const getEstadoBadge = (estado: string) => {
  const badges = {
    'Aprobada': { color: '#10B981', text: 'CONFIRMADA' },
    'Completada': { color: '#10B981', text: 'COMPLETADA' },
    'Agendada': { color: '#F59E0B', text: 'PENDIENTE' },
    'Cancelada': { color: '#EF4444', text: 'CANCELADA' },
  };
  return badges[estado as keyof typeof badges] || { color: '#6B7280', text: estado };
};

const getPlatformIcon = (plataforma: string) => {
  if (plataforma.toLowerCase().includes('whatsapp')) return '📱';
  if (plataforma.toLowerCase().includes('video')) return '🎥';
  if (plataforma.toLowerCase().includes('presencial')) return '🏢';
  return '📍';
};

const VisitaSmartCard: React.FC<VisitaSmartCardProps> = ({
  visita,
  showActions = true,
  compact = false,
  onAction,
}) => {
  const badge = getEstadoBadge(visita.estado);
  const prospectoData = visita.prospectoInfo;
  const iniciales = prospectoData?.nombre?.split(' ').map((n: string) => n[0]).join('').substring(0, 2) || '??';
  
  const startTime = dayjs(visita.fecha_inicio);
  const endTime = visita.horaFin ? dayjs(visita.fecha_inicio).hour(typeof visita.horaFin === 'number' ? visita.horaFin : parseInt(visita.horaFin as string)) : startTime.add(1, 'hour');
  const timeUntil = startTime.diff(dayjs(), 'minute');
  const isUpcoming = timeUntil > 0 && timeUntil < 180; // Next 3 hours

  return (
    <div className={`visita-smart-card ${compact ? 'visita-smart-card--compact' : ''} ${isUpcoming ? 'visita-smart-card--upcoming' : ''}`}>
      {/* Header with Avatar and Status */}
      <div className="visita-smart-card__header">
        <div className="visita-smart-card__avatar-section">
          <Avatar 
            size={compact ? 32 : 40}
            className="visita-smart-card__avatar"
            style={{ 
              backgroundColor: '#33F491',
              color: '#1b2a3a',
              fontWeight: 600
            }}
          >
            {iniciales}
          </Avatar>
          <div className="visita-smart-card__header-info">
            <Text className="visita-smart-card__prospecto-name">
              {prospectoData?.nombre || 'Prospecto'}
            </Text>
            <Badge 
              color={badge.color}
              text={<span className="visita-smart-card__status-text">{badge.text}</span>}
            />
          </div>
        </div>
      </div>

      {/* Property Info */}
      <div className="visita-smart-card__property">
        <span className="visita-smart-card__icon">🏠</span>
        <Text className="visita-smart-card__property-text">
          {visita.propiedad}
        </Text>
      </div>

      {/* Time Info */}
      <div className="visita-smart-card__time">
        <span className="visita-smart-card__icon">🕐</span>
        <Text className="visita-smart-card__time-text">
          {startTime.format('HH:mm')} - {endTime.format('HH:mm')}
        </Text>
        {isUpcoming && (
          <span className="visita-smart-card__countdown">
            (en {Math.floor(timeUntil / 60)}h {timeUntil % 60}min)
          </span>
        )}
      </div>

      {/* Platform */}
      <div className="visita-smart-card__platform">
        <span className="visita-smart-card__icon">
          {getPlatformIcon(visita.plataforma)}
        </span>
        <Text className="visita-smart-card__platform-text">
          {visita.plataforma}
        </Text>
      </div>

      {/* CuriOso Badge */}
      {visita.agendadaPorCurioso && (
        <div className="visita-smart-card__curioso-badge">
          <span className="visita-smart-card__curioso-icon">🐻‍❄️</span>
          <Text className="visita-smart-card__curioso-text">
            Agendada por CuriOso
          </Text>
        </div>
      )}

      {/* Actions */}
      {showActions && onAction && (
        <div className="visita-smart-card__actions">
          <Space size="small">
            <Tooltip title="Contactar por WhatsApp">
              <Button
                type="text"
                size="small"
                icon={<MessageCircle size={14} />}
                onClick={() => onAction('whatsapp')}
                className="visita-smart-card__action-btn"
              />
            </Tooltip>
            <Tooltip title="Ver ubicación">
              <Button
                type="text"
                size="small"
                icon={<MapPin size={14} />}
                onClick={() => onAction('location')}
                className="visita-smart-card__action-btn"
              />
            </Tooltip>
            <Tooltip title="Editar">
              <Button
                type="text"
                size="small"
                icon={<Edit2 size={14} />}
                onClick={() => onAction('edit')}
                className="visita-smart-card__action-btn"
              />
            </Tooltip>
            <Tooltip title="Cancelar">
              <Button
                type="text"
                size="small"
                danger
                icon={<X size={14} />}
                onClick={() => onAction('cancel')}
                className="visita-smart-card__action-btn"
              />
            </Tooltip>
          </Space>
        </div>
      )}
    </div>
  );
};

export default VisitaSmartCard;
