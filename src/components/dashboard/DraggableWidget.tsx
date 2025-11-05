import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Widget } from '../../types/dashboard-layout';

interface DraggableWidgetProps {
  widget: Widget;
  isEditMode: boolean;
  children: React.ReactNode;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  widget,
  isEditMode,
  children
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: widget.id,
    disabled: !isEditMode
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`draggable-widget ${isEditMode ? 'edit-mode' : ''} ${isDragging ? 'dragging' : ''}`}
      data-widget-type={widget.type}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

export default DraggableWidget;
