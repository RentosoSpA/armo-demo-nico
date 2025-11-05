import React from 'react';
import { Plus } from 'lucide-react';

interface AddRowButtonProps {
  onClick: () => void;
  isEditMode: boolean;
}

const AddRowButton: React.FC<AddRowButtonProps> = ({ onClick, isEditMode }) => {
  if (!isEditMode) return null;
  
  return (
    <button 
      className="add-row-button"
      onClick={onClick}
      type="button"
    >
      <Plus size={20} />
      <span>Añadir nueva fila</span>
    </button>
  );
};

export default AddRowButton;
