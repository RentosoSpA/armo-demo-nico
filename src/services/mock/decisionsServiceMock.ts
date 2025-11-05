import type { Decision, DecisionStats } from '../../types/decision';
import { simulateDelay } from './mockData';

const mockDecisions: Decision[] = [
  {
    id: '1',
    source: 'oportunidades',
    bear: 'curioso',
    title: 'Nuevos Prospectos Encontrados',
    message: 'Oso Curioso ha evaluado 1 prospecto. Por favor revísalo.',
    severity: 'info',
    href: '/oportunidades?filter=nuevos',
    requiresAction: true,
    count: 1,
    createdAt: new Date('2025-10-10T10:00:00'),
    read: false,
  },
  {
    id: '2',
    source: 'oportunidades',
    bear: 'cauteloso',
    title: 'Prospectos Calificados',
    message: 'Oso Cauteloso ha calificado 2 prospectos listos para revisión.',
    severity: 'warning',
    href: '/oportunidades?etapa=Calificacion',
    requiresAction: true,
    count: 2,
    createdAt: new Date('2025-10-10T11:30:00'),
    read: false,
  },
  {
    id: '3',
    source: 'cobros',
    bear: 'cuidadoso',
    title: 'Clientes en Riesgo de Atraso',
    message: 'Oso Cuidadoso detectó 3 clientes con cobros en riesgo.',
    severity: 'urgent',
    href: '/cobros?estado=Atrasado',
    requiresAction: true,
    count: 3,
    createdAt: new Date('2025-10-10T09:15:00'),
    read: false,
  },
];

export const getDecisionsByEmpresa = async (_empresaId: string): Promise<Decision[]> => {
  await simulateDelay(500);
  return mockDecisions.filter(d => !d.read);
};

export const getDecisionStats = async (_empresaId: string): Promise<DecisionStats> => {
  await simulateDelay(300);
  const unreadDecisions = mockDecisions.filter(d => !d.read);
  
  return {
    total: mockDecisions.length,
    unread: unreadDecisions.length,
    bySource: {
      oportunidades: unreadDecisions.filter(d => d.source === 'oportunidades').length,
      cobros: unreadDecisions.filter(d => d.source === 'cobros').length,
    },
    bySeverity: {
      info: unreadDecisions.filter(d => d.severity === 'info').length,
      warning: unreadDecisions.filter(d => d.severity === 'warning').length,
      urgent: unreadDecisions.filter(d => d.severity === 'urgent').length,
    },
  };
};

export const markDecisionAsRead = async (decisionId: string): Promise<void> => {
  await simulateDelay(200);
  const decision = mockDecisions.find(d => d.id === decisionId);
  if (decision) {
    decision.read = true;
  }
};

export const markAllDecisionsAsRead = async (): Promise<void> => {
  await simulateDelay(300);
  mockDecisions.forEach(d => d.read = true);
};
