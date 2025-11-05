import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import '../../../styles/components/_info-widgets.scss';

interface InfoWidgetProps {
  data?: any;
  loading?: boolean;
  widget?: any;
  config?: any;
}

const ExecutiveSummaryWidget: React.FC<InfoWidgetProps> = () => {
  const metrics = [
    { label: 'Ingresos Mensuales', value: '$325M', trend: 'up', change: '+12.5%' },
    { label: 'Propiedades Activas', value: '156', trend: 'up', change: '+8' },
    { label: 'Tasa de Conversión', value: '34.2%', trend: 'up', change: '+2.1%' },
    { label: 'Tiempo Promedio Cierre', value: '45 días', trend: 'down', change: '-3 días' },
    { label: 'Satisfacción Cliente', value: '4.8/5', trend: 'stable', change: '0%' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="trend-icon trend-up" />;
      case 'down':
        return <TrendingDown size={16} className="trend-icon trend-down" />;
      default:
        return <Minus size={16} className="trend-icon trend-stable" />;
    }
  };

  return (
    <div className="info-widget">
      <div className="info-widget__header">
        <h3 className="info-widget__title">Resumen Ejecutivo</h3>
        <div className="info-widget__subtitle">Métricas clave del negocio</div>
      </div>
      <div className="info-widget__content">
        <div className="executive-metrics">
          {metrics.map((metric, index) => (
            <div key={index} className="executive-metric">
              <div className="executive-metric__label">{metric.label}</div>
              <div className="executive-metric__value-row">
                <span className="executive-metric__value">{metric.value}</span>
                <span className={`executive-metric__change trend-${metric.trend}`}>
                  {getTrendIcon(metric.trend)}
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummaryWidget;
