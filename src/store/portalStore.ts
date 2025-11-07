import { create } from 'zustand';
import type { Propiedad } from '../types/propiedad';
import type { Empresa } from '../types/empresa';

import { getPortalPropiedades } from '../services/portal/portalServiceAdapter';
import { getEmpresaByName } from '../services/mock/empresaServiceMock';
import { getImages } from '../services/mock/multimediaServiceMock';

interface PortalState {
  // Empresa data
  empresa: Empresa | null;
  empresaLoading: boolean;
  empresaError: string | null;

  // Properties data
  propiedades: Propiedad[];
  filteredPropiedades: Propiedad[];
  loading: boolean;
  error: string | null;

  // Image cache
  imageCache: Record<string, string | null>;
  imageLoadingCache: Record<string, boolean>;
  cacheTimestamp: number;

  // Actions
  fetchEmpresa: (nombre: string) => Promise<void>;
  fetchPropiedades: (empresaId: string) => Promise<void>;
  setFilteredPropiedades: (filtered: Propiedad[]) => void;
  fetchPropertyImage: (propertyId: string) => Promise<string | null>;
  clearCache: () => void;
  isCacheValid: () => boolean;
}

export const usePortalStore = create<PortalState>((set, get) => ({
  // Initial state
  empresa: null,
  empresaLoading: false,
  empresaError: null,
  propiedades: [],
  filteredPropiedades: [],
  loading: false,
  error: null,
  imageCache: {},
  imageLoadingCache: {},
  cacheTimestamp: 0,

  // Check if cache is still valid (30 minutes)
  isCacheValid: () => {
    const { cacheTimestamp } = get();
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    return now - cacheTimestamp < thirtyMinutes;
  },

  // Fetch empresa by name
  fetchEmpresa: async (nombre: string) => {
    set({ empresaLoading: true, empresaError: null });

    try {
      const fetchedEmpresa = await getEmpresaByName(nombre);
      set({
        empresa: fetchedEmpresa,
        empresaLoading: false,
      });
    } catch (error) {
      console.error('Error fetching empresa:', error);
      set({
        empresaError: 'Error al cargar la información de la empresa',
        empresaLoading: false,
      });
    }
  },

  // Fetch properties by empresa
  fetchPropiedades: async (empresaId: string) => {
    const { propiedades, isCacheValid } = get();

    // If we already have properties and cache is valid, don't fetch again
    if (propiedades.length > 0 && isCacheValid()) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const fetchedPropiedades = await getPortalPropiedades(empresaId);
      set({
        propiedades: fetchedPropiedades,
        filteredPropiedades: fetchedPropiedades,
        loading: false,
        cacheTimestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error fetching propiedades:', error);
      set({
        error: 'Error al cargar las propiedades',
        loading: false,
      });
    }
  },

  // Set filtered properties
  setFilteredPropiedades: (filtered: Propiedad[]) => {
    set({ filteredPropiedades: filtered });
  },

  // Fetch and cache property image
  fetchPropertyImage: async (propertyId: string) => {
    const { imageCache, imageLoadingCache } = get();

    // If image is already cached, return it
    if (imageCache[propertyId] !== undefined) {
      return imageCache[propertyId];
    }

    // If image is currently loading, return null
    if (imageLoadingCache[propertyId]) {
      return null;
    }

    // Mark as loading
    set(state => ({
      imageLoadingCache: {
        ...state.imageLoadingCache,
        [propertyId]: true,
      },
    }));

    try {
      const images = await getImages(propertyId);
      const imageUrl = images && images[0]?.url ? images[0].url : null;

      // Cache the result
      set(state => ({
        imageCache: {
          ...state.imageCache,
          [propertyId]: imageUrl,
        },
        imageLoadingCache: {
          ...state.imageLoadingCache,
          [propertyId]: false,
        },
      }));

      return imageUrl;
    } catch (error) {
      console.warn(`Could not fetch image for property ${propertyId}:`, error);

      // Cache null result to avoid repeated failed requests
      set(state => ({
        imageCache: {
          ...state.imageCache,
          [propertyId]: null,
        },
        imageLoadingCache: {
          ...state.imageLoadingCache,
          [propertyId]: false,
        },
      }));

      return null;
    }
  },

  // Clear all cache
  clearCache: () => {
    set({
      empresa: null,
      empresaLoading: false,
      empresaError: null,
      imageCache: {},
      imageLoadingCache: {},
      propiedades: [],
      filteredPropiedades: [],
      cacheTimestamp: 0,
    });
  },
}));
