import React, { memo } from 'react';
import { Avatar } from 'antd';
import { User, Bot } from 'lucide-react';
import type { ChatMessage } from '../../types/rentoso';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubbleComponent: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.type === 'user';

  return (
    <div className={`message-wrapper ${isUser ? 'user-message' : 'ai-message'}`}>
      {!isUser && (
        <Avatar 
          size={32} 
          icon={<Bot size={18} />}
          style={{ backgroundColor: 'var(--color-primary)', flexShrink: 0 }}
        />
      )}
      <div className={`message-bubble ${isUser ? 'user' : 'ai'}`}>
        <div className="message-content">{message.content}</div>
        <div className="message-time">
          {message.timestamp.toLocaleTimeString('es-CL', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
      {isUser && (
        <Avatar 
          size={32} 
          icon={<User size={18} />}
          style={{ backgroundColor: '#0f133d', flexShrink: 0 }}
        />
      )}
    </div>
  );
};

const MessageBubble = memo(MessageBubbleComponent);
MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
