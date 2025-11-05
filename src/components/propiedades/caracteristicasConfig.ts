import { TipoPropiedad } from '../../types/propiedad';

export interface FieldConfig {
  name: string;
  label: string;
  type: 'input' | 'inputNumber' | 'select' | 'checkbox' | 'textarea';
  required?: boolean;
  placeholder?: string;
  addonAfter?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }>;
  rules?: any[];
  span?: number;
  showOnlyFor?: {
    operacion?: ('Venta' | 'Renta' | 'Renta temporal')[];
  };
}

/**
 * IMPORTANTE: Los nombres de campos DEBEN coincidir exactamente con:
 * 1. El schema de Supabase (tabla propiedad)
 * 2. El tipo TypeScript Propiedad (src/types/propiedad.ts)
 * 3. Los campos esperados en FormPropiedad.handleNextStep()
 */

/**
 * Campos comunes para Casa (Renta y Venta)
 */
const CASA_FIELDS: FieldConfig[] = [
  {
    name: 'habitaciones',
    label: 'Dormitorios',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'banos',
    label: 'Baños',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'area_total',
    label: 'Superficie total',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'superficie_util',
    label: 'Superficie útil',
    type: 'inputNumber',
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'num_estacionamientos',
    label: 'Estacionamientos',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'num_bodegas',
    label: 'Bodegas',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'anio_construccion',
    label: 'Año de construcción',
    type: 'inputNumber',
    placeholder: '2020',
    min: 1900,
    max: new Date().getFullYear(),
    step: 1,
    span: 12,
  },
  {
    name: 'gastos_comunes',
    label: 'Gastos comunes',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    span: 12,
    showOnlyFor: {
      operacion: ['Renta', 'Renta temporal']
    }
  },
  {
    name: 'permite_mascotas',
    label: 'Permite mascotas',
    type: 'checkbox',
    span: 12,
  },
];

/**
 * Campos comunes para Departamento (Renta y Venta)
 */
const DEPARTAMENTO_FIELDS: FieldConfig[] = [
  {
    name: 'habitaciones',
    label: 'Dormitorios',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'banos',
    label: 'Baños',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'area_total',
    label: 'Superficie total',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'superficie_util',
    label: 'Superficie útil',
    type: 'inputNumber',
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'piso',
    label: 'Piso',
    type: 'inputNumber',
    placeholder: '1',
    min: -5,
    step: 1,
    span: 12,
  },
  {
    name: 'num_estacionamientos',
    label: 'Estacionamientos',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'num_bodegas',
    label: 'Bodegas',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'anio_construccion',
    label: 'Año de construcción',
    type: 'inputNumber',
    placeholder: '2020',
    min: 1900,
    max: new Date().getFullYear(),
    step: 1,
    span: 12,
  },
  {
    name: 'gastos_comunes',
    label: 'Gastos comunes',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    span: 12,
    showOnlyFor: {
      operacion: ['Renta', 'Renta temporal']
    }
  },
  {
    name: 'permite_mascotas',
    label: 'Permite mascotas',
    type: 'checkbox',
    span: 12,
  },
];

/**
 * Campos comunes para bodegas (Renta y Venta)
 */
const BODEGA_FIELDS: FieldConfig[] = [
  {
    name: 'area_total',
    label: 'Superficie total',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'superficie_util',
    label: 'Superficie útil',
    type: 'inputNumber',
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'banos',
    label: 'Baños',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'num_estacionamientos',
    label: 'Estacionamientos',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'anio_construccion',
    label: 'Año de construcción',
    type: 'inputNumber',
    placeholder: '2020',
    min: 1900,
    max: new Date().getFullYear(),
    step: 1,
    span: 12,
  },
];

/**
 * Campos comunes para Agrícola (compartidos entre Renta y Venta)
 */
const AGRICOLA_FIELDS: FieldConfig[] = [
  {
    name: 'area_total',
    label: 'Superficie total',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'superficie_util',
    label: 'Superficie cultivable',
    type: 'inputNumber',
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'habitaciones',
    label: 'Construcciones habitables',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'banos',
    label: 'Baños',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
];

/**
 * Campos para Estacionamiento
 */
const ESTACIONAMIENTO_FIELDS: FieldConfig[] = [
  {
    name: 'area_total',
    label: 'Superficie',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'piso',
    label: 'Piso',
    type: 'inputNumber',
    placeholder: '0',
    min: -5,
    step: 1,
    span: 12,
  },
];

/**
 * Campos para Terreno
 */
const TERRENO_FIELDS: FieldConfig[] = [
  {
    name: 'area_total',
    label: 'Superficie total',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'superficie_util',
    label: 'Superficie construible',
    type: 'inputNumber',
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
];

/**
 * Campos para Parcela
 */
const PARCELA_FIELDS: FieldConfig[] = [
  {
    name: 'area_total',
    label: 'Superficie total',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'superficie_util',
    label: 'Superficie construible',
    type: 'inputNumber',
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'habitaciones',
    label: 'Dormitorios',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'banos',
    label: 'Baños',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'num_estacionamientos',
    label: 'Estacionamientos',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
];

/**
 * Campos para Sitio
 */
const SITIO_FIELDS: FieldConfig[] = [
  {
    name: 'area_total',
    label: 'Superficie total',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'superficie_util',
    label: 'Superficie construible',
    type: 'inputNumber',
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
];

/**
 * Campos para Oficina
 */
const OFICINA_FIELDS: FieldConfig[] = [
  {
    name: 'area_total',
    label: 'Superficie total',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'superficie_util',
    label: 'Superficie útil',
    type: 'inputNumber',
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'banos',
    label: 'Baños',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'piso',
    label: 'Piso',
    type: 'inputNumber',
    placeholder: '1',
    min: -5,
    step: 1,
    span: 12,
  },
  {
    name: 'num_estacionamientos',
    label: 'Estacionamientos',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'gastos_comunes',
    label: 'Gastos comunes',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    span: 12,
    showOnlyFor: {
      operacion: ['Renta', 'Renta temporal']
    }
  },
];

/**
 * Campos para Local Comercial
 */
const LOCAL_COMERCIAL_FIELDS: FieldConfig[] = [
  {
    name: 'area_total',
    label: 'Superficie total',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'superficie_util',
    label: 'Superficie útil',
    type: 'inputNumber',
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'banos',
    label: 'Baños',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'piso',
    label: 'Piso',
    type: 'inputNumber',
    placeholder: '1',
    min: -5,
    step: 1,
    span: 12,
  },
  {
    name: 'num_estacionamientos',
    label: 'Estacionamientos',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'gastos_comunes',
    label: 'Gastos comunes',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    span: 12,
    showOnlyFor: {
      operacion: ['Renta', 'Renta temporal']
    }
  },
];

/**
 * Campos para Industrial
 */
const INDUSTRIAL_FIELDS: FieldConfig[] = [
  {
    name: 'area_total',
    label: 'Superficie total',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'superficie_util',
    label: 'Superficie útil',
    type: 'inputNumber',
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'banos',
    label: 'Baños',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'num_estacionamientos',
    label: 'Estacionamientos',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'anio_construccion',
    label: 'Año de construcción',
    type: 'inputNumber',
    placeholder: '2020',
    min: 1900,
    max: new Date().getFullYear(),
    step: 1,
    span: 12,
  },
];

/**
 * Campos para Hotel
 */
const HOTEL_FIELDS: FieldConfig[] = [
  {
    name: 'habitaciones',
    label: 'Número de habitaciones',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'area_total',
    label: 'Superficie total',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'superficie_util',
    label: 'Superficie útil',
    type: 'inputNumber',
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'banos',
    label: 'Baños totales',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'num_estacionamientos',
    label: 'Estacionamientos',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'anio_construccion',
    label: 'Año de construcción',
    type: 'inputNumber',
    placeholder: '2020',
    min: 1900,
    max: new Date().getFullYear(),
    step: 1,
    span: 12,
  },
];

/**
 * Campos para Llave de Negocio
 */
const LLAVE_NEGOCIO_FIELDS: FieldConfig[] = [
  {
    name: 'area_total',
    label: 'Superficie del negocio',
    type: 'inputNumber',
    required: true,
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'superficie_util',
    label: 'Superficie útil',
    type: 'inputNumber',
    placeholder: '0',
    addonAfter: 'm²',
    min: 0,
    span: 12,
  },
  {
    name: 'banos',
    label: 'Baños',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'num_estacionamientos',
    label: 'Estacionamientos',
    type: 'inputNumber',
    placeholder: '0',
    min: 0,
    step: 1,
    span: 12,
  },
  {
    name: 'anio_construccion',
    label: 'Año de inicio del negocio',
    type: 'inputNumber',
    placeholder: '2020',
    min: 1900,
    max: new Date().getFullYear(),
    step: 1,
    span: 12,
  },
];

/**
 * Mapa de configuraciones por tipo de propiedad
 */
const CARACTERISTICAS_MAP: Record<string, FieldConfig[]> = {
  [TipoPropiedad.Casa]: CASA_FIELDS,
  [TipoPropiedad.Departamento]: DEPARTAMENTO_FIELDS,
  [TipoPropiedad.Bodega]: BODEGA_FIELDS,
  [TipoPropiedad.Agricola]: AGRICOLA_FIELDS,
  [TipoPropiedad.Estacionamiento]: ESTACIONAMIENTO_FIELDS,
  [TipoPropiedad.Terreno]: TERRENO_FIELDS,
  [TipoPropiedad.Parcela]: PARCELA_FIELDS,
  [TipoPropiedad.Sitio]: SITIO_FIELDS,
  [TipoPropiedad.Oficina]: OFICINA_FIELDS,
  [TipoPropiedad.LocalComercial]: LOCAL_COMERCIAL_FIELDS,
  [TipoPropiedad.Industrial]: INDUSTRIAL_FIELDS,
  [TipoPropiedad.Hotel]: HOTEL_FIELDS,
  [TipoPropiedad.LlaveDeNegocio]: LLAVE_NEGOCIO_FIELDS,
};

/**
 * Obtiene los campos de características según el tipo de propiedad
 */
export function getCaracteristicasForType(tipo: TipoPropiedad | string): FieldConfig[] {
  console.log('🔍 getCaracteristicasForType called');
  console.log('  📥 Input tipo:', tipo, 'type:', typeof tipo);
  console.log('  📦 Available keys:', Object.keys(CARACTERISTICAS_MAP));
  console.log('  🔎 Exact match check:');
  
  Object.keys(CARACTERISTICAS_MAP).forEach(key => {
    const isMatch = key === tipo;
    console.log(`    ${isMatch ? '✅' : '❌'} "${key}" === "${tipo}" ? ${isMatch}`);
  });
  
  const fields = CARACTERISTICAS_MAP[tipo] || [];
  console.log('  ✅ Returned fields count:', fields.length);
  
  if (fields.length === 0 && tipo) {
    console.warn('⚠️ WARNING: No fields found for tipo:', tipo);
    console.warn('⚠️ This might be due to:');
    console.warn('   1. Type mismatch (string vs enum)');
    console.warn('   2. Incorrect TipoPropiedad value');
    console.warn('   3. Missing configuration in CARACTERISTICAS_MAP');
  }
  
  return fields;
}
