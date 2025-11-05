import React from 'react';
import { Badge } from 'antd';
import { CloseOutlined, MessageOutlined } from '@ant-design/icons';
import type { WhatsAppChat } from '../../types/whatsapp-chat';

interface ChatTabProps {
  chat?: WhatsAppChat;
  isActive: boolean;
  isTodosTab?: boolean;
  onClick: () => void;
  onClose?: () => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({ 
  chat, 
  isActive, 
  isTodosTab,
  onClick, 
  onClose 
}) => {
  const getShortName = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
  };
  
  return (
    <div 
      className={`chat-tab ${isActive ? 'chat-tab-active' : ''}`}
      onClick={onClick}
    >
      <div className="chat-tab-content">
        {isTodosTab ? (
          <>
            <MessageOutlined />
            <span>Todos los Chats</span>
          </>
        ) : chat ? (
          <>
            <Badge dot={chat.unreadCount > 0} offset={[-5, 5]}>
              <span>{getShortName(chat.lead.nombre)}</span>
            </Badge>
            {onClose && (
              <CloseOutlined 
                className="chat-tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              />
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};
