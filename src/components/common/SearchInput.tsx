import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import './SearchInput.scss';

interface SearchInputProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  value?: string;
  style?: React.CSSProperties;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Buscar...",
  onChange,
  onSearch,
  value,
  style,
  className = ""
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(value || '');
    }
  };

  const handleSearchClick = () => {
    onSearch?.(value || '');
  };

  return (
    <div className={`custom-search-input ${className}`} style={style}>
      <div className="search-input-wrapper">
        <SearchOutlined 
          className="search-icon" 
          onClick={handleSearchClick}
        />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default SearchInput;