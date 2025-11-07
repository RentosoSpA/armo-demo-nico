import React from 'react';
import { Button, Dropdown } from 'antd';
import { Building2, Users, CheckCircle } from 'lucide-react';
import { usePresetStore } from '../../store/presetStore';
import type { PresetType } from '../../store/presetStore';
import type { MenuProps } from 'antd';

const PresetSelector: React.FC = () => {
  const { activePreset, setPreset } = usePresetStore();

  const presets: Array<{ key: PresetType; label: string; icon: React.ReactNode; description: string }> = [
    {
      key: 'inmobiliaria',
      label: 'Inmobiliaria',
      icon: <Building2 size={18} />,
      description: 'CRM para propiedades inmobiliarias'
    },
    {
      key: 'coworking',
      label: 'Coworking',
      icon: <Users size={18} />,
      description: 'CRM para espacios de coworking'
    }
  ];

  const items: MenuProps['items'] = presets.map(preset => ({
    key: preset.key,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          {preset.icon}
          <div>
            <div style={{ fontWeight: activePreset === preset.key ? 600 : 400 }}>
              {preset.label}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--fg-muted)', marginTop: '2px' }}>
              {preset.description}
            </div>
          </div>
        </div>
        {activePreset === preset.key && (
          <CheckCircle size={16} style={{ color: 'var(--brand)' }} />
        )}
      </div>
    ),
    onClick: () => {
      setPreset(preset.key);
      window.location.reload(); // Recargar para aplicar cambios
    }
  }));

  const currentPreset = presets.find(p => p.key === activePreset);

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Button 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(var(--glass-bg))',
          border: '1px solid rgba(var(--glass-border))',
          color: 'rgba(var(--fg))',
        }}
      >
        {currentPreset?.icon}
        <span>{currentPreset?.label}</span>
      </Button>
    </Dropdown>
  );
};

export default PresetSelector;
