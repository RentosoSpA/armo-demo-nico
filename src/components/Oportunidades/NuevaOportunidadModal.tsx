import { Modal, Form, Select, Button, message, Alert } from 'antd';
import { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import type { OportunidadCreate } from '../../types/oportunidad';
import type { Prospecto, ProspectoCreate } from '../../types/profile';
import type { Propiedad } from '../../types/propiedad';
import { getPropiedades } from '../../services/propiedades/propiedadesServiceSupabase';
import { createOportunidad } from '../../services/oportunidades/oportunidadesServiceSupabase';
import AddProspectoModal from './AddProspectoModal';
import { useUserStore } from '../../store/userStore';

const { Option } = Select;

interface NuevaOportunidadModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (oportunidad: any) => void;
  prospectos: Prospecto[];
  onCreateProspecto: (payload: ProspectoCreate) => Promise<{ id: string; [key: string]: any }>;
}

const NuevaOportunidadModal = ({ open, onClose, onCreated, prospectos = [], onCreateProspecto }: NuevaOportunidadModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [createError, setCreateError] = useState(false);
  const [createErrorMessage, setCreateErrorMessage] = useState('');
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [addProspectoModalVisible, setAddProspectoModalVisible] = useState(false);
  const [selectedProspectoId, setSelectedProspectoId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<any>({});
  
  const { empresa, agent } = useUserStore();

  useEffect(() => {
    if (open) {
      try {
        fetchData();
      } catch {
        setLoadingError(true);
      }
    }
  }, [open]);

  async function fetchData() {
    try {
      setLoadingData(true);
      if (!empresa?.id) {
        throw new Error('No hay empresa configurada');
      }
      const propiedades = await getPropiedades(empresa.id);
      setPropiedades(propiedades);
    } catch {
      setLoadingError(true);
    } finally {
      setLoadingData(false);
    }
  }

  const handleFinish = async (values: any) => {
    setCreateError(false);

    // Validaciones robustas
    if (!selectedProspectoId) {
      message.error('Por favor selecciona un prospecto');
      return;
    }

    if (!empresa?.id) {
      setCreateError(true);
      setCreateErrorMessage('Error: No hay empresa configurada');
      return;
    }

    if (!agent?.id) {
      setCreateError(true);
      setCreateErrorMessage('Error: No hay agente configurado');
      return;
    }

    const prospecto = prospectos.find(p => p.id === selectedProspectoId);
    const propiedad = propiedades.find(p => p.id === values.propiedad_id);
    
    if (!prospecto) {
      setCreateError(true);
      setCreateErrorMessage('Error: Prospecto no encontrado');
      return;
    }
    
    if (!propiedad) {
      setCreateError(true);
      setCreateErrorMessage('Error: Propiedad no encontrada');
      return;
    }

    const nuevaOportunidad: OportunidadCreate = {
      prospecto_id: selectedProspectoId,
      propiedad_id: propiedad.id || '',
      agente_id: agent.id,
      empresa_id: empresa.id,
      status: values.status || 'Open',
      etapa: values.etapa || 'Exploracion',
      source: 'manual',
    };

    try {
      setLoading(true);
      const createdOportunidad = await createOportunidad(nuevaOportunidad);
      message.success('Oportunidad creada correctamente');
      onCreated(createdOportunidad);
      resetModalState();
      onClose();
    } catch (error) {
      setCreateError(true);
      setCreateErrorMessage(
        error instanceof Error ? error.message : 'Error al crear la oportunidad'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProspectoCreated = (nuevoProspecto: ProspectoCreate & { id: string }) => {
    setSelectedProspectoId(nuevoProspecto.id);
    form.setFieldsValue({ prospecto_id: nuevoProspecto.id });
    setFormValues((prev: any) => ({ ...prev, prospecto_id: nuevoProspecto.id }));
    setAddProspectoModalVisible(false);
  };

  const handleProspectoChange = (value: string) => {
    setSelectedProspectoId(value);
    form.setFieldsValue({ prospecto_id: value });
    setFormValues((prev: any) => ({ ...prev, prospecto_id: value }));
  };

  const handleFormValuesChange = (_changedValues: any, allValues: any) => {
    setFormValues(allValues);
  };

  const resetModalState = () => {
    form.resetFields();
    setSelectedProspectoId(null);
    setFormValues({});
    setCreateError(false);
    setCreateErrorMessage('');
  };

  const isFormValid = selectedProspectoId && formValues.propiedad_id && formValues.etapa;

  return (
    <Modal
      open={open}
      onCancel={() => {
        resetModalState();
        onClose();
      }}
      footer={null}
      title="Nueva Oportunidad"
      confirmLoading={loading}
      okButtonProps={{ disabled: loading || loadingError || createError }}
      okText="Guardar oportunidad"
      cancelText="Cancelar"
      onOk={() => form.submit()}
    >
      {prospectos && prospectos.length === 0 && (
        <div className="text-center mb-16 p-20">
          <p style={{ margin: '0 0 12px 0', color: '#656d76' }}>No hay prospectos disponibles</p>
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddProspectoModalVisible(true)}
          >
            Crear prospecto
          </Button>
        </div>
      )}

      <Form layout="vertical" form={form} onFinish={handleFinish} onValuesChange={handleFormValuesChange}>
        <Form.Item name="prospecto_id" label="Prospecto" rules={[{ required: true, message: 'Selecciona un prospecto' }]}>
          <Select
            placeholder="Selecciona un prospecto"
            showSearch
            optionFilterProp="children"
            value={selectedProspectoId}
            onChange={handleProspectoChange}
            disabled={!prospectos || prospectos.length === 0}
          >
            {prospectos?.map(p => (
              <Option key={p.id} value={p.id}>
                {p.primer_nombre && p.primer_apellido 
                  ? `${p.primer_nombre} ${p.primer_apellido}`
                  : p.email || p.display_name || `ID: ${p.id}`
                }
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Button 
          icon={<PlusOutlined />}
          onClick={() => setAddProspectoModalVisible(true)}
          className="w-full mb-16"
        >
          Agregar prospecto
        </Button>

        <Form.Item name="propiedad_id" label="Propiedad" rules={[{ required: true, message: 'Selecciona una propiedad' }]}>
          <Select
            placeholder="Selecciona una propiedad"
            showSearch
            optionFilterProp="children"
            loading={loadingData}
          >
            {propiedades?.map(p => (
              <Option key={p.id} value={p.id || ''}>
                {p.titulo}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="etapa" label="Etapa" rules={[{ required: true, message: 'Selecciona una etapa' }]}>
          <Select placeholder="Selecciona la etapa inicial">
            <Option value="Exploracion">Exploración</Option>
            <Option value="Evaluacion">Evaluación</Option>
            <Option value="Visita">Visita</Option>
            <Option value="Negociacion">Negociación</Option>
            <Option value="Cierre">Cierre</Option>
          </Select>
        </Form.Item>
        {loadingError && (
          <Alert message="Error al cargar los datos" type="error" className="mb-16" />
        )}
        {createError && (
          <Alert message={createErrorMessage} type="error" className="mb-16" />
        )}
        <Button 
          type="primary" 
          htmlType="submit" 
          block 
          loading={loading}
          disabled={!isFormValid}
        >
          {loading ? 'Guardando...' : 'Guardar oportunidad'}
        </Button>
      </Form>

      <AddProspectoModal
        open={addProspectoModalVisible}
        onClose={() => setAddProspectoModalVisible(false)}
        onCreated={handleProspectoCreated}
        onCreateProspecto={onCreateProspecto}
      />
    </Modal>
  );
};

export default NuevaOportunidadModal;
