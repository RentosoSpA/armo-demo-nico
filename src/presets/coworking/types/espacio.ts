// Tipos adaptados de Propiedad para espacios de coworking

export enum TipoEspacio {
  OficinaPrivada = 'Oficina Privada',
  HotDesk = 'Hot Desk',
  EscritorioFlexible = 'Escritorio Flexible',
  SalaReunion = 'Sala de Reunión',
  AreaComun = 'Área Común',
  OficinaVirtual = 'Oficina Virtual',
  SalaEvento = 'Sala de Evento',
  Streaming = 'Sala Streaming'
}

export enum EstadoEspacio {
  Disponible = 'Disponible',
  Reservado = 'Reservado',
  Ocupado = 'Ocupado',
  Mantenimiento = 'Mantenimiento',
}

export enum ModalidadPlan {
  Mensual = 'Mensual',
  Flexible5 = 'Flexible 5 días',
  Flexible8 = 'Flexible 8 días',
  Flexible12 = 'Flexible 12 días',
  PorHoras = 'Por Horas',
  PorBloques = 'Por Bloques',
  AccesoLibre = 'Acceso Libre'
}

export enum Divisa {
  CLP = 'CLP',
  USD = 'USD'
}

export interface Espacio {
  id: string;
  titulo: string;
  tipo: TipoEspacio;
  estado: EstadoEspacio;
  modalidad: ModalidadPlan | ModalidadPlan[];
  precio: number;
  divisa: Divisa;
  
  // Características específicas
  descripcion?: string;
  capacidad?: number;
  area_m2?: number;
  piso?: number;
  ubicacion?: string;
  
  // Amenidades
  wifi_alta_velocidad?: boolean;
  impresora?: boolean;
  cafe_ilimitado?: boolean;
  casillero_personal?: boolean;
  acceso_24_7?: boolean;
  sala_descanso?: boolean;
  terraza?: boolean;
  cocina_equipada?: boolean;
  estacionamiento?: boolean;
  direccion_tributaria?: boolean;
  recepcion_correspondencia?: boolean;
  
  // Equipamiento (salas)
  proyector?: boolean;
  pantalla?: boolean;
  pizarra?: boolean;
  videoconferencia?: boolean;
  sonido?: boolean;
  streaming_equipado?: boolean;
  coffee_break?: boolean;
  
  // Relaciones
  empresa_id?: string;
  imagenPrincipal?: string | null;
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EspacioCreate extends Omit<Espacio, 'id' | 'createdAt' | 'updatedAt'> {
  // Required fields for creation
  titulo: string;
  tipo: TipoEspacio;
  estado: EstadoEspacio;
  modalidad: ModalidadPlan | ModalidadPlan[];
  precio: number;
  divisa: Divisa;
}
