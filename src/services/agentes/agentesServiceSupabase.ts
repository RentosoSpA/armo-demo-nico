import { supabase } from '../../integrations/supabase/client';
import type { AgenteWithRole, AgenteUpdate, AgentesStats, AppRole } from '../../types/agente';

/**
 * FASE 1: Servicio de Supabase para gestión de agentes
 * Todas las funciones conectadas directamente a la base de datos
 */

// 1. Obtener todos los agentes de una empresa con sus roles
export const getAgentesByEmpresa = async (empresaId: string): Promise<AgenteWithRole[]> => {
  try {
    const { data, error } = await supabase
      .from('agente')
      .select(`
        *,
        user_roles!inner(role)
      `)
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transformar datos al formato esperado
    return (data || []).map((agente: any) => ({
      id: agente.id,
      nombre: agente.nombre,
      email: agente.email,
      telefono: agente.telefono,
      codigoTelefonico: agente.codigo_telefonico,
      empresaId: agente.empresa_id,
      userUID: agente.user_uid,
      activo: agente.activo,
      createdAt: agente.created_at,
      updatedAt: agente.updated_at,
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
      role: agente.user_roles[0]?.role || 'agent',
      role_id: agente.user_roles[0]?.id,
    }));
  } catch (error) {
    console.error('Error al obtener agentes:', error);
    throw error;
  }
};

// 2. Obtener agente individual con todos los detalles
export const getAgenteById = async (agenteId: string): Promise<AgenteWithRole | null> => {
  try {
    const { data, error } = await supabase
      .from('agente')
      .select(`
        *,
        empresa:empresa_id(*),
        user_roles!inner(role, id)
      `)
      .eq('id', agenteId)
      .single();

    if (error) throw error;
    if (!data) return null;

    const userRoles = Array.isArray(data.user_roles) ? data.user_roles : [];
    
    return {
      id: data.id,
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono.toString(),
      codigoTelefonico: data.codigo_telefonico,
      empresaId: data.empresa_id,
      userUID: data.user_uid,
      activo: data.activo,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      lunes_inicio: data.lunes_inicio,
      lunes_fin: data.lunes_fin,
      martes_inicio: data.martes_inicio,
      martes_fin: data.martes_fin,
      miercoles_inicio: data.miercoles_inicio,
      miercoles_fin: data.miercoles_fin,
      jueves_inicio: data.jueves_inicio,
      jueves_fin: data.jueves_fin,
      viernes_inicio: data.viernes_inicio,
      viernes_fin: data.viernes_fin,
      sabado_inicio: data.sabado_inicio,
      sabado_fin: data.sabado_fin,
      domingo_inicio: data.domingo_inicio,
      domingo_fin: data.domingo_fin,
      role: userRoles[0]?.role || 'agent',
      role_id: userRoles[0]?.id,
    };
  } catch (error) {
    console.error('Error al obtener agente:', error);
    throw error;
  }
};

// 3. Actualizar datos del agente
export const updateAgente = async (
  agenteId: string,
  updates: AgenteUpdate
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('agente')
      .update(updates)
      .eq('id', agenteId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error al actualizar agente:', error);
    throw error;
  }
};

// 4. Actualizar rol de agente
export const updateAgenteRole = async (
  userId: string,
  empresaId: string,
  newRole: AppRole
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('user_id', userId)
      .eq('empresa_id', empresaId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    throw error;
  }
};

// 5. Cambiar estado activo/inactivo (soft delete)
export const toggleAgenteStatus = async (
  agenteId: string,
  activo: boolean
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('agente')
      .update({ activo })
      .eq('id', agenteId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error al cambiar estado de agente:', error);
    throw error;
  }
};

// 6. Obtener estadísticas de agentes
export const getAgentesStats = async (empresaId: string): Promise<AgentesStats> => {
  try {
    // Obtener todos los agentes con roles
    const agentes = await getAgentesByEmpresa(empresaId);

    // Calcular estadísticas
    const total = agentes.length;
    const activos = agentes.filter(a => a.activo).length;
    const inactivos = total - activos;

    const porRol = {
      admin: agentes.filter(a => a.role === 'admin').length,
      agent: agentes.filter(a => a.role === 'agent').length,
      supervisor: agentes.filter(a => a.role === 'supervisor').length,
      assistant: agentes.filter(a => a.role === 'assistant').length,
    };

    return {
      total,
      activos,
      inactivos,
      porRol,
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};
