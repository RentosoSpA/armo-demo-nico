/**
 * Servicio adaptador para membresías/contratos
 * Retorna datos de membresías cuando preset es 'coworking'
 * Delega al servicio de contratos cuando preset es 'inmobiliaria'
 */

import { usePresetStore } from '../../store/presetStore';
import { MEMBRESIAS_MOCK } from '../../presets/coworking/mocks/membresiasMock';
import type { Membresia } from '../../presets/coworking/types/membresia';
import type { Contrato } from '../../lib/contratos-mock';

/**
 * Convierte una Membresía a Contrato para compatibilidad
 */
const membresiaToContrato = (membresia: Membresia): Contrato => {
  return {
    id: membresia.id,
    titulo: membresia.nombre_plan,
    estado: membresia.estado === 'activa' ? 'firmado' : 'anulado',
    propiedadId: membresia.espacio_id || '',
    prospectoId: membresia.miembro_id || '',
    plantillaId: 'plantilla-membresia',
    html: `<h1>Membresía ${membresia.nombre_plan}</h1>`,
    empresa_id: membresia.empresa_id,
    createdAt: membresia.createdAt,
    updatedAt: membresia.updatedAt,
  } as any;
};

/**
 * Obtiene membresías/contratos según el preset activo
 */
export const getMembresias = async (): Promise<Contrato[]> => {
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 400));
    return MEMBRESIAS_MOCK.map(membresiaToContrato);
  }
  
  // Modo inmobiliaria: importar dinámicamente para evitar dependencias circulares
  const { listContratosByProp } = await import('../mock/contratosNewServiceMock');
  return listContratosByProp('all');
};
