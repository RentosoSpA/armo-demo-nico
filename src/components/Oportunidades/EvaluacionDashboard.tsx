import React from 'react';
import { Row, Col, Typography, Tooltip } from 'antd';
import { Download } from 'lucide-react';
import type { Oportunidad } from '../../types/oportunidad';

const { Title, Text } = Typography;

interface EvaluacionDashboardProps {
  oportunidad?: Oportunidad;
}

const EvaluacionDashboard: React.FC<EvaluacionDashboardProps> = ({ oportunidad }) => {
  const dashboardData = {
    itScore: 82,
    maxScore: 148,
    currentScore: 110,
  };

  return (
    <div className="mt-32">
      <Row gutter={[24, 24]}>
        {/* Left Side - Main Evaluation Card */}
        <Col xs={24} lg={12}>
          <div
            className="liquid-glass"
            style={{
              padding: '32px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="text-center mb-24">
              <Text style={{ fontSize: '16px', color: '#ffffff', marginBottom: '8px', display: 'block' }}>
                ¡Hola! Cauteloso hizo la calificación 👋
              </Text>
              <Title level={3} style={{ color: 'white', margin: '0', fontSize: '20px', fontWeight: '600' }}>
                {oportunidad?.prospecto ? 
                  `${oportunidad.prospecto.primer_nombre || ''} ${oportunidad.prospecto.primer_apellido || ''}`.trim() || 'Prospecto'
                  : 'Ana Sofía Herrera'
                }
              </Title>
            </div>

            {/* Gauge */}
            <div className="text-center mb-24">
              <div style={{ display: 'inline-block', position: 'relative' }}>
                <svg width="240" height="140" viewBox="0 0 240 140">
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
                      <stop offset="50%" stopColor="#FFD700" />
                      <stop offset="82%" stopColor="#FF6B35" />
                      <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
                    </linearGradient>
                  </defs>

                  {/* Background track */}
                  <path
                    d="M 30 110 A 90 90 0 0 1 210 110"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Progress arc (82%) */}
                  <path
                    d="M 30 110 A 90 90 0 0 1 181 35"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Indicator dot */}
                  <circle cx="181" cy="35" r="8" fill="#FF6B35" />
                </svg>

                {/* Bear icon */}
                <div style={{ position: 'absolute', top: '55px', left: '50%', transform: 'translateX(-50%)', fontSize: '32px' }}>
                  🐻
                </div>

                {/* Scale markers */}
                <div style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  300
                </div>
                <div style={{ position: 'absolute', bottom: '95px', left: '50%', transform: 'translateX(-50%)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  500
                </div>
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                  850
                </div>
              </div>
            </div>

            {/* Score Display */}
            <div className="text-center mb-24">
              <div style={{ fontSize: '48px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>
                {dashboardData.itScore}%
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Tu Score de Evaluación {dashboardData.currentScore}/{dashboardData.maxScore}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-center gap-16 mb-24">
              <button
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: '#FF6B35',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                }}
              >
                Evaluación Avanzada
              </button>
              <button
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  background: '#4CAF50',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                }}
              >
                Agendar una Visita
              </button>
            </div>

            {/* Footer */}
            <div className="text-center">
              <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                Última actualización: 9 Oct • <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Ver en whatsapp</span>
              </Text>
            </div>
          </div>
        </Col>

        {/* Right Side - Info Cards */}
        <Col xs={24} lg={12}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
            {/* Financial Information Card */}
            <div
              className="liquid-glass"
              style={{
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '16px 20px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Text style={{ fontWeight: '600', fontSize: '16px', color: '#ffffff' }}>
                  💰 Información Financiera
                </Text>
              </div>

              {/* Content */}
              <div style={{ padding: '20px' }}>
                {/* Ingresos Mensuales */}
                <div className="d-flex align-center justify-between mb-16">
                  <Text style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Ingresos Mensuales
                  </Text>
                  <div className="d-flex align-center gap-8">
                    <Text style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                      $4,500,000
                    </Text>
                    <span
                      style={{
                        background: '#4CAF50',
                        color: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      Verificado
                    </span>
                  </div>
                </div>

                {/* Score Crediticio */}
                <div className="d-flex align-center justify-between mb-16">
                  <Text style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Score Crediticio
                  </Text>
                  <div className="d-flex align-center gap-8">
                    <Text style={{ fontSize: '16px', fontWeight: '600', color: '#FFD700' }}>
                      750
                    </Text>
                    <span
                      style={{
                        background: '#4CAF50',
                        color: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      Excelente
                    </span>
                  </div>
                </div>

                {/* Capacidad de Pago */}
                <div className="d-flex align-center justify-between">
                  <Text style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Capacidad de Pago
                  </Text>
                  <div className="d-flex align-center gap-8">
                    <Text style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff' }}>
                      $1,350,000
                    </Text>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        color: 'rgba(255, 255, 255, 0.8)',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      30% disponible
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Two Cards */}
            <Row gutter={[16, 16]}>
              {/* Intención de Compra */}
              <Col xs={24} sm={12}>
                <div
                  className="liquid-glass"
                  style={{
                    padding: '24px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    textAlign: 'center',
                    height: '100%',
                  }}
                >
                  <Title level={4} style={{ margin: '0 0 12px 0', color: '#ffffff', fontSize: '18px' }}>
                    Intención de Compra
                  </Title>
                  <div className="d-flex align-center justify-center gap-8">
                    <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                      Clasificación:
                    </Text>
                    <Text style={{ color: '#4CAF50', fontSize: '16px', fontWeight: '600' }}>
                      Alta
                    </Text>
                  </div>
                </div>
              </Col>

              {/* Descargar Documentos */}
              <Col xs={24} sm={12}>
                <Tooltip title="Descargar zip" placement="top">
                  <div
                    className="liquid-glass cursor-pointer"
                    style={{
                      padding: '24px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid #4CAF50',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      textAlign: 'center',
                      height: '100%',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => console.log('Downloading documents...')}
                  >
                    <div className="d-flex align-center justify-center mb-8 gap-8">
                      <Download size={20} color="#4CAF50" />
                      <Text style={{ fontSize: '14px', fontWeight: '600', color: '#4CAF50' }}>
                        Descargar documentos
                      </Text>
                    </div>
                    <Text style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                      Archivos del prospecto
                    </Text>
                  </div>
                </Tooltip>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EvaluacionDashboard;
