/**
 * Servicio adaptador para plantillas
 * Retorna plantillas de coworking cuando preset = 'coworking'
 * Delega al servicio de plantillas cuando preset = 'inmobiliaria'
 */

import { usePresetStore } from '../../store/presetStore';
import { PLANTILLAS_COWORK_MOCK } from '../../presets/coworking/mocks/plantillasMock';
import { listPlantillas } from '../mock/contratosNewServiceMock';

export const getPlantillas = async () => {
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    return PLANTILLAS_COWORK_MOCK;
  }
  
  // Modo inmobiliaria
  return listPlantillas();
};
