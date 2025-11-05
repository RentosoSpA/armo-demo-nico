import axios from 'axios';
import type { Propietario } from '../../types/propietario';

// get all propietarios
export const getPropietarios = async (empresaId: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/propietarios/empresa/${empresaId}`
    );
    return response.data.data as Propietario[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// get propietario by id
export const getPropietarioById = async (id: string) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/propietarios/${id}`);
    return response.data.data as Propietario;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// create new propietario
export const createPropietario = async (
  propietario: Omit<Propietario, 'id' | 'createdAt' | 'updatedAt' | 'empresa' | 'propiedades'>
) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/propietarios`, propietario);
    return response.data.data as Propietario;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// update propietario
export const updatePropietario = async (
  id: string,
  propietario: Partial<
    Omit<Propietario, 'id' | 'createdAt' | 'updatedAt' | 'empresa' | 'propiedades'>
  >
) => {
  try {
    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/propietarios/${id}`,
      propietario
    );
    return response.data.data as Propietario;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
