import React, { useEffect, useRef, useState } from 'react';
import { Input, Button, Switch, Avatar, Tag } from 'antd';
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons';
import { ChatBubble } from './ChatBubble';
import { LeadScoringCard } from './LeadScoringCard';
import { LeadJourneyTimeline } from './LeadJourneyTimeline';
import { useWhatsAppChatStore } from '../../store/whatsappChatStore';
import type { WhatsAppChat } from '../../types/whatsapp-chat';

const { TextArea } = Input;

interface WhatsAppChatViewProps {
  chat: WhatsAppChat;
}

export const WhatsAppChatView: React.FC<WhatsAppChatViewProps> = ({ chat }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialMount, setIsInitialMount] = useState(true);
  const { toggleChatControl, sendMessage, markAsRead } = useWhatsAppChatStore();
  
  useEffect(() => {
    // Solo auto-scroll cuando llega un mensaje nuevo Y el usuario está cerca del final
    if (!isInitialMount && messagesEndRef.current && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isNearBottom = 
        container.scrollHeight - container.scrollTop - container.clientHeight < 100;
      
      // Solo hacer scroll si el usuario está viendo los últimos mensajes
      if (isNearBottom) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }
    }
    
    markAsRead(chat.id);
    
    if (isInitialMount) {
      setIsInitialMount(false);
    }
  }, [chat.messages, isInitialMount, markAsRead, chat.id]);

  // useEffect separado para scroll inicial cuando se abre un chat
  useEffect(() => {
    setIsInitialMount(true);
    
    // Aumentar el delay para asegurar que el DOM esté completamente renderizado
    const timer = setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'instant'
        });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [chat.id]);
  
  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(chat.id, message, 'agent');
    setMessage('');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aceptado': return 'success';
      case 'activo': return 'processing';
      case 'en_espera': return 'warning';
      case 'rechazado': return 'error';
      case 'sin_respuesta': return 'default';
      default: return 'default';
    }
  };
  
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
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };
  
  return (
    <div className="whatsapp-chat-view">
      <div className="chat-view-header">
        <div className="chat-view-header-left">
          <Avatar 
            size={48} 
            style={{ 
              backgroundColor: '#1890ff',
              fontSize: '20px',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
            }}
          >
            {getInitials(chat.lead.nombre)}
          </Avatar>
          <div className="chat-view-header-info">
            <h3 className="chat-view-header-name">{chat.lead.nombre}</h3>
            <Tag 
              color={getStatusColor(chat.status)}
              style={{ margin: 0, fontSize: '11px', fontWeight: 600 }}
            >
              {getStatusText(chat.status).toUpperCase()}
            </Tag>
          </div>
        </div>
        
        <div className="chat-view-header-right">
          <div className={`control-toggle ${chat.isAIControlled ? 'ai-mode' : 'human-mode'}`}>
            {chat.isAIControlled ? (
              <>
                <RobotOutlined />
                <span>CuriOso</span>
              </>
            ) : (
              <>
                <UserOutlined />
                <span>Agente</span>
              </>
            )}
            <Switch
              checked={!chat.isAIControlled}
              onChange={() => toggleChatControl(chat.id)}
              size="small"
            />
          </div>
        </div>
      </div>
      
      {/* 🐻 TIMELINE DE JOURNEY - NUEVO */}
      <LeadJourneyTimeline currentStage={chat.lead.journeyStage} />
      
      {chat.lead.journeyStage === 'evaluado' && chat.lead.matchPercentage ? (
        <div className="chat-view-scoring">
          <LeadScoringCard lead={chat.lead} />
        </div>
      ) : (chat.lead.journeyStage === 'docs_solicitados' || chat.lead.journeyStage === 'docs_enviados') ? (
        <div className="chat-view-scoring">
          <div style={{ 
            padding: '12px', 
            background: '#fff3cd', 
            borderRadius: '8px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#856404',
            border: '1px solid #ffeeba'
          }}>
            ⏳ Evaluación pendiente
          </div>
        </div>
      ) : null}
      
      <div className="chat-view-messages" ref={messagesContainerRef}>
        {chat.messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        
        {chat.isTyping && (
          <div className="typing-indicator-wrapper">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="typing-text">
              {chat.typingUser === 'lead' ? chat.lead.nombre : 'CuriOso'} está escribiendo...
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-view-input">
        {chat.isAIControlled ? (
          <div className="chat-input-disabled">
            <RobotOutlined /> CuriOso está respondiendo automáticamente...
          </div>
        ) : (
          <div className="chat-input-enabled">
            <TextArea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Escribe un mensaje..."
              autoSize={{ minRows: 1, maxRows: 4 }}
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSend}
              disabled={!message.trim()}
            >
              Enviar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
