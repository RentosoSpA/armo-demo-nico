import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Space } from 'antd';
import { ArrowLeft, X, Check } from 'lucide-react';
import type { Oportunidad } from '../types/oportunidad';
import { getOportunidadById } from '../services/oportunidades/oportunidadesServiceSupabase';
import CommonButton from '../components/common/CommonButton';
import EvaluacionDashboard from '../components/Oportunidades/EvaluacionDashboard';
import InformacionProspecto from '../components/Oportunidades/InformacionProspecto';

const CalificarOportunidad: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [oportunidad, setOportunidad] = useState<Oportunidad | null>(null);
  const [loading, setLoading] = useState(true);

  console.log('CalificarOportunidad component loaded, id:', id);

  useEffect(() => {
    const fetchOportunidad = async () => {
      try {
        if (id) {
          const encontrada = await getOportunidadById(id);
          setOportunidad(encontrada || null);
        }
      } catch (error) {
        console.error('Error fetching oportunidad:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOportunidad();
    }
  }, [id]);

  const handleBack = () => {
    navigate('/oportunidades');
  };

  const handleReject = () => {
    // Handle reject logic here
    console.log('Rejecting prospect');
    handleBack();
  };

  const handleAccept = () => {
    // Handle accept logic here
    console.log('Accepting prospect');
    handleBack();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!oportunidad) {
    return <div>Oportunidad no encontrada</div>;
  }

  

  return (
    <div className="p-24">
      <CommonButton 
        variant="secondary"
        icon={ArrowLeft}
        onClick={handleBack}
        className="mb-24"
      >
        Volver a Oportunidades
      </CommonButton>

      {/* Dashboard Distribution */}
      <EvaluacionDashboard oportunidad={oportunidad} />

      {/* Información del Prospecto */}
      <InformacionProspecto oportunidad={oportunidad} />

      {/* Action Buttons */}
      <div className="text-center mt-24">
        <Space size="large">
          <CommonButton 
            variant="secondary"
            icon={X}
            size="large"
            onClick={handleReject}
            style={{ 
              minWidth: '180px',
              borderColor: '#F43F5E',
              color: '#F43F5E'
            }}
          >
            Rechazar prospecto
          </CommonButton>
          <CommonButton 
            variant="primary"
            icon={Check}
            size="large"
            onClick={handleAccept}
            style={{ minWidth: '180px' }}
          >
            Aceptar prospecto
          </CommonButton>
        </Space>
      </div>
    </div>
  );
};

export default CalificarOportunidad;