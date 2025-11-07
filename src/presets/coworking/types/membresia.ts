// Tipos adaptados de Contratos para membresías de coworking

export type EstadoMembresia = 'activa' | 'suspendida' | 'cancelada' | 'renovacion_pendiente';
export type TipoPlan = 'mensual' | 'flexible' | 'oficina_virtual' | 'sala_eventos';

export interface Membresia {
  id: string;
  empresa_id: string;
  espacio_id?: string;
  miembro_id?: string;
  nombre_miembro: string;
  email_miembro: string;
  telefono_miembro?: string;
  
  // Detalles de la membresía
  tipo_plan: TipoPlan;
  nombre_plan: string;
  estado: EstadoMembresia;
  precio_mensual: number;
  divisa: string;
  
  // Fechas
  fecha_inicio: string;
  fecha_renovacion: string;
  fecha_fin?: string;
  
  // Servicios incluidos
  horas_sala_incluidas?: number;
  acceso_24_7?: boolean;
  direccion_tributaria?: boolean;
  recepcion_correspondencia?: boolean;
  
  // Metadata
  observaciones?: string;
  storage_url?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MembresiaCreate {
  empresa_id: string;
  espacio_id?: string;
  miembro_id?: string;
  nombre_miembro: string;
  email_miembro: string;
  telefono_miembro?: string;
  tipo_plan: TipoPlan;
  nombre_plan: string;
  estado?: EstadoMembresia;
  precio_mensual: number;
  divisa: string;
  fecha_inicio: string;
  fecha_renovacion: string;
  horas_sala_incluidas?: number;
  acceso_24_7?: boolean;
  direccion_tributaria?: boolean;
  recepcion_correspondencia?: boolean;
  observaciones?: string;
}
