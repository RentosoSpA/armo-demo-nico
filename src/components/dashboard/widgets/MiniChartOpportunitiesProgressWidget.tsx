import React from 'react';
import '../../../styles/components/_mini-chart-widget.scss';

interface MiniChartWidgetProps {
  data?: any;
  loading?: boolean;
  widget?: any;
  config?: any;
}

const MiniChartOpportunitiesProgressWidget: React.FC<MiniChartWidgetProps> = () => {
  const stages = [
    { name: 'Contacto Inicial', value: 28, total: 67, color: '#3B82F6' },
    { name: 'Calificación', value: 19, total: 67, color: '#34F5C5' },
    { name: 'Propuesta', value: 12, total: 67, color: '#FACC15' },
    { name: 'Cierre', value: 8, total: 67, color: '#FF4080' }
  ];

  return (
    <div className="mini-chart-widget">
      <div className="mini-chart-widget__header">
        <h3 className="mini-chart-widget__title">Progreso de Oportunidades</h3>
      </div>
      <div className="mini-chart-widget__content mini-chart-widget__content--progress">
        <div className="progress-bars">
          {stages.map((stage, index) => {
            const percentage = (stage.value / stage.total) * 100;
            return (
              <div key={index} className="progress-bar-item">
                <div className="progress-bar-header">
                  <span className="progress-bar-label">{stage.name}</span>
                  <span className="progress-bar-value">{stage.value}</span>
                </div>
                <div className="progress-bar-track">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: stage.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MiniChartOpportunitiesProgressWidget;
