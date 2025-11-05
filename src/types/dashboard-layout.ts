export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export type WidgetType = 
  // Existing FlipCards
  | 'flip-card-billing'
  | 'flip-card-visits'
  | 'flip-card-properties'
  | 'flip-card-collections'
  // Existing Charts
  | 'property-characteristics'
  | 'visit-characteristics'
  | 'metrics-by-month'
  | 'opportunities-by-stage'
  | 'osos-brigada'
  | 'live-activity'
  // New Mini KPIs
  | 'kpi-total-properties'
  | 'kpi-active-agents'
  | 'kpi-conversion-rate'
  | 'kpi-monthly-visits'
  | 'kpi-companies'
  // New Mini Charts
  | 'mini-chart-properties-pie'
  | 'mini-chart-visits-trend'
  | 'mini-chart-opportunities-progress'
  // New Informative Widgets
  | 'executive-summary'
  | 'alerts-notifications'
  | 'upcoming-events';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  position: number;
  visible: boolean;
  config?: Record<string, any>;
}

export interface DashboardLayout {
  userId: string;
  widgets: Widget[];
  rows?: { id: string; widgets: string[] }[]; // Sistema de filas flexible
  gridColumns: number;
  compactMode: boolean;
  lastUpdated: string;
}

export interface WidgetDefinition {
  type: WidgetType;
  defaultTitle: string;
  description: string;
  defaultSize: WidgetSize;
  category: 'metrics' | 'charts' | 'activity' | 'info';
  icon: string;
  component: React.ComponentType<any>;
}

export type PresetLayout = 'ejecutivo' | 'operaciones' | 'ventas' | 'completo';

export interface LayoutPreset {
  id: PresetLayout;
  name: string;
  description: string;
  widgets: Omit<Widget, 'id'>[];
}
