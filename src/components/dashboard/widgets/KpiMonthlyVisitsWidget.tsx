import React from 'react';
import { Eye } from 'lucide-react';
import '../../../styles/components/_mini-kpi-widget.scss';

interface KpiWidgetProps {
  data?: any;
  loading?: boolean;
  widget?: any;
  config?: any;
}

const KpiMonthlyVisitsWidget: React.FC<KpiWidgetProps> = ({ data }) => {
  const monthlyVisits = data?.visitas?.totalMes || 89;

  return (
    <div className="mini-kpi-widget -grad-pink">
      <div className="mini-kpi-widget__icon">
        <Eye size={32} />
      </div>
      <div className="mini-kpi-widget__content">
        <div className="mini-kpi-widget__value">{monthlyVisits}</div>
        <div className="mini-kpi-widget__label">Visitas del Mes</div>
      </div>
    </div>
  );
};

export default KpiMonthlyVisitsWidget;
