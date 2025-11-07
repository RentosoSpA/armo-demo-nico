import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PresetType = 'inmobiliaria' | 'coworking';

interface PresetState {
  activePreset: PresetType;
  setPreset: (preset: PresetType) => void;
  getLabel: (defaultLabel: string, coworkingLabel?: string) => string;
}

export const usePresetStore = create<PresetState>()(
  persist(
    (set, get) => ({
      activePreset: 'inmobiliaria',
      
      setPreset: (preset: PresetType) => {
        set({ activePreset: preset });
      },
      
      getLabel: (defaultLabel: string, coworkingLabel?: string) => {
        const { activePreset } = get();
        if (activePreset === 'coworking' && coworkingLabel) {
          return coworkingLabel;
        }
        return defaultLabel;
      },
    }),
    {
      name: 'preset-storage',
    }
  )
);

// Hook para usar labels dinámicos según el preset activo
export const usePresetLabel = () => {
  const { getLabel, activePreset } = usePresetStore();
  
  return {
    getLabel,
    activePreset,
    isCoworking: activePreset === 'coworking',
  };
};
