import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Propiedad } from '../types/propiedad';
import { getPropiedades, getPropiedadById } from '../services/mock/propiedadesServiceMock';

/**
 * ⚠️ IMPORTANTE - Performance Guidelines:
 * 
 * NO uses funciones del store directamente en el array de dependencias de useEffect.
 * 
 * ❌ INCORRECTO:
 * useEffect(() => {
 *   fetchPropiedades(empresa?.id);
 * }, [empresa?.id, fetchPropiedades]); // ❌ fetchPropiedades causa re-renders infinitos
 * 
 * ✅ CORRECTO:
 * useEffect(() => {
 *   fetchPropiedades(empresa?.id);
 * }, [empresa?.id]); // ✅ Solo depende de empresa?.id
 * 
 * Las funciones del store son estables y NO necesitan estar en las dependencias.
 */

type PropiedadStore = {
  propiedades: Propiedad[];
  loading: boolean;
  error: string | null;
  currentPropiedad: Propiedad | null;
  lastFetched: number | null;
  cacheVersion: number;
  fetchPropiedades: (empresaId: string) => Promise<Propiedad[]>;
  fetchPropiedadById: (id: string) => Promise<Propiedad>;
  setCurrentPropiedad: (propiedad: Propiedad | null) => void;
  updatePropiedadLocal: (propiedad: Propiedad) => void;
  addPropiedad: (propiedad: Propiedad) => void;
  removePropiedad: (id: string) => void;
  invalidateCache: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_VERSION = 2; // Increment this when data structure changes

export const usePropiedadStore = create<PropiedadStore>()(
  persist(
    (set, get) => ({
      propiedades: [],
      loading: false,
      error: null,
      currentPropiedad: null,
      lastFetched: null,
      cacheVersion: CACHE_VERSION,

      fetchPropiedades: async (empresaId: string) => {
        console.log('🏪 PropiedadStore: fetchPropiedades called with empresaId:', empresaId);
        // Check cache validity (Fase 2.2: TTL Cache)
        const { lastFetched, propiedades, cacheVersion } = get();
        const now = Date.now();

        // Invalidate cache if version changed
        if (cacheVersion !== CACHE_VERSION) {
          console.log('🔄 Cache version mismatch, invalidating cache');
          set({ lastFetched: null, cacheVersion: CACHE_VERSION });
        }

        if (lastFetched && propiedades.length > 0 && (now - lastFetched) < CACHE_TTL && cacheVersion === CACHE_VERSION) {
          console.log('✅ Using cached propiedades (valid for', Math.round((CACHE_TTL - (now - lastFetched)) / 1000), 'more seconds)');
          return propiedades;
        }

        console.log('🌐 PropiedadStore: Fetching fresh data from API');
        set({ loading: true, error: null });
        try {
          const propiedades = await getPropiedades();
          set({ propiedades, loading: false, lastFetched: now, cacheVersion: CACHE_VERSION });
          console.log('✅ PropiedadStore: Fetched fresh propiedades from API, count:', propiedades.length);
          return propiedades;
        } catch (error: any) {
          console.error('❌ PropiedadStore: Error fetching propiedades:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      fetchPropiedadById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const propiedad = await getPropiedadById(id);
          set({ currentPropiedad: propiedad, loading: false });
          return propiedad;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },
      
      setCurrentPropiedad: (propiedad: Propiedad | null) => set({ currentPropiedad: propiedad }),
      
      updatePropiedadLocal: (propiedad: Propiedad) =>
        set(state => ({
          propiedades: state.propiedades.map(p => (p.id === propiedad.id ? propiedad : p)),
          currentPropiedad: state.currentPropiedad?.id === propiedad.id ? propiedad : state.currentPropiedad,
          lastFetched: Date.now() // Update cache timestamp
        })),
      
      addPropiedad: (propiedad: Propiedad) =>
        set(state => ({
          propiedades: [...state.propiedades, propiedad],
          lastFetched: Date.now()
        })),

      removePropiedad: (id: string) =>
        set(state => ({
          propiedades: state.propiedades.filter(p => p.id !== id),
          currentPropiedad: state.currentPropiedad?.id === id ? null : state.currentPropiedad,
          lastFetched: Date.now()
        })),
      
      invalidateCache: () => {
        set({ lastFetched: null });
        console.log('🔄 Cache invalidated for propiedades');
      },
      
      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'propiedad-storage',
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
