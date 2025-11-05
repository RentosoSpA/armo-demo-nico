import React from 'react';
import { Target } from 'lucide-react';
import '../../../styles/components/_mini-kpi-widget.scss';

interface KpiWidgetProps {
  data?: any;
  loading?: boolean;
  widget?: any;
  config?: any;
}

const KpiConversionRateWidget: React.FC<KpiWidgetProps> = () => {
  const conversionRate = 34.2;

  return (
    <div className="mini-kpi-widget -grad-purple">
      <div className="mini-kpi-widget__icon">
        <Target size={32} />
      </div>
      <div className="mini-kpi-widget__content">
        <div className="mini-kpi-widget__value">{conversionRate}%</div>
        <div className="mini-kpi-widget__label">Tasa de Conversión</div>
      </div>
    </div>
  );
};

export default KpiConversionRateWidget;
