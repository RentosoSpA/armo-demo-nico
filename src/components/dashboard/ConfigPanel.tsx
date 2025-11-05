import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, App, Tooltip } from 'antd';
import { X, Save, RotateCcw, Settings } from 'lucide-react';
import WidgetSelector from './WidgetSelector';
import LayoutControls from './LayoutControls';
import PresetSelector from './PresetSelector';
import '../../styles/components/_config-panel.scss';

interface ConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onReset: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
}

type TabType = 'widgets' | 'layout' | 'presets';

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  isOpen,
  onClose,
  onSave,
  onReset,
  hasUnsavedChanges,
  isSaving
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('widgets');

  if (!isOpen) return null;

  return createPortal(
    <App>
      <div className="config-panel-overlay" onClick={onClose} />
      <div className="config-panel">
        <div className="config-panel-header">
          <div className="header-title">
            <Settings size={20} />
            <h2>Configurar Dashboard</h2>
          </div>
          <Button
            type="text"
            size="small"
            onClick={onClose}
            icon={<X size={20} />}
          />
        </div>

        <div className="config-panel-tabs">
          <button
            className={`tab-button ${activeTab === 'widgets' ? 'active' : ''}`}
            onClick={() => setActiveTab('widgets')}
          >
            Widgets
          </button>
          <button
            className={`tab-button ${activeTab === 'layout' ? 'active' : ''}`}
            onClick={() => setActiveTab('layout')}
          >
            Diseño
          </button>
          <button
            className={`tab-button ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => setActiveTab('presets')}
          >
            Presets
          </button>
        </div>

        <div className="config-panel-content">
          {activeTab === 'widgets' && <WidgetSelector />}
          {activeTab === 'layout' && <LayoutControls />}
          {activeTab === 'presets' && <PresetSelector />}
        </div>

        <div className="config-panel-footer">
          <Tooltip title="Restaurar configuración predeterminada del dashboard">
            <Button
              type="default"
              danger
              onClick={onReset}
              disabled={isSaving}
              icon={<RotateCcw size={16} />}
            >
              Resetear
            </Button>
          </Tooltip>
          <Tooltip title={!hasUnsavedChanges ? 'No hay cambios para guardar' : 'Guardar cambios en el dashboard'}>
            <Button
              type="primary"
              onClick={onSave}
              disabled={!hasUnsavedChanges || isSaving}
              loading={isSaving}
              icon={<Save size={16} />}
            >
              {isSaving ? 'Guardando...' : 'Guardar'}
            </Button>
          </Tooltip>
        </div>
      </div>
    </App>,
    document.body
  );
};

export default ConfigPanel;
