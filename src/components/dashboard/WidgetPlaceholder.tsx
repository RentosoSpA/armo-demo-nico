import React from 'react';
import type { Widget } from '../../types/dashboard-layout';

interface WidgetPlaceholderProps {
  widget: Widget;
}

const WidgetPlaceholder: React.FC<WidgetPlaceholderProps> = ({ widget }) => {
  return (
    <div className="widget-placeholder">
      <div className="placeholder-content">
        <h3>{widget.title}</h3>
        <p>Widget tipo: {widget.type}</p>
      </div>
    </div>
  );
};

export default WidgetPlaceholder;
