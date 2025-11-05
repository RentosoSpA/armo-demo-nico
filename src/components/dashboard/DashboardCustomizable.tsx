import React, { useEffect, useState, useMemo } from 'react';
import { Button, App, Modal } from 'antd';
import { Settings, Save } from 'lucide-react';
import { useDashboardLayoutStore } from '../../store/dashboardLayoutStore';
import DroppableGrid from './DroppableGrid';
import WidgetRenderer from './WidgetRenderer';
import ConfigPanel from './ConfigPanel';
import { useUser } from '../../store/userStore';
import type { NewDashboardData } from '../../types/salud-data';
import '../../styles/components/_dashboard-customizable.scss';

interface DashboardCustomizableProps {
  data: NewDashboardData;
  loading?: boolean;
}

const DashboardCustomizable: React.FC<DashboardCustomizableProps> = ({ 
  data, 
  loading = false 
}) => {
  const { message } = App.useApp();
  const { userProfile } = useUser();
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  
  const {
    widgets,
    rows,
    isEditMode,
    gridColumns,
    compactMode,
    hasUnsavedChanges,
    isSaving,
    loadLayout,
    saveLayout,
    resetLayout,
    toggleEditMode,
    reorderWidgets,
    updateRows
  } = useDashboardLayoutStore();

  // Load layout on mount - GLOBAL para todos los usuarios
  useEffect(() => {
    console.log('🚀 [DashboardCustomizable] Cargando layout GLOBAL inicial');
    loadLayout();
  }, [loadLayout]);

  // Add/remove class to body when config panel opens/closes
  useEffect(() => {
    if (isConfigPanelOpen) {
      document.body.classList.add('config-panel-open');
    } else {
      document.body.classList.remove('config-panel-open');
    }
    
    return () => {
      document.body.classList.remove('config-panel-open');
    };
  }, [isConfigPanelOpen]);

  // Auto-save when leaving edit mode - GLOBAL para todos los usuarios
  useEffect(() => {
    if (!isEditMode && hasUnsavedChanges) {
      console.log('💾 [DashboardCustomizable] Auto-guardando layout GLOBAL al salir de modo edición', {
        hasUnsavedChanges,
        widgetCount: widgets.length,
        rowCount: rows.length
      });
      handleSave();
    }
  }, [isEditMode, hasUnsavedChanges]);

  const handleSave = async () => {
    console.log('💾 [DashboardCustomizable] Guardando layout GLOBAL manualmente', {
      widgetCount: widgets.length,
      rowCount: rows.length,
      gridColumns,
      compactMode
    });
    
    try {
      await saveLayout(true); // Force save - GLOBAL para todos
      message.success('Dashboard guardado exitosamente');
      console.log('✅ [DashboardCustomizable] Layout GLOBAL guardado correctamente');
    } catch (error) {
      message.error('Error al guardar el dashboard');
      console.error('❌ [DashboardCustomizable] Error saving dashboard:', error);
    }
  };

  const handleReset = async () => {
    Modal.confirm({
      title: '¿Resetear dashboard?',
      content: 'Esta acción restaurará el dashboard a su configuración predeterminada para TODOS los usuarios. Todos los cambios personalizados se perderán.',
      okText: 'Sí, resetear',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        console.log('🔄 [DashboardCustomizable] Reseteando layout GLOBAL a valores por defecto');
        
        try {
          await resetLayout();
          setIsConfigPanelOpen(false); // Cerrar panel después de resetear
          message.success('Dashboard restablecido a valores por defecto');
          console.log('✅ [DashboardCustomizable] Layout GLOBAL reseteado correctamente');
        } catch (error) {
          message.error('Error al restablecer el dashboard');
          console.error('❌ [DashboardCustomizable] Error resetting dashboard:', error);
        }
      }
    });
  };

  const handleToggleEdit = () => {
    console.log('🔧 [DashboardCustomizable] Cambiando modo edición', {
      currentMode: isEditMode ? 'edit' : 'view',
      nextMode: isEditMode ? 'view' : 'edit',
      hasUnsavedChanges
    });
    toggleEditMode();
    // NO guardar aquí - el useEffect se encargará del auto-save
  };

  const renderWidget = (widget: any) => {
    return (
      <WidgetRenderer 
        widget={widget} 
        data={data}
        loading={loading}
      />
    );
  };

  const handleRowChange = (newRows: any) => {
    updateRows(newRows);
  };

  return (
    <div className={`dashboard-customizable ${compactMode ? 'compact' : ''}`}>
      <div className="dashboard-toolbar">
        <div className="toolbar-left">
          {hasUnsavedChanges && (
            <span className="unsaved-indicator">
              Cambios sin guardar
            </span>
          )}
        </div>
        <div className="toolbar-right">
          <Button
            type={isEditMode ? 'primary' : 'default'}
            onClick={handleToggleEdit}
            icon={isEditMode ? <Save size={20} /> : <Settings size={20} />}
            loading={isSaving}
            shape="circle"
            size="large"
            title={isEditMode ? 'Finalizar Edición' : 'Personalizar Dashboard'}
            className="dashboard-settings-btn"
          />
          {isEditMode && (
            <Button
              type="default"
              onClick={() => setIsConfigPanelOpen(true)}
              icon={<Settings size={16} />}
            >
              Configurar
            </Button>
          )}
        </div>
      </div>

      <DroppableGrid
        widgets={widgets}
        rows={rows}
        isEditMode={isEditMode}
        onReorder={reorderWidgets}
        onRowChange={handleRowChange}
        renderWidget={renderWidget}
      />

      <ConfigPanel
        isOpen={isConfigPanelOpen}
        onClose={() => setIsConfigPanelOpen(false)}
        onSave={handleSave}
        onReset={handleReset}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
      />
    </div>
  );
};

export default DashboardCustomizable;
