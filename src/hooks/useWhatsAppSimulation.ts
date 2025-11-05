import { useEffect, useRef } from 'react';
import { useWhatsAppChatStore } from '../store/whatsappChatStore';
import { RESPUESTAS_CURIOSO, PREGUNTAS_PRECIO, PREGUNTAS_VISITA, PREGUNTAS_CARACTERISTICAS } from '../services/mock/conversationTemplates';
import { applyConsistentWriting } from '../services/mock/whatsappConversationGenerator';
import type { WhatsAppMessage } from '../types/whatsapp-chat';

const PERSONALITY_TIMING = {
  formal: { min: 20, max: 60 },
  casual: { min: 10, max: 30 },
  coloquial: { min: 7, max: 25 },
  apurado: { min: 7, max: 15 },
  detallista: { min: 25, max: 50 }
};

function getRandomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useWhatsAppSimulation(enabled: boolean) {
  const { chats, addMessage, setTyping } = useWhatsAppChatStore();
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (!enabled || chats.length === 0) return;
    
    const simulateActivity = () => {
      // Filtrar chats activos (no rechazados, no sin_respuesta hace mucho tiempo)
      const activeChats = chats.filter(chat => 
        chat.status === 'activo' || 
        chat.status === 'en_espera' || 
        chat.status === 'aceptado'
      );
      
      if (activeChats.length === 0) {
        // Reintentar en 30 segundos
        timeoutRef.current = setTimeout(simulateActivity, 30000);
        return;
      }
      
      // Seleccionar chat aleatorio
      const chat = activeChats[Math.floor(Math.random() * activeChats.length)];
      
      // Solo simular si el chat está controlado por AI
      if (!chat.isAIControlled) {
        timeoutRef.current = setTimeout(simulateActivity, Math.random() * 20000 + 10000);
        return;
      }
      
      const lastMessage = chat.messages[chat.messages.length - 1];
      
      // Decidir quién responde (70% CuriOso, 30% Lead)
      const curiosoResponde = lastMessage?.sender === 'lead' || Math.random() < 0.7;
      
      if (curiosoResponde && lastMessage?.sender === 'lead') {
        // CuriOso responde al lead
        const typingDelay = Math.floor(Math.random() * 2000) + 1000; // 1-3 seg
        const responseDelay = Math.floor(Math.random() * 6000) + 2000; // 2-8 seg
        
        // Mostrar "escribiendo..."
        setTyping(chat.id, true, 'curioso');
        
        setTimeout(() => {
          setTyping(chat.id, false);
          
          // Generar respuesta contextual
          const respuestas = [
            ...RESPUESTAS_CURIOSO.disponible_si,
            ...RESPUESTAS_CURIOSO.estacionamiento_si,
            ...RESPUESTAS_CURIOSO.mascotas_si,
            'Con gusto te ayudo con eso 🐻',
            'Claro! Te confirmo ✅',
            'Perfecto, coordinamos entonces 📅'
          ];
          
          const content = getRandomFromArray(respuestas);
          
          const message: WhatsAppMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            chatId: chat.id,
            content,
            sender: 'curioso',
            timestamp: new Date().toISOString(),
            read: false,
            status: 'sent'
          };
          
          addMessage(chat.id, message);
        }, responseDelay);
        
      } else if (lastMessage?.sender === 'curioso' || lastMessage?.sender === 'agent') {
        // Lead responde
        const timing = PERSONALITY_TIMING[chat.lead.personality];
        const responseDelay = Math.floor(Math.random() * (timing.max - timing.min) * 1000) + timing.min * 1000;
        
        // Mostrar "escribiendo..." para algunos perfiles
        if (chat.lead.personality !== 'apurado' && Math.random() > 0.5) {
          const typingStart = responseDelay - Math.floor(Math.random() * 3000) - 2000;
          setTimeout(() => {
            setTyping(chat.id, true, 'lead');
          }, typingStart);
        }
        
        setTimeout(() => {
          setTyping(chat.id, false);
          
          // Generar pregunta/respuesta del lead
          const tiposPregunta = [
            ...PREGUNTAS_VISITA[chat.lead.personality] || [],
            ...PREGUNTAS_CARACTERISTICAS.estacionamiento,
            ...PREGUNTAS_CARACTERISTICAS.mascotas,
            'Perfecto, gracias',
            'Genial!',
            'Ok, entendido'
          ];
          
          let content = getRandomFromArray(tiposPregunta);
          
          // Aplicar escritura consistente según el perfil del lead
          content = applyConsistentWriting(content, chat.lead);
          
          const message: WhatsAppMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            chatId: chat.id,
            content,
            sender: 'lead',
            timestamp: new Date().toISOString(),
            read: false,
            status: 'sent'
          };
          
          addMessage(chat.id, message);
        }, responseDelay);
      }
      
      // Programar siguiente simulación (10-30 segundos)
      const nextDelay = Math.floor(Math.random() * 20000) + 10000;
      timeoutRef.current = setTimeout(simulateActivity, nextDelay);
    };
    
    // Iniciar primera simulación
    const initialDelay = Math.floor(Math.random() * 10000) + 5000; // 5-15 seg
    timeoutRef.current = setTimeout(simulateActivity, initialDelay);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, chats, addMessage, setTyping]);
}
