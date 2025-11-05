import { simulateDelay } from './mockData';

export type ModuleKey = 'dashboard' | 'oportunidades' | 'propiedades' | 'visitas' | 'contratos' | 'cobros' | 'propietarios' | 'reportes' | 'usuarios' | 'integraciones' | 'agencia';

export type Perm = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export type PermissionMatrix = Record<ModuleKey, Perm>;

export type Role = 'owner' | 'admin' | 'manager' | 'agent' | 'viewer';

// Mock storage for permissions
const mockPermissions: Record<string, PermissionMatrix> = {};

const moduleLabels: Record<ModuleKey, string> = {
  dashboard: 'Tablero',
  oportunidades: 'Oportunidades',
  propiedades: 'Propiedades',
  visitas: 'Visitas',
  contratos: 'Contratos',
  cobros: 'Cobros',
  propietarios: 'Propietarios',
  reportes: 'Reportes',
  usuarios: 'Usuarios y Accesos',
  integraciones: 'Integraciones',
  agencia: 'Configuración de Agencia'
};

export const getModuleLabels = () => moduleLabels;

export const getRolePreset = (role: Role): PermissionMatrix => {
  const allTrue: Perm = { create: true, read: true, update: true, delete: true };
  const onlyRead: Perm = { create: false, read: true, update: false, delete: false };
  const readCreateUpdate: Perm = { create: true, read: true, update: true, delete: false };

  const modules: ModuleKey[] = ['dashboard', 'oportunidades', 'propiedades', 'visitas', 'contratos', 'cobros', 'propietarios', 'reportes', 'usuarios', 'integraciones', 'agencia'];

  switch (role) {
    case 'owner':
    case 'admin':
      return modules.reduce((acc, module) => ({ ...acc, [module]: allTrue }), {} as PermissionMatrix);
    
    case 'manager':
      return modules.reduce((acc, module) => {
        if (module === 'integraciones' || module === 'agencia') {
          return { ...acc, [module]: { ...allTrue, delete: false } };
        }
        return { ...acc, [module]: allTrue };
      }, {} as PermissionMatrix);
    
    case 'agent':
      return modules.reduce((acc, module) => {
        if (module === 'oportunidades' || module === 'visitas') {
          return { ...acc, [module]: readCreateUpdate };
        }
        return { ...acc, [module]: onlyRead };
      }, {} as PermissionMatrix);
    
    case 'viewer':
      return modules.reduce((acc, module) => ({ ...acc, [module]: onlyRead }), {} as PermissionMatrix);
    
    default:
      return modules.reduce((acc, module) => ({ ...acc, [module]: onlyRead }), {} as PermissionMatrix);
  }
};

export const getPermissionsByProfile = async (profileId: string): Promise<PermissionMatrix | null> => {
  await simulateDelay();
  return mockPermissions[profileId] || null;
};

export const savePermissions = async (profileId: string, matrix: PermissionMatrix): Promise<void> => {
  await simulateDelay();
  mockPermissions[profileId] = matrix;
};