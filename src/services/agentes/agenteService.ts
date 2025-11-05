import { supabase } from '../../integrations/supabase/client';
import type { Agente, AgenteCreate } from '../../types/agente';
import { mapSupabaseToAgente, mapAgenteToSupabaseInsert, mapAgenteToSupabaseUpdate } from './agenteMappers';

// get all agentes
export const getAgentes = async () => {
  try {
    const { data, error } = await supabase
      .from('agente')
      .select('*');

    if (error) throw error;
    return data.map(mapSupabaseToAgente);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get agente by user UID
export const getAgenteByUserUid = async (userUid: string) => {
  try {
    const { data, error } = await supabase
      .from('agente')
      .select('*')
      .eq('user_uid', userUid)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      console.log('User is not an agent:', userUid);
      return null;
    }
    return mapSupabaseToAgente(data);
  } catch (error) {
    console.error('Error getting agent by user UID:', error);
    throw error;
  }
};

// create new agente
export const createAgente = async (agenteData: AgenteCreate) => {
  try {
    const insertData = mapAgenteToSupabaseInsert(agenteData);
    const { data, error } = await supabase
      .from('agente')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;
    return mapSupabaseToAgente(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// update agente
export const updateAgente = async (agenteId: string, agenteData: Partial<Agente>) => {
  try {
    const updateData = mapAgenteToSupabaseUpdate(agenteData);
    const { data, error } = await supabase
      .from('agente')
      .update(updateData)
      .eq('id', agenteId)
      .select()
      .single();

    if (error) throw error;
    return mapSupabaseToAgente(data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
