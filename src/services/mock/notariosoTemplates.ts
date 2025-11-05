export interface TemplateData {
  name: string;
  version: string;
  configured: boolean;
  lastUpdated?: string;
}

export interface NotariosoTemplates {
  contrato: {
    renta: {
      natural: TemplateData;
      empresa: TemplateData;
    };
    venta: {
      natural: TemplateData;
      empresa: TemplateData;
    };
  };
  visita: {
    renta: {
      natural: TemplateData;
      empresa: TemplateData;
    };
    venta: {
      natural: TemplateData;
      empresa: TemplateData;
    };
  };
}

export const notariosoTemplates: NotariosoTemplates = {
  contrato: {
    renta: {
      natural: {
        name: 'Contrato Renta Natural',
        version: 'v1.2',
        configured: true,
        lastUpdated: '15/03/2024'
      },
      empresa: {
        name: 'Contrato Renta Empresa',
        version: 'v1.0',
        configured: true,
        lastUpdated: '10/03/2024'
      }
    },
    venta: {
      natural: {
        name: 'Contrato Venta Natural',
        version: 'v2.1',
        configured: true,
        lastUpdated: '20/03/2024'
      },
      empresa: {
        name: 'Contrato Venta Empresa',
        version: 'v1.5',
        configured: false
      }
    }
  },
  visita: {
    renta: {
      natural: {
        name: 'Orden Visita Renta Natural',
        version: 'v1.0',
        configured: true,
        lastUpdated: '12/03/2024'
      },
      empresa: {
        name: 'Orden Visita Renta Empresa',
        version: 'v1.0',
        configured: false
      }
    },
    venta: {
      natural: {
        name: 'Orden Visita Venta Natural',
        version: 'v1.1',
        configured: true,
        lastUpdated: '18/03/2024'
      },
      empresa: {
        name: 'Orden Visita Venta Empresa',
        version: 'v1.0',
        configured: false
      }
    }
  }
};

export const mockProspectos = [
  { id: '1', nombre: 'Juan Pérez', tipo: 'natural' as const },
  { id: '2', nombre: 'María González', tipo: 'natural' as const },
  { id: '3', nombre: 'Constructora ABC S.A.', tipo: 'empresa' as const },
  { id: '4', nombre: 'Inmobiliaria XYZ Ltda.', tipo: 'empresa' as const },
];

export type DocumentType = 'contrato' | 'visita';
export type OperationType = 'renta' | 'venta';
export type ProspectoType = 'natural' | 'empresa';