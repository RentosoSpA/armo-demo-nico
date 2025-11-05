import { create } from 'zustand';
import type { WhatsAppChat, WhatsAppMessage, BrigadaActivity } from '../types/whatsapp-chat';

interface WhatsAppChatStore {
  chats: WhatsAppChat[];
  selectedChatId: string | null;
  openTabs: string[];
  brigadaActivities: BrigadaActivity[];
  
  // Actions
  setChats: (chats: WhatsAppChat[]) => void;
  selectChat: (chatId: string | null) => void;
  openChatTab: (chatId: string) => void;
  closeChatTab: (chatId: string) => void;
  toggleChatControl: (chatId: string) => void;
  sendMessage: (chatId: string, content: string, sender: 'agent' | 'curioso') => void;
  addMessage: (chatId: string, message: WhatsAppMessage) => void;
  markAsRead: (chatId: string) => void;
  setTyping: (chatId: string, isTyping: boolean, typingUser?: 'lead' | 'curioso') => void;
  addBrigadaActivity: (activity: BrigadaActivity) => void;
  setBrigadaActivities: (activities: BrigadaActivity[]) => void;
  updateLeadName: (chatId: string, nombreReal: string) => void;
}

export const useWhatsAppChatStore = create<WhatsAppChatStore>((set, get) => ({
  chats: [],
  selectedChatId: null,
  openTabs: ['todos'], // Tab inicial "Todos los Chats"
  brigadaActivities: [],
  
  setChats: (chats) => set({ chats }),
  
  selectChat: (chatId) => set({ selectedChatId: chatId }),
  
  openChatTab: (chatId) => {
    const { openTabs } = get();
    if (!openTabs.includes(chatId) && openTabs.length < 6) {
      set({ openTabs: [...openTabs, chatId], selectedChatId: chatId });
    } else if (openTabs.includes(chatId)) {
      set({ selectedChatId: chatId });
    }
  },
  
  closeChatTab: (chatId) => {
    const { openTabs, selectedChatId } = get();
    const newTabs = openTabs.filter(id => id !== chatId);
    
    // Si cerramos el tab seleccionado, seleccionar el anterior
    const newSelectedId = selectedChatId === chatId 
      ? (newTabs.length > 0 ? newTabs[newTabs.length - 1] : null)
      : selectedChatId;
    
    set({ openTabs: newTabs, selectedChatId: newSelectedId });
  },
  
  toggleChatControl: (chatId) => {
    set((state) => ({
      chats: state.chats.map(chat =>
        chat.id === chatId
          ? { ...chat, isAIControlled: !chat.isAIControlled }
          : chat
      )
    }));
  },
  
  sendMessage: (chatId, content, sender) => {
    const message: WhatsAppMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      chatId,
      content,
      sender,
      timestamp: new Date().toISOString(),
      read: true,
      status: 'sent'
    };
    
    set((state) => ({
      chats: state.chats.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, message],
              lastMessageTime: message.timestamp,
              isTyping: false
            }
          : chat
      )
    }));
  },
  
  addMessage: (chatId, message) => {
    set((state) => ({
      chats: state.chats.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [...chat.messages, message],
              lastMessageTime: message.timestamp,
              unreadCount: chat.id !== state.selectedChatId ? chat.unreadCount + 1 : chat.unreadCount,
              isTyping: false
            }
          : chat
      )
    }));
  },
  
  markAsRead: (chatId) => {
    set((state) => ({
      chats: state.chats.map(chat =>
        chat.id === chatId
          ? { ...chat, unreadCount: 0 }
          : chat
      )
    }));
  },
  
  setTyping: (chatId, isTyping, typingUser) => {
    set((state) => ({
      chats: state.chats.map(chat =>
        chat.id === chatId
          ? { ...chat, isTyping, typingUser }
          : chat
      )
    }));
  },
  
  addBrigadaActivity: (activity) => {
    set((state) => ({
      brigadaActivities: [activity, ...state.brigadaActivities].slice(0, 50) // Mantener max 50
    }));
  },
  
  setBrigadaActivities: (activities) => set({ brigadaActivities: activities }),
  
  updateLeadName: (chatId, nombreReal) => {
    set((state) => ({
      chats: state.chats.map(chat => {
        if (chat.id !== chatId) return chat;
        
        const nombreCompleto = nombreReal.includes(' ') 
          ? nombreReal 
          : nombreReal;
        
        return {
          ...chat,
          lead: {
            ...chat.lead,
            nombre: nombreCompleto,
            nombreReal: nombreReal,
            email: `${nombreReal.toLowerCase().replace(/ /g, '.')}@${
              ['gmail.com', 'hotmail.com', 'outlook.com'][
                Math.floor(Math.random() * 3)
              ]
            }`
          }
        };
      })
    }));
  }
}));
