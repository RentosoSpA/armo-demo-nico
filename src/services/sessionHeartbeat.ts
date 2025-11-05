/**
 * Heartbeat service para mantener sesión activa
 * Hace ping cada 10 minutos para evitar timeouts
 */

import { supabase } from '../integrations/supabase/client';

let heartbeatInterval: NodeJS.Timeout | null = null;

export const SessionHeartbeat = {
  start: () => {
    if (heartbeatInterval) return; // Ya está corriendo

    console.log('[SessionHeartbeat] Starting session heartbeat');

    // Hacer ping cada 10 minutos
    heartbeatInterval = setInterval(async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('[SessionHeartbeat] Error checking session:', error);
          return;
        }

        if (session) {
          console.log('[SessionHeartbeat] Session is alive ✅');
          
          // Opcional: Hacer una query ligera a DB para mantener conexión
          await supabase.from('profiles').select('user_id').limit(1);
        } else {
          console.warn('[SessionHeartbeat] No active session detected');
        }
      } catch (error) {
        console.error('[SessionHeartbeat] Heartbeat failed:', error);
      }
    }, 10 * 60 * 1000); // 10 minutos
  },

  stop: () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;
      console.log('[SessionHeartbeat] Stopped session heartbeat');
    }
  },
};
