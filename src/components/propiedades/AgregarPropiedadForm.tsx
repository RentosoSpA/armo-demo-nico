import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Row,
  Col,
  Checkbox,
  Upload,
  Card,
  Typography,
  message,
  Divider,
  Radio,
  Steps,
} from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { UploadFile } from 'antd/es/upload/interface';
import { TipoPropiedad, EstadoPropiedad, Divisa } from '../../types/propiedad';
import { useUserStore } from '../../store/userStore';
import { getPropietarios } from '../../services/mock/propietariosServiceMock';
import type { Propietario } from '../../types/propietario';
import { createPropiedad } from '../../services/mock/propiedadesServiceMock';
import { uploadImage } from '../../services/multimedia/imagenesService';
import AgregarPropietarioModal from '../propietarios/AgregarPropietarioModal';
import '../../styles/components/_property-forms.scss';

const { Option } = Select;
const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

interface Props {
  onCreated?: () => void;
}

type StepKey = 'general' | 'detalles' | 'medio';

const AgregarPropiedadForm = ({ onCreated }: Props) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<StepKey>('general');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const { empresa } = useUserStore();
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [photoFileList, setPhotoFileList] = useState<UploadFile[]>([]);
  const [planoFileList, setPlanoFileList] = useState<UploadFile[]>([]);
  const [propietarioModalVisible, setPropietarioModalVisible] = useState(false);

  const steps = [
    { key: 'general' as StepKey, title: 'General', number: 1 },
    { key: 'detalles' as StepKey, title: 'Detalles', number: 2 },
    { key: 'medio' as StepKey, title: 'Medio', number: 3 },
  ];

  const fetchData = useCallback(async () => {
    try {
      setLoadingData(true);
      const propietarios = await getPropietarios();
      setPropietarios(propietarios);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingData(false);
    }
  }, [empresa?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCancel = () => {
    navigate('/propiedades');
  };


  const handlePhotoUpload = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setPhotoFileList(newFileList);
  };

  const handlePlanoUpload = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setPlanoFileList(newFileList);
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      
      const values = form.getFieldsValue();
      
      // Set empresa from userStore
      if (empresa?.id) {
        values.empresa_id = empresa.id;
      }

      console.log('Form values:', values);

      const response = await createPropiedad(values);
      console.log('Property created:', response);

      // Upload photos if any
      if (photoFileList.length > 0 && response.id) {
        for (const file of photoFileList) {
          if (file.originFileObj) {
            try {
              await uploadImage(response.id, file.originFileObj);
            } catch (error) {
              console.error('Error uploading photo:', error);
            }
          }
        }
      }

      message.success('Propiedad creada exitosamente');
      onCreated?.();
      navigate('/propiedades');
    } catch (error) {
      console.error('Error creating property:', error);
      message.error('Error al crear la propiedad');
    } finally {
      setLoading(false);
    }
  };

  const handlePropietarioCreated = () => {
    fetchData();
    setPropietarioModalVisible(false);
  };

  const renderGeneralStep = () => (
    <div className="property-form__step-content">
      <Title level={3} className="property-form__title">
        Información General
      </Title>

      <Row gutter={[16, 16]}>
        {/* Precio Section */}
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                name="precio_venta"
                label="Precio"
                rules={[{ required: true, message: 'Ingrese el precio' }]}
                className="property-form__input-full-width"
              >
                <InputNumber
                  min={0}
                  placeholder="0.00"
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
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
              <Form.Item name="valor_por_m2" valuePropName="checked">
                <Checkbox>Valor por m2</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Col>

        {/* Tipo de propiedad */}
        <Col span={12}>
          <Form.Item
            name="tipo"
            label="Tipo de propiedad"
            rules={[{ required: true, message: 'Seleccione el tipo' }]}
          >
            <Select placeholder="Seleccionar">
              {Object.values(TipoPropiedad).map(tipo => (
                <Option key={tipo} value={tipo}>{tipo}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Operation type */}
        <Col span={24}>
          <Form.Item
            name="operacion"
            label="Tipo de operación"
            rules={[{ required: true, message: 'Seleccione el tipo de operación' }]}
          >
            <Radio.Group>
              <Radio value="renta">Renta</Radio>
              <Radio value="venta">Venta</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>

        {/* Gastos y contribuciones */}
        <Col span={12}>
          <Form.Item name="gastos_comunes" label="Gastos Comunes">
            <InputNumber
                min={0}
              placeholder="Gastos comunes"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="contribuciones" label="Contribuciones">
            <InputNumber
                min={0}
              placeholder="Contribuciones"
            />
          </Form.Item>
        </Col>

        {/* Deuda, Hipoteco, Banco */}
        <Col span={8}>
          <Form.Item name="deuda" label="Deuda">
            <Input placeholder="Deuda" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="hipoteco" label="Hipoteco">
            <Input placeholder="Hipoteco" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="banco" label="Banco">
            <Select placeholder="Seleccionar banco">
              <Option value="banco1">Banco 1</Option>
              <Option value="banco2">Banco 2</Option>
            </Select>
          </Form.Item>
        </Col>

        {/* Características Ocultas */}
        <Col span={24}>
          <Form.Item name="caracteristicas_ocultas" label="Características Ocultas">
            <TextArea
              rows={4}
              placeholder="¿Qué información quiere que Rentoso tenga en cuenta para recomendar la propiedad?, buena luz, ambiente tranquilo, etc."
            />
          </Form.Item>
        </Col>

        <Divider className="property-form__divider" />

        {/* Dirección */}
        <Col span={24}>
          <Title level={4} className="property-form__section-title">
            Dirección
          </Title>
        </Col>

        <Col span={24}>
          <Form.Item
            name="direccion"
            label="Calle"
            rules={[{ required: true, message: 'Ingrese la dirección' }]}
          >
            <Input placeholder="Dirección completa" />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item name="numero_calle" label="N° de calle">
            <Input placeholder="N°" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="unidad" label="Unidad">
            <Input placeholder="Unidad" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="letra" label="Letra">
            <Input placeholder="Letra" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="etapa" label="Etapa">
            <Input placeholder="Etapa" />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item name="direccion_referencial" label="Dirección referencial">
            <Input placeholder="Dirección referencial" />
          </Form.Item>
        </Col>

        {/* Comuna y Región */}
        <Col span={12}>
          <Form.Item
            name="comuna"
            label="Comuna"
            rules={[{ required: true, message: 'Ingrese la comuna' }]}
          >
            <Input placeholder="Comuna" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="region"
            label="Región"
            rules={[{ required: true, message: 'Ingrese la región' }]}
          >
            <Input placeholder="Región" />
          </Form.Item>
        </Col>

        {/* Map options */}
        <Col span={24}>
          <Title level={5} className="property-form__section-title">
            Map
          </Title>
          <Form.Item name="mostrar_mapa" label="Mostrar mapa en la ficha de la propiedad">
            <Radio.Group defaultValue="si">
              <Radio value="si">Sí</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="enviar_coordenadas" label="Enviar coordenadas a portales">
            <Radio.Group defaultValue="si">
              <Radio value="si">Sí</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
    </div>
  );

  const renderDetallesStep = () => (
    <div className="property-form__step-content">
      <Title level={3} className="property-form__title">
        Detalles de la Propiedad
      </Title>

      <Row gutter={[16, 16]}>
        {/* Multipublicación */}
        <Col span={24}>
          <Title level={4} className="property-form__section-title">
            Multipublicación
          </Title>
        </Col>
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
            <TextArea rows={4} placeholder="Descripción de la propiedad" />
          </Form.Item>
        </Col>

        <Divider className="property-form__divider" />

        {/* Información Propiedad */}
        <Col span={24}>
          <Title level={4} className="property-form__section-title">
            Información Propiedad
          </Title>
        </Col>

        {/* Row 1 */}
        <Col span={6}>
          <Form.Item name="suites" label="Suites">
            <Select placeholder="0">
              {[...Array(11)].map((_, i) => (
                <Option key={i} value={i}>{i}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="habitaciones"
            label="Dormitorios"
            rules={[{ required: true, message: 'Ingrese dormitorios' }]}
          >
            <Select placeholder="0">
              {[...Array(11)].map((_, i) => (
                <Option key={i} value={i}>{i}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="plazas_servicio" label="Plazas de servicio">
            <Select placeholder="0">
              {[...Array(11)].map((_, i) => (
                <Option key={i} value={i}>{i}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="banos"
            label="Baños"
            rules={[{ required: true, message: 'Ingrese baños' }]}
          >
            <Select placeholder="0">
              {[...Array(11)].map((_, i) => (
                <Option key={i} value={i}>{i}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Row 2 */}
        <Col span={6}>
          <Form.Item name="disponible_desde" label="Disponible desde" className="property-form__input-full-width">
            <DatePicker placeholder="Fecha" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="m2_terreno" label="m2 de terreno">
            <Select placeholder="0">
              {[...Array(21)].map((_, i) => (
                <Option key={i * 50} value={i * 50}>{i * 50}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="m2_construidos" label="m2 construidos">
            <Select placeholder="0">
              {[...Array(21)].map((_, i) => (
                <Option key={i * 50} value={i * 50}>{i * 50}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="m2_terraza" label="m2 de terraza">
            <Select placeholder="0">
              {[...Array(21)].map((_, i) => (
                <Option key={i * 10} value={i * 10}>{i * 10}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Row 3 */}
        <Col span={6}>
          <Form.Item name="tipo_departamento" label="Tipo de departamento">
            <Select placeholder="Seleccionar">
              <Option value="estudio">Estudio</Option>
              <Option value="1_ambiente">1 Ambiente</Option>
              <Option value="2_ambientes">2 Ambientes</Option>
              <Option value="3_ambientes">3 Ambientes</Option>
              <Option value="4_ambientes">4 Ambientes</Option>
              <Option value="penthouse">Penthouse</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="orientacion" label="Orientación">
            <Select placeholder="Seleccionar">
              <Option value="norte">Norte</Option>
              <Option value="sur">Sur</Option>
              <Option value="este">Este</Option>
              <Option value="oeste">Oeste</Option>
              <Option value="noreste">Noreste</Option>
              <Option value="noroeste">Noroeste</Option>
              <Option value="sureste">Sureste</Option>
              <Option value="suroeste">Suroeste</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="anio_construccion" label="Año de construcción">
            <Input placeholder="2024" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="num_pisos" label="N° de pisos">
            <Select placeholder="1">
              {[...Array(51)].map((_, i) => (
                <Option key={i + 1} value={i + 1}>{i + 1}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Row 4 */}
        <Col span={6}>
          <Form.Item name="num_ascensores" label="N° ascensores">
            <Select placeholder="0">
              {[...Array(11)].map((_, i) => (
                <Option key={i} value={i}>{i}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="piso" label="Piso">
            <Select placeholder="1">
              {[...Array(51)].map((_, i) => (
                <Option key={i + 1} value={i + 1}>{i + 1}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="num_bodegas" label="N° de Bodegas">
            <Select placeholder="0">
              {[...Array(11)].map((_, i) => (
                <Option key={i} value={i}>{i}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="departamentos_por_piso" label="Departamentos por piso">
            <Select placeholder="1">
              {[...Array(21)].map((_, i) => (
                <Option key={i + 1} value={i + 1}>{i + 1}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Row 5 */}
        <Col span={6}>
          <Form.Item name="disposicion" label="Disposición">
            <Select placeholder="Seleccionar">
              <Option value="interior">Interior</Option>
              <Option value="exterior">Exterior</Option>
              <Option value="contrafrente">Contrafrente</Option>
              <Option value="al_frente">Al frente</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="num_estacionamientos" label="Estacionamientos">
            <Select placeholder="0">
              {[...Array(11)].map((_, i) => (
                <Option key={i} value={i}>{i}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="tipo_calefaccion" label="Tipo de calefacción">
            <Input placeholder="Tipo de calefacción" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="tipo_gastos_comunes" label="Tipo de gastos comunes">
            <Input placeholder="Tipo de gastos comunes" />
          </Form.Item>
        </Col>

        {/* Row 6 */}
        <Col span={6}>
          <Form.Item name="ambientes" label="Ambientes">
            <Select placeholder="1">
              {[...Array(11)].map((_, i) => (
                <Option key={i + 1} value={i + 1}>{i + 1}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="numero_torre" label="Número de torre">
            <Select placeholder="1">
              {[...Array(11)].map((_, i) => (
                <Option key={i + 1} value={i + 1}>{i + 1}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="tipo_seguridad" label="Tipo de seguridad">
            <Input placeholder="Tipo de seguridad" />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="subas_estar" label="Subas de estar">
            <Select placeholder="0">
              {[...Array(11)].map((_, i) => (
                <Option key={i} value={i}>{i}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* Amenidades */}
        <Col span={24}>
          <Divider className="property-form__divider" />
          <Title level={4} className="property-form__section-title">
            Amenidades
          </Title>
          <Row gutter={[16, 16]}>
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
              <Form.Item name="tiene_sereno" valuePropName="checked">
                <Checkbox>Tiene sereno</Checkbox>
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
              <Form.Item name="plaza_servicio" valuePropName="checked">
                <Checkbox>Plaza de servicio</Checkbox>
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
          </Row>
        </Col>

        {/* Adicionales */}
        <Col span={24}>
          <Divider className="property-form__divider" />
          <Title level={4} className="property-form__section-title">
            Adicionales
          </Title>
          <Row gutter={[16, 16]}>
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
              <Form.Item name="linea" valuePropName="checked">
                <Checkbox>Línea</Checkbox>
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
          </Row>
        </Col>

        {/* Ambientes */}
        <Col span={24}>
          <Divider className="property-form__divider" />
          <Title level={4} className="property-form__section-title">
            Ambientes
          </Title>
          <Row gutter={[16, 16]}>
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
                <Checkbox>Zona de Juegos</Checkbox>
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
          </Row>
        </Col>

        {/* Comodidades */}
        <Col span={24}>
          <Divider className="property-form__divider" />
          <Title level={4} className="property-form__section-title">
            Comodidades
          </Title>
          <Row gutter={[16, 16]}>
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
              <Form.Item name="business" valuePropName="checked">
                <Checkbox>Business</Checkbox>
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
              <Form.Item name="cancha_basquetbol2" valuePropName="checked">
                <Checkbox>Cancha de básquetbol</Checkbox>
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
              <Form.Item name="conserjeria_24" valuePropName="checked">
                <Checkbox>Conserjería 24</Checkbox>
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
              <Form.Item name="refrigerado" valuePropName="checked">
                <Checkbox>Refrigerado</Checkbox>
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
              <Form.Item name="salon_usos" valuePropName="checked">
                <Checkbox>Salón de usos</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Col>

        {/* Otros */}
        <Col span={24}>
          <Divider className="property-form__divider" />
          <Title level={4} className="property-form__section-title">
            Otros
          </Title>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Form.Item name="canchas_usos" valuePropName="checked">
                <Checkbox>Canchas de usos</Checkbox>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="con_drep" valuePropName="checked">
                <Checkbox>Con drep</Checkbox>
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
          </Row>
        </Col>

        {/* Propietario */}
        <Col span={24}>
          <Divider className="property-form__divider" />
          <Form.Item
            name="propietario_id"
            label="Propietario"
            rules={[{ required: true, message: 'Seleccione un propietario' }]}
          >
            <Select
              placeholder="Seleccionar propietario"
              loading={loadingData}
              dropdownRender={menu => (
                <>
                  {menu}
                  <div className="property-form__dropdown-add-button">
                    <Button
                      type="link"
                      icon={<PlusOutlined />}
                      onClick={() => setPropietarioModalVisible(true)}
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

        {/* Observaciones */}
        <Col span={24}>
          <Form.Item name="observaciones" label="Observaciones">
            <TextArea
              rows={3}
              placeholder="Cuenta al integrador SI Rentoso va impuestos/gastos, características técnicas, etc."
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );

  const renderMedioStep = () => (
    <div className="property-form__step-content">
      <Title level={3} className="property-form__title">
        Media
      </Title>

      <Row gutter={[16, 32]}>
        {/* Fotos */}
        <Col span={24}>
          <Title level={4} className="property-form__section-title">
            Fotos
          </Title>
          <Form.Item name="fotos">
            <Dragger
              fileList={photoFileList}
              onChange={handlePhotoUpload}
              beforeUpload={() => false}
              multiple
              accept="image/*"
              className="property-form__upload-dragger"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="property-form__upload-text">
                Añade fotos arrastrándolas aquí o subiéndolas
              </p>
            </Dragger>
          </Form.Item>
          <p className="property-form__upload-hint">
            Max 200 fotos. Tamaño de imagen sugerido: 4:3
          </p>
        </Col>

        {/* Planos */}
        <Col span={24}>
          <Title level={4} className="property-form__section-title">
            Planos
          </Title>
          <Form.Item name="planos">
            <Dragger
              fileList={planoFileList}
              onChange={handlePlanoUpload}
              beforeUpload={() => false}
              multiple
              accept="image/*,.pdf"
              className="property-form__upload-dragger"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="property-form__upload-text">
                Añade fotos arrastrándolas aquí o subiéndolas
              </p>
            </Dragger>
          </Form.Item>
          <p className="property-form__upload-hint">
            Máx 10 planos, formato válido: JPG, JPEG, PNG
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
            <Input placeholder="- Introduce un enlace a Youtube -" />
          </Form.Item>
        </Col>

        {/* Publicación */}
        <Col span={24}>
          <Title level={5} className="property-form__section-title">
            Tu propiedad será publicada en:
          </Title>
          <div className="property-form__publication-platforms">
            <span>🏠 icasas</span>
            <span>trovit</span>
            <span>Mitula</span>
            <span>🏘️ nestori</span>
          </div>
        </Col>
      </Row>
    </div>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 'general':
        return renderGeneralStep();
      case 'detalles':
        return renderDetallesStep();
      case 'medio':
        return renderMedioStep();
      default:
        return renderGeneralStep();
    }
  };

  return (
    <div className="property-form__container">
      <div className="property-form__back-button">
        <Button
          type="text"
          icon={<ArrowLeft size={16} />}
          onClick={handleCancel}
        >
          Volver a Propiedades
        </Button>
      </div>

      <div className="property-form__layout">
        {/* Header with Stepper */}
        <div className="property-form__header">
          <Title level={2} className="property-form__title">
            Añadir propiedad
          </Title>

          <Steps
            current={steps.findIndex(step => step.key === currentStep)}
            items={steps.map(step => ({
              title: step.title,
              status: currentStep === step.key ? 'process' :
                     steps.findIndex(s => s.key === currentStep) > steps.findIndex(s => s.key === step.key) ? 'finish' : 'wait'
            }))}
            onChange={(current) => {
              const step = steps[current];
              if (step) {
                setCurrentStep(step.key);
              }
            }}
            className="custom-steps"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card className="modern-card">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{
                estado: EstadoPropiedad.Disponible,
                divisa: Divisa.CLP,
                operacion: 'venta',
                mostrar_mapa: 'si',
                enviar_coordenadas: 'si'
              }}
            >
              {getCurrentStepContent()}

              <div className="property-form__footer">
                <div>
                  {currentStep !== 'general' && (
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
                </div>
                <div>
                  {currentStep !== 'medio' ? (
                    <Button 
                      type="primary" 
                      onClick={() => {
                        const currentIndex = steps.findIndex(s => s.key === currentStep);
                        if (currentIndex < steps.length - 1) {
                          setCurrentStep(steps[currentIndex + 1].key);
                        }
                      }}
                    >
                      Siguiente
                    </Button>
                  ) : (
                    <Button type="primary" loading={loading} onClick={handleFinish}>
                      Publicar
                    </Button>
                  )}
                </div>
              </div>
            </Form>
          </Card>
        </div>
      </div>

      <AgregarPropietarioModal
        open={propietarioModalVisible}
        onClose={() => setPropietarioModalVisible(false)}
        onCreated={handlePropietarioCreated}
      />

      <AgregarPropietarioModal
        open={propietarioModalVisible}
        onClose={() => setPropietarioModalVisible(false)}
        onCreated={handlePropietarioCreated}
      />
    </div>
  );
};

export default AgregarPropiedadForm;