import React, { useState, useRef, useEffect } from 'react';
import { DownOutlined, LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import './CustomSelect.scss';

export interface SelectOption {
  key: string;
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  placeholder?: string;
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number | undefined) => void;
  style?: React.CSSProperties;
  className?: string;
  allowClear?: boolean;
  loading?: boolean;
  showSearch?: boolean;
  optionFilterProp?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  placeholder = "Seleccionar...",
  options,
  value,
  onChange,
  style,
  className = "",
  allowClear = false,
  loading = false,
  showSearch = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const selectRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    if (showSearch && searchText) {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchText, options, showSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchText('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);
  const hasValue = value !== undefined && value !== null && value !== '';

  const handleSelectClick = () => {
    if (!loading) {
      setIsOpen(!isOpen);
      if (showSearch && !isOpen) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      }
    }
  };

  const handleOptionClick = (optionValue: string | number) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchText('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(undefined);
    setSearchText('');
    setIsOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredOptions.length > 0) {
      handleOptionClick(filteredOptions[0].value);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchText('');
    }
  };

  return (
    <div className={`custom-select ${className}`} style={style} ref={selectRef}>
      <div 
        className={`select-selector ${isOpen ? 'open' : ''}`} 
        onClick={handleSelectClick}
      >
        <div className="select-selection">
          {showSearch && isOpen ? (
            <input
              ref={inputRef}
              type="text"
              className="select-search-input"
              value={searchText}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              placeholder={selectedOption ? selectedOption.label : placeholder}
            />
          ) : (
            <span className={`select-selection-item ${!hasValue ? 'placeholder' : ''}`}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          )}
        </div>
        
        <div className="select-arrow">
          {loading ? (
            <LoadingOutlined spin />
          ) : (
            <>
              {allowClear && hasValue && !isOpen && (
                <CloseOutlined 
                  className="select-clear" 
                  onClick={handleClear}
                  color='#6b7280'
                />
              )}
              <DownOutlined className={`select-arrow-icon ${isOpen ? 'open' : ''}`} />
            </>
          )}
        </div>
      </div>

      {isOpen && (
        <div className="select-dropdown">
          <div className="select-dropdown-content">
            {filteredOptions.length === 0 ? (
              <div className="select-option-empty">
                Sin resultados
              </div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option.key}
                  className={`select-option ${option.value === value ? 'selected' : ''}`}
                  onClick={() => handleOptionClick(option.value)}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;