import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  getPropietarios, 
  getPropietarioById, 
  createPropietario, 
  updatePropietario,
  deletePropietario,
  getPropiedadesWithImagesByPropietario
} from '../services/mock/propietariosServiceMock';
import type { Propietario, PropiedadResumen } from '../types/propietario';

/**
 * ⚠️ IMPORTANTE - Performance Guidelines:
 * 
 * NO uses funciones del store directamente en el array de dependencias de useEffect.
 * 
 * ❌ INCORRECTO:
 * useEffect(() => {
 *   fetchPropietarios(empresa?.id);
 * }, [empresa?.id, fetchPropietarios]); // ❌ fetchPropietarios causa re-renders infinitos
 * 
 * ✅ CORRECTO:
 * useEffect(() => {
 *   fetchPropietarios(empresa?.id);
 * }, [empresa?.id]); // ✅ Solo depende de empresa?.id
 * 
 * Las funciones del store son estables y NO necesitan estar en las dependencias.
 */

type PropietarioStore = {
  propietarios: Propietario[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchPropietarios: (empresaId: string) => Promise<Propietario[]>;
  getPropietarioById: (id: string) => Promise<Propietario>;
  createPropietarioLocal: (propietario: any, empresaId: string) => Promise<Propietario>;
  updatePropietarioLocal: (id: string, propietario: any) => Promise<Propietario>;
  deletePropietarioLocal: (id: string) => Promise<void>;
  getPropiedadesByPropietario: (propietarioId: string) => Promise<PropiedadResumen[]>;
  invalidateCache: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const usePropietarioStore = create<PropietarioStore>()(
  persist(
    (set, get) => ({
      propietarios: [],
      loading: false,
      error: null,
      lastFetched: null,
      
      fetchPropietarios: async (empresaId: string) => {
        // Check cache validity (Fase 2.2: TTL Cache)
        const { lastFetched, propietarios } = get();
        const now = Date.now();
        
        if (lastFetched && propietarios.length > 0 && (now - lastFetched) < CACHE_TTL) {
          console.log('✅ Using cached propietarios (valid for', Math.round((CACHE_TTL - (now - lastFetched)) / 1000), 'more seconds)');
          return propietarios;
        }

        set({ loading: true, error: null });
        try {
          const data = await getPropietarios(empresaId);
          set({ propietarios: data, loading: false, lastFetched: now });
          console.log('✅ Fetched fresh propietarios from API');
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

  getPropietarioById: async (id: string) => {
    try {
      const data = await getPropietarioById(id);
      return data;
    } catch (error: any) {
      throw error;
    }
  },

  createPropietarioLocal: async (propietario: any, empresaId: string) => {
        try {
          const newProp = await createPropietario(propietario, empresaId);
          set(state => ({
            propietarios: [...state.propietarios, newProp],
            lastFetched: Date.now() // Update cache timestamp
          }));
          return newProp;
        } catch (error: any) {
          throw error;
        }
      },

      updatePropietarioLocal: async (id: string, propietario: any) => {
        try {
          const updated = await updatePropietario(id, propietario);
          set(state => ({
            propietarios: state.propietarios.map(p => 
              p.id === id ? {
                ...updated,
                // Defensive: preserve property count if update returns 0 but previous wasn't
                propiedades_asociadas: updated.propiedades_asociadas || p.propiedades_asociadas || 0
              } : p
            ),
            lastFetched: Date.now() // Update cache timestamp
          }));
          return updated;
        } catch (error: any) {
          throw error;
        }
      },

      deletePropietarioLocal: async (id: string) => {
        try {
          await deletePropietario(id);
          set(state => ({
            propietarios: state.propietarios.filter(p => p.id !== id),
            lastFetched: Date.now()
          }));
        } catch (error: any) {
          throw error;
        }
      },

      getPropiedadesByPropietario: async (propietarioId: string) => {
        try {
          return await getPropiedadesWithImagesByPropietario(propietarioId);
        } catch (error: any) {
          throw error;
        }
      },

      invalidateCache: () => {
        set({ lastFetched: null });
        console.log('🔄 Cache invalidated for propietarios');
      },

      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error })
    }),
    {
      name: 'propietario-storage',
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
