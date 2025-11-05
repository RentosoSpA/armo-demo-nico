import React from 'react';
import { Button, App } from 'antd';
import { Plus, Eye, EyeOff } from 'lucide-react';
import { useDashboardLayoutStore } from '../../store/dashboardLayoutStore';
import { getAllWidgets, getWidgetsByCategory } from '../../config/widgetRegistry';
import type { WidgetDefinition } from '../../types/dashboard-layout';

const WidgetSelector: React.FC = () => {
  const { message } = App.useApp();
  const { widgets, addWidget, toggleWidgetVisibility } = useDashboardLayoutStore();

  const categories = [
    { id: 'metrics', label: 'Métricas' },
    { id: 'charts', label: 'Gráficos' },
    { id: 'activity', label: 'Actividad' },
    { id: 'info', label: 'Información' }
  ] as const;

  const isWidgetActive = (type: string) => {
    return widgets.some(w => w.type === type && w.visible);
  };

  const getWidgetId = (type: string) => {
    return widgets.find(w => w.type === type)?.id;
  };

  const handleAddWidget = (definition: WidgetDefinition) => {
    console.log('🎯 Intentando añadir widget:', definition.type);
    
    // Verificar si ya existe
    const existingWidget = widgets.find(w => w.type === definition.type);
    
    if (existingWidget) {
      if (existingWidget.visible) {
        message.info(`El widget "${definition.defaultTitle}" ya está visible en el dashboard`);
        return;
      } else {
        // Si existe pero está oculto, hacerlo visible
        console.log('👁️ Widget ya existe pero está oculto, haciéndolo visible');
        toggleWidgetVisibility(existingWidget.id);
        message.success(`Widget "${definition.defaultTitle}" ahora es visible`);
        return;
      }
    }
    
    // Si no existe, añadirlo
    const widgetId = addWidget({
      type: definition.type,
      title: definition.defaultTitle,
      size: definition.defaultSize,
      visible: true
    });
    
    console.log('✅ Widget añadido con ID:', widgetId);
    message.success(`Widget "${definition.defaultTitle}" añadido al dashboard`);
  };

  const handleToggleVisibility = (type: string) => {
    const widgetId = getWidgetId(type);
    if (widgetId) {
      const widget = widgets.find(w => w.id === widgetId);
      const willBeVisible = !widget?.visible;
      
      console.log('👁️ Cambiando visibilidad de widget:', type, willBeVisible);
      toggleWidgetVisibility(widgetId);
      
      message.success(
        willBeVisible 
          ? `Widget visible en el dashboard` 
          : `Widget ocultado del dashboard`
      );
    }
  };

  return (
    <div className="widget-selector">
      {categories.map(category => {
        const categoryWidgets = getWidgetsByCategory(category.id);
        
        return (
          <div key={category.id} className="widget-category">
            <h3 className="category-title">{category.label}</h3>
            <div className="widget-list">
              {categoryWidgets.map(widget => {
                const isActive = isWidgetActive(widget.type);
                
                return (
                  <div key={widget.type} className="widget-item">
                    <div className="widget-info">
                      <span className="widget-name">{widget.defaultTitle}</span>
                      <span className="widget-description">{widget.description}</span>
                    </div>
                    <div className="widget-actions">
                      {isActive ? (
                        <Button
                          type="text"
                          size="small"
                          onClick={() => handleToggleVisibility(widget.type)}
                          icon={<EyeOff size={16} />}
                        />
                      ) : (
                        <Button
                          type="text"
                          size="small"
                          onClick={() => handleAddWidget(widget)}
                          icon={<Plus size={16} />}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WidgetSelector;
