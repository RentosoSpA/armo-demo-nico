import { create } from 'zustand';
import type { Agente } from '../types/agente';
import type { Empresa } from '../types/empresa';
import type { User } from '../types/user';

interface UserStore {
  agent: Agente | null;
  empresa: Empresa | null;
  userProfile: User | null;
  sessionValid: boolean;
  loading: boolean;
  setAgent: (agent: Agente | null) => void;
  setEmpresa: (empresa: Empresa | null) => void;
  setUserProfile: (profile: User | null) => void;
  setSessionValid: (valid: boolean) => void;
  setLoading: (loading: boolean) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserStore>(set => ({
  agent: null,
  empresa: null,
  userProfile: null,
  sessionValid: false,
  loading: true,
  setAgent: agent => set({ agent }),
  setEmpresa: empresa => set({ empresa }),
  setUserProfile: userProfile => set({ userProfile }),
  setSessionValid: sessionValid => set({ sessionValid }),
  setLoading: loading => set({ loading }),
  clearUserData: () =>
    set({
      agent: null,
      empresa: null,
      userProfile: null,
      sessionValid: false,
    }),
}));

// Utility hook for easy access to user data
export const useUser = () => {
  const store = useUserStore();

  return {
    ...store,
    isAuthenticated: store.sessionValid && store.userProfile !== null,
    isAgent: store.agent !== null,
    displayName:
      store.agent?.nombre ||
      (store.userProfile
        ? `${store.userProfile.nombre} ${store.userProfile.apellido}`
        : 'Usuario'),
  };
};
