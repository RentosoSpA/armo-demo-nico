import { simulateDelay, generateId } from './mockData';

// Mock implementation of multimedia services (documentos and images)

// Mock documents in GCP_FILES format
const mockGCPFiles = {
  files: [
    {
      name: 'Contrato_Arriendo_Casa_Providencia.pdf',
      fullPath: 'documents/contratos/Contrato_Arriendo_Casa_Providencia.pdf',
      size: 2048576,
      contentType: 'application/pdf',
      timeCreated: new Date().toISOString(),
      updated: new Date().toISOString(),
      etag: 'mock-etag-1',
      md5Hash: 'mock-md5-hash-1',
      crc32c: 'mock-crc32c-1',
      generation: '1',
      metageneration: '1',
      storageClass: 'STANDARD',
      customMetadata: {
        originalName: 'Contrato_Arriendo_Casa_Providencia.pdf',
        uploadedAt: new Date().toISOString(),
        documentType: 'contract'
      }
    },
    {
      name: 'Evaluacion_Crediticia_Cliente_A.pdf',
      fullPath: 'documents/Oportunidades/Evaluacion_Crediticia_Cliente_A.pdf',
      size: 1536000,
      contentType: 'application/pdf',
      timeCreated: new Date().toISOString(),
      updated: new Date().toISOString(),
      etag: 'mock-etag-2',
      md5Hash: 'mock-md5-hash-2',
      crc32c: 'mock-crc32c-2',
      generation: '1',
      metageneration: '1',
      storageClass: 'STANDARD',
      customMetadata: {
        originalName: 'Evaluacion_Crediticia_Cliente_A.pdf',
        uploadedAt: new Date().toISOString(),
        documentType: 'evaluation'
      }
    }
  ],
  signedUrls: {
    'Contrato_Arriendo_Casa_Providencia.pdf': 'https://placehold.co/400x600/pdf?text=Contract+PDF',
    'Evaluacion_Crediticia_Cliente_A.pdf': 'https://placehold.co/400x600/pdf?text=Credit+Report+PDF'
  }
};

// Mock images
const mockImages = [
  {
    id: '1',
    url: 'https://placehold.co/800x600?text=Property+Image+1',
    alt: 'Sala principal',
    title: 'Sala principal'
  },
  {
    id: '2',
    url: 'https://placehold.co/800x600?text=Property+Image+2',
    alt: 'Cocina equipada',
    title: 'Cocina equipada'
  },
  {
    id: '3',
    url: 'https://placehold.co/800x600?text=Property+Image+3',
    alt: 'Dormitorio principal',
    title: 'Dormitorio principal'
  },
  {
    id: '4',
    url: 'https://placehold.co/800x600?text=Property+Image+4',
    alt: 'Baño completo',
    title: 'Baño completo'
  }
];

// Documents service
export const getDocuments = async () => {
  await simulateDelay();
  return mockGCPFiles;
};

export const uploadDocument = async (folderPath: string, file: File, metadata?: any) => {
  await simulateDelay();
  const newDocument = {
    name: file.name,
    fullPath: `${folderPath}/${file.name}`,
    size: file.size,
    contentType: file.type,
    timeCreated: new Date().toISOString(),
    updated: new Date().toISOString(),
    etag: `mock-etag-${generateId()}`,
    md5Hash: `mock-md5-${generateId()}`,
    crc32c: `mock-crc32c-${generateId()}`,
    generation: '1',
    metageneration: '1',
    storageClass: 'STANDARD',
    customMetadata: {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
      documentType: metadata?.documentType || 'document'
    }
  };

  const signedUrl = `https://placehold.co/400x600/pdf?text=${encodeURIComponent(file.name)}`;

  mockGCPFiles.files.push(newDocument);
  (mockGCPFiles.signedUrls as Record<string, string>)[file.name] = signedUrl;

  return mockGCPFiles;
};

export const deleteDocument = async (fileName: string) => {
  await simulateDelay();
  const index = mockGCPFiles.files.findIndex(file => file.name === fileName);
  if (index === -1) {
    throw new Error(`Document with name ${fileName} not found`);
  }
  mockGCPFiles.files.splice(index, 1);
  delete (mockGCPFiles.signedUrls as Record<string, string>)[fileName];
  return { success: true };
};

// Images service
export const getImages = async (_propiedadId?: string) => {
  await simulateDelay();
  return mockImages;
};

export const uploadImage = async (file: File, metadata?: any) => {
  await simulateDelay();
  const newImage = {
    id: generateId(),
    url: `https://placehold.co/800x600?text=${encodeURIComponent(file.name)}`,
    alt: file.name,
    title: file.name,
    uploadedAt: new Date().toISOString(),
    ...metadata
  };
  mockImages.push(newImage);
  return newImage;
};

export const deleteImage = async (id: string) => {
  await simulateDelay();
  const index = mockImages.findIndex(img => img.id === id);
  if (index === -1) {
    throw new Error(`Image with id ${id} not found`);
  }
  mockImages.splice(index, 1);
  return { success: true };
};