import { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProspectosHeader, { type ViewMode } from '../components/Prospectos/ProspectosHeader';
import ProspectosCard from '../components/Prospectos/ProspectosCard';
import ProspectosTable from '../components/Prospectos/ProspectosTable';
import NuevoProspectoModal from '../components/Prospectos/NuevoProspectoModal';
import type { Prospecto } from '../types/profile';
import type { Oportunidad } from '../types/oportunidad';
import { getProspectos } from '../services/prospectos/prospectosServiceSupabase';
import { getOportunidadesByEmpresa } from '../services/oportunidades/oportunidadesServiceSupabase';
import { useUserStore } from '../store/userStore';
import './Prospectos.scss';

const Prospectos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { empresa } = useUserStore();
  const [data, setData] = useState<Prospecto[]>([]);
  const [oportunidadesData, setOportunidadesData] = useState<Oportunidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [showingOpportunities, setShowingOpportunities] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');

  // Check if navigation state contains filter
  const filterState = location.state?.filter;

  const handleNavigate = (key: string) => {
    const keyToPath: { [key: string]: string } = {
      'Tablero': '/tablero',
      'Oportunidades': '/oportunidades',
      'Propiedades': '/propiedades',
      'Prospectos': '/prospectos',
      'Propietarios': '/propietarios',
      'Contratos': '/contratos',
      'Reportes': '/reportes',
      'Visitas': '/calendario'
    };

    const path = keyToPath[key] || '/tablero';
    navigate(path);
  };

  const fetchProspectos = useCallback(async () => {
    setLoading(true);
    try {
      const prospectos = await getProspectos();
      setData(prospectos);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOportunidades = useCallback(async () => {
    setLoading(true);
    try {
      const oportunidades = await getOportunidadesByEmpresa(empresa?.id || '');
      setOportunidadesData(oportunidades);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [empresa?.id]);

  useEffect(() => {
    if (filterState) {
      setShowingOpportunities(true);
      fetchOportunidades();
    } else {
      setShowingOpportunities(false);
      fetchProspectos();
    }
  }, [filterState, fetchOportunidades, fetchProspectos]);

  // Filter opportunities based on the filter state
  const filteredOportunidades = oportunidadesData.filter(oportunidad => {
    if (!filterState) return true;
    
    if (filterState.etapa) {
      return oportunidad.etapa === filterState.etapa;
    }
    
    if (filterState.status) {
      return oportunidad.status === filterState.status;
    }
    
    return true;
  });

  // Convert opportunities to prospects format for display - Memoized
  const convertedData = useMemo(() => {
    return showingOpportunities ? 
      filteredOportunidades.map(oportunidad => {
        const prospecto = oportunidad.prospecto;
        
        return {
          id: oportunidad.id,
          source: 'opportunity',
          phone_e164: prospecto?.phone_e164 || '+56900000000',
          email: prospecto?.email,
          primer_nombre: prospecto?.primer_nombre,
          primer_apellido: prospecto?.primer_apellido,
          display_name: prospecto?.display_name,
          estado: oportunidad.etapa,
          first_seen_at: oportunidad.created_at,
          last_seen_at: oportunidad.updated_at,
        } as Prospecto;
      }) : data;
  }, [showingOpportunities, filteredOportunidades, data]);

  return (
    <div className="prospectos-page">
      <ProspectosHeader 
        onNuevoProspecto={() => setModalVisible(true)} 
        onNavigate={handleNavigate}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      {viewMode === 'kanban' ? (
        <ProspectosCard data={convertedData} loading={loading} />
      ) : (
        <ProspectosTable data={convertedData} loading={loading} />
      )}
      <NuevoProspectoModal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreated={showingOpportunities ? fetchOportunidades : fetchProspectos}
      />
    </div>
  );
};

export default Prospectos;
