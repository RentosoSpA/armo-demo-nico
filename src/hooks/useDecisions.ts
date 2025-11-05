import { useEffect, useCallback } from 'react';
import { useDecisionsStore } from '../store/decisionsStore';
import { useUser } from '../store/userStore';

export const useDecisions = () => {
  const { empresa } = useUser();
  const {
    decisions,
    stats,
    loading,
    modalVisible,
    modalDismissed,
    showFab,
    fetchDecisions,
    fetchStats,
    markAsRead,
    markAllAsRead,
    setModalVisible,
    dismissModal,
    dismissModalToFab,
    hideFab,
    resetModalState,
  } = useDecisionsStore();

  const refresh = useCallback(() => {
    console.log('[useDecisions] refresh called with empresa.id:', empresa?.id);
    if (empresa?.id) {
      fetchDecisions(empresa.id);
      fetchStats(empresa.id);
    }
  }, [empresa?.id, fetchDecisions, fetchStats]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    decisions,
    stats,
    loading,
    modalVisible,
    modalDismissed,
    showFab,
    hasDecisions: decisions.length > 0,
    decisionsCount: decisions.length,
    markAsRead,
    markAllAsRead,
    setModalVisible,
    dismissModal,
    dismissModalToFab,
    hideFab,
    resetModalState,
    refresh,
  };
};
