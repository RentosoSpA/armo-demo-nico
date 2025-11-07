import { useState, useEffect } from 'react';
import { Card, Modal, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import ContractsHeader from '../components/Contratos/ContractsHeader';
import ContractsTable from '../components/Contratos/ContractsTable';
import CreateSection from '../components/Contratos/CreateSection';
import GenerateForm from '../components/Contratos/GenerateForm';
import type { Contrato, Plantilla, Propiedad, Prospecto } from '../lib/contratos-mock';
import {
  listPropiedades,
  listProspectos,
  uploadToTemplate,
  useTemplateGenerate
} from '../services/mock/contratosNewServiceMock';
import { getMembresias } from '../services/membresias/membresiasServiceAdapter';
import { getPlantillas } from '../services/plantillas/plantillasServiceAdapter';
import { usePresetLabels } from '../hooks/usePresetLabels';
import '../styles/contratos.scss';

const Contratos = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { getLabel, isCoworking } = usePresetLabels();

  // Data lists
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);

  // Selection
  const [selectedPropiedadId, setSelectedPropiedadId] = useState<string | null>(null);

  // Upload flow
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [makeEditableLoading, setMakeEditableLoading] = useState(false);

  // Generate flow
  const [selectedPlantilla, setSelectedPlantilla] = useState<Plantilla | null>(null);
  const [generateFormOpen, setGenerateFormOpen] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);

  // Preview
  const [previewPlantilla, setPreviewPlantilla] = useState<Plantilla | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [viewContrato, setViewContrato] = useState<Contrato | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // Loading states
  const [propiedadesLoading, setPropiedadesLoading] = useState(false);
  const [contratosLoading, setContratosLoading] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedPropiedadId) {
      loadContratos(selectedPropiedadId);
    } else {
      setContratos([]);
    }
  }, [selectedPropiedadId]);

  const loadInitialData = async () => {
    setPropiedadesLoading(true);
    try {
      const [props, prosps, plants] = await Promise.all([
        listPropiedades(),
        listProspectos(),
        getPlantillas()
      ]);
      setPropiedades(props);
      setProspectos(prosps);
      setPlantillas(plants);
      
      // Auto-select first property
      if (props.length > 0) {
        setSelectedPropiedadId(props[0].id);
      }
    } catch (error) {
      message.error('Error al cargar datos');
    } finally {
      setPropiedadesLoading(false);
    }
  };

  const loadContratos = async (propiedadId: string) => {
    setContratosLoading(true);
    try {
      const list = await getMembresias();
      // Filtrar por propiedad/espacio si es necesario
      const filtered = propiedadId === 'all' 
        ? list 
        : list.filter(c => c.propiedadId === propiedadId);
      setContratos(filtered);
    } catch (error) {
      message.error(`Error al cargar ${isCoworking ? 'membresías' : 'contratos'}`);
    } finally {
      setContratosLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
  };

  const handleMakeEditable = async () => {
    if (!uploadedFile) return;

    setMakeEditableLoading(true);
    try {
      const newPlantilla = await uploadToTemplate(uploadedFile);
      setPlantillas([...plantillas, newPlantilla]);
      message.success(`Plantilla "${newPlantilla.titulo}" creada exitosamente`);
      setUploadedFile(null);
    } catch (error) {
      message.error('Error al convertir el archivo');
    } finally {
      setMakeEditableLoading(false);
    }
  };

  const handleUseTemplate = (plantilla: Plantilla) => {
    setSelectedPlantilla(plantilla);
    setGenerateFormOpen(true);
  };

  const handlePreviewTemplate = (plantilla: Plantilla) => {
    setPreviewPlantilla(plantilla);
    setPreviewModalOpen(true);
  };

  const handleGenerate = async (propiedadId: string, prospectoId: string) => {
    if (!selectedPlantilla) return;

    setGenerateLoading(true);
    try {
      const newContrato = await useTemplateGenerate(
        selectedPlantilla.id,
        propiedadId,
        prospectoId
      );

      message.success('Borrador creado exitosamente');
      setGenerateFormOpen(false);
      setSelectedPlantilla(null);

      // Navigate to edit page
      navigate(`/contratos/crear?contratoId=${newContrato.id}&propiedadId=${propiedadId}&prospectoId=${prospectoId}`);

      // Refresh contracts list
      if (selectedPropiedadId) {
        loadContratos(selectedPropiedadId);
      }
    } catch (error) {
      message.error('Error al generar el contrato');
    } finally {
      setGenerateLoading(false);
    }
  };

  const handleViewContrato = (contrato: Contrato) => {
    setViewContrato(contrato);
    setViewModalOpen(true);
  };

  return (
    <div className="contratos-container">
      <ContractsHeader
        propiedades={propiedades}
        selectedPropiedadId={selectedPropiedadId}
        onSelectPropiedad={setSelectedPropiedadId}
        loading={propiedadesLoading}
      />

      {selectedPropiedadId && (
        <Card className="contracts-section-card">
          <h2>{getLabel('Mis contratos', 'Mis membresías')}</h2>
          <ContractsTable
            contratos={contratos}
            loading={contratosLoading}
            onView={handleViewContrato}
          />
        </Card>
      )}

      <CreateSection
        plantillas={plantillas}
        uploadedFile={uploadedFile}
        onUseTemplate={handleUseTemplate}
        onPreviewTemplate={handlePreviewTemplate}
        onFileSelect={handleFileSelect}
        onMakeEditable={handleMakeEditable}
        makeEditableLoading={makeEditableLoading}
      />

      {/* Generate Form Modal */}
      <Modal
        title="Generar contrato"
        open={generateFormOpen}
        onCancel={() => {
          setGenerateFormOpen(false);
          setSelectedPlantilla(null);
        }}
        footer={null}
        width={600}
        className="generate-form-modal"
      >
        {selectedPlantilla && (
          <GenerateForm
            plantilla={selectedPlantilla}
            propiedades={propiedades}
            prospectos={prospectos}
            selectedPropiedadId={selectedPropiedadId}
            onGenerate={handleGenerate}
            onCancel={() => {
              setGenerateFormOpen(false);
              setSelectedPlantilla(null);
            }}
            loading={generateLoading}
          />
        )}
      </Modal>

      {/* Template Preview Modal */}
      <Modal
        title={`Vista previa: ${previewPlantilla?.titulo}`}
        open={previewModalOpen}
        onCancel={() => setPreviewModalOpen(false)}
        footer={null}
        width={800}
        className="template-preview-modal"
      >
        {previewPlantilla && (
          <div
            className="template-preview-content"
            dangerouslySetInnerHTML={{ __html: previewPlantilla.html }}
          />
        )}
      </Modal>

      {/* Contract View Modal */}
      <Modal
        title={`Contrato: ${viewContrato?.titulo}`}
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={800}
        className="contract-view-modal"
      >
        {viewContrato && (
          <div
            className="contract-view-content"
            dangerouslySetInnerHTML={{ __html: viewContrato.html }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Contratos;