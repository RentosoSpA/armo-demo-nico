import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Col,
  Checkbox,
  Upload,
  Card,
  Typography,
  message,
  Divider,
  Radio,
} from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { UploadFile } from 'antd/es/upload/interface';
import { TipoPropiedad, EstadoPropiedad, TipoOperacion, Divisa, Banco, Region, type Propiedad } from '../../types/propiedad';
import { useUserStore } from '../../store/userStore';
import { usePropietarioStore } from '../../store/propietarioStore';
import type { Propietario } from '../../types/propietario';
import { createPropiedad, updatePropiedad } from '../../services/mock/propiedadesServiceMock';
import { uploadImage } from '../../services/multimedia/imagenesServiceSupabase';
import AgregarPropietarioModal from '../propietarios/AgregarPropietarioModal';
import dayjs from 'dayjs';
import { useFormDraft } from '../../hooks/useFormDraft';
import { getComunasByRegion } from '../../constants/regionesComunas';
import MapSelector from '../common/MapSelector';
import { getFormMode as getFormModeFromConfig, getStepsForMode, STEP_TITLES } from './formConfig';
import PropertyWizard from './PropertyWizard';
import BearProgressBar from './BearProgressBar';
import { StepWrapper } from './form-components/StepWrapper';
import { FieldGrid } from './form-components/FieldGrid';
import { getCaracteristicasForType } from './caracteristicasConfig';
import { DynamicFieldRenderer } from './form-components/DynamicFieldRenderer';
import '../../styles/components/_property-form-global.scss';
import '../../styles/components/_property-form-dark-inputs.scss';

const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

interface Props {
  onCreated?: () => void;
  onUpdated?: () => void;
  initialData?: Propiedad | null;
  mode?: 'create' | 'edit';
  userId?: string; // Para el storageKey del borrador
}

type StepKey = 'tipo-operacion' | 'precio' | 'caracteristicas' | 'ubicacion' | 'multimedia' | 'amenities' | 'amenities_servicios_y_entorno' | 'descripcion' | 'medios' | 'adicionales';

const FormPropiedad = ({ onCreated, onUpdated, initialData, mode = 'create', userId }: Props) => {
  console.log('📝 FormPropiedad: Component loaded with mode:', mode, 'initialData:', initialData);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<StepKey>('tipo-operacion');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const { empresa } = useUserStore();
  const { propietarios, fetchPropietarios, loading: propietariosLoading } = usePropietarioStore();
  const [photoFileList, setPhotoFileList] = useState<UploadFile[]>([]);
  const [planoFileList, setPlanoFileList] = useState<UploadFile[]>([]);
  const [propietarioModalVisible, setPropietarioModalVisible] = useState(false);
  const [availableComunas, setAvailableComunas] = useState<string[]>([]);
  // Removed unused state variables - now using form values directly
  const [coordinates, setCoordinates] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });

  // Custom hook para obtener valores del form con fallback
  const useFormValue = (fieldName: string) => {
    const watchedValue = Form.useWatch(fieldName, form);
    
    // Fallback: si useWatch devuelve undefined, usar getFieldValue directamente
    if (watchedValue === undefined) {
      return form.getFieldValue(fieldName);
    }
    
    return watchedValue;
  };

  // Watch form values for reactive updates
  const tipoPropiedad = useFormValue('tipo');
  const tipoOperacion = useFormValue('operacion') || [];

  // ✅ FASE 3: Persistencia de borradores
  const storageKey = mode === 'create' 
    ? `rentoso:draft:propiedad:${userId || 'unknown'}`
    : `rentoso:draft:propiedad:${userId || 'unknown'}:${initialData?.id || 'edit'}`;
  
  const { clearDraft, saveDraft } = useFormDraft({
    form,
    storageKey,
    ttlMs: 7 * 24 * 60 * 60 * 1000, // 7 días
    enabled: mode === 'create', // Solo en modo creación
  });


  const fetchData = useCallback(async () => {
    try {
      setLoadingData(true);
      await fetchPropietarios(empresa?.id || 'mock');
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Error al cargar los datos');
    } finally {
      setLoadingData(false);
    }
  }, [empresa?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      console.log('🔄 FormPropiedad: Setting form values from initialData:', initialData);

      // Set initial step - always start at tipo-operacion for consistency
      setCurrentStep('tipo-operacion');

      const initialValues = {
        // Campos básicos del mock
        titulo: initialData.titulo,
        descripcion: initialData.descripcion || '',
        tipo: initialData.tipo,
        precio_venta: initialData.precio || initialData.precioVenta || initialData.propiedadVenta?.precioUF,
        divisa: initialData.divisa || initialData.propiedadVenta?.divisa || Divisa.CLP,

        // Mapear operación desde el mock - ahora es un array
        operacion: (() => {
          if (Array.isArray(initialData.operacion)) return initialData.operacion;
          const ops = [];
          if (initialData.venta || initialData.operacion === 'Venta') ops.push(TipoOperacion.Venta);
          if (initialData.arriendo || initialData.operacion === 'Renta') ops.push(TipoOperacion.Renta);
          return ops.length > 0 ? ops : [TipoOperacion.Venta];
        })(),

        // Campos de ubicación
        direccion: initialData.direccion || '',
        nombre_calle: initialData.nombreCalle || '',
        numero_calle: initialData.numeroCalle || '',
        unidad: initialData.unidad || '',
        letra: initialData.letra || '',
        comuna: initialData.comuna || '',
        region: initialData.region || '',

        // Características de la propiedad
        habitaciones: initialData.habitaciones || 0,
        banos: initialData.banos || 0,
        suites: initialData.suites || 0,
        plazas_servicio: initialData.plazasServicio || 0,
        m2_terreno: initialData.areaTotal || initialData.m2Terreno || 0,
        m2_construidos: initialData.areaConstruida || initialData.m2Construidos || 0,
        m2_terraza: initialData.m2Terraza || 0,
        num_estacionamientos: initialData.numEstacionamientos || initialData.estacionamientos || 0,
        num_bodegas: initialData.numBodegas || initialData.bodegas || 0,
        piso: initialData.piso || 0,
        tipo_piso: initialData.tipo_piso || undefined,
        tipo_departamento: initialData.tipo_departamento || undefined,
        recepcion_final: initialData.recepcion_final || undefined,
        orientacion: initialData.orientacion || undefined,
        anio_construccion: initialData.anioConstruccion || '',

        // Propietario - intentar primero propietario_id (mock), luego propietario.id (Supabase)
        propietario_id: (initialData as any).propietario_id || initialData.propietarioId || initialData.propietario?.id,

        // Campos de arriendo/venta
        disponible_desde: initialData.propiedadArriendo?.disponibleDesde ? dayjs(initialData.propiedadArriendo.disponibleDesde) : undefined,
        gastos_comunes: initialData.propiedadArriendo?.gastosComunes || initialData.gastosComunes,

        // Campos financieros
        banco: initialData.banco,
        hipoteca: initialData.hipoteca,
        deuda: initialData.deuda,

        // Valores por defecto
        mostrar_mapa: 'si',
        enviar_coordenadas: 'si',
        valor_por_m2: false,

        // Amenidades básicas
        amoblado: initialData.amenidades?.amoblado || false,
        cocina: initialData.amenidades?.cocina || false,
        balcon: initialData.amenidades?.balcon || false,
        jardin: initialData.amenidades?.jardin || false,
        wifi: initialData.amenidades?.wifi || false,
        garage: initialData.amenidades?.garage || false,
        zona_fumador: initialData.amenidades?.zonaFumador || false,
        lavaplatos: initialData.amenidades?.lavaplatos || false,
        lavadora: initialData.amenidades?.lavadora || false,
        tv_cable: initialData.amenidades?.tvCable || false,

        // Amenidades del condominio/edificio
        en_condominio: initialData.amenidades?.enCondominio || false,
        permite_mascotas: initialData.amenidades?.permiteMascotas || false,
        piscina: initialData.amenidades?.piscina || false,
        gimnasio: initialData.amenidades?.gimnasio || false,
        sauna: initialData.amenidades?.sauna || false,
        jacuzzi: initialData.amenidades?.jacuzzi || false,
        cancha_tenis: initialData.amenidades?.canchaTenis || false,

        // Amenidades adicionales
        recibos: initialData.amenidades?.recibos || false,
        llaves_oficina: initialData.amenidades?.llavesOficina || false,
        tiene_letrero: initialData.amenidades?.tieneLetrero || false,
        bodega: initialData.amenidades?.bodega || false,
        pieza_servicio: initialData.amenidades?.piezaServicio || false,
        Regularizada: initialData.amenidades?.regularizada || false,

        // Servicios
        agua: initialData.amenidades?.agua || false,
        caldera: initialData.amenidades?.caldera || false,
        gas_natural: initialData.amenidades?.gasNatural || false,
        luz: initialData.amenidades?.luz || false,
        alcantarillado: initialData.amenidades?.alcantarillado || false,

        // Ambientes
        terraza: false,
        patio: false,

        // Estado de la propiedad
        estado: initialData.estado || EstadoPropiedad.Disponible
      };

      console.log('📋 FormPropiedad: Mapped initial values:', initialValues);
      form.setFieldsValue(initialValues);

      // Set available comunas if region is present
      if (initialData.region) {
        setAvailableComunas(getComunasByRegion(initialData.region));
      }

      // Set coordinates if present
      if (initialData.lat !== undefined && initialData.lng !== undefined) {
        setCoordinates({
          lat: initialData.lat,
          lng: initialData.lng,
        });
      }
    }
  }, [initialData, mode, form]);

  const handleCancel = () => {
    clearDraft(); // ✅ Limpiar borrador al cancelar
    navigate('/propiedades');
  };

  const handlePhotoUpload = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setPhotoFileList(newFileList);
  };

  const handlePlanoUpload = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setPlanoFileList(newFileList);
  };

  // Función para construir dirección completa en formato chileno
  const buildDireccionCompleta = () => {
    const nombreCalle = form.getFieldValue('nombre_calle') || '';
    const numeroCalle = form.getFieldValue('numero_calle') || '';
    const numeroDepto = form.getFieldValue('numero_depto') || '';
    const letra = form.getFieldValue('letra') || '';
    const comuna = form.getFieldValue('comuna') || '';
    const region = form.getFieldValue('region') || '';

    // Construir dirección en formato chileno: "Nombre Calle N° [número] [letra], [numDepto] "
    let direccion = nombreCalle;

    if (numeroCalle) {
      direccion += ` ${numeroCalle}`;
    }

    if (letra) {
      direccion += ` ${letra}`;
    }

    if (numeroDepto) {
      direccion += `, Depto ${numeroDepto}`;
    }
  
    if (region) {
      direccion += `, ${region}`;
    }
    if (comuna) {
      direccion += `, ${comuna}`;
    }

    // Actualizar el campo de dirección completa
    if (direccion.trim()) {
      form.setFieldValue('direccion', direccion.trim());
    }

  };

  const handleFinish = async () => {
    try {
      setLoading(true);

      if (!empresa?.id) {
        message.error('No se pudo identificar la empresa');
        return;
      }

      // ✅ VALIDACIÓN COMPLETA: Validar TODOS los campos antes de enviar
      const values = await form.validateFields();
      
      console.log('✅ Form validation passed. All form values:', values);
      console.log('🔑 propietario_id value:', values.propietario_id);
      console.log('📋 All form field names:', Object.keys(values));

      // ✅ VALIDACIÓN EXPLÍCITA: Verificar que propietario_id no sea null/undefined
      if (!values.propietario_id || values.propietario_id.trim() === '') {
        console.error('❌ propietario_id validation failed:', values.propietario_id);
        message.error('Debe seleccionar un propietario');
        setCurrentStep('caracteristicas');
        return;
      }
      
      console.log('✅ propietario_id validation passed:', values.propietario_id);

      // Convert date fields
      if (values.disponible_desde) {
        values.disponible_desde = values.disponible_desde.format('YYYY-MM-DD');
      }

      // Add coordinates to values
      values.lat = coordinates.lat;
      values.lng = coordinates.lng;

      let response;
      if (mode === 'edit' && initialData) {
        response = await updatePropiedad(initialData.id, values);
        message.success('Propiedad actualizada exitosamente');
        onUpdated?.();
      } else {
        response = await createPropiedad(values);
        clearDraft(); // ✅ Limpiar borrador al crear exitosamente
        message.success('Propiedad creada exitosamente');
        onCreated?.();
      }

      // Upload photos if any
      if (photoFileList.length > 0 && response.id) {
        for (const file of photoFileList) {
          if (file.originFileObj) {
            try {
              await uploadImage(response.id, file.originFileObj, 'galeria');
            } catch (error) {
              console.error('Error uploading photo:', error);
              message.warning('Algunas imágenes no se pudieron subir');
            }
          }
        }
      }

      // Upload planos if any
      if (planoFileList.length > 0 && response.id) {
        for (const file of planoFileList) {
          if (file.originFileObj) {
            try {
              await uploadImage(response.id, file.originFileObj, 'plano');
            } catch (error) {
              console.error('Error uploading plano:', error);
              message.warning('Algunos planos no se pudieron subir');
            }
          }
        }
      }

      navigate('/propiedades');
    } catch (error) {
      console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} property:`, error);
      message.error(`Error al ${mode === 'edit' ? 'actualizar' : 'crear'} la propiedad`);
    } finally {
      setLoading(false);
    }
  };

  const handlePropietarioCreated = async () => {
    await fetchData();
    setPropietarioModalVisible(false);
  };

  const handleRegionChange = (region: string) => {
    const comunas = getComunasByRegion(region);
    setAvailableComunas(comunas);
    // Clear comuna field when region changes
    form.setFieldValue('comuna', undefined);
    buildDireccionCompleta();
  };

  // Step 1: Tipo y operación con wizard
  const renderTipoOperacionStep = () => (
    <div style={{ display: currentStep === 'tipo-operacion' ? 'flex' : 'none', flex: 1, flexDirection: 'column', minHeight: 0, alignItems: 'stretch' }}>
      <PropertyWizard
        form={form}
        onComplete={() => {
          // Avanzar al siguiente step
          const formMode = getFormMode();
          const steps = getStepsForMode(formMode);
          const currentIndex = steps.indexOf('tipo-operacion');
          if (currentIndex < steps.length - 1) {
            setCurrentStep(steps[currentIndex + 1] as StepKey);
          }
        }}
      />
    </div>
  );

  // Helper function to get the form mode
  const getFormMode = (): 'agricola-renta' | 'agricola-venta' | 'bodega-renta' | 'bodega-venta' | 'casa-renta' | 'casa-renta-temporal' | 'casa-venta' | 'departamento-renta' | 'departamento-renta-temporal' | 'departamento-venta' | 'estacionamiento-renta' | 'estacionamiento-venta' | 'hotel-renta' | 'hotel-venta' | 'industrial-renta' | 'industrial-venta' | 'llave-negocio-renta' | 'llave-negocio-venta' | 'local-comercial-renta' | 'local-comercial-venta' | 'oficina-renta' | 'oficina-venta' | 'parcela-renta' | 'parcela-venta' | 'sitio-renta' | 'sitio-venta' | 'terreno-renta' | 'terreno-venta' | 'normal' | string => {
    const tipo = tipoPropiedad;
    const operacion = tipoOperacion || [];
    if (tipo === TipoPropiedad.Agricola) {
      if (operacion.includes(TipoOperacion.Renta)) return 'agricola-renta';
      if (operacion.includes(TipoOperacion.Venta)) return 'agricola-venta';
    }
    if (tipo === TipoPropiedad.Bodega) {
      if (operacion.includes(TipoOperacion.Renta)) return 'bodega-renta';
      if (operacion.includes(TipoOperacion.Venta)) return 'bodega-venta';
    }
    if (tipo === TipoPropiedad.Casa) {
      const hasRenta = operacion.includes(TipoOperacion.Renta);
      const hasRentaTemporal = operacion.includes(TipoOperacion.RentaTemporal);
      const hasVenta = operacion.includes(TipoOperacion.Venta);
      if (hasRentaTemporal && hasRenta && hasVenta) return 'casa-renta-temporal-renta-venta';
      if (hasRentaTemporal && hasRenta) return 'casa-renta-temporal-renta';
      if (hasRentaTemporal && hasVenta) return 'casa-renta-temporal-venta';
      if (hasRenta && hasVenta) return 'casa-renta-venta';
      if (hasRentaTemporal) return 'casa-renta-temporal';
      if (hasRenta) return 'casa-renta';
      if (hasVenta) return 'casa-venta';
    }
    if (tipo === TipoPropiedad.Departamento) {
      if (operacion.includes(TipoOperacion.RentaTemporal)) return 'departamento-renta-temporal';
      if (operacion.includes(TipoOperacion.Renta)) return 'departamento-renta';
      if (operacion.includes(TipoOperacion.Venta)) return 'departamento-venta';
    }
    if (tipo === TipoPropiedad.Estacionamiento) {
      if (operacion.includes(TipoOperacion.Renta)) return 'estacionamiento-renta';
      if (operacion.includes(TipoOperacion.Venta)) return 'estacionamiento-venta';
    }
    if (tipo === TipoPropiedad.Hotel) {
      if (operacion.includes(TipoOperacion.Renta)) return 'hotel-renta';
      if (operacion.includes(TipoOperacion.Venta)) return 'hotel-venta';
    }
    if (tipo === TipoPropiedad.Industrial) {
      if (operacion.includes(TipoOperacion.Renta)) return 'industrial-renta';
      if (operacion.includes(TipoOperacion.Venta)) return 'industrial-venta';
    }
    if (tipo === TipoPropiedad.LlaveDeNegocio) {
      if (operacion.includes(TipoOperacion.Renta)) return 'llave-negocio-renta';
      if (operacion.includes(TipoOperacion.Venta)) return 'llave-negocio-venta';
    }
    if (tipo === TipoPropiedad.LocalComercial) {
      if (operacion.includes(TipoOperacion.Renta)) return 'local-comercial-renta';
      if (operacion.includes(TipoOperacion.Venta)) return 'local-comercial-venta';
    }
    if (tipo === TipoPropiedad.Oficina) {
      if (operacion.includes(TipoOperacion.Renta)) return 'oficina-renta';
      if (operacion.includes(TipoOperacion.Venta)) return 'oficina-venta';
    }
    if (tipo === TipoPropiedad.Parcela) {
      if (operacion.includes(TipoOperacion.Renta)) return 'parcela-renta';
      if (operacion.includes(TipoOperacion.Venta)) return 'parcela-venta';
    }
    if (tipo === TipoPropiedad.Sitio) {
      if (operacion.includes(TipoOperacion.Renta)) return 'sitio-renta';
      if (operacion.includes(TipoOperacion.Venta)) return 'sitio-venta';
    }
    if (tipo === TipoPropiedad.Terreno) {
      if (operacion.includes(TipoOperacion.Renta)) return 'terreno-renta';
      if (operacion.includes(TipoOperacion.Venta)) return 'terreno-venta';
    }
    return 'normal';
  };

  const formModeDynamic = getFormModeFromConfig(
    tipoPropiedad,
    tipoOperacion || []
  );
  
  // Usar configuración centralizada de formConfig.ts
  const stepKeys = getStepsForMode(formModeDynamic);
  const steps = stepKeys.map((key: string, index: number) => ({
    key: key as StepKey,
    title: STEP_TITLES[key] || key,
    number: index + 1
  }));


  // Step 2: Precio
  const renderPrecioStep = () => {
    const formMode = getFormMode();

    // Si es Agrícola + Renta, mostrar solo campos específicos
    if (formMode === 'agricola-renta') {
      return (
        <StepWrapper
          title="Precio y Comisión"
          className={currentStep === 'precio' ? '' : 'd-none'}
        >
          <FieldGrid>
            <Col span={12}>
              <Form.Item
                name="precio_venta"
                label="Precio"
                rules={[{ required: true, message: 'Ingrese el precio' }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="0.00"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="divisa"
                label="Moneda"
                rules={[{ required: true, message: 'Seleccione la moneda' }]}
              >
                <Select placeholder="Seleccionar moneda">
                  <Option value="CLP">CLP</Option>
                  <Option value="UF">UF</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="propietario_id"
                label="Propietario"
                rules={[{ required: true, message: 'Seleccione un propietario' }]}
              >
                <Select
                  placeholder="Seleccionar propietario"
                  loading={loadingData || propietariosLoading}
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <div style={{ padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => setPropietarioModalVisible(true)}
                          className="w-full text-left"
                        >
                          Agregar nuevo propietario
                        </Button>
                      </div>
                    </>
                  )}
                >
                  {propietarios.map(propietario => (
                    <Option key={propietario.id} value={propietario.id}>
                      {propietario.nombre} - {propietario.email}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            

            <Col span={12}>
              <Form.Item name="precio_tasacion" label="Precio de Tasación">
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="Precio de tasación"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="gastos_comunes" label="Gastos Comunes">
                <InputNumber className="w-full" min={0} placeholder="Gastos comunes" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contribuciones" label="Contribuciones">
                <InputNumber className="w-full" min={0} placeholder="Contribuciones" />
              </Form.Item>
            </Col>
          </FieldGrid>
        </StepWrapper>
      );
    }

    // Si es Agrícola + Venta, mostrar solo campos específicos
    if (formMode === 'agricola-venta') {
      return (
        <StepWrapper
          title="Precio y Comisión"
          className={currentStep === 'precio' ? '' : 'd-none'}
        >
          <FieldGrid>
            <Col span={12}>
              <Form.Item
                name="precio_venta"
                label="Precio"
                rules={[{ required: true, message: 'Ingrese el precio' }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="0.00"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="divisa"
                label="Moneda"
                rules={[{ required: true, message: 'Seleccione la moneda' }]}
              >
                <Select placeholder="Seleccionar moneda">
                  <Option value="CLP">CLP</Option>
                  <Option value="UF">UF</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="propietario_id"
                label="Propietario"
                rules={[{ required: true, message: 'Seleccione un propietario' }]}
              >
                <Select
                  placeholder="Seleccionar propietario"
                  loading={loadingData || propietariosLoading}
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <div style={{ padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => setPropietarioModalVisible(true)}
                          className="w-full text-left"
                        >
                          Agregar nuevo propietario
                        </Button>
                      </div>
                    </>
                  )}
                >
                  {propietarios.map(propietario => (
                    <Option key={propietario.id} value={propietario.id}>
                      {propietario.nombre} - {propietario.email}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="rol" label="Rol">
                <Input placeholder="Rol" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="gastos_comunes" label="Gastos Comunes">
                <InputNumber className="w-full" min={0} placeholder="Gastos comunes" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="contribuciones" label="Contribuciones">
                <InputNumber className="w-full" min={0} placeholder="Contribuciones" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="deuda" label="Deuda">
                <Input placeholder="Deuda" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="hipoteca" label="Hipoteca">
                <Input placeholder="Hipoteca" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="banco" label="Banco">
                <Select placeholder="Seleccionar banco" allowClear>
                  {Object.values(Banco).map(banco => (
                    <Option key={banco} value={banco}>{banco}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="precio_tasacion" label="Precio de Tasación">
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="Precio de tasación"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="acepta_permuta" valuePropName="checked">
                <Checkbox>Acepta permuta</Checkbox>
              </Form.Item>
            </Col>
          </FieldGrid>
        </StepWrapper>
      );
    }

    // Si es Estacionamiento + Renta, mostrar campos específicos
    if (formMode === 'estacionamiento-renta') {
      return (
        <StepWrapper
          title="Precio y Comisión"
          className={currentStep === 'precio' ? '' : 'd-none'}
        >
          <FieldGrid>
            <Col span={12}>
              <Form.Item
                name="precio_venta"
                label="Precio"
                rules={[{ required: true, message: 'Ingrese el precio' }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="0.00"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="divisa"
                label="Moneda"
                rules={[{ required: true, message: 'Seleccione la moneda' }]}
              >
                <Select placeholder="Seleccionar moneda">
                  <Option value="CLP">CLP</Option>
                  <Option value="UF">UF</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="propietario_id"
                label="Propietario"
                rules={[{ required: true, message: 'Seleccione un propietario' }]}
              >
                <Select
                  placeholder="Seleccionar propietario"
                  loading={loadingData || propietariosLoading}
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <div style={{ padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => setPropietarioModalVisible(true)}
                          className="w-full text-left"
                        >
                          Agregar nuevo propietario
                        </Button>
                      </div>
                    </>
                  )}
                >
                  {propietarios.map(propietario => (
                    <Option key={propietario.id} value={propietario.id}>
                      {propietario.nombre} - {propietario.email}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            

            <Col span={8}>
              <Form.Item name="precio_tasacion" label="Precio de Tasación">
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="Precio de tasación"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="gastos_comunes" label="Gastos Comunes">
                <InputNumber className="w-full" min={0} placeholder="Gastos comunes" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="contribuciones" label="Contribuciones">
                <InputNumber className="w-full" min={0} placeholder="Contribuciones" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="deuda" label="Deuda">
                <Input placeholder="Deuda" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="hipoteca" label="Hipoteca">
                <Input placeholder="Hipoteca" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="banco" label="Banco">
                <Select placeholder="Seleccionar banco" allowClear>
                  {Object.values(Banco).map(banco => (
                    <Option key={banco} value={banco}>{banco}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="requiere_aval" valuePropName="checked">
                <Checkbox>Requiere aval</Checkbox>
              </Form.Item>
            </Col>
          </FieldGrid>
        </StepWrapper>
      );
    }

    // Si es Estacionamiento + Venta, mostrar campos específicos
    if (formMode === 'estacionamiento-venta') {
      return (
        <StepWrapper
          title="Precio y Comisión"
          className={currentStep === 'precio' ? '' : 'd-none'}
        >
          <FieldGrid>
            <Col span={12}>
              <Form.Item
                name="precio_venta"
                label="Precio"
                rules={[{ required: true, message: 'Ingrese el precio' }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="0.00"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="divisa"
                label="Moneda"
                rules={[{ required: true, message: 'Seleccione la moneda' }]}
              >
                <Select placeholder="Seleccionar moneda">
                  <Option value="CLP">CLP</Option>
                  <Option value="UF">UF</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="propietario_id"
                label="Propietario"
                rules={[{ required: true, message: 'Seleccione un propietario' }]}
              >
                <Select
                  placeholder="Seleccionar propietario"
                  loading={loadingData || propietariosLoading}
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <div style={{ padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => setPropietarioModalVisible(true)}
                          className="w-full text-left"
                        >
                          Agregar nuevo propietario
                        </Button>
                      </div>
                    </>
                  )}
                >
                  {propietarios.map(propietario => (
                    <Option key={propietario.id} value={propietario.id}>
                      {propietario.nombre} - {propietario.email}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="precio_tasacion" label="Precio de Tasación">
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="Precio de tasación"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="gastos_comunes" label="Gastos comunes">
                <InputNumber className="w-full" min={0} placeholder="Gastos comunes" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="contribuciones" label="Contribuciones">
                <InputNumber className="w-full" min={0} placeholder="Contribuciones" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="acepta_permuta" valuePropName="checked">
                <Checkbox>Acepta permuta</Checkbox>
              </Form.Item>
            </Col>
          </FieldGrid>
        </StepWrapper>
      );
    }

    // Si es Casa + Renta, mostrar campos específicos
    if (formMode === 'casa-renta') {
      return (
        <StepWrapper
          title="Precio y Comisión"
          className={currentStep === 'precio' ? '' : 'd-none'}
        >
          <FieldGrid>
            <Col span={12}>
              <Form.Item
                name="precio_venta"
                label="Precio"
                rules={[{ required: true, message: 'Ingrese el precio' }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="0.00"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="divisa"
                label="Moneda"
                rules={[{ required: true, message: 'Seleccione la moneda' }]}
              >
                <Select placeholder="Seleccionar moneda">
                  <Option value="CLP">CLP</Option>
                  <Option value="UF">UF</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="propietario_id"
                label="Propietario"
                rules={[{ required: true, message: 'Seleccione un propietario' }]}
              >
                <Select
                  placeholder="Seleccionar propietario"
                  loading={loadingData || propietariosLoading}
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <div style={{ padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => setPropietarioModalVisible(true)}
                          className="w-full text-left"
                        >
                          Agregar nuevo propietario
                        </Button>
                      </div>
                    </>
                  )}
                >
                  {propietarios.map(propietario => (
                    <Option key={propietario.id} value={propietario.id}>
                      {propietario.nombre} - {propietario.email}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="rol" label="Rol">
                <Input placeholder="Rol" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="gastos_comunes" label="Gastos Comunes">
                <InputNumber className="w-full" min={0} placeholder="Gastos comunes" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contribuciones" label="Contribuciones">
                <InputNumber className="w-full" min={0} placeholder="Contribuciones" />
              </Form.Item>
            </Col>
          </FieldGrid>
        </StepWrapper>
      );
    }

    // Si es Casa + Venta, mostrar campos específicos
    if (formMode === 'casa-venta') {
      return (
        <StepWrapper
          title="Precio y Comisión"
          className={currentStep === 'precio' ? '' : 'd-none'}
        >
          <FieldGrid>
            <Col span={12}>
              <Form.Item
                name="precio_venta"
                label="Precio"
                rules={[{ required: true, message: 'Ingrese el precio' }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="0.00"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="divisa"
                label="Moneda"
                rules={[{ required: true, message: 'Seleccione la moneda' }]}
              >
                <Select placeholder="Seleccionar moneda">
                  <Option value="CLP">CLP</Option>
                  <Option value="UF">UF</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="propietario_id"
                label="Propietario"
                rules={[{ required: true, message: 'Seleccione un propietario' }]}
              >
                <Select
                  placeholder="Seleccionar propietario"
                  loading={loadingData || propietariosLoading}
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <div style={{ padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => setPropietarioModalVisible(true)}
                          className="w-full text-left"
                        >
                          Agregar nuevo propietario
                        </Button>
                      </div>
                    </>
                  )}
                >
                  {propietarios.map(propietario => (
                    <Option key={propietario.id} value={propietario.id}>
                      {propietario.nombre} - {propietario.email}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="rol" label="Rol">
                <Input placeholder="Rol" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="gastos_comunes" label="Gastos Comunes">
                <InputNumber className="w-full" min={0} placeholder="Gastos comunes" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="contribuciones" label="Contribuciones">
                <InputNumber className="w-full" min={0} placeholder="Contribuciones" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="deuda" label="Deuda">
                <Input placeholder="Deuda" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="hipoteca" label="Hipoteca">
                <Input placeholder="Hipoteca" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="banco" label="Banco">
                <Select placeholder="Seleccionar banco" allowClear>
                  {Object.values(Banco).map(banco => (
                    <Option key={banco} value={banco}>{banco}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="precio_tasacion" label="Precio de Tasación">
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="Precio de tasación"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="acepta_permuta" valuePropName="checked">
                <Checkbox>Acepta permuta</Checkbox>
              </Form.Item>
            </Col>
          </FieldGrid>
        </StepWrapper>
      );
    }

    // Si es Casa + Renta y Venta, mostrar campos combinados
    if (formMode === 'casa-renta-venta') {
      return (
        <StepWrapper
          title="Precio y Comisión"
          className={currentStep === 'precio' ? '' : 'd-none'}
        >
          <FieldGrid>
            <Col span={12}>
              <Form.Item
                name="precio_venta"
                label="Precio"
                rules={[{ required: true, message: 'Ingrese el precio' }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="0.00"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="divisa"
                label="Moneda"
                rules={[{ required: true, message: 'Seleccione la moneda' }]}
              >
                <Select placeholder="Seleccionar moneda">
                  <Option value="CLP">CLP</Option>
                  <Option value="UF">UF</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="propietario_id"
                label="Propietario"
                rules={[{ required: true, message: 'Seleccione un propietario' }]}
              >
                <Select
                  placeholder="Seleccionar propietario"
                  loading={loadingData || propietariosLoading}
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <div style={{ padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => setPropietarioModalVisible(true)}
                          className="w-full text-left"
                        >
                          Agregar nuevo propietario
                        </Button>
                      </div>
                    </>
                  )}
                >
                  {propietarios.map(propietario => (
                    <Option key={propietario.id} value={propietario.id}>
                      {propietario.nombre} - {propietario.email}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>


            <Col span={12}>
              <Form.Item name="gastos_comunes" label="Gastos Comunes">
                <InputNumber className="w-full" min={0} placeholder="Gastos comunes" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contribuciones" label="Contribuciones">
                <InputNumber className="w-full" min={0} placeholder="Contribuciones" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="acepta_permuta" valuePropName="checked">
                <Checkbox>Acepta permuta</Checkbox>
              </Form.Item>
            </Col>
          </FieldGrid>
        </StepWrapper>
      );
    }

    // Si es Departamento + Renta, mostrar campos específicos
    if (formMode === 'departamento-renta') {
      return (
        <StepWrapper
          title="Precio y Comisión"
          className={currentStep === 'precio' ? '' : 'd-none'}
        >
          <FieldGrid>
            <Col span={12}>
              <Form.Item
                name="precio_venta"
                label="Precio"
                rules={[{ required: true, message: 'Ingrese el precio' }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="0.00"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="divisa"
                label="Moneda"
                rules={[{ required: true, message: 'Seleccione la moneda' }]}
              >
                <Select placeholder="Seleccionar moneda">
                  <Option value="CLP">CLP</Option>
                  <Option value="UF">UF</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="propietario_id"
                label="Propietario"
                rules={[{ required: true, message: 'Seleccione un propietario' }]}
              >
                <Select
                  placeholder="Seleccionar propietario"
                  loading={loadingData || propietariosLoading}
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <div style={{ padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => setPropietarioModalVisible(true)}
                          className="w-full text-left"
                        >
                          Agregar nuevo propietario
                        </Button>
                      </div>
                    </>
                  )}
                >
                  {propietarios.map(propietario => (
                    <Option key={propietario.id} value={propietario.id}>
                      {propietario.nombre} - {propietario.email}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="rol" label="Rol">
                <Input placeholder="Rol" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="precio_tasacion" label="Precio de Tasación">
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="Precio de tasación"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="gastos_comunes" label="Gastos Comunes">
                <InputNumber className="w-full" min={0} placeholder="Gastos comunes" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="contribuciones" label="Contribuciones">
                <InputNumber className="w-full" min={0} placeholder="Contribuciones" />
              </Form.Item>
            </Col>
          </FieldGrid>
        </StepWrapper>
      );
    }

    // Si es Departamento + Venta, mostrar campos específicos
    if (formMode === 'departamento-venta') {
      return (
        <StepWrapper
          title="Precio y Comisión"
          className={currentStep === 'precio' ? '' : 'd-none'}
        >
          <FieldGrid>
            <Col span={12}>
              <Form.Item
                name="precio_venta"
                label="Precio"
                rules={[{ required: true, message: 'Ingrese el precio' }]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="0.00"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="divisa"
                label="Moneda"
                rules={[{ required: true, message: 'Seleccione la moneda' }]}
              >
                <Select placeholder="Seleccionar moneda">
                  <Option value="CLP">CLP</Option>
                  <Option value="UF">UF</Option>
                  <Option value="USD">USD</Option>
                  <Option value="EUR">EUR</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="propietario_id"
                label="Propietario"
                rules={[{ required: true, message: 'Seleccione un propietario' }]}
              >
                <Select
                  placeholder="Seleccionar propietario"
                  loading={loadingData || propietariosLoading}
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <div style={{ padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => setPropietarioModalVisible(true)}
                          className="w-full text-left"
                        >
                          Agregar nuevo propietario
                        </Button>
                      </div>
                    </>
                  )}
                >
                  {propietarios.map(propietario => (
                    <Option key={propietario.id} value={propietario.id}>
                      {propietario.nombre} - {propietario.email}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="rol" label="Rol">
                <Input placeholder="Rol" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="gastos_comunes" label="Gastos Comunes">
                <InputNumber className="w-full" min={0} placeholder="Gastos comunes" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="contribuciones" label="Contribuciones">
                <InputNumber className="w-full" min={0} placeholder="Contribuciones" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="deuda" label="Deuda">
                <Input placeholder="Deuda" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="hipoteca" label="Hipoteca">
                <Input placeholder="Hipoteca" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="banco" label="Banco">
                <Select placeholder="Seleccionar banco" allowClear>
                  {Object.values(Banco).map(banco => (
                    <Option key={banco} value={banco}>{banco}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="precio_tasacion" label="Precio de Tasación">
                <InputNumber
                  className="w-full"
                  min={0}
                  placeholder="Precio de tasación"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="acepta_permuta" valuePropName="checked">
                <Checkbox>Acepta permuta</Checkbox>
              </Form.Item>
            </Col>
          </FieldGrid>
        </StepWrapper>
      );
    }

    // Formulario normal para otros tipos de propiedades
    return (
      <StepWrapper
        title="Precio"
        className={currentStep === 'precio' ? '' : 'd-none'}
      >
        <FieldGrid>
          {/* Precio Section */}
          <Col span={8}>
            <Form.Item
              name="precio_venta"
              label="Precio"
              rules={[{ required: true, message: 'Ingrese el precio' }]}
            >
              <InputNumber
                className="w-full"
                min={0}
                placeholder="0.00"
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => (parseFloat(value!.replace(/\$\s?|(,*)/g, '')) || 0) as any}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="divisa"
              label="Moneda"
              rules={[{ required: true }]}
            >
              <Select defaultValue="CLP">
                {Object.values(Divisa).map(divisa => (
                  <Option key={divisa} value={divisa}>{divisa}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
              <Form.Item
                name="propietario_id"
                label="Propietario"
                rules={[{ required: true, message: 'Seleccione un propietario' }]}
              >
                <Select
                  placeholder="Seleccionar propietario"
                  loading={loadingData || propietariosLoading}
                  dropdownRender={menu => (
                    <>
                      {menu}
                      <div style={{ padding: '8px 0', borderTop: '1px solid #f0f0f0' }}>
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => setPropietarioModalVisible(true)}
                          className="w-full text-left"
                        >
                          Agregar nuevo propietario
                        </Button>
                      </div>
                    </>
                  )}
                >
                  {propietarios.map(propietario => (
                    <Option key={propietario.id} value={propietario.id}>
                      {propietario.nombre} - {propietario.email}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

          {/* Financial info */}
          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

          <Col span={8}>
            <Form.Item name="rol" label="Rol">
              <Input placeholder="Rol" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="gastos_comunes" label="Gastos Comunes">
              <InputNumber className="w-full" min={0} placeholder="Gastos comunes" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="contribuciones" label="Contribuciones">
              <InputNumber className="w-full" min={0} placeholder="Contribuciones" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="deuda" label="Deuda">
              <Input placeholder="Deuda" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="hipoteca" label="Hipoteca">
              <Input placeholder="Hipoteca" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="banco" label="Banco">
              <Select placeholder="Seleccionar banco" allowClear>
                {Object.values(Banco).map(banco => (
                  <Option key={banco} value={banco}>{banco}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Mostrar checkbox de permuta solo si la operación incluye venta */}
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.operacion !== currentValues.operacion}>
            {({ getFieldValue }) => {
              const operaciones = getFieldValue('operacion') || [];
              return operaciones.includes('Venta') ? (
                <Col span={24}>
                  <Form.Item name="acepta_permuta" valuePropName="checked">
                    <Checkbox>Acepta permuta</Checkbox>
                  </Form.Item>
                </Col>
              ) : null;
            }}
          </Form.Item>
        </FieldGrid>
      </StepWrapper>
    );
  };

  // Step 3: Características

  const renderCaracteristicasStep = () => {
    // Obtener campos dinámicamente desde la configuración
    const allFields = tipoPropiedad ? getCaracteristicasForType(tipoPropiedad as TipoPropiedad) : [];
    
    // ✅ Normalizar tipoOperacion a array
    const operacionArray = Array.isArray(tipoOperacion) 
      ? tipoOperacion 
      : (tipoOperacion ? [tipoOperacion] : []);
    
    // Filtrar campos según operación seleccionada
    const fields = allFields.filter(field => {
      if (!field.showOnlyFor) return true;
      if (field.showOnlyFor.operacion) {
        // Verificar si alguna operación seleccionada coincide
        return operacionArray.some((op: string) => field.showOnlyFor?.operacion?.includes(op as any));
      }
      return true;
    });

    console.log('🏗️ renderCaracteristicasStep DEBUG:');
    console.log('  📌 tipoPropiedad (useWatch):', tipoPropiedad);
    console.log('  📌 tipoOperacion (useWatch):', tipoOperacion);
    console.log('  📌 Direct form values:', {
      tipo: form.getFieldValue('tipo'),
      operacion: form.getFieldValue('operacion')
    });
    console.log('  📊 allFields count:', allFields.length);
    console.log('  📊 filtered fields count:', fields.length);
    console.log('  🔍 operacionArray:', operacionArray);

    return (
      <StepWrapper
        title="Características"
        className={currentStep === 'caracteristicas' ? '' : 'd-none'}
      >
        <FieldGrid>
          {fields.length > 0 ? (
            fields.map((field) => (
              <DynamicFieldRenderer key={field.name} field={field} />
            ))
          ) : (
            <Col span={24}>
              <p className="text-muted">Seleccione un tipo de propiedad para ver las características disponibles.</p>
            </Col>
          )}
        </FieldGrid>
      </StepWrapper>
    );
  };



  // Step 4: Ubicación for Agrícola + Venta
  const renderUbicacionAgricolaVenta = () => {
    return (
      <div className="step-wrapper" style={{ display: currentStep === 'ubicacion' ? 'block' : 'none' }}>
        <div className="step-wrapper__header">
          <h2 className="step-wrapper__title">Ubicación</h2>
        </div>

        <FieldGrid>
          <Col span={24}>
            <Form.Item
              name="direccion"
              label="Dirección"
              rules={[{ required: true, message: 'Ingrese la dirección' }]}
            >
              <Input placeholder="Dirección" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="ciudad_localidad_barrio" label="Ciudad, localidad o barrio">
              <Input placeholder="Ciudad, localidad o barrio" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="latitud" label="Latitud">
              <Input placeholder="Latitud" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="longitud" label="Longitud">
              <Input placeholder="Longitud" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="mostrar_ubicacion" label="Mostrar ubicación" initialValue="Exacta">
              <Select placeholder="Seleccionar">
                <Option value="Exacta">Exacta</Option>
                <Option value="Referencial">Referencial</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="mapa" label="Mapa">
              {/* Placeholder for Google Maps widget */}
              <div style={{ height: '300px', border: '1px solid #d9d9d9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>Widget de Google Maps con pin manual</span>
              </div>
            </Form.Item>
          </Col>
        </FieldGrid>
      </div>
    );
  };

  // Step 4: Ubicación
  const renderUbicacionStep = () => {
    const formMode = getFormMode();

    if (formMode === 'agricola-renta') {
      return (
        <div className="step-wrapper" style={{ display: currentStep === 'ubicacion' ? 'block' : 'none' }}>
          <div className="step-wrapper__header">
            <h2 className="step-wrapper__title">Ubicación</h2>
          </div>

          <FieldGrid>
            <Col span={24}>
              <Form.Item
                name="region"
                label="Región"
                rules={[{ required: true, message: 'Seleccione la región' }]}
              >
                <Select placeholder="Seleccionar región" onChange={handleRegionChange} allowClear>
                  <Option value="Antofagasta">Antofagasta</Option>
                  <Option value="Arica y Parinacota">Arica y Parinacota</Option>
                  <Option value="Atacama">Atacama</Option>
                  <Option value="Aysén">Aysén</Option>
                  <Option value="Bernardo O'Higgins">Bernardo O'Higgins</Option>
                  <Option value="La Araucanía">La Araucanía</Option>
                  <Option value="Coquimbo">Coquimbo</Option>
                  <Option value="Bío-Bío">Bío-Bío</Option>
                  <Option value="Maule">Maule</Option>
                  <Option value="Los Lagos">Los Lagos</Option>
                  <Option value="Los Ríos">Los Ríos</Option>
                  <Option value="Magallanes y Antártica">Magallanes y Antártica</Option>
                  <Option value="Valparaíso">Valparaíso</Option>
                  <Option value="Metropolitana">Metropolitana</Option>
                  <Option value="Tarapacá">Tarapacá</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="comuna"
                label="Comuna"
                rules={[{ required: true, message: 'Seleccione la comuna' }]}
              >
                <Select
                  placeholder="Seleccione primero una región"
                  onChange={buildDireccionCompleta}
                  disabled={availableComunas.length === 0}
                  allowClear
                >
                  {availableComunas.map(comuna => (
                    <Option key={comuna} value={comuna}>{comuna}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="nombre_calle"
                label="Nombre de calle"
                rules={[{ required: true, message: 'Ingrese el nombre de la calle' }]}
              >
                <Input placeholder="Ej: Av. Providencia" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="numero_calle" label="N° de calle">
                <Input placeholder="N°" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="letra" label="Letra">
                <Input placeholder="Letra" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="direccion"
                label="Dirección completa"
                rules={[{ required: true, message: 'Ingrese la dirección' }]}
              >
                <Input placeholder="Dirección completa (se genera automáticamente)" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="direccion_referencial" label="Dirección referencial">
                <Input placeholder="Dirección referencial" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="mostrar_mapa" label="Mostrar mapa en la ficha de la propiedad">
                <Radio.Group defaultValue="si">
                  <Radio value="si">Sí</Radio>
                  <Radio value="no">No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="enviar_coordenadas" label="Enviar coordenadas a portales">
                <Radio.Group defaultValue="si">
                  <Radio value="si">Sí</Radio>
                  <Radio value="no">No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </FieldGrid>

          <FieldGrid>
            <Col span={24}>
              <MapSelector
                lat={coordinates.lat}
                lng={coordinates.lng}
                direccion={form.getFieldValue('direccion')}
                onChange={(lat: number | null, lng: number | null) => setCoordinates({ lat, lng })}
              />
            </Col>
          </FieldGrid>
        </div>
      );
    }

    if (formMode === 'bodega-renta' || formMode === 'bodega-venta') {
      return (
        <div className="step-wrapper" style={{ display: currentStep === 'ubicacion' ? 'block' : 'none' }}>
          <div className="step-wrapper__header">
            <h2 className="step-wrapper__title">Ubicación</h2>
          </div>

          <FieldGrid>
            <Col span={24}>
              <Form.Item
                name="region"
                label="Región"
                rules={[{ required: true, message: 'Seleccione la región' }]}
              >
                <Select placeholder="Seleccionar región" onChange={handleRegionChange} allowClear>
                  {Object.values(Region).map(region => (
                    <Option key={region} value={region}>{region}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="comuna"
                label="Comuna"
                rules={[{ required: true, message: 'Seleccione la comuna' }]}
              >
                <Select
                  placeholder="Seleccione primero una región"
                  onChange={buildDireccionCompleta}
                  disabled={availableComunas.length === 0}
                  allowClear
                >
                  {availableComunas.map(comuna => (
                    <Option key={comuna} value={comuna}>{comuna}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="nombre_calle"
                label="Nombre de calle"
                rules={[{ required: true, message: 'Ingrese el nombre de la calle' }]}
              >
                <Input placeholder="Ej: Av. Providencia" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="numero_calle" label="N° de calle">
                <Input placeholder="N°" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="direccion"
                label="Dirección completa"
                rules={[{ required: true, message: 'Ingrese la dirección' }]}
              >
                <Input placeholder="Dirección completa (se genera automáticamente)" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="direccion_referencial" label="Dirección referencial">
                <Input placeholder="Dirección referencial" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              <Title level={5} className="mb-16">
                Mapa
              </Title>
              <FieldGrid>
                <Col span={12}>
                  <Form.Item name="mostrar_mapa" label="Mostrar mapa en la ficha de la propiedad">
                    <Radio.Group defaultValue="si">
                      <Radio value="si">Sí</Radio>
                      <Radio value="no">No</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="enviar_coordenadas" label="Enviar coordenadas a portales">
                    <Radio.Group defaultValue="si">
                      <Radio value="si">Sí</Radio>
                      <Radio value="no">No</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </FieldGrid>
            </Col>

            <Col span={24}>
              <MapSelector
                lat={coordinates.lat}
                lng={coordinates.lng}
                direccion={form.getFieldValue('direccion')}
                onChange={(lat: number | null, lng: number | null) => setCoordinates({ lat, lng })}
              />
            </Col>
          </FieldGrid>
        </div>
      );
    }

    if (formMode === 'agricola-venta') {
      return renderUbicacionAgricolaVenta();
    }

    if (formMode === 'casa-renta') {
      return (
        <div className="step-wrapper" style={{ display: currentStep === 'ubicacion' ? 'block' : 'none' }}>
          <div className="step-wrapper__header">
            <h2 className="step-wrapper__title">Ubicación</h2>
          </div>

          <FieldGrid>
            <Col span={24}>
              <Form.Item
                name="nombre_calle"
                label="Nombre de calle"
                rules={[{ required: true, message: 'Ingrese el nombre de la calle' }]}
              >
                <Input placeholder="Ej: Av. Providencia" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="numero_calle" label="N° de calle">
                <Input placeholder="N°" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="letra" label="Letra">
                <Input placeholder="Letra" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="numeroDepto" label="N° de Departamento">
                <Input placeholder="N° de Depto" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="region"
                label="Región"
                rules={[{ required: true, message: 'Seleccione la región' }]}
              >
                <Select placeholder="Seleccionar región" onChange={handleRegionChange} allowClear>
                  {Object.values(Region).map(region => (
                    <Option key={region} value={region}>{region}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="comuna"
                label="Comuna"
                rules={[{ required: true, message: 'Seleccione la comuna' }]}
              >
                <Select
                  placeholder="Seleccione primero una región"
                  onChange={buildDireccionCompleta}
                  disabled={availableComunas.length === 0}
                  allowClear
                >
                  {availableComunas.map(comuna => (
                    <Option key={comuna} value={comuna}>{comuna}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="direccion"
                label="Dirección completa"
                rules={[{ required: true, message: 'Ingrese la dirección' }]}
              >
                <Input placeholder="Dirección completa (se genera automáticamente)" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="direccion_referencial" label="Dirección referencial">
                <Input placeholder="Dirección referencial" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              <Title level={5} className="mb-16">
                Mapa
              </Title>
              <FieldGrid>
                <Col span={12}>
                  <Form.Item name="mostrar_mapa" label="Mostrar mapa en la ficha de la propiedad">
                    <Radio.Group defaultValue="si">
                      <Radio value="si">Sí</Radio>
                      <Radio value="no">No</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="enviar_coordenadas" label="Enviar coordenadas a portales">
                    <Radio.Group defaultValue="si">
                      <Radio value="si">Sí</Radio>
                      <Radio value="no">No</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </FieldGrid>
            </Col>

            <Col span={24}>
              <MapSelector
                lat={coordinates.lat}
                lng={coordinates.lng}
                direccion={form.getFieldValue('direccion')}
                onChange={(lat: number | null, lng: number | null) => setCoordinates({ lat, lng })}
              />
            </Col>
          </FieldGrid>
        </div>
      );
    }

    if (formMode === 'casa-renta-temporal') {
      return (
        <div className="step-wrapper" style={{ display: currentStep === 'ubicacion' ? 'block' : 'none' }}>
          <div className="step-wrapper__header">
            <h2 className="step-wrapper__title">Ubicación</h2>
          </div>

          <FieldGrid>
            <Col span={24}>
              <Form.Item
                name="nombre_calle"
                label="Nombre de calle"
                rules={[{ required: true, message: 'Ingrese el nombre de la calle' }]}
              >
                <Input placeholder="Ej: Av. Providencia" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="numero_calle" label="N° de calle">
                <Input placeholder="N°" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="letra" label="Letra">
                <Input placeholder="Letra" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="numeroDepto" label="N° de Departamento">
                <Input placeholder="N° de Depto" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="region"
                label="Región"
                rules={[{ required: true, message: 'Seleccione la región' }]}
              >
                <Select placeholder="Seleccionar región" onChange={handleRegionChange} allowClear>
                  {Object.values(Region).map(region => (
                    <Option key={region} value={region}>{region}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="comuna"
                label="Comuna"
                rules={[{ required: true, message: 'Seleccione la comuna' }]}
              >
                <Select
                  placeholder="Seleccione primero una región"
                  onChange={buildDireccionCompleta}
                  disabled={availableComunas.length === 0}
                  allowClear
                >
                  {availableComunas.map(comuna => (
                    <Option key={comuna} value={comuna}>{comuna}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="direccion"
                label="Dirección completa"
                rules={[{ required: true, message: 'Ingrese la dirección' }]}
              >
                <Input placeholder="Dirección completa (se genera automáticamente)" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="direccion_referencial" label="Dirección referencial">
                <Input placeholder="Dirección referencial" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="mostrar_mapa" label="Mostrar mapa en la ficha de la propiedad">
                <Radio.Group defaultValue="si">
                  <Radio value="si">Sí</Radio>
                  <Radio value="no">No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="enviar_coordenadas" label="Enviar coordenadas a portales">
                <Radio.Group defaultValue="si">
                  <Radio value="si">Sí</Radio>
                  <Radio value="no">No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </FieldGrid>

          <FieldGrid>
            <Col span={24}>
              <MapSelector
                lat={coordinates.lat}
                lng={coordinates.lng}
                direccion={form.getFieldValue('direccion')}
                onChange={(lat: number | null, lng: number | null) => setCoordinates({ lat, lng })}
              />
            </Col>
          </FieldGrid>
        </div>
      );
    }

    if (formMode === 'departamento-venta') {
      return (
        <div className="step-wrapper" style={{ display: currentStep === 'ubicacion' ? 'block' : 'none' }}>
          <div className="step-wrapper__header">
            <h2 className="step-wrapper__title">Ubicación</h2>
          </div>

          <FieldGrid>
            <Col span={24}>
              <Form.Item
                name="nombre_calle"
                label="Nombre de calle"
                rules={[{ required: true, message: 'Ingrese el nombre de la calle' }]}
              >
                <Input placeholder="Ej: Av. Providencia" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="numero_calle" label="N° de calle">
                <Input placeholder="N°" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="letra" label="Letra">
                <Input placeholder="Letra" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="numeroDepto" label="N° de Departamento">
                <Input placeholder="N° de Depto" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="region"
                label="Región"
                rules={[{ required: true, message: 'Seleccione la región' }]}
              >
                <Select placeholder="Seleccionar región" onChange={handleRegionChange} allowClear>
                  {Object.values(Region).map(region => (
                    <Option key={region} value={region}>{region}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="comuna"
                label="Comuna"
                rules={[{ required: true, message: 'Seleccione la comuna' }]}
              >
                <Select
                  placeholder="Seleccione primero una región"
                  onChange={buildDireccionCompleta}
                  disabled={availableComunas.length === 0}
                  allowClear
                >
                  {availableComunas.map(comuna => (
                    <Option key={comuna} value={comuna}>{comuna}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="direccion"
                label="Dirección completa"
                rules={[{ required: true, message: 'Ingrese la dirección' }]}
              >
                <Input placeholder="Dirección completa (se genera automáticamente)" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name="direccion_referencial" label="Dirección referencial">
                <Input placeholder="Dirección referencial" />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              <Title level={5} className="mb-16">
                Mapa
              </Title>
              <FieldGrid>
                <Col span={12}>
                  <Form.Item name="mostrar_mapa" label="Mostrar mapa en la ficha de la propiedad">
                    <Radio.Group defaultValue="si">
                      <Radio value="si">Sí</Radio>
                      <Radio value="no">No</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="enviar_coordenadas" label="Enviar coordenadas a portales">
                    <Radio.Group defaultValue="si">
                      <Radio value="si">Sí</Radio>
                      <Radio value="no">No</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </FieldGrid>
            </Col>

            <Col span={24}>
              <MapSelector
                lat={coordinates.lat}
                lng={coordinates.lng}
                direccion={form.getFieldValue('direccion')}
                onChange={(lat: number | null, lng: number | null) => setCoordinates({ lat, lng })}
              />
            </Col>
          </FieldGrid>
        </div>
      );
    }

    return (
      <div className="step-wrapper" style={{ display: currentStep === 'ubicacion' ? 'block' : 'none' }}>
        <div className="step-wrapper__header">
          <h2 className="step-wrapper__title">Ubicación</h2>
        </div>

        <FieldGrid>
          <Col span={24}>
            <Form.Item
              name="nombre_calle"
              label="Nombre de calle"
              rules={[{ required: true, message: 'Ingrese el nombre de la calle' }]}
            >
              <Input placeholder="Ej: Av. Providencia" onChange={buildDireccionCompleta} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="numero_calle" label="N° de calle">
              <Input placeholder="N°" onChange={buildDireccionCompleta} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="letra" label="Letra">
              <Input placeholder="Letra" onChange={buildDireccionCompleta} />
            </Form.Item>
          </Col>
          {formMode !== 'agricola-renta' && formMode !== 'agricola-venta' && (
            <Col span={8}>
              <Form.Item name="numeroDepto" label="N° de Departamento">
                <Input placeholder="N° de Depto" onChange={buildDireccionCompleta} />
              </Form.Item>
            </Col>
          )}

          {/* Comuna y Región */}
          <Col span={12}>
            <Form.Item
              name="region"
              label="Región"
              rules={[{ required: true, message: 'Seleccione la región' }]}
            >
              <Select placeholder="Seleccionar región" onChange={handleRegionChange} allowClear>
                {Object.values(Region).map(region => (
                  <Option key={region} value={region}>{region}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="comuna"
              label="Comuna"
              rules={[{ required: true, message: 'Seleccione la comuna' }]}
            >
              <Select
                placeholder="Seleccione primero una región"
                onChange={buildDireccionCompleta}
                disabled={availableComunas.length === 0}
                allowClear
              >
                {availableComunas.map(comuna => (
                  <Option key={comuna} value={comuna}>{comuna}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="direccion"
              label="Dirección completa"
              rules={[{ required: true, message: 'Ingrese la dirección' }]}
            >
              <Input placeholder="Dirección completa (se genera automáticamente)" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="direccion_referencial" label="Dirección referencial">
              <Input placeholder="Dirección referencial" />
            </Form.Item>
          </Col>

          {/* Map options */}
          <Col span={24}>
            <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            <Title level={5} className="mb-16">
              Mapa
            </Title>
            <FieldGrid>
              <Col span={12}>
                <Form.Item name="mostrar_mapa" label="Mostrar mapa en la ficha de la propiedad">
                  <Radio.Group defaultValue="si">
                    <Radio value="si">Sí</Radio>
                    <Radio value="no">No</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="enviar_coordenadas" label="Enviar coordenadas a portales">
                  <Radio.Group defaultValue="si">
                    <Radio value="si">Sí</Radio>
                    <Radio value="no">No</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </FieldGrid>
          </Col>

          {/* Interactive Map */}
          <Col span={24}>
            <MapSelector
              lat={coordinates.lat}
              lng={coordinates.lng}
              direccion={form.getFieldValue('direccion')}
              onChange={(lat: number | null, lng: number | null) => setCoordinates({ lat, lng })}
            />
          </Col>
        </FieldGrid>
      </div>
    );
  };

  // Step 5: Multimedia
  const renderMultimediaStep = () => {
    // Mismo formulario para todos los tipos (no hay diferencia para Agrícola+Renta)
    return (
      <div className="step-wrapper" style={{ display: currentStep === 'multimedia' ? 'block' : 'none' }}>
        <div className="step-wrapper__header">
          <h2 className="step-wrapper__title">Multimedia</h2>
        </div>

        <FieldGrid>
          {/* Fotos */}
          <Col span={24}>
            <Title level={4} className="mb-16">
              Fotos
            </Title>
            <Form.Item name="fotos">
              <Dragger
                fileList={photoFileList}
                onChange={handlePhotoUpload}
                beforeUpload={() => false}
                multiple
                accept="image/*"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '2px dashed rgba(255,255,255,0.2)',
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: '#9CA3AF' }} />
                </p>
                <p style={{ color: '#9CA3AF' }}>
                  Añade fotos arrastrándolas aquí o subiéndolas
                </p>
              </Dragger>
            </Form.Item>
            <p className="mt-8">
              Max 200 fotos. Tamaño de imagen sugerido: 4:3
            </p>
          </Col>

          {/* Planos */}
          <Col span={24}>
            <Title level={4} className="mb-16">
              Planos
            </Title>
            <Form.Item name="planos">
              <Dragger
                fileList={planoFileList}
                onChange={handlePlanoUpload}
                beforeUpload={() => false}
                multiple
                accept="image/*,.pdf"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '2px dashed rgba(255,255,255,0.2)',
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: '#9CA3AF' }} />
                </p>
                <p style={{ color: '#9CA3AF' }}>
                  Añade planos arrastrándolos aquí o subiéndolos
                </p>
              </Dragger>
            </Form.Item>
            <p className="mt-8">
              Máx 10 planos, formato válido: JPG, JPEG, PNG, PDF
            </p>
          </Col>

          {/* URLs */}
          <Col span={24}>
            <Form.Item name="url_youtube" label="URL de Youtube">
              <Input placeholder="- Introduce un enlace a Youtube -" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="url_visita_virtual" label="URL de la visita virtual">
              <Input placeholder="- Introduce un enlace a la visita virtual -" />
            </Form.Item>
          </Col>
        </FieldGrid>
      </div>
    );
  };

  // Step 5: Medios (for Casa + Renta)
  const renderMediosStep = () => {
    return (
      <div className="step-wrapper" style={{ display: currentStep === 'medios' ? 'block' : 'none' }}>
        <div className="step-wrapper__header">
          <h2 className="step-wrapper__title">Medios</h2>
        </div>

        <FieldGrid>
          {/* Fotos */}
          <Col span={24}>
            <Form.Item name="fotos" label="Fotos">
              <Dragger
                fileList={photoFileList}
                onChange={handlePhotoUpload}
                beforeUpload={() => false}
                multiple
                accept="image/*"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '2px dashed rgba(255,255,255,0.2)',
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: '#9CA3AF' }} />
                </p>
                <p style={{ color: '#9CA3AF' }}>
                  Añade fotos arrastrándolas aquí o subiéndolas
                </p>
              </Dragger>
            </Form.Item>
            <p className="mt-8">
              Max 200 fotos, formato: image/*
            </p>
          </Col>

          {/* Planos */}
          <Col span={24}>
            <Form.Item name="planos" label="Planos">
              <Dragger
                fileList={planoFileList}
                onChange={handlePlanoUpload}
                beforeUpload={() => false}
                multiple
                accept="image/*,.pdf"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '2px dashed rgba(255,255,255,0.2)',
                }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: '#9CA3AF' }} />
                </p>
                <p style={{ color: '#9CA3AF' }}>
                  Añade planos arrastrándolos aquí o subiéndolos
                </p>
              </Dragger>
            </Form.Item>
            <p className="mt-8">
              Max 10 planos, formato: JPG, JPEG, PNG, PDF
            </p>
          </Col>

          {/* URLs */}
          <Col span={24}>
            <Form.Item name="url_youtube" label="URL de Youtube">
              <Input placeholder="- Introduce un enlace a Youtube -" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="url_visita_virtual" label="URL de la visita virtual">
              <Input placeholder="- Introduce un enlace a la visita virtual -" />
            </Form.Item>
          </Col>
        </FieldGrid>
      </div>
    );
  };

  // Step 6: Amenities
  const renderAmenitiesStep = () => {
    const formMode = getFormMode();

    // Si es Agrícola + Renta, mostrar solo campos específicos
    if (formMode === 'agricola-renta') {
      return (
        <div className="step-wrapper" style={{ display: currentStep === 'amenities_servicios_y_entorno' ? 'block' : 'none' }}>
          <div className="step-wrapper__header">
            <h2 className="step-wrapper__title">Servicios y Entorno</h2>
          </div>

          <FieldGrid>
            {/* Servicios */}
            <Col span={24}>
              <Title level={4} className="mb-16">
                Servicios
              </Title>
            </Col>
            <Col span={8}>
              <Form.Item name="agua" valuePropName="checked">
                <Checkbox>Agua corriente</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="gas_natural" valuePropName="checked">
                <Checkbox>Gas natural</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="acceso_internet" valuePropName="checked">
                <Checkbox>Internet</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="con_energia" valuePropName="checked">
                <Checkbox>Luz / Energía</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="cisterna" valuePropName="checked">
                <Checkbox>Reservorio / Cisterna</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="generador" valuePropName="checked">
                <Checkbox>Generador</Checkbox>
              </Form.Item>
            </Col>

            {/* Ambientes y entorno */}
            <Col span={24}>
              <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              <Title level={4} className="mb-16">
                Ambientes y entorno
              </Title>
            </Col>
            <Col span={8}>
              <Form.Item name="en_condominio" valuePropName="checked">
                <Checkbox>Barrio abierto / En condominio</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="tipo_seguridad" label="Seguridad / Cámaras CCTV / Alarma">
                <Select placeholder="Seleccionar" allowClear>
                  <Option value="Portería 24h">Portería 24h</Option>
                  <Option value="Vigilancia privada">Vigilancia privada</Option>
                  <Option value="Cámaras">Cámaras</Option>
                  <Option value="Alarma">Alarma</Option>
                  <Option value="Sin seguridad">Sin seguridad</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="jardin" valuePropName="checked">
                <Checkbox>Área verde / Jardín</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="parrilla" valuePropName="checked">
                <Checkbox>Quincho / Parrilla</Checkbox>
              </Form.Item>
            </Col>
          </FieldGrid>
        </div>
      );
    }

    // Si es Casa + Renta, mostrar campos específicos
    if (formMode === 'casa-renta') {
      return (
        <div className="step-wrapper" style={{ display: currentStep === 'amenities' ? 'block' : 'none' }}>
          <div className="step-wrapper__header">
            <h2 className="step-wrapper__title">Amenities</h2>
          </div>

          <FieldGrid>
            <Col span={8}>
              <Form.Item name="agua" valuePropName="checked">
                <Checkbox>Agua corriente</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="aire_acondicionado" valuePropName="checked">
                <Checkbox>Aire acondicionado</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="alumbrado_publico" valuePropName="checked">
                <Checkbox>Alumbrado público</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="apto_credito" valuePropName="checked">
                <Checkbox>Apto crédito</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="apto_profesional" valuePropName="checked">
                <Checkbox>Apto profesional</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="arbolado" valuePropName="checked">
                <Checkbox>Arbolado</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="tv_cable" valuePropName="checked">
                <Checkbox>Cable TV</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="camaras_cctv" valuePropName="checked">
                <Checkbox>Cámaras CCTV</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="cisterna" valuePropName="checked">
                <Checkbox>Cisterna</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="cordon_cuneta" valuePropName="checked">
                <Checkbox>Cordón cuneta</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="desague_cloacal" valuePropName="checked">
                <Checkbox>Desagüe cloacal</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="energia_solar" valuePropName="checked">
                <Checkbox>Energía solar</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="estabilizado_calles" valuePropName="checked">
                <Checkbox>Estabilizado de calles</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="forestacion" valuePropName="checked">
                <Checkbox>Forestación</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="gas_natural" valuePropName="checked">
                <Checkbox>Gas natural</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="acceso_internet" valuePropName="checked">
                <Checkbox>Internet</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="luz" valuePropName="checked">
                <Checkbox>Luz</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="ofrece_financiacion" valuePropName="checked">
                <Checkbox>Ofrece financiación</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="pavimento" valuePropName="checked">
                <Checkbox>Pavimento</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="linea_telefono" valuePropName="checked">
                <Checkbox>Teléfono</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="terraza" valuePropName="checked">
                <Checkbox>Terraza</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="uso_comercial" valuePropName="checked">
                <Checkbox>Uso comercial</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="wifi" valuePropName="checked">
                <Checkbox>WiFi</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="accesible" valuePropName="checked">
                <Checkbox>Accesible</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="alarma" valuePropName="checked">
                <Checkbox>Alarma</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="area_cine" valuePropName="checked">
                <Checkbox>Área de cine</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="area_juegos" valuePropName="checked">
                <Checkbox>Área de juegos infantiles</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="area_verde" valuePropName="checked">
                <Checkbox>Área verde</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="ascensor" valuePropName="checked">
                <Checkbox>Ascensor</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="balcon" valuePropName="checked">
                <Checkbox>Balcón</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="barrio_abierto" valuePropName="checked">
                <Checkbox>Barrio abierto</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="box_deposito" valuePropName="checked">
                <Checkbox>Box/Depósito</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="caldera" valuePropName="checked">
                <Checkbox>Caldera</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="calefaccion" valuePropName="checked">
                <Checkbox>Calefacción</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="cancha_futbol" valuePropName="checked">
                <Checkbox>Cancha de fútbol</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="cancha_paddle" valuePropName="checked">
                <Checkbox>Cancha de paddle</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="cancha_tenis" valuePropName="checked">
                <Checkbox>Cancha de tenis</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="cancha_basquetbol" valuePropName="checked">
                <Checkbox>Cancha de básquetbol</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="cancha_usos_multiples" valuePropName="checked">
                <Checkbox>Cancha polideportiva</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="chimenea" valuePropName="checked">
                <Checkbox>Chimenea</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="club_house" valuePropName="checked">
                <Checkbox>Club House</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="comedor" valuePropName="checked">
                <Checkbox>Comedor</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="con_barrio_cerrado" valuePropName="checked">
                <Checkbox>Con barrio cerrado</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="conexion_lavarropas" valuePropName="checked">
                <Checkbox>Con conexión para lavarropas</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="cowork" valuePropName="checked">
                <Checkbox>Cowork</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dependencia_servicio" valuePropName="checked">
                <Checkbox>Dependencia de servicio</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="desayunador" valuePropName="checked">
                <Checkbox>Desayunador</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="dormitorio_en_suite" valuePropName="checked">
                <Checkbox>Dormitorio en suite</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="escritorio" valuePropName="checked">
                <Checkbox>Escritorio</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="estacionamiento_visitas" valuePropName="checked">
                <Checkbox>Estacionamiento para visitantes</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="estudio" valuePropName="checked">
                <Checkbox>Estudio</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="gimnasio" valuePropName="checked">
                <Checkbox>Gimnasio</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="refrigerador" valuePropName="checked">
                <Checkbox>Heladera</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="jacuzzi" valuePropName="checked">
                <Checkbox>Jacuzzi</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="jardin" valuePropName="checked">
                <Checkbox>Jardín</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="juegos_recreativos" valuePropName="checked">
                <Checkbox>Juegos recreativos</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="lavanderia" valuePropName="checked">
                <Checkbox>Lavandería</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="living" valuePropName="checked">
                <Checkbox>Living</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="living_comedor" valuePropName="checked">
                <Checkbox>Living comedor</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="logia" valuePropName="checked">
                <Checkbox>Logia</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="parrilla" valuePropName="checked">
                <Checkbox>Parrilla</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="patio" valuePropName="checked">
                <Checkbox>Patio</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="piscina" valuePropName="checked">
                <Checkbox>Piscina</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="placards" valuePropName="checked">
                <Checkbox>Placards</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="porton_automatico" valuePropName="checked">
                <Checkbox>Portón automático</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="puerta_blindada" valuePropName="checked">
                <Checkbox>Puerta blindada</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="puerta_seguridad" valuePropName="checked">
                <Checkbox>Puerta de seguridad</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="quincho" valuePropName="checked">
                <Checkbox>Quincho</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="rampa_silla_ruedas" valuePropName="checked">
                <Checkbox>Rampa para silla de ruedas</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="sala_juegos" valuePropName="checked">
                <Checkbox>Sala de juegos</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="salon_fiestas" valuePropName="checked">
                <Checkbox>Salón de fiestas</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="salon_usos_multiples" valuePropName="checked">
                <Checkbox>Salón de usos múltiples</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="sauna" valuePropName="checked">
                <Checkbox>Sauna</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="seguridad" valuePropName="checked">
                <Checkbox>Seguridad</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="solarium" valuePropName="checked">
                <Checkbox>Solarium</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="toilette" valuePropName="checked">
                <Checkbox>Toilette</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="vestidor" valuePropName="checked">
                <Checkbox>Vestidor</Checkbox>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="zona_escolar" valuePropName="checked">
                <Checkbox>Zona escolar</Checkbox>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item name="que_mas_interesa" label="¿Qué más tiene interesante la propiedad?">
                <TextArea
                  rows={4}
                  placeholder="Hay escuelas cerca, living con buena iluminación natural, diferentes paradas de colectivo cerca, a 500 metros del shopping…"
                />
              </Form.Item>
            </Col>
          </FieldGrid>
        </div>
      );
    }

    // Formulario normal para otros tipos de propiedades
    return (
      <div className="step-wrapper" style={{ display: currentStep === 'amenities' ? 'block' : 'none' }}>
        <div className="step-wrapper__header">
          <h2 className="step-wrapper__title">Amenities</h2>
        </div>

        <FieldGrid>
          {/* Amenidades */}
          <Col span={24}>
            <Title level={4} className="mb-16">
              Amenidades
            </Title>
          </Col>
          <Col span={6}>
            <Form.Item name="en_condominio" valuePropName="checked">
              <Checkbox>En condominio</Checkbox>
            </Form.Item>
          </Col>
        <Col span={6}>
          <Form.Item name="recibos" valuePropName="checked">
            <Checkbox>Recibos</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="llaves_oficina" valuePropName="checked">
            <Checkbox>Llaves en la oficina</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="tiene_letrero" valuePropName="checked">
            <Checkbox>Tiene letrero</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="piscina" valuePropName="checked">
            <Checkbox>Piscina</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="cancha_tenis" valuePropName="checked">
            <Checkbox>Cancha de tenis</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="bodega" valuePropName="checked">
            <Checkbox>Bodega</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="sauna" valuePropName="checked">
            <Checkbox>Sauna</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="jacuzzi" valuePropName="checked">
            <Checkbox>Jacuzzi</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="pieza_servicio" valuePropName="checked">
            <Checkbox>Pieza de servicio</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="amoblado" valuePropName="checked">
            <Checkbox>Amoblado</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="permite_mascotas" valuePropName="checked">
            <Checkbox>Permiten mascotas</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="Regularizada" valuePropName="checked">
            <Checkbox>Regularizada</Checkbox>
          </Form.Item>
        </Col>

        {/* Adicionales */}
        <Col span={24}>
          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <Title level={4} className="mb-16">
            Adicionales
          </Title>
        </Col>
        <Col span={6}>
          <Form.Item name="agua" valuePropName="checked">
            <Checkbox>Agua</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="caldera" valuePropName="checked">
            <Checkbox>Caldera</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="gas_natural" valuePropName="checked">
            <Checkbox>Gas natural</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="rampa_silla_ruedas" valuePropName="checked">
            <Checkbox>Rampa para silla de ruedas</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="linea_telefono" valuePropName="checked">
            <Checkbox>Línea (teléfono fijo)</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="generador" valuePropName="checked">
            <Checkbox>Generador</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="solo_familias" valuePropName="checked">
            <Checkbox>Solo familias</Checkbox>
          </Form.Item>
        </Col>

        {/* Ambientes */}
        <Col span={24}>
          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <Title level={4} className="mb-16">
            Ambientes
          </Title>
        </Col>
        <Col span={6}>
          <Form.Item name="balcon" valuePropName="checked">
            <Checkbox>Balcón</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="bano_visitas" valuePropName="checked">
            <Checkbox>Baño de visitas</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="closets" valuePropName="checked">
            <Checkbox>Closets</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="cocina" valuePropName="checked">
            <Checkbox>Cocina</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="comedor" valuePropName="checked">
            <Checkbox>Comedor</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="desayunador" valuePropName="checked">
            <Checkbox>Desayunador</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="homeoffice" valuePropName="checked">
            <Checkbox>Homeoffice</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="jardin" valuePropName="checked">
            <Checkbox>Jardín</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="lavadero" valuePropName="checked">
            <Checkbox>Lavadero</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="parrilla" valuePropName="checked">
            <Checkbox>Parrilla</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="patio" valuePropName="checked">
            <Checkbox>Patio</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="zona_juegos" valuePropName="checked">
            <Checkbox>Zona de juegos</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="roof" valuePropName="checked">
            <Checkbox>Roof</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="terraza" valuePropName="checked">
            <Checkbox>Terraza</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="walk_in_closet" valuePropName="checked">
            <Checkbox>Walk-in closet</Checkbox>
          </Form.Item>
        </Col>

        {/* Comodidades */}
        <Col span={24}>
          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <Title level={4} className="mb-16">
            Comodidades
          </Title>
        </Col>
        <Col span={6}>
          <Form.Item name="acceso_internet" valuePropName="checked">
            <Checkbox>Acceso a internet</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="area_cine" valuePropName="checked">
            <Checkbox>Área de cine</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="area_juegos" valuePropName="checked">
            <Checkbox>Área de juegos</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="business_center" valuePropName="checked">
            <Checkbox>Business center</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="cancha_basquetbol" valuePropName="checked">
            <Checkbox>Cancha de básquetbol</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="cancha_futbol" valuePropName="checked">
            <Checkbox>Cancha de fútbol</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="cancha_paddle" valuePropName="checked">
            <Checkbox>Cancha de paddle</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="chimenea" valuePropName="checked">
            <Checkbox>Chimenea</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="conserjeria_24_7" valuePropName="checked">
            <Checkbox>Conserjería 24/7</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="estacionamiento_visitas" valuePropName="checked">
            <Checkbox>Estacionamiento visitas</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="cisterna" valuePropName="checked">
            <Checkbox>Cisterna</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="refrigerador" valuePropName="checked">
            <Checkbox>Refrigerador</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="gimnasio" valuePropName="checked">
            <Checkbox>Gimnasio</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="tv_cable" valuePropName="checked">
            <Checkbox>TV por cable</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="recepcion" valuePropName="checked">
            <Checkbox>Recepción</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="salon_fiestas" valuePropName="checked">
            <Checkbox>Salón de fiestas</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="lavanderia" valuePropName="checked">
            <Checkbox>Lavandería</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="aire_acondicionado" valuePropName="checked">
            <Checkbox>Aire acondicionado</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="salon_usos_multiples" valuePropName="checked">
            <Checkbox>Salón de usos múltiples</Checkbox>
          </Form.Item>
        </Col>

        {/* Otros */}
        <Col span={24}>
          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <Title level={4} className="mb-16">
            Otros
          </Title>
        </Col>
        <Col span={6}>
          <Form.Item name="cancha_usos_multiples" valuePropName="checked">
            <Checkbox>Cancha de usos múltiples</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="con_area" valuePropName="checked">
            <Checkbox>Con área</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="con_condominio" valuePropName="checked">
            <Checkbox>Con condominio</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="con_energia" valuePropName="checked">
            <Checkbox>Con energía</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="conexion_lavarropas" valuePropName="checked">
            <Checkbox>Conexión para lavarropas</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="requiere_aval" valuePropName="checked">
            <Checkbox>Requiere aval</Checkbox>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="con_tv" valuePropName="checked">
            <Checkbox>Con TV</Checkbox>
          </Form.Item>
        </Col>
      </FieldGrid>
    </div>
  );
  };

  // Step 7: Descripción
  const renderDescripcionStep = () => (
    <div className="step-wrapper" style={{ display: currentStep === 'descripcion' ? 'block' : 'none' }}>
      <div className="step-wrapper__header">
        <h2 className="step-wrapper__title">Descripción</h2>
      </div>

      <FieldGrid>
        <Col span={24}>
          <Form.Item
            name="titulo"
            label="Título"
            rules={[{ required: true, message: 'Ingrese el título' }]}
          >
            <Input placeholder="Título de la propiedad" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="descripcion" label="Descripción">
            <TextArea rows={6} placeholder="Descripción de la propiedad" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="caracteristicas_ocultas" label="Características Ocultas">
            <TextArea
              rows={4}
              placeholder="¿Qué información quieres que Rentoso tenga en cuenta para recomendar la propiedad? buena luz, ambiente tranquilo, etc."
            />
          </Form.Item>
        </Col>
      </FieldGrid>
    </div>
  );

  // ✅ Validar campos del paso actual antes de avanzar
  const handleNextStep = async () => {
    try {
      const formMode = getFormMode();

      // Validaciones condicionales basadas en el tipo de propiedad y operación
      const caracteristicasFields = formMode === 'agricola-renta' ? ['m2_terreno', 'acceso_terreno'] : [];

      // Define los campos requeridos por cada paso
      let stepFields: Partial<Record<StepKey, string[]>>;
      if (formMode === 'agricola-renta') {
        stepFields = {
          'precio': ['precio_venta', 'divisa', 'operacion', 'tipo', 'propietario_id', 'comision'],
          'caracteristicas': caracteristicasFields,
          'ubicacion': ['nombre_calle', 'direccion', 'comuna', 'region'],
          'amenities_servicios_y_entorno': []
        };
      } else if (formMode === 'agricola-venta') {
        stepFields = {
          'precio': ['precio_moneda', 'precio_monto'],
          'caracteristicas': [],
          'ubicacion': ['direccion'],
          'multimedia': [],
          'amenities': [],
          'descripcion': []
        };
      } else if (formMode === 'bodega-renta' || formMode === 'bodega-venta') {
        stepFields = {
          'precio': ['precio_venta', 'divisa', 'operacion', 'tipo', 'propietario_id', 'comision'],
          'ubicacion': ['region', 'comuna', 'nombre_calle', 'direccion', 'acceso_terreno'],
          'caracteristicas': ['superficie_util', 'superficie_total', 'banos'],
          'amenities': []
        };
      } else if (formMode === 'casa-renta') {
        stepFields = {
          'precio': ['precio_venta', 'divisa', 'comision'],
          'ubicacion': ['nombre_calle', 'region', 'comuna', 'direccion', 'acceso_terreno'],
          'caracteristicas': ['superficie_util', 'superficie_total', 'habitaciones', 'banos'],
          'amenities': [],
          'medios': []
        };
      } else if (formMode === 'casa-renta-temporal') {
        stepFields = {
          'precio': ['precio_venta', 'divisa', 'operacion', 'tipo', 'propietario_id', 'comision', 'capacidad_huespedes'],
          'caracteristicas': ['superficie_util', 'm2_construidos', 'habitaciones', 'banos'],
          'ubicacion': ['nombre_calle', 'region', 'comuna', 'direccion', 'acceso_terreno'],
          'amenities': []
        };
      } else if (formMode === 'casa-venta') {
        stepFields = {
          'precio': ['precio_venta', 'divisa', 'operacion', 'tipo', 'propietario_id', 'comision'],
          'ubicacion': ['nombre_calle', 'region', 'comuna', 'direccion'],
          'caracteristicas': ['superficie_util', 'superficie_total', 'habitaciones', 'banos', 'acceso_terreno'],
          'amenities': [],
          'medios': []
        };
      } else if (formMode === 'departamento-renta') {
        stepFields = {
          'precio': ['precio_venta', 'divisa', 'operacion', 'tipo', 'propietario_id', 'comision'],
          'caracteristicas': ['superficie_util', 'm2_terreno', 'habitaciones', 'banos'],
          'ubicacion': ['nombre_calle', 'region', 'comuna', 'direccion'],
          'amenities': []
        };
      } else if (formMode === 'departamento-renta-temporal') {
        stepFields = {
          'precio': ['precio_venta', 'divisa', 'propietario_id', 'comision', 'rol', 'gastos_comunes', 'contribuciones', 'capacidad_huespedes'],
          'caracteristicas': ['superficie_util', 'm2_construidos', 'habitaciones', 'banos'],
          'ubicacion': ['nombre_calle', 'region', 'comuna', 'direccion', 'acceso_terreno'],
          'amenities': [],
          'medios': [],
          'descripcion': ['titulo']
        };
      } else if (formMode === 'departamento-venta') {
        stepFields = {
          'precio': ['precio_venta', 'divisa', 'operacion', 'tipo', 'propietario_id', 'comision'],
          'ubicacion': ['nombre_calle', 'region', 'comuna', 'direccion', 'acceso_terreno'],
          'caracteristicas': ['superficie_util', 'm2_terreno', 'habitaciones', 'banos'],
          'amenities': [],
          'medios': []
        };
      } else if (formMode === 'estacionamiento-renta') {
        stepFields = {
          'precio': ['precio_venta', 'divisa', 'operacion', 'tipo', 'propietario_id', 'comision'],
          'ubicacion': ['region', 'comuna', 'nombre_calle', 'direccion'],
          'caracteristicas': ['superficie_util', 'tipo_garage', 'acceso_terreno', 'anio_construccion'],
          'amenities': [],
          'medios': []
        };
      } else if (formMode === 'estacionamiento-venta') {
        stepFields = {
          'precio': ['precio_venta', 'divisa', 'operacion', 'tipo', 'propietario_id', 'comision'],
          'ubicacion': ['nombre_calle', 'numero_calle', 'letra', 'region', 'comuna', 'direccion'],
          'caracteristicas': ['superficie_total', 'superficie_util', 'num_estacionamientos_cubiertos', 'num_estacionamientos_descubiertos', 'tipo_garage', 'ubicacion_garage', 'acceso_terreno', 'antiguedad', 'anio_construccion'],
          'amenities': [],
          'medios': []
        };
      } else if (formMode === 'hotel-renta') {
        stepFields = {
          'precio': ['precio_venta', 'divisa', 'tipo_operacion', 'tipo', 'propietario_id', 'comision'],
          'ubicacion': ['nombre_calle', 'numero_calle', 'letra', 'numeroDepto', 'region', 'comuna', 'direccion', 'direccion_referencial', 'acceso_terreno', 'forma_terreno'],
          'caracteristicas': ['superficie_util', 'superficie_descubierta', 'superficie_semicubierta', 'superficie_total', 'habitaciones', 'banos', 'estacionamientos', 'tipo_garage', 'num_bodegas', 'antiguedad', 'estrellas', 'capacidad_total_huespedes', 'numero_pisos', 'num_ascensores', 'check_in_desde', 'check_out_hasta', 'politica_cancelacion', 'pet_friendly'],
          'amenities': [],
          'descripcion': ['descripcion', 'mostrar_contacto_pie'],
          'medios': []
        };
      } else if (formMode === 'hotel-venta') {
        stepFields = {
          'precio': ['precio_venta', 'divisa', 'operacion', 'tipo', 'propietario_id', 'comision', 'precio_tasacion', 'gastos_comunes', 'contribuciones', 'acepta_permuta', 'rol', 'deuda', 'hipoteca', 'banco'],
          'ubicacion': ['nombre_calle', 'numero_calle', 'letra', 'numeroDepto', 'region', 'comuna', 'direccion', 'direccion_referencial', 'acceso_terreno', 'forma_terreno'],
          'caracteristicas': ['superficie_util', 'superficie_descubierta', 'superficie_semicubierta', 'superficie_total', 'habitaciones', 'banos', 'estacionamientos', 'tipo_garage', 'antiguedad', 'bauleras', 'estrellas_hotel', 'caracteristicas_ocultas', 'descripcion', 'suites', 'plazas_servicio', 'disponible_desde', 'm2_terreno', 'm2_construidos', 'm2_terraza', 'tipo_construccion', 'disposicion', 'tipo_departamento', 'orientacion', 'anio_construccion', 'num_pisos', 'num_ascensores', 'piso', 'num_bodegas', 'departamentos_por_piso', 'disposicion_duplicada', 'tipo_piso', 'tipo_seguridad', 'tipo_calefaccion', 'tipo_gastos_comunes', 'tipo_gas', 'tipo_agua_caliente', 'recepcion_final', 'tipo_cocina', 'tipo_ventanas', 'num_estacionamientos_cubiertos', 'num_estacionamientos_descubiertos', 'capacidad_huespedes', 'en_condominio', 'recibos', 'llaves_oficina', 'tiene_letrero', 'Regularizada', 'agua', 'linea_telefono', 'generador', 'solo_familias', 'balcon', 'bano_visitas', 'closets', 'cocina', 'comedor', 'desayunador', 'homeoffice', 'jardin', 'lavadero', 'parrilla', 'patio', 'zona_juegos', 'roof', 'terraza', 'walk_in_closet', 'acceso_internet', 'area_cine', 'area_juegos', 'business_center', 'cancha_basquetbol', 'cancha_futbol', 'cancha_paddle', 'chimenea', 'conserjeria_24_7', 'estacionamiento_visitas', 'refrigerador', 'gimnasio', 'tv_cable', 'recepcion', 'salon_fiestas', 'lavanderia', 'aire_acondicionado', 'salon_usos_multiples', 'cancha_usos_multiples', 'con_area', 'con_condominio', 'con_energia', 'conexion_lavarropas', 'requiere_aval', 'con_tv'],
          'amenities': [],
          'medios': []
        };
      } else if (formMode === 'industrial-renta') {
        stepFields = {
          'precio': ['precio_venta', 'divisa', 'operacion', 'tipo', 'propietario_id', 'comision', 'precio_tasacion', 'gastos_comunes', 'contribuciones', 'rol', 'deuda', 'hipoteca', 'banco'],
          'caracteristicas': ['superficie_util', 'superficie_descubierta', 'superficie_semicubierta', 'superficie_total', 'banos', 'estacionamientos', 'bauleras', 'oficinas', 'antiguedad', 'm2_terreno', 'm2_construidos', 'm2_terraza', 'tipo_construccion', 'disposicion', 'orientacion', 'anio_construccion', 'num_pisos', 'num_ascensores', 'piso', 'num_bodegas', 'departamentos_por_piso', 'tipo_piso', 'tipo_seguridad', 'tipo_calefaccion', 'tipo_gastos_comunes', 'tipo_gas', 'tipo_agua_caliente', 'recepcion_final', 'tipo_cocina', 'tipo_ventanas', 'num_estacionamientos_cubiertos', 'num_estacionamientos_descubiertos', 'caracteristicas_ocultas', 'capacidad_huespedes', 'suites', 'habitaciones', 'plazas_servicio', 'disponible_desde'],
          'ubicacion': ['nombre_calle', 'numero_calle', 'letra', 'numeroDepto', 'region', 'comuna', 'direccion', 'direccion_referencial', 'acceso_terreno', 'forma_terreno'],
          'amenities': [],
          'descripcion': ['titulo', 'descripcion'],
          'medios': []
        };
      } else if (formMode === 'industrial-venta') {
        stepFields = {
          'precio': ['precio_venta', 'divisa', 'operacion', 'tipo', 'propietario_id', 'comision', 'precio_tasacion', 'gastos_comunes', 'contribuciones', 'acepta_permuta', 'rol', 'deuda', 'hipoteca', 'banco'],
          'ubicacion': ['nombre_calle', 'numero_calle', 'letra', 'numeroDepto', 'region', 'comuna', 'direccion', 'direccion_referencial', 'acceso_terreno', 'forma_terreno'],
          'caracteristicas': ['superficie_util', 'superficie_descubierta', 'superficie_semicubierta', 'superficie_total', 'caracteristicas_ocultas', 'm2_terreno', 'm2_construidos', 'm2_terraza', 'tipo_construccion', 'disposicion', 'tipo_departamento', 'orientacion', 'anio_construccion', 'num_pisos', 'num_ascensores', 'piso', 'departamentos_por_piso', 'disposicion_duplicada', 'tipo_piso', 'tipo_seguridad', 'tipo_calefaccion', 'tipo_gastos_comunes', 'tipo_gas', 'tipo_agua_caliente', 'recepcion_final', 'tipo_cocina', 'tipo_ventanas', 'num_estacionamientos_cubiertos', 'num_estacionamientos_descubiertos', 'capacidad_huespedes', 'en_condominio', 'recibos', 'llaves_oficina', 'tiene_letrero', 'piscina', 'cancha_tenis', 'bodega', 'sauna', 'jacuzzi', 'pieza_servicio', 'amoblado', 'permite_mascotas', 'Regularizada', 'agua', 'caldera', 'gas_natural', 'rampa_silla_ruedas', 'linea_telefono', 'generador', 'solo_familias', 'balcon', 'bano_visitas', 'closets', 'cocina', 'comedor', 'desayunador', 'homeoffice', 'jardin', 'lavadero', 'parrilla', 'patio', 'zona_juegos', 'roof', 'terraza', 'walk_in_closet', 'acceso_internet', 'area_cine', 'area_juegos', 'business_center', 'cancha_basquetbol', 'cancha_futbol', 'cancha_paddle', 'chimenea', 'conserjeria_24_7', 'estacionamiento_visitas', 'cisterna', 'refrigerador', 'gimnasio', 'tv_cable', 'recepcion', 'salon_fiestas', 'lavanderia', 'aire_acondicionado', 'salon_usos_multiples', 'cancha_usos_multiples', 'con_area', 'con_condominio', 'con_energia', 'conexion_lavarropas', 'requiere_aval', 'con_tv'],
          'amenities': ['banos', 'estacionamientos', 'bauleras', 'oficinas', 'antiguedad'],
          'descripcion': ['amen_servicio_agua_corriente', 'amen_servicio_alumbrado_publico', 'amen_servicio_apto_credito', 'amen_servicio_apto_profesional', 'amen_servicio_calles_adoquines', 'amen_servicio_cordon_cuneta', 'amen_servicio_desague_cloacal', 'amen_servicio_estabilizado_calles', 'amen_servicio_gas_natural', 'amen_servicio_internet', 'amen_servicio_luz', 'amen_servicio_ofrece_financiacion', 'amen_servicio_pavimento', 'amen_servicio_telefono', 'amen_servicio_wifi', 'amb_accesible', 'amb_alarma', 'amb_dependencia_servicio', 'amb_seguridad'],
          'medios': []
        };
      } else {
        stepFields = {
          'tipo-operacion': ['tipo', 'operacion', 'propietario_id'],
          'precio': ['precio_venta', 'divisa'],
          'caracteristicas': caracteristicasFields,
          'ubicacion': ['nombre_calle', 'direccion', 'comuna', 'region'],
          'multimedia': [],
          'amenities': [],
          'descripcion': ['titulo']
        };
      }

      const fieldsToValidate = stepFields[currentStep] || [];

      if (fieldsToValidate.length > 0) {
        await form.validateFields(fieldsToValidate);
      }

      const currentIndex = steps.findIndex(s => s.key === currentStep);
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1].key);
      }
    } catch (error) {
      console.error('Validation failed for step:', currentStep, error);
      message.error('Por favor complete todos los campos requeridos');
    }
  };

  return (
    <div className="property-form">
      <div className={`property-form__container ${currentStep === 'tipo-operacion' ? 'is-wizard-step' : ''}`}>
        <Button
          type="text"
          icon={<ArrowLeft size={16} />}
          onClick={handleCancel}
          style={{ marginBottom: '1.5rem' }}
        >
          Volver a Propiedades
        </Button>
        {/* Bear Progress Bar */}
        <BearProgressBar
          steps={steps}
          currentStepKey={currentStep}
          completedSteps={steps
            .slice(0, steps.findIndex(s => s.key === currentStep))
            .map(s => s.key)
          }
          onStepClick={(stepKey) => {
            const targetIndex = steps.findIndex(s => s.key === stepKey);
            const currentIndex = steps.findIndex(s => s.key === currentStep);
            if (targetIndex <= currentIndex) {
              setCurrentStep(stepKey as StepKey);
            }
          }}
        />

        {/* Main Content */}
        <div className="flex-1">
          <Card
            className="modern-card propiedad-form-card"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              minHeight: '700px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              onValuesChange={() => {
                if (mode === 'create') {
                  const values = form.getFieldsValue();
                  saveDraft(values);
                }
              }}
              initialValues={{
                estado: EstadoPropiedad.Disponible,
                divisa: Divisa.CLP,
                operacion: [TipoOperacion.Venta],
                mostrar_mapa: 'si',
                enviar_coordenadas: 'si'
              }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                {/* 
                  🔧 CRITICAL FIX: Hidden Form.Items required for Form.useWatch() to work
                  
                  Ant Design's Form.useWatch() only observes fields that have a corresponding
                  <Form.Item> in the component tree. PropertyWizard sets values using
                  form.setFieldValue(), but without these hidden items, useWatch returns undefined.
                  
                  DO NOT REMOVE these hidden fields or characteristics step will break!
                */}
                <Form.Item name="tipo" hidden><Input /></Form.Item>
                <Form.Item name="operacion" hidden><Input /></Form.Item>
                <Form.Item name="estado" hidden><Input /></Form.Item>
                <Form.Item name="comision" hidden><Input /></Form.Item>

                {/* ✅ RENDERIZAR TODOS LOS PASOS SIEMPRE (mantener en DOM) */}
                {renderTipoOperacionStep()}
                {renderPrecioStep()}
                {renderCaracteristicasStep()}
                {renderUbicacionStep()}
                {renderMultimediaStep()}
                {renderAmenitiesStep()}
                {renderDescripcionStep()}
                {renderMediosStep()}
              </div>
            </Form>
          </Card>
        </div>

        {/* Hide navigation buttons for tipo-operacion step since PropertyWizard handles its own navigation */}
        {currentStep !== 'tipo-operacion' && (
          <div className="property-form__navigation">
            {steps.findIndex(s => s.key === currentStep) > 0 && (
              <Button
                onClick={() => {
                  const currentIndex = steps.findIndex(s => s.key === currentStep);
                  if (currentIndex > 0) {
                    setCurrentStep(steps[currentIndex - 1].key);
                  }
                }}
              >
                Anterior
              </Button>
            )}
            {steps.findIndex(s => s.key === currentStep) < steps.length - 1 ? (
              <Button
                type="primary"
                onClick={handleNextStep}
              >
                Siguiente
              </Button>
            ) : (
              <Button type="primary" loading={loading} onClick={handleFinish}>
                {mode === 'edit' ? 'Actualizar' : 'Publicar'}
              </Button>
            )}
          </div>
        )}

        <AgregarPropietarioModal
          open={propietarioModalVisible}
          onClose={() => setPropietarioModalVisible(false)}
          onCreated={handlePropietarioCreated}
        />
      </div>
    </div>
  );
};

export default FormPropiedad;