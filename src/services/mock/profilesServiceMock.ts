import { MOCK_USER_DATA, simulateDelay, generateId } from './mockData';

export type Role = 'admin' | 'agent' | 'manager' | 'owner' | 'viewer';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  company_name: string;
  phone: string;
  role: Role;
  empresa_id: string;
  created_at: string;
  updated_at: string;
}

// Mock implementation of profiles service
const mockProfiles: Profile[] = MOCK_USER_DATA.profiles.map(p => ({
  ...p,
  role: p.role as Role
}));

export const getProfiles = async (): Promise<Profile[]> => {
  await simulateDelay();
  return mockProfiles;
};

export const getProfilesByEmpresa = async (empresaId: string): Promise<Profile[]> => {
  await simulateDelay();
  return mockProfiles.filter(profile => profile.empresa_id === empresaId);
};

export const createProfile = async (profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>): Promise<Profile> => {
  await simulateDelay();
  const newProfile: Profile = {
    ...profileData,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  mockProfiles.push(newProfile);
  return newProfile;
};

export const updateProfileRole = async (profileId: string, role: Role): Promise<Profile> => {
  await simulateDelay();
  const index = mockProfiles.findIndex(profile => profile.id === profileId);
  if (index === -1) {
    throw new Error(`Profile with id ${profileId} not found`);
  }
  mockProfiles[index] = {
    ...mockProfiles[index],
    role,
    updated_at: new Date().toISOString()
  };
  return mockProfiles[index];
};

export const deleteProfile = async (profileId: string): Promise<boolean> => {
  await simulateDelay();
  const index = mockProfiles.findIndex(profile => profile.id === profileId);
  if (index === -1) {
    throw new Error(`Profile with id ${profileId} not found`);
  }
  mockProfiles.splice(index, 1);
  return true;
};

export const getProfileByUserId = async (userId: string): Promise<Profile> => {
  await simulateDelay();
  const profile = mockProfiles.find(profile => profile.user_id === userId);
  if (!profile) {
    throw new Error(`Profile with user_id ${userId} not found`);
  }
  return profile;
};