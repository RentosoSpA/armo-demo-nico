export enum EstadoVisita {
  Agendada = 'Agendada',
  Aprobada = 'Aprobada',
  Completada = 'Completada',
  Cancelada = 'Cancelada',
}

export interface ProspectoBasicInfo {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  avatar?: string;
}

export interface Visita {
  id: string;
  propiedad: string;
  fecha_inicio: string;
  estado: string;  // Allow string for compatibility 
  plataforma: string;
  // Additional properties that components may expect
  fecha?: string | Date;   // Allow Date for calendar components
  horaInicio?: string | number;
  horaFin?: string | number;
  // CuriOso enhanced fields
  agendadaPorCurioso?: boolean;
  estadoCurioso?: 'agendando' | 'confirmada' | 'esperando_confirmacion' | 'reagendada';
  ultimaActividad?: string; // ISO timestamp
  prospectoInfo?: ProspectoBasicInfo;
  notasCurioso?: string;
}

export interface VisitaCreate {
  propiedad: string;
  fecha_inicio: string;
  estado: string;  // Allow string for compatibility
  plataforma: string;
  fecha?: string;
  horaInicio?: string | number;
  horaFin?: string | number;
  prospectoId?: string;
}

export interface VisitaUpdate {
  id: string;
  estado?: string;  // Allow string for compatibility
  fecha_inicio?: string;
  plataforma?: string;
  fecha?: string | Date;     // Allow Date for calendar components  
  horaInicio?: number;  // Allow number for time values
  horaFin?: number;     // Allow number for time values
}