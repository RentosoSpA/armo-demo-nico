import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  getFavoritesCount: () => number;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (id) => {
        set((state) => ({
          favorites: [...state.favorites, id]
        }));
      },
      
      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav !== id)
        }));
      },
      
      toggleFavorite: (id) => {
        const state = get();
        if (state.favorites.includes(id)) {
          state.removeFavorite(id);
        } else {
          state.addFavorite(id);
        }
      },
      
      isFavorite: (id) => {
        return get().favorites.includes(id);
      },
      
      getFavoritesCount: () => {
        return get().favorites.length;
      },
      
      clearFavorites: () => {
        set({ favorites: [] });
      }
    }),
    {
      name: 'rentoso-favorites-storage',
    }
  )
);
