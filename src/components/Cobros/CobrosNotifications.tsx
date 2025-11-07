import React, { useState } from 'react';
import { Tabs, Button } from 'antd';
import { MessageCircle, Eye } from 'lucide-react';
import type { Cobro, EstadoCobro } from '../../types/cobro';
import { formatCurrency } from '../../utils/formatters';

interface CobrosNotificationsProps {
  data: Cobro[];
}

const CobrosNotifications: React.FC<CobrosNotificationsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('por-cobrar');

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusChipClass = (estado: EstadoCobro) => {
    switch (estado) {
      case 'Pagado':
        return 'success';
      case 'Por cobrar':
        return 'warning';
      case 'Atrasado':
        return 'error';
      case 'Cobrado parcialmente':
        return 'warning';
      default:
        return 'warning';
    }
  };

  const getStatusText = (estado: EstadoCobro) => {
    switch (estado) {
      case 'Pagado':
        return 'Pagado';
      case 'Por cobrar':
        return 'Por cobrar';
      case 'Atrasado':
        return 'Atrasado';
      case 'Cobrado parcialmente':
        return 'Parcial';
      default:
        return estado;
    }
  };

  const filterCobros = (tab: string) => {
    if (tab === 'por-cobrar') {
      return data
        .filter(cobro => ['Por cobrar', 'Atrasado', 'Cobrado parcialmente'].includes(cobro.estado))
        .sort((a, b) => new Date(a.fechaVencimiento).getTime() - new Date(b.fechaVencimiento).getTime());
    } else {
      return data
        .filter(cobro => cobro.estado === 'Pagado')
        .sort((a, b) => {
          const fechaA = a.fechaPago ? new Date(a.fechaPago).getTime() : 0;
          const fechaB = b.fechaPago ? new Date(b.fechaPago).getTime() : 0;
          return fechaB - fechaA;
        });
    }
  };

  const filteredCobros = filterCobros(activeTab);

  const formatDate = (date: Date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  const handleWhatsAppClick = (cobro: Cobro) => {
    console.log('WhatsApp clicked for:', cobro.cliente.nombre);
    // Mock WhatsApp action
  };

  const handleVerClick = (cobro: Cobro) => {
    console.log('Ver clicked for:', cobro);
    // Mock view action
  };

  return (
    <div className="notif-panel">
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        size="small"
        items={[
          {
            key: 'por-cobrar',
            label: 'Por cobrar',
            children: (
              <div className="notif-list">
                {filteredCobros.map(cobro => (
                  <div key={cobro.id} className="notif-item">
                    <div className="avatar">
                      {getInitials(cobro.cliente.nombre)}
                    </div>
                    
                    <div className="content">
                      <div className="client-name">
                        {cobro.cliente.nombre}
                      </div>
                      <div className="property-title">
                        {cobro.propiedad.titulo}
                      </div>
                      <div className="date-info">
                        Vence: {formatDate(cobro.fechaVencimiento)}
                      </div>
                    </div>
                    
                    <div className="amount">
                      <div className="amount-value">
                        {formatCurrency(cobro.monto, cobro.divisa)}
                      </div>
                      <div className={`status-chip ${getStatusChipClass(cobro.estado)}`}>
                        {getStatusText(cobro.estado)}
                      </div>
                    </div>
                    
                    <div className="actions">
                      <Button
                        size="small"
                        className="action-btn whatsapp"
                        icon={<MessageCircle size={12} />}
                        onClick={() => handleWhatsAppClick(cobro)}
                      />
                      <Button
                        size="small"
                        className="action-btn"
                        icon={<Eye size={12} />}
                        onClick={() => handleVerClick(cobro)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )
          },
          {
            key: 'pagado',
            label: 'Pagado',
            children: (
              <div className="notif-list">
                {filteredCobros.map(cobro => (
                  <div key={cobro.id} className="notif-item">
                    <div className="avatar">
                      {getInitials(cobro.cliente.nombre)}
                    </div>
                    
                    <div className="content">
                      <div className="client-name">
                        {cobro.cliente.nombre}
                      </div>
                      <div className="property-title">
                        {cobro.propiedad.titulo}
                      </div>
                      <div className="date-info">
                        Pagado: {cobro.fechaPago ? formatDate(cobro.fechaPago) : 'N/A'}
                      </div>
                    </div>
                    
                    <div className="amount">
                      <div className="amount-value">
                        {formatCurrency(cobro.monto, cobro.divisa)}
                      </div>
                      <div className={`status-chip ${getStatusChipClass(cobro.estado)}`}>
                        {getStatusText(cobro.estado)}
                      </div>
                    </div>
                    
                    <div className="actions">
                      <Button
                        size="small"
                        className="action-btn"
                        icon={<Eye size={12} />}
                        onClick={() => handleVerClick(cobro)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        ]}
      />
    </div>
  );
};

export default CobrosNotifications;