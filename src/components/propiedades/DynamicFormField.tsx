import { Form, Input, InputNumber, Select, Checkbox } from 'antd';
import type { Rule } from 'antd/es/form';
import React from 'react';

const { Option } = Select;
const { TextArea } = Input;

interface DynamicFormFieldProps {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string | number; label: string }>;
  min?: number;
  max?: number;
  rows?: number;
  condition?: boolean; // Si se proporciona, solo renderiza si es true
  valuePropName?: string;
}

/**
 * Componente reutilizable para campos de formulario dinámicos
 */
export const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  name,
  label,
  type,
  required = false,
  placeholder,
  options = [],
  min,
  max,
  rows = 4,
  condition = true,
  valuePropName = 'value',
}) => {
  // No renderizar si no cumple la condición
  if (!condition) {
    return null;
  }

  const rules: Rule[] = required
    ? [{ required: true, message: `${label} es requerido` }]
    : [];

  const renderInput = () => {
    switch (type) {
      case 'number':
        return (
          <InputNumber
            style={{ width: '100%' }}
            placeholder={placeholder || `Ingrese ${label.toLowerCase()}`}
            min={min}
            max={max}
          />
        );

      case 'select':
        return (
          <Select placeholder={placeholder || `Seleccione ${label.toLowerCase()}`}>
            {options.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case 'checkbox':
        return <Checkbox>{label}</Checkbox>;

      case 'textarea':
        return (
          <TextArea
            rows={rows}
            placeholder={placeholder || `Ingrese ${label.toLowerCase()}`}
          />
        );

      case 'text':
      default:
        return (
          <Input placeholder={placeholder || `Ingrese ${label.toLowerCase()}`} />
        );
    }
  };

  // Para checkbox, usar valuePropName="checked"
  const formItemProps: any = {
    name,
    label: type === 'checkbox' ? undefined : label,
    rules,
    valuePropName: type === 'checkbox' ? 'checked' : valuePropName,
  };

  return <Form.Item {...formItemProps}>{renderInput()}</Form.Item>;
};
