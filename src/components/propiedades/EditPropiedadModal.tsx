import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Alert,
  Upload,
  message,
  Button,
  Row,
  Col,
  Checkbox,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { updatePropiedad } from '../../services/mock/propiedadesServiceMock';
import type { Propiedad, PropiedadCreate } from '../../types/propiedad';
import { TipoPropiedad, EstadoPropiedad, Divisa } from '../../types/propiedad';

import { useUserStore } from '../../store/userStore';
import { getPropietarios } from '../../services/propietarios/propietarioService';
import type { Propietario } from '../../types/propietario';
import dayjs from 'dayjs';
import { getImages, uploadImage } from '../../services/multimedia/imagenesService';
import type { GCP_FILES } from '../../types/document';

const { Option } = Select;

interface EditPropiedadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  propiedad: Propiedad | null;
}

const EditPropiedadModal: React.FC<EditPropiedadModalProps> = ({
  open,
  onClose,
  onSuccess,
  propiedad,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const { agent, empresa } = useUserStore();
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<GCP_FILES>({
    files: [],
    signedUrls: {},
  });
  const [isVenta, setIsVenta] = useState(false);
  const [isArriendo, setIsArriendo] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoadingData(true);
      const propietarios = await getPropietarios(empresa?.id || '');
      setPropietarios(propietarios);
    } catch {
      setLoadingError(true);
    } finally {
      setLoadingData(false);
    }
  }, [empresa?.id]);

  // Removed empresa and agente selection logic since they come from userStore

  const loadPropiedadData = useCallback(() => {
    if (!propiedad) return;

    // Set venta and arriendo flags
    setIsVenta(propiedad.venta ?? false);
    setIsArriendo(propiedad.arriendo ?? false);

    // Extract amenidades boolean values from the propiedad.amenidades object
    const amenidadesValues = propiedad.amenidades;

    form.setFieldsValue({
      tipo: propiedad.tipo,
      estado: propiedad.estado,
      propietarioId: propiedad.propietario?.id || '',
      titulo: propiedad.titulo,
      descripcion: propiedad.descripcion,
      direccion: propiedad.direccion,
      areaTotal: propiedad.areaTotal,
      areaUsable: propiedad.areaUsable,
      habitaciones: propiedad.habitaciones,
      banos: propiedad.banos,
      fechaConstruccion: dayjs(propiedad.fechaConstruccion),
      piso: propiedad.piso,
      region: propiedad.region,
      comuna: propiedad.comuna,
      amenidades: amenidadesValues,
      venta: propiedad.venta,
      arriendo: propiedad.arriendo,
      // Venta fields
      ...(propiedad.propiedadVenta && {
        ventaDivisa: propiedad.propiedadVenta.divisa,
        ventaPrecioPrincipal: propiedad.propiedadVenta.precioPrincipal,
        ventaComision: propiedad.propiedadVenta.comision,
      }),
      // Arriendo fields
      ...(propiedad.propiedadArriendo && {
        arriendoDivisa: propiedad.propiedadArriendo.divisa,
        arriendoPrecioPrincipal: propiedad.propiedadArriendo.precioPrincipal,
        arriendoComision: propiedad.propiedadArriendo.comision,
        gastosComunes: propiedad.propiedadArriendo.gastosComunes,
        incluyeGastosComunes: propiedad.propiedadArriendo.incluyeGastosComunes,
        disponibleDesde: propiedad.propiedadArriendo.disponibleDesde
          ? dayjs(propiedad.propiedadArriendo.disponibleDesde)
          : undefined,
        disponibleHasta: propiedad.propiedadArriendo.disponibleHasta
          ? dayjs(propiedad.propiedadArriendo.disponibleHasta)
          : undefined,
      }),
    });
  }, [propiedad, form]);

  const loadExistingFiles = useCallback(async () => {
    if (!propiedad) return;

    try {
      const files = await getImages(`propiedades/${propiedad.id}/ficha/imagenes`);
      setExistingFiles(files);
    } catch (error) {
      console.error('Error loading existing files:', error);
    }
  }, [propiedad]);

  useEffect(() => {
    if (open && propiedad) {
      try {
        fetchData();
        loadPropiedadData();
        loadExistingFiles();
      } catch {
        setLoadingError(true);
      }
    }
  }, [open, propiedad, fetchData, loadPropiedadData, loadExistingFiles]);

  const handleClose = () => {
    form.resetFields();
    setUploadedFiles([]);
    setExistingFiles({
      files: [],
      signedUrls: {},
    });
    setIsVenta(false);
    setIsArriendo(false);
    onClose();
  };

  const handleOk = async () => {
    if (!propiedad) return;

    try {
      const values = await form.validateFields();
      setLoading(true);

      // Validate that at least one of venta or arriendo is selected
      if (!isVenta && !isArriendo) {
        message.error('Debe seleccionar al menos una opción: Venta o Arriendo');
        setLoading(false);
        return;
      }

      const propiedadData: Partial<PropiedadCreate> = {
        empresaId: empresa?.id || '',
        agenteId: agent?.id || '',
        tipo: values.tipo,
        estado: values.estado,
        propietarioId: values.propietarioId,
        titulo: values.titulo,
        descripcion: values.descripcion,
        direccion: values.direccion,
        areaTotal: values.areaTotal,
        areaUsable: values.areaUsable,
        habitaciones: values.habitaciones,
        banos: values.banos,
        fechaConstruccion: values.fechaConstruccion.toDate(),
        piso: values.piso,
        region: values.region,
        comuna: values.comuna,
        amenidades: values.amenidades || {},
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
            disponibleDesde: values.disponibleDesde ? values.disponibleDesde.toDate() : new Date(),
            disponibleHasta: values.disponibleHasta ? values.disponibleHasta.toDate() : new Date(),
          },
        }),
      };

      // Step 1: Update the propiedad
      await updatePropiedad(propiedad.id, propiedadData);

      // Step 2: Handle file upload if new files are selected
      if (uploadedFiles.length > 0) {
        try {
          const uploadPromises = uploadedFiles.map(file =>
            uploadImage(`propiedades/${propiedad.id}/ficha/imagenes`, file)
          );
          await Promise.all(uploadPromises);
          message.success('Propiedad actualizada e imágenes subidas correctamente');
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          message.warning('Propiedad actualizada pero hubo un error al subir las imágenes');
        }
      } else {
        message.success('Propiedad actualizada correctamente');
      }

      setLoading(false);
      form.resetFields();
      setUploadedFiles([]);
      setExistingFiles({
        files: [],
        signedUrls: {},
      });
      setIsVenta(false);
      setIsArriendo(false);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating propiedad:', error);
      message.error('Error al actualizar la propiedad');
      setLoading(false);
    }
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

  // Early return if no propiedad to prevent errors
  if (!propiedad) {
    return (
      <Modal
        title="Editar Propiedad"
        open={open}
        onCancel={onClose}
        footer={null}
        width={800}
      >
        <div style={{ textAlign: 'center', padding: '40px' }}>
          Cargando datos de la propiedad...
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="Editar Propiedad"
      open={open}
      onCancel={handleClose}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Actualizar"
      cancelText="Cancelar"
      width={800}
    >
      <Form form={form} layout="vertical">
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
          <Col span={24}>
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
                {propietarios?.map(propietario => (
                  <Option key={propietario.id} value={propietario.id}>
                    {propietario.nombre}
                  </Option>
                )) || []}
              </Select>
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
        <div className="liquid-glass mb-16 p-16">
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
                <Form.Item name="arriendoDivisa" label="Divisa" rules={[{ required: isArriendo }]}>
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
        {loadingError && (
          <Alert message="Error al cargar los datos" type="error" className="mb-16" />
        )}

        <Form.Item label="Imágenes de la Propiedad">
          {existingFiles?.files?.length > 0 && (
            <div className="mb-16">
              <h4>Imágenes existentes:</h4>
              <div className="d-flex flex-wrap gap-8">
                {existingFiles?.files?.map((file, index) => (
                  <div
                    key={index}
                    className="d-flex align-center justify-between"
                  >
                    <span>{file.name}</span>
                    <div className="d-flex gap-8">
                      <Button
                        type="link"
                        size="small"
                        onClick={() => window.open(existingFiles.signedUrls[file.name], '_blank')}
                      >
                        Ver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Upload
            beforeUpload={file => {
              beforeUpload(file);
              setUploadedFiles(prev => [...prev, file]);
              return false; // Prevent default upload behavior
            }}
            fileList={uploadedFiles?.map((file, index) => ({
              uid: index.toString(),
              name: file.name,
              status: 'done',
            })) || []}
            onRemove={file => {
              setUploadedFiles(prev => prev.filter((_, index) => index.toString() !== file.uid));
            }}
            multiple={true}
            accept="image/*"
            listType="picture-card"
            maxCount={10}
          >
            {uploadedFiles.length < 10 && (
              <div>
                <UploadOutlined />
                <div className="mt-8">Subir imagen</div>
              </div>
            )}
          </Upload>
          <div
            className="mt-16 p-16"
          >
            <p className="m-0">
              <strong>Nota:</strong> Puede subir hasta 10 imágenes adicionales. Solo se permiten
              archivos de imagen (JPG, PNG, etc.) con un tamaño máximo de 10MB cada una.
            </p>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPropiedadModal;
