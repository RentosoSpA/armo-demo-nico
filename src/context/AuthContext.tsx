import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { authServiceSupabase } from '../services/auth/authServiceSupabase';
import { supabase } from '../integrations/supabase/client';
import { useUserStore } from '../store/userStore';
import { SessionPersistence } from '../utils/sessionPersistence';
import { SessionHeartbeat } from '../services/sessionHeartbeat';

export interface AuthContextType {
  currentUser: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  sessionValid: boolean;
  dataLoaded: boolean;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionValid, setSessionValid] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);

  // Sync with user store
  const {
    setUserProfile,
    setAgent,
    setEmpresa,
    setSessionValid: setStoreSessionValid,
    setLoading: setStoreLoading,
    clearUserData,
  } = useUserStore();

  // Load user profile data from database
  const loadUserData = async (userId: string, userEmail?: string) => {
    // ✅ BLINDAJE: Skip si datos ya cargados para este usuario
    if (loadedUserId === userId && dataLoaded) {
      return;
    }

    // ✅ Solo marcar como "cargando" si realmente vamos a cargar
    if (loadedUserId !== userId) {
      setDataLoaded(false);
    }

    try {
      // Get profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (profile) {
        // Convert profile to User format for store
        const userProfile = {
          uid: userId,
          email: userEmail || currentUser?.email || '',
          nombre: profile.full_name?.split(' ')[0] || '',
          apellido: profile.full_name?.split(' ').slice(1).join(' ') || '',
          telefono: profile.phone || '',
        };
        setUserProfile(userProfile);

        // Get agent data if empresa_id exists
        if (profile.empresa_id) {
          const { data: agenteData, error: agenteError } = await supabase
            .from('agente')
            .select('*')
            .eq('user_uid', userId)
            .maybeSingle();

          if (!agenteError && agenteData) {
            const mappedAgente = {
              id: agenteData.id,
              nombre: agenteData.nombre,
              email: agenteData.email,
              telefono: agenteData.telefono.toString(),
              codigoTelefonico: agenteData.codigo_telefonico,
              empresaId: agenteData.empresa_id,
              userUID: agenteData.user_uid,
              activo: agenteData.activo,
              createdAt: agenteData.created_at,
              updatedAt: agenteData.updated_at,
              lunes_inicio: agenteData.lunes_inicio,
              lunes_fin: agenteData.lunes_fin,
              martes_inicio: agenteData.martes_inicio,
              martes_fin: agenteData.martes_fin,
              miercoles_inicio: agenteData.miercoles_inicio,
              miercoles_fin: agenteData.miercoles_fin,
              jueves_inicio: agenteData.jueves_inicio,
              jueves_fin: agenteData.jueves_fin,
              viernes_inicio: agenteData.viernes_inicio,
              viernes_fin: agenteData.viernes_fin,
              sabado_inicio: agenteData.sabado_inicio,
              sabado_fin: agenteData.sabado_fin,
              domingo_inicio: agenteData.domingo_inicio,
              domingo_fin: agenteData.domingo_fin,
            };
            setAgent(mappedAgente);
          }

          // Get empresa data
          const { data: empresa, error: empresaError } = await supabase
            .from('empresa')
            .select('*')
            .eq('id', profile.empresa_id)
            .maybeSingle();

          if (!empresaError && empresa) {
            setEmpresa(empresa);
          }
        }
      }

      setLoadedUserId(userId);
      setDataLoaded(true);
    } catch (error) {
      setLoadedUserId(userId);
      setDataLoaded(true);
    }
  };

  // Proactive token refresh - refresh 5 minutes before expiry
  useEffect(() => {
    if (!session?.expires_at) return;
    
    const expiresAt = session.expires_at * 1000;
    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    
    const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000);
    
    const refreshTimer = setTimeout(async () => {
      console.log('[AuthContext] Proactively refreshing token...');
      try {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) throw error;
        
        setSession(data.session);
        setCurrentUser(data.session?.user ?? null);
        
        if (data.session) {
          SessionPersistence.saveSession({
            user: data.session.user,
            expires_at: data.session.expires_at,
          });
        }
      } catch (error) {
        console.error('[AuthContext] Failed to refresh token:', error);
      }
    }, refreshTime);
    
    return () => clearTimeout(refreshTimer);
  }, [session?.expires_at]);

  // Handle auth state changes
  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const subscription = authServiceSupabase.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        if (_event === 'SIGNED_OUT') {
          const wasExplicitSignOut = sessionStorage.getItem('explicit_signout') === 'true';
          
          if (wasExplicitSignOut) {
            console.log('[AuthContext] Explicit sign out detected');
            setSession(null);
            setCurrentUser(null);
            setSessionValid(false);
            setStoreSessionValid(false);
            setLoadedUserId(null);
            setDataLoaded(true);
            clearUserData();
            sessionStorage.removeItem('explicit_signout');
            SessionHeartbeat.stop();
          } else {
            console.warn('[AuthContext] SIGNED_OUT event without explicit action - ignoring');
          }
          return;
        }

        const shouldLoadUserData =
          _event === 'INITIAL_SESSION' ||
          _event === 'SIGNED_IN' ||
          _event === 'USER_UPDATED';

        const shouldIgnoreEvent =
          _event === 'TOKEN_REFRESHED' ||
          _event === 'PASSWORD_RECOVERY';

        if (shouldIgnoreEvent) {
          setSession(session);
          setCurrentUser(session?.user ?? null);
          setSessionValid(!!session);
          setStoreSessionValid(!!session);
          return;
        }

        setSession(session);
        setCurrentUser(session?.user ?? null);
        setSessionValid(!!session);
        setStoreSessionValid(!!session);

        if (session) {
          SessionPersistence.saveSession({
            user: session.user,
            expires_at: session.expires_at,
          });
        }

        if (session?.user && shouldLoadUserData) {
          loadUserData(session.user.id, session.user.email);
        } else if (!session) {
          clearUserData();
          setLoadedUserId(null);
          setDataLoaded(true);
        }
      }
    );

    // THEN check for existing session with retry logic
    const getSessionWithRetry = async (maxRetries = 3): Promise<Session | null> => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          const session = await authServiceSupabase.getSession();
          return session;
        } catch (error) {
          console.error(`[AuthContext] Session fetch attempt ${i + 1} failed:`, error);
          
          if (i === maxRetries - 1) {
            const storedSession = SessionPersistence.getSession();
            if (storedSession) {
              console.log('[AuthContext] Using stored session as fallback');
              return storedSession;
            }
            return null;
          }
          
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
      return null;
    };

    getSessionWithRetry().then(session => {
      if (!mounted) return;

      setSession(session);
      setCurrentUser(session?.user ?? null);
      setSessionValid(!!session);
      setStoreSessionValid(!!session);

      if (session) {
        SessionPersistence.saveSession({
          user: session.user,
          expires_at: session.expires_at,
        });
      }

      if (session?.user) {
        loadUserData(session.user.id, session.user.email).finally(() => {
          setLoading(false);
          setStoreLoading(false);
          SessionHeartbeat.start();
        });
      } else {
        setLoading(false);
        setStoreLoading(false);
        setDataLoaded(true);
        SessionHeartbeat.stop();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      setLoading(true);
      setStoreLoading(true);
      
      await authServiceSupabase.signUp({
        email,
        password,
        ...metadata,
      });
      
      // Session will be set by onAuthStateChange
      // The trigger should handle empresa creation automatically
      
    } finally {
      setLoading(false);
      setStoreLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setStoreLoading(true);
      
      await authServiceSupabase.signIn(email, password);
      
      // Session will be set by onAuthStateChange
    } finally {
      setLoading(false);
      setStoreLoading(false);
    }
  };

  const signOut = async () => {
    sessionStorage.setItem('explicit_signout', 'true');
    
    setSessionValid(false);
    setStoreSessionValid(false);
    setLoading(true);
    setStoreLoading(true);

    setCurrentUser(null);
    setSession(null);
    setLoadedUserId(null);
    setDataLoaded(true);
    clearUserData();
    
    SessionPersistence.clearSession();
    SessionHeartbeat.stop();

    try {
      await authServiceSupabase.signOut();
    } catch (signOutError) {
      // Silent error handling
    }

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('sb-') || key.includes('supabase')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      // Silent error handling
    }

    setLoading(false);
    setStoreLoading(false);
  };

  const checkSession = async (): Promise<boolean> => {
    try {
      const session = await authServiceSupabase.getSession();
      const isValid = !!session;

      setSession(session);
      setCurrentUser(session?.user ?? null);
      setSessionValid(isValid);
      setStoreSessionValid(isValid);

      if (session?.user) {
        await loadUserData(session.user.id, session.user.email);
      } else {
        setDataLoaded(true);
      }

      return isValid;
    } catch (error) {
      setDataLoaded(true);
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authServiceSupabase.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      await authServiceSupabase.updatePassword(newPassword);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    session,
    loading,
    sessionValid,
    dataLoaded,
    signUp,
    signIn,
    signOut,
    checkSession,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
