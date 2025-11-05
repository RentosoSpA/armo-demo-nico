import React from 'react';
import type { OsoStatus } from '../../services/mock/brigada';

interface StatusPillProps {
  status: OsoStatus;
  className?: string;
}

const StatusPill: React.FC<StatusPillProps> = ({ status, className = '' }) => {
  return (
    <span className={`status-pill status-pill--${status} ${className}`}>
      {status}
    </span>
  );
};

export default StatusPill;