import type { Propietario, PropiedadResumen } from '../../types/propietario';
import { simulateDelay, generateId, MOCK_DATA } from './mockData';
import { getPropertyImage } from './propertyImages';

// Mock implementation of propietarios service
const mockPropietarios: Propietario[] = [...MOCK_DATA.propietarios];

export const getPropietarios = async (empresaId?: string): Promise<Propietario[]> => {
  await simulateDelay();
  // In mock mode, we ignore empresaId and return all propietarios
  return mockPropietarios;
};

export const getPropietarioById = async (id: string): Promise<Propietario> => {
  await simulateDelay();
  const propietario = mockPropietarios.find(p => p.id === id);
  if (!propietario) {
    throw new Error(`Propietario with id ${id} not found`);
  }
  return propietario;
};

export const createPropietario = async (propietario: any, empresaId?: string): Promise<Propietario> => {
  await simulateDelay();
  // In mock mode, we ignore empresaId
  const newPropietario: Propietario = {
    ...propietario,
    id: generateId(),
    propiedades_asociadas: 0
  };
  mockPropietarios.push(newPropietario);
  return newPropietario;
};

export const updatePropietario = async (id: string, updates: Partial<Propietario>): Promise<Propietario> => {
  await simulateDelay();
  const index = mockPropietarios.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Propietario with id ${id} not found`);
  }
  mockPropietarios[index] = { ...mockPropietarios[index], ...updates };
  return mockPropietarios[index];
};

export const deletePropietario = async (id: string): Promise<void> => {
  await simulateDelay();
  const index = mockPropietarios.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Propietario with id ${id} not found`);
  }
  // Check if propietario has associated properties
  const propiedadesCount = MOCK_DATA.propiedades.filter(p => p.propietario_id === id).length;
  if (propiedadesCount > 0) {
    throw new Error(`Cannot delete propietario with ${propiedadesCount} associated properties`);
  }
  mockPropietarios.splice(index, 1);
};

export const getPropiedadesWithImagesByPropietario = async (
  propietarioId: string
): Promise<PropiedadResumen[]> => {
  await simulateDelay();
  
  // Filter properties by propietario_id
  const propiedades = MOCK_DATA.propiedades.filter(
    prop => prop.propietario_id === propietarioId
  );

  // Map to PropiedadResumen format with actual property images
  return propiedades.map(prop => {
    const imageUrl = getPropertyImage(prop.imagenPrincipal) || 'https://placehold.co/400x300?text=Sin+imagen';

    return {
      id: prop.id,
      titulo: prop.titulo,
      direccion: prop.direccion,
      tipo: prop.tipo,
      estado: prop.estado,
      precio_arriendo: prop.propiedadArriendo?.precioPrincipal,
      precio_venta: prop.propiedadVenta?.precioPrincipal,
      imagen_url: imageUrl
    };
  });
};
