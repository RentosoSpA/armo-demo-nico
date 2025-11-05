import { useState, useEffect } from 'react';
import { Modal, Card, Avatar, Spin } from 'antd';
import { User, Calendar, MapPin, Home } from 'lucide-react';
import type { Prospecto } from '../../types/profile';
import type { Oportunidad } from '../../types/oportunidad';
import { getOportunidadesByEmpresa } from '../../services/oportunidades/oportunidadesServiceSupabase';
import { useUserStore } from '../../store/userStore';

interface ProspectoOpportunityModalProps {
  visible: boolean;
  prospecto: Prospecto | null;
  onClose: () => void;
}

const ProspectoOpportunityModal = ({ visible, prospecto, onClose }: ProspectoOpportunityModalProps) => {
  const [opportunities, setOpportunities] = useState<Oportunidad[]>([]);
  const [loading, setLoading] = useState(false);
  const { empresa } = useUserStore();

  useEffect(() => {
    if (visible && prospecto) {
      fetchOpportunities();
    }
  }, [visible, prospecto]);

  const fetchOpportunities = async () => {
    if (!prospecto || !empresa?.id) return;
    
    setLoading(true);
    try {
      const allOpportunities = await getOportunidadesByEmpresa(empresa.id);
      const prospectoOpportunities = allOpportunities.filter(opp => 
        opp.prospecto_id === prospecto.id
      );
      setOpportunities(prospectoOpportunities);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    { key: 'Exploracion', title: 'Capta', icon: <User className="stage-icon" />, color: '#1890ff' },
    { key: 'Evaluacion', title: 'Evalua', icon: <Calendar className="stage-icon" />, color: '#fa8c16' },
    { key: 'Negociacion', title: 'Negoc', icon: <Home className="stage-icon" />, color: '#722ed1' },
    { key: 'Cierre', title: 'Cierre', icon: <Home className="stage-icon" />, color: '#52c41a' },
  ];

  const getOpportunitiesForStage = (stageKey: string) => {
    return opportunities.filter(opp => opp.etapa === stageKey);
  };

  if (!prospecto) return null;

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1200}
      centered
      className="prospecto-opportunity-modal"
    >
      <div className="opportunity-pipeline">
        {loading ? (
          <div className="text-center p-40">
            <Spin size="large" />
          </div>
        ) : (
          <div className="pipeline-stages">
            {stages.map((stage, index) => {
              const stageOpportunities = getOpportunitiesForStage(stage.key);
              const isFirstStage = index === 0;
              
              return (
                <div key={stage.key} className="pipeline-stage">
                  <div className="stage-header" style={{ borderTopColor: stage.color }}>
                    {stage.icon}
                    <h3 style={{ color: stage.color }}>{stage.title}</h3>
                  </div>
                  
                  <Card className="stage-card">
                    {isFirstStage ? (
                      <div className="prospect-info">
                        <div className="prospect-header">
                          <Avatar size={48} style={{ backgroundColor: stage.color }}>
                            {(prospecto.primer_nombre || prospecto.display_name || 'P').charAt(0)}
                          </Avatar>
                          <div className="prospect-name">
                            <h4>{`${prospecto.primer_nombre || ''} ${prospecto.segundo_nombre || ''}`.trim() || prospecto.display_name || 'Prospecto'}</h4>
                            <h5>{`${prospecto.primer_apellido || ''} ${prospecto.segundo_apellido || ''}`.trim()}</h5>
                          </div>
                        </div>
                        
                        {stageOpportunities.length > 0 ? (
                          stageOpportunities.map(opp => opp.propiedad && (
                            <div key={opp.id} className="opportunity-item">
                              <h6>{opp.propiedad.titulo}</h6>
                              <div className="opportunity-details">
                                <div className="detail-item">
                                  <MapPin size={14} />
                                  <span>{opp.propiedad.direccion}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="prospect-details">
                            <p className="prospect-description">
                              {prospecto.ingresos_mensuales ? `Departamento moderno en Providencia` : 'Nuevo prospecto'}
                            </p>
                            <div className="detail-item">
                              <MapPin size={14} />
                              <span>Av. Providencia 2200, Santiago</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="stage-content">
                        {stageOpportunities.length > 0 ? (
                          stageOpportunities.map(opp => opp.propiedad && (
                            <div key={opp.id} className="opportunity-item">
                              <h6>{opp.propiedad.titulo}</h6>
                              <div className="opportunity-details">
                                <div className="detail-item">
                                  <MapPin size={14} />
                                  <span>{opp.propiedad.direccion}</span>
                                </div>
                                <div className="opportunity-price">
                                  {opp.propiedad.divisa} {opp.propiedad.precio.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="empty-stage">
                            <div className="empty-content">
                              <span>Sin</span>
                              <span>oportunidades</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ProspectoOpportunityModal;
