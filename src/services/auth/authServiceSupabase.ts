import { supabase } from '../../integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  full_name?: string;
  company_name?: string;
  phone?: string;
  empresa_id?: string;
  telefono?: number;
  codigo_telefonico?: number;
  skip_empresa?: boolean;
}

export const authServiceSupabase = {
  /**
   * Sign up a new user with email and password
   */
  signUp: async (data: SignUpData) => {
    const { email, password, ...metadata } = data;

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: metadata, // This goes into raw_user_meta_data
      },
    });

    if (error) throw error;
    return authData;
  },

  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    // Sign out with scope: 'global' to clear session everywhere
    const { error } = await supabase.auth.signOut({ scope: 'global' });

    if (error) {
      // Ignore "Auth session missing" errors - user is already logged out
      if (error.message !== 'Auth session missing!') {
        throw error;
      }
    }
  },

  /**
   * Get the current session
   */
  getSession: async (): Promise<Session | null> => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  /**
   * Get the current user
   */
  getUser: async (): Promise<User | null> => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
  },

  /**
   * Reset password request
   */
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) throw error;
  },

  /**
   * Update password
   */
  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },
};
