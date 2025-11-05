import type { BrigadaActivity } from '../../types/whatsapp-chat';

const OSO_AGENTS = ['CuriOso', 'Oso Cauteloso', 'Oso Notarioso', 'Oso Cuidadoso', 'OptimizOso'] as const;

const OSO_ICONS = {
  'CuriOso': '🔍',
  'Oso Cauteloso': '⚖️',
  'Oso Notarioso': '📋',
  'Oso Cuidadoso': '🏠',
  'OptimizOso': '📊'
};

const OSO_ACTIONS = {
  'CuriOso': [
    'Contactó a {lead}',
    'Respondió a {lead}',
    'Envió información a {lead}',
    'Inició conversación con {lead}'
  ],
  'Oso Cauteloso': [
    'Calificó a {lead}',
    'Evaluó documentos de {lead}',
    'Analizó perfil de {lead}',
    'Verificó antecedentes de {lead}'
  ],
  'Oso Notarioso': [
    'Verificó datos de {lead}',
    'Solicitó documentos a {lead}',
    'Validó información de {lead}',
    'Revisó documentación de {lead}'
  ],
  'Oso Cuidadoso': [
    'Coordinó visita con {lead}',
    'Confirmó disponibilidad con {lead}',
    'Agendó visita para {lead}',
    'Preparó visita de {lead}'
  ],
  'OptimizOso': [
    'Optimizó propuesta para {lead}',
    'Analizó scoring de {lead}',
    'Calculó match de {lead}',
    'Generó recomendación para {lead}'
  ]
};

export function generateBrigadaActivity(
  leadName: string,
  propiedadTitulo: string,
  minutesAgo: number
): BrigadaActivity {
  const agent = OSO_AGENTS[Math.floor(Math.random() * OSO_AGENTS.length)];
  const actions = OSO_ACTIONS[agent];
  const action = actions[Math.floor(Math.random() * actions.length)].replace('{lead}', leadName);
  
  const timestamp = new Date(Date.now() - minutesAgo * 60 * 1000).toISOString();
  
  const statuses: Array<'success' | 'pending' | 'warning'> = ['success', 'success', 'success', 'pending', 'warning'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    agentName: agent,
    action,
    leadName,
    propiedadTitulo,
    timestamp,
    status,
    icon: OSO_ICONS[agent]
  };
}

export function generateInitialActivities(
  leads: Array<{ nombre: string; propiedadTitulo: string }>,
  count: number = 40
): BrigadaActivity[] {
  const activities: BrigadaActivity[] = [];
  
  for (let i = 0; i < count; i++) {
    const lead = leads[Math.floor(Math.random() * leads.length)];
    const minutesAgo = Math.floor(Math.random() * 240); // Últimas 4 horas
    
    activities.push(generateBrigadaActivity(lead.nombre, lead.propiedadTitulo, minutesAgo));
  }
  
  // Ordenar por timestamp descendente (más recientes primero)
  return activities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}
