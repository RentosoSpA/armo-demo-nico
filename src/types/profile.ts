// Aligned with Supabase prospecto table schema
export interface Prospecto {
  id: string;
  source: string;
  phone_e164: string;
  email?: string | null;
  wa_id?: string | null;
  fb_uid?: string | null;
  display_name?: string | null;
  
  // Campos extendidos
  primer_nombre?: string | null;
  segundo_nombre?: string | null;
  primer_apellido?: string | null;
  segundo_apellido?: string | null;
  documento?: string | null;
  tipo_documento?: string | null;
  codigo_telefonico?: number | null;
  fecha_nacimiento?: string | null;
  genero?: string | null;
  ingresos_mensuales?: number | null;
  egresos_mensuales?: number | null;
  situacion_laboral?: string | null;
  evaluado?: boolean | null;
  aprobado?: boolean | null;
  estado?: string | null;
  
  first_seen_at: string;
  last_seen_at: string;
}

export interface ProspectoCreate {
  source: string;
  phone_e164: string;
  email?: string;
  display_name?: string;
  primer_nombre?: string;
  segundo_nombre?: string;
  primer_apellido?: string;
  segundo_apellido?: string;
  documento?: string;
  tipo_documento?: string;
  codigo_telefonico?: number;
  fecha_nacimiento?: string;
  genero?: string;
  ingresos_mensuales?: number;
  egresos_mensuales?: number;
  situacion_laboral?: string;
  evaluado?: boolean;
  aprobado?: boolean;
  estado?: string;
}

// Profile for auth users
export interface Profile {
  id: string;
  user_id: string;
  full_name?: string | null;
  company_name?: string | null;
  phone?: string | null;
  empresa_id?: string | null;
  role?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileCreate {
  user_id: string;
  full_name?: string;
  company_name?: string;
  phone?: string;
  empresa_id?: string;
}