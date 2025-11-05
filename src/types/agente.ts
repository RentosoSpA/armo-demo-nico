export interface Agente {
  id: string;
  nombre: string;
  apellido?: string;
  email: string;
  telefono: string;
  codigoTelefonico?: number;
  empresaId: string;
  userUID: string;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  // Additional fields for schedule
  lunes_inicio?: number | null;
  lunes_fin?: number | null;
  martes_inicio?: number | null;
  martes_fin?: number | null;
  miercoles_inicio?: number | null;
  miercoles_fin?: number | null;
  jueves_inicio?: number | null;
  jueves_fin?: number | null;
  viernes_inicio?: number | null;
  viernes_fin?: number | null;
  sabado_inicio?: number | null;
  sabado_fin?: number | null;
  domingo_inicio?: number | null;
  domingo_fin?: number | null;
}

export interface AgenteCreate {
  nombre: string;
  apellido?: string;
  email: string;
  telefono: string;
  codigoTelefonico?: number;
  empresaId: string;
  userUID: string;
  activo?: boolean;
  // Additional fields for schedule
  lunes_inicio?: number | null;
  lunes_fin?: number | null;
  martes_inicio?: number | null;
  martes_fin?: number | null;
  miercoles_inicio?: number | null;
  miercoles_fin?: number | null;
  jueves_inicio?: number | null;
  jueves_fin?: number | null;
  viernes_inicio?: number | null;
  viernes_fin?: number | null;
  sabado_inicio?: number | null;
  sabado_fin?: number | null;
  domingo_inicio?: number | null;
  domingo_fin?: number | null;
}

// FASE 6: Nuevas interfaces para Supabase
export type AppRole = 'admin' | 'agent' | 'supervisor' | 'assistant';

export interface AgenteWithRole extends Agente {
  role: AppRole;
  role_id?: string;
}

export interface AgenteUpdate {
  nombre?: string;
  email?: string;
  telefono?: number;
  codigo_telefonico?: number;
  activo?: boolean;
  lunes_inicio?: number | null;
  lunes_fin?: number | null;
  martes_inicio?: number | null;
  martes_fin?: number | null;
  miercoles_inicio?: number | null;
  miercoles_fin?: number | null;
  jueves_inicio?: number | null;
  jueves_fin?: number | null;
  viernes_inicio?: number | null;
  viernes_fin?: number | null;
  sabado_inicio?: number | null;
  sabado_fin?: number | null;
  domingo_inicio?: number | null;
  domingo_fin?: number | null;
}

export interface AgentesStats {
  total: number;
  activos: number;
  inactivos: number;
  porRol: {
    admin: number;
    agent: number;
    supervisor: number;
    assistant: number;
  };
}
