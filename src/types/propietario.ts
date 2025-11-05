export interface PropiedadResumen {
  id: string;
  titulo: string;
  direccion: string;
  tipo: string;
  estado: string;
  precio_arriendo?: number;
  precio_venta?: number;
  imagen_url?: string;
}

export interface Propietario {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  codigo_telefonico: number;
  documento: string;
  tipo_documento: string;
  propiedades_asociadas: number;
  propiedades?: PropiedadResumen[];
  propietario_id?: string; // Para compatibilidad con datos mock
}
