/**
 * ⚠️ DEPRECATED - DO NOT USE IN NEW CODE
 * Use src/services/prospectos/prospectosServiceSupabase.ts instead
 * This file is kept only for backwards compatibility and testing
 */
import type { Prospecto, ProspectoCreate } from '../../types/profile';
import { MOCK_DATA, simulateDelay, generateId } from './mockData';

// Mock implementation of prospectos service
const mockProspectos: Prospecto[] = [...MOCK_DATA.prospectos] as Prospecto[];

export const getProspectos = async (): Promise<Prospecto[]> => {
  await simulateDelay();
  return mockProspectos;
};

export const getProspectoById = async (id: string): Promise<Prospecto> => {
  await simulateDelay();
  const prospecto = mockProspectos.find(p => p.id === id);
  if (!prospecto) {
    throw new Error(`Prospecto with id ${id} not found`);
  }
  return prospecto;
};

export const createProspecto = async (prospecto: ProspectoCreate): Promise<Prospecto> => {
  await simulateDelay();
  const newProspecto: Prospecto = {
    ...prospecto,
    id: generateId(),
    source: prospecto.source || 'manual',
    phone_e164: prospecto.phone_e164,
    first_seen_at: new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
  };
  mockProspectos.push(newProspecto);
  return newProspecto;
};

export const updateProspecto = async (id: string, updates: Partial<Prospecto>): Promise<Prospecto> => {
  await simulateDelay();
  const index = mockProspectos.findIndex(p => p.id === id);
  if (index === -1) {
    throw new Error(`Prospecto with id ${id} not found`);
  }
  const processedUpdates = { 
    ...updates,
    last_seen_at: new Date().toISOString() 
  } as Partial<Prospecto>;
  mockProspectos[index] = { ...mockProspectos[index], ...processedUpdates };
  return mockProspectos[index];
};