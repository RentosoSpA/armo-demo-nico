import { MOCK_DATA, simulateDelay } from './mockData';
import type { DashboardResponse, NewDashboardData } from '../../types/salud-data';

// Mock implementation of salud-data service
export const getNewDashboardData = async (_empresaId?: string): Promise<DashboardResponse> => {
  await simulateDelay();

  // Count properties by type
  const propiedadesByTipo = MOCK_DATA.propiedades.reduce((acc, prop) => {
    acc[prop.tipo as keyof typeof acc] = (acc[prop.tipo as keyof typeof acc] || 0) + 1;
    return acc;
  }, { Casa: 0, Departamento: 0, Parcela: 0, LocalComercial: 0, Oficina: 0, Bodega: 0, Terreno: 0 });

  // Count properties by estado
  const propiedadesByEstado = MOCK_DATA.propiedades.reduce((acc, prop) => {
    acc[prop.estado as keyof typeof acc] = (acc[prop.estado as keyof typeof acc] || 0) + 1;
    return acc;
  }, { Disponible: 0, Reservada: 0, Arrendada: 0, Vendida: 0 });

  // Count properties by operacion
  const propiedadesByOperacion = MOCK_DATA.propiedades.reduce((acc, prop) => {
    const key = prop.operacion.toLowerCase() as keyof typeof acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, { arriendo: 0, venta: 0, ambas: 0 });

  // Count visits by estado
  const visitasByEstado = MOCK_DATA.visitas.reduce((acc, visita) => {
    acc[visita.estado as keyof typeof acc] = (acc[visita.estado as keyof typeof acc] || 0) + 1;
    return acc;
  }, { Agendada: 0, Aprobada: 0, Completada: 0, Cancelada: 0 });

  // Count opportunities by etapa
  const oportunidadesByEtapa = MOCK_DATA.oportunidades.reduce((acc, opp) => {
    acc[opp.etapa as keyof typeof acc] = (acc[opp.etapa as keyof typeof acc] || 0) + 1;
    return acc;
  }, { Exploracion: 0, Visita: 0, Negociacion: 0, Cierre: 0 });

  const dashboardData: NewDashboardData = {
    propiedades: {
      total: MOCK_DATA.propiedades.length,
      porTipo: propiedadesByTipo,
      porEstado: propiedadesByEstado,
      porOperacion: propiedadesByOperacion,
    },
    visitas: {
      total: MOCK_DATA.visitas.length,
      porEstado: visitasByEstado,
      porMes: [
        { mes: 'Enero', cantidad: 8 },
        { mes: 'Febrero', cantidad: 12 },
        { mes: 'Marzo', cantidad: 6 },
        { mes: 'Abril', cantidad: 10 },
        { mes: 'Mayo', cantidad: 15 },
        { mes: 'Junio', cantidad: 9 },
      ],
      proximasVisitas: MOCK_DATA.visitas.filter(v => v.estado === 'Agendada').length,
    },
    oportunidades: {
      total: MOCK_DATA.oportunidades.length,
      porEtapa: oportunidadesByEtapa,
      conversionRate: 67.5,
    },
    agentes: {
      total: 3,
      activos: 3,
    },
    empresas: {
      total: 1,
    },
    facturacionTotal: MOCK_DATA.facturacion.monto_total,
  };

  // Return in the expected API response format
  return {
    statusCode: 200,
    message: 'Dashboard data retrieved successfully',
    data: dashboardData,
  };
};