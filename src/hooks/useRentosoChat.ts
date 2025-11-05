import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { supabase } from "../integrations/supabase/client";
import type { ChatState } from "../types/rentoso";
import { generateSessionId, createUserMessage, createAssistantMessage } from "../utils/chatHelpers";
import { App } from "antd";

export const useRentosoChat = () => {
  const { message: antdMessage } = App.useApp();

  // ✅ Usar useRef para sessionId (no cambia entre renders)
  const sessionIdRef = useRef<string>(generateSessionId());

  const [state, setState] = useState<ChatState>({
    status: "idle",
    messages: [],
    sessionId: sessionIdRef.current,
    isOpen: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [state.messages, scrollToBottom]);

  const transcribeAudio = useCallback(
    async (audioBase64: string): Promise<string> => {
      setState((prev) => ({ ...prev, status: "transcribing" }));

      try {
        const base64Data = audioBase64.split(",")[1] || audioBase64;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const audioBlob = new Blob([byteArray], { type: "audio/wav" });

        const formData = new FormData();
        formData.append("file", audioBlob, "audio.wav");

        const { data, error } = await supabase.functions.invoke("transcribe-audio", {
          body: formData,
        });

        if (error) throw error;
        if (!data?.text) throw new Error("No transcription received");

        return data.text;
      } catch (error) {
        console.error("Transcription error:", error);
        antdMessage.error("Error al transcribir el audio");
        setState((prev) => ({ ...prev, status: "error" }));
        throw error;
      }
    },
    [antdMessage],
  );

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
        console.log("[SEND] Using session_id:", sessionIdRef.current); // ✅ Log para debug

        const { data, error } = await supabase.functions.invoke("rentoso-chat", {
          body: {
            text: text,
            session_id: sessionIdRef.current, // ✅ Usar el ref
          },
        });

        if (error) throw error;

        // ✅ Actualizar el sessionId con el que devuelve el backend
        if (data?.session_id && data.session_id !== sessionIdRef.current) {
          console.log("[SEND] Updating session_id from backend:", data.session_id);
          sessionIdRef.current = data.session_id;
          setState((prev) => ({ ...prev, sessionId: data.session_id }));
        }

        const assistantMessage = createAssistantMessage(data.reply, {
          intent: data.intent,
          entities: data.entities,
          visits: data.visits,
          readyForConfirmation: data.readyForConfirmation,
          propertyData: data.propertyData,
          needsInfo: data.needsInfo,
        });

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          status: data.readyForConfirmation ? "confirming" : "idle",
        }));
      } catch (error) {
        console.error("Send message error:", error);
        antdMessage.error("Error al procesar el mensaje");

        const errorMessage = createAssistantMessage("Lo siento, ocurrió un error. Por favor intenta nuevamente.");

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
          status: "error",
        }));
      }
    },
    [antdMessage], // ✅ Ya no necesita state.sessionId como dependencia
  );

  const createProperty = useCallback(
    async (propertyData: any, ownerData: any, images: Array<{ data: string; name: string }>) => {
      setState((prev) => ({ ...prev, status: "creating" }));

      try {
        const { data, error } = await supabase.functions.invoke("submit-property", {
          body: {
            session_id: sessionIdRef.current, // ✅ Usar el ref
            propertyData,
            ownerData: {
              name: ownerData.nombre,
              email: ownerData.email,
              phone: ownerData.telefono,
              codigo_telefonico: String(ownerData.codigo_telefonico),
              tipo_documento: ownerData.tipo_documento,
              documento: ownerData.documento,
            },
            images,
          },
        });

        if (error) throw error;
        if (!data?.success) throw new Error(data?.error || "Failed to create property");

        antdMessage.success("¡Propiedad creada exitosamente!");

        const successMessage = createAssistantMessage(
          `¡Excelente! La propiedad ha sido cargada correctamente. Se subieron ${data.imagesUploaded} imagen(es). ¿Hay algo más en lo que pueda ayudarte?`,
        );

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, successMessage],
          status: "idle",
        }));

        return data;
      } catch (error) {
        console.error("Create property error:", error);
        antdMessage.error("Error al crear la propiedad");

        const errorMessage = createAssistantMessage(
          "Hubo un error al cargar la propiedad. Por favor intenta nuevamente.",
        );

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
          status: "error",
        }));

        throw error;
      }
    },
    [antdMessage],
  );

  const resetChat = useCallback(() => {
    const newSessionId = generateSessionId(); // ✅ Generar nuevo ID
    sessionIdRef.current = newSessionId; // ✅ Actualizar el ref

    setState({
      status: "idle",
      messages: [],
      sessionId: newSessionId, // ✅ Actualizar el state
      isOpen: state.isOpen,
    });
  }, [state.isOpen]);

  const toggleChat = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const returnValue = useMemo(
    () => ({
      ...state,
      messagesEndRef,
      transcribeAudio,
      sendMessage,
      createProperty,
      resetChat,
      toggleChat,
    }),
    [state, transcribeAudio, sendMessage, createProperty, resetChat, toggleChat],
  );

  return returnValue;
};
