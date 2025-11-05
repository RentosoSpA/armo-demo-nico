import type { Agente, AgenteCreate } from '../../types/agente';
import { MOCK_USER_DATA, simulateDelay, generateId } from './mockData';

// Mock implementation of agentes service
const mockAgentes: Agente[] = [...MOCK_USER_DATA.agentes];

export const getAgentes = async (): Promise<Agente[]> => {
  await simulateDelay();
  return mockAgentes;
};

export const getAgenteById = async (id: string): Promise<Agente> => {
  await simulateDelay();
  const agente = mockAgentes.find(a => a.id === id);
  if (!agente) {
    throw new Error(`Agente with id ${id} not found`);
  }
  return agente;
};

export const createAgente = async (agente: AgenteCreate): Promise<Agente> => {
  await simulateDelay();
  const newAgente: Agente = {
    ...agente,
    id: generateId(),
    activo: agente.activo ?? true,
    apellido: agente.apellido || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockAgentes.push(newAgente);
  return newAgente;
};

export const updateAgente = async (id: string, updates: Partial<Agente>): Promise<Agente> => {
  await simulateDelay();
  const index = mockAgentes.findIndex(a => a.id === id);
  if (index === -1) {
    throw new Error(`Agente with id ${id} not found`);
  }
  mockAgentes[index] = { ...mockAgentes[index], ...updates, updatedAt: new Date().toISOString() };
  return mockAgentes[index];
};

export const getAgenteByUserUid = async (userUid: string): Promise<Agente> => {
  await simulateDelay();
  const agente = mockAgentes.find(a => a.userUID === userUid);
  if (!agente) {
    throw new Error(`Agente with userUid ${userUid} not found`);
  }
  return agente;
};