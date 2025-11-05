import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import PropiedadesHeader, { type ViewMode } from '../components/propiedades/PropiedadesHeader';
import PropiedadesCard from '../components/propiedades/PropiedadesCard';
import AgregarPropiedadModal from '../components/propiedades/AgregarPropiedadModal';
import ImportPropiedadesModal from '../components/propiedades/ImportPropiedadesModal';
import type { Propiedad } from '../types/propiedad';
import { usePropiedadStore } from '../store/propiedadStore';
import { useUserStore } from '../store/userStore';
import { updatePropiedadEstado } from '../services/mock/propiedadesServiceMock';
import './Propiedades.scss';

const Propiedades = () => {
  const navigate = useNavigate();
  const { propiedades, fetchPropiedades, loading, updatePropiedadLocal } = usePropiedadStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [estadoFilter, setEstadoFilter] = useState<string | null>(null);
  const { empresa } = useUserStore();

  useEffect(() => {
    const loadPropiedades = async () => {
      console.log('🔍 Propiedades.tsx: Checking empresa.id:', empresa?.id);
      if (!empresa?.id) {
        console.warn('⚠️ Propiedades.tsx: No empresa.id available, skipping fetch');
        return;
      }

      try {
        console.log('🚀 Propiedades.tsx: Calling fetchPropiedades with empresa.id:', empresa.id);
        // Use cache if available (TTL: 5 minutes)
        await fetchPropiedades(empresa.id);
        console.log('✅ Propiedades.tsx: fetchPropiedades completed successfully');
      } catch (error) {
        console.error('❌ Propiedades.tsx: Error loading propiedades:', error);
        message.error('Error al cargar las propiedades');
      }
    };

    loadPropiedades();
  }, [empresa?.id]);

  const handleCreated = useCallback(async () => {
    if (!empresa?.id) return;
    
    try {
      await fetchPropiedades(empresa.id);
      setModalVisible(false);
      message.success('Propiedad creada exitosamente');
    } catch (error) {
      console.error('Error reloading propiedades:', error);
    }
  }, [empresa?.id, fetchPropiedades]);

  const handlePropiedadClick = useCallback((propiedadId: string) => {
    navigate(`/propiedades/${propiedadId}`);
  }, [navigate]);

  const handleEditClick = useCallback((propiedad: Propiedad) => {
    navigate(`/propiedades/editar/${propiedad.id}`);
  }, [navigate]);

  const handleImportSuccess = useCallback(async () => {
    if (!empresa?.id) return;

    try {
      await fetchPropiedades(empresa.id);
      setImportModalVisible(false);
      message.success('Propiedades importadas exitosamente');
    } catch (error) {
      console.error('Error reloading propiedades:', error);
    }
  }, [empresa?.id, fetchPropiedades]);

  const handleEstadoChange = useCallback(async (propiedadId: string, newEstado: string) => {
    try {
      const updatedPropiedad = await updatePropiedadEstado(propiedadId, newEstado);
      updatePropiedadLocal(updatedPropiedad);
      message.success('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error updating estado:', error);
      message.error('Error al actualizar el estado');
    }
  }, [updatePropiedadLocal]);

  // Filter properties by estado
  const filteredPropiedades = estadoFilter
    ? propiedades.filter(prop => prop.estado === estadoFilter)
    : propiedades;

  return (
    <div className="propiedades-page">
      <PropiedadesHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        estadoFilter={estadoFilter}
        onEstadoFilterChange={setEstadoFilter}
        // onPropietariosClick={() => onNavigate?.('Propietarios')}
      />
      <PropiedadesCard
        data={filteredPropiedades}
        loading={loading}
        viewMode={viewMode}
        onPropiedadClick={handlePropiedadClick}
        onEditClick={handleEditClick}
        onEstadoChange={handleEstadoChange}
      />
      <AgregarPropiedadModal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreated={handleCreated}
      />
      <ImportPropiedadesModal
        open={importModalVisible}
        onClose={() => setImportModalVisible(false)}
        onImported={handleImportSuccess}
      />
    </div>
  );
};

export default Propiedades;
