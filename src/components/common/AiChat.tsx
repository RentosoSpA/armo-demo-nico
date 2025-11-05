import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Card, Avatar, Spin } from 'antd';
import { MinusOutlined, SendOutlined, ReloadOutlined } from '@ant-design/icons';
import type { Message } from '../../types/chat';
import RentosoIcon from '../../assets/RentosoIcon';

const { TextArea } = Input;

interface AiChatProps {
  webhookUrl: string;
  title?: string;
  placeholder?: string;
  context?: string;
}

const AiChat: React.FC<AiChatProps> = ({
  webhookUrl,
  title = 'AI Assistant',
  placeholder = 'Type your message...',
  context = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatId = useRef(Date.now().toString());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      context: context,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    inputRef.current?.focus();
    setIsLoading(true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: chatId.current,
          message: userMessage.content,
          context: context,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.output || "Sorry, I couldn't process your request.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const resetChat = () => {
    setMessages([]);
    setInputValue('');
  };

  return (
    <div className="ai-chat-container">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<RentosoIcon size={24} color="#ffffff" />}
          onClick={toggleChat}
          className="ai-chat-toggle-button"
        />
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card
          className="ai-chat-window"
        >
          {/* Header */}
          <div className="ai-chat-header">
            <div className="header-info">
              <Avatar
                icon={<RentosoIcon size={16} color="#ffffff" />}
                className="header-avatar"
              />
              <span className="header-title">{title}</span>
            </div>
            <div className="header-actions">
              <Button
                type="text"
                icon={<ReloadOutlined />}
                onClick={resetChat}
                size="small"
                title="Reset chat"
              />
              <Button
                type="text"
                icon={<MinusOutlined />}
                onClick={toggleChat}
                size="small"
                title="Minimize chat"
              />
            </div>
          </div>

          {/* Messages */}
          <div className="ai-chat-messages">
            {messages.length === 0 && (
              <div className="welcome-message">
                <div className="welcome-icon">
                  <RentosoIcon size={48} color="#8c8c8c" />
                </div>
                <p>
                  Hola! Soy Oso Curioso, un asistente de IA que te puede ayudar con cualquier
                  pregunta.
                </p>
              </div>
            )}

            {messages.map(msg => (
              <div
                key={msg.id}
                className={`message-wrapper ${msg.sender === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className={`message-bubble ${msg.sender}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="typing-indicator">
                <div className="typing-bubble">
                  <Spin size="small" />
                  <span className="typing-text">AI is typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="ai-chat-input-area">
            <div className="input-wrapper">
              <TextArea
                ref={inputRef}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                autoSize={{ minRows: 1, maxRows: 4 }}
                className="input-textarea"
                disabled={isLoading}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="send-button"
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AiChat;
