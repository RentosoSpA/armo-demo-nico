import { create } from 'zustand';
import type { Decision, DecisionStats } from '../types/decision';
import {
  getDecisionsByEmpresa,
  getDecisionStats,
  markDecisionAsRead,
  markAllDecisionsAsRead,
} from '../services/mock/decisionsServiceMock';

/**
 * Decisions Store
 *
 * Comportamiento esperado:
 * 1. Al cargar /tablero, si hay decisiones pendientes, se muestra el modal
 * 2. Si el usuario hace click en "Ver decisiones", navega a /decisiones y cierra todo
 * 3. Si el usuario hace click en "Ir al tablero", se cierra el modal y aparece el FAB sticky
 * 4. El FAB permanece visible hasta que el usuario lo cierre manualmente o no haya decisiones
 * 5. Al hacer refresh de la página, `modalDismissed` se resetea y el modal vuelve a aparecer
 */
interface DecisionsStore {
  decisions: Decision[];
  stats: DecisionStats | null;
  loading: boolean;
  modalVisible: boolean;
  modalDismissed: boolean; // Para no mostrar el modal nuevamente en la sesión
  showFab: boolean; // Para mostrar el FAB después de cerrar el modal con "Ir al tablero"

  // Actions
  fetchDecisions: (empresaId: string) => Promise<void>;
  fetchStats: (empresaId: string) => Promise<void>;
  markAsRead: (decisionId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  setModalVisible: (visible: boolean) => void;
  dismissModal: () => void;
  dismissModalToFab: () => void;
  hideFab: () => void;
  resetModalState: () => void;
}

export const useDecisionsStore = create<DecisionsStore>((set, get) => ({
  decisions: [],
  stats: null,
  loading: false,
  modalVisible: false,
  modalDismissed: false,
  showFab: false,

  fetchDecisions: async (empresaId: string) => {
    console.log('[DecisionsStore] fetchDecisions called with empresaId:', empresaId);
    set({ loading: true });
    try {
      const decisions = await getDecisionsByEmpresa(empresaId);
      console.log('[DecisionsStore] Fetched decisions:', decisions.length);
      set({ decisions, loading: false });

      // Auto-show modal y FAB si hay decisiones y no ha sido dismissed
      if (decisions.length > 0 && !get().modalDismissed) {
        console.log('[DecisionsStore] Auto-showing modal and FAB');
        set({ modalVisible: true, showFab: true });
      } else {
        console.log('[DecisionsStore] Not showing modal - dismissed:', get().modalDismissed);
      }
    } catch (error) {
      console.error('[DecisionsStore] Error fetching decisions:', error);
      set({ loading: false });
    }
  },

  fetchStats: async (empresaId: string) => {
    try {
      const stats = await getDecisionStats(empresaId);
      set({ stats });
    } catch (error) {
      console.error('Error fetching decision stats:', error);
    }
  },

  markAsRead: async (decisionId: string) => {
    try {
      await markDecisionAsRead(decisionId);
      set(state => ({
        decisions: state.decisions.filter(d => d.id !== decisionId),
      }));
      // Refetch stats
      const empresaId = ''; // Obtener del contexto si es necesario
      get().fetchStats(empresaId);
    } catch (error) {
      console.error('Error marking decision as read:', error);
    }
  },

  markAllAsRead: async () => {
    try {
      await markAllDecisionsAsRead();
      set({ decisions: [] });
    } catch (error) {
      console.error('Error marking all decisions as read:', error);
    }
  },

  setModalVisible: (visible: boolean) => {
    console.log('[DecisionsStore] setModalVisible:', visible);
    set({ modalVisible: visible });
  },

  dismissModal: () => {
    console.log('[DecisionsStore] dismissModal called (closes modal, keeps FAB)');
    set({
      modalVisible: false,
      modalDismissed: true,
      showFab: true
    });
    console.log('[DecisionsStore] Modal dismissed - FAB remains visible');
  },

  dismissModalToFab: () => {
    console.log('[DecisionsStore] dismissModalToFab called (just closes modal)');
    set({
      modalVisible: false,
      modalDismissed: true
      // showFab ya está en true, no lo cambiamos
    });
    console.log('[DecisionsStore] Modal dismissed - FAB remains visible');
  },

  hideFab: () => {
    console.log('[DecisionsStore] hideFab called');
    set({ showFab: false });
  },

  resetModalState: () => {
    console.log('[DecisionsStore] resetModalState called');
    set({ modalVisible: false, modalDismissed: false, showFab: false });
  },
}));
