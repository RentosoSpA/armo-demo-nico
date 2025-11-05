export type ActivityStatus = 'Completado' | 'En proceso' | 'Error' | 'Pendiente';

export interface ActivityEvent {
  id: string;
  agent: 'OptimizOso' | 'Oso Curioso' | 'Oso Cauteloso' | 'Oso Notarioso' | 'Oso Cuidadoso' | string;
  status: ActivityStatus;
  description: string;
  timestamp: string; // ISO
  icon?: string;     // opcional: nombre de icono si aplica
}
