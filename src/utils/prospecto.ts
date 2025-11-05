import type { Prospecto } from '../types/profile';
import type { OportunidadContacto } from '../types/oportunidad';

/**
 * Formats a prospecto's full name from their name fields
 */
export const formatProspectoName = (prospecto: Prospecto): string => {
  const names = [
    prospecto.primer_nombre,
    prospecto.segundo_nombre,
    prospecto.primer_apellido,
    prospecto.segundo_apellido,
  ].filter(Boolean);

  return names.join(' ');
};

/**
 * Finds a prospecto by their ID and returns their formatted name
 */
export const getProspectoNameById = (prospectos: Prospecto[], prospectoId: string): string => {
  const prospecto = prospectos.find(p => p.id === prospectoId);
  return prospecto ? formatProspectoName(prospecto) : `ID: ${prospectoId}`;
};

/**
 * Converts a Prospecto to OportunidadContacto format for UI compatibility
 */
export const prospectoToContacto = (prospecto: Prospecto): OportunidadContacto => {
  return {
    nombre: formatProspectoName(prospecto) || prospecto.display_name || 'Sin nombre',
    telefono: prospecto.phone_e164 || '',
    email: prospecto.email || '',
  };
};
