import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  message,
  Row,
  Col,
} from 'antd';
import { useState } from 'react';
import { usePropietarioStore } from '../../store/propietarioStore';
import { useUserStore } from '../../store/userStore';
import { CountryPhoneSelect } from '../common';

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const AgregarPropietarioModal = ({ open, onClose, onCreated }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { createPropietarioLocal } = usePropietarioStore();
  const { empresa } = useUserStore();

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const propietarioData = {
        nombre: values.nombre,
        email: values.email,
        telefono: values.telefono.toString(),
        codigo_telefonico: values.codigoTelefonico || 56,
        documento: values.documento,
        tipo_documento: values.tipoDocumento || 'RUT'
      };

      setLoading(true);
      await createPropietarioLocal(propietarioData, empresa?.id || '');
      message.success('Propietario agregado correctamente');
      
      form.resetFields();
      onCreated?.();
      onClose();
    } catch (error) {
      console.error('Error creating propietario:', error);
      message.error('Error al crear el propietario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title="Añadir Propietario"
      width={600}
      footer={[
        <Button 
          key="cancel" 
          onClick={handleClose}
          className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 bg-white/5 border border-white/10 text-primary hover:bg-white/8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand)] transition"
          style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.10)', color: 'var(--fg-primary)' }}
        >
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
          className="inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-semibold transition shadow-lg"
          style={{ background: 'var(--brand)', color: '#ffffff' }}
        >
          Añadir Propietario
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="nombre"
          label={<span className="text-primary">Nombre completo <span style={{ color: 'var(--brand)' }}>*</span></span>}
          rules={[{ required: true, message: 'El nombre es requerido' }]}
        >
          <Input 
            placeholder="Ingrese el nombre completo"
            className="liquid-input"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={<span className="text-primary">Correo electrónico <span style={{ color: 'var(--brand)' }}>*</span></span>}
          rules={[
            { required: true, message: 'El email es requerido' },
            { type: 'email', message: 'Ingrese un email válido' }
          ]}
        >
          <Input 
            placeholder="propietario@email.com"
            className="liquid-input"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={10}>
            <Form.Item
              name="codigoTelefonico"
              label={<span className="text-primary">País <span style={{ color: 'var(--brand)' }}>*</span></span>}
              rules={[{ required: true, message: 'El país es requerido' }]}
            >
              <CountryPhoneSelect 
                placeholder="Seleccionar país"
                className="w-full"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={14}>
            <Form.Item
              name="telefono"
              label={<span className="text-primary">Teléfono <span style={{ color: 'var(--brand)' }}>*</span></span>}
              rules={[{ required: true, message: 'El teléfono es requerido' }]}
            >
              <InputNumber 
                placeholder="912345678" 
                className="w-full liquid-input" 
                min={1}
                style={{ minHeight: '44px' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="tipoDocumento"
              label={<span className="text-primary">Tipo de documento <span style={{ color: 'var(--brand)' }}>*</span></span>}
              rules={[{ required: true, message: 'El tipo de documento es requerido' }]}
            >
              <Select 
                placeholder="Seleccione el tipo"
                className="liquid-select"
              >
                <Option value="RUT">RUT</Option>
                <Option value="PASAPORTE">PASAPORTE</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="documento"
              label={<span className="text-primary">Número de documento <span style={{ color: 'var(--brand)' }}>*</span></span>}
              rules={[{ required: true, message: 'El documento es requerido' }]}
            >
              <Input 
                placeholder="12345678-9"
                className="liquid-input"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AgregarPropietarioModal;