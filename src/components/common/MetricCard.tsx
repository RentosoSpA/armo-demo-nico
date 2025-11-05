import React from 'react';
import DashboardStatCard from './DashboardStatCard';

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, className = '' }) => {
  return (
    <DashboardStatCard
      title={title}
      value={value.toString()}
      icon={icon}
      className={className}
    />
  );
};

export default MetricCard;