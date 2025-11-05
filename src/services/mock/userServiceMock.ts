import { MOCK_USER_DATA, simulateDelay, generateId } from './mockData';

// Mock implementation of user service
const mockUsers = [...MOCK_USER_DATA.users];

export const getUsers = async () => {
  await simulateDelay();
  return mockUsers;
};

export const getUserById = async (id: string) => {
  await simulateDelay();
  const user = mockUsers.find(u => u.id === id);
  if (!user) {
    throw new Error(`User with id ${id} not found`);
  }
  return user;
};

export const createUser = async (uid: string, email: string, profile: any) => {
  await simulateDelay();
  const newUser = {
    id: generateId(),
    uid: uid,
    email: email,
    nombre: profile.nombre || '',
    apellido: profile.apellido || '',
    telefono: profile.telefono || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  return newUser;
};

export const updateUser = async (id: string, updates: any) => {
  await simulateDelay();
  const index = mockUsers.findIndex(u => u.id === id);
  if (index === -1) {
    throw new Error(`User with id ${id} not found`);
  }
  mockUsers[index] = { ...mockUsers[index], ...updates, updatedAt: new Date().toISOString() };
  return mockUsers[index];
};

export const updateUserByUid = async (uid: string, updates: any) => {
  await simulateDelay();
  const index = mockUsers.findIndex(u => u.uid === uid);
  if (index === -1) {
    throw new Error(`User with uid ${uid} not found`);
  }
  mockUsers[index] = { ...mockUsers[index], ...updates, updatedAt: new Date().toISOString() };
  return mockUsers[index];
};

export const getUser = async (uid: string) => {
  await simulateDelay();
  const user = mockUsers.find(u => u.uid === uid);
  if (!user) {
    throw new Error(`User with uid ${uid} not found`);
  }
  return user;
};