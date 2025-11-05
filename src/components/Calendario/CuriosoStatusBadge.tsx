import React from 'react';
import { Tooltip } from 'antd';

export type CuriosoStatus = 'activo' | 'esperando' | 'analizando' | 'inactivo';

interface CuriosoStatusBadgeProps {
  status: CuriosoStatus;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const getStatusConfig = (status: CuriosoStatus) => {
  const configs = {
    activo: {
      color: '#10B981',
      label: 'Activo',
      icon: '🟢',
      tooltip: 'CuriOso está agendando visitas activamente',
      isPulsing: true,
    },
    esperando: {
      color: '#F59E0B',
      label: 'Esperando',
      icon: '🟡',
      tooltip: 'CuriOso está esperando respuestas de prospectos',
      isPulsing: false,
    },
    analizando: {
      color: '#3B82F6',
      label: 'Analizando',
      icon: '🔵',
      tooltip: 'CuriOso está procesando información',
      isPulsing: true,
    },
    inactivo: {
      color: '#6B7280',
      label: 'Inactivo',
      icon: '⚪',
      tooltip: 'CuriOso no tiene actividad reciente',
      isPulsing: false,
    },
  };
  return configs[status];
};

const CuriosoStatusBadge: React.FC<CuriosoStatusBadgeProps> = ({
  status,
  showLabel = true,
  size = 'medium',
}) => {
  const config = getStatusConfig(status);

  const badge = (
    <div className={`curioso-status-badge curioso-status-badge--${size} ${config.isPulsing ? 'curioso-status-badge--pulsing' : ''}`}>
      <span 
        className="curioso-status-badge__bear"
        role="img" 
        aria-label="CuriOso"
      >
        🐻‍❄️
      </span>
      
      <span 
        className="curioso-status-badge__dot"
        style={{ backgroundColor: config.color }}
      >
        {config.isPulsing && (
          <span 
            className="curioso-status-badge__pulse"
            style={{ borderColor: config.color }}
          />
        )}
      </span>

      {showLabel && (
        <span className="curioso-status-badge__label">
          {config.label}
        </span>
      )}
    </div>
  );

  return (
    <Tooltip title={config.tooltip} placement="bottom">
      {badge}
    </Tooltip>
  );
};

export default CuriosoStatusBadge;
