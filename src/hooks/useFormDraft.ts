import { useEffect, useRef, useCallback } from 'react';
import type { FormInstance } from 'antd';

interface UseFormDraftOptions {
  form: FormInstance;
  storageKey: string;
  ttlMs?: number; // Default: 7 días
  enabled?: boolean; // Default: true
}

interface DraftData {
  values: any;
  timestamp: number;
}

/**
 * Hook para persistir y restaurar borradores de formularios en sessionStorage
 * 
 * @example
 * const { clearDraft } = useFormDraft({
 *   form,
 *   storageKey: `rentoso:draft:propiedad:${userId}`,
 *   ttlMs: 7 * 24 * 60 * 60 * 1000, // 7 días
 * });
 * 
 * // Llamar clearDraft() al enviar exitosamente o cancelar
 */
export const useFormDraft = ({
  form,
  storageKey,
  ttlMs = 7 * 24 * 60 * 60 * 1000, // 7 días por defecto
  enabled = true,
}: UseFormDraftOptions) => {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isRestoringRef = useRef(false);

  // Restaurar borrador al montar
  useEffect(() => {
    if (!enabled) return;

    try {
      const savedData = sessionStorage.getItem(storageKey);
      if (!savedData) return;

      const draft: DraftData = JSON.parse(savedData);
      const isExpired = Date.now() - draft.timestamp > ttlMs;

      if (isExpired) {
        console.log('🗑️ Draft expired, removing:', storageKey);
        sessionStorage.removeItem(storageKey);
        return;
      }

      console.log('♻️ Restoring draft from sessionStorage:', storageKey, draft.values);
      isRestoringRef.current = true;
      form.setFieldsValue(draft.values);
      isRestoringRef.current = false;
    } catch (error) {
      console.error('Error restoring draft:', error);
      sessionStorage.removeItem(storageKey);
    }
  }, [form, storageKey, ttlMs, enabled]);

  // Guardar borrador con debounce
  const saveDraft = useCallback(
    (values: any) => {
      if (!enabled || isRestoringRef.current) return;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        try {
          const draftData: DraftData = {
            values,
            timestamp: Date.now(),
          };
          sessionStorage.setItem(storageKey, JSON.stringify(draftData));
          console.log('💾 Draft saved to sessionStorage:', storageKey);
        } catch (error) {
          console.error('Error saving draft:', error);
        }
      }, 500); // Debounce de 500ms
    },
    [storageKey, enabled]
  );

  // Trigger manual save on demand
  // Note: Ant Design forms don't have a built-in onChange listener for all fields
  // We rely on the consumer to call saveDraft manually or use onValuesChange
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Limpiar borrador
  const clearDraft = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey);
      console.log('🗑️ Draft cleared:', storageKey);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, [storageKey]);

  return {
    clearDraft,
    saveDraft, // Expuesto por si se necesita guardar manualmente
  };
};
