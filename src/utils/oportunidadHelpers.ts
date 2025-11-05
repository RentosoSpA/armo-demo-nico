import type { Prospecto } from '../types/profile';
import type { OportunidadContacto } from '../types/oportunidad';

/**
 * Convert a Prospecto to OportunidadContacto format (for backward compatibility)
 */
export const prospectoToContacto = (prospecto?: Prospecto): OportunidadContacto => {
  if (!prospecto) {
    return {
      nombre: 'Sin prospecto',
      telefono: '',
      email: ''
    };
  }

  const nombre = [
    prospecto.primer_nombre,
    prospecto.segundo_nombre,
    prospecto.primer_apellido,
    prospecto.segundo_apellido
  ]
    .filter(Boolean)
    .join(' ') || prospecto.display_name || 'Sin nombre';

  return {
    nombre,
    telefono: prospecto.phone_e164 || '',
    email: prospecto.email || ''
  };
};
