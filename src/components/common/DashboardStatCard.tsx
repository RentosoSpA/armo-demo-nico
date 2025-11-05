import type { ReactNode } from 'react';
import InfoModal from './InfoModal';

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  className?: string;
  loading?: boolean;
  showNotification?: boolean;
  onClick?: () => void;
  hoverMessage?: string;
  subtitle?: string;
}

const DashboardStatCard = ({ title, value, icon, className = '', loading, showNotification = false, onClick, hoverMessage, subtitle }: DashboardStatCardProps) => {
  if (loading) {
    return (
      <div className={`dashboard-stat-card ${className}`}>
        <div className="stat-icon">
          <span>⏳</span>
        </div>
        <div className="stat-content">
          <div className="stat-value">...</div>
          <div className="stat-title">Cargando...</div>
        </div>
      </div>
    );
  }

  console.log('DashboardStatCard showNotification:', showNotification);

  const cardContent = (
    <div
      className={`dashboard-stat-card ${className} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      {showNotification && (
        <div className="notification-circle"></div>
      )}
      <div className="stat-icon">
        {icon}
      </div>
      <div className="stat-content">
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
      </div>
    </div>
  );

  return hoverMessage ? (
    <InfoModal message={hoverMessage} disabled={!onClick}>
      {cardContent}
    </InfoModal>
  ) : cardContent;
};

export default DashboardStatCard;