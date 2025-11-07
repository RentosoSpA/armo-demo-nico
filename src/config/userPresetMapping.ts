import type { PresetType } from '../store/presetStore';

/**
 * Mapeo de UIDs de usuarios a presets específicos
 */
export const USER_PRESET_MAPPING: Record<string, PresetType> = {
  'cristobal-nubecowork-uid': 'coworking',
  // Agregar más usuarios aquí según sea necesario
};

/**
 * Obtiene el preset configurado para un UID específico
 */
export const getPresetForUser = (uid: string): PresetType | null => {
  return USER_PRESET_MAPPING[uid] || null;
};

/**
 * Obtiene el preset basándose en el dominio del email
 * Esta es una alternativa si no hay mapping directo por UID
 */
export const getPresetByEmail = (email: string): PresetType => {
  // Usuarios de Nube Cowork automáticamente usan preset coworking
  if (email.includes('@nubecowork.cl')) {
    return 'coworking';
  }
  
  // Por defecto, usar preset inmobiliaria
  return 'inmobiliaria';
};

/**
 * Obtiene el preset para un usuario basándose en UID o email
 */
export const getPresetForUserContext = (uid: string, email: string): PresetType => {
  // Primero intentar por UID
  const presetByUid = getPresetForUser(uid);
  if (presetByUid) {
    return presetByUid;
  }
  
  // Si no hay mapping por UID, usar email
  return getPresetByEmail(email);
};
