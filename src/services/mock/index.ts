// Mock services index - USE THESE INSTEAD OF REAL BACKEND SERVICES
// To switch back to real backend, change imports in your components to use the original services

// Export all mock services
export * as PropiedadesService from './propiedadesServiceMock';
export * as ProspectosService from './prospectosServiceMock';
export * as OportunidadesService from './oportunidadesServiceMock';
export * as PropietariosService from './propietariosServiceMock';
export * as EmpresaService from './empresaServiceMock';
export * as AgentesService from './agentesServiceMock';
export * as UserService from './userServiceMock';
export * as VisitasService from './visitasServiceMock';
export * as DocumentosService from './multimediaServiceMock';
export * as ImagenesService from './multimediaServiceMock';
export * as NotificationsService from './notificationsServiceMock';
export * as SaludDataService from './saludDataMock';
export * as ClientesService from './clientesServiceMock';
export * as CobrosService from './cobrosServiceMock';
export * as ProfilesService from './profilesServiceMock';
export * as PermissionsService from './permissionsServiceMock';

// Re-export mock data and utilities
export { MOCK_DATA, MOCK_USER_DATA, generateId, simulateDelay } from './mockData';