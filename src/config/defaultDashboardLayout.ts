import type { DashboardLayout, Widget } from '../types/dashboard-layout';

export function getDefaultLayout(userId: string): DashboardLayout {
  const defaultWidgets: Widget[] = [
    // Primera fila: 4 FlipCards (small = 1 columna cada uno)
    {
      id: 'widget-flip-billing',
      type: 'flip-card-billing',
      title: 'Facturación y Comisiones',
      size: 'small',
      position: 0,
      visible: true
    },
    {
      id: 'widget-flip-visits',
      type: 'flip-card-visits',
      title: 'Visitas',
      size: 'small',
      position: 1,
      visible: true
    },
    {
      id: 'widget-flip-properties',
      type: 'flip-card-properties',
      title: 'Propiedades',
      size: 'small',
      position: 2,
      visible: true
    },
    {
      id: 'widget-flip-collections',
      type: 'flip-card-collections',
      title: 'Cobranzas',
      size: 'small',
      position: 3,
      visible: true
    },
    // Segunda fila: PropertyCharacteristics (2 col) + VisitCharacteristics (2 col)
    {
      id: 'widget-property-chars',
      type: 'property-characteristics',
      title: 'Características de Propiedades',
      size: 'medium',
      position: 4,
      visible: true
    },
    {
      id: 'widget-visit-chars',
      type: 'visit-characteristics',
      title: 'Características de Visitas',
      size: 'medium',
      position: 5,
      visible: true
    },
    // Tercera fila: MetricsByMonth (full width)
    {
      id: 'widget-metrics-month',
      type: 'metrics-by-month',
      title: 'Métricas por Mes',
      size: 'full',
      position: 6,
      visible: true
    },
    // Cuarta fila: OpportunitiesByStage (2 col) + OsosBrigada (2 col)
    {
      id: 'widget-opportunities',
      type: 'opportunities-by-stage',
      title: 'Oportunidades por Etapa',
      size: 'medium',
      position: 7,
      visible: true
    },
    {
      id: 'widget-osos',
      type: 'osos-brigada',
      title: 'Brigada de Osos',
      size: 'full',
      position: 8,
      visible: true
    },
    // Quinta fila: LiveActivity (full width)
    {
      id: 'widget-live-activity',
      type: 'live-activity',
      title: 'Actividad en Vivo',
      size: 'full',
      position: 9,
      visible: true
    }
  ];

  return {
    userId,
    widgets: defaultWidgets,
    gridColumns: 4,
    compactMode: false,
    lastUpdated: new Date().toISOString()
  };
}

export const PRESET_LAYOUTS = {
  ejecutivo: [
    { type: 'flip-card-billing', title: 'Facturación', size: 'small', visible: true },
    { type: 'kpi-conversion-rate', title: 'Tasa de Conversión', size: 'small', visible: true },
    { type: 'kpi-monthly-visits', title: 'Visitas del Mes', size: 'small', visible: true },
    { type: 'kpi-active-agents', title: 'Agentes Activos', size: 'small', visible: true },
    { type: 'metrics-by-month', title: 'Métricas Mensuales', size: 'large', visible: true },
    { type: 'opportunities-by-stage', title: 'Oportunidades', size: 'large', visible: true },
    { type: 'executive-summary', title: 'Resumen Ejecutivo', size: 'medium', visible: true }
  ],
  operaciones: [
    { type: 'flip-card-visits', title: 'Visitas', size: 'small', visible: true },
    { type: 'flip-card-properties', title: 'Propiedades', size: 'small', visible: true },
    { type: 'kpi-total-properties', title: 'Total Propiedades', size: 'small', visible: true },
    { type: 'kpi-monthly-visits', title: 'Visitas del Mes', size: 'small', visible: true },
    { type: 'property-characteristics', title: 'Propiedades', size: 'large', visible: true },
    { type: 'visit-characteristics', title: 'Visitas', size: 'large', visible: true },
    { type: 'live-activity', title: 'Actividad en Vivo', size: 'full', visible: true },
    { type: 'osos-brigada', title: 'Brigada de Osos', size: 'full', visible: true }
  ],
  ventas: [
    { type: 'opportunities-by-stage', title: 'Oportunidades', size: 'large', visible: true },
    { type: 'kpi-conversion-rate', title: 'Conversión', size: 'small', visible: true },
    { type: 'flip-card-properties', title: 'Propiedades', size: 'small', visible: true },
    { type: 'flip-card-billing', title: 'Facturación', size: 'small', visible: true },
    { type: 'mini-chart-visits-trend', title: 'Tendencia Visitas', size: 'medium', visible: true },
    { type: 'mini-chart-opportunities-progress', title: 'Progreso Oportunidades', size: 'medium', visible: true },
    { type: 'live-activity', title: 'Actividad', size: 'large', visible: true }
  ],
  completo: [
    { type: 'flip-card-billing', title: 'Facturación', size: 'small', visible: true },
    { type: 'flip-card-visits', title: 'Visitas', size: 'small', visible: true },
    { type: 'flip-card-properties', title: 'Propiedades', size: 'small', visible: true },
    { type: 'flip-card-collections', title: 'Cobranzas', size: 'small', visible: true },
    { type: 'kpi-total-properties', title: 'Total Propiedades', size: 'small', visible: true },
    { type: 'kpi-active-agents', title: 'Agentes', size: 'small', visible: true },
    { type: 'kpi-conversion-rate', title: 'Conversión', size: 'small', visible: true },
    { type: 'kpi-monthly-visits', title: 'Visitas Mes', size: 'small', visible: true },
    { type: 'property-characteristics', title: 'Propiedades', size: 'large', visible: true },
    { type: 'visit-characteristics', title: 'Visitas', size: 'large', visible: true },
    { type: 'metrics-by-month', title: 'Métricas', size: 'full', visible: true },
    { type: 'opportunities-by-stage', title: 'Oportunidades', size: 'large', visible: true },
    { type: 'osos-brigada', title: 'Osos', size: 'full', visible: true },
    { type: 'live-activity', title: 'Actividad', size: 'full', visible: true }
  ]
} as const;
