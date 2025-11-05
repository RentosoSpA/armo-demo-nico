import { supabase } from '../../integrations/supabase/client';

export interface InvitationLink {
  id: string;
  empresa_id: string;
  token: string;
  role: 'admin' | 'agent' | 'supervisor' | 'assistant';
  created_by: string;
  created_at: string | null;
  updated_at: string | null;
  is_active: boolean | null;
  max_uses: number | null;
  current_uses: number | null;
  expires_at: string | null;
  metadata: Record<string, any>;
}

export interface InvitationLinkWithCompany extends InvitationLink {
  empresa: {
    id: string;
    nombre: string;
    email: string;
    nit: string;
    direccion: string;
    telefono: number;
    codigo_telefonico: number;
  };
}

/**
 * Genera un nuevo link de invitación
 */
export const createInvitationLink = async (
  empresaId: string,
  role: InvitationLink['role'],
  options?: {
    maxUses?: number;
    expiresAt?: string;
  }
): Promise<{ success: boolean; link?: InvitationLink; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'No hay usuario autenticado' };
    }

    // Generar token único
    const token = `inv_${crypto.randomUUID()}`;

    const { data, error } = await supabase
      .from('invitation_links')
      .insert({
        empresa_id: empresaId,
        token,
        role,
        created_by: user.id,
        max_uses: options?.maxUses || null,
        expires_at: options?.expiresAt || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating invitation link:', error);
      return { success: false, error: error.message };
    }

    return { success: true, link: data as InvitationLink };
  } catch (error: any) {
    console.error('Exception creating invitation link:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Obtiene todos los links de invitación de una empresa
 */
export const getInvitationLinks = async (
  empresaId: string
): Promise<InvitationLink[]> => {
  try {
    const { data, error } = await supabase
      .from('invitation_links')
      .select('*')
      .eq('empresa_id', empresaId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invitation links:', error);
      return [];
    }

    return (data || []) as InvitationLink[];
  } catch (error) {
    console.error('Exception fetching invitation links:', error);
    return [];
  }
};

/**
 * Actualiza el rol de un link de invitación
 */
export const updateInvitationLinkRole = async (
  linkId: string,
  newRole: InvitationLink['role']
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('invitation_links')
      .update({ role: newRole })
      .eq('id', linkId);

    if (error) {
      console.error('Error updating invitation link role:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Exception updating invitation link role:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Activa/desactiva un link de invitación
 */
export const toggleInvitationLinkStatus = async (
  linkId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('invitation_links')
      .update({ is_active: isActive })
      .eq('id', linkId);

    if (error) {
      console.error('Error toggling invitation link:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Exception toggling invitation link:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Elimina un link de invitación
 */
export const deleteInvitationLink = async (
  linkId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('invitation_links')
      .delete()
      .eq('id', linkId);

    if (error) {
      console.error('Error deleting invitation link:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Exception deleting invitation link:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Verifica un token de invitación y retorna los datos del link y la empresa
 */
export const verifyInvitationLinkToken = async (
  token: string
): Promise<{ success: boolean; data?: InvitationLinkWithCompany; error?: string }> => {
  try {
    // Obtener el link de invitación
    const { data: link, error: linkError } = await supabase
      .from('invitation_links')
      .select('*')
      .eq('token', token)
      .eq('is_active', true)
      .single();

    if (linkError || !link) {
      return { success: false, error: 'Link de invitación inválido o inactivo' };
    }

    // Verificar expiración
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return { success: false, error: 'El link de invitación ha expirado' };
    }

    // Verificar usos máximos
    if (link.max_uses !== null && (link.current_uses || 0) >= link.max_uses) {
      return { success: false, error: 'El link de invitación ha alcanzado el máximo de usos' };
    }

    // Obtener datos de la empresa
    const { data: empresa, error: empresaError } = await supabase
      .from('empresa')
      .select('*')
      .eq('id', link.empresa_id)
      .single();

    if (empresaError || !empresa) {
      return { success: false, error: 'Empresa no encontrada' };
    }

    return { 
      success: true, 
      data: {
        ...link,
        empresa
      } as InvitationLinkWithCompany
    };
  } catch (error: any) {
    console.error('Error verifying invitation link:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Incrementa el contador de usos de un link (llama a función DB)
 */
export const incrementLinkUsage = async (
  linkId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.rpc('increment_link_usage', { 
      link_id: linkId 
    });

    if (error) {
      console.error('Error incrementing link usage:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Exception incrementing link usage:', error);
    return { success: false, error: error.message };
  }
};
