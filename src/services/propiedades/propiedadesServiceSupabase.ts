import { supabase } from '../../integrations/supabase/client';
import type { Propiedad } from '../../types/propiedad';
import { mapFormToSupabase, mapSupabaseToForm, mapSupabaseToList } from '../../utils/propiedadMappers';

/**
 * Fetch all properties for a company
 */
export const getPropiedades = async (empresaId: string): Promise<Propiedad[]> => {
  try {
    console.log('🔧 getPropiedades: Called with empresaId:', empresaId);
    console.time('⏱️ getPropiedades total');

    // OPTIMIZATION: Run both queries in parallel
    console.time('⏱️ Parallel queries');
    const [propiedadesResult, imagenesResult] = await Promise.all([
      // Query 1: Properties (lightweight)
      supabase
        .from('propiedad')
        .select(`
          id,
          titulo,
          tipo,
          estado,
          direccion,
          habitaciones,
          banos,
          area_total,
          arriendo,
          venta,
          precio_arriendo,
          precio_venta,
          divisa,
          propietario!inner(id, nombre)
        `)
        .eq('empresa_id', empresaId)
        .order('created_at', { ascending: false }),

      // Query 2: Get ALL images (we'll filter for principal later)
      supabase
        .from('propiedad_imagenes')
        .select('propiedad_id, url, tipo_imagen, orden')
        .order('orden', { ascending: true })
    ]);
    console.timeEnd('⏱️ Parallel queries');

    console.log('📊 Images query result:', {
      error: imagenesResult.error,
      count: imagenesResult.data?.length,
      sample: imagenesResult.data?.slice(0, 3)
    });

    if (propiedadesResult.error) throw propiedadesResult.error;

    const propiedadesData = propiedadesResult.data || [];

    if (propiedadesData.length === 0) {
      console.timeEnd('⏱️ getPropiedades total');
      return [];
    }

    // Create fast lookup map for images (prefer principal, fallback to first image)
    console.time('⏱️ Image mapping');
    const imagenesMap = new Map<string, string>();

    // First pass: look for principal images
    (imagenesResult.data || []).forEach(img => {
      if (img.tipo_imagen === 'principal' && !imagenesMap.has(img.propiedad_id)) {
        imagenesMap.set(img.propiedad_id, img.url);
      }
    });

    // Second pass: fill in any missing with first available image
    (imagenesResult.data || []).forEach(img => {
      if (!imagenesMap.has(img.propiedad_id)) {
        imagenesMap.set(img.propiedad_id, img.url);
      }
    });

    console.log('🗺️ Image map created:', {
      totalImages: imagenesResult.data?.length,
      propertiesWithImages: imagenesMap.size,
      mapEntries: Array.from(imagenesMap.entries()).slice(0, 3)
    });
    console.timeEnd('⏱️ Image mapping');

    // Map properties with images
    console.time('⏱️ Data mapping');
    const result = propiedadesData.map(prop => {
      const mapped = mapSupabaseToList(prop);
      mapped.imagenPrincipal = imagenesMap.get(prop.id) || null;
      return mapped;
    });
    console.timeEnd('⏱️ Data mapping');

    console.timeEnd('⏱️ getPropiedades total');
    console.log(`✅ getPropiedades: Loaded ${result.length} properties`);

    return result;
  } catch (error) {
    console.error('❌ getPropiedades: Error fetching propiedades:', error);
    throw error;
  }
}

/**
 * Fetch a single property by ID
 */
export const getPropiedadById = async (id: string): Promise<Propiedad> => {
  try {
    const { data, error } = await supabase
      .from('propiedad')
      .select(`
        *,
        propietario(*),
        amenidades(*),
        propiedad_imagenes(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Propiedad no encontrada');

    return mapSupabaseToForm(data);
  } catch (error) {
    console.error('Error fetching propiedad:', error);
    throw error;
  }
};

/**
 * Create a new property
 */
export const createPropiedad = async (formData: any, empresaId: string): Promise<Propiedad> => {
  try {
    // ✅ VALIDACIÓN A NIVEL DE SERVICIO: Verificar propietario_id antes de procesar
    if (!formData.propietario_id) {
      console.error('❌ createPropiedad: propietario_id is missing in formData:', formData);
      throw new Error('No se puede crear una propiedad sin propietario');
    }

    console.log('✅ createPropiedad: Validating data with propietario_id:', formData.propietario_id);
    
    const supabaseData = mapFormToSupabase(formData, empresaId);
    
    console.log('✅ createPropiedad: Data mapped successfully, inserting into DB:', supabaseData.propiedad);
    
    // Insert property
    const { data: propiedadData, error: propiedadError } = await supabase
      .from('propiedad')
      .insert([supabaseData.propiedad])
      .select()
      .single();

    if (propiedadError) {
      console.error('❌ Database error creating propiedad:', propiedadError);
      throw propiedadError;
    }
    if (!propiedadData) throw new Error('No se pudo crear la propiedad');

    // Insert amenities if provided
    if (supabaseData.amenidades) {
      const amenidadesData = {
        ...supabaseData.amenidades,
        propiedad_id: propiedadData.id
      };

      const { error: amenidadesError } = await supabase
        .from('amenidades')
        .insert([amenidadesData]);

      if (amenidadesError) {
        console.error('Error creating amenidades:', amenidadesError);
      }
    }

    return await getPropiedadById(propiedadData.id);
  } catch (error) {
    console.error('Error creating propiedad:', error);
    throw error;
  }
};

/**
 * Update an existing property
 */
export const updatePropiedad = async (id: string, formData: any, empresaId: string): Promise<Propiedad> => {
  try {
    const supabaseData = mapFormToSupabase(formData, empresaId);
    
    // Update property
    const { data: propiedadData, error: propiedadError } = await supabase
      .from('propiedad')
      .update(supabaseData.propiedad)
      .eq('id', id)
      .select()
      .single();

    if (propiedadError) throw propiedadError;
    if (!propiedadData) throw new Error('No se pudo actualizar la propiedad');

    // Update or create amenities
    if (supabaseData.amenidades) {
      const { error: checkError, data: existingAmenidades } = await supabase
        .from('amenidades')
        .select('id')
        .eq('propiedad_id', id)
        .maybeSingle();

      if (checkError) console.error('Error checking amenidades:', checkError);

      const amenidadesData = {
        ...supabaseData.amenidades,
        propiedad_id: id
      };

      if (existingAmenidades) {
        // Update existing amenities
        const { error: updateError } = await supabase
          .from('amenidades')
          .update(amenidadesData)
          .eq('propiedad_id', id);

        if (updateError) console.error('Error updating amenidades:', updateError);
      } else {
        // Create new amenities
        const { error: insertError } = await supabase
          .from('amenidades')
          .insert([amenidadesData]);

        if (insertError) console.error('Error creating amenidades:', insertError);
      }
    }

    return await getPropiedadById(id);
  } catch (error) {
    console.error('Error updating propiedad:', error);
    throw error;
  }
};

/**
 * Update property estado
 */
export const updatePropiedadEstado = async (id: string, estado: string): Promise<Propiedad> => {
  try {
    const { data, error } = await supabase
      .from('propiedad')
      .update({ estado: estado as any })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No se pudo actualizar el estado de la propiedad');

    return await getPropiedadById(id);
  } catch (error) {
    console.error('Error updating propiedad estado:', error);
    throw error;
  }
};

/**
 * Delete a property (soft delete by setting visible = false)
 */
export const deletePropiedad = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('propiedad')
      .update({ visible: false })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting propiedad:', error);
    throw error;
  }
};
