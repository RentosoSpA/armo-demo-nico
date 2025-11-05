import { createContext, useState, useEffect, type ReactNode } from 'react';
import type { User as AppUser } from '../types/user';
import type { Agente } from '../types/agente';
import {
  mockAuthLogin,
  mockAuthLogout,
  mockValidateSession,
  mockCreateUserWithEmailAndPassword,
  mockSignInWithEmailAndPassword,
  mockDeleteUser
} from '../services/mock/authServiceMock';
import { getProfileByUserId } from '../services/mock/profilesServiceMock';
import { getAgenteByUserUid } from '../services/mock/agentesServiceMock';
import { getEmpresaById } from '../services/mock/empresaServiceMock';
import { useUserStore } from '../store/userStore';

// Mock user interface compatible with Firebase User
export interface MockUser {
  uid: string;
  email: string;
  role: string;
  getIdToken: () => Promise<string>;
}

export interface ExtendedUser extends MockUser {
  role: string;
}

interface UserCredential {
  user: MockUser;
}

interface AuthContextType {
  currentUser: ExtendedUser | null;
  userProfile: AppUser | null;
  userAgent: Agente | null;
  setUserProfile: (profile: AppUser | null) => void;
  setUserAgent: (agent: Agente | null) => void;
  loading: boolean;
  sessionValid: boolean;
  dataLoaded: boolean;
  signup: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  login: (email: string, password: string) => Promise<string>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteUser: (user: MockUser) => Promise<void>;
  checkSession: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [userAgent, setUserAgent] = useState<Agente | null>(null);
  const [sessionValid, setSessionValid] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  // Sync with user store
  const {
    setUserProfile: setStoreUserProfile,
    setAgent: setStoreAgent,
    setEmpresa: setStoreEmpresa,
    setSessionValid: setStoreSessionValid,
  } = useUserStore();

  function signup(email: string, password: string): Promise<UserCredential> {
    return mockCreateUserWithEmailAndPassword(email, password);
  }

  async function signUp(email: string, password: string, metadata?: any): Promise<void> {
    const userCredential = await mockCreateUserWithEmailAndPassword(email, password);
    // Create user profile in mock data
    const { createUser } = await import('../services/mock/userServiceMock');
    await createUser(userCredential.user.uid, email, {
      nombre: metadata?.full_name || '',
      apellido: '',
      telefono: metadata?.phone || ''
    });
  }

  async function login(email: string, password: string): Promise<string> {
    try {
      const userCredential = await mockSignInWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;
      const idToken = await userCredential.user.getIdToken();
      await mockAuthLogin(idToken);

      return uid;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async function signIn(email: string, password: string): Promise<void> {
    try {
      const uid = await login(email, password);
      
      // ✅ CRÍTICO: Obtener sesión actualizada y setear estados
      const session = await mockValidateSession();
      
      if (session && session.data && session.data.uid) {
        // Crear mock user object
        const mockUser = {
          uid: session.data.uid,
          email: session.data.email,
          role: 'user',
          getIdToken: async () => session.data!.uid
        } as ExtendedUser;

        setCurrentUser(mockUser);
        setSessionValid(true);
        setStoreSessionValid(true);
        
        // Cargar datos de usuario inmediatamente
        try {
          const profile = await getProfileByUserId(session.data.uid);
          const adaptedUser: AppUser = {
            uid: profile.user_id,
            email: session.data.email,
            nombre: profile.full_name || '',
            telefono: profile.phone || '',
          };
          setUserProfile(adaptedUser);
          setStoreUserProfile(adaptedUser);

          try {
            const agent = await getAgenteByUserUid(session.data.uid);
            if (agent) {
              setUserAgent(agent);
              setStoreAgent(agent);

              if (agent.empresaId) {
                try {
                  const empresa = await getEmpresaById(agent.empresaId);
                  setStoreEmpresa(empresa);
                } catch (empresaError) {
                  console.error('Error loading empresa data:', empresaError);
                  setStoreEmpresa(null);
                }
              } else {
                setStoreEmpresa(null);
              }
            } else {
              setUserAgent(null);
              setStoreAgent(null);
              setStoreEmpresa(null);
            }
          } catch (agentError) {
            console.log('User is not an agent');
            setUserAgent(null);
            setStoreAgent(null);
            setStoreEmpresa(null);
          }
          
          setDataLoaded(true);
        } catch (error) {
          console.error('Error loading user data:', error);
          throw new Error('Failed to load user data');
        }
      } else {
        throw new Error('Session validation failed after login');
      }
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  }

  async function logout(): Promise<void> {
    try {
      sessionStorage.setItem('explicit_signout', 'true');
      
      await mockAuthLogout();
      
      localStorage.removeItem('mock_session_backup');
      
      setUserProfile(null);
      setUserAgent(null);
      setSessionValid(false);
      setStoreUserProfile(null);
      setStoreAgent(null);
      setStoreEmpresa(null);
      setStoreSessionValid(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  function deleteUserCredentials(user: MockUser): Promise<void> {
    return mockDeleteUser(user);
  }

  async function resetPassword(email: string): Promise<void> {
    // Mock implementation - simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`[Mock Auth] Password reset requested for: ${email}`);
  }

  async function updatePassword(newPassword: string): Promise<void> {
    // Mock implementation - simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`[Mock Auth] Password updated`);
  }

  async function checkSession(): Promise<boolean> {
    try {
      const session = await mockValidateSession();
      const isValid = Boolean(session && session.data && session.data.uid);

      setSessionValid(isValid);
      setStoreSessionValid(isValid);

      if (isValid && session.data?.uid) {
          try {
            const profile = await getProfileByUserId(session.data!.uid);
            console.log('[AuthContext] Profile from service:', profile);
            const adaptedUser: AppUser = {
              uid: profile.user_id,
              email: '',
              nombre: profile.full_name || '',
              telefono: profile.phone || '',
            };
            console.log('[AuthContext] Adapted user for context:', adaptedUser);
            setUserProfile(adaptedUser);
            setStoreUserProfile(adaptedUser);

          try {
            const agent = await getAgenteByUserUid(session.data!.uid);
            if (agent) {
              setUserAgent(agent);
              setStoreAgent(agent);

              // Load empresa data if agent has empresaId
              if (agent!.empresaId) {
                try {
                  const empresa = await getEmpresaById(agent!.empresaId);
                  setStoreEmpresa(empresa);
                } catch (empresaError) {
                  console.error('Error loading empresa data:', empresaError);
                  setStoreEmpresa(null);
                }
              } else {
                setStoreEmpresa(null);
              }
            } else {
              // User is not an agent
              console.log('User is not an agent, skipping agent-specific data loading');
              setUserAgent(null);
              setStoreAgent(null);
              setStoreEmpresa(null);
            }
          } catch (agentError) {
            // User is not an agent - this is expected for regular users
            console.log('User is not an agent, skipping agent-specific data loading');
            setUserAgent(null);
            setStoreAgent(null);
            setStoreEmpresa(null);
          }
          setDataLoaded(true);
        } catch (error) {
          console.error('Error fetching user profile or agent from session:', error);
          // If user not found, clear session
          await mockAuthLogout();
          setUserProfile(null);
          setUserAgent(null);
          setStoreUserProfile(null);
          setStoreAgent(null);
          setStoreEmpresa(null);
          setDataLoaded(false);
          setSessionValid(false);
          setStoreSessionValid(false);
          return false;
        }
      } else {
        setUserProfile(null);
        setUserAgent(null);
        setStoreUserProfile(null);
        setStoreAgent(null);
        setStoreEmpresa(null);
        setDataLoaded(false);
      }

      return isValid;
    } catch (error) {
      console.error('Session validation failed:', error);
      setSessionValid(false);
      setStoreSessionValid(false);
      setUserProfile(null);
      setUserAgent(null);
      setStoreUserProfile(null);
      setStoreAgent(null);
      setStoreEmpresa(null);
      return false;
    }
  }

  useEffect(() => {
    // Clean up any Supabase-related localStorage on mount
    const cleanSupabaseStorage = () => {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      if (keysToRemove.length > 0) {
        console.log('[AuthContext] Cleaned up Supabase storage keys:', keysToRemove);
      }
    };

    cleanSupabaseStorage();

    const checkAuthState = async () => {
      try {
        console.log('[AuthContext] Starting auth state check...');
        setLoading(true);
        
        const storedSession = localStorage.getItem('mock_session_backup');
        let session = await mockValidateSession();
        
        if ((!session || !session.data) && storedSession) {
          try {
            console.log('[AuthContext] Using session backup from localStorage');
            session = { data: JSON.parse(storedSession) };
          } catch (e) {
            console.error('[AuthContext] Failed to parse session backup:', e);
          }
        }
        
        if (session?.data) {
          localStorage.setItem('mock_session_backup', JSON.stringify(session.data));
        }
        
        console.log('[AuthContext] Session validation result:', session);

        if (session && session.data && session.data.uid) {
          // Create a mock user object
          const mockUser = {
            uid: session.data.uid,
            email: session.data.email,
            role: 'user',
            getIdToken: async () => session.data!.uid
          } as ExtendedUser;

          setCurrentUser(mockUser);
          
          // ✅ FIX: Marcar sesión válida durante hidratación inicial
          setSessionValid(true);
          setStoreSessionValid(true);
          console.log('[AuthContext] Session restored on mount, sessionValid=true');

          try {
            const profile = await getProfileByUserId(session.data.uid);
            console.log('[AuthContext useEffect] Profile from service:', profile);
            const adaptedUser: AppUser = {
              uid: profile.user_id,
              email: '',
              nombre: profile.full_name || '',
              telefono: profile.phone || '',
            };
            console.log('[AuthContext useEffect] Adapted user for context:', adaptedUser);
            setUserProfile(adaptedUser);
            setStoreUserProfile(adaptedUser);

            try {
              const agent = await getAgenteByUserUid(session.data.uid);
              if (agent) {
                setUserAgent(agent);
                setStoreAgent(agent);

                // Load empresa data if agent has empresaId
                if (agent!.empresaId) {
                  try {
                    const empresa = await getEmpresaById(agent!.empresaId);
                    setStoreEmpresa(empresa);
                  } catch (empresaError) {
                    console.error('Error loading empresa data:', empresaError);
                    setStoreEmpresa(null);
                  }
                } else {
                  setStoreEmpresa(null);
                }
              } else {
                // User is not an agent
                console.log('User is not an agent, skipping agent-specific data loading');
                setUserAgent(null);
                setStoreAgent(null);
                setStoreEmpresa(null);
              }
            } catch (agentError) {
              // User is not an agent - this is expected for regular users
              console.log('User is not an agent, skipping agent-specific data loading');
              setUserAgent(null);
              setStoreAgent(null);
              setStoreEmpresa(null);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            // If user not found, clear session
            await mockAuthLogout();
            setCurrentUser(null);
            setUserProfile(null);
            setUserAgent(null);
            setStoreUserProfile(null);
            setStoreAgent(null);
            setStoreEmpresa(null);
            setDataLoaded(false);
            setLoading(false);
            return;
          }

          // Mark data as loaded after successful user data load
          setDataLoaded(true);
        } else {
          setCurrentUser(null);
          setUserProfile(null);
          setUserAgent(null);
          setDataLoaded(false);
          // ✅ FIX: Marcar sesión inválida cuando no hay sesión
          setSessionValid(false);
          setStoreSessionValid(false);
        }
      } catch (error) {
        console.error('Error in mock auth state check:', error);
        setDataLoaded(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, [setStoreUserProfile, setStoreAgent, setStoreEmpresa, setStoreSessionValid]);

  const value = {
    currentUser,
    userProfile,
    userAgent,
    setUserProfile,
    setUserAgent,
    loading,
    sessionValid,
    dataLoaded,
    signup,
    signUp,
    login,
    signIn,
    logout,
    signOut: logout,
    deleteUser: deleteUserCredentials,
    checkSession,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export type { AuthContextType };