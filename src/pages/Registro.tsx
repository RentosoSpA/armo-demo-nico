import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Row,
  Col,
  Alert,
  Select,
  DatePicker,
  Steps,
} from 'antd';
import { createUser } from '../services/clientes/clientes';
import type { ProfileCreate } from '../types/profile';
// Removed Firebase error mapping - using simple error handling
import dayjs from 'dayjs';

const { Title } = Typography;
const { Step } = Steps;

const Registro: React.FC = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  /* useEffect(() => {
    const check = async () => {
      const isValid = await checkSession();
      if (isValid) {
      }
    };
    check();
  }, []);
 */

  const [countryCode, setCountryCode] = useState('+56');
  const countryCodes = [
    { value: 56, label: '+56' },
    { value: 54, label: '+54' },
    { value: 57, label: '+57' },
    { value: 1, label: '+1' },
    { value: 52, label: '+52' },
  ];

  const genderOptions = [
    { value: 'masculino', label: 'Masculino' },
    { value: 'femenino', label: 'Femenino' },
    { value: 'otro', label: 'Otro' },
  ];

  const idTypeOptions = [
    { value: 'RUT', label: 'RUT' },
    { value: 'Pasaporte', label: 'Pasaporte' },
    { value: 'Otro', label: 'Otro' },
  ];

  const situacionLaboralOptions = [
    { value: 'Empleado', label: 'Empleado' },
    { value: 'Independiente', label: 'Independiente' },
    { value: 'Desempleado', label: 'Desempleado' },
    { value: 'Estudiante', label: 'Estudiante' },
    { value: 'Pensionado', label: 'Pensionado' },
  ];

  /*  const handleNextStep = async () => {
    try {
      await form.validateFields(['email']);
      setEmail(form.getFieldValue('email'));
      setError(null);
      setCurrentStep(1);
    } catch {
      // Form validation error
    }
  };
 */
  const handlePrevStep = () => {
    setCurrentStep(0);
  };

  const onFinish = async (values: {
    email: string;
    primerNombre: string;
    segundoNombre: string;
    primerApellido: string;
    segundoApellido: string;
    telefono: string;
    fechaNacimiento: dayjs.Dayjs;
    genero: string;
    idNacional: string;
    tipoIdNacional: string;
    situacionLaboralActual: string;
    ingresoMensual: string;
    egresoMensual: string;
  }) => {
    setError(null);
    setSubmitting(true);
    try {
      await form.validateFields(['email']);
      setError(null);
      const profile: ProfileCreate = {
        user_id: '', // Will be set by backend
        full_name: `${values.primerNombre} ${values.primerApellido}`,
        phone: `${countryCode}${values.telefono}`,
      };
      
      await createUser(profile); // llama para crear el usuario
    } catch {

      setError('Error en el registro. Verifica los datos e intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    /* {
      title: 'Informacion personal',
      content: (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Primer nombre"
                name="primerNombre"
                rules={[{ required: true, message: 'Por favor ingresa tu primer nombre' }]}
              >
                <Input placeholder="Primer nombre" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Segundo nombre" name="segundoNombre">
                <Input placeholder="Segundo nombre (opcional)" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Primer apellido"
                name="primerApellido"
                rules={[{ required: true, message: 'Por favor ingresa tu primer apellido' }]}
              >
                <Input placeholder="Primer apellido" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Segundo apellido" name="segundoApellido">
                <Input placeholder="Segundo apellido (opcional)" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Fecha de nacimiento"
            name="fechaNacimiento"
            rules={[
              { required: true, message: 'Por favor ingresa tu fecha de nacimiento' },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.resolve();
                  }
                  const today = new Date();
                  const birthDate = value.toDate ? value.toDate() : value;
                  const age = today.getFullYear() - birthDate.getFullYear();
                  const m = today.getMonth() - birthDate.getMonth();
                  if (
                    age > 18 ||
                    (age === 18 && (m > 0 || (m === 0 && today.getDate() >= birthDate.getDate())))
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Debes tener al menos 18 años para registrarte'));
                },
              }),
            ]}
          >
            <DatePicker
              placeholder="Fecha de nacimiento"
              format="DD/MM/YYYY"
              defaultValue={dayjs().subtract(18, 'year')}
              className="registro-date-picker"
              disabledDate={current => {
                if (!current) return false;
                const today = new Date();
                const eighteenYearsAgo = new Date(
                  today.getFullYear() - 18,
                  today.getMonth(),
                  today.getDate()
                );
                return current.isAfter(eighteenYearsAgo, 'day');
              }}
            />
          </Form.Item>
          <Form.Item
            label="Género"
            name="genero"
            rules={[{ required: true, message: 'Por favor selecciona tu género' }]}
          >
            <Select placeholder="Selecciona tu género" options={genderOptions} />
          </Form.Item>
          <Form.Item
            label="Tipo de identificación"
            name="tipoIdNacional"
            rules={[{ required: true, message: 'Por favor selecciona el tipo de identificación' }]}
          >
            <Select placeholder="Tipo de identificación" options={idTypeOptions} />
          </Form.Item>
          <Form.Item
            label="Número de identificación"
            name="idNacional"
            rules={[
              { required: true, message: 'Por favor ingresa tu número de identificación' },
              {
                pattern: /^[0-9]+$/,
                message: 'El número de identificación solo debe contener números',
              },
            ]}
          >
            <Input placeholder="Número de identificación" />
          </Form.Item>
          <Form.Item
            label="Teléfono"
            name="telefono"
            rules={[
              { required: true, message: 'Por favor ingresa tu número de teléfono' },
              { pattern: /^[0-9]+$/, message: 'El teléfono solo debe contener números' },
            ]}
          >
            <Input
              placeholder="Teléfono"
              addonBefore={
                <Select value={countryCode} onChange={setCountryCode} options={countryCodes} />
              }
            />
          </Form.Item>
          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa tu correo electrónico' },
              { type: 'email', message: 'El correo no es válido' },
            ]}
          >
            <Input placeholder="Correo electrónico" autoFocus />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleNextStep} block>
              Siguiente
            </Button>
          </Form.Item>
        </>
      ),
    }, */
    {
      title: 'Información Laboral',
      content: (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Primer nombre"
                name="primerNombre"
                rules={[{ required: true, message: 'Por favor ingresa tu primer nombre' }]}
              >
                <Input placeholder="Primer nombre" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Segundo nombre" name="segundoNombre">
                <Input placeholder="Segundo nombre (opcional)" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Primer apellido"
                name="primerApellido"
                rules={[{ required: true, message: 'Por favor ingresa tu primer apellido' }]}
              >
                <Input placeholder="Primer apellido" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Segundo apellido" name="segundoApellido">
                <Input placeholder="Segundo apellido (opcional)" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="Fecha de nacimiento"
            name="fechaNacimiento"
            rules={[
              { required: true, message: 'Por favor ingresa tu fecha de nacimiento' },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.resolve();
                  }
                  const today = new Date();
                  const birthDate = value.toDate ? value.toDate() : value;
                  const age = today.getFullYear() - birthDate.getFullYear();
                  const m = today.getMonth() - birthDate.getMonth();
                  if (
                    age > 18 ||
                    (age === 18 && (m > 0 || (m === 0 && today.getDate() >= birthDate.getDate())))
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Debes tener al menos 18 años para registrarte'));
                },
              }),
            ]}
          >
            <DatePicker
              placeholder="Fecha de nacimiento"
              format="DD/MM/YYYY"
              defaultValue={dayjs().subtract(18, 'year')}
              className="registro-date-picker"
              disabledDate={current => {
                if (!current) return false;
                const today = new Date();
                const eighteenYearsAgo = new Date(
                  today.getFullYear() - 18,
                  today.getMonth(),
                  today.getDate()
                );
                return current.isAfter(eighteenYearsAgo, 'day');
              }}
            />
          </Form.Item>
          <Form.Item
            label="Género"
            name="genero"
            rules={[{ required: true, message: 'Por favor selecciona tu género' }]}
          >
            <Select placeholder="Selecciona tu género" options={genderOptions} />
          </Form.Item>
          <Form.Item
            label="Tipo de identificación"
            name="tipoIdNacional"
            rules={[{ required: true, message: 'Por favor selecciona el tipo de identificación' }]}
          >
            <Select placeholder="Tipo de identificación" options={idTypeOptions} />
          </Form.Item>
          <Form.Item
            label="Número de identificación"
            name="idNacional"
            rules={[
              { required: true, message: 'Por favor ingresa tu número de identificación' },
              {
                pattern: /^[0-9]+$/,
                message: 'El número de identificación solo debe contener números',
              },
            ]}
          >
            <Input placeholder="Número de identificación" />
          </Form.Item>
          <Form.Item
            label="Teléfono"
            name="telefono"
            rules={[
              { required: true, message: 'Por favor ingresa tu número de teléfono' },
              { pattern: /^[0-9]+$/, message: 'El teléfono solo debe contener números' },
            ]}
          >
            <Input
              placeholder="Teléfono"
              addonBefore={
                <Select value={countryCode} onChange={setCountryCode} options={countryCodes} />
              }
            />
          </Form.Item>
          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa tu correo electrónico' },
              { type: 'email', message: 'El correo no es válido' },
            ]}
          >
            <Input placeholder="Correo electrónico" autoFocus />
          </Form.Item>
          <Form.Item
            label="Situación laboral actual"
            name="situacionLaboralActual"
            rules={[{ required: true, message: 'Por favor selecciona tu género' }]}
          >
            <Select
              placeholder="Selecciona tu situación laboral actual"
              options={situacionLaboralOptions}
            />
          </Form.Item>

          <Form.Item
            label="Ingresos mensuales"
            name="ingresoMensual"
            rules={[
              { required: false, message: 'Por favor ingresa tu número de identificación' },
              {
                pattern: /^[0-9]+$/,
                message: 'El número de identificación solo debe contener números',
              },
            ]}
          >
            <Input placeholder="Ingresos mensuales" />
          </Form.Item>
          <Form.Item
            label="Egresos mensuales"
            name="egresoMensual"
            rules={[
              { required: false, message: 'Por favor ingresa tu número de identificación' },
              {
                pattern: /^[0-9]+$/,
                message: 'El número de identificación solo debe contener números',
              },
            ]}
          >
            <Input placeholder="Egresos mensuales" />
          </Form.Item>
          <Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Button onClick={handlePrevStep} block>
                  Anterior
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={submitting /* || loading */}
                >
                  Crear Cuenta
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <Row justify="center" align="middle" className="registro-main-row">
      <Col xs={24} sm={20} md={16} lg={12} xl={10}>
        <Card className="registro-card">
          <Title level={2} className="title-text registro-title">
            Crear Cuenta
          </Title>
          {error && <Alert message={error} type="error" showIcon className="registro-error-alert" />}

          <Steps current={currentStep} className="registro-steps">
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            disabled={submitting /*  || loading */}
          >
            {steps[currentStep].content}
          </Form>
          {/*
          <Button type="link" block onClick={() => navigate('/auth/signin')}>
            ¿Ya tienes cuenta? Inicia sesión
          </Button> */}
        </Card>
      </Col>
    </Row>
  );
};

export default Registro;
