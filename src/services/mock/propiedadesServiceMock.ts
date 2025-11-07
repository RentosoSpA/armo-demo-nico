import type { Propiedad, PropiedadCreate } from '../../types/propiedad';
import { MOCK_DATA, simulateDelay, generateId } from './mockData';
import { getPropertyImage } from './propertyImages';
import { usePresetStore } from '../../store/presetStore';
import { ESPACIOS_MOCK } from '../../presets/coworking/mocks/espaciosMock';
import type { Espacio } from '../../presets/coworking/types/espacio';

// Mock implementation of propiedades service
const mockPropiedades: Propiedad[] = MOCK_DATA.propiedades.map(p => ({
  ...p,
  tipo: p.tipo as string,
  estado: p.estado as string,
  divisa: p.divisa as string,
  operacion: p.operacion as string | string[]
}));

// Helper interno para resolver imágenes
const resolvePropertyImages = (propiedad: Propiedad): Propiedad => ({
  ...propiedad,
  imagenPrincipal: getPropertyImage(propiedad.imagenPrincipal) || propiedad.imagenPrincipal
});

// Convierte Espacio de coworking a Propiedad
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

export const getPropiedades = async (): Promise<Propiedad[]> => {
  await simulateDelay();
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    return ESPACIOS_MOCK.map(espacioToPropiedad);
  }
  
  return mockPropiedades.map(resolvePropertyImages);
};

export const getPropiedadById = async (id: string): Promise<Propiedad> => {
  await simulateDelay();
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    const espacio = ESPACIOS_MOCK.find(e => e.id === id);
    if (!espacio) {
      throw new Error(`Espacio with id ${id} not found`);
    }
    return espacioToPropiedad(espacio);
  }
  
  const propiedad = mockPropiedades.find(p => p.id === id);
  if (!propiedad) {
    throw new Error(`Propiedad with id ${id} not found`);
  }
  return resolvePropertyImages(propiedad);
};

export const getPropiedadesByEmpresa = async (_empresaId: string): Promise<Propiedad[]> => {
  await simulateDelay();
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    return ESPACIOS_MOCK.map(espacioToPropiedad);
  }
  
  return mockPropiedades.map(resolvePropertyImages);
};

export const createPropiedad = async (propiedad: PropiedadCreate): Promise<Propiedad> => {
  await simulateDelay();
  const newPropiedad: Propiedad = {
    ...propiedad,
    id: generateId(),
    tipo: propiedad.tipo as string,
    estado: propiedad.estado as string,
    divisa: propiedad.divisa as string,
    amenidades: propiedad.amenidades ? {
      ...propiedad.amenidades,
      id: generateId(),
      propiedadId: generateId(),
    } : undefined,
    propiedadArriendo: propiedad.propiedadArriendo ? {
      ...propiedad.propiedadArriendo,
      id: generateId(),
      propiedadId: generateId(),
    } : undefined,
    propiedadVenta: propiedad.propiedadVenta ? {
      ...propiedad.propiedadVenta,
      id: generateId(),
      propiedadId: generateId(),
    } : undefined,
  };
  mockPropiedades.push(newPropiedad);
  return resolvePropertyImages(newPropiedad);
};

export const updatePropiedad = async (id: string, updates: Partial<PropiedadCreate>): Promise<Propiedad> => {
  await simulateDelay();
  const index = mockPropiedades.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Propiedad with id ${id} not found`);
  }
  const updatedData: Propiedad = { 
    ...mockPropiedades[index], 
    ...updates,
    tipo: (updates.tipo as string) || mockPropiedades[index].tipo,
    estado: (updates.estado as string) || mockPropiedades[index].estado,
    divisa: (updates.divisa as string) || mockPropiedades[index].divisa,
    amenidades: updates.amenidades ? {
      ...updates.amenidades,
      id: mockPropiedades[index].amenidades?.id || generateId(),
      propiedadId: mockPropiedades[index].amenidades?.propiedadId || id,
    } : mockPropiedades[index].amenidades,
    propiedadArriendo: updates.propiedadArriendo ? {
      ...updates.propiedadArriendo,
      id: mockPropiedades[index].propiedadArriendo?.id || generateId(),
      propiedadId: mockPropiedades[index].propiedadArriendo?.propiedadId || id,
    } : mockPropiedades[index].propiedadArriendo,
    propiedadVenta: updates.propiedadVenta ? {
      ...updates.propiedadVenta,
      id: mockPropiedades[index].propiedadVenta?.id || generateId(),
      propiedadId: mockPropiedades[index].propiedadVenta?.propiedadId || id,
    } : mockPropiedades[index].propiedadVenta,
  };
  mockPropiedades[index] = updatedData;
  return resolvePropertyImages(mockPropiedades[index]);
};

export const deletePropiedad = async (id: string): Promise<void> => {
  await simulateDelay();
  const index = mockPropiedades.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Propiedad with id ${id} not found`);
  }
  mockPropiedades.splice(index, 1);
  console.log(`✅ Mock: Propiedad ${id} eliminada. Total propiedades: ${mockPropiedades.length}`);
};

export const updatePropiedadEstado = async (id: string, estado: string): Promise<Propiedad> => {
  await simulateDelay();
  const index = mockPropiedades.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Propiedad with id ${id} not found`);
  }
  mockPropiedades[index] = {
    ...mockPropiedades[index],
    estado: estado as string
  };
  console.log(`✅ Mock: Estado de propiedad ${id} actualizado a: ${estado}`);
  return resolvePropertyImages(mockPropiedades[index]);
};