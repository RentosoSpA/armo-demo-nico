import type { DashboardLayout } from '../../types/dashboard-layout';

const STORAGE_KEY = 'dashboard_layout_global';

// Simular latencia de red
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Guarda el layout GLOBAL en localStorage (todos los usuarios comparten el mismo)
 * NO requiere userId - el layout es único para toda la aplicación
 */
export const saveDashboardLayoutMock = async (layout: DashboardLayout): Promise<void> => {
  await simulateDelay(300);
  
  const updatedLayout = {
    ...layout,
    lastUpdated: new Date().toISOString()
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLayout));
  
  console.log('✅ [dashboardLayoutMock] Dashboard layout GLOBAL guardado', {
    widgetCount: layout.widgets.length,
    rowCount: layout.rows?.length || 0,
    lastUpdated: updatedLayout.lastUpdated
  });
};

/**
 * Carga el layout GLOBAL desde localStorage
 * @returns Layout guardado o null si no existe
 */
export const loadDashboardLayoutMock = async (): Promise<DashboardLayout | null> => {
  await simulateDelay(200);
  
  const stored = localStorage.getItem(STORAGE_KEY);
  const layout = stored ? JSON.parse(stored) : null;
  
  if (layout) {
    console.log('📦 [dashboardLayoutMock] Dashboard layout GLOBAL cargado', {
      widgetCount: layout.widgets?.length || 0,
      rowCount: layout.rows?.length || 0,
      lastUpdated: layout.lastUpdated
    });
  } else {
    console.log('ℹ️ [dashboardLayoutMock] No se encontró layout guardado (se usará el por defecto)');
  }
  
  return layout;
};

/**
 * Elimina el layout GLOBAL desde localStorage
 */
export const deleteDashboardLayoutMock = async (): Promise<void> => {
  await simulateDelay(100);
  
  const existed = localStorage.getItem(STORAGE_KEY) !== null;
  localStorage.removeItem(STORAGE_KEY);
  
  console.log('🗑️ [dashboardLayoutMock] Dashboard layout GLOBAL eliminado', { existed });
};

/**
 * Helper para debugging: Obtiene el layout global
 */
export const getGlobalLayoutMock = (): DashboardLayout | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const layout = stored ? JSON.parse(stored) : null;
  console.log('📋 [dashboardLayoutMock] Layout global actual:', layout ? 'existe' : 'no existe');
  return layout;
};

/**
 * Helper para debugging: Limpia el layout global
 */
export const clearGlobalLayoutMock = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  console.log('🧹 [dashboardLayoutMock] Layout global limpiado');
};
