/**
 * Servicio adaptador para dashboard
 * Retorna datos coworking cuando preset es 'coworking'
 * Delega al servicio inmobiliario cuando preset es 'inmobiliaria'
 */

import { usePresetStore } from '../../store/presetStore';
import { getNewDashboardData } from '../mock/saludDataMock';
import { DASHBOARD_COWORK_MOCK } from '../../presets/coworking/mocks/dashboardCoworkMock';
import type { NewDashboardData, DashboardResponse } from '../../types/salud-data';

/**
 * Transforma los datos de cowork al formato NewDashboardData
 */
const transformCoworkToDashboard = (): NewDashboardData => {
  return {
    propiedades: {
      total: DASHBOARD_COWORK_MOCK.kpis.total_espacios,
      porTipo: {
        Casa: 0,
        Departamento: 0,
        Parcela: 0,
        LocalComercial: 0,
        Oficina: DASHBOARD_COWORK_MOCK.ocupacion_por_tipo.find(t => t.tipo === 'Oficinas Privadas')?.total || 5,
        Bodega: 0,
        Terreno: 0,
      },
      porEstado: {
        Disponible: DASHBOARD_COWORK_MOCK.kpis.espacios_disponibles,
        Reservada: 0,
        Arrendada: 0,
        Vendida: DASHBOARD_COWORK_MOCK.kpis.espacios_ocupados,
      },
      porOperacion: {
        arriendo: DASHBOARD_COWORK_MOCK.kpis.total_espacios,
        venta: 0,
        ambas: 0,
      },
    },
    visitas: {
      total: DASHBOARD_COWORK_MOCK.kpis.tours_mes,
      porEstado: {
        Agendada: DASHBOARD_COWORK_MOCK.kpis.tours_semana,
        Aprobada: Math.floor(DASHBOARD_COWORK_MOCK.kpis.tours_mes * 0.4),
        Completada: Math.floor(DASHBOARD_COWORK_MOCK.kpis.tours_mes * 0.5),
        Cancelada: Math.floor(DASHBOARD_COWORK_MOCK.kpis.tours_mes * 0.1),
      },
      porMes: DASHBOARD_COWORK_MOCK.nuevos_miembros_mes.map(item => ({
        mes: item.mes,
        cantidad: item.nuevos * 2, // Aproximar tours basado en nuevos miembros
      })),
      proximasVisitas: DASHBOARD_COWORK_MOCK.kpis.tours_semana,
    },
    oportunidades: {
      total: DASHBOARD_COWORK_MOCK.tours_vs_conversiones[0].cantidad,
      porEtapa: {
        Exploracion: DASHBOARD_COWORK_MOCK.tours_vs_conversiones[0].cantidad,
        Visita: DASHBOARD_COWORK_MOCK.tours_vs_conversiones[2].cantidad,
        Negociacion: DASHBOARD_COWORK_MOCK.tours_vs_conversiones[3].cantidad,
        Cierre: DASHBOARD_COWORK_MOCK.tours_vs_conversiones[4].cantidad,
      },
      conversionRate: (DASHBOARD_COWORK_MOCK.tours_vs_conversiones[4].cantidad / DASHBOARD_COWORK_MOCK.tours_vs_conversiones[0].cantidad) * 100,
    },
    agentes: {
      total: 4,
      activos: 4,
    },
    empresas: {
      total: 1,
    },
    facturacionTotal: DASHBOARD_COWORK_MOCK.kpis.mrr,
  };
};

/**
 * Obtiene los datos del dashboard según el preset activo
 */
export const getDashboardData = async (empresaId: string): Promise<DashboardResponse> => {
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      statusCode: 200,
      message: 'Dashboard data retrieved successfully',
      data: transformCoworkToDashboard(),
    };
  }
  
  // Modo inmobiliaria: usar servicio real
  return getNewDashboardData(empresaId);
};
