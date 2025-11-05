import { supabase } from '../../integrations/supabase/client';
import type { Prospecto, ProspectoCreate } from '../../types/profile';

/**
 * Clean prospecto data by removing empty strings and undefined values
 * Prevents 400 errors when sending empty strings to DATE/NUMERIC columns
 */
const cleanProspectoData = (data: ProspectoCreate): Partial<ProspectoCreate> => {
  const cleaned: Partial<ProspectoCreate> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    // Only include non-empty values
    if (value !== '' && value !== undefined && value !== null) {
      cleaned[key as keyof ProspectoCreate] = value;
    }
  });
  
  return cleaned;
};

/**
 * Fetch all prospects
 */
export const getProspectos = async (): Promise<Prospecto[]> => {
  try {
    const { data, error } = await supabase
      .from('prospecto')
      .select('*')
      .order('first_seen_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching prospects:', error);
    throw error;
  }
};

/**
 * Fetch a single prospect by ID
 */
export const getProspectoById = async (id: string): Promise<Prospecto> => {
  try {
    const { data, error } = await supabase
      .from('prospecto')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error fetching prospect:', error);
    throw error;
  }
};

/**
 * Create a new prospect
 */
export const createProspecto = async (prospectoData: ProspectoCreate): Promise<Prospecto> => {
  try {
    // Clean data to prevent 400 errors from empty strings in DATE/NUMERIC fields
    const cleanedData = cleanProspectoData(prospectoData);
    
    const { data, error } = await supabase
      .from('prospecto')
      .insert([cleanedData as any])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error creating prospect:', error);
    throw error;
  }
};

/**
 * Update a prospect
 */
export const updateProspecto = async (
  id: string,
  updates: Partial<Prospecto>
): Promise<Prospecto> => {
  try {
    const { data, error } = await supabase
      .from('prospecto')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error updating prospect:', error);
    throw error;
  }
};
