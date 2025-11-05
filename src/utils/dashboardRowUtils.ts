import type { Widget } from '../types/dashboard-layout';
import type { WidgetRow } from '../types/dashboard-rows';

/**
 * Calcula el ancho de cada widget en una fila basado en la cantidad
 */
export const calculateWidgetWidth = (widgetCount: number): string => {
  if (widgetCount === 0) return '100%';
  return `${(100 / widgetCount).toFixed(2)}%`;
};

/**
 * Organiza widgets en filas basándose en su orden y posición
 * Si los widgets ya tienen un rowId, los agrupa por ese rowId
 * Si no, crea filas automáticamente basándose en los tamaños
 * @param widgets - Lista de widgets a organizar
 * @param maxWidgetsPerRow - Máximo de widgets por fila (2, 3, 4 o 6). Default: 4
 */

/**
 * Determina si un widget requiere un ancho mínimo de 2 columnas
 * Gráficas complejas y resúmenes necesitan más espacio para verse bien
 */
export const requiresMinTwoColumns = (widgetType: string): boolean => {
  const twoColumnTypes = [
    'property-characteristics',
    'visit-characteristics', 
    'metrics-by-month',
    'opportunities-by-stage',
    'osos-brigada',
    'live-activity',
    'executive-summary',
    'alerts-notifications',
    'upcoming-events'
  ];
  return twoColumnTypes.includes(widgetType);
};

/**
 * Calcula cuántas "unidades de columna" ocupa un widget
 * Widgets grandes ocupan 2 unidades, widgets pequeños ocupan 1
 */
export const getWidgetColumnSpan = (widget: Widget): number => {
  if (widget.size === 'full') return 999; // Ocupar fila completa
  if (requiresMinTwoColumns(widget.type)) return 2;
  return 1;
};

export const organizeWidgetsIntoRows = (widgets: Widget[], maxWidgetsPerRow: number = 4): WidgetRow[] => {
  const sortedWidgets = [...widgets].sort((a, b) => a.position - b.position);
  const rows: WidgetRow[] = [];
  
  let currentRow: WidgetRow = {
    id: `row-${Date.now()}-0`,
    widgets: []
  };
  let currentRowColumnCount = 0; // Contador de "unidades de columna" en la fila actual
  
  sortedWidgets.forEach((widget, index) => {
    const widgetColumnSpan = getWidgetColumnSpan(widget);
    
    // Si el widget tiene tamaño 'full', va solo en su fila
    if (widget.size === 'full') {
      // Si la fila actual tiene widgets, la guardamos
      if (currentRow.widgets.length > 0) {
        rows.push(currentRow);
      }
      // Crear fila para el widget full
      rows.push({
        id: `row-${Date.now()}-${rows.length}`,
        widgets: [widget.id]
      });
      // Crear nueva fila para los siguientes
      currentRow = {
        id: `row-${Date.now()}-${rows.length}`,
        widgets: []
      };
      currentRowColumnCount = 0;
    } else {
      // Verificar si añadir este widget excedería el límite de columnas
      if (currentRowColumnCount + widgetColumnSpan > maxWidgetsPerRow) {
        // Cerrar fila actual y crear nueva
        if (currentRow.widgets.length > 0) {
          rows.push(currentRow);
        }
        currentRow = {
          id: `row-${Date.now()}-${rows.length}`,
          widgets: [widget.id]
        };
        currentRowColumnCount = widgetColumnSpan;
      } else {
        // Agregar el widget a la fila actual
        currentRow.widgets.push(widget.id);
        currentRowColumnCount += widgetColumnSpan;
      }
    }
  });
  
  // Agregar la última fila si tiene widgets
  if (currentRow.widgets.length > 0) {
    rows.push(currentRow);
  }
  
  return rows;
};

/**
 * Inserta un widget en una fila específica en una posición determinada
 */
export const insertWidgetIntoRow = (
  rows: WidgetRow[],
  widgetId: string,
  targetRowIndex: number,
  position?: number
): WidgetRow[] => {
  const newRows = rows.map((row, index) => {
    // Remover el widget de cualquier fila donde esté
    const filteredWidgets = row.widgets.filter(id => id !== widgetId);
    
    // Si es la fila target, insertar el widget
    if (index === targetRowIndex) {
      const insertPosition = position !== undefined 
        ? Math.min(position, filteredWidgets.length)
        : filteredWidgets.length;
      
      filteredWidgets.splice(insertPosition, 0, widgetId);
    }
    
    return {
      ...row,
      widgets: filteredWidgets
    };
  });
  
  // Filtrar filas vacías
  return newRows.filter(row => row.widgets.length > 0);
};

/**
 * Crea una nueva fila después del índice especificado
 */
export const createNewRowBetween = (
  rows: WidgetRow[],
  afterRowIndex: number,
  widgetId?: string
): WidgetRow[] => {
  const newRow: WidgetRow = {
    id: `row-${Date.now()}-${afterRowIndex + 1}`,
    widgets: widgetId ? [widgetId] : []
  };
  
  const newRows = [...rows];
  newRows.splice(afterRowIndex + 1, 0, newRow);
  
  return newRows;
};

/**
 * Remueve un widget de todas las filas
 */
export const removeWidgetFromRows = (
  rows: WidgetRow[],
  widgetId: string
): WidgetRow[] => {
  return rows
    .map(row => ({
      ...row,
      widgets: row.widgets.filter(id => id !== widgetId)
    }))
    .filter(row => row.widgets.length > 0);
};

/**
 * Encuentra el índice de la fila que contiene un widget
 */
export const findRowIndexForWidget = (
  rows: WidgetRow[],
  widgetId: string
): number => {
  return rows.findIndex(row => row.widgets.includes(widgetId));
};

/**
 * Mueve un widget de una fila a otra
 */
export const moveWidgetBetweenRows = (
  rows: WidgetRow[],
  widgetId: string,
  fromRowIndex: number,
  toRowIndex: number,
  position?: number
): WidgetRow[] => {
  // Remover de la fila origen
  let newRows = rows.map((row, index) => {
    if (index === fromRowIndex) {
      return {
        ...row,
        widgets: row.widgets.filter(id => id !== widgetId)
      };
    }
    return row;
  });
  
  // Insertar en la fila destino
  newRows = newRows.map((row, index) => {
    if (index === toRowIndex) {
      const insertPosition = position !== undefined 
        ? Math.min(position, row.widgets.length)
        : row.widgets.length;
      
      const newWidgets = [...row.widgets];
      newWidgets.splice(insertPosition, 0, widgetId);
      
      return {
        ...row,
        widgets: newWidgets
      };
    }
    return row;
  });
  
  // Filtrar filas vacías
  return newRows.filter(row => row.widgets.length > 0);
};

/**
 * Convierte las filas de vuelta a una lista ordenada de widgets
 */
export const flattenRowsToWidgets = (
  rows: WidgetRow[],
  allWidgets: Widget[]
): Widget[] => {
  const orderedWidgetIds: string[] = [];
  
  rows.forEach(row => {
    row.widgets.forEach(widgetId => {
      orderedWidgetIds.push(widgetId);
    });
  });
  
  return orderedWidgetIds
    .map(id => allWidgets.find(w => w.id === id))
    .filter(Boolean) as Widget[];
};
