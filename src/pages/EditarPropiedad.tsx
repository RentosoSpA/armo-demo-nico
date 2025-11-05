import { useState, useEffect, useCallback } from 'react';
import { Spin, message } from 'antd';
import { useParams } from 'react-router-dom';
import { usePropiedadStore } from '../store/propiedadStore';
import type { Propiedad } from '../types/propiedad';
import FormPropiedad from '../components/propiedades/FormPropiedad';

const EditarPropiedad = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchPropiedadById, loading } = usePropiedadStore();
  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);

  const fetchPropiedad = useCallback(async () => {
    if (!id) return;

    try {
      console.log('🔍 EditarPropiedad: Fetching property data for ID:', id);
      const propiedadData = await fetchPropiedadById(id);
      console.log('🏠 EditarPropiedad: Property data loaded:', propiedadData);
      setPropiedad(propiedadData);
    } catch (error) {
      console.error('Error fetching propiedad:', error);
      message.error('Error al cargar la propiedad');
    }
  }, [id, fetchPropiedadById]);

  useEffect(() => {
    fetchPropiedad();
  }, [fetchPropiedad]);

  const handleUpdated = () => {
    // Navigation is handled within the form component
  };

  if (loading || !propiedad) {
    return (
      <div className="d-flex align-center justify-center" style={{ minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  console.log('🎯 EditarPropiedad: Rendering FormPropiedad with mode=edit, initialData:', propiedad);

  return (
    <FormPropiedad
      mode="edit"
      initialData={propiedad}
      onUpdated={handleUpdated}
    />
  );
};

export default EditarPropiedad;