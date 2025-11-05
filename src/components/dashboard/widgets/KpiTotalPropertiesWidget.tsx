import React from 'react';
import { Home } from 'lucide-react';
import '../../../styles/components/_mini-kpi-widget.scss';

interface KpiWidgetProps {
  data?: any;
  loading?: boolean;
  widget?: any;
  config?: any;
}

const KpiTotalPropertiesWidget: React.FC<KpiWidgetProps> = ({ data }) => {
  const total = data?.propiedades?.total || 156;

  return (
    <div className="mini-kpi-widget -grad-blue">
      <div className="mini-kpi-widget__icon">
        <Home size={32} />
      </div>
      <div className="mini-kpi-widget__content">
        <div className="mini-kpi-widget__value">{total}</div>
        <div className="mini-kpi-widget__label">Total Propiedades</div>
      </div>
    </div>
  );
};

export default KpiTotalPropertiesWidget;
