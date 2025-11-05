export type DecisionSource = 'oportunidades' | 'cobros';
export type DecisionSeverity = 'info' | 'warning' | 'urgent';
export type BearType = 'curioso' | 'cauteloso' | 'notarioso' | 'cuidadoso';

export interface Decision {
  id: string;
  source: DecisionSource;
  bear: BearType;
  title: string;
  message: string;
  severity: DecisionSeverity;
  href: string;
  requiresAction: boolean;
  count?: number; // Para agrupar (ej: "3 prospectos")
  createdAt: Date;
  read: boolean;
}

export interface DecisionStats {
  total: number;
  unread: number;
  bySource: {
    oportunidades: number;
    cobros: number;
  };
  bySeverity: {
    info: number;
    warning: number;
    urgent: number;
  };
}
