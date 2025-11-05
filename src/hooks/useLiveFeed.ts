import { useEffect, useMemo, useRef, useState } from 'react';
import type { ActivityEvent } from '../types/activity';
import { startMockActivityStream } from '../utils/mockActivityStream';

type Options = { maxItems?: number };

// Actividades iniciales precargadas
const getInitialActivities = (): ActivityEvent[] => {
  const agents = ['Oso Curioso', 'Oso Cauteloso', 'Oso Notarioso', 'Oso Cuidadoso', 'OptimizOso'];
  const activities = [
    { agent: 'Oso Curioso', desc: 'WhatsApp enviado a 5 nuevos leads - Propiedades Ñuñoa', status: 'Completado' },
    { agent: 'Oso Cauteloso', desc: 'Evaluación de prospecto completada - Score: 8.5/10', status: 'Completado' },
    { agent: 'Oso Notarioso', desc: 'Contrato de arriendo generado - Depto. Las Condes', status: 'Completado' },
    { agent: 'Oso Cuidadoso', desc: 'Recordatorios de pago enviados a 8 arrendatarios', status: 'Completado' },
    { agent: 'OptimizOso', desc: 'Análisis de mercado completado - 12 propiedades evaluadas', status: 'Completado' },
    { agent: 'Oso Curioso', desc: 'Nuevo prospecto detectado - María González, Providencia', status: 'En proceso' },
    { agent: 'Oso Cauteloso', desc: 'Verificación de documentos en proceso - Cliente Pérez', status: 'En proceso' },
    { agent: 'Oso Notarioso', desc: 'Preparando orden de visita - Oficina Vitacura', status: 'En proceso' },
    { agent: 'Oso Cuidadoso', desc: 'Seguimiento de mora iniciado - 2 casos detectados', status: 'Pendiente' },
    { agent: 'OptimizOso', desc: 'Oportunidad detectada: Ajuste de precio +10% en Ñuñoa', status: 'Pendiente' },
    { agent: 'Oso Curioso', desc: 'Follow-up automático programado para mañana', status: 'Pendiente' },
    { agent: 'Oso Cauteloso', desc: 'Checklist de documentos: 4 de 6 completados', status: 'En proceso' },
  ];
  
  const now = Date.now();
  return activities.map((act, i) => ({
    id: `initial-${i}`,
    agent: act.agent as ActivityEvent['agent'],
    status: act.status as ActivityEvent['status'],
    description: act.desc,
    timestamp: new Date(now - (activities.length - i) * 60000).toISOString(), // 1 min entre cada uno
  }));
};

export function useLiveFeed({ maxItems = 50 }: Options = {}) {
  const [events, setEvents] = useState<ActivityEvent[]>(getInitialActivities());
  const [connected, setConnected] = useState<boolean>(false);
  const wsRef = useRef<WebSocket | null>(null);
  const stopMockRef = useRef<(() => void) | null>(null);
  const url = useMemo(() => import.meta.env.VITE_WS_ACTIVITIES_URL, []);

  useEffect(() => {
    let retries = 0;
    const connectWS = () => {
      if (!url) {
        // No URL → fallback inmediato
        setConnected(false);
        stopMockRef.current = startMockActivityStream(push);
        return;
      }
      try {
        wsRef.current = new WebSocket(url);
        wsRef.current.onopen = () => {
          setConnected(true);
          // Detén mock si estuviera activo
          stopMockRef.current?.();
          stopMockRef.current = null;
        };
        wsRef.current.onmessage = (msg) => {
          try {
            const payload = JSON.parse(msg.data as string) as ActivityEvent;
            push(payload);
          } catch { /* ignora mensajes no conformes */ }
        };
        wsRef.current.onclose = () => {
          setConnected(false);
          // fallback + reconexión exponencial
          if (!stopMockRef.current) {
            stopMockRef.current = startMockActivityStream(push);
          }
          const wait = Math.min(1000 * 2 ** retries, 15000);
          retries += 1;
          setTimeout(connectWS, wait);
        };
        wsRef.current.onerror = () => wsRef.current?.close();
      } catch {
        setConnected(false);
        stopMockRef.current = startMockActivityStream(push);
      }
    };

    const push = (e: ActivityEvent) => {
      setEvents(prev => {
        const next = [e, ...prev];
        if (next.length > maxItems) next.pop();
        return next;
      });
    };

    connectWS();
    return () => {
      wsRef.current?.close();
      stopMockRef.current?.();
    };
  }, [url, maxItems]);

  return { events, connected };
}
