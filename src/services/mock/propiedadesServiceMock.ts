import type { Propiedad, PropiedadCreate } from '../../types/propiedad';
import { MOCK_DATA, simulateDelay, generateId } from './mockData';
import { getPropertyImage } from './propertyImages';

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

export const getPropiedades = async (): Promise<Propiedad[]> => {
  await simulateDelay();
  return mockPropiedades.map(resolvePropertyImages);
};

export const getPropiedadById = async (id: string): Promise<Propiedad> => {
  await simulateDelay();
  const propiedad = mockPropiedades.find(p => p.id === id);
  if (!propiedad) {
    throw new Error(`Propiedad with id ${id} not found`);
  }
  return resolvePropertyImages(propiedad);
};

export const getPropiedadesByEmpresa = async (_empresaId: string): Promise<Propiedad[]> => {
  await simulateDelay();
  // Return all properties for mock
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