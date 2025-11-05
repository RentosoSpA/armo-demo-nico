import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, Row, Col, Select, App } from 'antd';
import { useAuth } from '../../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { CustomTimePicker } from '../../components/common/CustomTimePicker';

const { Title } = Typography;
const { TextArea } = Input;

interface SignUpFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  nombre: string;
  nit: string;
  direccion: string;
  countryCode: string;
  telefono: string;
  sobreNosotros: string;
  mision: string;
  vision: string;
  agenteNombre: string;
  countryCodeAgente: string;
  agenteTelefono: string;
  lunes_inicio?: string;
  lunes_fin?: string;
  martes_inicio?: string;
  martes_fin?: string;
  miercoles_inicio?: string;
  miercoles_fin?: string;
  jueves_inicio?: string;
  jueves_fin?: string;
  viernes_inicio?: string;
  viernes_fin?: string;
  sabado_inicio?: string;
  sabado_fin?: string;
  domingo_inicio?: string;
  domingo_fin?: string;
}

const SignUp: React.FC = () => {
  const [form] = Form.useForm();
  const { signUp, loading, checkSession } = useAuth();
  const { message } = App.useApp();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formValues, setFormValues] = useState<Partial<SignUpFormValues>>({});
  const navigate = useNavigate();

  const defaultStartTime = '08:00';
  const defaultEndTime = '17:00';

  useEffect(() => {
    const check = async () => {
      const isValid = await checkSession();
      if (isValid) {
        navigate('/tablero');
      }
    };
    check();
  }, [checkSession, navigate]);

  const validatePasswords = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const password = form.getFieldValue('password');
    const confirmPassword = form.getFieldValue('confirmPassword');
    if (!passwordRegex.test(password)) {
      return 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo especial (d@$!%*?&)';
    }
    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  };

  const handleNextStep = async () => {
    console.log('[DEBUG] handleNextStep called, currentStep:', currentStep);
    try {
      if (currentStep === 0) {
        await form.validateFields(['email']);
        const stepValues = form.getFieldsValue(['email']);
        setFormValues(prev => ({ ...prev, ...stepValues }));
        setError(null);
        setCurrentStep(1);
      } else if (currentStep === 1) {
        await form.validateFields(['password', 'confirmPassword']);
        const errorMessage = validatePasswords();
        if (errorMessage) {
          setError(errorMessage);
          return;
        }
        const stepValues = form.getFieldsValue(['password', 'confirmPassword']);
        setFormValues(prev => ({ ...prev, ...stepValues }));
        setError(null);
        setCurrentStep(2);
      } else if (currentStep === 2) {
        await form.validateFields(['nombre', 'nit', 'direccion', 'countryCode', 'telefono', 'sobreNosotros']);
        const stepValues = form.getFieldsValue(['nombre', 'nit', 'direccion', 'countryCode', 'telefono', 'sobreNosotros']);
        setFormValues(prev => ({ ...prev, ...stepValues }));
        setError(null);
        setCurrentStep(3);
      } else if (currentStep === 3) {
        await form.validateFields(['mision', 'vision']);
        const stepValues = form.getFieldsValue(['mision', 'vision']);
        setFormValues(prev => ({ ...prev, ...stepValues }));
        setError(null);
        setCurrentStep(4);
      } else if (currentStep === 4) {
        await form.validateFields(['agenteNombre', 'countryCodeAgente', 'agenteTelefono']);
        const stepValues = form.getFieldsValue(['agenteNombre', 'countryCodeAgente', 'agenteTelefono']);
        setFormValues(prev => ({ ...prev, ...stepValues }));
        setError(null);
        setCurrentStep(5);
      } else if (currentStep === 5) {
        const stepValues = form.getFieldsValue(['lunes_inicio', 'lunes_fin', 'martes_inicio', 'martes_fin', 'miercoles_inicio', 'miercoles_fin', 'jueves_inicio', 'jueves_fin', 'viernes_inicio', 'viernes_fin', 'sabado_inicio', 'sabado_fin', 'domingo_inicio', 'domingo_fin']);
        setFormValues(prev => ({ ...prev, ...stepValues }));
        setError(null);
        setCurrentStep(6);
      }
    } catch {
      // Form validation error
    }
  };


  const handleSkip = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const allValues = { ...formValues };

      // Sign up user without empresa - only basic profile
      await signUp(allValues.email!, allValues.password!, {
        skip_empresa: true,
        full_name: '',
        phone: '',
      });

      message.success('Cuenta creada exitosamente. Confirma tu correo electrónico vía email para poder iniciar sesión.', 8);
      navigate('/auth/signin');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err?.message || 'Error en el registro. Verifica los datos e intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const onFinish = async (values: SignUpFormValues) => {
    console.log('[DEBUG] onFinish called, currentStep:', currentStep, 'steps.length:', steps.length);
    
    // FASE 2: Validación defensiva - Solo procesar si estamos en el último paso
    if (currentStep !== steps.length - 1) {
      console.log('[DEBUG] Not on last step, calling handleNextStep instead');
      handleNextStep();
      return;
    }

    console.log('[DEBUG] On last step, proceeding with signup');
    setError(null);
    setSubmitting(true);
    try {
      const allValues = { ...formValues, ...values };

      // FASE 2: Validación defensiva antes de usar .replace()
      const countryCodeAgente = allValues.countryCodeAgente || '+56';
      const agenteTelefono = allValues.agenteTelefono || '';

      // Sign up user with company data in metadata
      // The trigger will automatically create the empresa and agente records
      await signUp(allValues.email!, allValues.password!, {
        full_name: allValues.agenteNombre || '',
        phone: agenteTelefono,
        company_name: allValues.nombre || '',
        nit: allValues.nit || '',
        direccion: allValues.direccion || '',
        telefono: parseInt(agenteTelefono) || 0,
        codigo_telefonico: parseInt(countryCodeAgente.replace('+', '')) || 56,
        sobre_nosotros: allValues.sobreNosotros || '',
        mision: allValues.mision || '',
        vision: allValues.vision || '',
      });

      message.success('Cuenta creada exitosamente. Confirma tu correo electrónico vía email para poder iniciar sesión.', 8);
      navigate('/auth/signin');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err?.message || 'Error en el registro. Verifica los datos e intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    {
      title: 'Bienvenida',
      content: (
        <>
          <Form.Item
            label="Correo electrónico"
            name="email"
            rules={[
              { required: true, message: 'Por favor ingresa tu correo electrónico' },
              { type: 'email', message: 'El correo no es válido' },
            ]}
            className="signin-form-item--email"
          >
            <Input
              placeholder=""
              autoFocus
              size="large"
              aria-describedby="email-error"
              onPressEnter={(e) => {
                e.preventDefault();
                handleNextStep();
              }}
            />
          </Form.Item>
          <Form.Item className="signin-form-item--submit">
            <Button type="primary" onClick={handleNextStep} block size="large" className="signin-submit-button">
              Siguiente
            </Button>
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Contraseña',
      content: (
        <>
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Por favor ingresa la contraseña' }]}
            className="signin-form-item--password"
          >
            <Input.Password
              placeholder=""
              autoFocus
              size="large"
              onPressEnter={(e) => {
                e.preventDefault();
                handleNextStep();
              }}
            />
          </Form.Item>
          <Form.Item
            label="Confirmar contraseña"
            name="confirmPassword"
            rules={[{ required: true, message: 'Por favor confirma la contraseña' }]}
            className="signin-form-item--password"
          >
            <Input.Password
              placeholder=""
              size="large"
              onPressEnter={(e) => {
                e.preventDefault();
                handleNextStep();
              }}
            />
          </Form.Item>
          <Form.Item className="signin-form-item--submit">
            <Button type="primary" onClick={handleNextStep} block size="large" className="signin-submit-button">
              Siguiente
            </Button>
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Datos de la empresa',
      content: (
        <>
          <Form.Item
            name="nombre"
            label="Nombre de la empresa"
            rules={[{ required: true, message: 'Por favor ingresa el nombre de la empresa' }]}
            className="signin-form-item--email"
          >
            <Input placeholder="" size="large" />
          </Form.Item>
          <Form.Item
            name="nit"
            label="RUT"
            rules={[{ required: true, message: 'Por favor ingresa el RUT' }]}
            className="signin-form-item--email"
          >
            <Input placeholder="" size="large" />
          </Form.Item>
          <Form.Item
            name="direccion"
            label="Dirección"
            rules={[{ required: true, message: 'Por favor ingresa la dirección' }]}
            className="signin-form-item--email"
          >
            <Input placeholder="" size="large" />
          </Form.Item>
          <Form.Item label="Teléfono" required className="signin-form-item--email">
            <Input.Group compact>
              <Form.Item name="countryCode" initialValue="+56" noStyle rules={[{ required: true, message: 'Requerido' }]}>
                <Select
                  showSearch
                  style={{ width: '30%' }}
                  placeholder="Código"
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option?.label?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
                  }
                  options={[
                    { value: '+56', label: '🇨🇱 +56' },
                    { value: '+54', label: '🇦🇷 +54' },
                    { value: '+57', label: '🇨🇴 +57' },
                    { value: '+52', label: '🇲🇽 +52' },
                    { value: '+1', label: '🇺🇸 +1' },
                    { value: '+34', label: '🇪🇸 +34' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="telefono" noStyle rules={[{ required: true, message: 'Requerido' }]}>
                <Input style={{ width: '70%' }} placeholder="" size="large" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item
            name="sobreNosotros"
            label="Sobre nosotros"
            rules={[{ required: true, message: 'Por favor ingresa una descripción sobre la empresa' }]}
            className="signin-form-item--email"
          >
            <TextArea rows={4} placeholder="" />
          </Form.Item>
          <Form.Item className="signin-form-item--submit">
            <Button type="primary" onClick={handleNextStep} block size="large" className="signin-submit-button">
              Siguiente
            </Button>
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Cultura',
      content: (
        <>
          <Form.Item
            name="mision"
            label="Misión"
            rules={[{ required: true, message: 'Por favor ingresa la misión' }]}
            className="signin-form-item--email"
          >
            <TextArea rows={4} placeholder="" />
          </Form.Item>
          <Form.Item
            name="vision"
            label="Visión"
            rules={[{ required: true, message: 'Por favor ingresa la visión' }]}
            className="signin-form-item--email"
          >
            <TextArea rows={4} placeholder="" />
          </Form.Item>
          <Form.Item className="signin-form-item--submit">
            <Button type="primary" onClick={handleNextStep} block size="large" className="signin-submit-button">
              Siguiente
            </Button>
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Agente',
      content: (
        <>
          <Form.Item
            name="agenteNombre"
            label="Nombre del agente"
            rules={[{ required: true, message: 'Por favor ingresa el nombre del agente' }]}
            className="signin-form-item--email"
          >
            <Input placeholder="" size="large" />
          </Form.Item>
          <Form.Item label="Teléfono del agente" required className="signin-form-item--email">
            <Input.Group compact>
              <Form.Item name="countryCodeAgente" initialValue="+56" noStyle rules={[{ required: true, message: 'Requerido' }]}>
                <Select
                  showSearch
                  style={{ width: '30%' }}
                  placeholder="Código"
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    option?.label?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
                  }
                  options={[
                    { value: '+56', label: '🇨🇱 +56' },
                    { value: '+54', label: '🇦🇷 +54' },
                    { value: '+57', label: '🇨🇴 +57' },
                    { value: '+52', label: '🇲🇽 +52' },
                    { value: '+1', label: '🇺🇸 +1' },
                    { value: '+34', label: '🇪🇸 +34' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="agenteTelefono" noStyle rules={[{ required: true, message: 'Requerido' }]}>
                <Input style={{ width: '70%' }} placeholder="" size="large" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item className="signin-form-item--submit">
            <Button type="primary" onClick={handleNextStep} block size="large" className="signin-submit-button">
              Siguiente
            </Button>
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Horario',
      content: (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Typography.Text strong>Lunes</Typography.Text>
              <Form.Item name="lunes_inicio" label="Inicio">
                <CustomTimePicker defaultValue={defaultStartTime} />
              </Form.Item>
              <Form.Item name="lunes_fin" label="Fin">
                <CustomTimePicker defaultValue={defaultEndTime} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Typography.Text strong>Martes</Typography.Text>
              <Form.Item name="martes_inicio" label="Inicio">
                <CustomTimePicker defaultValue={defaultStartTime} />
              </Form.Item>
              <Form.Item name="martes_fin" label="Fin">
                <CustomTimePicker defaultValue={defaultEndTime} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Typography.Text strong>Miércoles</Typography.Text>
              <Form.Item name="miercoles_inicio" label="Inicio">
                <CustomTimePicker defaultValue={defaultStartTime} />
              </Form.Item>
              <Form.Item name="miercoles_fin" label="Fin">
                <CustomTimePicker defaultValue={defaultEndTime} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Typography.Text strong>Jueves</Typography.Text>
              <Form.Item name="jueves_inicio" label="Inicio">
                <CustomTimePicker defaultValue={defaultStartTime} />
              </Form.Item>
              <Form.Item name="jueves_fin" label="Fin">
                <CustomTimePicker defaultValue={defaultEndTime} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Typography.Text strong>Viernes</Typography.Text>
              <Form.Item name="viernes_inicio" label="Inicio">
                <CustomTimePicker defaultValue={defaultStartTime} />
              </Form.Item>
              <Form.Item name="viernes_fin" label="Fin">
                <CustomTimePicker defaultValue={defaultEndTime} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Typography.Text strong>Sábado</Typography.Text>
              <Form.Item name="sabado_inicio" label="Inicio">
                <CustomTimePicker defaultValue={defaultStartTime} />
              </Form.Item>
              <Form.Item name="sabado_fin" label="Fin">
                <CustomTimePicker defaultValue={defaultEndTime} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Typography.Text strong>Domingo</Typography.Text>
              <Form.Item name="domingo_inicio" label="Inicio">
                <CustomTimePicker defaultValue={defaultStartTime} />
              </Form.Item>
              <Form.Item name="domingo_fin" label="Fin">
                <CustomTimePicker defaultValue={defaultEndTime} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="signin-form-item--submit">
            <Button type="primary" onClick={handleNextStep} block size="large" className="signin-submit-button">
              Siguiente
            </Button>
          </Form.Item>
        </>
      ),
    },
    {
      title: 'Finalizar',
      content: (
        <>
          <Form.Item className="signin-form-item--submit">
            <Button type="primary" htmlType="submit" block size="large" className="signin-submit-button" loading={submitting}>
              Crear cuenta
            </Button>
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <div className="signin-main-row">
      <div className="signin-container">
        <Card className="signin-card">
          <Title level={2} className="signin-title title-text">
            Registrar nueva empresa
          </Title>
          {error && (
            <div
              className="signin-error"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            disabled={submitting || loading}
          >
            {steps[currentStep].content}
          </Form>
          {currentStep > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '16px' }}>
              <Button
                type="link"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="signup-back-button"
                aria-label="Volver al paso anterior"
              >
                Atrás
              </Button>
              {currentStep === 2 && (
                <Button
                  type="link"
                  onClick={handleSkip}
                  className="signup-skip-button"
                  disabled={submitting}
                  aria-label="Omitir información de empresa"
                >
                  Omitir
                </Button>
              )}
            </div>
          )}
          <div className="signin-footer-container">
            <span className="signin-footer-text">
              ¿Ya tienes cuenta?
            </span>
            <Button
              type="link"
              className="signin-link"
              onClick={() => navigate('/auth/signin')}
            >
              Inicia sesión
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
