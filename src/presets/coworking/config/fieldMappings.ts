// Mapeos de campos entre el sistema base (inmobiliaria) y coworking

export const FIELD_MAPPINGS = {
  // Mapeo de tipos de entidades
  entityTypes: {
    propiedad: 'espacio',
    visita: 'tour',
    contrato: 'membresia',
    propietario: 'administrador',
  },
  
  // Mapeo de campos de Propiedad -> Espacio
  propiedad: {
    titulo: 'titulo',
    tipo: 'tipo',
    estado: 'estado',
    operacion: 'modalidad',
    precio: 'precio',
    divisa: 'divisa',
    habitaciones: 'capacidad',
    areaTotal: 'area_m2',
    piso: 'piso',
    direccion: 'ubicacion',
  },
  
  // Mapeo de campos de Visita -> Tour
  visita: {
    propiedad: 'espacio_id',
    fecha_inicio: 'fecha_inicio',
    estado: 'estado',
    plataforma: 'plataforma',
  },
  
  // Mapeo de campos de Contrato -> Membresía
  contrato: {
    nombre: 'nombre_plan',
    estado: 'estado',
    propiedad_id: 'espacio_id',
    prospecto_id: 'miembro_id',
  },
  
  // Mapeo de estados
  estados: {
    propiedad: {
      'Disponible': 'Disponible',
      'Reservada': 'Reservado',
      'Arrendada': 'Ocupado',
      'Vendida': 'Ocupado',
    },
    visita: {
      'Agendada': 'Agendado',
      'Aprobada': 'Confirmado',
      'Completada': 'Completado',
      'Cancelada': 'Cancelado',
    },
    contrato: {
      'borrador': 'activa',
      'enviado': 'activa',
      'firmado': 'activa',
      'anulado': 'cancelada',
    }
  },
  
  // Mapeo de tipos
  tipos: {
    propiedad: {
      'Casa': 'Oficina Privada',
      'Departamento': 'Oficina Privada',
      'Oficina': 'Oficina Privada',
      'Local comercial': 'Hot Desk',
      'Bodega': 'Área Común',
    }
  }
};

export const getFieldLabel = (preset: 'inmobiliaria' | 'coworking', field: string): string => {
  if (preset === 'coworking') {
    // Importar dinámicamente los labels de coworking
    return field; // Por ahora retornamos el field original
  }
  return field;
};

export const mapFieldValue = (
  preset: 'inmobiliaria' | 'coworking',
  entity: string,
  field: string,
  value: string
): string => {
  if (preset === 'coworking') {
    // Mapear el valor según el preset
    if (entity === 'propiedad' && field === 'estado') {
      const mappedValue = FIELD_MAPPINGS.estados.propiedad[value as keyof typeof FIELD_MAPPINGS.estados.propiedad];
      return mappedValue || value;
    }
    if (entity === 'visita' && field === 'estado') {
      const mappedValue = FIELD_MAPPINGS.estados.visita[value as keyof typeof FIELD_MAPPINGS.estados.visita];
      return mappedValue || value;
    }
  }
  return value;
};
