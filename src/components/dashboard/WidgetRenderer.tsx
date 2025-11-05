import React from 'react';
import type { Widget } from '../../types/dashboard-layout';
import { getWidgetDefinition } from '../../config/widgetRegistry';
import WidgetPlaceholder from './WidgetPlaceholder';

interface WidgetRendererProps {
  widget: Widget;
  data?: any;
  loading?: boolean;
}

const WidgetRenderer: React.FC<WidgetRendererProps> = ({ 
  widget, 
  data,
  loading = false 
}) => {
  const definition = getWidgetDefinition(widget.type);
  
  if (!definition) {
    return <WidgetPlaceholder widget={widget} />;
  }

  const WidgetComponent = definition.component;

  return (
    <div className="widget-container">
      <WidgetComponent 
        widget={widget}
        data={data}
        loading={loading}
        config={widget.config}
      />
    </div>
  );
};

export default WidgetRenderer;
