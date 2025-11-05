export interface WidgetRow {
  id: string;
  widgets: string[]; // Array de widget IDs en esta fila
  maxWidgets?: number; // Máximo de widgets por fila (default: ilimitado)
}

export interface DashboardRows {
  rows: WidgetRow[];
}
