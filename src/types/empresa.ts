export interface Empresa {
  id: string;
  nombre: string;
  nit: string;
  direccion: string;
  codigo_telefonico: number;
  telefono: number;
  email: string;
  sobre_nosotros: string | null;
  mision: string | null;
  vision: string | null;
  // Backward compatibility aliases
  codigoTelefonico?: number;
  sobreNosotros?: string | null;
}

export interface EmpresaCreate {
  nombre: string;
  nit: string;
  direccion: string;
  codigo_telefonico: number;
  telefono: number;
  email: string;
  sobre_nosotros: string;
  mision: string;
  vision: string;
  // Backward compatibility aliases
  codigoTelefonico?: number;
  sobreNosotros?: string;
}