import type { Prospecto } from './profile';
import type { Propiedad } from './propiedad';

export enum EtapaOportunidad {
  Exploracion = 'Exploracion',
  Evaluacion = 'Evaluacion',
  Visita = 'Visita',
  Negociacion = 'Negociacion',
  Cierre = 'Cierre',
}

// Aligned with Supabase DB schema
export interface Oportunidad {
  id: string;
  prospecto_id: string;
  propiedad_id: string;
  agente_id: string;
  empresa_id: string;
  etapa: string;
  status: string; // 'Open' | 'Closed' | 'Won' | 'Lost'
  source: string;
  channel?: string | null;
  external_id?: string | null;
  topk_rank?: number | null;
  score_total?: number | null;
  score_ingresos?: number | null;
  score_docs?: number | null;
  decision_total?: string | null;
  precio_interes?: number | null;
  fecha_inicio?: string | null;
  fecha_cierre?: string | null;
  motivo_cierre?: string | null;
  observaciones?: string | null;
  created_at: string;
  updated_at: string;
  
  // Relaciones opcionales (cuando se hacen JOINs)
  prospecto?: Prospecto;
  propiedad?: Propiedad;
}

export interface OportunidadCreate {
  prospecto_id: string;
  propiedad_id: string;
  agente_id: string;
  empresa_id: string;
  etapa?: string;
  status: string;
  source?: string;
  channel?: string;
  precio_interes?: number;
  observaciones?: string;
}

// Helper types for backward compatibility with UI
export interface OportunidadContacto {
  nombre: string;
  telefono: string;
  email: string;
}

export interface OportunidadPropiedad {
  id: string;
  titulo: string;
  direccion: string;
  operacion: string;
  precio: number;
  divisa: string;
}
