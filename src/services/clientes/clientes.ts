import type { ProfileCreate } from '../../types/profile';

const BackendUrl= import.meta.env.BACKENDURL || 'http://localhost:3000';

export const createUser = async (profile: ProfileCreate) => {
  const response = await fetch(`${BackendUrl}/api/v1/prospectos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error en el registro');
  }

  // Éxito
  const data = await response.json();
  console.log('Usuario creado con éxito:', data);
};

export const getAllUsers = async () => {
  const response = await fetch(`${BackendUrl}/api/v1/prospectos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener los perfiles');
  }

  const data = await response.json();
  console.log(data);
};

export const getUserById = async (uid: string) => {
  const response = await fetch(`${BackendUrl}/api/v1/prospectos/${uid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener el perfil');
  }

  const profile = await response.json();
  console.log(profile);
};

export const updateUser = async (uid: string, profile: ProfileCreate) => {
  const response = await fetch(`${BackendUrl}/api/v1/prospectos/${uid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profile),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al actualizar el perfil');
  }

  const result = await response.json();
  console.log(result);
};

export const deleteUser = async (uid: string) => {
  const response = await fetch(`${BackendUrl}/api/v1/prospectos/${uid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al eliminar el perfil');
  }

  console.log('Perfil eliminado exitosamente');
};
