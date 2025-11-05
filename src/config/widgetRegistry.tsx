import React from 'react';
import type { WidgetDefinition, WidgetType } from '../types/dashboard-layout';
import { 
  DollarSign, 
  Eye, 
  Home, 
  CreditCard, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Users,
  Target,
  Activity,
  FileText,
  Bell,
  PieChart
} from 'lucide-react';

// Widget Components
import WidgetPlaceholder from '../components/dashboard/WidgetPlaceholder';
import OsosBrigada from '../components/tablero/OsosBrigada';
import VisitCharacteristics from '../components/tablero/VisitCharacteristics';
import OpportunitiesByStage from '../components/tablero/OpportunitiesByStage';
import PropertyCharacteristics from '../components/tablero/PropertyCharacteristics';
import MetricsByMonth from '../components/tablero/MetricsByMonth';
import LiveActivityFeed from '../components/dashboard/LiveActivityFeed';

// FlipCard Widgets
import FlipCardBillingWidget from '../components/dashboard/widgets/FlipCardBillingWidget';
import FlipCardVisitsWidget from '../components/dashboard/widgets/FlipCardVisitsWidget';
import FlipCardPropertiesWidget from '../components/dashboard/widgets/FlipCardPropertiesWidget';
import FlipCardCollectionsWidget from '../components/dashboard/widgets/FlipCardCollectionsWidget';

// Mini KPI Widgets
import KpiTotalPropertiesWidget from '../components/dashboard/widgets/KpiTotalPropertiesWidget';
import KpiActiveAgentsWidget from '../components/dashboard/widgets/KpiActiveAgentsWidget';
import KpiConversionRateWidget from '../components/dashboard/widgets/KpiConversionRateWidget';
import KpiMonthlyVisitsWidget from '../components/dashboard/widgets/KpiMonthlyVisitsWidget';
import KpiCompaniesWidget from '../components/dashboard/widgets/KpiCompaniesWidget';

// Mini Chart Widgets
import MiniChartPropertiesPieWidget from '../components/dashboard/widgets/MiniChartPropertiesPieWidget';
import MiniChartVisitsTrendWidget from '../components/dashboard/widgets/MiniChartVisitsTrendWidget';
import MiniChartOpportunitiesProgressWidget from '../components/dashboard/widgets/MiniChartOpportunitiesProgressWidget';

// Info Widgets
import ExecutiveSummaryWidget from '../components/dashboard/widgets/ExecutiveSummaryWidget';
import AlertsNotificationsWidget from '../components/dashboard/widgets/AlertsNotificationsWidget';
import UpcomingEventsWidget from '../components/dashboard/widgets/UpcomingEventsWidget';

// Widget wrappers to adapt data structure
const PropertyCharacteristicsWidget = ({ data, loading }: any) => (
  <PropertyCharacteristics data={data?.propiedades || {}} loading={loading} />
);

const VisitCharacteristicsWidget = ({ data, loading }: any) => (
  <VisitCharacteristics data={data?.visitas || {}} loading={loading} />
);

const OpportunitiesByStageWidget = ({ data, loading }: any) => (
  <OpportunitiesByStage data={data?.oportunidades || {}} loading={loading} />
);

const MetricsByMonthWidget = ({ data, loading }: any) => (
  <MetricsByMonth visitasData={data?.visitas || {}} loading={loading} />
);

const OsosBrigadaWidget = ({ loading }: any) => (
  <OsosBrigada loading={loading} />
);

const LiveActivityWidget = () => (
  <LiveActivityFeed />
);

// Widget Registry Map
export const WIDGET_REGISTRY: Record<WidgetType, WidgetDefinition> = {
  // FlipCards
  'flip-card-billing': {
    type: 'flip-card-billing',
    defaultTitle: 'Facturación y Comisiones',
    description: 'Métricas de facturación y comisiones',
    defaultSize: 'small',
    category: 'metrics',
    icon: 'DollarSign',
    component: FlipCardBillingWidget
  },
  'flip-card-visits': {
    type: 'flip-card-visits',
    defaultTitle: 'Visitas',
    description: 'Estadísticas de visitas',
    defaultSize: 'small',
    category: 'metrics',
    icon: 'Eye',
    component: FlipCardVisitsWidget
  },
  'flip-card-properties': {
    type: 'flip-card-properties',
    defaultTitle: 'Propiedades',
    description: 'Resumen de propiedades',
    defaultSize: 'small',
    category: 'metrics',
    icon: 'Home',
    component: FlipCardPropertiesWidget
  },
  'flip-card-collections': {
    type: 'flip-card-collections',
    defaultTitle: 'Cobranzas',
    description: 'Estado de cobranzas',
    defaultSize: 'small',
    category: 'metrics',
    icon: 'CreditCard',
    component: FlipCardCollectionsWidget
  },
  
  // Charts
  'property-characteristics': {
    type: 'property-characteristics',
    defaultTitle: 'Características de Propiedades',
    description: 'Análisis de propiedades por características',
    defaultSize: 'large',
    category: 'charts',
    icon: 'BarChart3',
    component: PropertyCharacteristicsWidget
  },
  'visit-characteristics': {
    type: 'visit-characteristics',
    defaultTitle: 'Características de Visitas',
    description: 'Análisis de visitas por estado',
    defaultSize: 'large',
    category: 'charts',
    icon: 'BarChart3',
    component: VisitCharacteristicsWidget
  },
  'metrics-by-month': {
    type: 'metrics-by-month',
    defaultTitle: 'Métricas Mensuales',
    description: 'Evolución mensual de métricas clave',
    defaultSize: 'full',
    category: 'charts',
    icon: 'TrendingUp',
    component: MetricsByMonthWidget
  },
  'opportunities-by-stage': {
    type: 'opportunities-by-stage',
    defaultTitle: 'Oportunidades por Etapa',
    description: 'Distribución de oportunidades en el pipeline',
    defaultSize: 'large',
    category: 'charts',
    icon: 'Target',
    component: OpportunitiesByStageWidget
  },
  'osos-brigada': {
    type: 'osos-brigada',
    defaultTitle: 'Brigada de Osos',
    description: 'Estado de los osos trabajando',
    defaultSize: 'full',
    category: 'activity',
    icon: 'Users',
    component: OsosBrigadaWidget
  },
  'live-activity': {
    type: 'live-activity',
    defaultTitle: 'Actividad en Vivo',
    description: 'Actividad reciente del sistema',
    defaultSize: 'full',
    category: 'activity',
    icon: 'Activity',
    component: LiveActivityWidget
  },
  
  // KPIs
  'kpi-total-properties': {
    type: 'kpi-total-properties',
    defaultTitle: 'Total Propiedades',
    description: 'Número total de propiedades activas',
    defaultSize: 'small',
    category: 'metrics',
    icon: 'Home',
    component: KpiTotalPropertiesWidget
  },
  'kpi-active-agents': {
    type: 'kpi-active-agents',
    defaultTitle: 'Agentes Activos',
    description: 'Agentes activos en el sistema',
    defaultSize: 'small',
    category: 'metrics',
    icon: 'Users',
    component: KpiActiveAgentsWidget
  },
  'kpi-conversion-rate': {
    type: 'kpi-conversion-rate',
    defaultTitle: 'Tasa de Conversión',
    description: 'Porcentaje de conversión de oportunidades',
    defaultSize: 'small',
    category: 'metrics',
    icon: 'Target',
    component: KpiConversionRateWidget
  },
  'kpi-monthly-visits': {
    type: 'kpi-monthly-visits',
    defaultTitle: 'Visitas del Mes',
    description: 'Total de visitas en el mes actual',
    defaultSize: 'small',
    category: 'metrics',
    icon: 'Eye',
    component: KpiMonthlyVisitsWidget
  },
  'kpi-companies': {
    type: 'kpi-companies',
    defaultTitle: 'Empresas',
    description: 'Total de empresas registradas',
    defaultSize: 'small',
    category: 'metrics',
    icon: 'Users',
    component: KpiCompaniesWidget
  },
  
  // Mini Charts
  'mini-chart-properties-pie': {
    type: 'mini-chart-properties-pie',
    defaultTitle: 'Distribución de Propiedades',
    description: 'Gráfico de distribución de propiedades',
    defaultSize: 'medium',
    category: 'charts',
    icon: 'PieChart',
    component: MiniChartPropertiesPieWidget
  },
  'mini-chart-visits-trend': {
    type: 'mini-chart-visits-trend',
    defaultTitle: 'Tendencia de Visitas',
    description: 'Evolución temporal de visitas',
    defaultSize: 'medium',
    category: 'charts',
    icon: 'TrendingUp',
    component: MiniChartVisitsTrendWidget
  },
  'mini-chart-opportunities-progress': {
    type: 'mini-chart-opportunities-progress',
    defaultTitle: 'Progreso de Oportunidades',
    description: 'Progreso de oportunidades en el pipeline',
    defaultSize: 'medium',
    category: 'charts',
    icon: 'BarChart3',
    component: MiniChartOpportunitiesProgressWidget
  },
  
  // Informative Widgets
  'executive-summary': {
    type: 'executive-summary',
    defaultTitle: 'Resumen Ejecutivo',
    description: 'Vista ejecutiva de métricas clave',
    defaultSize: 'medium',
    category: 'info',
    icon: 'FileText',
    component: ExecutiveSummaryWidget
  },
  'alerts-notifications': {
    type: 'alerts-notifications',
    defaultTitle: 'Alertas y Notificaciones',
    description: 'Alertas importantes del sistema',
    defaultSize: 'medium',
    category: 'info',
    icon: 'Bell',
    component: AlertsNotificationsWidget
  },
  'upcoming-events': {
    type: 'upcoming-events',
    defaultTitle: 'Próximos Eventos',
    description: 'Calendario de eventos próximos',
    defaultSize: 'medium',
    category: 'info',
    icon: 'Calendar',
    component: UpcomingEventsWidget
  }
};

// Helper function to get widget definition
export const getWidgetDefinition = (type: WidgetType): WidgetDefinition => {
  return WIDGET_REGISTRY[type];
};

// Get widgets by category
export const getWidgetsByCategory = (category: WidgetDefinition['category']) => {
  return Object.values(WIDGET_REGISTRY).filter(w => w.category === category);
};

// Get all available widgets
export const getAllWidgets = (): WidgetDefinition[] => {
  return Object.values(WIDGET_REGISTRY);
};
