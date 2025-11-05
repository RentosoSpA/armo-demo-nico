import React, { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  rectIntersection,
  pointerWithin,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { App } from 'antd';
import type { Widget } from '../../types/dashboard-layout';
import type { WidgetRow } from '../../types/dashboard-rows';
import DraggableWidget from './DraggableWidget';
import { useDashboardLayoutStore } from '../../store/dashboardLayoutStore';
import { 
  calculateWidgetWidth, 
  findRowIndexForWidget, 
  moveWidgetBetweenRows,
  getWidgetColumnSpan
} from '../../utils/dashboardRowUtils';

interface DroppableGridProps {
  widgets: Widget[];
  rows: WidgetRow[];
  isEditMode: boolean;
  onReorder: (newOrder: Widget[]) => void;
  onRowChange?: (newRows: WidgetRow[]) => void;
  renderWidget: (widget: Widget) => React.ReactNode;
}

// Componente DroppableZone independiente
const DroppableZone = React.memo<{ 
  id: string; 
  rowIndex: number; 
  isActive: boolean 
}>(({ id, rowIndex, isActive }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      type: 'drop-zone',
      rowIndex: rowIndex
    }
  });

  return (
    <div
      ref={setNodeRef}
      id={id}
      className={`row-drop-zone ${isActive || isOver ? 'active' : ''}`}
      data-insert-after={rowIndex}
    />
  );
});

DroppableZone.displayName = 'DroppableZone';

// Componente InsertionIndicator
const InsertionIndicator: React.FC<{ 
  rowIndex: number; 
  side: 'before' | 'after'; 
  targetWidgetId?: string;
}> = ({ rowIndex, side, targetWidgetId }) => {
  return (
    <div 
      className={`insertion-indicator insertion-indicator--${side}`}
      data-row={rowIndex}
      data-target={targetWidgetId}
    />
  );
};

/**
 * DroppableGrid - Sistema de drag & drop para widgets del dashboard
 * 
 * IMPORTANTE: Manejo de drop zones
 * - Drop zones entre filas: Crean una NUEVA fila en esa posición
 * - Drop sobre un widget: Inserta en la fila EXISTENTE (si hay espacio)
 * - Si no hay espacio suficiente, automáticamente crea nueva fila
 * 
 * BUG FIX (2025-01-22): 
 * - Las drop zones ahora tienen altura fija para prevenir scroll infinito
 * - Los mensajes de feedback usan position: fixed para no afectar el layout
 */
const DroppableGrid: React.FC<DroppableGridProps> = ({
  widgets,
  rows,
  isEditMode,
  onReorder,
  onRowChange,
  renderWidget
}) => {
  const { message } = App.useApp();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dropZoneActive, setDropZoneActive] = useState<string | null>(null);
  const [insertionIndicator, setInsertionIndicator] = useState<{
    rowIndex: number;
    side: 'before' | 'after';
    targetWidgetId?: string;
  } | null>(null);
  
  const { gridColumns } = useDashboardLayoutStore();
  
  // Memoizar lista de widgets visibles
  const visibleWidgets = useMemo(() => {
    return widgets.filter(w => w.visible);
  }, [widgets]);
  
  // Memoizar IDs de widgets visibles
  const allWidgetIds = useMemo(() => {
    return visibleWidgets.map(w => w.id);
  }, [visibleWidgets]);
  
  // Memoizar widget activo
  const activeWidget = useMemo(() => {
    return activeId ? widgets.find(w => w.id === activeId) : null;
  }, [activeId, widgets]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const collisionDetectionStrategy = (args: any) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }
    const intersectionCollisions = rectIntersection(args);
    if (intersectionCollisions.length > 0) {
      return intersectionCollisions;
    }
    return closestCenter(args);
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = useCallback((event: any) => {
    const { active, over } = event;
    
    if (!over) {
      setDropZoneActive(null);
      setInsertionIndicator(null);
      return;
    }
    
    const overId = over.id.toString();
    const overData = over.data?.current;
    const activeWidgetId = active.id as string;
    const activeWidget = widgets.find(w => w.id === activeWidgetId);
    
    if (!activeWidget) return;
    
    const activeWidgetColumnSpan = getWidgetColumnSpan(activeWidget);
    
    // Caso 1: Sobre una drop zone
    if (overId.startsWith('drop-zone-')) {
      setDropZoneActive(overId);
      setInsertionIndicator({
        rowIndex: overData?.rowIndex ?? 0,
        side: 'after'
      });
      return;
    }
    
    // Caso 2: Sobre un widget
    const overWidget = widgets.find(w => w.id === overId);
    if (overWidget) {
      setDropZoneActive(null);
      const targetRowIndex = findRowIndexForWidget(rows, overId);
      const sourceRowIndex = findRowIndexForWidget(rows, activeWidgetId);
      
      if (targetRowIndex !== -1) {
        const targetRow = rows[targetRowIndex];
        
        // VALIDACIÓN: Calcular espacio usado en la fila destino
        const isFromSameRow = targetRowIndex === sourceRowIndex;
        let currentColumnCount = 0;
        
        targetRow.widgets.forEach(wId => {
          if (wId !== activeWidgetId || !isFromSameRow) {
            const w = widgets.find(widget => widget.id === wId);
            if (w) {
              currentColumnCount += getWidgetColumnSpan(w);
            }
          }
        });
        
        // Verificar si añadir este widget excedería el límite
        if (currentColumnCount + activeWidgetColumnSpan > gridColumns) {
          setInsertionIndicator(null);
          return;
        }
        
        // Detectar si está en la mitad izquierda o derecha del widget
        const rect = over.rect;
        const pointerX = event.activatorEvent?.clientX || event.delta?.x || 0;
        const widgetMiddle = rect.left + rect.width / 2;
        const side = pointerX < widgetMiddle ? 'before' : 'after';
        
        setInsertionIndicator({
          rowIndex: targetRowIndex,
          side: side,
          targetWidgetId: overId
        });
      }
    }
  }, [widgets, rows, gridColumns]);

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    
    try {
      // CRÍTICO: Limpiar estado PRIMERO
      setActiveId(null);
      setDropZoneActive(null);
      setInsertionIndicator(null);

      // Si no hay over, salir temprano
      if (!over || active.id === over.id) {
        console.log('🚫 Drag cancelado o sin cambios');
        return;
      }

      const activeWidgetId = active.id as string;
      const overId = over.id.toString();
      const overData = over.data?.current;

      // Caso 1: Drop en una drop zone (crear nueva fila)
      if (overId.startsWith('drop-zone-')) {
        const rowIndex = overData?.rowIndex ?? 
          (overId === 'drop-zone-final' ? rows.length - 1 : 
           parseInt(overId.replace('drop-zone-', '')));
        
        // Remover el widget de su fila actual
        let newRows = rows.map(row => ({
          ...row,
          widgets: row.widgets.filter(id => id !== activeWidgetId)
        })).filter(row => row.widgets.length > 0);
        
        // Crear nueva fila después del índice especificado
        const newRow: WidgetRow = {
          id: `row-${Date.now()}-${rowIndex + 1}`,
          widgets: [activeWidgetId]
        };
        
        newRows.splice(rowIndex + 1, 0, newRow);
        
        console.log('✅ Nueva fila creada en posición:', rowIndex + 1);
        message.success({
          content: 'Nueva fila creada',
          duration: 2,
          style: { marginTop: '20vh' }
        });
        
        if (onRowChange) {
          onRowChange(newRows);
        }
        return;
      }

      // Caso 2: Drop sobre un widget existente
      const overWidget = widgets.find(w => w.id === overId);
      if (overWidget) {
        const targetRowIndex = findRowIndexForWidget(rows, overId);
        const sourceRowIndex = findRowIndexForWidget(rows, activeWidgetId);
        
        if (targetRowIndex !== -1 && sourceRowIndex !== -1) {
          const targetRow = rows[targetRowIndex];
          const activeWidget = widgets.find(w => w.id === activeWidgetId);
          
          if (!activeWidget) return;
          
          const activeWidgetColumnSpan = getWidgetColumnSpan(activeWidget);
          
          // VALIDACIÓN CRÍTICA: Calcular espacio usado considerando tamaño real de widgets
          const isFromSameRow = targetRowIndex === sourceRowIndex;
          let currentColumnCount = 0;
          
          targetRow.widgets.forEach(wId => {
            if (wId !== activeWidgetId || !isFromSameRow) {
              const w = widgets.find(widget => widget.id === wId);
              if (w) {
                currentColumnCount += getWidgetColumnSpan(w);
              }
            }
          });
          
          // Si añadir este widget excedería el límite, mostrar advertencia
          if (currentColumnCount + activeWidgetColumnSpan > gridColumns) {
            console.log('⚠️ No hay espacio suficiente en la fila destino');
            message.warning({
              content: 'No hay espacio suficiente en esta fila',
              duration: 2,
              style: { marginTop: '20vh' }
            });
            return;
          }
          
          // Si hay espacio, permitir el movimiento normal
          // Determinar posición basada en el lado del widget
          let positionInRow = targetRow.widgets.indexOf(overId);
          
          // Si insertionIndicator tiene 'after', añadir 1 a la posición
          if (insertionIndicator?.side === 'after') {
            positionInRow += 1;
          }
          
          const newRows = moveWidgetBetweenRows(
            rows,
            activeWidgetId,
            sourceRowIndex,
            targetRowIndex,
            positionInRow
          );
          
          const actionMessage = targetRowIndex === sourceRowIndex 
            ? 'Widget reordenado' 
            : 'Widget movido a otra fila';
          
          console.log(`✅ ${actionMessage}`);
          message.success({
            content: actionMessage,
            duration: 1.5,
            style: { marginTop: '20vh' }
          });
          
          if (onRowChange) {
            onRowChange(newRows);
          }
        }
        return;
      }

      // Fallback: reordenar en el orden antiguo
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);

      if (oldIndex !== newIndex) {
        const newWidgets = [...widgets];
        const [movedWidget] = newWidgets.splice(oldIndex, 1);
        newWidgets.splice(newIndex, 0, movedWidget);
        onReorder(newWidgets);
      }
    } catch (error) {
      console.error('❌ Error durante drag & drop:', error);
      message.error('Error al reorganizar widgets');
    } finally {
      // Asegurar cleanup incluso si hay error
      setActiveId(null);
      setDropZoneActive(null);
      setInsertionIndicator(null);
    }
  }, [widgets, rows, onReorder, onRowChange, insertionIndicator, gridColumns, message]);


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={allWidgetIds}
        strategy={rectSortingStrategy}
      >
        <div className="dashboard-rows" data-grid-columns={gridColumns}>
          {rows.map((row, rowIndex) => (
            <React.Fragment key={row.id}>
              <div 
                className="dashboard-row"
                data-row-index={rowIndex}
              >
                {row.widgets.map((widgetId) => {
                  const widget = visibleWidgets.find(w => w.id === widgetId);
                  if (!widget) return null;
                  
                  const widgetColumnSpan = getWidgetColumnSpan(widget);
                  
                  const showIndicatorBefore = 
                    insertionIndicator?.targetWidgetId === widgetId && 
                    insertionIndicator.side === 'before';
                  
                  const showIndicatorAfter = 
                    insertionIndicator?.targetWidgetId === widgetId && 
                    insertionIndicator.side === 'after';
                  
                  return (
                    <React.Fragment key={widgetId}>
                      {showIndicatorBefore && <InsertionIndicator {...insertionIndicator} />}
                      
                      <div 
                        className="dashboard-row__item"
                        data-column-span={widgetColumnSpan}
                        style={{ 
                          flex: `${widgetColumnSpan} 1 auto`
                        }}
                      >
                        <DraggableWidget widget={widget} isEditMode={isEditMode}>
                          {renderWidget(widget)}
                        </DraggableWidget>
                      </div>
                      
                      {showIndicatorAfter && <InsertionIndicator {...insertionIndicator} />}
                    </React.Fragment>
                  );
                })}
              </div>
              
              {/* Drop zone para crear nueva fila */}
              {isEditMode && (
                <DroppableZone
                  id={`drop-zone-${rowIndex}`}
                  rowIndex={rowIndex}
                  isActive={dropZoneActive === `drop-zone-${rowIndex}`}
                />
              )}
            </React.Fragment>
          ))}
          
          {/* Drop zone final */}
          {isEditMode && (
            <DroppableZone
              id="drop-zone-final"
              rowIndex={rows.length - 1}
              isActive={dropZoneActive === 'drop-zone-final'}
            />
          )}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeWidget ? (
          <div className="draggable-widget dragging">
            {renderWidget(activeWidget)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DroppableGrid;
