export interface ContratosTemplateData {
  name: string | null;
  version?: string;
  configured: boolean;
  lastUpdated?: string;
}

export interface ContratosTemplates {
  contrato: {
    renta: {
      natural: ContratosTemplateData;
      empresa: ContratosTemplateData;
    };
    venta: {
      natural: ContratosTemplateData;
      empresa: ContratosTemplateData;
    };
  };
  visita: {
    renta: {
      natural: ContratosTemplateData;
      empresa: ContratosTemplateData;
    };
    venta: {
      natural: ContratosTemplateData;
      empresa: ContratosTemplateData;
    };
  };
}

export const contratosTemplates: ContratosTemplates = {
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
        version: 'v1.0',
        configured: false,
        lastUpdated: '01/03/2024'
      }
    }
  },
  visita: {
    renta: {
      natural: {
        name: 'Orden Visita Renta Natural',
        version: 'v1.0',
        configured: true,
        lastUpdated: '10/02/2024'
      },
      empresa: {
        name: 'Orden Visita Renta Empresa',
        version: 'v1.0',
        configured: true,
        lastUpdated: '10/02/2024'
      }
    },
    venta: {
      natural: {
        name: 'Orden Visita Venta Natural',
        version: 'v1.0',
        configured: true,
        lastUpdated: '12/02/2024'
      },
      empresa: {
        name: 'Orden Visita Venta Empresa',
        version: 'v1.0',
        configured: true,
        lastUpdated: '12/02/2024'
      }
    }
  }
};

export const mockContratosProspectos = [
  { id: '1', nombre: 'Juan Pérez', tipo: 'natural' as const, operacion: 'renta' as const },
  { id: '2', nombre: 'María González', tipo: 'natural' as const, operacion: 'venta' as const },
  { id: '3', nombre: 'Constructora ABC S.A.', tipo: 'empresa' as const, operacion: 'renta' as const },
  { id: '4', nombre: 'Inmobiliaria XYZ Ltda.', tipo: 'empresa' as const, operacion: 'venta' as const },
];

export type ContratosDocumentType = 'contrato' | 'visita';
export type ContratosOperationType = 'renta' | 'venta';
export type ContratosProspectoType = 'natural' | 'empresa';