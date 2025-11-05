export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  entities?: any;
  visits?: Visit[];
  readyForConfirmation?: boolean;
  propertyData?: any;
  needsInfo?: string;
}

export interface Visit {
  id: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  tipo_visita: string;
  observaciones?: string;
  propiedad: {
    titulo: string;
    direccion: string;
  };
  prospecto: {
    display_name: string;
    phone_e164: string;
  };
}

export interface ChatState {
  status: 'idle' | 'transcribing' | 'processing' | 'confirming' | 'creating' | 'error';
  messages: ChatMessage[];
  sessionId: string;
  isOpen: boolean;
}

export interface PropertyFormData {
  nombre: string;
  email: string;
  telefono: string;
  codigo_telefonico: number;
  documento: string;
  tipo_documento: string;
  images: Array<{ data: string; name: string }>;
}

export interface AudioRecorderState {
  isRecording: boolean;
  duration: number;
  audioData: string | null;
}
