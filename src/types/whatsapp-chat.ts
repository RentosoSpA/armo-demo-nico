export interface WhatsAppMessage {
  id: string;
  chatId: string;
  content: string;
  sender: 'lead' | 'curioso' | 'agent';
  timestamp: string;
  read: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export type ChatStatus = 'activo' | 'en_espera' | 'sin_respuesta' | 'aceptado' | 'rechazado';

export type JourneyStage = 
  | 'inicial'              // Recién llegó, solo preguntó por la propiedad
  | 'docs_solicitados'     // CuriOso le pidió documentos
  | 'docs_enviados'        // Lead envió documentos
  | 'evaluado';            // Ya fue evaluado, tiene matchPercentage y scoring

export interface WritingProfile {
  typoLevel: number;              // 0 = perfecto, 1 = algunos typos, 2 = muchos typos
  fixedTypos: Record<string, string>; // Typos específicos que SIEMPRE usa
  usesMayusculas: boolean;        // Si usa mayúsculas al inicio
  usesSignos: boolean;            // Si usa signos de puntuación (¿? ¡!)
  expresionesChilenas: string[];  // Expresiones que puede usar
}

export interface LeadProfile {
  id: string;
  nombre: string;                 // Inicialmente "Lead Temporal", luego se actualiza
  nombreReal?: string;            // Nombre real extraído de la conversación
  telefono: string;
  email?: string;
  avatar?: string;
  propiedadInteres: string;
  status?: ChatStatus;
  matchPercentage?: number;       // Solo si journeyStage === 'evaluado'
  scoring?: {                     // Solo si journeyStage === 'evaluado'
    ingresos: number;
    documentos: number;
    total: number;
  };
  personality: 'formal' | 'casual' | 'coloquial' | 'apurado' | 'detallista';
  journeyStage: JourneyStage;     // Nueva: etapa del lead en el embudo
  writingProfile: WritingProfile; // Nueva: perfil de escritura persistente
}

export interface WhatsAppChat {
  id: string;
  leadId: string;
  lead: LeadProfile;
  propiedadId: string;
  messages: WhatsAppMessage[];
  status: ChatStatus;
  lastMessageTime: string;
  unreadCount: number;
  isAIControlled: boolean;
  etapaOportunidad: string;
  isTyping?: boolean;
  typingUser?: 'lead' | 'curioso';
}

export interface BrigadaActivity {
  id: string;
  agentName: 'CuriOso' | 'Oso Cauteloso' | 'Oso Notarioso' | 'Oso Cuidadoso' | 'OptimizOso';
  action: string;
  leadName: string;
  propiedadTitulo: string;
  timestamp: string;
  status: 'success' | 'pending' | 'warning';
  icon: string;
}
