import React, { useState } from 'react';
import { Form, Input, Select, Upload, Button, Card } from 'antd';
import { Upload as UploadIcon, X } from 'lucide-react';
import type { PropertyFormData } from '../../types/rentoso';
import { isValidEmail, isValidPhone, isValidRUT } from '../../utils/chatHelpers';
import './PropertyConfirmationForm.scss';

interface PropertyConfirmationFormProps {
  propertyData: any;
  onSubmit: (formData: PropertyFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const PropertyConfirmationForm: React.FC<PropertyConfirmationFormProps> = ({
  propertyData,
  onSubmit,
  onCancel,
  loading
}) => {
  const [form] = Form.useForm();
  const [images, setImages] = useState<Array<{ data: string; name: string }>>([]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result as string;
      setImages(prev => [...prev, { data, name: file.name }]);
    };
    reader.readAsDataURL(file);
    return false; // Prevent auto upload
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (values: any) => {
    if (images.length === 0) {
      form.setFields([{
        name: 'images',
        errors: ['Debes subir al menos una imagen']
      }]);
      return;
    }

    onSubmit({
      ...values,
      images
    });
  };

  return (
    <Card className="property-confirmation-form">
      <h3>Confirmar Datos de la Propiedad</h3>
      
      <div className="property-summary">
        <p><strong>Tipo:</strong> {propertyData.tipo}</p>
        <p><strong>Dirección:</strong> {propertyData.direccion}</p>
        {propertyData.comuna && <p><strong>Comuna:</strong> {propertyData.comuna}</p>}
        <p><strong>Habitaciones:</strong> {propertyData.habitaciones}</p>
        <p><strong>Baños:</strong> {propertyData.banos}</p>
        {propertyData.precio_arriendo && (
          <p><strong>Precio Arriendo:</strong> ${propertyData.precio_arriendo.toLocaleString('es-CL')}</p>
        )}
        {propertyData.precio_venta && (
          <p><strong>Precio Venta:</strong> ${propertyData.precio_venta.toLocaleString('es-CL')}</p>
        )}
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <h4>Datos del Propietario</h4>
        
        <Form.Item
          name="nombre"
          label="Nombre Completo"
          rules={[{ required: true, message: 'Ingresa el nombre' }]}
        >
          <Input placeholder="Ej: Juan Pérez" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Ingresa el email' },
            { validator: (_, value) => {
              if (!value || isValidEmail(value)) {
                return Promise.resolve();
              }
              return Promise.reject('Email inválido');
            }}
          ]}
        >
          <Input type="email" placeholder="ejemplo@email.com" />
        </Form.Item>

        <div style={{ display: 'flex', gap: 8 }}>
          <Form.Item
            name="codigo_telefonico"
            label="Código"
            initialValue={56}
            style={{ width: 100 }}
            rules={[{ required: true }]}
          >
            <Input prefix="+" type="number" />
          </Form.Item>

          <Form.Item
            name="telefono"
            label="Teléfono"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: 'Ingresa el teléfono' },
              { validator: (_, value) => {
                if (!value || isValidPhone(value)) {
                  return Promise.resolve();
                }
                return Promise.reject('Teléfono debe tener 9 dígitos y empezar con 9');
              }}
            ]}
          >
            <Input placeholder="912345678" />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Form.Item
            name="tipo_documento"
            label="Tipo Documento"
            initialValue="RUT"
            style={{ width: 120 }}
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="RUT">RUT</Select.Option>
              <Select.Option value="Pasaporte">Pasaporte</Select.Option>
              <Select.Option value="DNI">DNI</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="documento"
            label="Número Documento"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: 'Ingresa el documento' },
              { validator: (_, value) => {
                const tipoDoc = form.getFieldValue('tipo_documento');
                if (tipoDoc === 'RUT' && value && !isValidRUT(value)) {
                  return Promise.reject('RUT inválido');
                }
                return Promise.resolve();
              }}
            ]}
          >
            <Input placeholder="12345678-9" />
          </Form.Item>
        </div>

        <h4>Fotos de la Propiedad</h4>
        
        <Form.Item name="images">
          <Upload
            listType="picture-card"
            beforeUpload={handleImageUpload}
            showUploadList={false}
            accept="image/*"
            multiple
          >
            <div>
              <UploadIcon size={24} />
              <div style={{ marginTop: 8 }}>Subir Fotos</div>
            </div>
          </Upload>
        </Form.Item>

        {images.length > 0 && (
          <div className="image-previews">
            {images.map((img, index) => (
              <div key={index} className="image-preview">
                <img src={img.data} alt={`Preview ${index + 1}`} />
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<X size={16} />}
                  onClick={() => removeImage(index)}
                  className="remove-image"
                />
              </div>
            ))}
          </div>
        )}

        <div className="form-actions">
          <Button onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cargar Propiedad
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default PropertyConfirmationForm;
