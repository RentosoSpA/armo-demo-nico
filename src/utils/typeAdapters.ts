/**
 * Type adapters for converting between User and Profile types
 * This helps bridge the gap between legacy User type and Supabase Profile type
 */

import type { User } from '../types/user';
import type { Profile } from '../types/profile';

/**
 * Convert Profile to User for backwards compatibility
 */
export const profileToUser = (profile: Profile): User => {
  return {
    uid: profile.user_id,
    email: '', // Email not stored in profile
    telefono: profile.phone || '',
    nombre: profile.full_name?.split(' ')[0],
    apellido: profile.full_name?.split(' ').slice(1).join(' '),
    // Additional fields can be added as needed
  };
};

/**
 * Convert User to Profile
 */
export const userToProfile = (user: User): Partial<Profile> => {
  return {
    user_id: user.uid,
    full_name: `${user.nombre || ''} ${user.apellido || ''}`.trim() || undefined,
    phone: typeof user.telefono === 'string' ? user.telefono : `${user.telefono}`,
  };
};
