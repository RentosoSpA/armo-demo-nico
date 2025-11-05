import React from 'react';
import { Building2 } from 'lucide-react';
import '../../../styles/components/_mini-kpi-widget.scss';

interface KpiWidgetProps {
  data?: any;
  loading?: boolean;
  widget?: any;
  config?: any;
}

const KpiCompaniesWidget: React.FC<KpiWidgetProps> = () => {
  const totalCompanies = 12;

  return (
    <div className="mini-kpi-widget -grad-amber">
      <div className="mini-kpi-widget__icon">
        <Building2 size={32} />
      </div>
      <div className="mini-kpi-widget__content">
        <div className="mini-kpi-widget__value">{totalCompanies}</div>
        <div className="mini-kpi-widget__label">Empresas Registradas</div>
      </div>
    </div>
  );
};

export default KpiCompaniesWidget;
