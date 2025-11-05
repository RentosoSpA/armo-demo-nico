import { supabase } from '../../integrations/supabase/client';

/**
 * Service to fetch property types dynamically from Supabase
 * This prevents desync between database enums and TypeScript enums
 */

let cachedTipos: string[] | null = null;

export const getTiposPropiedad = async (): Promise<string[]> => {
  // Return cached types if available
  if (cachedTipos) {
    return cachedTipos;
  }

  try {
    // Query the enum values directly from the database
    const { data, error } = await supabase.rpc('get_enum_values', {
      enum_name: 'tipo_propiedad'
    });

    if (error) {
      console.warn('Error fetching property types from DB, using fallback:', error);
      // Fallback to hardcoded values if DB query fails
      return [
        "Casa",
        "Departamento",
        "Parcela",
        "LocalComercial",
        "Oficina",
        "Bodega",
        "Terreno",
        "Loft",
        "Duplex",
        "Industrial",
        "Estacionamiento",
        "Sitio"
      ];
    }

    const tipos = data || [];
    cachedTipos = tipos;
    return tipos;
  } catch (err) {
    console.error('Exception fetching property types:', err);
    // Fallback to hardcoded values
    return [
      "Casa",
      "Departamento",
      "Parcela",
      "LocalComercial",
      "Oficina",
      "Bodega",
      "Terreno",
      "Loft",
      "Duplex",
      "Industrial",
      "Estacionamiento",
      "Sitio"
    ];
  }
};

/**
 * Clear the cache - useful when database enum is updated
 */
export const clearTiposCache = () => {
  cachedTipos = null;
};
