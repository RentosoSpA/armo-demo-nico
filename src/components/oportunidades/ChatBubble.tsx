import React from 'react';
import type { WhatsAppMessage } from '../../types/whatsapp-chat';

interface ChatBubbleProps {
  message: WhatsAppMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isLead = message.sender === 'lead';
  const isCurioso = message.sender === 'curioso';
  const isAgent = message.sender === 'agent';
  
  const bubbleClass = isLead 
    ? 'chat-bubble chat-bubble-lead'
    : isCurioso
    ? 'chat-bubble chat-bubble-curioso'
    : 'chat-bubble chat-bubble-agent';
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className={`chat-bubble-wrapper ${isLead ? 'justify-start' : 'justify-end'}`}>
      <div className={bubbleClass}>
        <div className="chat-bubble-content">{message.content}</div>
        <div className="chat-bubble-meta">
          <span className="chat-bubble-time">{formatTime(message.timestamp)}</span>
          {!isLead && (
            <span className="chat-bubble-status">
              {message.status === 'read' ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
