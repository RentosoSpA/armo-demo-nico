/**
 * ⚠️ DEPRECATED - DO NOT USE IN NEW CODE
 * Use src/services/oportunidades/oportunidadesServiceSupabase.ts instead
 * This file is kept only for backwards compatibility and testing
 */
import type { Oportunidad, OportunidadCreate } from '../../types/oportunidad';
import { MOCK_DATA, simulateDelay, generateId } from './mockData';

// Mock implementation of oportunidades service  
const mockOportunidades: Oportunidad[] = [...MOCK_DATA.oportunidades];

export const getOportunidadesByEmpresa = async (_empresaId: string): Promise<Oportunidad[]> => {
  await simulateDelay();
  return mockOportunidades;
};

export const getOportunidadById = async (id: string): Promise<Oportunidad> => {
  await simulateDelay();
  const oportunidad = mockOportunidades.find(o => o.id === id);
  if (!oportunidad) {
    throw new Error(`Oportunidad with id ${id} not found`);
  }
  return oportunidad;
};

export const createOportunidad = async (oportunidad: OportunidadCreate): Promise<Oportunidad> => {
  await simulateDelay();
  const newOportunidad: Oportunidad = {
    id: generateId(),
    prospecto_id: oportunidad.prospecto_id,
    propiedad_id: oportunidad.propiedad_id,
    agente_id: oportunidad.agente_id,
    empresa_id: oportunidad.empresa_id,
    etapa: oportunidad.etapa || 'Exploracion',
    status: oportunidad.status || 'Open',
    source: oportunidad.source || 'manual',
    channel: oportunidad.channel,
    topk_rank: Math.floor(Math.random() * 10) + 1,
    score_total: Math.floor(Math.random() * 100) + 1,
    decision_total: Math.random() > 0.5 ? 'aprobado' : 'desaprobado',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockOportunidades.push(newOportunidad);
  return newOportunidad;
};

export const updateOportunidad = async (id: string, updates: Partial<Oportunidad>): Promise<Oportunidad> => {
  await simulateDelay();
  const index = mockOportunidades.findIndex(o => o.id === id);
  if (index === -1) {
    throw new Error(`Oportunidad with id ${id} not found`);
  }
  mockOportunidades[index] = { 
    ...mockOportunidades[index], 
    ...updates,
    updated_at: new Date().toISOString()
  };
  return mockOportunidades[index];
};