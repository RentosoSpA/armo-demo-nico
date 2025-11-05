import { supabase } from '../../integrations/supabase/client';
import type { PropiedadResumen } from '../../types/propietario';

/**
 * Get properties with their primary images for a specific owner
 */
export const getPropiedadesWithImagesByPropietario = async (
  propietarioId: string
): Promise<PropiedadResumen[]> => {
  try {
    const { data, error } = await supabase
      .from('propiedad')
      .select(`
        id,
        titulo,
        direccion,
        tipo,
        estado,
        precio_arriendo,
        precio_venta,
        propiedad_imagenes!left(url, tipo_imagen, orden)
      `)
      .eq('propietario_id', propietarioId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(prop => {
      // Find primary image or first image
      const primaryImage = (prop.propiedad_imagenes as any[])?.find(
        (img: any) => img.tipo_imagen === 'principal'
      );
      const firstImage = (prop.propiedad_imagenes as any[])?.[0];
      
      return {
        id: prop.id,
        titulo: prop.titulo,
        direccion: prop.direccion,
        tipo: prop.tipo,
        estado: prop.estado,
        precio_arriendo: prop.precio_arriendo ?? undefined,
        precio_venta: prop.precio_venta ?? undefined,
        imagen_url: primaryImage?.url || firstImage?.url
      };
    });
  } catch (error) {
    console.error('Error fetching properties for owner:', error);
    throw error;
  }
};
