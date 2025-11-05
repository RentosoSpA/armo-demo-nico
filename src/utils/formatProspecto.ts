import type { Prospecto } from '../types/profile';

/**
 * Helper utility to safely access prospect fields whether they're in camelCase or snake_case
 * This provides backward compatibility during migration
 */
export const getProspectoField = (prospecto: Prospecto, field: string): any => {
  // Map of camelCase to snake_case field names
  const fieldMap: Record<string, string> = {
    primerNombre: 'primer_nombre',
    segundoNombre: 'segundo_nombre',
    primerApellido: 'primer_apellido',
    segundoApellido: 'segundo_apellido',
    codigoTelefonico: 'codigo_telefonico',
    telefono: 'phone_e164',
    fechaNacimiento: 'fecha_nacimiento',
    tipoDocumento: 'tipo_documento',
    situacionLaboral: 'situacion_laboral',
    ingresosMensuales: 'ingresos_mensuales',
    egresosMensuales: 'egresos_mensuales',
  };

  // Get the snake_case version
  const snakeField = fieldMap[field] || field;
  
  // Return the value, preferring snake_case
  return (prospecto as any)[snakeField] || (prospecto as any)[field];
};

/**
 * Gets the full name of a prospect
 */
export const getProspectoFullName = (prospecto: Prospecto): string => {
  const firstName = prospecto.primer_nombre || '';
  const secondName = prospecto.segundo_nombre || '';
  const firstLastName = prospecto.primer_apellido || '';
  const secondLastName = prospecto.segundo_apellido || '';
  
  const fullName = `${firstName} ${secondName} ${firstLastName} ${secondLastName}`.trim();
  return fullName || prospecto.display_name || 'Sin nombre';
};

/**
 * Gets the phone number in E.164 format
 */
export const getProspectoPhone = (prospecto: Prospecto): string => {
  return prospecto.phone_e164 || '';
};
