import { Modal, Form, Input, Select, Button, App, Steps, InputNumber, DatePicker } from 'antd';
import { useEffect, useState } from 'react';
import type { ProspectoCreate } from '../../types/profile';
import { createProspecto } from '../../services/prospectos/prospectosServiceSupabase';

const { Option } = Select;

interface NuevoProspectoModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const NuevoProspectoModal = ({ open, onClose, onCreated }: NuevoProspectoModalProps) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { message } = App.useApp();

  const next = async () => {
    try {
      const currentStepFields =
        step === 0
          ? ['primerNombre', 'primerApellido', 'email', 'fechaNacimiento']
          : ['codigoTelefonico', 'telefono', 'tipoDocumento', 'documento'];

      await form.validateFields(currentStepFields);
      setStep(s => s + 1);
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  const prev = () => setStep(s => s - 1);

  const handleFinish = async () => {
    try {
      await form.validateFields();
      setLoading(true);

      const values = form.getFieldsValue(true);

      // Validate phone number
      const telefono = values.telefono?.toString().trim();
      if (!telefono || telefono.length < 7 || telefono.length > 15) {
        message.error('El número de teléfono debe tener entre 7 y 15 dígitos');
        setLoading(false);
        return;
      }

      const nuevoProspecto: ProspectoCreate = {
        source: 'manual',
        phone_e164: `+${values.codigo_telefonico}${telefono}`,
        email: values.email?.trim() || undefined,
        codigo_telefonico: values.codigo_telefonico,
        fecha_nacimiento: values.fecha_nacimiento?.format('YYYY-MM-DD') || undefined,
        genero: values.genero || undefined,
        documento: values.documento?.trim() || undefined,
        tipo_documento: values.tipo_documento || undefined,
        primer_apellido: values.primer_apellido?.trim(),
        segundo_apellido: values.segundo_apellido?.trim() || undefined,
        primer_nombre: values.primer_nombre?.trim(),
        segundo_nombre: values.segundo_nombre?.trim() || undefined,
        situacion_laboral: values.situacion_laboral || undefined,
        ingresos_mensuales: values.ingresos_mensuales || undefined,
        egresos_mensuales: values.egresos_mensuales || undefined,
      };

      await createProspecto(nuevoProspecto);

      message.success('Prospecto agregado correctamente');
      form.resetFields();
      setStep(0);
      onClose();
      onCreated();
    } catch (error: any) {
      console.error('Error al guardar:', error);
      
      // Enhanced error messages based on Supabase error codes
      let errorMessage = 'Error al crear el prospecto';
      
      if (error?.code === '23505') {
        errorMessage = 'Este teléfono o email ya está registrado';
      } else if (error?.code === '22007') {
        errorMessage = 'Formato de fecha inválido';
      } else if (error?.code === '23502') {
        errorMessage = 'Faltan campos obligatorios';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      // Reset form when modal opens
      form.resetFields();
      setStep(0);
    }
  }, [open, form]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Nuevo Prospecto"
      className="p-24"
      width={800}
      afterClose={() => {
        form.resetFields();
        setStep(0);
      }}
    >
      <Steps current={step} size="small" className="mb-24">
        <Steps.Step title="Información Personal" />
        <Steps.Step title="Contacto y Documentos" />
        <Steps.Step title="Información Adicional" />
      </Steps>

      <Form layout="vertical" form={form}>
        {step === 0 && (
          <>
            <Form.Item
              name="primerNombre"
              label="Primer Nombre"
              rules={[{ required: true, message: 'El primer nombre es requerido' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="segundoNombre" label="Segundo Nombre">
              <Input />
            </Form.Item>
            <Form.Item
              name="primerApellido"
              label="Primer Apellido"
              rules={[{ required: true, message: 'El primer apellido es requerido' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="segundoApellido" label="Segundo Apellido">
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'El email es requerido' },
                { type: 'email', message: 'Por favor ingresa un email válido' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="fechaNacimiento"
              label="Fecha de Nacimiento"
              rules={[{ required: true, message: 'La fecha de nacimiento es requerida' }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              name="genero"
              label="Género"
              rules={[{ required: true, message: 'El género es requerido' }]}
            >
              <Select placeholder="Selecciona el género">
                <Option value="Masculino">Masculino</Option>
                <Option value="Femenino">Femenino</Option>
                <Option value="Otro">Otro</Option>
                <Option value="Prefiero no decir">Prefiero no decir</Option>
              </Select>
            </Form.Item>
          </>
        )}

        {step === 1 && (
          <>
            <Form.Item
              name="codigoTelefonico"
              label="Código Telefónico"
              rules={[{ required: true, message: 'El código telefónico es requerido' }]}
            >
              <InputNumber className="w-full" placeholder="56" />
            </Form.Item>
            <Form.Item
              name="telefono"
              label="Teléfono"
              rules={[{ required: true, message: 'El teléfono es requerido' }]}
            >
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item
              name="tipoDocumento"
              label="Tipo de Documento"
              rules={[{ required: true, message: 'El tipo de documento es requerido' }]}
            >
              <Select placeholder="Selecciona el tipo de documento">
                <Option value="RUT">RUT</Option>
                <Option value="Pasaporte">Pasaporte</Option>
                <Option value="Cedula">Cédula de Identidad</Option>
                <Option value="Otro">Otro</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="documento"
              label="Número de Documento"
              rules={[{ required: true, message: 'El número de documento es requerido' }]}
            >
              <Input />
            </Form.Item>
          </>
        )}

        {step === 2 && (
          <>
            <Form.Item name="situacionLaboral" label="Situación Laboral">
              <Select placeholder="Selecciona la situación laboral">
                <Option value="Empleado">Empleado</Option>
                <Option value="Independiente">Independiente</Option>
                <Option value="Desempleado">Desempleado</Option>
                <Option value="Estudiante">Estudiante</Option>
                <Option value="Jubilado">Jubilado</Option>
                <Option value="Otro">Otro</Option>
              </Select>
            </Form.Item>
            <Form.Item name="ingresosMensuales" label="Ingresos Mensuales (CLP)">
              <InputNumber
                className="w-full"
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
            <Form.Item name="egresosMensuales" label="Egresos Mensuales (CLP)">
              <InputNumber
                className="w-full"
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </>
        )}

        <div className="d-flex justify-between mt-24">
          {step > 0 && (
            <Button onClick={prev} disabled={loading}>
              Anterior
            </Button>
          )}
          {step < 2 ? (
            <Button type="primary" onClick={next} disabled={loading}>
              Siguiente
            </Button>
          ) : (
            <Button type="primary" onClick={handleFinish} loading={loading}>
              Crear Prospecto
            </Button>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default NuevoProspectoModal;
