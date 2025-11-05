import { Modal, Form, Select, DatePicker, Button, Space } from 'antd';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { VisitaCreate } from '../../types/visita';
import type { Propiedad } from '../../types/propiedad';
import type { Prospecto } from '../../types/profile';
import { createVisita } from '../../services/mock/visitasServiceMock';
import { getPropiedades } from '../../services/mock/propiedadesServiceMock';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import '../../styles/components/_forms.scss';

// Custom error message component using span instead of div
const CustomErrorMessage = ({ error }: { error?: string }) => {
  if (!error) return null;
  return (
    <span className="d-block mt-4">
      {error}
    </span>
  );
};

const { Option } = Select;

interface AddVisitaModalProps {
  visible: boolean;
  prospectos: Prospecto[];
  selectedDate: string;
  onCancel: () => void;
  onReload: () => void;
}

const AddVisitaModal = ({
  visible,
  prospectos = [],
  selectedDate,
  onCancel,
  onReload,
}: AddVisitaModalProps) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const values = form.getFieldsValue();
    const errors: Record<string, string> = {};

    if (!values.propiedadId) {
      errors.propiedadId = 'Por favor selecciona una propiedad';
    }
    if (!values.prospectoId) {
      errors.prospectoId = 'Por favor selecciona un prospecto';
    }
    if (!values.estado) {
      errors.estado = 'Por favor selecciona un estado';
    }
    if (!values.fecha) {
      errors.fecha = 'Por favor selecciona una fecha';
    }

    return errors;
  };

  const handleCreate = async () => {
    /* if (!userAgent) {
      message.error('No tienes permisos para crear visitas');
      return;
    } */
    try {
      setLoading(true);
      setFormErrors({}); // Clear previous errors
      setLoadingError(null); // Clear previous loading errors
      
      // Manual validation
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        setLoading(false); // Make sure to stop loading
        return;
      }

      const values = form.getFieldsValue();
      const visitaData: VisitaCreate = {
        propiedad: propiedades.find(p => p.id === values.propiedadId)?.titulo || 'Propiedad no encontrada',
        fecha_inicio: values.fecha.toISOString(),
        estado: values.estado || 'Agendada',
        plataforma: 'Manual',
        prospectoId: values.prospectoId,
      };
      await createVisita(visitaData);
      form.resetFields();
      setFormErrors({});
      onCancel();
      onReload();
    } catch (error: unknown) {
      console.error('Error al crear visita:', error);
      
      // Simple error message extraction
      let errorMessage = 'Error desconocido al crear la visita';
      
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as Error).message === 'string') {
        errorMessage = (error as Error).message;
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as { response?: { data?: { message?: string } } }).response?.data?.message
      ) {
        errorMessage = (error as { response?: { data?: { message?: string } } }).response!.data!.message!;
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        (error as { response?: { data?: { error?: string } } }).response?.data?.error
      ) {
        errorMessage = (error as { response?: { data?: { error?: string } } }).response!.data!.error!;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      setLoadingError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFormErrors({});
    setLoadingError(null);
    onCancel();
  };

  // Fetch data and reset form when modal opens
  useEffect(() => {
    if (visible) {
      setLoadingError(null);
      fetchData();
      form.resetFields();
      // Set default values
      const now = dayjs();
      const selected = dayjs(selectedDate);
      const fechaValue = selected.isBefore(now, 'day') ? now : selected;
      form.setFieldsValue({
        estado: 'Agendada',
        fecha: fechaValue,
      });
    }
  }, [visible, form, selectedDate]);

  // Force transparent backgrounds on error messages
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        // Find all error message elements and force transparent background
        const errorElements = document.querySelectorAll('.nueva-visita-modal .ant-form-item-explain-error, .nueva-visita-modal .ant-form-item-explain, .nueva-visita-modal [class*="explain"]');
        errorElements.forEach((element) => {
          if (element instanceof HTMLElement) {
            element.style.setProperty('background-color', 'transparent', 'important');
            element.style.setProperty('background', 'transparent', 'important');
            element.style.setProperty('background-image', 'none', 'important');
          }
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Also run when form validation changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const errorElements = document.querySelectorAll('.nueva-visita-modal .ant-form-item-explain-error, .nueva-visita-modal .ant-form-item-explain, .nueva-visita-modal [class*="explain"]');
      errorElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.setProperty('background-color', 'transparent', 'important');
          element.style.setProperty('background', 'transparent', 'important');
          element.style.setProperty('background-image', 'none', 'important');
        }
      });
    }, 50);
    
    return () => clearTimeout(timer);
  });

  async function fetchData() {
    try {
      setLoadingData(true);
      const propiedadesData = await getPropiedades();
      setPropiedades(propiedadesData);
    } catch {
      setLoadingError('Error al cargar los datos');
    } finally {
      setLoadingData(false);
    }
  }

  return (
    <Modal
      title="Nueva Visita"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      className="nueva-visita-modal"
    >
      {loadingError && (
        <div className="p-12 mb-16">
          {loadingError}
        </div>
      )}
      
      {prospectos && prospectos.length === 0 && (
        <div className="text-center mb-16 p-20">
          <p style={{ margin: '0 0 12px 0', color: '#656d76' }}>No hay prospectos disponibles</p>
          <Button 
            type="primary"
            onClick={() => {
              handleCancel();
              navigate('/prospectos');
            }}
          >
            Añadir prospectos
          </Button>
        </div>
      )}
      
      <Form form={form} layout="vertical" style={{ marginTop: loadingError ? 0 : 16 }}>

        <Form.Item
          name="prospectoId"
          label="Prospecto"
        >
          <Select
            placeholder="Selecciona un prospecto"
            showSearch
            optionFilterProp="children"
            disabled={!prospectos || prospectos.length === 0}
          >
          {prospectos && prospectos.map(p => (
              <Option key={p.id} value={p.id}>
                {p.primer_nombre && p.primer_apellido 
                  ? `${p.primer_nombre} ${p.primer_apellido}`
                  : p.email || p.display_name || `ID: ${p.id}`
                }
              </Option>
            ))}
          </Select>
        </Form.Item>
        <CustomErrorMessage error={formErrors.prospectoId} />

        <Form.Item
          name="propiedadId"
          label="Propiedad"
        >
          <Select
            placeholder="Selecciona una propiedad"
            showSearch
            optionFilterProp="children"
            loading={loadingData}
          >
            {propiedades.map(p => (
              <Option key={p.id} value={p.id || ''}>
                {p.titulo}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <CustomErrorMessage error={formErrors.propiedadId} />

        <Form.Item
          name="estado"
          label="Estado"
        >
          <Select placeholder="Selecciona el estado">
            <Select.Option value="Agendada">Agendada</Select.Option>
            <Select.Option value="Aprobada">Aprobada</Select.Option>
            <Select.Option value="Completada">Completada</Select.Option>
            <Select.Option value="Cancelada">Cancelada</Select.Option>
          </Select>
        </Form.Item>
        <CustomErrorMessage error={formErrors.estado} />

        <Form.Item
          name="fecha"
          label="Fecha"
        >
          <DatePicker
            format="DD/MM/YYYY"
            placeholder="Selecciona fecha"
            className="w-full"
            disabledDate={current => current && current.isBefore(dayjs())}
          />
        </Form.Item>
        <CustomErrorMessage error={formErrors.fecha} />


        <Form.Item className="text-right mb-0">
          <Space>
            <Button 
              type="default" 
              disabled 
              aria-disabled="true" 
              title="Próximamente"
            >
              Añadir orden de visita
            </Button>
            <Button type="primary" onClick={handleCreate} loading={loading}>
              Crear Visita
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVisitaModal;
