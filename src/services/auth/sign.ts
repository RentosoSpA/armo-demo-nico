import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const authLogin = async (idToken: string) => {
  try {
    const body = { idToken: idToken };
    const response = await axios.post(`${API_URL}/auth/login`, body, {
      withCredentials: true, // Include cookies in the request
    });
    return response.data;
  } catch (error) {
    console.error('Auth login failed:', error);
    throw error;
  }
};

export const authLogout = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/logout`,
      {},
      {
        withCredentials: true, // Include cookies in the request
      }
    );

    return response.data;
  } catch (error) {
    console.error('Auth logout failed:', error);
    throw error;
  }
};

export const validateSession = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/session`, {
      withCredentials: true, // Include cookies in the request
    });

    return response.data;
  } catch (error) {
    console.error('Session validation failed:', error);
    return false;
  }
};
