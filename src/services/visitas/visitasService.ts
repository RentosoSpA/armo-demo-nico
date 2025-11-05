import axios from 'axios';
import type { Visita, VisitaCreate, VisitaUpdate } from '../../types/visita';

// get all visitas
export const getVisitas = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/visitas`);
    return response.data.data as Visita[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// create new visita
export const createVisita = async (visitaData: VisitaCreate) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/visitas`, visitaData);
    return response.data.data as Visita;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      throw new Error('Ya existe una visita con este prospecto y propiedad');
    }
    throw error;
  }
};

// update visita
export const updateVisita = async (visitaData: VisitaUpdate) => {
  try {
    const payload: Partial<VisitaUpdate> = {};
    if (visitaData.estado !== undefined) payload.estado = visitaData.estado;
    if (visitaData.fecha !== undefined) payload.fecha = visitaData.fecha;
    if (visitaData.horaInicio !== undefined) payload.horaInicio = visitaData.horaInicio;
    if (visitaData.horaFin !== undefined) payload.horaFin = visitaData.horaFin;

    const response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/visitas/${visitaData.id}`,
      payload
    );
    return response.data.data as Visita;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// delete visita
export const deleteVisita = async (id: string) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/visitas/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
