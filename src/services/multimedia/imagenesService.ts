import axios from 'axios';
import type { GCP_FILES } from '../../types/document';

export const uploadImage = async (folderPath: string, file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/gcp/images/upload?folderPath=${folderPath}`,
    formData
  );
  return response.data.data;
};

export const getImages = async (folderPath: string) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/gcp/images/list?folderPath=${folderPath}`
  );
  return response.data.data as GCP_FILES;
};

export const getImage = async (propertyId: string) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/gcp/images/first/${propertyId}`
  );
  return response.data.data as { files: []; signedUrl: string };
};
