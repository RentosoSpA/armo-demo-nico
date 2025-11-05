import React from 'react';
import '../../styles/bear-stats.scss';

type Bear = 'curioso' | 'cauteloso' | 'notarioso' | 'cuidadoso' | 'armonioso';

interface BearStatCardProps {
  bear: Bear;
  caption: string;
  value: number | string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
}

const BearStatCard: React.FC<BearStatCardProps> = ({
  bear,
  caption,
  value,
  label,
  icon,
  onClick,
  loading = false
}) => {
  const bearColors = {
    curioso: 'var(--color-bear-curioso)',
    cauteloso: 'var(--color-bear-cauteloso)',
    notarioso: 'var(--color-bear-notarioso)',
    cuidadoso: 'var(--color-bear-cuidadoso)',
    armonioso: 'var(--color-primary)',
  };

  return (
    <div 
      className={`bear-stat-card ${bear} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      style={{ '--bear-color': bearColors[bear] } as React.CSSProperties}
    >
      <div className="bear-stat-icon">
        {icon || <span>🐻</span>}
      </div>
      
      <div className="bear-stat-content">
        <div className="bear-stat-caption">{caption}</div>
        <div className="bear-stat-value">
          {loading ? '...' : value}
        </div>
        <div className="bear-stat-label">{label}</div>
      </div>
    </div>
  );
};

// Export with alias to avoid confusion with potential "BeardStatCard" typos
export { BearStatCard as BeardStatCard };
export default BearStatCard;