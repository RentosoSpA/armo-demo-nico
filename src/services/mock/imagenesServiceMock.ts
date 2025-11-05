import { MOCK_DATA, simulateDelay } from './mockData';
import { getPropertyImage } from './propertyImages';
import type { PropiedadImage, PropertyImagesResponse } from '../../types/document';

/**
 * Mock service for property images
 * Compatible with imagenesServiceSupabase.ts interface
 */

/**
 * Get all images for a property (mock implementation)
 */
export const getImages = async (propiedadId: string): Promise<PropertyImagesResponse> => {
  await simulateDelay();
  
  // Find property in mock data
  const propiedad = MOCK_DATA.propiedades.find(p => p.id === propiedadId);
  
  if (!propiedad || !propiedad.imagenPrincipal) {
    return { files: [], signedUrl: null };
  }
  
  // Get resolved image URL
  const imageUrl = getPropertyImage(propiedad.imagenPrincipal) || propiedad.imagenPrincipal;
  
  // Create principal image object with all required fields
  const images: PropiedadImage[] = [
    {
      id: `${propiedadId}-img-principal`,
      propiedad_id: propiedadId,
      url: imageUrl,
      nombre_archivo: propiedad.imagenPrincipal,
      tipo_imagen: 'principal',
      orden: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      descripcion: null
    }
  ];
  
  return {
    files: images,
    signedUrl: imageUrl
  };
};

/**
 * Get the first/principal image for a property (mock implementation)
 */
export const getImage = async (propiedadId: string): Promise<PropertyImagesResponse> => {
  return getImages(propiedadId);
};

/**
 * Get first images for multiple properties in bulk (mock implementation)
 */
export const getBulkImages = async (propiedadIds: string[]): Promise<Record<string, string | null>> => {
  await simulateDelay();
  
  if (!propiedadIds || propiedadIds.length === 0) {
    return {};
  }
  
  const imageMap: Record<string, string | null> = {};
  
  propiedadIds.forEach(id => {
    const propiedad = MOCK_DATA.propiedades.find(p => p.id === id);
    if (propiedad && propiedad.imagenPrincipal) {
      const imageUrl = getPropertyImage(propiedad.imagenPrincipal) || propiedad.imagenPrincipal;
      imageMap[id] = imageUrl;
    } else {
      imageMap[id] = null;
    }
  });
  
  return imageMap;
};

/**
 * Upload image - mock implementation (no-op for now)
 */
export const uploadImage = async (
  propiedadId: string,
  file: File,
  tipoImagen: 'principal' | 'galeria' | 'plano' = 'galeria'
): Promise<string> => {
  await simulateDelay();
  console.log(`Mock: Image upload simulated for property ${propiedadId}`, { file: file.name, tipoImagen });
  return 'mock-uploaded-image-url';
};

/**
 * Delete image - mock implementation (no-op for now)
 */
export const deleteImage = async (imageId: string): Promise<void> => {
  await simulateDelay();
  console.log(`Mock: Image deletion simulated for image ${imageId}`);
};
