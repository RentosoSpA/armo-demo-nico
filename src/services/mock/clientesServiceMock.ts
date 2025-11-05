import { MOCK_USER_DATA, simulateDelay, generateId } from './mockData';

// Mock implementation of clientes service
const mockClientes = [...MOCK_USER_DATA.users];

export const getClientes = async () => {
  await simulateDelay();
  return mockClientes;
};

export const createUser = async (userData: any) => {
  await simulateDelay();
  const newUser = {
    ...userData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockClientes.push(newUser);
  return newUser;
};

export const updateUser = async (id: string, updates: any) => {
  await simulateDelay();
  const index = mockClientes.findIndex(u => u.id === id);
  if (index === -1) {
    throw new Error(`User with id ${id} not found`);
  }
  mockClientes[index] = { ...mockClientes[index], ...updates, updatedAt: new Date().toISOString() };
  return mockClientes[index];
};