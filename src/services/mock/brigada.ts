export type OsoStatus = 'Activo' | 'Programado' | 'Procesando' | 'Error' | 'Completado';

export interface Oso {
  id: string;
  nombre: string;
  colorToken: string;
  status: OsoStatus;
  lastUpdate: string;
  alcance: string;
  descripcion: string;
}

export interface BearProfile {
  id: string;
  emoji: string;
  role: string;
  actionChips: string[];
}

export const bearProfiles: Record<string, BearProfile> = {
  curioso: {
    id: 'curioso',
    emoji: '🐻‍❄️',
    role: 'Especialista en captación y primera impresión. Envía mensajes de bienvenida y detecta interés.',
    actionChips: ['WhatsApp', 'Test']
  },
  cauteloso: {
    id: 'cauteloso',
    emoji: '🧸',
    role: 'Evalúa prospectos, verifica documentos y calcula capacidad de pago.',
    actionChips: ['WhatsApp', 'Test']
  },
  notarioso: {
    id: 'notarioso',
    emoji: '🐻',
    role: 'Genera contratos, órdenes de visita y coordina firmas.',
    actionChips: ['Preview', 'Test']
  },
  cuidadoso: {
    id: 'cuidadoso',
    emoji: '🐨',
    role: 'Programa y envía recordatorios de cobro a inquilinos.',
    actionChips: ['WhatsApp', 'Test']
  },
  armonioso: {
    id: 'armonioso',
    emoji: '🐼',
    role: 'Gestiona reportes y comunicación periódica con tus clientes.',
    actionChips: ['Test', 'Enviar']
  }
};

export const osos: Oso[] = [
  { 
    id: 'curioso', 
    nombre: 'Oso Curioso', 
    colorToken: 'bear-curioso', 
    status: 'Activo', 
    lastUpdate: 'Hace 2 minutos', 
    alcance: 'Global', 
    descripcion: 'Detectó 2 nuevos prospectos y preparó primer mensaje.' 
  },
  { 
    id: 'cauteloso', 
    nombre: 'Oso Cauteloso', 
    colorToken: 'bear-cauteloso', 
    status: 'Programado', 
    lastUpdate: 'Hace 15 minutos', 
    alcance: 'San Miguel 7890', 
    descripcion: 'Checklist de documentos configurado para 3 propiedades.' 
  },
  { 
    id: 'notarioso', 
    nombre: 'Oso Notarioso', 
    colorToken: 'bear-notarioso', 
    status: 'Procesando', 
    lastUpdate: 'Hace 30 minutos', 
    alcance: 'Providencia 5678', 
    descripcion: 'Generando contrato y orden de visita.' 
  },
  { 
    id: 'cuidadoso', 
    nombre: 'Oso Cuidadoso', 
    colorToken: 'bear-cuidadoso', 
    status: 'Activo', 
    lastUpdate: 'Hace 2 horas', 
    alcance: 'Global', 
    descripcion: 'Recordatorios de pago programados para 5 inquilinos.' 
  },
  { 
    id: 'armonioso', 
    nombre: 'Armonioso (Reportes)', 
    colorToken: 'primary', 
    status: 'Activo', 
    lastUpdate: 'Hoy', 
    alcance: 'Global', 
    descripcion: 'Configuración de reportes y destinatarios.' 
  },
];

export const propiedadesMock = [
  { id: 'p1', nombre: 'Departamento moderno en Providencia' },
  { id: 'p2', nombre: 'Casa familiar en Ñuñoa' },
  { id: 'p3', nombre: 'Oficina en Las Condes' },
];

export const templatesContrato = ['Contrato Renta v1', 'Contrato Venta v2', 'Orden de Visita v1'];

export const tonoOptions = ['Profesional', 'Cercano', 'Entusiasta'];
export const operacionOptions = ['Renta', 'Venta'];
export const tipoProspectoOptions = ['Natural', 'Empresa'];
export const documentosOptions = [
  'Cédula',
  'Ingresos',
  'Aval',
  'Historial crediticio',
  'Referencia comercial',
  'Comprobante de domicilio',
  'Contrato de trabajo indefinido',
  '6 últimas liquidaciones de sueldo',
  'Certificado de 12 últimas cotizaciones',
  'Informe anual de boletas de honorarios',
  '6 últimos F29 y 2 últimos F22',
  'Informe Dicom Platinum o CMF',
  'Mes de arriendo + mes de garantía + 50% de comisión (a la firma del contrato)',
  'Arriendo mínimo 12 meses'
];

export const frecuenciaOptions = ['mensual', 'bimestral', 'trimestral', 'semestral', 'nunca'];

export const tiposPropiedadOptions = [
  'Casa',
  'Departamento', 
  'Parcela',
  'Local comercial',
  'Oficina',
  'Bodega',
  'Terreno'
];

export const documentosRequeridosPorTipo: Record<string, string[]> = {
  'Casa': ['Cédula', 'Ingresos', 'Aval', 'Historial crediticio'],
  'Departamento': ['Cédula', 'Ingresos', 'Aval', 'Historial crediticio'],
  'Parcela': ['Cédula', 'Ingresos', 'Aval', 'Historial crediticio', 'Referencia comercial'],
  'Local comercial': ['Cédula', 'Ingresos', 'Referencia comercial', 'Historial crediticio'],
  'Oficina': ['Cédula', 'Ingresos', 'Referencia comercial', 'Historial crediticio'],
  'Bodega': ['Cédula', 'Ingresos', 'Referencia comercial'],
  'Terreno': ['Cédula', 'Ingresos', 'Aval', 'Historial crediticio', 'Referencia comercial']
};

export const mockMetrics = {
  ososActivos: 4,
  tareasHoy: 12,
  alertas: 3,
  cobranzasProgramadas: 8
};