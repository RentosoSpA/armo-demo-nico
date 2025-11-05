import { supabase } from '../../integrations/supabase/client';

const BUCKET_NAME = 'property-images';

/**
 * Upload an image to Supabase Storage
 */
export const uploadImage = async (
  propiedadId: string,
  file: File,
  tipoImagen: 'principal' | 'galeria' | 'plano' = 'galeria'
): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${propiedadId}/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    // Get current max orden for this property
    const { data: existingImages } = await supabase
      .from('propiedad_imagenes')
      .select('orden')
      .eq('propiedad_id', propiedadId)
      .order('orden', { ascending: false })
      .limit(1);

    const nextOrden = existingImages && existingImages.length > 0 
      ? (existingImages[0].orden || 0) + 1 
      : 1;

    // Save image record to database
    const { error: dbError } = await supabase
      .from('propiedad_imagenes')
      .insert([{
        propiedad_id: propiedadId,
        url: urlData.publicUrl,
        nombre_archivo: file.name,
        tipo_imagen: tipoImagen,
        orden: nextOrden
      }]);

    if (dbError) {
      console.error('Error saving image record:', dbError);
      // Try to delete the uploaded file
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      throw dbError;
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Get all images for a property
 */
export const getImages = async (propiedadId: string) => {
  try {
    const { data, error } = await supabase
      .from('propiedad_imagenes')
      .select('*')
      .eq('propiedad_id', propiedadId)
      .order('orden', { ascending: true });

    if (error) throw error;

    return {
      files: data || [],
      signedUrl: data && data.length > 0 ? data[0].url : null
    };
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

/**
 * Get the first image for a property
 */
export const getImage = async (propiedadId: string) => {
  try {
    const { data, error } = await supabase
      .from('propiedad_imagenes')
      .select('*')
      .eq('propiedad_id', propiedadId)
      .eq('tipo_imagen', 'principal')
      .order('orden', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    // If no principal image, get the first image of any type
    if (!data) {
      const { data: firstImage, error: firstError } = await supabase
        .from('propiedad_imagenes')
        .select('*')
        .eq('propiedad_id', propiedadId)
        .order('orden', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (firstError) throw firstError;

      return {
        files: firstImage ? [firstImage] : [],
        signedUrl: firstImage?.url || null
      };
    }

    return {
      files: [data],
      signedUrl: data.url
    };
  } catch (error) {
    console.error('Error fetching first image:', error);
    return {
      files: [],
      signedUrl: null
    };
  }
};

/**
 * Get first images for multiple properties in bulk (OPTIMIZED)
 * This reduces N database calls to just 1
 */
export const getBulkImages = async (propiedadIds: string[]): Promise<Record<string, string | null>> => {
  try {
    if (!propiedadIds || propiedadIds.length === 0) {
      return {};
    }

    // Single query to get all principal images for all properties
    const { data, error } = await supabase
      .from('propiedad_imagenes')
      .select('propiedad_id, url, tipo_imagen, orden')
      .in('propiedad_id', propiedadIds)
      .order('orden', { ascending: true });

    if (error) throw error;

    // Group images by property ID and pick the first one (preferring 'principal')
    const imageMap: Record<string, string | null> = {};

    // Initialize all properties with null
    propiedadIds.forEach(id => {
      imageMap[id] = null;
    });

    // Process all images
    if (data) {
      // First pass: look for principal images
      data.forEach(img => {
        if (img.tipo_imagen === 'principal' && !imageMap[img.propiedad_id]) {
          imageMap[img.propiedad_id] = img.url;
        }
      });

      // Second pass: fill in any missing with first available image
      data.forEach(img => {
        if (!imageMap[img.propiedad_id]) {
          imageMap[img.propiedad_id] = img.url;
        }
      });
    }

    return imageMap;
  } catch (error) {
    console.error('Error fetching bulk images:', error);
    // Return empty map on error
    const emptyMap: Record<string, string | null> = {};
    propiedadIds.forEach(id => {
      emptyMap[id] = null;
    });
    return emptyMap;
  }
};

/**
 * Delete an image
 */
export const deleteImage = async (imageId: string): Promise<void> => {
  try {
    // Get image record
    const { data: image, error: fetchError } = await supabase
      .from('propiedad_imagenes')
      .select('*')
      .eq('id', imageId)
      .single();

    if (fetchError) throw fetchError;
    if (!image) throw new Error('Image not found');

    // Extract file path from URL
    const url = new URL(image.url);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf(BUCKET_NAME) + 1).join('/');

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (storageError) console.error('Error deleting from storage:', storageError);

    // Delete from database
    const { error: dbError } = await supabase
      .from('propiedad_imagenes')
      .delete()
      .eq('id', imageId);

    if (dbError) throw dbError;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
