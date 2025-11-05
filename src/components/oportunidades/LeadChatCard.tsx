import React from 'react';
import { Badge, Tag, Avatar } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import type { WhatsAppChat } from '../../types/whatsapp-chat';

interface LeadChatCardProps {
  chat: WhatsAppChat;
  onClick: () => void;
}

export const LeadChatCard: React.FC<LeadChatCardProps> = ({ chat, onClick }) => {
  const lastMessage = chat.messages[chat.messages.length - 1];
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'aceptado': return 'Aceptado';
      case 'activo': return 'Activo';
      case 'en_espera': return 'En Espera';
      case 'rechazado': return 'Rechazado';
      case 'sin_respuesta': return 'Sin Respuesta';
      default: return status;
    }
  };
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `hace ${diffMins}m`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    return `hace ${diffDays}d`;
  };
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  return (
    <div className="lead-chat-card" onClick={onClick}>
      {/* Avatar con badge de unread */}
      <div className="lead-avatar-container">
        <Badge 
          count={chat.unreadCount} 
          offset={[-5, 5]}
          style={{ 
            backgroundColor: '#ff4d4f',
            fontWeight: 700,
            fontSize: '11px'
          }}
        >
          <Avatar 
            size={48} 
            style={{ 
              backgroundColor: '#1890ff',
              fontSize: '18px',
              fontWeight: 700
            }}
          >
            {getInitials(chat.lead.nombre)}
          </Avatar>
        </Badge>
      </div>
      
      {/* Info principal */}
      <div className="lead-chat-content">
        {/* Header con nombre y timestamp */}
        <div className="lead-chat-header">
          <span className="lead-name">{chat.lead.nombre}</span>
          <span className="lead-timestamp">{formatTime(lastMessage?.timestamp)}</span>
        </div>
        
        {/* Último mensaje */}
        <div className="lead-last-message">
          {chat.isTyping ? (
            <span className="typing-text">Escribiendo...</span>
          ) : (
            <>
              {lastMessage?.sender === 'curioso' && '🐻 '}
              {lastMessage?.content}
            </>
          )}
        </div>
        
        {/* Badges row */}
        <div className="lead-badges-row">
          {/* Status badge */}
          <span className={`status-badge status-${chat.status.replace('_', '-')}`}>
            {getStatusText(chat.status).toUpperCase()}
          </span>
          
          {/* Control badge (CuriOso/Agente) */}
          <span className={`control-badge ${chat.isAIControlled ? 'curioso' : 'agente'}`}>
            {chat.isAIControlled ? '🐻 CuriOso' : '👤 Agente'}
          </span>
          
          {/* Match percentage (solo si evaluado) */}
          {chat.lead.journeyStage === 'evaluado' && chat.lead.matchPercentage && (
            <span className="match-badge">
              Match: {chat.lead.matchPercentage}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
