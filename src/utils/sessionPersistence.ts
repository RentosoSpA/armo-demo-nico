/**
 * Sistema de persistencia dual para sesiones ultra-resistentes
 * Usa TANTO localStorage como sessionStorage para máxima redundancia
 */

export const SessionPersistence = {
  /**
   * Guardar sesión en ambos storages
   */
  saveSession: (session: any) => {
    try {
      const sessionStr = JSON.stringify(session);
      localStorage.setItem('rentoso_session_backup', sessionStr);
      sessionStorage.setItem('rentoso_session_active', sessionStr);
      sessionStorage.setItem('rentoso_session_timestamp', Date.now().toString());
    } catch (error) {
      console.error('[SessionPersistence] Failed to save session:', error);
    }
  },

  /**
   * Recuperar sesión de cualquier storage disponible
   */
  getSession: (): any | null => {
    try {
      // Preferir sessionStorage (más reciente)
      const activeSession = sessionStorage.getItem('rentoso_session_active');
      if (activeSession) {
        return JSON.parse(activeSession);
      }

      // Fallback a localStorage
      const backupSession = localStorage.getItem('rentoso_session_backup');
      if (backupSession) {
        // Restaurar también en sessionStorage
        sessionStorage.setItem('rentoso_session_active', backupSession);
        return JSON.parse(backupSession);
      }

      return null;
    } catch (error) {
      console.error('[SessionPersistence] Failed to get session:', error);
      return null;
    }
  },

  /**
   * Limpiar SOLO en logout explícito
   */
  clearSession: () => {
    try {
      localStorage.removeItem('rentoso_session_backup');
      sessionStorage.removeItem('rentoso_session_active');
      sessionStorage.removeItem('rentoso_session_timestamp');
    } catch (error) {
      console.error('[SessionPersistence] Failed to clear session:', error);
    }
  },

  /**
   * Verificar si sesión está "fresca" (menos de 24 horas)
   */
  isSessionFresh: (): boolean => {
    try {
      const timestamp = sessionStorage.getItem('rentoso_session_timestamp');
      if (!timestamp) return false;

      const ageMs = Date.now() - parseInt(timestamp, 10);
      const maxAgeMs = 24 * 60 * 60 * 1000; // 24 horas

      return ageMs < maxAgeMs;
    } catch (error) {
      return false;
    }
  },
};
