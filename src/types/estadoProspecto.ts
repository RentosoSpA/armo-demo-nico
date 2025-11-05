export enum EstadoProspecto {
  VERIFICACION = 'VERIFICACION',
  ACTIVO = 'APROBADO',
  INACTIVO = 'RECHAZADO',
  REVISIONMANUAL = 'REVISIONMANUAL',
  DOCUMENTOS = 'DOCUMENTOS',
}

export const getEstadoProspectoTitle = (estado: EstadoProspecto): string => {
  switch (estado) {
    case EstadoProspecto.VERIFICACION:
      return 'En verificación';
    case EstadoProspecto.DOCUMENTOS:
      return 'Pidiendo documentos';
    case EstadoProspecto.REVISIONMANUAL:
      return 'Revisión manual';
    case EstadoProspecto.ACTIVO:
      return 'Listo para avanzar';
    case EstadoProspecto.INACTIVO:
      return 'No cumple requisitos';
    default:
      return 'En verificación';
  }
};

export const getEstadoProspectoColor = (estado: EstadoProspecto): string => {
  switch (estado) {
    case EstadoProspecto.VERIFICACION:
      return 'gold';
    case EstadoProspecto.DOCUMENTOS:
      return 'blue';
    case EstadoProspecto.REVISIONMANUAL:
      return 'orange';
    case EstadoProspecto.ACTIVO:
      return 'green';
    case EstadoProspecto.INACTIVO:
      return 'red';
    default:
      return 'gold';
  }
};