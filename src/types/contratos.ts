export type FormatoPlantilla = 'html' | 'text';
export type EstadoPlantilla = 'borrador' | 'publicado';
export type EstadoContrato = 'borrador' | 'enviado' | 'firmado' | 'anulado';

export interface Plantilla {
  id: string;
  empresa_id: string;
  filename: string;
  mime: string;
  size: number;
  estado: string; // "subido" | "procesado" | "error"
  plantilla_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Contrato {
  id: string;
  empresa_id: string;
  plantilla_id: string;
  nombre: string;
  estado: EstadoContrato;
  contenido_html: string;
  storage_url: string | null;
  propiedad_id?: string;
  prospecto_id?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContratoCreate {
  empresa_id: string;
  plantilla_id: string;
  nombre: string;
  estado?: EstadoContrato;
}