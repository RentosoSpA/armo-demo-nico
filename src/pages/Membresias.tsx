import React, { useState, useEffect } from 'react';
import { Tabs, Spin, App } from 'antd';
import { Users, BarChart3, FileText } from 'lucide-react';
import MembresiaCard from '../components/Membresias/MembresiaCard';
import MembresiaStats from '../components/Membresias/MembresiaStats';
import MembresiaDetailModal from '../components/Membresias/MembresiaDetailModal';
import { MEMBRESIAS_MOCK } from '../presets/coworking/mocks/membresiasMock';
import type { Membresia } from '../presets/coworking/types/membresia';
import './Membresias.scss';

const { TabPane } = Tabs;

const Membresias: React.FC = () => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [membresias, setMembresias] = useState<Membresia[]>([]);
  const [selectedMembresia, setSelectedMembresia] = useState<Membresia | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadMembresias();
  }, []);

  const loadMembresias = async () => {
    try {
      setLoading(true);
      // Simular carga desde API
      await new Promise(resolve => setTimeout(resolve, 500));
      setMembresias(MEMBRESIAS_MOCK);
    } catch (error) {
      console.error('Error cargando membresías:', error);
      message.error('Error al cargar las membresías');
    } finally {
      setLoading(false);
    }
  };

  const handleVerDetalle = (membresia: Membresia) => {
    setSelectedMembresia(membresia);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedMembresia(null);
  };

  const membresiaActivas = membresias.filter(m => m.estado === 'activa');
  const membresiasConRenovacion = membresias.filter(m => m.estado === 'renovacion_pendiente');

  return (
    <div className="membresias-page">
      <div className="membresias-header">
        <h1 className="membresias-title">💼 Membresías</h1>
        <p className="membresias-subtitle">
          Gestiona las membresías activas de tus miembros
        </p>
      </div>

      <Tabs
        defaultActiveKey="activas"
        className="membresias-tabs"
        items={[
          {
            key: 'activas',
            label: (
              <span className="tab-label">
                <Users size={16} />
                <span>Activas ({membresiaActivas.length})</span>
              </span>
            ),
            children: (
              <div className="membresias-content">
                {loading ? (
                  <div className="membresias-loading">
                    <Spin size="large" />
                    <p>Cargando membresías...</p>
                  </div>
                ) : (
                  <>
                    {membresiasConRenovacion.length > 0 && (
                      <div className="membresias-alert">
                        <span className="alert-icon">⏰</span>
                        <span className="alert-text">
                          Tienes {membresiasConRenovacion.length} membresía(s) pendiente(s) de renovación
                        </span>
                      </div>
                    )}
                    
                    <div className="membresias-grid">
                      {membresias.map(membresia => (
                        <MembresiaCard
                          key={membresia.id}
                          membresia={membresia}
                          onVerDetalle={() => handleVerDetalle(membresia)}
                        />
                      ))}
                    </div>
                    
                    {membresias.length === 0 && (
                      <div className="membresias-empty">
                        <Users size={48} />
                        <p>No hay membresías activas</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            ),
          },
          {
            key: 'estadisticas',
            label: (
              <span className="tab-label">
                <BarChart3 size={16} />
                <span>Estadísticas</span>
              </span>
            ),
            children: (
              <div className="membresias-content">
                {loading ? (
                  <div className="membresias-loading">
                    <Spin size="large" />
                  </div>
                ) : (
                  <MembresiaStats membresias={membresias} />
                )}
              </div>
            ),
          },
          {
            key: 'contratos',
            label: (
              <span className="tab-label">
                <FileText size={16} />
                <span>Contratos</span>
              </span>
            ),
            children: (
              <div className="membresias-content">
                <div className="contratos-section">
                  <h3>📄 Documentos legales</h3>
                  <p className="section-subtitle">
                    Contratos firmados y plantillas disponibles
                  </p>
                  <div className="contratos-placeholder">
                    <FileText size={64} />
                    <p>Sección de contratos próximamente</p>
                    <small>Aquí podrás ver todos los contratos firmados y generar nuevos</small>
                  </div>
                </div>
              </div>
            ),
          },
        ]}
      />

      {selectedMembresia && (
        <MembresiaDetailModal
          membresia={selectedMembresia}
          visible={modalVisible}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Membresias;
