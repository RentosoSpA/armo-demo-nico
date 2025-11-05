export interface FinanzasData {
  porMes: Array<{
    mes: string;
    ingresos: number;
    comisiones: number;
    gastos: number;
  }>;
  totalIngresos: number;
  totalComisiones: number;
  totalGastos: number;
}

// ⭐ NUEVOS TIPOS
export interface MetaMensual {
  objetivoMensual: number;
  progreso: number;
  porcentaje: number;
  diasRestantes: number;
}

export interface Comision {
  id: string;
  propiedadId: string;
  propiedadNombre: string;
  monto: number;
  estado: 'Pagada' | 'Pendiente' | 'Atrasada';
  fechaEsperada: string;
  tipo: 'arriendo' | 'venta';
}

export interface ComisionesStats {
  totalMes: number;
  mejorPropiedad: {
    nombre: string;
    monto: number;
  };
  promedioComision: number;
  masAltaPendiente: number;
  porcentajeConComision: number;
}

export interface Gasto {
  id: string;
  categoria: 'Fijo' | 'Variable';
  nombre: string;
  monto: number;
  estado: 'Pagado' | 'Pendiente' | 'Atrasado';
  fechaVencimiento: string;
  logo?: string;
  facturaUrl?: string;
}

export interface KPI {
  label: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: string;
}

export interface ConfiguracionFinanzas {
  metaMensual: number;
  porcentajeComision: number;
  categorias: string[];
  recordatorios: boolean;
  conexionBancaria: boolean;
}

export interface FinanzasCompleteData extends FinanzasData {
  meta: MetaMensual;
  comisiones: Comision[];
  comisionesStats: ComisionesStats;
  gastos: Gasto[];
  kpis: KPI[];
  configuracion: ConfiguracionFinanzas;
  ultimaActualizacion: string;
}