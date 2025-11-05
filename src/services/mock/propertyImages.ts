// Carga dinámica de imágenes existentes en la carpeta, evitando fallos por archivos inexistentes
// Vite: import.meta.glob resuelve en build solo lo que realmente existe
const modules = import.meta.glob('/src/assets/properties/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default'
}) as Record<string, string>;

// Mapa de imágenes por nombre de archivo
export const propertyImages: Record<string, string> = Object.entries(modules).reduce(
  (acc, [fullPath, url]) => {
    const name = fullPath.split('/').pop();
    if (name) acc[name] = url;
    return acc;
  },
  {} as Record<string, string>
);

// Helper para obtener imagen por nombre de archivo
export const getPropertyImage = (filename: string | null | undefined): string | null => {
  if (!filename) return null;
  // Extraer solo el nombre del archivo si viene con ruta
  const name = filename.split('/').pop() || filename;
  return propertyImages[name] || null;
};
