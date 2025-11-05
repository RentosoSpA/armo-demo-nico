import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface OsoCuidadosoTooltipProps {
  mensaje: string;
  tipo: 'motivacion' | 'alerta' | 'consejo' | 'celebracion';
  visible: boolean;
  onClose?: () => void;
  position?: 'top' | 'bottom' | 'left' | 'right';
  autoDismiss?: boolean;
}

const OsoCuidadosoTooltip: React.FC<OsoCuidadosoTooltipProps> = ({
  mensaje,
  tipo,
  visible,
  onClose,
  position = 'top',
  autoDismiss = true,
}) => {
  useEffect(() => {
    if (visible && autoDismiss && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, autoDismiss, onClose]);

  if (!visible) return null;

  const getIcon = () => {
    switch (tipo) {
      case 'motivacion':
        return '🎯';
      case 'alerta':
        return '🧾';
      case 'celebracion':
        return '🍯';
      case 'consejo':
        return '💡';
      default:
        return '🐻';
    }
  };

  return (
    <div className={`oso-tooltip oso-tooltip--${position} oso-tooltip--${tipo}`}>
      <div className="oso-tooltip-content">
        <span className="oso-tooltip-icon">{getIcon()}</span>
        <p className="oso-tooltip-message">{mensaje}</p>
        {onClose && (
          <button className="oso-tooltip-close" onClick={onClose}>
            <X size={16} />
          </button>
        )}
      </div>
      <div className="oso-tooltip-arrow" />
    </div>
  );
};

export default OsoCuidadosoTooltip;
