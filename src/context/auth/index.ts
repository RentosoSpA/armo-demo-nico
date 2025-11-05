// Dynamic auth context export based on demo mode
// Currently forcing DEMO MODE - all imports use mock authentication
// To switch to production Supabase auth, change the exports below

// DEMO MODE - Using mock authentication (100% local, no Supabase)
export { AuthProvider, AuthContext } from '../AuthContextMock';
export type { AuthContextType } from '../AuthContextMock';

// PRODUCTION MODE - Uncomment these lines and comment out the lines above
// export { AuthProvider, AuthContext } from '../AuthContext';
// export type { AuthContextType } from '../AuthContext';
