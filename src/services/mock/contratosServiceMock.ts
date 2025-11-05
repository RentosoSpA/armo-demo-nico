import { MOCK_DATA } from './mockData';
import type { Contrato } from '../../types/contratos';

export async function getContratosByEmpresa(empresaId: string): Promise<Contrato[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return (MOCK_DATA as any).contratos.filter((contrato: any) => contrato.empresa_id === empresaId);
}

export async function crearContratoDesdePlantillaMock(
  empresaId: string, 
  plantillaId: string, 
  propiedadId: string,
  prospectoId: string, 
  nombre: string
): Promise<Contrato> {
  // Simulate creation delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Find the template to base the contract on
  const plantilla = (MOCK_DATA as any).plantillas.find((p: any) => p.plantilla_id === plantillaId);
  
  // Generate new contract
  const nuevoContrato: Contrato = {
    id: `ctr-${Date.now()}`,
    empresa_id: empresaId,
    plantilla_id: plantillaId,
    nombre,
    estado: 'borrador',
    contenido_html: plantilla 
      ? `<!-- Contrato generado desde plantilla: ${plantilla.filename} --><div class="contrato">${nombre}</div>`
      : `<!-- Contrato base --><div class="contrato">${nombre}</div>`,
    storage_url: null,
    propiedad_id: propiedadId,
    prospecto_id: prospectoId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Add to mock data (simulating database insert)
  (MOCK_DATA as any).contratos.push(nuevoContrato);
  
  return nuevoContrato;
}

export async function getContratoById(id: string): Promise<Contrato | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const contrato = (MOCK_DATA as any).contratos.find((c: any) => c.id === id);
  return contrato || null;
}

export async function actualizarContrato(id: string, updates: Partial<Contrato>): Promise<Contrato | null> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const contratoIndex = (MOCK_DATA as any).contratos.findIndex((c: any) => c.id === id);
  
  if (contratoIndex === -1) return null;
  
  // Update the contract
  (MOCK_DATA as any).contratos[contratoIndex] = {
    ...(MOCK_DATA as any).contratos[contratoIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return (MOCK_DATA as any).contratos[contratoIndex];
}

export async function getContratosByPropiedad(empresaId: string, propiedadId: string): Promise<Contrato[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return (MOCK_DATA as any).contratos.filter((contrato: any) => 
    contrato.empresa_id === empresaId && contrato.propiedad_id === propiedadId
  );
}