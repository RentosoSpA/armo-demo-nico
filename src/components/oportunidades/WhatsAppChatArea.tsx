import React from 'react';
import { Empty } from 'antd';
import { ChatTab } from './ChatTab';
import { WhatsAppChatView } from './WhatsAppChatView';
import { LeadChatCard } from './LeadChatCard';
import { useWhatsAppChatStore } from '../../store/whatsappChatStore';

export const WhatsAppChatArea: React.FC = () => {
  const { chats, selectedChatId, openTabs, selectChat, openChatTab, closeChatTab } = useWhatsAppChatStore();
  
  const selectedChat = chats.find(c => c.id === selectedChatId);
  const isTodosTab = selectedChatId === 'todos' || selectedChatId === null;
  
  return (
    <div className="whatsapp-chat-area">
      <div className="chat-tabs-container">
        <ChatTab
          isTodosTab
          isActive={isTodosTab}
          onClick={() => selectChat('todos')}
        />
        
        {openTabs
          .filter(tabId => tabId !== 'todos')
          .map(tabId => {
            const chat = chats.find(c => c.id === tabId);
            if (!chat) return null;
            
            return (
              <ChatTab
                key={tabId}
                chat={chat}
                isActive={selectedChatId === tabId}
                onClick={() => selectChat(tabId)}
                onClose={() => closeChatTab(tabId)}
              />
            );
          })}
      </div>
      
      <div className="chat-content-container">
        {isTodosTab ? (
          <div className="todos-chats-view">
            <div className="todos-chats-header">
              <div className="todos-header-content">
                <div className="header-text">
                  <h2>Todos los Chats</h2>
                  <span className="chats-count">{chats.length} conversaciones</span>
                </div>
              </div>
            </div>
            
            <div className="todos-chats-list">
              {chats.length === 0 ? (
                <Empty description="No hay chats disponibles" />
              ) : (
                chats.map(chat => (
                  <LeadChatCard
                    key={chat.id}
                    chat={chat}
                    onClick={() => openChatTab(chat.id)}
                  />
                ))
              )}
            </div>
          </div>
        ) : selectedChat ? (
          <WhatsAppChatView chat={selectedChat} />
        ) : (
          <Empty description="Selecciona un chat" />
        )}
      </div>
    </div>
  );
};
