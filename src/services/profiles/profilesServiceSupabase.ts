import { supabase } from '../../integrations/supabase/client';

export interface ProfileWithRole {
  id: string;
  user_id: string;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  empresa_id: string | null;
  created_at: string;
  updated_at: string;
  role: 'admin' | 'agent' | 'manager' | 'owner' | 'viewer';
}

/**
 * Obtiene todos los profiles de una empresa con sus roles
 */
export const getProfilesByEmpresa = async (empresaId: string): Promise<ProfileWithRole[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      user_id,
      full_name,
      company_name,
      phone,
      empresa_id,
      created_at,
      updated_at
    `)
    .eq('empresa_id', empresaId);

  if (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }

  // Obtener roles para cada usuario
  const profilesWithRoles = await Promise.all(
    (data || []).map(async (profile: {
      id: string;
      user_id: string;
      full_name: string | null;
      company_name: string | null;
      phone: string | null;
      empresa_id: string | null;
      created_at: string;
      updated_at: string;
    }) => {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', profile.user_id)
        .eq('empresa_id', empresaId)
        .single();

      return {
        ...profile,
        role: roleData?.role || 'agent'
      } as ProfileWithRole;
    })
  );

  return profilesWithRoles;
};

/**
 * Obtiene un profile por ID con su rol
 */
export const getProfileById = async (profileId: string): Promise<ProfileWithRole | null> => {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', profileId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }

  if (!profile || !profile.empresa_id) return null;

  // Obtener rol del usuario
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', profile.user_id)
    .eq('empresa_id', profile.empresa_id)
    .single();

  return {
    ...profile,
    role: roleData?.role || 'agent'
  } as ProfileWithRole;
};
