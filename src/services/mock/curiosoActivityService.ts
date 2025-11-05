import dayjs from 'dayjs';
import type { CuriosoActivity } from '../../components/Calendario/CuriosoActivityFeed';
import type { CuriosoStatus } from '../../components/Calendario/CuriosoStatusBadge';
import type { Visita } from '../../types/visita';

// Mock data for CuriOso activities
const MOCK_PROSPECTOS = [
  'Juan Pérez',
  'María López',
  'Carlos Ruiz',
  'Ana García',
  'Roberto Silva',
  'Sofía Martínez',
  'Diego Torres',
  'Carolina Vargas',
];

const MOCK_PROPIEDADES = [
  'Casa en Surco',
  'Depto en Miraflores',
  'Villa en San Miguel',
  'Oficina en San Isidro',
  'Local en La Molina',
  'Casa en Magdalena',
  'Depto en Jesús María',
  'Terreno en Ate',
];

// Generate realistic activities for October and mid-November 2025
const generateActivities = (count: number = 30): CuriosoActivity[] => {
  const activities: CuriosoActivity[] = [];
  const types: CuriosoActivity['type'][] = ['scheduling', 'confirmed', 'rescheduled', 'waiting_response', 'cancelled'];
  
  // Generate activities spread across October and November 2025
  const baseDate = dayjs('2025-10-01');
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = type === 'scheduling' ? 'in_progress' : 
                   type === 'waiting_response' ? 'pending' : 'completed';
    
    // Spread activities across 45 days (October + half November)
    const daysOffset = Math.floor(i * (45 / count));
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    
    activities.push({
      id: `activity-${i}`,
      type,
      prospecto: MOCK_PROSPECTOS[Math.floor(Math.random() * MOCK_PROSPECTOS.length)],
      propiedad: MOCK_PROPIEDADES[Math.floor(Math.random() * MOCK_PROPIEDADES.length)],
      timestamp: baseDate.add(daysOffset, 'day').hour(randomHours).minute(randomMinutes).toISOString(),
      status,
      metadata: type === 'rescheduled' ? {
        previousDate: baseDate.add(daysOffset - 2, 'day').toISOString(),
        reason: 'El prospecto solicitó cambio de horario',
      } : undefined,
    });
  }

  return activities.sort((a, b) => dayjs(b.timestamp).diff(dayjs(a.timestamp)));
};

let cachedActivities: CuriosoActivity[] | null = null;

export const getCuriosoActivities = async (
  dateRange?: { start: string; end: string }
): Promise<CuriosoActivity[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  if (!cachedActivities) {
    cachedActivities = generateActivities(50);
  }

  if (dateRange) {
    return cachedActivities.filter(activity => {
      const timestamp = dayjs(activity.timestamp);
      return timestamp.isAfter(dayjs(dateRange.start)) && 
             timestamp.isBefore(dayjs(dateRange.end));
    });
  }

  return cachedActivities;
};

export const getCuriosoStatus = async (): Promise<CuriosoStatus> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Determine status based on recent activities
  if (!cachedActivities) {
    cachedActivities = generateActivities(50);
  }

  const recentActivities = cachedActivities.filter(a => 
    dayjs(a.timestamp).isAfter(dayjs().subtract(30, 'minute'))
  );

  if (recentActivities.some(a => a.type === 'scheduling')) {
    return 'activo';
  }

  if (recentActivities.some(a => a.type === 'waiting_response')) {
    return 'esperando';
  }

  if (recentActivities.length > 0) {
    return 'analizando';
  }

  return 'inactivo';
};

export const getRecentActions = async (limit: number = 5): Promise<CuriosoActivity[]> => {
  const activities = await getCuriosoActivities();
  return activities.slice(0, limit);
};

// Enhance visitas with CuriOso data
export const enhanceVisitasWithCuriosoData = (visitas: Visita[]): Visita[] => {
  return visitas.map((visita, index) => {
    // Randomly mark some as scheduled by CuriOso (60% probability)
    const agendadaPorCurioso = Math.random() > 0.4;
    
    return {
      ...visita,
      agendadaPorCurioso,
      estadoCurioso: agendadaPorCurioso ? (
        visita.estado === 'Aprobada' ? 'confirmada' : 
        visita.estado === 'Agendada' ? 'esperando_confirmacion' : 
        'agendando'
      ) : undefined,
      ultimaActividad: agendadaPorCurioso ? 
        dayjs().subtract(Math.floor(Math.random() * 120), 'minute').toISOString() : 
        undefined,
      prospectoInfo: {
        id: `prospecto-${index}`,
        nombre: MOCK_PROSPECTOS[index % MOCK_PROSPECTOS.length],
        telefono: `+51 9${Math.floor(10000000 + Math.random() * 90000000)}`,
        email: `${MOCK_PROSPECTOS[index % MOCK_PROSPECTOS.length].toLowerCase().replace(' ', '.')}@email.com`,
      } as any,
      notasCurioso: agendadaPorCurioso ? 
        `Prospecto mostró interés en ${visita.propiedad}. Conversación positiva vía WhatsApp.` : 
        undefined,
    };
  });
};

// Get statistics for dashboard
export interface CuriosoStats {
  visitasAgendadasHoy: number;
  visitasEstaSemana: number;
  porcentajeAgendadasPorCurioso: number;
  tasaConfirmacion: number;
}

export const getCuriosoStats = async (visitas: Visita[]): Promise<CuriosoStats> => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const today = dayjs();
  const visitasHoy = visitas.filter(v => dayjs(v.fecha_inicio).isSame(today, 'day'));
  const visitasSemana = visitas.filter(v => 
    dayjs(v.fecha_inicio).isAfter(today.startOf('week')) &&
    dayjs(v.fecha_inicio).isBefore(today.endOf('week'))
  );
  
  const agendadasPorCurioso = visitas.filter(v => (v as any).agendadaPorCurioso).length;
  const confirmadas = visitas.filter(v => 
    (v as any).agendadaPorCurioso && 
    (v.estado === 'Aprobada' || v.estado === 'Completada')
  ).length;

  return {
    visitasAgendadasHoy: visitasHoy.length,
    visitasEstaSemana: visitasSemana.length,
    porcentajeAgendadasPorCurioso: visitas.length > 0 
      ? Math.round((agendadasPorCurioso / visitas.length) * 100) 
      : 0,
    tasaConfirmacion: agendadasPorCurioso > 0 
      ? Math.round((confirmadas / agendadasPorCurioso) * 100) 
      : 0,
  };
};
