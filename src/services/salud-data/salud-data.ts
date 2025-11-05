import axios from 'axios';
import type { SaludData, DashboardData, DashboardResponse } from '../../types/salud-data';

// Simple cache for dashboard data
const dashboardCache = new Map<string, { data: DashboardResponse; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to clear cache (useful for forced refresh)
export const clearDashboardCache = () => {
  dashboardCache.clear();
};

export const getSaludData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/salud-db`);
    return response.data as SaludData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getDashboardData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/salud-db/dashboard`);
    return response.data.data as DashboardData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getNewDashboardData = async (empresaId: string) => {
  const cacheKey = `dashboard_${empresaId}`;
  const now = Date.now();

  console.log('🔍 [Dashboard API] Starting getNewDashboardData call');
  console.log('🔍 [Dashboard API] Empresa ID:', empresaId);
  console.log('🔍 [Dashboard API] API URL:', import.meta.env.VITE_API_URL);
  console.log('🔍 [Dashboard API] Full endpoint:', `${import.meta.env.VITE_API_URL}/dashboard/empresa/${empresaId}`);

  // Check cache first
  const cached = dashboardCache.get(cacheKey);
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    console.log('🔍 [Dashboard API] Returning cached data');
    console.log('🔍 [Dashboard API] Cached data:', cached.data);
    return cached.data;
  }

  console.log('🔍 [Dashboard API] Cache miss or expired, making API call');

  try {
    console.log('🔍 [Dashboard API] Making axios request...');
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/dashboard/empresa/${empresaId}`
    );

    console.log('🔍 [Dashboard API] API Response received');
    console.log('🔍 [Dashboard API] Response status:', response.status);
    console.log('🔍 [Dashboard API] Response headers:', response.headers);
    console.log('🔍 [Dashboard API] Response data:', response.data);

    const data = response.data as DashboardResponse;

    // Cache the result
    dashboardCache.set(cacheKey, { data, timestamp: now });

    console.log('🔍 [Dashboard API] Data cached successfully');
    console.log('🔍 [Dashboard API] Returning data:', data);

    return data;
  } catch (error) {
    console.error('❌ [Dashboard API] Error in getNewDashboardData:', error);

    if (axios.isAxiosError(error)) {
      console.error('❌ [Dashboard API] Axios error details:');
      console.error('❌ [Dashboard API] Status:', error.response?.status);
      console.error('❌ [Dashboard API] Status text:', error.response?.statusText);
      console.error('❌ [Dashboard API] Response data:', error.response?.data);
      console.error('❌ [Dashboard API] Request config:', error.config);
    }

    throw error;
  }
};
