import type { Visita, VisitaCreate } from '../../types/visita';
import { MOCK_DATA, simulateDelay, generateId } from './mockData';

// Mock implementation of visitas service
const mockVisitas: Visita[] = [...MOCK_DATA.visitas];

export const getVisitas = async (): Promise<Visita[]> => {
  await simulateDelay();
  return mockVisitas;
};

export const getVisitaById = async (id: string): Promise<Visita> => {
  await simulateDelay();
  const visita = mockVisitas.find(v => v.id === id);
  if (!visita) {
    throw new Error(`Visita with id ${id} not found`);
  }
  return visita;
};

export const createVisita = async (visita: VisitaCreate): Promise<Visita> => {
  await simulateDelay();
  const newVisita: Visita = {
    ...visita,
    id: generateId(),
  };
  mockVisitas.push(newVisita);
  return newVisita;
};

export const updateVisita = async (id: string, updates: Partial<Visita>): Promise<Visita> => {
  await simulateDelay();
  const index = mockVisitas.findIndex(v => v.id === id);
  if (index === -1) {
    throw new Error(`Visita with id ${id} not found`);
  }
  mockVisitas[index] = { ...mockVisitas[index], ...updates };
  return mockVisitas[index];
};

export const deleteVisita = async (id: string): Promise<{ success: boolean }> => {
  await simulateDelay();
  const index = mockVisitas.findIndex(v => v.id === id);
  if (index === -1) {
    throw new Error(`Visita with id ${id} not found`);
  }
  mockVisitas.splice(index, 1);
  return { success: true };
};