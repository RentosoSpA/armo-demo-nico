import React, { useState, useEffect } from 'react';
import { Drawer, Select, Button, App, Checkbox, InputNumber, Switch, Input } from 'antd';
import { Plus } from 'lucide-react';
import type { Oso } from '../../services/mock/brigada';
import { 
  tonoOptions, 
  frecuenciaOptions, 
  tiposPropiedadOptions, 
  documentosRequeridosPorTipo,
  documentosOptions 
} from '../../services/mock/brigada';
import { type DocumentType } from '../../services/mock/notariosoTemplates';
import { getPlantillasByEmpresa, getPlantillaById, procesarDocxMock, guardarPlantillaMock, type Plantilla } from '../../services';
import BearProfile from '../common/BearProfile';
import CommonButton from '../common/CommonButton';
import '../../styles/brigada-drawer.scss';

interface OsoDrawersProps {
  selectedOso: Oso | null;
  onClose: () => void;
  isMobile?: boolean;
}

const OsoDrawers: React.FC<OsoDrawersProps> = ({ selectedOso, onClose, isMobile = false }) => {
  const { message } = App.useApp();
  
  // Estados para cada oso
  const [curiosoConfig, setCuriosoConfig] = useState({
    tono: 'Profesional'
  });

  const [notariosoConfig, setNotariosoConfig] = useState({
    documentType: 'contrato' as DocumentType
  });

  const [cautelosoConfig, setCautelosoConfig] = useState({
    tipoPropiedad: 'Departamento',
    documentosRequeridos: documentosRequeridosPorTipo['Departamento'] || [],
    verificacionAutomatica: true,
    notificacionDocumentosFaltantes: true
  });

  const [cuidadosoConfig, setCuidadosoConfig] = useState({
    frecuenciaRecordatorios: 'mensual',
    diasAntesVencimiento: 5,
    canalComunicacion: 'WhatsApp',
    mensajePersonalizado: 'Recordatorio de pago pendiente',
    escalacionRetraso: true,
    diasEscalacion: 10
  });

  const [armonisoConfig, setArmonisoConfig] = useState({
    frecuenciaReportes: 'mensual',
    destinatarios: '',
    tipoReportes: ['financiero'],
    canalEntrega: 'Email',
    plantillaPersonalizada: false
  });

  // Estados para plantillas de empresa
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [plantillasLoading, setPlantillasLoading] = useState(false);
  const [uploadingTemplate, setUploadingTemplate] = useState<string | null>(null);
  const [uploadingNewTemplate, setUploadingNewTemplate] = useState(false);

  // Cargar plantillas cuando se selecciona Notarioso
  useEffect(() => {
    if (selectedOso?.id === 'notarioso') {
      loadPlantillas();
    }
  }, [selectedOso?.id]);

  const loadPlantillas = async () => {
    setPlantillasLoading(true);
    try {
      // Use the correct empresa ID from mock data
      const empresaId = '11111111-1111-1111-1111-111111111111';
      const plantillasData = await getPlantillasByEmpresa(empresaId);
      setPlantillas(plantillasData);
    } catch (error) {
      message.error('Error al cargar plantillas');
    } finally {
      setPlantillasLoading(false);
    }
  };

  const handleAddTemplate = async (file: File) => {
    setUploadingNewTemplate(true);
    try {
      const empresaId = '11111111-1111-1111-1111-111111111111';
      const { plantilla_id, template_html } = await procesarDocxMock(file.name, empresaId);
      await guardarPlantillaMock(plantilla_id, template_html);
      
      message.success(`Plantilla "${file.name}" agregada exitosamente`);
      await loadPlantillas(); // Recargar lista
    } catch (error) {
      message.error('Error al procesar la plantilla');
    } finally {
      setUploadingNewTemplate(false);
    }
  };

  const handleReplaceTemplate = async (file: File, plantillaId: string) => {
    setUploadingTemplate(plantillaId);
    try {
      const empresaId = '11111111-1111-1111-1111-111111111111';
      const { plantilla_id, template_html } = await procesarDocxMock(file.name, empresaId);
      await guardarPlantillaMock(plantilla_id, template_html);
      
      message.success(`Plantilla "${file.name}" subida exitosamente`);
      await loadPlantillas(); // Recargar lista
    } catch (error) {
      message.error('Error al procesar la plantilla');
    } finally {
      setUploadingTemplate(null);
    }
  };

  const handlePreviewTemplate = async (plantillaId: string) => {
    try {
      const plantilla = await getPlantillaById(plantillaId);
      if (!plantilla) {
        message.error('Plantilla no encontrada');
        return;
      }

      // Crear contenido HTML para descargar
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="es">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${plantilla.filename}</title>
            <style>
              body { font-family: 'Poppins', sans-serif; margin: 40px; line-height: 1.6; }
              .header { text-align: center; margin-bottom: 30px; }
              .content { max-width: 800px; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Plantilla: ${plantilla.filename}</h1>
              <p>Generada desde RentOso - ${new Date().toLocaleDateString('es-ES')}</p>
            </div>
            <div class="content">
              <h2>Contrato de Arriendo</h2>
              <p>Esta es una vista previa de la plantilla ${plantilla.filename}</p>
              <p>ID de Plantilla: ${plantilla.plantilla_id}</p>
              <p>Estado: ${plantilla.estado}</p>
              <div style="margin-top: 30px; padding: 20px; border: 1px solid #ddd;">
                <p>Contenido del contrato aparecería aquí...</p>
                <p>Variables disponibles: {{nombre_inquilino}}, {{direccion_propiedad}}, {{valor_arriendo}}</p>
              </div>
            </div>
          </body>
        </html>
      `;

      // Descargar como HTML
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${plantilla.filename.replace('.docx', '')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success('Descarga iniciada');
    } catch (error) {
      message.error('Error al descargar la plantilla');
    }
  };

  const handleSave = () => {
    message.success('Configuración guardada exitosamente');
    onClose();
  };

  const renderNotariosoContent = () => {
    if (plantillasLoading) {
      return (
        <div className="drawer-content notarioso-manager">
          <BearProfile oso={selectedOso!} />
          <div className="divider" />
          <div className="document-type-selector">
            <h4 className="section-title">Plantillas de la empresa</h4>
            <div className="help">Cargando plantillas...</div>
          </div>
        </div>
      );
    }

    return (
      <div className="drawer-content notarioso-manager">
        <BearProfile oso={selectedOso!} />
        
        <div className="divider" />
        
        {/* Document Type Selector */}
        <div className="document-type-selector">
          <h4 className="section-title">Plantillas de la empresa</h4>
          <div className="help">Cambia las plantillas que Notarioso tomará en cuenta</div>
          <div></div>
          <div className="toggle-buttons">
            <div 
              className={`toggle-button ${notariosoConfig.documentType === 'contrato' ? 'active' : ''}`}
              onClick={() => setNotariosoConfig({ ...notariosoConfig, documentType: 'contrato' })}
            >
              Contrato
            </div>
            <div
              className={`toggle-button ${notariosoConfig.documentType === 'visita' ? 'active' : ''} disabled cursor-not-allowed`}
            >
              Orden de visita
            </div>
          </div>
        </div>

        {/* Template Grid */}
        <div className="drawer-content__section template-grid">
          {plantillas.length === 0 ? (
            <div className="empty-state text-center">
              <div className="mb-16">📄</div>
              <h3 className="mb-8">Sin plantillas</h3>
              <p className="mb-24">Sube tus plantillas de contrato para que Oso Notarioso las tenga en cuenta</p>
              
              {/* Input file oculto */}
              <input
                type="file"
                accept=".docx"
                className="d-none"
                id="add-template-input"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleAddTemplate(file);
                  }
                }}
              />
              
              {/* Botón Añadir plantilla */}
              <CommonButton
                variant="primary"
                icon={Plus}
                loading={uploadingNewTemplate}
                onClick={() => {
                  document.getElementById('add-template-input')?.click();
                }}
              >
                Añadir plantilla
              </CommonButton>
            </div>
          ) : (
            <div className="template-cards">
              {plantillas.map((plantilla) => (
                <div 
                  key={plantilla.id}
                  className="template-card"
                >
                  <div className="card-header">
                    <div className="card-title">
                      {plantilla.filename}
                    </div>
                    <div className={`status-pill ${plantilla.estado === 'procesado' ? 'configured' : 'missing'}`}>
                      {plantilla.estado === 'procesado' ? '✅ Procesada' : '⚠️ Procesando'}
                    </div>
                  </div>
                  
                  <div className="card-info">
                    <div className="template-date">
                      Creada: {new Date(plantilla.createdAt).toLocaleDateString('es-ES')}
                    </div>
                    <div className="template-size">
                      Tamaño: {(plantilla.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <input
                      type="file"
                      accept=".docx"
                      className="d-none"
                      id={`file-input-${plantilla.id}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleReplaceTemplate(file, plantilla.id);
                        }
                      }}
                    />
                    <Button
                      type="primary"
                      loading={uploadingTemplate === plantilla.id}
                      onClick={() => {
                        document.getElementById(`file-input-${plantilla.id}`)?.click();
                      }}
                    >
                      Reemplazar
                    </Button>
                    <Button
                      type="default"
                      onClick={() => handlePreviewTemplate(plantilla.plantilla_id)}
                      disabled={plantilla.estado !== 'procesado'}
                    >
                      Vista previa
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCautelosoContent = () => {
    return (
      <div className="drawer-content">
        <BearProfile oso={selectedOso!} />
        <div className="divider" />
        
        <div className="drawer-content__section">
          <h4 className="section-title">Configuración de Documentos</h4>
          <div className="help">Configura qué documentos son requeridos por tipo de propiedad</div>
          
          <label>Tipo de propiedad</label>
          <Select
            value={cautelosoConfig.tipoPropiedad}
            onChange={(value) => {
              const documentosParaTipo = documentosRequeridosPorTipo[value] || [];
              setCautelosoConfig({ 
                ...cautelosoConfig, 
                tipoPropiedad: value,
                documentosRequeridos: documentosParaTipo
              });
            }}
            options={tiposPropiedadOptions.map(option => ({ label: option, value: option }))}
          />
          
          <div className="mt-16">
            <h5>Documentos requeridos:</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {documentosOptions.map(doc => (
                <label key={doc} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
                  <Checkbox
                    checked={cautelosoConfig.documentosRequeridos.includes(doc)}
                    onChange={(e) => {
                      const documentos = e.target.checked
                        ? [...cautelosoConfig.documentosRequeridos, doc]
                        : cautelosoConfig.documentosRequeridos.filter(d => d !== doc);
                      setCautelosoConfig({ ...cautelosoConfig, documentosRequeridos: documentos });
                    }}
                    style={{ marginTop: '4px' }}
                  />
                  <span style={{ paddingTop: '3px', lineHeight: '1.5' }}>{doc}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="mt-16">
            <Switch
              checked={cautelosoConfig.verificacionAutomatica}
              onChange={(checked) => setCautelosoConfig({ ...cautelosoConfig, verificacionAutomatica: checked })}
            />
            <span className="ml-8">Verificación automática</span>
          </div>
          
          <div className="mt-8">
            <Switch
              checked={cautelosoConfig.notificacionDocumentosFaltantes}
              onChange={(checked) => setCautelosoConfig({ ...cautelosoConfig, notificacionDocumentosFaltantes: checked })}
            />
            <span className="ml-8">Notificar documentos faltantes</span>
          </div>
        </div>
      </div>
    );
  };

  const renderCuidadosoContent = () => {
    return (
      <div className="drawer-content">
        <BearProfile oso={selectedOso!} />
        <div className="divider" />
        
        <div className="drawer-content__section">
          <h4 className="section-title">Configuración de Recordatorios</h4>
          <div className="help">Configura la frecuencia y canal de recordatorios de pago</div>
          
          <label>Frecuencia de recordatorios</label>
          <Select
            value={cuidadosoConfig.frecuenciaRecordatorios}
            onChange={(value) => setCuidadosoConfig({ ...cuidadosoConfig, frecuenciaRecordatorios: value })}
            options={frecuenciaOptions.map(option => ({ label: option, value: option }))}
          />
          
          <label className="d-block mt-16">Días antes del vencimiento</label>
          <InputNumber
            value={cuidadosoConfig.diasAntesVencimiento}
            onChange={(value) => setCuidadosoConfig({ ...cuidadosoConfig, diasAntesVencimiento: value || 5 })}
            min={1}
            max={30}
          />
          
          <label className="d-block mt-16">Canal de comunicación</label>
          <Select
            value={cuidadosoConfig.canalComunicacion}
            onChange={(value) => setCuidadosoConfig({ ...cuidadosoConfig, canalComunicacion: value })}
            options={[
              { label: 'WhatsApp', value: 'WhatsApp' },
              { label: 'Email', value: 'Email' },
              { label: 'SMS', value: 'SMS' }
            ]}
          />
          
          <label className="d-block mt-16">Mensaje personalizado</label>
          <Input.TextArea
            value={cuidadosoConfig.mensajePersonalizado}
            onChange={(e) => setCuidadosoConfig({ ...cuidadosoConfig, mensajePersonalizado: e.target.value })}
            rows={3}
            placeholder="Mensaje que se enviará a los inquilinos"
          />
          
          <div className="mt-16">
            <Switch
              checked={cuidadosoConfig.escalacionRetraso}
              onChange={(checked) => setCuidadosoConfig({ ...cuidadosoConfig, escalacionRetraso: checked })}
            />
            <span className="ml-8">Escalación por retraso</span>
          </div>
          
          {cuidadosoConfig.escalacionRetraso && (
            <div className="mt-8 ml-32">
              <label>Días para escalación:</label>
              <InputNumber
                value={cuidadosoConfig.diasEscalacion}
                onChange={(value) => setCuidadosoConfig({ ...cuidadosoConfig, diasEscalacion: value || 10 })}
                min={1}
                max={90}
                className="ml-8"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderArmonisoContent = () => {
    return (
      <div className="drawer-content">
        <BearProfile oso={selectedOso!} />
        <div className="divider" />
        
        <div className="drawer-content__section">
          <h4 className="section-title">Configuración de Reportes</h4>
          <div className="help">Configura la frecuencia y tipo de reportes a generar</div>
          
          <label>Frecuencia de reportes</label>
          <Select
            value={armonisoConfig.frecuenciaReportes}
            onChange={(value) => setArmonisoConfig({ ...armonisoConfig, frecuenciaReportes: value })}
            options={frecuenciaOptions.map(option => ({ label: option, value: option }))}
          />
          
          <label className="d-block mt-16">Destinatarios (emails separados por coma)</label>
          <Input
            value={armonisoConfig.destinatarios}
            onChange={(e) => setArmonisoConfig({ ...armonisoConfig, destinatarios: e.target.value })}
            placeholder="email1@ejemplo.com, email2@ejemplo.com"
          />
          
          <div className="mt-16">
            <h5>Tipos de reportes:</h5>
            {['financiero', 'ocupacion', 'mantenimiento', 'visitas'].map(tipo => (
              <Checkbox
                key={tipo}
                checked={armonisoConfig.tipoReportes.includes(tipo)}
                onChange={(e) => {
                  const tipos = e.target.checked 
                    ? [...armonisoConfig.tipoReportes, tipo]
                    : armonisoConfig.tipoReportes.filter(t => t !== tipo);
                  setArmonisoConfig({ ...armonisoConfig, tipoReportes: tipos });
                }}
              >
                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </Checkbox>
            ))}
          </div>
          
          <label className="d-block mt-16">Canal de entrega</label>
          <Select
            value={armonisoConfig.canalEntrega}
            onChange={(value) => setArmonisoConfig({ ...armonisoConfig, canalEntrega: value })}
            options={[
              { label: 'Email', value: 'Email' },
              { label: 'WhatsApp', value: 'WhatsApp' },
              { label: 'Ambos', value: 'Ambos' }
            ]}
          />
          
          <div className="mt-16">
            <Switch
              checked={armonisoConfig.plantillaPersonalizada}
              onChange={(checked) => setArmonisoConfig({ ...armonisoConfig, plantillaPersonalizada: checked })}
            />
            <span className="ml-8">Usar plantilla personalizada</span>
          </div>
        </div>
      </div>
    );
  };

  const renderDrawerContent = () => {
    switch (selectedOso?.id) {
      case 'curioso':
        return (
          <div className="drawer-content">
            <BearProfile oso={selectedOso!} />
            <div className="divider" />
            <div className="drawer-content__section">
              <h4 className="section-title">Configuración</h4>
              <label>Tono de comunicación</label>
              <Select
                value={curiosoConfig.tono}
                onChange={(value) => setCuriosoConfig({ ...curiosoConfig, tono: value })}
                options={tonoOptions.map(option => ({ label: option, value: option }))}
              />
              <div className="help">Personaliza cómo se comunica el oso con los prospectos</div>
            </div>
          </div>
        );
      case 'cauteloso':
        return renderCautelosoContent();
      case 'notarioso':
        return renderNotariosoContent();
      case 'cuidadoso':
        return renderCuidadosoContent();
      case 'armonioso':
        return renderArmonisoContent();
      default:
        return <div>Configuración no implementada</div>;
    }
  };

  return (
    <>
      <Drawer
        placement={isMobile ? 'bottom' : 'right'}
        closable={false}
        onClose={onClose}
        open={!!selectedOso}
        width={480}
        className="drawer"
        title={null}
        headerStyle={{ display: 'none' }}
      >
        {selectedOso && (
          <>
            <div className="drawer__content">
              {renderDrawerContent()}
            </div>
            <div className="drawer__footer">
              <Button type="primary" onClick={handleSave}>Guardar</Button>
            </div>
          </>
        )}
      </Drawer>
    </>
  );
};

export default OsoDrawers;