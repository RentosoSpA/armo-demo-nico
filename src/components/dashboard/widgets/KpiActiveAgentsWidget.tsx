import React from 'react';
import { Users } from 'lucide-react';
import '../../../styles/components/_mini-kpi-widget.scss';

interface KpiWidgetProps {
  data?: any;
  loading?: boolean;
  widget?: any;
  config?: any;
}

const KpiActiveAgentsWidget: React.FC<KpiWidgetProps> = () => {
  const activeAgents = 24;

  return (
    <div className="mini-kpi-widget -grad-green">
      <div className="mini-kpi-widget__icon">
        <Users size={32} />
      </div>
      <div className="mini-kpi-widget__content">
        <div className="mini-kpi-widget__value">{activeAgents}</div>
        <div className="mini-kpi-widget__label">Agentes Activos</div>
      </div>
    </div>
  );
};

export default KpiActiveAgentsWidget;
