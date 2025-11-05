import { supabase } from '../../integrations/supabase/client';
import type { Profile, ProfileCreate } from '../../types/profile';

export const createUser = async (uid: string, _email: string, profile: ProfileCreate) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        ...profile,
        user_id: uid,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUser = async (uid: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', uid)
      .single();

    if (error) throw error;
    return data as Profile;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const updateUser = async (uid: string, updatedData: Partial<Profile>) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updatedData)
      .eq('user_id', uid)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
