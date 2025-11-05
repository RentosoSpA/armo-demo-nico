import { useEffect, useState, useCallback } from 'react';
import PropietariosHeader from '../components/propietarios/PropietariosHeader';
import PropietariosCard from '../components/propietarios/PropietariosCard';
import AgregarPropietarioModal from '../components/propietarios/AgregarPropietarioModal';
import EditPropietarioModal from '../components/propietarios/EditPropietarioModal';
import { usePropietarioStore } from '../store/propietarioStore';
import { useUserStore } from '../store/userStore';
import type { Propietario } from '../types/propietario';

interface Props {
  onNavigate?: (key: string) => void;
}

const Propietarios = ({ onNavigate }: Props) => {
  const { propietarios, fetchPropietarios, loading } = usePropietarioStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedPropietario, setSelectedPropietario] = useState<Propietario | null>(null);

  const { empresa } = useUserStore();

  useEffect(() => {
    fetchPropietarios(empresa?.id || '');
  }, [empresa?.id]);

  const handleCreated = useCallback(() => {
    fetchPropietarios(empresa?.id || '');
    setModalVisible(false);
  }, [empresa?.id, fetchPropietarios]);

  const handleEditClick = useCallback((propietario: Propietario) => {
    setSelectedPropietario(propietario);
    setEditModalVisible(true);
  }, []);

  const handleEditSuccess = useCallback(() => {
    fetchPropietarios(empresa?.id || '');
    setEditModalVisible(false);
    setSelectedPropietario(null);
  }, [empresa?.id, fetchPropietarios]);

  return (
    <div style={{ padding: '0 16px 24px 16px' }}>
      <PropietariosHeader
        title="Propietarios"
        subtitle="Gestión de propietarios de tu inmobiliaria"
        onAddClick={() => setModalVisible(true)}
        onNavigate={onNavigate}
      />
      <PropietariosCard
        data={propietarios}
        loading={loading}
        onEditClick={handleEditClick}
      />

      <AgregarPropietarioModal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreated={handleCreated}
      />

      <EditPropietarioModal
        open={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedPropietario(null);
        }}
        propietario={selectedPropietario}
        onSuccess={handleEditSuccess}
        onUpdated={handleEditSuccess}
      />
    </div>
  );
};

export default Propietarios;