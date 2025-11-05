import {
  Steps,
  message,
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
  Modal,
} from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import type { PropiedadCreate } from '../../types/propiedad';

import type { UploadFile } from 'antd/es/upload/interface';
import { TipoPropiedad, EstadoPropiedad, Divisa } from '../../types/propiedad';
import { useUserStore } from '../../store/userStore';
import { getPropietarios } from '../../services/mock/propietariosServiceMock';
import type { Propietario } from '../../types/propietario';
import { createPropiedad } from '../../services/mock/propiedadesServiceMock';
import dayjs from 'dayjs';
import { uploadImage } from '../../services/multimedia/imagenesService';
import AgregarPropietarioModal from '../propietarios/AgregarPropietarioModal';

const { Option } = Select;

export interface AgregarPropiedadModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const AgregarPropiedadModal = ({ open, onClose, onCreated }: AgregarPropiedadModalProps) => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<PropiedadCreate>({} as PropiedadCreate);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const { agent, empresa } = useUserStore();
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [fechaConstruccion, setFechaConstruccion] = useState<string>('');
  const [disponibilidadDesde, setDisponibilidadDesde] = useState<string>('');
  const [disponibilidadHasta, setDisponibilidadHasta] = useState<string>('');
  const [isVenta, setIsVenta] = useState(false);
  const [isArriendo, setIsArriendo] = useState(false);
  const [propietarioModalVisible, setPropietarioModalVisible] = useState(false);

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
    if (open) {
      try {
        fetchData();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }, [open, fetchData]);

  // Removed empresa and agente selection logic since they come from userStore

  const resetForm = () => {
    setCurrent(0);
    setFormData({} as PropiedadCreate);
    setFileList([]);
    setFechaConstruccion('');
    setDisponibilidadDesde('');
    setDisponibilidadHasta('');
    setIsVenta(false);
    setIsArriendo(false);
    form.resetFields();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const next = () => {
    // Validate that at least one of venta or arriendo is selected for first step
    if (current === 0 && !isVenta && !isArriendo) {
      message.error('Debe seleccionar al menos una opción: Venta o Arriendo');
      return;
    }

    form
      .validateFields()
      .then(values => {
        // Store date values in state
        if (values.fechaConstruccion) {
          setFechaConstruccion(dayjs(values.fechaConstruccion).toISOString());
        }
        if (values.disponibleDesde) {
          setDisponibilidadDesde(dayjs(values.disponibleDesde).toISOString());
        }
        if (values.disponibleHasta) {
          setDisponibilidadHasta(dayjs(values.disponibleHasta).toISOString());
        }

        // Convert dayjs objects to ISO strings for API
        const processedValues = {
          ...values,
          fechaConstruccion: values.fechaConstruccion
            ? dayjs(values.fechaConstruccion).toISOString()
            : '',
          disponibilidadDesde: values.disponibleDesde
            ? dayjs(values.disponibleDesde).toISOString()
            : undefined,
          disponibilidadHasta: values.disponibleHasta
            ? dayjs(values.disponibleHasta).toISOString()
            : undefined,
        };
        setFormData(prev => ({ ...prev, ...processedValues }));
        setCurrent(prev => prev + 1);
      })
      .catch(error => {
        console.error('Validation failed:', error);
      });
  };

  const prev = () => setCurrent(prev => prev - 1);

  const handleFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
    setFileList(newFileList);
  };

  const handlePropietarioCreated = () => {
    fetchData();
    setPropietarioModalVisible(false);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Solo se permiten archivos de imagen!');
      return false;
    }

    const isLt10MB = file.size / 1024 / 1024 < 10;
    if (!isLt10MB) {
      message.error('La imagen debe ser menor a 10MB!');
      return false;
    }

    return false; // Prevent auto upload
  };

  const finish = async () => {
    try {
      const values = await form.validateFields();

      // Validate that at least one of venta or arriendo is selected
      if (!isVenta && !isArriendo) {
        message.error('Debe seleccionar al menos una opción: Venta o Arriendo');
        return;
      }

      const finalData = { ...formData, ...values } as PropiedadCreate;

      // Add the stored date values to the final object
      const processedData: PropiedadCreate = {
        ...finalData,
        empresaId: empresa?.id || '',
        agenteId: agent?.id || '',
        fechaConstruccion: new Date(fechaConstruccion),
        venta: isVenta,
        arriendo: isArriendo,
        // Add propiedadVenta if venta is selected
        ...(isVenta && {
          propiedadVenta: {
            divisa: values.ventaDivisa,
            precioPrincipal: values.ventaPrecioPrincipal,
            precioUF: 0, // Will be calculated on the backend
            precioPesos: 0, // Will be calculated on the backend
            comision: values.ventaComision || 0,
          },
        }),
        // Add propiedadArriendo if arriendo is selected
        ...(isArriendo && {
          propiedadArriendo: {
            divisa: values.arriendoDivisa,
            precioPrincipal: values.arriendoPrecioPrincipal,
            precioUF: 0, // Will be calculated on the backend
            precioPesos: 0, // Will be calculated on the backend
            comision: values.arriendoComision || 0,
            gastosComunes: values.gastosComunes || 0,
            incluyeGastosComunes: values.incluyeGastosComunes || false,
            disponibleDesde: disponibilidadDesde ? new Date(disponibilidadDesde) : new Date(),
            disponibleHasta: disponibilidadHasta ? new Date(disponibilidadHasta) : new Date(),
          },
        }),
      };

      setLoading(true);

      // First, create the propiedad in the database
      const createdPropiedad = await createPropiedad(processedData);

      // If propiedad creation is successful, upload images
      if (fileList.length > 0) {
        try {
          const uploadPromises = fileList.map(file => {
            if (file.originFileObj) {
              return uploadImage(
                `propiedades/${createdPropiedad.id}/ficha/imagenes`,
                file.originFileObj
              );
            }
            return Promise.resolve();
          });

          await Promise.all(uploadPromises);
          message.success('Propiedad e imágenes agregadas correctamente');
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          message.warning('Propiedad creada pero hubo un error al subir las imágenes');
        }
      } else {
        message.success('Propiedad agregada correctamente');
      }

      resetForm();
      onCreated?.();
      handleClose();
    } catch (error) {
      console.error('Error creating propiedad:', error);
      message.error('Error al crear la propiedad');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (current) {
      case 0:
        return (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="tipo" label="Tipo de Propiedad" rules={[{ required: true }]}>
                  <Select>
                    {Object.values(TipoPropiedad).map(tipo => (
                      <Option key={tipo} value={tipo}>{tipo}</Option>
                    ))}
                    
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="estado" label="Estado" rules={[{ required: true }]}>
                  <Select>
                    <Option value={EstadoPropiedad.Disponible}>{EstadoPropiedad.Disponible}</Option>
                    <Option value={EstadoPropiedad.Reservada}>{EstadoPropiedad.Reservada}</Option>
                    <Option value={EstadoPropiedad.Arrendada}>{EstadoPropiedad.Arrendada}</Option>
                    <Option value={EstadoPropiedad.Vendida}>{EstadoPropiedad.Vendida}</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={20}>
                <Form.Item name="propietarioId" label="Propietario" rules={[{ required: true }]}>
                  <Select
                    placeholder="Selecciona un propietario"
                    showSearch
                    optionFilterProp="children"
                    loading={loadingData}
                    filterOption={(input, option) =>
                      (option?.children as unknown as string)
                        ?.toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {propietarios.map(propietario => (
                      <Option key={propietario.id} value={propietario.id}>
                        {propietario.nombre}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item label=" " className="mb-0">
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setPropietarioModalVisible(true);
                    }}
                    className="w-full mt-4"
                  >
                    Añadir
                  </Button>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="titulo" label="Título" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="descripcion" label="Descripción">
              <Input.TextArea rows={2} />
            </Form.Item>
            <Form.Item name="direccion" label="Dirección" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            {/* Venta and Arriendo Selection */}
            <div
              className="liquid-glass mb-16 p-16"
            >
              <h4 className="mb-16">Tipo de Operación</h4>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="venta" valuePropName="checked">
                    <Checkbox checked={isVenta} onChange={e => setIsVenta(e.target.checked)}>
                      Venta
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="arriendo" valuePropName="checked">
                    <Checkbox checked={isArriendo} onChange={e => setIsArriendo(e.target.checked)}>
                      Arriendo
                    </Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Venta Fields */}
            {isVenta && (
              <div
                className="mb-16 p-16"
              >
                <h4 className="mb-16">Datos de Venta</h4>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="ventaDivisa" label="Divisa" rules={[{ required: isVenta }]}>
                      <Select>
                        <Option value={Divisa.UF}>{Divisa.UF}</Option>
                        <Option value={Divisa.CLP}>{Divisa.CLP}</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="ventaPrecioPrincipal"
                      label="Precio de Venta"
                      rules={[{ required: isVenta }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="ventaComision"
                      label="Comisión (%)"
                      rules={[
                        {
                          type: 'number',
                          min: 0,
                          max: 100,
                          message: 'La comisión debe estar entre 0 y 100%',
                        },
                      ]}
                    >
                      <InputNumber min={0} max={100} className="w-full" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}

            {/* Arriendo Fields */}
            {isArriendo && (
              <div
                className="mb-16 p-16"
              >
                <h4 className="mb-16">Datos de Arriendo</h4>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="arriendoDivisa"
                      label="Divisa"
                      rules={[{ required: isArriendo }]}
                    >
                      <Select>
                        <Option value={Divisa.UF}>{Divisa.UF}</Option>
                        <Option value={Divisa.CLP}>{Divisa.CLP}</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="arriendoPrecioPrincipal"
                      label="Precio de Arriendo"
                      rules={[{ required: isArriendo }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="arriendoComision"
                      label="Comisión (%)"
                      rules={[
                        {
                          type: 'number',
                          min: 0,
                          max: 100,
                          message: 'La comisión debe estar entre 0 y 100%',
                        },
                      ]}
                    >
                      <InputNumber min={0} max={100} className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="gastosComunes" label="Gastos Comunes">
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="incluyeGastosComunes" valuePropName="checked">
                      <Checkbox>Incluye gastos comunes en el precio</Checkbox>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="disponibleDesde" label="Disponible Desde">
                      <DatePicker className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="disponibleHasta" label="Disponible Hasta">
                      <DatePicker className="w-full" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}
            <Form.Item
              name="fechaConstruccion"
              label="Fecha de Construcción"
              rules={[{ required: true }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </>
        );
      case 1:
        return (
          <>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="habitaciones"
                  label="Número de Habitaciones"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} className="w-full" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="banos" label="Número de Baños" rules={[{ required: true }]}>
                  <InputNumber min={1} className="w-full" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="areaTotal" label="Área Total (m²)" rules={[{ required: true }]}>
                  <InputNumber min={10} className="w-full" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="areaUsable" label="Área Usable (m²)">
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="piso" label="Piso" rules={[{ required: true }]}>
                  <InputNumber min={0} className="w-full" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="comuna" label="Comuna" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="region" label="Región" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <div className="mb-16">
              <label className="d-block font-bold mb-8">
                Amenidades
              </label>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item name={['amenidades', 'amoblado']} valuePropName="checked">
                    <Checkbox>Amoblado</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['amenidades', 'cocina']} valuePropName="checked">
                    <Checkbox>Cocina</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['amenidades', 'mascota']} valuePropName="checked">
                    <Checkbox>Mascotas permitidas</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['amenidades', 'estacionamiento']} valuePropName="checked">
                    <Checkbox>Estacionamiento</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['amenidades', 'balcon']} valuePropName="checked">
                    <Checkbox>Balcón</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['amenidades', 'jardin']} valuePropName="checked">
                    <Checkbox>Jardín</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['amenidades', 'wifi']} valuePropName="checked">
                    <Checkbox>WiFi</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['amenidades', 'garage']} valuePropName="checked">
                    <Checkbox>Garage</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['amenidades', 'zonaFumador']} valuePropName="checked">
                    <Checkbox>Zona fumador</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['amenidades', 'lavaplatos']} valuePropName="checked">
                    <Checkbox>Lavaplatos</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['amenidades', 'lavadora']} valuePropName="checked">
                    <Checkbox>Lavadora</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name={['amenidades', 'tvCable']} valuePropName="checked">
                    <Checkbox>TV Cable</Checkbox>
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <Form.Item
              name="imagenes"
              label="Imágenes de la Propiedad"
              valuePropName="fileList"
              getValueFromEvent={handleFileChange}
            >
              <Upload
                listType="picture-card"
                multiple
                beforeUpload={beforeUpload}
                fileList={fileList}
                accept="image/*"
                maxCount={10}
              >
                {fileList.length >= 10 ? null : <UploadOutlined />}
              </Upload>
            </Form.Item>
            <div
              className="mb-16 p-16"
            >
              <p className="m-0">
                <strong>Nota:</strong> Puede subir hasta 10 imágenes de la propiedad. Solo se
                permiten archivos de imagen (JPG, PNG, etc.) con un tamaño máximo de 10MB cada una.
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      title="Agregar Nueva Propiedad"
      width={800}
      destroyOnHidden
    >
      <div className="d-flex flex-column">
        <Form form={form} layout="vertical" initialValues={formData}>
          <Steps current={current} className="mb-24">
            <Steps.Step title="General" />
            <Steps.Step title="Detalles" />
            <Steps.Step title="Media" />
          </Steps>
          <div className="mb-24">{renderStepContent()}</div>
          <div className="d-flex justify-between gap-8">
            <div>
              <Button onClick={handleClose}>Cancelar</Button>
            </div>
            <div className="d-flex gap-8">
              {current > 0 && <Button onClick={prev}>Volver</Button>}
              {current < 2 && (
                <Button type="primary" onClick={next}>
                  Continuar
                </Button>
              )}
              {current === 2 && (
                <Button type="primary" onClick={finish} loading={loading}>
                  {loading ? 'Guardando...' : 'Agregar Propiedad'}
                </Button>
              )}
            </div>
          </div>
        </Form>
        <AgregarPropietarioModal
          open={propietarioModalVisible}
          onClose={() => setPropietarioModalVisible(false)}
          onCreated={handlePropietarioCreated}
        />
      </div>
    </Modal>
  );
};

export default AgregarPropiedadModal;
