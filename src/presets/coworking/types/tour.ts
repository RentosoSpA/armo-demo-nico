// Tipos adaptados de Visita para tours de coworking

export interface ProspectoBasicInfo {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  avatar?: string;
}

export enum EstadoTour {
  Agendado = 'Agendado',
  Confirmado = 'Confirmado',
  Completado = 'Completado',
  Cancelado = 'Cancelado',
  NoAsistio = 'No asistió'
}

export enum TipoTour {
  Virtual = 'Virtual',
  Presencial = 'Presencial',
  Mixto = 'Mixto'
}

export interface Tour {
  id: string;
  espacio_id?: string;
  espacio_nombre?: string;
  prospecto_id?: string;
  prospecto_info?: ProspectoBasicInfo;
  
  fecha_inicio: string;
  fecha_fin?: string;
  hora_inicio?: string;
  hora_fin?: string;
  
  estado: EstadoTour;
  tipo: TipoTour;
  plataforma?: string; // Zoom, Google Meet, etc. para tours virtuales
  
  // Detalles del tour
  interes_en?: string; // "Hot Desk", "Oficina Privada", etc.
  notas?: string;
  observaciones?: string;
  
  // Seguimiento
  agendado_por_bot?: boolean;
  ultima_actividad?: string;
  
  createdAt?: string;
  updatedAt?: string;
}

export interface TourCreate {
  espacio_id?: string;
  prospecto_id?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  hora_inicio?: string;
  hora_fin?: string;
  estado: EstadoTour;
  tipo: TipoTour;
  plataforma?: string;
  interes_en?: string;
  notas?: string;
}

export interface TourUpdate {
  id: string;
  estado?: EstadoTour;
  fecha_inicio?: string;
  fecha_fin?: string;
  hora_inicio?: string;
  hora_fin?: string;
  tipo?: TipoTour;
  plataforma?: string;
  notas?: string;
}
