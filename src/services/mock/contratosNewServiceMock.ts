import {
  MOCK_CONTRATOS,
  MOCK_PLANTILLAS,
  MOCK_PROPIEDADES,
  MOCK_PROSPECTOS,
  type Contrato,
  type Plantilla,
  type Propiedad,
  type Prospecto
} from '../../lib/contratos-mock';

const contratosList: Contrato[] = [...MOCK_CONTRATOS];
const plantillasList: Plantilla[] = [...MOCK_PLANTILLAS];

export async function listContratosByProp(propiedadId: string): Promise<Contrato[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return contratosList.filter(c => c.propiedadId === propiedadId);
}

export async function listPlantillas(): Promise<Plantilla[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return plantillasList;
}

export async function uploadToTemplate(file: File): Promise<Plantilla> {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newPlantilla: Plantilla = {
    id: `plt-upload-${Date.now()}`,
    titulo: file.name.replace(/\.(docx|pdf)$/i, ''),
    tipo: 'Otro',
    html: `<div style="font-family: 'Poppins', sans-serif; padding: 40px;">
      <h1>Documento importado: ${file.name}</h1>
      <p><strong>Propietario:</strong> {{prospecto.nombre}}</p>
      <p><strong>Propiedad:</strong> {{propiedad.titulo}}</p>
      <p><strong>Fecha:</strong> {{fecha.hoy}}</p>
      <p>Contenido del documento convertido...</p>
    </div>`,
    updatedAt: new Date().toISOString().split('T')[0],
    source: 'upload'
  };
  
  plantillasList.push(newPlantilla);
  return newPlantilla;
}

export async function useTemplateGenerate(
  plantillaId: string,
  propiedadId: string,
  prospectoId: string
): Promise<Contrato> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const plantilla = plantillasList.find(p => p.id === plantillaId);
  if (!plantilla) throw new Error('Plantilla no encontrada');
  
  const propiedad = MOCK_PROPIEDADES.find(p => p.id === propiedadId);
  const prospecto = MOCK_PROSPECTOS.find(p => p.id === prospectoId);
  
  const newContrato: Contrato = {
    id: `ctr-${Date.now()}`,
    propiedadId,
    prospectoId,
    plantillaId,
    titulo: `${plantilla.titulo} - ${propiedad?.titulo || 'Propiedad'} - ${prospecto?.nombre || 'Cliente'}`,
    html: plantilla.html,
    estado: 'Pendiente',
    createdAt: new Date().toISOString()
  };
  
  contratosList.push(newContrato);
  return newContrato;
}

export async function saveDraft(contratoId: string, html: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const contrato = contratosList.find(c => c.id === contratoId);
  if (contrato) {
    contrato.html = html;
  }
}

export async function makePublicLink(contratoId: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return `https://rentoso.app/contratos/view/${contratoId}?token=mock-token-${Date.now()}`;
}

export function openWhatsApp(phone: string, url: string, text?: string): void {
  const cleanPhone = phone.replace(/\D/g, '');
  const message = text || `Te comparto el contrato: ${url}`;
  const encodedText = encodeURIComponent(message);
  window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
}

export async function getPropiedad(id: string): Promise<Propiedad | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_PROPIEDADES.find(p => p.id === id);
}

export async function getProspecto(id: string): Promise<Prospecto | undefined> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return MOCK_PROSPECTOS.find(p => p.id === id);
}

export async function listPropiedades(): Promise<Propiedad[]> {
  await new Promise(resolve => setTimeout(resolve, 150));
  return MOCK_PROPIEDADES;
}

export async function listProspectos(): Promise<Prospecto[]> {
  await new Promise(resolve => setTimeout(resolve, 150));
  return MOCK_PROSPECTOS;
}
