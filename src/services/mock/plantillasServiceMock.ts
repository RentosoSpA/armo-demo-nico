import { MOCK_DATA } from './mockData';
import type { Plantilla } from '../../types/contratos';

export async function getPlantillasByEmpresa(empresaId: string): Promise<Plantilla[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return (MOCK_DATA as any).plantillas.filter((plantilla: any) => plantilla.empresa_id === empresaId);
}

export async function getPlantillaById(id: string): Promise<Plantilla | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const plantilla = (MOCK_DATA as any).plantillas.find((p: any) => p.id === id);
  return plantilla || null;
}