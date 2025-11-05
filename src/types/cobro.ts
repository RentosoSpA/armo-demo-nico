export enum EstadoCobro {
  Pagado = 'Pagado',
  PorCobrar = 'Por cobrar',
  Atrasado = 'Atrasado',
  CobradoParcialmente = 'Cobrado parcialmente',
}

export interface CobroCliente {
  nombre: string;
  telefono: string;
  email: string;
}

export interface CobroPropiedad {
  id: string;
  titulo: string;
  direccion: string;
  imagenUrl?: string;
}

export interface Cobro {
  id: string;
  propiedad: CobroPropiedad;
  cliente: CobroCliente;
  estado: EstadoCobro;
  monto: number;
  divisa: string;
  fechaVencimiento: Date;
  fechaPago?: Date;
  montoAbonado?: number;
  observaciones?: string;
}

export interface CobroCreate {
  propiedadId: string;
  clienteId: string;
  monto: number;
  fechaVencimiento: Date;
  observaciones?: string;
}

export interface CobroStats {
  pendientesCobrar: number;
  atrasados: number;
  cobradosExito: number;
  totalMonto: number;
}