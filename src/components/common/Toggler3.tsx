import React from 'react';
import { Tabs } from 'antd';
import './Toggler3.scss';

interface Toggler3Props {
  id: string;
  activeFilter: string;
  filters: string[];
  onFilterChange: (filter: string) => void;
}

const Toggler3: React.FC<Toggler3Props> = ({ id, activeFilter, filters, onFilterChange }) => {
  return (
    <Tabs
      id={id}
      defaultActiveKey={activeFilter}
      onChange={onFilterChange}
      items={filters.map(filter => ({
        key: filter,
        label: filter.charAt(0).toUpperCase() + filter.slice(1),
      }))}
      className="toggler3-tabs"
    />
  );
};

export default Toggler3;
