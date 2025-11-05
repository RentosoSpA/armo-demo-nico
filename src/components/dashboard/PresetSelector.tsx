import React from 'react';
import { Button } from 'antd';
import { LayoutTemplate, Briefcase, TrendingUp, Grid3x3 } from 'lucide-react';
import { useDashboardLayoutStore } from '../../store/dashboardLayoutStore';
import { PRESET_LAYOUTS } from '../../config/defaultDashboardLayout';
import type { PresetLayout } from '../../types/dashboard-layout';

const PresetSelector: React.FC = () => {
  const { reorderWidgets } = useDashboardLayoutStore();

  const presets = [
    {
      id: 'ejecutivo' as PresetLayout,
      name: 'Vista Ejecutiva',
      description: 'Métricas clave y resumen ejecutivo',
      icon: Briefcase
    },
    {
      id: 'operaciones' as PresetLayout,
      name: 'Vista Operaciones',
      description: 'Enfoque en propiedades y visitas',
      icon: LayoutTemplate
    },
    {
      id: 'ventas' as PresetLayout,
      name: 'Vista Ventas',
      description: 'Oportunidades y conversión',
      icon: TrendingUp
    },
    {
      id: 'completo' as PresetLayout,
      name: 'Vista Completa',
      description: 'Todos los widgets disponibles',
      icon: Grid3x3
    }
  ];

  const handleApplyPreset = (presetId: PresetLayout) => {
    const presetWidgets = PRESET_LAYOUTS[presetId];
    
    // Convert preset widgets to full widgets with IDs
    const newWidgets = presetWidgets.map((preset, index) => ({
      id: `widget-${Date.now()}-${index}`,
      type: preset.type,
      title: preset.title,
      size: preset.size,
      position: index,
      visible: preset.visible
    }));

    reorderWidgets(newWidgets);
  };

  return (
    <div className="preset-selector">
      <div className="preset-info">
        <p>
          Aplica un layout predefinido optimizado para diferentes roles y necesidades.
        </p>
      </div>

      <div className="preset-list">
        {presets.map(preset => {
          const Icon = preset.icon;
          
          return (
            <div key={preset.id} className="preset-card">
              <div className="preset-icon">
                <Icon size={24} />
              </div>
              <div className="preset-content">
                <h4>{preset.name}</h4>
                <p>{preset.description}</p>
              </div>
              <Button
                type="default"
                size="small"
                onClick={() => handleApplyPreset(preset.id)}
              >
                Aplicar
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PresetSelector;
