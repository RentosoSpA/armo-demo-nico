import React, { useState, memo, useCallback } from "react";
import { Input, Button, Spin, Modal, Drawer } from "antd";
import { X, Send, RotateCcw } from "lucide-react";
import { useWorkspaceChat } from "../../hooks/useWorkspaceChat";
import { ChatDataDisplay } from "../workspace-chat/ChatDataDisplay";
import { useMobile } from "../../hooks/useMobile";
import MessageBubble from "./MessageBubble";
import RentosoLogo from "../../assets/Rentoso_iso_gris.svg";
import "./RentosoChat.scss";

const { TextArea } = Input;

interface RentosoChatProps {
  open: boolean;
  onClose: () => void;
}

const RentosoChatComponent: React.FC<RentosoChatProps> = ({ open, onClose }) => {
  const isMobile = useMobile();
  const [inputValue, setInputValue] = useState("");
  const { status, messages, messagesEndRef, sendMessage, executeAction, resetChat } =
    useWorkspaceChat();

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || status === "processing") return;

    await sendMessage(inputValue);
    setInputValue("");
  }, [inputValue, status, sendMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );


  const handleReset = useCallback(() => {
    resetChat();
  }, [resetChat]);

  const chatContent = (
    <div className="rentoso-chat-content">
      <div className="chat-header">
        <div className="header-info">
          <div className="header-logo">
            <img src={RentosoLogo} alt="Rentoso" />
          </div>
          <div>
            <h3>Habla con Rentoso</h3>
            <span className="header-subtitle">Tu asistente virtual</span>
          </div>
        </div>
        <div className="header-actions">
          <Button
            type="text"
            size="small"
            icon={<RotateCcw size={16} />}
            onClick={handleReset}
            disabled={messages.length === 0}
          />
          <Button type="text" size="small" icon={<X size={16} />} onClick={onClose} />
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">
              <img src={RentosoLogo} alt="Rentoso" />
            </div>
            <p>¡Hola! Soy Rentoso, tu asistente virtual.</p>
            <p className="welcome-subtitle">Puedo ayudarte a consultar propiedades, oportunidades, visitas, cobros y más.</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id}>
            <MessageBubble message={message} />

            {message.dataResults && (
              <div style={{ marginLeft: message.type === "assistant" ? 40 : 0, marginTop: 8 }}>
                <ChatDataDisplay
                  dataType={message.dataType as any}
                  data={message.dataResults}
                  actions={message.actions || []}
                  onAction={executeAction}
                />
              </div>
            )}
          </div>
        ))}

        {status === "processing" && (
          <div className="status-indicator">
            <Spin size="small" />
            <span>Procesando...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="input-wrapper">
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu consulta... (ej: ¿Cuántas propiedades disponibles tengo?)"
            autoSize={{ minRows: 1, maxRows: 3 }}
            disabled={status === "processing"}
            className="input-textarea"
          />
          <div className="input-actions">
            <Button
              type="primary"
              icon={<Send size={18} />}
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || status === "processing"}
              className="send-button"
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Modal
        open={open}
        onCancel={onClose}
        footer={null}
        width="100%"
        style={{ top: 0, maxWidth: "100vw", padding: 0 }}
        bodyStyle={{ height: "100vh", padding: 0 }}
        className="rentoso-chat-modal"
        closable={false}
      >
        {chatContent}
      </Modal>
    );
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={400}
      closable={false}
      className="rentoso-chat-drawer"
      styles={{ body: { padding: 0 } }}
    >
      {chatContent}
    </Drawer>
  );
};

// Memoize component to prevent unnecessary re-renders
const RentosoChat = memo(RentosoChatComponent);
RentosoChat.displayName = "RentosoChat";

export default RentosoChat;
