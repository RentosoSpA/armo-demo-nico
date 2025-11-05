import type { Empresa } from './empresa';
import type { Propietario } from './propietario';
import type { Agente } from './agente';
import type { Amenidades } from './amenidades';
import type { Oportunidad } from './oportunidad';
import type { Visita } from './visita';

export enum TipoPropiedad {
  Agricola = 'Agrícola',
  Bodega = 'Bodega',
  Casa = 'Casa',
  Departamento = 'Departamento',
  Estacionamiento = 'Estacionamiento',
  Hotel = 'Hotel',
  Industrial = 'Industrial',
  LlaveDeNegocio = 'Llave de Negocio',
  LocalComercial = 'Local comercial',
  Oficina = 'Oficina',
  Parcela = 'Parcela',
  Sitio = 'Sitio',
  Terreno = 'Terreno'
}

export enum EstadoPropiedad {
  Disponible = 'Disponible',
  Reservada = 'Reservada',
  Arrendada = 'Arrendada',
  Vendida = 'Vendida',
}

export enum TipoOperacion {
  Venta = 'Venta',
  Renta = 'Renta',
  RentaTemporal = 'Renta temporal'
}

export enum Divisa {
  UF = 'UF',
  CLP = 'CLP',
}

export enum Banco {
  BBVA = 'Banco BBVA',
  BICE = 'Banco BICE',
  Consorcio = 'Banco Consorcio',
  Chile = 'Banco de Chile',
  NacionArgentina = 'Banco de la Nación Argentina',
  Brasil = 'Banco do Brasil',
  Edwards = 'Banco Edwards',
  Falabella = 'Banco Falabella',
  Itau = 'Banco Itau',
  Paris = 'Banco París',
  Penta = 'Banco Penta',
  Ripley = 'Banco Ripley',
  Santander = 'Banco Santander',
  Security = 'Banco Security',
  Tokyo = 'Bank Of Tokyo',
  BCI = 'BCI',
  CorpBanca = 'CorpBanca',
  Deutsche = 'Deutsche Bank',
  HSBC = 'HSBC',
  JPMorgan = 'JP Morgan Chase Bank',
  RaboBank = 'RaboBank',
  ScotiaBank = 'ScotiaBank',
}

export enum Region {
  Antofagasta = 'Antofagasta',
  AricaYParinacota = 'Arica y Parinacota',
  Atacama = 'Atacama',
  Aysen = 'Aysén',
  BernardoOHiggins = 'Bernardo O\'Higgins',
  LaAraucania = 'La Araucanía',
  Coquimbo = 'Coquimbo',
  BioBio = 'Bío-Bío',
  Maule = 'Maule',
  LosLagos = 'Los Lagos',
  LosRios = 'Los Ríos',
  MagallanesYAntartica = 'Magallanes y Antártica',
  Valparaiso = 'Valparaíso',
  Metropolitana = 'Metropolitana',
  Tarapaca = 'Tarapacá',
}

export enum TipoPiso {
  Alfombra = 'Alfombra',
  BaldosaCordoba = 'Baldosa Córdoba',
  Baldosas = 'Baldosas',
  BaldosinCeramico = 'Baldosín cerámico',
  CementoRefinado = 'Cemento Refinado',
  Ceramica = 'Cerámica',
  CubrePisos = 'Cubre Pisos',
  Flexit = 'Flexit',
  Madera = 'Madera',
  Marmol = 'Mármol',
  Otros = 'Otros',
  Parquet = 'Parquet',
  PiedraPizarra = 'Piedra Pizarra',
  PisoFlotante = 'Piso Flotante',
  Porcelanato = 'Porcelanato',
  RadierAfinado = 'Radier afinado',
}

export enum TipoDepartamento {
  AptoOficina = 'Apto Oficina',
  Duplex = 'Duplex',
  Loft = 'Loft',
  Penthouse = 'Penthouse',
  UnAmbiente = 'Un Ambiente',
}

export enum RecepcionFinal {
  EnTramite = 'En Trámite',
  M2NoRecepcionados = 'm2 no recepcionados',
  No = 'No',
  Parcial = 'Parcial',
  SiPorEnviar = 'Sí, por enviar',
  Total = 'Total',
}

export enum Orientacion {
  NorOriente = 'Nor-Oriente',
  NorPoniente = 'Nor-Poniente',
  NorPonienteSur = 'NorPoniente-Sur',
  Norte = 'Norte',
  Oriente = 'Oriente',
  Poniente = 'Poniente',
  Sur = 'Sur',
  SurOriente = 'Sur-Oriente',
  SurPoniente = 'Sur-Poniente',
}

export enum TipoAguaCaliente {
  Calefont = 'Calefont',
  CalefontYCaldera = 'Calefont y Caldera',
  CentralAgua = 'Central agua',
  Otro = 'Otro',
  PanelSolar = 'Panel solar',
  Termo = 'Termo',
  TermoYOtro = 'Termo y otro',
}

export enum TipoCalefaccion {
  AireCalienteAireAcondicionado = 'Aire caliente / Aire Acondicionado',
  BoscaALena = 'Bosca a leña',
  CalderaCentral = 'Caldera / Central',
  Central = 'Central',
  Chimenea = 'Chimenea',
  Electrica = 'Eléctrica',
  EstufaMurales = 'Estufa Murales',
  LosaRadiante = 'Losa radiante',
  Ninguna = 'Ninguna',
  Radiadores = 'Radiadores',
}

export enum TipoCocina {
  Americana = 'Americana',
  Central = 'Central',
  Encimera = 'Encimera',
  Tradicional = 'Tradicional',
}

export enum TipoConstruccion {
  Adobe = 'Adobe',
  AlbanileriaTradicional = 'Albañilería tradicional',
  AlbanileriaYTabiqueria = 'Albañilería y Tabiquería',
  Covintec = 'Covintec',
  FardosDePaja = 'Fardos de paja',
  Hormigon = 'Hormigón',
  HormigonCelular = 'Hormigón Celular',
  HormigonYTabiqueria = 'Hormigón y tabiquería',
  Losa = 'Losa',
  Madera = 'Madera',
  Metalcom = 'Metalcom',
  Otros = 'Otros',
  Piedras = 'Piedras',
  PreFabricada = 'Pre-Fabricada',
  Troncos = 'Troncos',
}

export enum TipoVentanas {
  Aluminio = 'Aluminio',
  Fierro = 'Fierro',
  Madera = 'Madera',
  Plastico = 'Plástico',
  Termopanel = 'Termopanel',
}

export enum Disposicion {
  Contrafrente = 'Contrafrente',
  Frente = 'Frente',
  Interno = 'Interno',
  Lateral = 'Lateral',
}

export enum TipoSeguridad {
  Porteria24h = 'Portería 24h',
  VigilanciaPrivada = 'Vigilancia privada',
  Camaras = 'Cámaras',
  Alarma = 'Alarma',
  SinSeguridad = 'Sin seguridad',
}

export enum AccesoTerreno {
  RampaFija = 'Rampa fija',
  RampaMovil = 'Rampa móvil',
  Ascensor = 'Ascensor',
  Horizontal = 'Horizontal'
}

export enum FormaTerreno {
  Regular = 'Regular',
  Irregular = 'Irregular',
  Esquinero = 'Esquinero',
  Interior = 'Interior'
}

export interface PropiedadVenta {
  id: string;
  propiedadId: string;
  divisa: Divisa;
  precioPrincipal: number;
  precioUF: number;
  precioPesos: number;
  comision: number;
}

export interface PropiedadArriendo {
  id: string;
  propiedadId: string;
  divisa: Divisa;
  precioPrincipal: number;
  precioUF: number;
  precioPesos: number;
  comision: number;
  gastosComunes: number;
  incluyeGastosComunes: boolean;
  disponibleDesde: Date;
  disponibleHasta: Date;
}

// Comprehensive Propiedad interface that supports both mock data and component expectations
export interface Propiedad {
  // Core properties from mock data
  id: string;
  titulo: string;
  tipo: string | TipoPropiedad;
  estado: string | EstadoPropiedad;
  operacion: string | string[]; // Ahora puede ser un string o un array de strings
  precio: number;
  divisa: string | Divisa;

  // Extended properties expected by components (optional for backward compatibility)
  propietario?: Propietario;
  propietarioId?: string;
  empresa?: Empresa;
  agente?: Agente;
  descripcion?: string;
  direccion?: string;
  nombreCalle?: string;
  numeroCalle?: string;
  unidad?: string;
  letra?: string;
  etapa?: string;
  areaTotal?: number;
  areaUsable?: number;
  habitaciones?: number;
  banos?: number;
  piso?: number;
  tipo_piso?: string | TipoPiso;
  tipo_departamento?: string | TipoDepartamento;
  recepcion_final?: string | RecepcionFinal;
  orientacion?: string | Orientacion;
  tipo_agua_caliente?: string | TipoAguaCaliente;
  tipo_calefaccion?: string | TipoCalefaccion;
  tipo_cocina?: string | TipoCocina;
  tipo_construccion?: string | TipoConstruccion;
  tipo_ventanas?: string | TipoVentanas;
  disposicion?: string | Disposicion;
  tipo_seguridad?: string | TipoSeguridad;
  amenidades?: Amenidades;
  comuna?: string;
  region?: string | Region;
  fechaConstruccion?: Date;
  anioConstruccion?: number;
  arriendo?: boolean;
  propiedadArriendo?: PropiedadArriendo;
  venta?: boolean;
  propiedadVenta?: PropiedadVenta;
  precio_venta?: number;
  precio_arriendo?: number;
  precioVenta?: number; // Deprecated - for backward compatibility
  suites?: number;
  plazasServicio?: number;
  m2Terreno?: number;
  areaConstruida?: number;
  m2Construidos?: number;
  m2Terraza?: number;
  numEstacionamientos?: number;
  estacionamientos?: number;
  numBodegas?: number;
  bodegas?: number;
  gastosComunes?: number;
  banco?: string | Banco;
  hipoteca?: string;
  deuda?: string;
  oportunidades?: Oportunidad[];
  visitas?: Visita[];
  imagenPrincipal?: string | null;
  // Coordenadas para georreferenciación
  lat?: number | null;
  lng?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
  // Additional fields for conditional forms
  precio_tasacion?: number;
  contribuciones?: number;
  rol?: string;
  direccion_referencial?: string;
  mostrar_mapa?: string;
  enviar_coordenadas?: string;
  acceso_terreno?: AccesoTerreno;
  forma_terreno?: FormaTerreno;
  agua?: boolean;
  gas_natural?: boolean;
  acceso_internet?: boolean;
  con_energia?: boolean;
  cisterna?: boolean;
  generador?: boolean;
  en_condominio?: boolean;
  jardin?: boolean;
  parrilla?: boolean;
  acepta_permuta?: boolean;
  // Additional fields for Parcela, Sitio, Terreno
  metros_frente?: number;
  metros_fondo?: number;
  superficie_util_cubierta?: number;
  superficie_semicubierta?: number;
  superficie_descubierta?: number;
  superficie_total?: number;
  superficie_construible?: number;
  num_estacionamientos_cubiertos?: number;
  antiguedad?: string;
  num_pisos?: number;
  tipo_gas?: string;
  servicios?: string[];
  ambientes?: string[];
  caracteristicas_ocultas?: string;
  recibos?: boolean;
  llaves_oficina?: boolean;
  tiene_letrero?: boolean;
  bodega?: boolean;
  pieza_servicio?: boolean;
  amoblado?: boolean;
  Regularizada?: boolean;
  solo_familias?: boolean;
  bano_visitas?: boolean;
  closets?: boolean;
  cocina?: boolean;
  homeoffice?: boolean;
  zona_juegos?: boolean;
  roof?: boolean;
  walk_in_closet?: boolean;
  business_center?: boolean;
  cancha_basquetbol?: boolean;
  conserjeria_24_7?: boolean;
  recepcion?: boolean;
  con_area?: boolean;
  requiere_aval?: boolean;
  con_tv?: boolean;
  fotos?: File[];
  planos?: File[];
  url_youtube?: string;
  url_visita_virtual?: string;
  superficie_util?: number;
  unidad_superficie_total?: string;
  que_mas_interesante?: string;
  disponible_desde?: string;
  superficie_total_valor?: number;
}

export interface PropiedadCreate {
  titulo: string;
  tipo: TipoPropiedad;
  estado: EstadoPropiedad;
  operacion: string | string[]; // Ahora puede ser un string o un array de strings
  precio: number;
  divisa: Divisa;
  // Optional extended fields
  propietarioId?: string;
  empresaId?: string;
  agenteId?: string;
  descripcion?: string;
  direccion?: string;
  areaTotal?: number;
  areaUsable?: number;
  habitaciones?: number;
  banos?: number;
  piso?: number;
  tipo_piso?: string | TipoPiso;
  tipo_departamento?: string | TipoDepartamento;
  recepcion_final?: string | RecepcionFinal;
  orientacion?: string | Orientacion;
  tipo_agua_caliente?: string | TipoAguaCaliente;
  tipo_calefaccion?: string | TipoCalefaccion;
  tipo_cocina?: string | TipoCocina;
  tipo_construccion?: string | TipoConstruccion;
  tipo_ventanas?: string | TipoVentanas;
  disposicion?: string | Disposicion;
  tipo_seguridad?: string | TipoSeguridad;
  amenidades?: Omit<Amenidades, 'id' | 'propiedadId'>;
  comuna?: string;
  region?: string | Region;
  fechaConstruccion?: Date;
  arriendo?: boolean;
  propiedadArriendo?: Omit<PropiedadArriendo, 'id' | 'propiedadId'>;
  venta?: boolean;
  propiedadVenta?: Omit<PropiedadVenta, 'id' | 'propiedadId'>;
  // Coordenadas para georreferenciación
  lat?: number | null;
  lng?: number | null;
}