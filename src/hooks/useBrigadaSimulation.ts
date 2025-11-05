import { useEffect, useRef } from 'react';
import { useWhatsAppChatStore } from '../store/whatsappChatStore';
import { generateBrigadaActivity } from '../services/mock/brigadaActivityGenerator';

export function useBrigadaSimulation(enabled: boolean) {
  const { chats, addBrigadaActivity } = useWhatsAppChatStore();
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (!enabled || chats.length === 0) return;
    
    const simulateActivity = () => {
      // Seleccionar chat aleatorio
      const chat = chats[Math.floor(Math.random() * chats.length)];
      
      if (!chat) {
        timeoutRef.current = setTimeout(simulateActivity, 12000);
        return;
      }
      
      // Generar actividad de brigada
      const activity = generateBrigadaActivity(
        chat.lead.nombre,
        `Propiedad ${chat.propiedadId.slice(-4)}`,
        0 // Justo ahora
      );
      
      addBrigadaActivity(activity);
      
      // Programar siguiente actividad (8-15 segundos)
      const nextDelay = Math.floor(Math.random() * 7000) + 8000;
      timeoutRef.current = setTimeout(simulateActivity, nextDelay);
    };
    
    // Iniciar primera actividad
    const initialDelay = Math.floor(Math.random() * 5000) + 3000; // 3-8 seg
    timeoutRef.current = setTimeout(simulateActivity, initialDelay);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, chats, addBrigadaActivity]);
}
