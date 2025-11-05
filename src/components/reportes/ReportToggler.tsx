import React from 'react';
import { Tabs } from 'antd';

interface ReportTogglerProps {
  id: string;
  activeFilter: string;
  filters: string[];
  onFilterChange: (filter: string) => void;
}

const ReportToggler: React.FC<ReportTogglerProps> = ({
  id,
  activeFilter,
  filters,
  onFilterChange,
}) => {
  return (
    <Tabs
      id={id}
      defaultActiveKey={activeFilter}
      onChange={onFilterChange}
      items={filters.map(filter => ({
        key: filter,
        label: filter.charAt(0).toUpperCase() + filter.slice(1),
      }))}
      style={{ userSelect: 'none' }}
    />
  );
};

export default ReportToggler;
