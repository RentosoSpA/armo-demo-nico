import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { KPI } from '../../types/finanzas';

interface KPICardProps {
  kpi: KPI;
  osoTooltip?: string;
  index: number; // Para asignar colores diferentes
}

const KPICard: React.FC<KPICardProps> = ({ kpi, osoTooltip, index }) => {
  console.log('🐻 KPICard: Props recibidas:', { kpi, index });
  const getTrendIcon = () => {
    switch (kpi.trend) {
      case 'up':
        return <TrendingUp size={16} className="trend-icon trend-up" />;
      case 'down':
        return <TrendingDown size={16} className="trend-icon trend-down" />;
      default:
        return <Minus size={16} className="trend-icon trend-neutral" />;
    }
  };

  // Colores vibrantes como en el tablero
  const getCardClass = () => {
    const colors = ['kpi-card-green', 'kpi-card-purple', 'kpi-card-pink', 'kpi-card-orange'];
    return `kpi-card ${colors[index % colors.length]}`;
  };

  return (
    <div className={getCardClass()} title={osoTooltip}>
      <div className="kpi-icon-circle">
        <span className="kpi-icon">{kpi.icon}</span>
      </div>
      <div className="kpi-content">
        <div className="kpi-value">{kpi.value}</div>
        <div className="kpi-label">{kpi.label}</div>
        <div className="kpi-trend">
          {getTrendIcon()}
          <span className="kpi-trend-value">{kpi.trendValue}</span>
        </div>
      </div>
    </div>
  );
};

export default KPICard;
