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
  Popconfirm,
} from 'antd';
import { useState, useEffect } from 'react';
import type { Propietario } from '../../types/propietario';
import { usePropietarioStore } from '../../store/propietarioStore';
import { CountryPhoneSelect } from '../common';

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onUpdated?: () => void;
  propietario: Propietario | null;
}

const EditPropietarioModal = ({ open, onClose, onSuccess, onUpdated, propietario }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [countdown, setCountdown] = useState(7);
  const [popconfirmVisible, setPopconfirmVisible] = useState(false);
  const { updatePropietarioLocal, deletePropietarioLocal } = usePropietarioStore();

  useEffect(() => {
    if (open && propietario) {
      form.setFieldsValue({
        nombre: propietario.nombre,
        email: propietario.email,
        codigoTelefonico: propietario.codigo_telefonico || 56,
        telefono: parseInt(propietario.telefono || '0'),
        tipoDocumento: propietario.tipo_documento || 'RUT',
        documento: propietario.documento || ''
      });
    }
  }, [open, propietario, form]);

  // Countdown effect for delete confirmation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (popconfirmVisible && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [popconfirmVisible, countdown]);

  const handleClose = () => {
    form.resetFields();
    setCountdown(7);
    setPopconfirmVisible(false);
    onClose();
  };

  const handlePopconfirmChange = (visible: boolean) => {
    setPopconfirmVisible(visible);
    if (visible) {
      setCountdown(7);
    }
  };

  const handleSubmit = async () => {
    if (!propietario) return;

    try {
      const values = await form.validateFields();
      
      const updateData = {
        nombre: values.nombre,
        email: values.email,
        telefono: values.telefono.toString(),
        codigo_telefonico: values.codigoTelefonico,
        tipo_documento: values.tipoDocumento,
        documento: values.documento
      };

      setLoading(true);
      await updatePropietarioLocal(propietario.id, updateData);
      message.success('Propietario actualizado correctamente');
      
      onSuccess?.();
      onUpdated?.();
      handleClose();
    } catch (error) {
      console.error('Error updating propietario:', error);
      message.error('Error al actualizar el propietario');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!propietario) return;

    try {
      setDeleting(true);
      setPopconfirmVisible(false);
      await deletePropietarioLocal(propietario.id);
      message.success('Propietario eliminado correctamente');
      
      onSuccess?.();
      onUpdated?.();
      handleClose();
    } catch (error) {
      console.error('Error deleting propietario:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el propietario';
      message.error(errorMessage);
    } finally {
      setDeleting(false);
      setCountdown(7);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title="Editar Propietario"
      width={600}
      footer={[
        <Popconfirm
          key="delete"
          open={popconfirmVisible}
          onOpenChange={handlePopconfirmChange}
          title="¿Eliminar propietario?"
          description={
            propietario?.propiedades_asociadas && propietario.propiedades_asociadas > 0 ? (
              <div style={{ maxWidth: 300 }}>
                <p style={{ marginBottom: 8 }}>
                  <strong>⚠️ ADVERTENCIA:</strong> Este propietario tiene{' '}
                  <strong>{propietario.propiedades_asociadas}</strong>{' '}
                  {propietario.propiedades_asociadas === 1 ? 'propiedad asociada' : 'propiedades asociadas'}.
                </p>
                <p style={{ marginBottom: 8 }}>
                  <strong>Al eliminar este propietario, todas sus propiedades también serán eliminadas de forma permanente.</strong>
                </p>
                <p style={{ marginBottom: 0 }}>
                  Si desea conservar las propiedades, debe cambiar manualmente el propietario en cada una antes de eliminar.
                </p>
              </div>
            ) : (
              <div style={{ maxWidth: 300 }}>
                <p style={{ marginBottom: 8 }}>
                  Esta acción es <strong>irreversible</strong>.
                </p>
                <p style={{ marginBottom: 0 }}>
                  Este propietario no tiene propiedades asociadas y será eliminado permanentemente.
                </p>
              </div>
            )
          }
          onConfirm={handleDelete}
          okText={countdown > 0 ? `Espera ${countdown}s...` : 'Sí, eliminar'}
          cancelText="Cancelar"
          okButtonProps={{ 
            danger: true,
            loading: deleting,
            disabled: countdown > 0
          }}
        >
          <Button 
            key="delete" 
            danger 
            loading={deleting}
            disabled={loading}
            onClick={() => setPopconfirmVisible(true)}
          >
            Eliminar Propietario
          </Button>
        </Popconfirm>,
        <Button key="cancel" onClick={handleClose} disabled={loading || deleting}>
          Cancelar
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading} 
          onClick={handleSubmit}
          disabled={deleting}
        >
          Guardar Cambios
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" className="mt-16">
        <Form.Item
          name="nombre"
          label="Nombre completo"
          rules={[{ required: true, message: 'El nombre es requerido' }]}
        >
          <Input placeholder="Ingrese el nombre completo" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Correo electrónico"
          rules={[
            { required: true, message: 'El email es requerido' },
            { type: 'email', message: 'Ingrese un email válido' }
          ]}
        >
          <Input placeholder="propietario@email.com" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={10}>
            <Form.Item
              name="codigoTelefonico"
              label="País"
              rules={[{ required: true, message: 'El país es requerido' }]}
            >
              <CountryPhoneSelect 
                placeholder="Seleccionar país"
                className="w-full"
              />
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item
              name="telefono"
              label="Teléfono"
              rules={[{ required: true, message: 'El teléfono es requerido' }]}
            >
              <InputNumber 
                placeholder="912345678" 
                className="w-full" 
                min={1}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="tipoDocumento"
              label="Tipo de documento"
              rules={[{ required: true, message: 'El tipo de documento es requerido' }]}
            >
              <Select placeholder="Seleccione el tipo">
                <Option value="RUT">RUT</Option>
                <Option value="PASAPORTE">PASAPORTE</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="documento"
              label="Número de documento"
              rules={[{ required: true, message: 'El documento es requerido' }]}
            >
              <Input placeholder="12345678-9" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditPropietarioModal;