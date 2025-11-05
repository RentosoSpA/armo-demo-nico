import { simulateDelay, generateId } from './mockData';

// Mock implementation of notifications service
const mockNotifications = [
  {
    id: '1',
    title: 'Nueva visita agendada',
    message: 'Se agendó una visita para el departamento en Providencia',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: '2',
    title: 'Oportunidad cerrada',
    message: 'La oportunidad en Ñuñoa fue marcada como vendida',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
];

export const getNotifications = async () => {
  await simulateDelay();
  return mockNotifications;
};

export const markAsRead = async (id: string) => {
  await simulateDelay();
  const notification = mockNotifications.find(n => n.id === id);
  if (notification) {
    notification.read = true;
  }
  return notification;
};

export const markAllAsRead = async () => {
  await simulateDelay();
  mockNotifications.forEach(n => n.read = true);
  return { success: true };
};

export const createNotification = async (notification: any) => {
  await simulateDelay();
  const newNotification = {
    ...notification,
    id: generateId(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  mockNotifications.unshift(newNotification);
  return newNotification;
};