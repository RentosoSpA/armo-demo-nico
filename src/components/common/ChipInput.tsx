import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface ChipInputProps {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (values: string[]) => void;
}

const ChipInput: React.FC<ChipInputProps> = ({ label, placeholder, values, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!values.includes(inputValue.trim())) {
        onChange([...values, inputValue.trim()]);
      }
      setInputValue('');
    }
  };

  const removeChip = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="chip-input">
      <label>{label}</label>
      <div className="chip-input__container">
        {values.map((value, index) => (
          <div key={index} className="chip-input__chip">
            {value}
            <button onClick={() => removeChip(index)}>
              <X size={12} />
            </button>
          </div>
        ))}
        <input
          className="chip-input__input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default ChipInput;