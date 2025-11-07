/**
 * Servicio adaptador para finanzas
 * Retorna datos financieros de coworking cuando preset es 'coworking'
 * Delega al servicio inmobiliario cuando preset es 'inmobiliaria'
 */

import { usePresetStore } from '../../store/presetStore';
import { getFinanzasCompleteData as getFinanzasInmobiliaria } from '../mock/finanzasServiceMock';
import { DASHBOARD_COWORK_MOCK } from '../../presets/coworking/mocks/dashboardCoworkMock';
import type { FinanzasCompleteData } from '../../types/finanzas';

/**
 * Genera datos financieros para coworking
 */
const getFinanzasCoworking = (): FinanzasCompleteData => {
  const mrr = DASHBOARD_COWORK_MOCK.kpis.mrr;
  const ingresosAdicionales = DASHBOARD_COWORK_MOCK.kpis.ingresos_adicionales;
  
  return {
    porMes: DASHBOARD_COWORK_MOCK.ingresos_mensuales.map(item => ({
      mes: item.mes,
      ingresos: item.ingresos,
      comisiones: 0,
      gastos: Math.floor(item.ingresos * 0.35), // 35% de gastos operacionales
    })),
    totalIngresos: mrr + ingresosAdicionales,
    totalComisiones: 0,
    totalGastos: Math.floor((mrr + ingresosAdicionales) * 0.35),
    
    meta: {
      objetivoMensual: 6000000,
      progreso: mrr + ingresosAdicionales,
      porcentaje: Math.round(((mrr + ingresosAdicionales) / 6000000) * 100),
      diasRestantes: 15,
    },
    
    comisiones: [], // No aplica para coworking
    comisionesStats: {
      totalMes: 0,
      mejorPropiedad: {
        nombre: 'Oficina Privada 201',
        monto: 0,
      },
      promedioComision: 0,
      masAltaPendiente: 0,
      porcentajeConComision: 0,
    },
    
    gastos: [
      {
        id: 'gasto-001',
        categoria: 'Fijo',
        nombre: 'Arriendo del local',
        monto: 2800000,
        estado: 'Pagado',
        fechaVencimiento: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'gasto-002',
        categoria: 'Fijo',
        nombre: 'Servicios básicos',
        monto: 450000,
        estado: 'Pagado',
        fechaVencimiento: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'gasto-003',
        categoria: 'Variable',
        nombre: 'Café y suministros',
        monto: 280000,
        estado: 'Pendiente',
        fechaVencimiento: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'gasto-004',
        categoria: 'Variable',
        nombre: 'Limpieza y mantención',
        monto: 350000,
        estado: 'Pagado',
        fechaVencimiento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    
    kpis: [
      {
        label: 'MRR',
        value: `$${(mrr / 1000000).toFixed(1)}M`,
        trend: 'up',
        trendValue: '+5.2%',
        icon: '💰',
      },
      {
        label: 'Ocupación',
        value: `${DASHBOARD_COWORK_MOCK.kpis.tasa_ocupacion}%`,
        trend: 'up',
        trendValue: '+3%',
        icon: '📊',
      },
      {
        label: 'Miembros',
        value: DASHBOARD_COWORK_MOCK.kpis.miembros_activos,
        trend: 'up',
        trendValue: '+1',
        icon: '👥',
      },
      {
        label: 'Eventos',
        value: 8,
        trend: 'neutral',
        trendValue: '0',
        icon: '🎤',
      },
    ],
    
    configuracion: {
      metaMensual: 6000000,
      porcentajeComision: 0,
      categorias: ['Fijo', 'Variable', 'Servicios', 'Marketing'],
      recordatorios: true,
      conexionBancaria: false,
    },
    
    ultimaActualizacion: new Date().toISOString(),
  };
};

/**
 * Obtiene datos financieros según el preset activo
 */
export const getFinanzasCompleteData = async (): Promise<FinanzasCompleteData> => {
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    return getFinanzasCoworking();
  }
  
  // Modo inmobiliaria: usar servicio real
  return getFinanzasInmobiliaria();
};
