import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { supabase } from "../integrations/supabase/client";
import { generateSessionId, createUserMessage } from "../utils/chatHelpers";
import { App } from "antd";

interface WorkspaceChatState {
  status: 'idle' | 'processing' | 'error';
  messages: WorkspaceChatMessage[];
  sessionId: string;
  isOpen: boolean;
  dataResults: any[] | null;
  dataType: 'propiedades' | 'oportunidades' | 'prospectos' | 'visitas' | 'cobros' | 'dashboard' | null;
  availableActions: string[];
}

interface WorkspaceChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  entities?: any;
  confidence?: number;
  dataResults?: any[];
  dataType?: string;
  actions?: string[];
}

export const useWorkspaceChat = () => {
  const { message: antdMessage } = App.useApp();
  const sessionIdRef = useRef<string>(generateSessionId());

  const [state, setState] = useState<WorkspaceChatState>({
    status: "idle",
    messages: [],
    sessionId: sessionIdRef.current,
    isOpen: false,
    dataResults: null,
    dataType: null,
    availableActions: []
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMessage = createUserMessage(text);
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        status: "processing",
      }));

      try {
        const { data, error } = await supabase.functions.invoke("rentoso-workspace-chat", {
          body: {
            message: text,
            sessionId: sessionIdRef.current,
            context: {
              currentRoute: window.location.pathname
            }
          },
        });

        if (error) throw error;

        const assistantMessage: WorkspaceChatMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'assistant',
          content: data.reply,
          timestamp: new Date(),
          intent: data.intent,
          entities: data.entities,
          confidence: data.confidence,
          dataResults: data.dataResults,
          dataType: data.dataType,
          actions: data.actions
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          status: "idle",
          dataResults: data.dataResults,
          dataType: data.dataType,
          availableActions: data.actions || []
        }));
      } catch (error) {
        console.error("Send message error:", error);
        antdMessage.error("Error al procesar el mensaje");

        const errorMessage: WorkspaceChatMessage = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'assistant',
          content: 'Lo siento, ocurrió un error. Por favor intenta nuevamente.',
          timestamp: new Date()
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
          status: "error",
        }));
      }
    },
    [antdMessage]
  );

  const executeAction = useCallback(
    async (action: string, item: any) => {
      console.log('Executing action:', action, 'on item:', item);
      antdMessage.info(`Acción "${action}" en desarrollo`);
    },
    [antdMessage]
  );

  const resetChat = useCallback(() => {
    const newSessionId = generateSessionId();
    sessionIdRef.current = newSessionId;

    setState({
      status: "idle",
      messages: [],
      sessionId: newSessionId,
      isOpen: state.isOpen,
      dataResults: null,
      dataType: null,
      availableActions: []
    });
  }, [state.isOpen]);

  const toggleChat = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const returnValue = useMemo(
    () => ({
      ...state,
      messagesEndRef,
      sendMessage,
      executeAction,
      resetChat,
      toggleChat,
    }),
    [state, sendMessage, executeAction, resetChat, toggleChat]
  );

  return returnValue;
};
