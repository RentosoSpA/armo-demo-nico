import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Oportunidad } from '../types/oportunidad';
import { getOportunidadesByEmpresa } from '../services/oportunidades/oportunidadesServiceSupabase';

/**
 * ⚠️ IMPORTANTE - Performance Guidelines:
 * 
 * NO uses funciones del store directamente en el array de dependencias de useEffect.
 * 
 * ❌ INCORRECTO:
 * useEffect(() => {
 *   fetchOportunidades(empresa?.id);
 * }, [empresa?.id, fetchOportunidades]); // ❌ fetchOportunidades causa re-renders infinitos
 * 
 * ✅ CORRECTO:
 * useEffect(() => {
 *   fetchOportunidades(empresa?.id);
 * }, [empresa?.id]); // ✅ Solo depende de empresa?.id
 * 
 * Las funciones del store son estables y NO necesitan estar en las dependencias.
 */

type OportunidadesStore = {
  oportunidades: Oportunidad[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchOportunidades: (empresaId: string) => Promise<Oportunidad[]>;
  updateOportunidadLocal: (id: string, updates: Partial<Oportunidad>) => void;
  addOportunidadLocal: (oportunidad: Oportunidad) => void;
  invalidateCache: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useOportunidadesStore = create<OportunidadesStore>()(
  persist(
    (set, get) => ({
      oportunidades: [],
      loading: false,
      error: null,
      lastFetched: null,
      
      fetchOportunidades: async (empresaId: string) => {
        // Check cache validity (Fase 1.1: TTL Cache)
        const { lastFetched, oportunidades } = get();
        const now = Date.now();
        
        if (lastFetched && oportunidades.length > 0 && (now - lastFetched) < CACHE_TTL) {
          console.log('✅ Using cached oportunidades (valid for', Math.round((CACHE_TTL - (now - lastFetched)) / 1000), 'more seconds)');
          return oportunidades;
        }

        set({ loading: true, error: null });
        try {
          const data = await getOportunidadesByEmpresa(empresaId);
          set({ oportunidades: data, loading: false, lastFetched: now });
          console.log('✅ Fetched fresh oportunidades from API');
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      updateOportunidadLocal: (id: string, updates: Partial<Oportunidad>) => {
        set(state => ({
          oportunidades: state.oportunidades.map(o => 
            o.id === id ? { ...o, ...updates } : o
          ),
          lastFetched: Date.now() // Update cache timestamp
        }));
      },
      
      addOportunidadLocal: (oportunidad: Oportunidad) => {
        set(state => ({
          oportunidades: [...state.oportunidades, oportunidad],
          lastFetched: Date.now() // Update cache timestamp
        }));
      },
      
      invalidateCache: () => {
        set({ lastFetched: null });
        console.log('🔄 Cache invalidated for oportunidades');
      },
      
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'oportunidades-storage',
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
