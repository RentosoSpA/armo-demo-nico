import type { Propiedad } from '../types/propiedad';

export const propiedadToJson = (propiedad: Propiedad) => {
  return JSON.stringify(propiedad);
};
