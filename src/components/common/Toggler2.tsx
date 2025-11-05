import React from 'react';
import Toggler3 from './Toggler3';
import './Toggler2.scss';

interface PerformanceGridProps {
  id: string;
  activeView: string;
  filters: string[];
  setActiveView: (view: string) => void;
}

const PerformanceGrid: React.FC<PerformanceGridProps> = ({
  id,
  activeView,
  filters,
  setActiveView,
}) => {
  return (
    <div className="performance-grid-container">
      <Toggler3
        id={id}
        activeFilter={activeView}
        filters={filters}
        onFilterChange={setActiveView}
      />
    </div>
  );
};

export default PerformanceGrid;
