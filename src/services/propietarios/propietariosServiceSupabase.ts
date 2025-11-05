import { supabase } from '../../integrations/supabase/client';
import type { Propietario } from '../../types/propietario';

/**
 * Fetch all propietarios for a company with property counts
 */
export const getPropietarios = async (empresaId: string): Promise<Propietario[]> => {
  try {
    const { data, error } = await supabase
      .from('propietario')
      .select(`
        *,
        propiedad(count)
      `)
      .eq('empresa_id', empresaId)
      .order('nombre', { ascending: true });

    if (error) throw error;

    return (data || []).map(item => 
      mapSupabaseToPropietario(item, (item.propiedad as any)?.[0]?.count || 0)
    );
  } catch (error) {
    console.error('Error fetching propietarios:', error);
    throw error;
  }
};

/**
 * Fetch a single propietario by ID
 */
export const getPropietarioById = async (id: string): Promise<Propietario> => {
  try {
    const { data, error } = await supabase
      .from('propietario')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Propietario no encontrado');

    return mapSupabaseToPropietario(data);
  } catch (error) {
    console.error('Error fetching propietario:', error);
    throw error;
  }
};

/**
 * Create a new propietario
 */
export const createPropietario = async (
  propietario: any,
  empresaId: string
): Promise<Propietario> => {
  try {
    const supabaseData = {
      nombre: propietario.nombre,
      email: propietario.email || '',
      telefono: parseInt(propietario.telefono || '0'),
      codigo_telefonico: propietario.codigo_telefonico || 56,
      tipo_documento: propietario.tipo_documento || 'RUT',
      documento: propietario.documento || '',
      empresa_id: empresaId
    };

    const { data, error } = await supabase
      .from('propietario')
      .insert([supabaseData])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No se pudo crear el propietario');

    return mapSupabaseToPropietario(data);
  } catch (error) {
    console.error('Error creating propietario:', error);
    throw error;
  }
};

/**
 * Update an existing propietario
 */
export const updatePropietario = async (
  id: string,
  propietario: any
): Promise<Propietario> => {
  try {
    const supabaseData: any = {};
    
    if (propietario.nombre) supabaseData.nombre = propietario.nombre;
    if (propietario.email) supabaseData.email = propietario.email;
    if (propietario.telefono) {
      supabaseData.telefono = parseInt(propietario.telefono || '0');
    }
    if (propietario.codigo_telefonico) {
      supabaseData.codigo_telefonico = propietario.codigo_telefonico;
    }
    if (propietario.tipo_documento) supabaseData.tipo_documento = propietario.tipo_documento;
    if (propietario.documento) supabaseData.documento = propietario.documento;

    const { data, error } = await supabase
      .from('propietario')
      .update(supabaseData)
      .eq('id', id)
      .select(`
        *,
        propiedad(count)
      `)
      .single();

    if (error) throw error;
    if (!data) throw new Error('No se pudo actualizar el propietario');

    return mapSupabaseToPropietario(data, (data.propiedad as any)?.[0]?.count || 0);
  } catch (error) {
    console.error('Error updating propietario:', error);
    throw error;
  }
};

/**
 * Delete a propietario (only if no associated properties)
 */
export const deletePropietario = async (id: string): Promise<void> => {
  try {
    // First, check if there are associated properties
    const { count, error: countError } = await supabase
      .from('propiedad')
      .select('*', { count: 'exact', head: true })
      .eq('propietario_id', id);

    if (countError) throw countError;

    if (count && count > 0) {
      throw new Error(
        `No se puede eliminar el propietario porque tiene ${count} ${count === 1 ? 'propiedad asociada' : 'propiedades asociadas'}. ` +
        `Primero debe reasignar o eliminar ${count === 1 ? 'la propiedad' : 'las propiedades'}.`
      );
    }

    // If no properties, proceed with deletion
    const { error } = await supabase
      .from('propietario')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting propietario:', error);
    throw error;
  }
};

/**
 * Map Supabase data to Propietario type
 */
function mapSupabaseToPropietario(data: any, propiedadesCount: number = 0): Propietario {
  return {
    id: data.id,
    nombre: data.nombre,
    email: data.email || '',
    telefono: data.telefono?.toString() || '',
    codigo_telefonico: data.codigo_telefonico || 56,
    documento: data.documento || '',
    tipo_documento: data.tipo_documento || 'RUT',
    propiedades_asociadas: propiedadesCount
  };
}
