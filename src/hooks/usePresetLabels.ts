import { usePresetStore } from '../store/presetStore';
import { COWORKING_MENU_LABELS } from '../presets/coworking/config/menuLabels';

/**
 * Hook para obtener labels dinámicos según el preset activo
 */
export const usePresetLabels = () => {
  const { activePreset } = usePresetStore();

  const getLabel = (inmobiliariaLabel: string): string => {
    if (activePreset === 'coworking') {
      return COWORKING_MENU_LABELS[inmobiliariaLabel as keyof typeof COWORKING_MENU_LABELS] || inmobiliariaLabel;
    }
    return inmobiliariaLabel;
  };

  return {
    getLabel,
    isCoworking: activePreset === 'coworking',
    activePreset
  };
};
