import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContextMock';
import type { ProfileCreate } from '../../types/profile';
import type { EmpresaCreate } from '../../types/empresa';
import type { AgenteCreate } from '../../types/agente';
import { createUser, getUser } from '../user/userService';
import { getAgenteByUserUid } from '../agentes/agenteService';
import { createEmpresa, deleteEmpresa } from '../empresa/empresaService';
import { createAgente } from '../agentes/agenteService';
import { useUserStore } from '../../store/userStore';

export function useAuthService() {
  const context = useContext(AuthContext);
  const { setUserProfile, setAgent, setSessionValid, setLoading, clearUserData } = useUserStore();

  if (!context) {
    throw new Error('useAuthService must be used within an AuthProvider');
  }

  const signupWithProfile = async (email: string, password: string, profile: ProfileCreate) => {
    let userCredential;

    try {
      userCredential = await context.signup(email, password);
      await createUser(userCredential.user.uid, email, profile);
      return userCredential.user.uid;
    } catch (error) {
      if (userCredential?.user) {
        try {
          await context.deleteUser(userCredential.user);
          console.log('Firebase user deleted due to profile creation failure: ', error);
        } catch (deleteError) {
          console.error(
            'Failed to delete Firebase user after profile creation failure:',
            deleteError
          );
        }
      }
      throw error;
    }
  };

  const signupEmpresa = async (
    email: string,
    password: string,
    empresaData: EmpresaCreate,
    agenteData: Omit<AgenteCreate, 'empresaId' | 'userUID'>,
    userProfileData: ProfileCreate
  ) => {
    let userCredential;
    let createdEmpresa;
    let createdUser;

    try {
      // Step 1: Create Firebase user
      userCredential = await context.signup(email, password);

      // Step 2: Create empresa
      createdEmpresa = await createEmpresa(empresaData);

      // Step 3: Create user profile
      createdUser = await createUser(userCredential.user.uid, email, userProfileData);

      // Step 4: Create agente with empresaId and userUID
      const agenteDataWithIds: AgenteCreate = {
        ...agenteData,
        empresaId: createdEmpresa.id,
        userUID: userCredential.user.uid,
      };
      await createAgente(agenteDataWithIds);

      return { userUid: userCredential.user.uid, empresaId: createdEmpresa.id };
    } catch (error) {
      // Cleanup: Delete all created entities in reverse order

      // Step 4: Delete agente if it was created (handled by backend cascade or manual deletion if needed)
      // Note: Agente deletion might be handled by backend cascade when empresa is deleted

      // Step 3: Delete user profile if it was created
      if (createdUser) {
        try {
          // Note: You might need to implement deleteUser function
          // await deleteUser(userCredential.user.uid);
          console.log('User profile deletion would be handled here if needed');
        } catch (deleteError) {
          console.error(
            'Failed to delete user profile after agente creation failure:',
            deleteError
          );
        }
      }

      // Step 2: Delete empresa if it was created
      if (createdEmpresa) {
        try {
          await deleteEmpresa(createdEmpresa.id);
          console.log('Empresa deleted due to agente creation failure: ', error);
        } catch (deleteError) {
          console.error('Failed to delete empresa after agente creation failure:', deleteError);
        }
      }

      // Step 1: Delete Firebase user if it was created
      if (userCredential?.user) {
        try {
          await context.deleteUser(userCredential.user);
          console.log('Firebase user deleted due to empresa/agente creation failure: ', error);
        } catch (deleteError) {
          console.error(
            'Failed to delete Firebase user after empresa/agente creation failure:',
            deleteError
          );
        }
      }

      throw error;
    }
  };

  const loginWithProfile = async (email: string, password: string) => {
    try {
      setLoading(true);
      const uid = await context.login(email, password);

      // Get user profile
      const userProfile = await getUser(uid);
      const adaptedUser = {
        uid: userProfile.user_id,
        email: '',
        telefono: userProfile.phone || '',
      };
      setUserProfile(adaptedUser);

      // Get agent information related to the user
      try {
        const userAgent = await getAgenteByUserUid(userProfile.user_id);
        setAgent(userAgent);
      } catch {
        // User might not be an agent, set agent to null
        console.log('User is not an agent or agent not found');
        setAgent(null);
      }

      console.log('session validated');
      setSessionValid(true);
      return userProfile;
    } catch (error) {
      console.error(error);
      clearUserData();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      setLoading(true);
      await context.logout();
      clearUserData();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local data
      clearUserData();
    } finally {
      setLoading(false);
    }
  };

  const checkUserSession = async () => {
    try {
      setLoading(true);
      const isValid = await context.checkSession();
      setSessionValid(isValid);

      if (isValid) {
        // Session is valid, user data should already be loaded by context
        // Just ensure store is in sync
        if (context.userProfile) {
          setUserProfile(context.userProfile);
        }
        if (context.userAgent) {
          setAgent(context.userAgent);
        }
      } else {
        clearUserData();
      }

      return isValid;
    } catch (error) {
      console.error('Session check error:', error);
      clearUserData();
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    login: loginWithProfile,
    signup: signupWithProfile,
    signupEmpresa: signupEmpresa,
    logout: logoutUser,
    checkSession: checkUserSession,
    currentUser: context.currentUser,
    userProfile: context.userProfile,
    userAgent: context.userAgent,
    loading: context.loading,
    sessionValid: context.sessionValid,
  };
}
