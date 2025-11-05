import { useState } from 'react';
import { Button, Select, Typography, Input, Space, Tag } from 'antd';
import { ChevronDown, X } from 'lucide-react';

const { Title, Text } = Typography;

const Reportes = () => {
  const [emails, setEmails] = useState(['abc@gmail.co', 'cda@gmail.co']);
  const [phones, setPhones] = useState(['+000 0000', '+000 0000']);
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleRemovePhone = (phoneToRemove: string) => {
    setPhones(phones.filter(phone => phone !== phoneToRemove));
  };

  const handleAddEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail('');
    }
  };

  const handleAddPhone = () => {
    if (newPhone && !phones.includes(newPhone)) {
      setPhones([...phones, newPhone]);
      setNewPhone('');
    }
  };

  const dropdownOptions = [
    { label: 'Opción 1', value: 'option1' },
    { label: 'Opción 2', value: 'option2' },
    { label: 'Opción 3', value: 'option3' },
  ];

  return (
    <div className="reportes-container">
      {/* Header */}
      <div className="reportes-header">
        <Title level={1} className="reportes-title">
          Reportes
        </Title>
        <Text className="reportes-subtitle">
          Gestiona el manejo de reportes a tus clientes con oso Rentoso
        </Text>
      </div>

      {/* Report Configuration Sections */}
      <div className="report-section w-full">
        <Space direction="vertical" className="w-full" size="large">
          {/* Property Performance Reports */}
          <div className="form-item">
            <Text className="form-label">
              Notificar a los clientes el desempeño de sus propiedades con tu inmobiliario
            </Text>
            <Select
              placeholder="Seleccionar opción"
              suffixIcon={<ChevronDown size={16} />}
              options={dropdownOptions}
            />
          </div>

          {/* Financial Reports */}
          <div className="form-item">
            <Text className="form-label">
              Envío reportes financieros
            </Text>
            <Select
              placeholder="Seleccionar opción"
              suffixIcon={<ChevronDown size={16} />}
              options={dropdownOptions}
            />
          </div>

          {/* Multi-publication Reports */}
          <div className="form-item">
            <Text className="form-label">
              Envío reportes multipublicación
            </Text>
            <Select
              placeholder="Seleccionar opción"
              suffixIcon={<ChevronDown size={16} />}
              options={dropdownOptions}
            />
          </div>
        </Space>
      </div>

      {/* Notification Preferences */}
      <div className="preferences-section">
        <Title level={3} className="preferences-title">
          Preferencias notificaciones
        </Title>

        {/* Email Section */}
        <div className="contact-section">
          <Text className="contact-label">
            Email <span className="required">*</span>
          </Text>
          
          <div className="tags-input">
            {emails.map((email, index) => (
              <Tag
                key={index}
                closable
                onClose={() => handleRemoveEmail(email)}
                closeIcon={<X size={12} />}
              >
                {email}
              </Tag>
            ))}
            <Input
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              onPressEnter={handleAddEmail}
              placeholder="Agregar email..."
              bordered={false}
            />
          </div>
          
          <Button type="link" className="test-button">
            Test
          </Button>
          <div className="clear-fix" />
        </div>

        {/* Phone Section */}
        <div className="contact-section">
          <Text className="contact-label">
            Phone Number <span className="required">*</span>
          </Text>
          
          <div className="tags-input">
            {phones.map((phone, index) => (
              <Tag
                key={index}
                closable
                onClose={() => handleRemovePhone(phone)}
                closeIcon={<X size={12} />}
              >
                {phone}
              </Tag>
            ))}
            <Input
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              onPressEnter={handleAddPhone}
              placeholder="Agregar teléfono..."
              bordered={false}
            />
          </div>
          
          <Button type="link" className="test-button">
            Test
          </Button>
          <div className="clear-fix" />
        </div>
      </div>

      {/* Save Button */}
      <div className="save-section">
        <Button
          type="primary"
          size="large"
          className="save-button"
        >
          Guardar Información
        </Button>
      </div>
    </div>
  );
};

export default Reportes;