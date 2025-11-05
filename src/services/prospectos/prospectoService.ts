import axios from 'axios';
import type { Prospecto, ProspectoCreate } from '../../types/profile';

// get all prospectos
export const getProspectos = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/prospectos`);
    return response.data.data as Prospecto[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProspectoById = async (id: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/prospectos/${id}`);
    return response.data.data as Prospecto;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createProspecto = async (prospecto: ProspectoCreate) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/prospectos`, prospecto);
    return response.data.data as Prospecto;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateProspecto = async (id: string, updates: Partial<Prospecto>) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/prospectos/${id}`, updates);
    return response.data.data as Prospecto;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
