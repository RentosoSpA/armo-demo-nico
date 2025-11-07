import React from 'react';
import { Badge, Progress, Tooltip } from 'antd';
import { Calendar, DollarSign, Users, Coffee, Printer, Home, Mail } from 'lucide-react';
import type { Membresia } from '../../presets/coworking/types/membresia';
import './MembresiaCard.scss';

interface MembresiaCardProps {
  membresia: Membresia;
  onVerDetalle: () => void;
}

const MembresiaCard: React.FC<MembresiaCardProps> = ({ membresia, onVerDetalle }) => {
  const getEstadoBadge = (estado: string) => {
    const config = {
      activa: { color: 'success', text: 'Activa' },
      renovacion_pendiente: { color: 'warning', text: 'Renovación Pendiente' },
      suspendida: { color: 'error', text: 'Suspendida' },
      cancelada: { color: 'default', text: 'Cancelada' },
    }[estado] || { color: 'default', text: estado };

    return <Badge status={config.color as any} text={config.text} />;
  };

  const getTipoPlanColor = (tipo: string) => {
    const colors: Record<string, string> = {
      mensual: '#10b981',
      flexible: '#3b82f6',
      oficina_virtual: '#8b5cf6',
      sala_eventos: '#f59e0b',
    };
    return colors[tipo] || '#6b7280';
  };

  // Calcular progreso de uso (simulado para demo)
  const calcularProgreso = () => {
    if (membresia.tipo_plan === 'flexible') {
      // Simular días usados
      const diasTotal = parseInt(membresia.nombre_plan.match(/\d+/)?.[0] || '12');
      const diasUsados = Math.floor(Math.random() * diasTotal);
      return {
        usado: diasUsados,
        total: diasTotal,
        porcentaje: (diasUsados / diasTotal) * 100,
        mostrar: true
      };
    }
    return { mostrar: false };
  };

  const progreso = calcularProgreso();

  // Check-ins simulados
  const checkInsEsteMes = Math.floor(Math.random() * 20) + 5;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="membresia-card" onClick={onVerDetalle}>
      <div className="membresia-card-header">
        <div className="membresia-avatar">
          <Users size={24} />
        </div>
        <div className="membresia-info">
          <h3 className="membresia-nombre">{membresia.nombre_miembro}</h3>
          <p className="membresia-email">{membresia.email_miembro}</p>
        </div>
        <div className="membresia-estado">
          {getEstadoBadge(membresia.estado)}
        </div>
      </div>

      <div className="membresia-plan">
        <span 
          className="plan-badge"
          style={{ backgroundColor: `${getTipoPlanColor(membresia.tipo_plan)}20`, color: getTipoPlanColor(membresia.tipo_plan) }}
        >
          {membresia.nombre_plan}
        </span>
      </div>

      <div className="membresia-precio">
        <DollarSign size={18} />
        <span className="precio-amount">
          ${membresia.precio_mensual.toLocaleString('es-CL')}
        </span>
        <span className="precio-period">/ mes</span>
      </div>

      {progreso.mostrar && (
        <div className="membresia-progreso">
          <div className="progreso-header">
            <span className="progreso-label">Uso del mes</span>
            <span className="progreso-value">{progreso.usado}/{progreso.total} días</span>
          </div>
          <Progress 
            percent={progreso.porcentaje} 
            strokeColor={getTipoPlanColor(membresia.tipo_plan)}
            showInfo={false}
          />
        </div>
      )}

      <div className="membresia-stats">
        <div className="stat-item">
          <Calendar size={16} />
          <span>Próxima renovación</span>
        </div>
        <div className="stat-value">
          {formatDate(membresia.fecha_renovacion)}
        </div>
      </div>

      <div className="membresia-checkins">
        <span className="checkins-label">Check-ins este mes:</span>
        <span className="checkins-value">{checkInsEsteMes} visitas</span>
      </div>

      <div className="membresia-servicios">
        <span className="servicios-label">Servicios incluidos:</span>
        <div className="servicios-icons">
          <Tooltip title="WiFi alta velocidad">
            <div className="servicio-icon">📶</div>
          </Tooltip>
          {membresia.tipo_plan !== 'oficina_virtual' && (
            <Tooltip title="Café ilimitado">
              <div className="servicio-icon"><Coffee size={16} /></div>
            </Tooltip>
          )}
          <Tooltip title="Impresora">
            <div className="servicio-icon"><Printer size={16} /></div>
          </Tooltip>
          {membresia.horas_sala_incluidas && (
            <Tooltip title={`${membresia.horas_sala_incluidas} hrs de sala`}>
              <div className="servicio-icon"><Home size={16} /></div>
            </Tooltip>
          )}
          {membresia.direccion_tributaria && (
            <Tooltip title="Dirección tributaria">
              <div className="servicio-icon"><Mail size={16} /></div>
            </Tooltip>
          )}
          {membresia.acceso_24_7 && (
            <Tooltip title="Acceso 24/7">
              <div className="servicio-icon">🔑</div>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default MembresiaCard;
