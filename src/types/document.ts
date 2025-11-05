export interface GCP_FILES {
  files: {
    name: string;
    fullPath: string;
    size: number;
    contentType: string;
    timeCreated: string;
    updated: string;
    etag: string;
    md5Hash: string;
    crc32c: string;
    generation: string;
    metageneration: string;
    storageClass: string;
    customMetadata?: {
      originalName: string;
      uploadedAt: string;
      documentType: string;
    };
  }[];
  signedUrls: {
    [filename: string]: string;
  };
}

export interface PropiedadImage {
  id: string;
  propiedad_id: string;
  url: string;
  nombre_archivo: string;
  tipo_imagen: string;
  orden: number | null;
  created_at: string;
  updated_at: string;
  descripcion?: string | null;
}

export interface PropertyImagesResponse {
  files: PropiedadImage[];
  signedUrl?: string | null;
}
