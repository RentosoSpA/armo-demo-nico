/**
 * Servicio adaptador para espacios de coworking
 * Usa data mock cuando el preset es 'coworking'
 * Delega al servicio de propiedades cuando el preset es 'inmobiliaria'
 */

import { usePresetStore } from '../../store/presetStore';
import { ESPACIOS_MOCK } from '../../presets/coworking/mocks/espaciosMock';
import type { Espacio } from '../../presets/coworking/types/espacio';
import type { Propiedad } from '../../types/propiedad';
import * as PropiedadesService from '../propiedades/propiedadesServiceSupabase';

/**
 * Convierte un Espacio a Propiedad para compatibilidad con el sistema existente
 */
const espacioToPropiedad = (espacio: Espacio): Propiedad => {
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
 * Convierte un array de Espacios a Propiedades
 */
const espaciosToPropiedades = (espacios: Espacio[]): Propiedad[] => {
  return espacios.map(espacioToPropiedad);
};

/**
 * Obtiene los espacios/propiedades según el preset activo
 */
export const getEspacios = async (empresaId: string): Promise<Propiedad[]> => {
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    // Simular delay de red para mockup realista
    await new Promise(resolve => setTimeout(resolve, 500));
    return espaciosToPropiedades(ESPACIOS_MOCK);
  }
  
  // Modo inmobiliaria: usar servicio real
  return PropiedadesService.getPropiedades(empresaId);
};

/**
 * Obtiene un espacio/propiedad por ID
 */
export const getEspacioById = async (id: string): Promise<Propiedad> => {
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    await new Promise(resolve => setTimeout(resolve, 300));
    const espacio = ESPACIOS_MOCK.find(e => e.id === id);
    if (!espacio) throw new Error('Espacio no encontrado');
    return espacioToPropiedad(espacio);
  }
  
  return PropiedadesService.getPropiedadById(id);
};

/**
 * Crea un nuevo espacio/propiedad
 */
export const createEspacio = async (formData: any, empresaId: string): Promise<Propiedad> => {
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    // En modo demo, solo simular la creación
    await new Promise(resolve => setTimeout(resolve, 500));
    const nuevoEspacio: Espacio = {
      id: `esp-${Date.now()}`,
      ...formData,
      empresa_id: empresaId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return espacioToPropiedad(nuevoEspacio);
  }
  
  return PropiedadesService.createPropiedad(formData, empresaId);
};

/**
 * Actualiza un espacio/propiedad existente
 */
export const updateEspacio = async (id: string, formData: any, empresaId: string): Promise<Propiedad> => {
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    await new Promise(resolve => setTimeout(resolve, 500));
    const espacioExistente = ESPACIOS_MOCK.find(e => e.id === id);
    if (!espacioExistente) throw new Error('Espacio no encontrado');
    
    const espacioActualizado: Espacio = {
      ...espacioExistente,
      ...formData,
      updatedAt: new Date(),
    };
    return espacioToPropiedad(espacioActualizado);
  }
  
  return PropiedadesService.updatePropiedad(id, formData, empresaId);
};

/**
 * Actualiza el estado de un espacio/propiedad
 */
export const updateEspacioEstado = async (id: string, estado: string): Promise<Propiedad> => {
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    await new Promise(resolve => setTimeout(resolve, 300));
    const espacioExistente = ESPACIOS_MOCK.find(e => e.id === id);
    if (!espacioExistente) throw new Error('Espacio no encontrado');
    
    const espacioActualizado: Espacio = {
      ...espacioExistente,
      estado: estado as any,
      updatedAt: new Date(),
    };
    return espacioToPropiedad(espacioActualizado);
  }
  
  return PropiedadesService.updatePropiedadEstado(id, estado);
};

/**
 * Elimina un espacio/propiedad
 */
export const deleteEspacio = async (id: string): Promise<void> => {
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    await new Promise(resolve => setTimeout(resolve, 300));
    // En modo demo, solo simular la eliminación
    return;
  }
  
  return PropiedadesService.deletePropiedad(id);
};
