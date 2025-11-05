import { supabase } from '../../integrations/supabase/client';
import type { Oportunidad, OportunidadCreate } from '../../types/oportunidad';

/**
 * Fetch all opportunities for a specific company with related data
 */
export const getOportunidadesByEmpresa = async (empresaId: string): Promise<Oportunidad[]> => {
  try {
    const { data, error } = await supabase
      .from('oportunidades')
      .select(`
        *,
        prospecto:prospecto_id(*),
        propiedad:propiedad_id(*)
      `)
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []) as unknown as Oportunidad[];
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    throw error;
  }
};

/**
 * Create a new opportunity
 */
export const createOportunidad = async (oportunidadData: OportunidadCreate): Promise<Oportunidad> => {
  try {
    const { data, error } = await supabase
      .from('oportunidades')
      .insert([oportunidadData])
      .select(`
        *,
        prospecto:prospecto_id(*),
        propiedad:propiedad_id(*)
      `)
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Ya existe una oportunidad con este inquilino y propiedad');
      }
      throw error;
    }

    return data as unknown as Oportunidad;
  } catch (error) {
    console.error('Error creating opportunity:', error);
    throw error;
  }
};

/**
 * Update an opportunity
 */
export const updateOportunidad = async (
  id: string,
  updates: Partial<Oportunidad>
): Promise<Oportunidad> => {
  try {
    const { data, error } = await supabase
      .from('oportunidades')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        prospecto:prospecto_id(*),
        propiedad:propiedad_id(*)
      `)
      .single();

    if (error) throw error;

    return data as unknown as Oportunidad;
  } catch (error) {
    console.error('Error updating opportunity:', error);
    throw error;
  }
};

/**
 * Get a single opportunity by ID with related data
 */
export const getOportunidadById = async (id: string): Promise<Oportunidad> => {
  try {
    const { data, error } = await supabase
      .from('oportunidades')
      .select(`
        *,
        prospecto:prospecto_id(*),
        propiedad:propiedad_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error(`Oportunidad with id ${id} not found`);

    return data as unknown as Oportunidad;
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    throw error;
  }
};

/**
 * Delete/cancel an opportunity
 */
export const deleteOportunidad = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('oportunidades')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    throw error;
  }
};
