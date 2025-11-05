import { create } from 'zustand';
import type { Widget, DashboardLayout } from '../types/dashboard-layout';
import type { WidgetRow } from '../types/dashboard-rows';
import { 
  saveDashboardLayoutMock as saveDashboardLayout, 
  loadDashboardLayoutMock as loadDashboardLayout, 
  deleteDashboardLayoutMock as deleteDashboardLayout 
} from '../services/mock/dashboardLayoutMock';
import { getDefaultLayout } from '../config/defaultDashboardLayout';
import { 
  organizeWidgetsIntoRows, 
  flattenRowsToWidgets,
  insertWidgetIntoRow,
  createNewRowBetween,
  moveWidgetBetweenRows
} from '../utils/dashboardRowUtils';

interface DashboardLayoutState {
  widgets: Widget[];
  rows: WidgetRow[];
  isEditMode: boolean;
  gridColumns: number;
  compactMode: boolean;
  isLoading: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  
  // Actions
  addWidget: (widget: Omit<Widget, 'id' | 'position'>) => string;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  reorderWidgets: (newOrder: Widget[]) => void;
  toggleWidgetVisibility: (widgetId: string) => void;
  toggleEditMode: () => void;
  setGridColumns: (columns: number) => void;
  setCompactMode: (compact: boolean) => void;
  loadLayout: () => Promise<void>;
  saveLayout: (force?: boolean) => Promise<{ success: boolean; message: string }>;
  resetLayout: () => Promise<void>;
  markAsUnsaved: () => void;
  
  // Nuevas acciones para filas
  reorganizeRows: () => void;
  moveWidgetToRow: (widgetId: string, targetRowIndex: number, position?: number) => void;
  createNewRow: (afterRowIndex: number, widgetId?: string) => void;
  updateRows: (newRows: WidgetRow[]) => void;
}

export const useDashboardLayoutStore = create<DashboardLayoutState>((set, get) => ({
  widgets: [],
  rows: [],
  isEditMode: false,
  gridColumns: 4,
  compactMode: false,
  isLoading: false,
  isSaving: false,
  hasUnsavedChanges: false,

  /**
   * Añade un nuevo widget al dashboard
   * IMPORTANTE: Automáticamente reorganiza las filas para incluir el nuevo widget
   * @returns El ID del widget creado
   */
  addWidget: (widget) => {
    const state = get();
    const newWidget: Widget = {
      ...widget,
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: state.widgets.length,
    };
    
    const updatedWidgets = [...state.widgets, newWidget];
    const newRows = organizeWidgetsIntoRows(updatedWidgets, state.gridColumns);
    
    console.log('✅ Widget añadido:', newWidget.type, newWidget.id);
    
    set({ 
      widgets: updatedWidgets,
      rows: newRows,
      hasUnsavedChanges: true 
    });
    
    return newWidget.id;
  },

  /**
   * Elimina un widget del dashboard
   * IMPORTANTE: Automáticamente reorganiza las filas para eliminar espacios vacíos
   */
  removeWidget: (widgetId) => {
    const state = get();
    const widgetToRemove = state.widgets.find(w => w.id === widgetId);
    
    const updatedWidgets = state.widgets
      .filter(w => w.id !== widgetId)
      .map((w, index) => ({ ...w, position: index }));
    
    const newRows = organizeWidgetsIntoRows(updatedWidgets, state.gridColumns);
    
    console.log('🗑️ Widget eliminado:', widgetToRemove?.type, widgetId);
    
    set({ 
      widgets: updatedWidgets,
      rows: newRows,
      hasUnsavedChanges: true 
    });
  },

  updateWidget: (widgetId, updates) => {
    const state = get();
    const updatedWidgets = state.widgets.map(w =>
      w.id === widgetId ? { ...w, ...updates } : w
    );
    set({ 
      widgets: updatedWidgets,
      hasUnsavedChanges: true 
    });
  },

  reorderWidgets: (newOrder) => {
    const state = get();
    const reorderedWidgets = newOrder.map((w, index) => ({
      ...w,
      position: index
    }));
    const newRows = organizeWidgetsIntoRows(reorderedWidgets, state.gridColumns);
    set({ 
      widgets: reorderedWidgets,
      rows: newRows,
      hasUnsavedChanges: true 
    });
  },

  /**
   * Cambia la visibilidad de un widget
   * IMPORTANTE: Reorganiza las filas considerando solo widgets visibles
   */
  toggleWidgetVisibility: (widgetId) => {
    const state = get();
    const updatedWidgets = state.widgets.map(w =>
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    );
    
    const widget = updatedWidgets.find(w => w.id === widgetId);
    console.log('👁️ Visibilidad cambiada:', widget?.type, widget?.visible);
    
    // Reorganizar filas solo con widgets visibles
    const visibleWidgets = updatedWidgets.filter(w => w.visible);
    const newRows = organizeWidgetsIntoRows(visibleWidgets, state.gridColumns);
    
    set({ 
      widgets: updatedWidgets,
      rows: newRows,
      hasUnsavedChanges: true 
    });
  },

  toggleEditMode: () => {
    set(state => ({ isEditMode: !state.isEditMode }));
  },

  setGridColumns: (columns) => {
    const state = get();
    // Reorganizar widgets con el nuevo número de columnas
    const newRows = organizeWidgetsIntoRows(state.widgets, columns);
    set({ 
      gridColumns: columns, 
      rows: newRows,
      hasUnsavedChanges: true 
    });
  },

  setCompactMode: (compact) => {
    set({ compactMode: compact, hasUnsavedChanges: true });
  },

  /**
   * Carga el layout GLOBAL desde el almacenamiento
   * Si no existe, carga el layout por defecto
   * NO requiere userId - todos los usuarios comparten el mismo layout
   */
  loadLayout: async () => {
    console.log('📥 [dashboardLayoutStore] Cargando layout GLOBAL');
    set({ isLoading: true });
    
    try {
      const layout = await loadDashboardLayout();
      if (layout) {
        // Si el layout tiene rows, usarlas; si no, migrar automáticamente
        const rows = layout.rows || organizeWidgetsIntoRows(layout.widgets, layout.gridColumns || 4);
        
        console.log('✅ [dashboardLayoutStore] Layout GLOBAL cargado desde storage', {
          widgetCount: layout.widgets.length,
          rowCount: rows.length,
          gridColumns: layout.gridColumns,
          lastUpdated: layout.lastUpdated
        });
        
        set({
          widgets: layout.widgets,
          rows: rows,
          gridColumns: layout.gridColumns,
          compactMode: layout.compactMode,
          hasUnsavedChanges: false,
          isLoading: false
        });
      } else {
        // No layout found, use default
        console.log('ℹ️ [dashboardLayoutStore] No se encontró layout guardado, usando valores por defecto');
        const defaultLayout = getDefaultLayout('global');
        const defaultRows = organizeWidgetsIntoRows(defaultLayout.widgets, defaultLayout.gridColumns);
        set({
          widgets: defaultLayout.widgets,
          rows: defaultRows,
          gridColumns: defaultLayout.gridColumns,
          compactMode: defaultLayout.compactMode,
          hasUnsavedChanges: false,
          isLoading: false
        });
      }
    } catch (error) {
      console.error('❌ [dashboardLayoutStore] Error loading dashboard layout:', error);
      // Fallback to default layout
      const defaultLayout = getDefaultLayout('global');
      const defaultRows = organizeWidgetsIntoRows(defaultLayout.widgets, defaultLayout.gridColumns);
      set({
        widgets: defaultLayout.widgets,
        rows: defaultRows,
        gridColumns: defaultLayout.gridColumns,
        compactMode: defaultLayout.compactMode,
        hasUnsavedChanges: false,
        isLoading: false
      });
    }
  },

  /**
   * Guarda el layout GLOBAL actual en el almacenamiento
   * NO requiere userId - todos los usuarios comparten el mismo layout
   * @param force - Si es true, guarda incluso sin cambios pendientes
   * @returns Objeto con success y message
   */
  saveLayout: async (force = false) => {
    const state = get();
    
    if (!force && !state.hasUnsavedChanges) {
      console.log('ℹ️ [dashboardLayoutStore] No hay cambios sin guardar, omitiendo guardado');
      return { success: true, message: 'No hay cambios para guardar' };
    }

    console.log('💾 [dashboardLayoutStore] Guardando layout GLOBAL', {
      force,
      widgetCount: state.widgets.length,
      rowCount: state.rows.length,
      gridColumns: state.gridColumns,
      compactMode: state.compactMode
    });

    set({ isSaving: true });
    try {
      const layout: DashboardLayout = {
        userId: 'global',
        widgets: state.widgets,
        rows: state.rows,
        gridColumns: state.gridColumns,
        compactMode: state.compactMode,
        lastUpdated: new Date().toISOString()
      };
      await saveDashboardLayout(layout);
      set({ hasUnsavedChanges: false, isSaving: false });
      
      console.log('✅ [dashboardLayoutStore] Layout GLOBAL guardado exitosamente');
      return { success: true, message: 'Layout guardado exitosamente' };
    } catch (error) {
      console.error('❌ [dashboardLayoutStore] Error saving dashboard layout:', error);
      set({ isSaving: false });
      return { success: false, message: 'Error al guardar el layout' };
    }
  },

  /**
   * Resetea el layout GLOBAL a los valores por defecto
   * Elimina el layout guardado del almacenamiento
   * NO requiere userId - todos los usuarios comparten el mismo layout
   */
  resetLayout: async () => {
    console.log('🔄 [dashboardLayoutStore] Reseteando layout GLOBAL a valores por defecto');
    set({ isLoading: true });
    
    try {
      await deleteDashboardLayout();
      const defaultLayout = getDefaultLayout('global');
      const defaultRows = organizeWidgetsIntoRows(defaultLayout.widgets, defaultLayout.gridColumns);
      
      console.log('✅ [dashboardLayoutStore] Layout GLOBAL reseteado exitosamente', {
        widgetCount: defaultLayout.widgets.length,
        rowCount: defaultRows.length
      });
      
      set({
        widgets: defaultLayout.widgets,
        rows: defaultRows,
        gridColumns: defaultLayout.gridColumns,
        compactMode: defaultLayout.compactMode,
        hasUnsavedChanges: false,
        isLoading: false
      });
    } catch (error) {
      console.error('❌ [dashboardLayoutStore] Error resetting dashboard layout:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  markAsUnsaved: () => {
    set({ hasUnsavedChanges: true });
  },
  
  // Nuevas acciones para sistema de filas
  reorganizeRows: () => {
    const state = get();
    const newRows = organizeWidgetsIntoRows(state.widgets, state.gridColumns);
    set({ rows: newRows, hasUnsavedChanges: true });
  },
  
  moveWidgetToRow: (widgetId, targetRowIndex, position) => {
    const state = get();
    const newRows = insertWidgetIntoRow(state.rows, widgetId, targetRowIndex, position);
    const reorderedWidgets = flattenRowsToWidgets(newRows, state.widgets);
    set({ 
      rows: newRows,
      widgets: reorderedWidgets,
      hasUnsavedChanges: true 
    });
  },
  
  createNewRow: (afterRowIndex, widgetId) => {
    const state = get();
    let newRows = state.rows;
    
    // Si se proporciona un widgetId, removerlo de su fila actual
    if (widgetId) {
      newRows = newRows.map(row => ({
        ...row,
        widgets: row.widgets.filter(id => id !== widgetId)
      })).filter(row => row.widgets.length > 0);
    }
    
    // Crear la nueva fila
    newRows = createNewRowBetween(newRows, afterRowIndex, widgetId);
    
    const reorderedWidgets = flattenRowsToWidgets(newRows, state.widgets);
    set({ 
      rows: newRows,
      widgets: reorderedWidgets,
      hasUnsavedChanges: true 
    });
  },
  
  updateRows: (newRows) => {
    const state = get();
    const reorderedWidgets = flattenRowsToWidgets(newRows, state.widgets);
    set({ 
      rows: newRows,
      widgets: reorderedWidgets,
      hasUnsavedChanges: true 
    });
  }
}));
