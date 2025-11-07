import { MOCK_DATA, simulateDelay, generateId } from './mockData';
import type { Empresa, EmpresaCreate } from '../../types/empresa';

const mockEmpresas: Empresa[] = [
  MOCK_DATA.empresa as any,
  {
    id: "empresa-nubecowork",
    nombre: "Nube Cowork",
    nit: "77.987.654-3",
    direccion: "Valdivia, Chile",
    codigo_telefonico: 56,
    telefono: 632234567,
    email: "contacto@nubecowork.cl",
    sobre_nosotros: "Espacio de coworking en Valdivia que fomenta la innovación y colaboración",
    mision: "Crear comunidad y espacios de trabajo flexibles para emprendedores y profesionales",
    vision: "Ser el principal hub de innovación del sur de Chile",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as any
];

// Mock implementation of empresa service
export const getEmpresa = async () => {
  await simulateDelay();
  return MOCK_DATA.empresa;
};

export const getAgencySettings = async () => {
  await simulateDelay();
  return MOCK_DATA.agencySettings;
};

export const updateEmpresa = async (updates: any) => {
  await simulateDelay();
  const updatedEmpresa = { ...MOCK_DATA.empresa, ...updates };
  Object.assign(MOCK_DATA.empresa, updatedEmpresa);
  return updatedEmpresa;
};

export const createEmpresa = async (empresaData: EmpresaCreate): Promise<Empresa> => {
  await simulateDelay();
  const newEmpresa: Empresa = {
    ...empresaData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Empresa;
  mockEmpresas.push(newEmpresa);
  return newEmpresa;
};

export const deleteEmpresa = async (id: string): Promise<void> => {
  await simulateDelay();
  const index = mockEmpresas.findIndex(e => e.id === id);
  if (index === -1) {
    throw new Error(`Empresa with id ${id} not found`);
  }
  mockEmpresas.splice(index, 1);
};

export const getEmpresaById = async (id: string) => {
  await simulateDelay();
  const empresa = mockEmpresas.find(e => e.id === id);
  if (empresa) {
    return empresa;
  }
  throw new Error(`Empresa with id ${id} not found`);
};

export const getEmpresaByName = async (name: string) => {
  await simulateDelay();
  if (name === MOCK_DATA.empresa.nombre) {
    return MOCK_DATA.empresa;
  }
  throw new Error(`Empresa with name ${name} not found`);
};