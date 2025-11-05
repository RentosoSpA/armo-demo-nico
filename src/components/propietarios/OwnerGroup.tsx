import React from 'react';
import { Button, Avatar } from 'antd';
import { ChevronDown, ChevronRight, Mail, MessageCircle, Edit } from 'lucide-react';
import type { Propietario, PropiedadResumen } from '../../types/propietario';

interface OwnerGroupProps {
  owner: Propietario;
  properties: PropiedadResumen[];
  isExpanded: boolean;
  onToggle: () => void;
  onEditOwner: () => void;
  children: React.ReactNode;
}

const OwnerGroup: React.FC<OwnerGroupProps> = ({ 
  owner, 
  isExpanded, 
  onToggle,
  onEditOwner, 
  children 
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const hasEmail = owner.email && owner.email !== 'N/A' && owner.email.includes('@');
  
  const phoneFormatted = owner.telefono 
    ? `+${owner.codigo_telefonico} ${owner.telefono}`
    : 'Sin teléfono';

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!owner.telefono) return;
    
    const phone = `${owner.codigo_telefonico}${owner.telefono}`.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Hola ${owner.nombre}, te contacto desde Rentoso.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="owner-group">
      <div className="owner-group-header" onClick={onToggle}>
        <div className="owner-info">
          <Avatar size={40} style={{ backgroundColor: '#33F491', color: '#1b2a3a' }}>
            {getInitials(owner.nombre)}
          </Avatar>
          <div className="owner-details">
            <div className="owner-name">
              {owner.nombre}
              {owner.tipo_documento && owner.documento && (
                <span className="document-badge" style={{ 
                  marginLeft: '12px', 
                  padding: '2px 8px', 
                  background: 'rgba(51, 244, 145, 0.1)', 
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#33F491'
                }}>
                  {owner.tipo_documento}: {owner.documento}
                </span>
              )}
            </div>
            <div className="owner-contact">
              <span className="contact-item">📞 {phoneFormatted}</span>
              <span className="contact-item">✉️ {owner.email || 'Sin email'}</span>
            </div>
            <div className="owner-actions">
              <span className="stat-chip">
                {owner.propiedades_asociadas === 1 
                  ? '1 propiedad' 
                  : `${owner.propiedades_asociadas} propiedades`}
              </span>
              
              {hasEmail ? (
                <a 
                  href={`mailto:${owner.email}`} 
                  className="action-pill contactar"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Mail size={12} />
                  Contactar
                </a>
              ) : (
                <span className="action-pill contactar disabled">
                  <Mail size={12} />
                  Sin email
                </span>
              )}
              
              <button 
                className="action-pill whatsapp"
                onClick={handleWhatsApp}
                disabled={!owner.telefono}
              >
                <MessageCircle size={12} />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button 
            type="primary"
            icon={<Edit size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              onEditOwner();
            }}
            className="editar-propietario-btn"
          >
            Editar Propietario
          </Button>
          <Button 
            type="text" 
            icon={isExpanded ? <ChevronDown /> : <ChevronRight />}
            className="toggle-button"
          />
        </div>
      </div>
      {isExpanded && (
        <div className="owner-group-body">
          {children}
        </div>
      )}
    </div>
  );
};

export default OwnerGroup;
