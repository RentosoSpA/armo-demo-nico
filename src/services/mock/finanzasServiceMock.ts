import type { FinanzasData, FinanzasCompleteData, Comision, Gasto, KPI } from '../../types/finanzas';
import { simulateDelay } from './mockData';

const MOCK_COMISIONES: Comision[] = [
  {
    id: '1',
    propiedadId: 'prop-001',
    propiedadNombre: 'Depto Las Condes 2D+2B',
    monto: 850000,
    estado: 'Pagada',
    fechaEsperada: '2025-01-15',
    tipo: 'arriendo',
  },
  {
    id: '2',
    propiedadId: 'prop-002',
    propiedadNombre: 'Casa Providencia 3D+3B',
    monto: 1200000,
    estado: 'Pendiente',
    fechaEsperada: '2025-02-10',
    tipo: 'arriendo',
  },
  {
    id: '3',
    propiedadId: 'prop-003',
    propiedadNombre: 'Oficina Apoquindo',
    monto: 650000,
    estado: 'Atrasada',
    fechaEsperada: '2025-01-20',
    tipo: 'arriendo',
  },
  {
    id: '4',
    propiedadId: 'prop-004',
    propiedadNombre: 'Depto Vitacura 1D+1B',
    monto: 720000,
    estado: 'Pagada',
    fechaEsperada: '2025-01-12',
    tipo: 'arriendo',
  },
  {
    id: '5',
    propiedadId: 'prop-005',
    propiedadNombre: 'Casa Lo Barnechea 4D+4B',
    monto: 1500000,
    estado: 'Pendiente',
    fechaEsperada: '2025-02-15',
    tipo: 'venta',
  },
];

const MOCK_GASTOS: Gasto[] = [
  {
    id: 'g1',
    categoria: 'Fijo',
    nombre: 'Portal Inmobiliario',
    monto: 45000,
    estado: 'Pagado',
    fechaVencimiento: '2025-02-05',
    logo: 'https://via.placeholder.com/40x40?text=PI',
  },
  {
    id: 'g2',
    categoria: 'Fijo',
    nombre: 'Propit',
    monto: 35000,
    estado: 'Pendiente',
    fechaVencimiento: '2025-02-10',
    logo: 'https://via.placeholder.com/40x40?text=PR',
  },
  {
    id: 'g3',
    categoria: 'Variable',
    nombre: 'Notaría escritura',
    monto: 120000,
    estado: 'Atrasado',
    fechaVencimiento: '2025-01-28',
  },
  {
    id: 'g4',
    categoria: 'Fijo',
    nombre: 'Yapo',
    monto: 25000,
    estado: 'Pagado',
    fechaVencimiento: '2025-02-05',
    logo: 'https://via.placeholder.com/40x40?text=YP',
  },
  {
    id: 'g5',
    categoria: 'Variable',
    nombre: 'Marketing digital',
    monto: 80000,
    estado: 'Pendiente',
    fechaVencimiento: '2025-02-20',
  },
  {
    id: 'g6',
    categoria: 'Fijo',
    nombre: 'Oficina arriendo',
    monto: 450000,
    estado: 'Pagado',
    fechaVencimiento: '2025-02-01',
  },
];

const MOCK_KPIS: KPI[] = [
  {
    label: 'Crecimiento mensual',
    value: '+12%',
    trend: 'up',
    trendValue: '+$240k vs mes anterior',
    icon: '📈',
  },
  {
    label: '% Cobranza a tiempo',
    value: '85%',
    trend: 'up',
    trendValue: '+5% este mes',
    icon: '⏰',
  },
  {
    label: 'Promedio por propiedad',
    value: '$825k',
    trend: 'neutral',
    trendValue: 'Sin cambios',
    icon: '🏠',
  },
];

const MOCK_FINANZAS_DATA: FinanzasData = {
  porMes: [
    { mes: 'Ene', ingresos: 2450000, comisiones: 450000, gastos: 320000 },
    { mes: 'Feb', ingresos: 2800000, comisiones: 520000, gastos: 340000 },
    { mes: 'Mar', ingresos: 3200000, comisiones: 680000, gastos: 380000 },
    { mes: 'Abr', ingresos: 2950000, comisiones: 540000, gastos: 360000 },
    { mes: 'May', ingresos: 3400000, comisiones: 720000, gastos: 400000 },
    { mes: 'Jun', ingresos: 3150000, comisiones: 590000, gastos: 370000 },
    { mes: 'Jul', ingresos: 2900000, comisiones: 510000, gastos: 350000 },
    { mes: 'Ago', ingresos: 3300000, comisiones: 650000, gastos: 390000 },
    { mes: 'Sep', ingresos: 3500000, comisiones: 740000, gastos: 420000 },
    { mes: 'Oct', ingresos: 3250000, comisiones: 610000, gastos: 385000 },
    { mes: 'Nov', ingresos: 3600000, comisiones: 780000, gastos: 440000 },
    { mes: 'Dic', ingresos: 3800000, comisiones: 850000, gastos: 480000 },
  ],
  totalIngresos: 38300000,
  totalComisiones: 7640000,
  totalGastos: 4635000,
};

export const getFinanzasData = async (): Promise<FinanzasData> => {
  await simulateDelay();
  return MOCK_FINANZAS_DATA;
};

export const getFinanzasCompleteData = async (): Promise<FinanzasCompleteData> => {
  await simulateDelay();
  
  const totalComisionesMes = MOCK_COMISIONES
    .filter(c => c.estado === 'Pagada')
    .reduce((sum, c) => sum + c.monto, 0);
  
  const metaMensual = 3000000;
  const progreso = totalComisionesMes;
  
  return {
    ...MOCK_FINANZAS_DATA,
    meta: {
      objetivoMensual: metaMensual,
      progreso: progreso,
      porcentaje: Math.round((progreso / metaMensual) * 100),
      diasRestantes: 15,
    },
    comisiones: MOCK_COMISIONES,
    comisionesStats: {
      totalMes: totalComisionesMes,
      mejorPropiedad: {
        nombre: 'Casa Providencia 3D+3B',
        monto: 1200000,
      },
      promedioComision: 850000,
      masAltaPendiente: 1200000,
      porcentajeConComision: 75,
    },
    gastos: MOCK_GASTOS,
    kpis: MOCK_KPIS,
    configuracion: {
      metaMensual: 3000000,
      porcentajeComision: 50,
      categorias: ['Portales', 'Servicios', 'Notarías', 'Marketing'],
      recordatorios: true,
      conexionBancaria: false,
    },
    ultimaActualizacion: new Date().toISOString(),
  };
};
