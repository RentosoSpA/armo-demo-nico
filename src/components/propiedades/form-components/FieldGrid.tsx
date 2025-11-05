import React from 'react';
import '../../../styles/components/_field-grid.scss';

interface FieldGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2;
}

export const FieldGrid: React.FC<FieldGridProps> = ({
  children,
  className = '',
  columns = 2,
}) => {
  return (
    <div className={`field-grid field-grid--cols-${columns} ${className}`}>
      {children}
    </div>
  );
};
