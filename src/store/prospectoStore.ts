import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Prospecto } from '../types/profile';
import { getProspectos } from '../services/prospectos/prospectosServiceSupabase';

/**
 * ⚠️ IMPORTANTE - Performance Guidelines:
 * 
 * NO uses funciones del store directamente en el array de dependencias de useEffect.
 * 
 * ❌ INCORRECTO:
 * useEffect(() => {
 *   fetchProspectos();
 * }, [fetchProspectos]); // ❌ fetchProspectos causa re-renders infinitos
 * 
 * ✅ CORRECTO:
 * useEffect(() => {
 *   fetchProspectos();
 * }, []); // ✅ Sin dependencias para prospectos
 * 
 * Las funciones del store son estables y NO necesitan estar en las dependencias.
 */

type ProspectoStore = {
  prospectos: Prospecto[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchProspectos: () => Promise<Prospecto[]>;
  addProspectoLocal: (prospecto: Prospecto) => void;
  updateProspectoLocal: (id: string, updates: Partial<Prospecto>) => void;
  invalidateCache: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useProspectoStore = create<ProspectoStore>()(
  persist(
    (set, get) => ({
      prospectos: [],
      loading: false,
      error: null,
      lastFetched: null,
      
      fetchProspectos: async () => {
        // Check cache validity (Fase 2.1: TTL Cache)
        const { lastFetched, prospectos } = get();
        const now = Date.now();
        
        if (lastFetched && prospectos.length > 0 && (now - lastFetched) < CACHE_TTL) {
          console.log('✅ Using cached prospectos (valid for', Math.round((CACHE_TTL - (now - lastFetched)) / 1000), 'more seconds)');
          return prospectos;
        }

        set({ loading: true, error: null });
        try {
          const data = await getProspectos();
          set({ prospectos: data, loading: false, lastFetched: now });
          console.log('✅ Fetched fresh prospectos from API');
          return data;
        } catch (error) {
          console.error('Error fetching prospectos:', error);
          const errorMessage = error instanceof Error ? error.message : 'Error al cargar prospectos';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },
      
      addProspectoLocal: (prospecto: Prospecto) => {
        set(state => ({
          prospectos: [...state.prospectos, prospecto],
          lastFetched: Date.now() // Update cache timestamp
        }));
      },
      
      updateProspectoLocal: (id: string, updates: Partial<Prospecto>) => {
        set(state => ({
          prospectos: state.prospectos.map(p => 
            p.id === id ? { ...p, ...updates } : p
          ),
          lastFetched: Date.now() // Update cache timestamp
        }));
      },
      
      invalidateCache: () => {
        set({ lastFetched: null });
        console.log('🔄 Cache invalidated for prospectos');
      },
      
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'prospectos-storage',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);
