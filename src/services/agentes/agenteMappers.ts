import type { Agente, AgenteCreate } from '../../types/agente';
import type { Database } from '../../integrations/supabase/types';

type AgenteRow = Database['public']['Tables']['agente']['Row'];
type AgenteInsert = Database['public']['Tables']['agente']['Insert'];

/**
 * Maps Supabase agente row to Agente interface
 */
export function mapSupabaseToAgente(row: AgenteRow): Agente {
  return {
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    telefono: row.telefono.toString(),
    codigoTelefonico: row.codigo_telefonico,
    empresaId: row.empresa_id,
    userUID: row.user_uid,
    activo: row.activo,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lunes_inicio: row.lunes_inicio,
    lunes_fin: row.lunes_fin,
    martes_inicio: row.martes_inicio,
    martes_fin: row.martes_fin,
    miercoles_inicio: row.miercoles_inicio,
    miercoles_fin: row.miercoles_fin,
    jueves_inicio: row.jueves_inicio,
    jueves_fin: row.jueves_fin,
    viernes_inicio: row.viernes_inicio,
    viernes_fin: row.viernes_fin,
    sabado_inicio: row.sabado_inicio,
    sabado_fin: row.sabado_fin,
    domingo_inicio: row.domingo_inicio,
    domingo_fin: row.domingo_fin,
  };
}

/**
 * Maps AgenteCreate to Supabase insert format
 */
export function mapAgenteToSupabaseInsert(agente: AgenteCreate): AgenteInsert {
  return {
    nombre: agente.nombre,
    email: agente.email,
    telefono: parseInt(agente.telefono),
    codigo_telefonico: agente.codigoTelefonico || 56,
    empresa_id: agente.empresaId,
    user_uid: agente.userUID,
    activo: agente.activo ?? true,
    lunes_inicio: agente.lunes_inicio,
    lunes_fin: agente.lunes_fin,
    martes_inicio: agente.martes_inicio,
    martes_fin: agente.martes_fin,
    miercoles_inicio: agente.miercoles_inicio,
    miercoles_fin: agente.miercoles_fin,
    jueves_inicio: agente.jueves_inicio,
    jueves_fin: agente.jueves_fin,
    viernes_inicio: agente.viernes_inicio,
    viernes_fin: agente.viernes_fin,
    sabado_inicio: agente.sabado_inicio,
    sabado_fin: agente.sabado_fin,
    domingo_inicio: agente.domingo_inicio,
    domingo_fin: agente.domingo_fin,
  };
}

/**
 * Maps Agente update to Supabase update format
 */
export function mapAgenteToSupabaseUpdate(agente: Partial<Agente>): Partial<AgenteRow> {
  const update: any = {};
  
  if (agente.nombre !== undefined) update.nombre = agente.nombre;
  if (agente.email !== undefined) update.email = agente.email;
  if (agente.telefono !== undefined) update.telefono = parseInt(agente.telefono);
  if (agente.codigoTelefonico !== undefined) update.codigo_telefonico = agente.codigoTelefonico;
  if (agente.activo !== undefined) update.activo = agente.activo;
  if (agente.lunes_inicio !== undefined) update.lunes_inicio = agente.lunes_inicio;
  if (agente.lunes_fin !== undefined) update.lunes_fin = agente.lunes_fin;
  if (agente.martes_inicio !== undefined) update.martes_inicio = agente.martes_inicio;
  if (agente.martes_fin !== undefined) update.martes_fin = agente.martes_fin;
  if (agente.miercoles_inicio !== undefined) update.miercoles_inicio = agente.miercoles_inicio;
  if (agente.miercoles_fin !== undefined) update.miercoles_fin = agente.miercoles_fin;
  if (agente.jueves_inicio !== undefined) update.jueves_inicio = agente.jueves_inicio;
  if (agente.jueves_fin !== undefined) update.jueves_fin = agente.jueves_fin;
  if (agente.viernes_inicio !== undefined) update.viernes_inicio = agente.viernes_inicio;
  if (agente.viernes_fin !== undefined) update.viernes_fin = agente.viernes_fin;
  if (agente.sabado_inicio !== undefined) update.sabado_inicio = agente.sabado_inicio;
  if (agente.sabado_fin !== undefined) update.sabado_fin = agente.sabado_fin;
  if (agente.domingo_inicio !== undefined) update.domingo_inicio = agente.domingo_inicio;
  if (agente.domingo_fin !== undefined) update.domingo_fin = agente.domingo_fin;
  
  return update;
}
