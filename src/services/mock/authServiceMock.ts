import { simulateDelay } from './mockData';

// Mock user credentials for authentication
const MOCK_CREDENTIALS = [
  {
    email: 'paula@rentoso.cl',
    password: '123456',
    uid: 'mock-uid-1'
  },
  {
    email: 'usuario@rentoso.cl',
    password: '123456',
    uid: 'vhSivPcil1eyLoHVL2lkXTVQvCG3'
  },
  {
    email: 'demo@rentoso.cl',
    password: 'demo123',
    uid: 'demo-uid'
  },
  // Add some easier test credentials
  {
    email: 'test@test.com',
    password: '123456',
    uid: 'test-uid-1'
  },
  {
    email: 'admin@admin.com',
    password: 'admin',
    uid: 'admin-uid'
  },
  {
    email: 'user@user.com',
    password: 'password',
    uid: 'user-uid'
  },
  {
    email: 'vicente.aedo@rentoso.cl',
    password: 'QccvQ5la',
    uid: 'vicente-uid'
  }
];

// Mock session storage
let currentSession: { uid: string; email: string } | null = null;

export const mockAuthLogin = async (idToken: string): Promise<{ success: boolean; uid?: string }> => {
  await simulateDelay();

  // In a real scenario, you would verify the idToken
  // For mock purposes, we'll just return success
  const credential = MOCK_CREDENTIALS.find(c => c.uid === idToken);
  if (credential) {
    currentSession = { uid: credential.uid, email: credential.email };
    return { success: true, uid: credential.uid };
  }

  throw new Error('Invalid token');
};

export const mockAuthLogout = async (): Promise<{ success: boolean }> => {
  await simulateDelay();
  currentSession = null;
  return { success: true };
};

export const mockValidateSession = async (): Promise<{ data: { uid: string; email: string } | null }> => {
  await simulateDelay();

  if (currentSession) {
    return { data: currentSession };
  }

  return { data: null };
};

// Mock Firebase-like authentication
export const mockCreateUserWithEmailAndPassword = async (email: string, password: string) => {
  await simulateDelay();

  // Check if user already exists
  const existingCredential = MOCK_CREDENTIALS.find(c => c.email === email);
  if (existingCredential) {
    throw new Error('User already exists');
  }

  // Create new user
  const newUid = `mock-uid-${Date.now()}`;
  const newCredential = {
    email,
    password,
    uid: newUid
  };

  MOCK_CREDENTIALS.push(newCredential);

  // Return UserCredential-like object
  return {
    user: {
      uid: newUid,
      email,
      role: 'user',
      getIdToken: async () => newUid
    }
  };
};

export const mockSignInWithEmailAndPassword = async (email: string, password: string) => {
  await simulateDelay();

  // Normalize inputs (trim whitespace and convert to lowercase for email)
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  console.log(`[Mock Auth] Attempting login with email: "${normalizedEmail}", password: "${normalizedPassword}"`);
  console.log(`[Mock Auth] Available credentials:`, MOCK_CREDENTIALS.map(c => ({ email: c.email, password: c.password })));

  const credential = MOCK_CREDENTIALS.find(c =>
    c.email.toLowerCase() === normalizedEmail && c.password === normalizedPassword
  );

  if (!credential) {
    console.error(`[Mock Auth] Login failed. No matching credential found for email: "${normalizedEmail}"`);
    throw new Error('Invalid email or password');
  }

  console.log(`[Mock Auth] Login successful for user: ${credential.email}`);
  currentSession = { uid: credential.uid, email: credential.email };

  // Return UserCredential-like object
  return {
    user: {
      uid: credential.uid,
      email: credential.email,
      role: 'user',
      getIdToken: async () => credential.uid
    }
  };
};

export const mockDeleteUser = async (user: any): Promise<void> => {
  await simulateDelay();
  // In mock implementation, we won't actually delete from MOCK_CREDENTIALS
  // to maintain consistency, but in real implementation this would delete the user
  console.log(`Mock: Deleting user ${user.uid}`);
};

// Helper to get current session for debugging
export const getCurrentSession = () => currentSession;