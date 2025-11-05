import React from 'react';
import { Form, Input, InputNumber, Select, Checkbox, Col } from 'antd';
import type { FieldConfig } from '../caracteristicasConfig';

const { Option } = Select;
const { TextArea } = Input;

interface DynamicFieldRendererProps {
  field: FieldConfig;
}

export const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({ field }) => {
  const renderInput = () => {
    switch (field.type) {
      case 'input':
        return <Input placeholder={field.placeholder} />;

      case 'inputNumber':
        return (
          <InputNumber
            className="w-full"
            min={field.min}
            step={field.step}
            placeholder={field.placeholder}
            addonAfter={field.addonAfter}
          />
        );

      case 'select':
        return (
          <Select placeholder={field.placeholder} allowClear>
            {field.options?.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case 'checkbox':
        return <Checkbox />;

      case 'textarea':
        return <TextArea rows={4} placeholder={field.placeholder} />;

      default:
        return <Input placeholder={field.placeholder} />;
    }
  };

  const rules = field.required
    ? [{ required: true, message: `Ingrese ${field.label.toLowerCase()}` }, ...(field.rules || [])]
    : field.rules || [];

  return (
    <Col span={field.span || 12}>
      <Form.Item
        name={field.name}
        label={field.label}
        rules={rules}
        valuePropName={field.type === 'checkbox' ? 'checked' : 'value'}
      >
        {renderInput()}
      </Form.Item>
    </Col>
  );
};
