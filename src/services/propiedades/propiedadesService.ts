import axios from 'axios';
import type { Propiedad, PropiedadCreate } from '../../types/propiedad';

// get all propiedades
export const getPropiedades = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/propiedades`);
    return response.data.data as Propiedad[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get propiedad by id
export const getPropiedadById = async (id: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/propiedades/${id}`);
    return response.data.data as Propiedad;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get propiedades by empresa
export const getPropiedadesByEmpresa = async (empresaId: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/empresas/${empresaId}/propiedades`
    );
    console.log('Fetched propiedades:', response.data.data);
    return response.data.data as Propiedad[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// create new propiedad
export const createPropiedad = async (propiedad: PropiedadCreate) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/propiedades`, propiedad);
    return response.data.data as Propiedad;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// update propiedad
export const updatePropiedad = async (id: string, propiedad: Partial<PropiedadCreate>) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/propiedades/${id}`,
      propiedad
    );
    return response.data.data as Propiedad;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
