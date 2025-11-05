import { supabase } from '../../integrations/supabase/client';
import type { Empresa, EmpresaCreate } from '../../types/empresa';

// get all empresas
export const getEmpresas = async () => {
  try {
    const { data, error } = await supabase
      .from('empresa')
      .select('*');

    if (error) throw error;
    return data as Empresa[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createEmpresa = async (empresa: EmpresaCreate) => {
  try {
    const { data, error } = await supabase
      .from('empresa')
      .insert([empresa])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteEmpresa = async (empresaId: string) => {
  try {
    const { error } = await supabase
      .from('empresa')
      .delete()
      .eq('id', empresaId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// update empresa
export const updateEmpresa = async (empresaId: string, empresa: Partial<Empresa>) => {
  try {
    const { data, error } = await supabase
      .from('empresa')
      .update(empresa)
      .eq('id', empresaId)
      .select()
      .single();

    if (error) throw error;
    return data as Empresa;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get empresa by name
export const getEmpresaByName = async (nombre: string) => {
  try {
    console.log('[EmpresaService] Fetching empresa by name:', nombre);
    const { data, error } = await supabase
      .from('empresa')
      .select('*')
      .eq('nombre', nombre)
      .single();

    if (error) throw error;
    console.log('[EmpresaService] Empresa found:', data);
    return data as Empresa;
  } catch (error) {
    console.error('[EmpresaService] Error fetching empresa by name:', error);
    throw error;
  }
};

// get empresa by ID
export const getEmpresaById = async (empresaId: string) => {
  try {
    console.log('[EmpresaService] Fetching empresa by ID:', empresaId);
    const { data, error } = await supabase
      .from('empresa')
      .select('*')
      .eq('id', empresaId)
      .single();

    if (error) throw error;
    console.log('[EmpresaService] Empresa found:', data);
    return data as Empresa;
  } catch (error) {
    console.error('[EmpresaService] Error fetching empresa by ID:', error);
    throw error;
  }
};
