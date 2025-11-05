import axios from 'axios';
import type { Oportunidad, OportunidadCreate } from '../../types/oportunidad';

// get all oportunidades
export const getOportunidades = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/oportunidades`);
    return response.data.data as Oportunidad[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getOportunidadesByEmpresa = async (empresaId: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/empresas/${empresaId}/oportunidades`
    );
    return response.data.data as Oportunidad[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// create oportunidad
export const createOportunidad = async (oportunidad: OportunidadCreate) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/oportunidades`, oportunidad);
    return response.data.data as Oportunidad;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      throw new Error('Ya existe una oportunidad con este inquilino y propiedad');
    }
    throw error;
  }
};
