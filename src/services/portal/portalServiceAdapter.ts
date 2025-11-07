/**
 * Servicio adaptador para portal público
 * Retorna espacios de coworking cuando preset es 'coworking'
 * Delega al servicio de propiedades cuando preset es 'inmobiliaria'
 */

import { usePresetStore } from '../../store/presetStore';
import { ESPACIOS_MOCK } from '../../presets/coworking/mocks/espaciosMock';
import type { Propiedad } from '../../types/propiedad';

/**
 * Convierte un Espacio a Propiedad para el portal
 */
const espacioToPropiedad = (espacio: any): Propiedad => {
  return {
    id: espacio.id,
    titulo: espacio.titulo,
    tipo: espacio.tipo,
    estado: espacio.estado,
    operacion: Array.isArray(espacio.modalidad) ? espacio.modalidad : [espacio.modalidad],
    precio: espacio.precio,
    divisa: espacio.divisa,
    descripcion: espacio.descripcion,
    habitaciones: espacio.capacidad,
    areaTotal: espacio.area_m2,
    piso: espacio.piso,
    direccion: espacio.ubicacion,
    imagenPrincipal: espacio.imagenPrincipal,
  } as Propiedad;
};

/**
 * Obtiene propiedades/espacios para el portal según el preset activo
 */
export const getPortalPropiedades = async (empresaId: string): Promise<Propiedad[]> => {
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 400));
    // Filtrar solo espacios disponibles para el portal
    return ESPACIOS_MOCK
      .filter(e => e.estado === 'Disponible')
      .map(espacioToPropiedad);
  }
  
  // Modo inmobiliaria: importar dinámicamente
  const { getPropiedades } = await import('../propiedades/propiedadesServiceSupabase');
  return getPropiedades(empresaId);
};
