import { supabase } from '../../integrations/supabase/client';
import type { Empresa } from '../../types/empresa';

export interface InvitationData {
  id: string;
  email: string;
  role: 'admin' | 'agent' | 'supervisor' | 'assistant';
  token: string;
  empresa_id: string;
  invited_by: string;
  status: string | null;
  created_at: string;
  sent_at: string | null;
  accepted_at: string | null;
  expires_at: string;
  metadata: Record<string, any> | null;
}

export interface InvitationWithCompany extends InvitationData {
  empresa: Empresa;
}

/**
 * Envía una invitación por correo electrónico usando la Edge Function
 */
export const sendInvitationEmail = async (
  email: string,
  rol: 'admin' | 'agent' | 'supervisor' | 'assistant',
  empresaId: string
): Promise<{ success: boolean; invitationId?: string; error?: string; code?: string }> => {
  try {
    // Get current session to pass auth token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { 
        success: false, 
        error: 'No hay sesión activa. Por favor inicia sesión nuevamente.',
        code: 'NO_SESSION'
      };
    }

    const { data, error } = await supabase.functions.invoke('send-invitation-email', {
      body: {
        email,
        rol,
        empresaId,
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (error) {
      console.error('Error invoking send-invitation-email:', error);
      
      // Provide user-friendly error messages based on error type
      const errorMessage = error.message || '';
      
      // Network/connection errors
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        return { 
          success: false, 
          error: 'No se pudo conectar con el servidor. Por favor verifica:\n1. Tu conexión a internet\n2. Que el servidor esté disponible\n3. Intenta recargar la página',
          code: 'NETWORK_ERROR'
        };
      }
      
      // Timeout errors
      if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
        return { 
          success: false, 
          error: 'El servidor tardó demasiado en responder. Por favor intenta nuevamente.',
          code: 'TIMEOUT_ERROR'
        };
      }
      
      // CORS errors
      if (errorMessage.includes('CORS')) {
        return { 
          success: false, 
          error: 'Error de configuración del servidor. Contacta al administrador.',
          code: 'CORS_ERROR'
        };
      }
      
      return { 
        success: false, 
        error: `Error al comunicarse con el servidor: ${errorMessage}`,
        code: 'INVOKE_ERROR'
      };
    }

    if (data?.error) {
      console.error('Function returned error:', data);
      
      // Handle specific error codes
      if (data.code === 'RESEND_NOT_CONFIGURED') {
        return { 
          success: false, 
          error: 'El servicio de email no está configurado. Contacta al administrador.',
          code: data.code
        };
      }
      
      if (data.code === 'AUTH_HEADER_MISSING' || data.code === 'AUTH_INVALID') {
        return { 
          success: false, 
          error: 'Error de autenticación. Por favor inicia sesión nuevamente.',
          code: data.code
        };
      }
      
      if (data.code === 'SESSION_EXPIRED') {
        return { 
          success: false, 
          error: 'Tu sesión ha expirado. Por favor recarga la página e inicia sesión nuevamente.',
          code: data.code
        };
      }
      
      return { 
        success: false, 
        error: data.error,
        code: data.code || 'FUNCTION_ERROR'
      };
    }

    return {
      success: true,
      invitationId: data.invitationId,
    };
  } catch (error: any) {
    console.error('Exception sending invitation:', error);
    return { 
      success: false, 
      error: 'Error inesperado al enviar la invitación',
      code: 'EXCEPTION'
    };
  }
};

/**
 * Obtiene las invitaciones pendientes de una empresa
 */
export const getPendingInvitations = async (
  empresaId: string
): Promise<InvitationData[]> => {
  const { data, error } = await supabase
    .from('user_invitations')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invitations:', error);
    return [];
  }

  return (data || []) as InvitationData[];
};

/**
 * Cancela una invitación
 */
export const cancelInvitation = async (invitationId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('user_invitations')
    .update({ status: 'cancelled' })
    .eq('id', invitationId);

  if (error) {
    console.error('Error cancelling invitation:', error);
    return false;
  }

  return true;
};

/**
 * Verifica un token de invitación y retorna los datos de la invitación y empresa
 */
export const verifyInvitationToken = async (
  token: string
): Promise<InvitationWithCompany | null> => {
  try {
    // First get the invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('user_invitations')
      .select('*')
      .eq('token', token)
      .eq('status', 'pending')
      .single();

    if (invitationError || !invitation) {
      console.error('Invitation not found or expired:', invitationError);
      return null;
    }

    // Check if expired
    const expiresAt = new Date(invitation.expires_at);
    if (expiresAt < new Date()) {
      // Mark as expired
      await supabase
        .from('user_invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id);
      return null;
    }

    // Get empresa details
    const { data: empresa, error: empresaError } = await supabase
      .from('empresa')
      .select('*')
      .eq('id', invitation.empresa_id)
      .single();

    if (empresaError || !empresa) {
      console.error('Company not found:', empresaError);
      return null;
    }

    return {
      ...invitation,
      empresa,
    } as InvitationWithCompany;
  } catch (error) {
    console.error('Error verifying invitation:', error);
    return null;
  }
};

/**
 * Acepta una invitación después de que el usuario se registre
 */
export const acceptInvitation = async (token: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('token', token)
      .eq('status', 'pending');

    if (error) {
      console.error('Error accepting invitation:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception accepting invitation:', error);
    return false;
  }
};
