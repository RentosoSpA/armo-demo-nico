import { create } from 'zustand';
import type { Empresa } from '../types/empresa';
import {
  getEmpresaByName,
  getEmpresaById,
  updateEmpresa,
} from '../services/empresa/empresaService';

interface EmpresaStore {
  // State
  empresa: Empresa | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchEmpresa: (nombre: string) => Promise<void>;
  fetchEmpresaById: (empresaId: string) => Promise<void>;
  updateEmpresaInfo: (empresaId: string, data: Partial<Empresa>) => Promise<void>;
  clearEmpresa: () => void;
  isCacheValid: () => boolean;
}

export const useEmpresaStore = create<EmpresaStore>((set, get) => ({
  // Initial state
  empresa: null,
  loading: false,
  error: null,
  lastFetched: null,

  // Check if cache is still valid (30 minutes)
  isCacheValid: () => {
    const { lastFetched } = get();
    if (!lastFetched) return false;
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    return now - lastFetched < thirtyMinutes;
  },

  // Fetch empresa by name
  fetchEmpresa: async (nombre: string) => {
    const { empresa, isCacheValid } = get();

    // If we already have empresa data and cache is valid, don't fetch again
    if (empresa && isCacheValid()) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const fetchedEmpresa = await getEmpresaByName(nombre);
      set({
        empresa: fetchedEmpresa,
        loading: false,
        lastFetched: Date.now(),
      });
    } catch (error) {
      console.error('Error fetching empresa:', error);
      set({
        error: 'Error al cargar la información de la empresa',
        loading: false,
      });
    }
  },

  // Fetch empresa by ID
  fetchEmpresaById: async (empresaId: string) => {
    const { empresa, isCacheValid } = get();

    console.log('[EmpresaStore] fetchEmpresaById called with id:', empresaId);
    console.log('[EmpresaStore] Current empresa:', empresa);
    console.log('[EmpresaStore] Cache valid:', isCacheValid());

    // If we already have empresa data and cache is valid, don't fetch again
    if (empresa && isCacheValid()) {
      console.log('[EmpresaStore] Using cached empresa data');
      return;
    }

    console.log('[EmpresaStore] Fetching empresa from API...');
    set({ loading: true, error: null });

    try {
      const fetchedEmpresa = await getEmpresaById(empresaId);
      console.log('[EmpresaStore] Empresa fetched successfully:', fetchedEmpresa);
      set({
        empresa: fetchedEmpresa,
        loading: false,
        lastFetched: Date.now(),
      });
    } catch (error) {
      console.error('[EmpresaStore] Error fetching empresa:', error);
      set({
        error: 'Error al cargar la información de la empresa',
        loading: false,
      });
    }
  },

  // Update empresa information
  updateEmpresaInfo: async (empresaId: string, data: Partial<Empresa>) => {
    const { empresa } = get();

    if (!empresa) {
      throw new Error('No empresa data available');
    }

    try {
      const updatedEmpresa = await updateEmpresa(empresaId, data);
      set({
        empresa: { ...empresa, ...updatedEmpresa },
        lastFetched: Date.now(),
      });
    } catch (error) {
      console.error('Error updating empresa:', error);
      throw error;
    }
  },

  // Clear empresa data
  clearEmpresa: () => {
    set({
      empresa: null,
      loading: false,
      error: null,
      lastFetched: null,
    });
  },
}));
