import { TipoPropiedad, TipoOperacion } from '../../types/propiedad';

/**
 * Configuración centralizada para el formulario de propiedades
 */

// Títulos de los steps
export const STEP_TITLES: Record<string, string> = {
  'tipo-operacion': 'Tipo y Operación',
  'precio': 'Precio',
  'caracteristicas': 'Características',
  'ubicacion': 'Ubicación',
  'multimedia': 'Multimedia',
  'amenities': 'Amenities',
  'amenities_servicios_y_entorno': 'Servicios y Entorno',
  'descripcion': 'Descripción',
  'medios': 'Medios',
  'adicionales': 'Información Adicional'
};

// Configuración de amenidades por categoría
export const AMENITIES_CONFIG = {
  basicas: [
    { name: 'piscina', label: 'Piscina' },
    { name: 'gimnasio', label: 'Gimnasio' },
    { name: 'sauna', label: 'Sauna' },
    { name: 'jacuzzi', label: 'Jacuzzi' },
  ],
  ambientes: [
    { name: 'balcon', label: 'Balcón' },
    { name: 'terraza', label: 'Terraza' },
    { name: 'jardin', label: 'Jardín' },
    { name: 'patio', label: 'Patio' },
    { name: 'roof', label: 'Roof' },
    { name: 'desayunador', label: 'Desayunador' },
    { name: 'homeoffice', label: 'Homeoffice' },
    { name: 'lavadero', label: 'Lavadero' },
    { name: 'parrilla', label: 'Parrilla' },
    { name: 'zona_juegos', label: 'Zona de juegos' },
    { name: 'walk_in_closet', label: 'Walk-in closet' },
  ],
  servicios: [
    { name: 'acceso_internet', label: 'Acceso a internet' },
    { name: 'tv_cable', label: 'TV por cable' },
    { name: 'aire_acondicionado', label: 'Aire acondicionado' },
    { name: 'refrigerador', label: 'Refrigerador' },
    { name: 'lavanderia', label: 'Lavandería' },
  ],
  comodidades: [
    { name: 'area_cine', label: 'Área de cine' },
    { name: 'area_juegos', label: 'Área de juegos' },
    { name: 'business_center', label: 'Business center' },
    { name: 'cancha_basquetbol', label: 'Cancha de básquetbol' },
    { name: 'cancha_futbol', label: 'Cancha de fútbol' },
    { name: 'cancha_paddle', label: 'Cancha de paddle' },
    { name: 'chimenea', label: 'Chimenea' },
    { name: 'conserjeria_24_7', label: 'Conserjería 24/7' },
    { name: 'estacionamiento_visitas', label: 'Estacionamiento visitas' },
    { name: 'recepcion', label: 'Recepción' },
    { name: 'salon_fiestas', label: 'Salón de fiestas' },
    { name: 'salon_usos_multiples', label: 'Salón de usos múltiples' },
    { name: 'cancha_usos_multiples', label: 'Cancha de usos múltiples' },
  ],
  otros: [
    { name: 'con_area', label: 'Con área' },
    { name: 'con_condominio', label: 'Con condominio' },
    { name: 'con_energia', label: 'Con energía' },
    { name: 'conexion_lavarropas', label: 'Conexión para lavarropas' },
    { name: 'requiere_aval', label: 'Requiere aval' },
    { name: 'con_tv', label: 'Con TV' },
    { name: 'permite_mascotas', label: 'Permite mascotas' },
  ]
};

// Configuración de steps por tipo de propiedad y operación
export const STEPS_BY_MODE: Record<string, string[]> = {
  'default': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'multimedia', 'amenities', 'descripcion'],
  'casa-renta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'amenities', 'multimedia', 'descripcion'],
  'casa-venta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'amenities', 'multimedia', 'descripcion'],
  'casa-renta-temporal': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'amenities', 'multimedia', 'descripcion'],
  'departamento-renta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'amenities', 'multimedia', 'descripcion'],
  'departamento-venta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'amenities', 'multimedia', 'descripcion'],
  'departamento-renta-temporal': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'amenities', 'multimedia', 'descripcion'],
  'parcela-renta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'amenities', 'multimedia', 'descripcion'],
  'parcela-venta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'amenities', 'multimedia', 'descripcion'],
  'terreno-venta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'multimedia', 'descripcion'],
  'oficina-renta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'amenities', 'multimedia', 'descripcion'],
  'oficina-venta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'amenities', 'multimedia', 'descripcion'],
  'local-comercial-renta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'amenities', 'multimedia', 'descripcion'],
  'local-comercial-venta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'amenities', 'multimedia', 'descripcion'],
  'bodega-renta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'amenities', 'multimedia', 'descripcion'],
  'bodega-venta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'amenities', 'multimedia', 'descripcion'],
  'estacionamiento-renta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'multimedia', 'descripcion'],
  'estacionamiento-venta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'multimedia', 'descripcion'],
  'agricola-renta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'amenities_servicios_y_entorno', 'multimedia', 'descripcion'],
  'agricola-venta': ['tipo-operacion', 'precio', 'ubicacion', 'caracteristicas', 'amenities_servicios_y_entorno', 'multimedia', 'descripcion'],
};

/**
 * Obtiene el modo del formulario basado en tipo y operación
 */
export function getFormMode(tipo: TipoPropiedad, operacion: TipoOperacion[]): string {
  if (!tipo || !operacion || operacion.length === 0) {
    return 'default';
  }

  const tipoKey = tipo.toLowerCase().replace(/\s+/g, '-');
  
  // Determinar operación principal
  let operacionKey = 'venta';
  if (operacion.includes(TipoOperacion.Renta)) {
    operacionKey = 'renta';
  } else if (operacion.includes(TipoOperacion.RentaTemporal)) {
    operacionKey = 'renta-temporal';
  }

  const mode = `${tipoKey}-${operacionKey}`;
  
  // Si existe configuración específica, usarla. Si no, usar default
  return STEPS_BY_MODE[mode] ? mode : 'default';
}

/**
 * Obtiene los steps configurados para un modo específico
 */
export function getStepsForMode(mode: string): string[] {
  return STEPS_BY_MODE[mode] || STEPS_BY_MODE['default'];
}
