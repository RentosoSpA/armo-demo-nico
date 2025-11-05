import axios from 'axios';
import type { GCP_FILES } from '../../types/document';

export const uploadDocument = async (folderPath: string, file: File) => {
  const formData = new FormData();
  formData.append('document', file);
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/gcp/documents/upload?folderPath=${folderPath}`,
    formData
  );
  return response.data.data;
};

export const getDocuments = async (folderPath: string) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/gcp/documents/list?folderPath=${folderPath}`
  );
  return response.data.data as GCP_FILES;
};
