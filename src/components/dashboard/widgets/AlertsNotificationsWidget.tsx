import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import '../../../styles/components/_info-widgets.scss';

interface InfoWidgetProps {
  data?: any;
  loading?: boolean;
  widget?: any;
  config?: any;
}

const AlertsNotificationsWidget: React.FC<InfoWidgetProps> = () => {
  const alerts = [
    { 
      type: 'error', 
      title: 'Contrato por vencer', 
      message: 'Propiedad ID-234 vence en 3 días',
      time: 'Hace 2 horas'
    },
    { 
      type: 'warning', 
      title: 'Visita pendiente confirmación', 
      message: 'Cliente María González esperando respuesta',
      time: 'Hace 5 horas'
    },
    { 
      type: 'success', 
      title: 'Propiedad vendida', 
      message: 'Casa en Las Condes cerrada exitosamente',
      time: 'Hace 1 día'
    },
    { 
      type: 'info', 
      title: 'Nuevo prospecto asignado', 
      message: 'Juan Pérez interesado en departamento',
      time: 'Hace 2 días'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'success':
        return <CheckCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className="info-widget">
      <div className="info-widget__header">
        <h3 className="info-widget__title">Alertas y Notificaciones</h3>
        <div className="info-widget__subtitle">{alerts.length} notificaciones</div>
      </div>
      <div className="info-widget__content">
        <div className="alerts-list">
          {alerts.map((alert, index) => (
            <div key={index} className={`alert-item alert-item--${alert.type}`}>
              <div className="alert-item__icon">
                {getIcon(alert.type)}
              </div>
              <div className="alert-item__content">
                <div className="alert-item__title">{alert.title}</div>
                <div className="alert-item__message">{alert.message}</div>
                <div className="alert-item__time">{alert.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertsNotificationsWidget;
