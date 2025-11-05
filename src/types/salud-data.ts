export interface PropertyTypeDistribution {
  tipo: string;
  count: number;
  percentage: number;
}

export interface OpportunityStatusDistribution {
  estado: string;
  count: number;
  percentage: number;
}

export interface SaludData {
  propertyTypeDistribution: PropertyTypeDistribution[];
  totalProperties: number;
  opportunityStatusDistribution: OpportunityStatusDistribution[];
  totalOpportunities: number;
  visitasAgendadas: number;
  visitasCompletadas: number;
  totalVisitas: number;
  timestamp: string;
}

export interface DashboardData {
  totalProperties: number; // total properties
  totalVisitas: number; // total visits not completed or cancelled
  ocupationRate: number; // property type distribution
  totalIngresos: number; // balance of payments
  opportunityStatusDistribution: OpportunityStatusDistribution[]; // opportunity status distribution
  timestamp: string;
}

// New types for the updated dashboard endpoint
export interface PropiedadesData {
  total: number;
  porTipo: {
    Casa: number;
    Departamento: number;
    Parcela: number;
    LocalComercial: number;
    Oficina: number;
    Bodega: number;
    Terreno: number;
  };
  porEstado: {
    Disponible: number;
    Reservada: number;
    Arrendada: number;
    Vendida: number;
  };
  porOperacion: {
    arriendo: number;
    venta: number;
    ambas: number;
  };
}

export interface VisitasData {
  total: number;
  porEstado: {
    Agendada: number;
    Aprobada: number;
    Completada: number;
    Cancelada: number;
  };
  porMes: Array<{
    mes: string;
    cantidad: number;
    agendadas?: number;
    aprobadas?: number;
    completadas?: number;
    canceladas?: number;
    total?: number;
  }>;
  proximasVisitas: number;
}

export interface OportunidadesData {
  total: number;
  porEtapa: {
    Exploracion: number;
    Visita: number;
    Negociacion: number;
    Cierre: number;
  };
  conversionRate: number;
}

export interface AgentesData {
  total: number;
  activos: number;
}

export interface EmpresasData {
  total: number;
}

export interface NewDashboardData {
  propiedades: PropiedadesData;
  visitas: VisitasData;
  oportunidades: OportunidadesData;
  agentes: AgentesData;
  empresas: EmpresasData;
  facturacionTotal?: number;
}

export interface DashboardResponse {
  statusCode: number;
  message: string;
  data: NewDashboardData;
}
