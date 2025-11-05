import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import type { Oportunidad } from '../../types/oportunidad';
import { currencyFormatter } from '../../utils/formatters';
import { prospectoToContacto } from '../../utils/prospecto';

interface OportunidadDetailsProps {
  open: boolean;
  onClose: () => void;
  oportunidad?: Oportunidad | null;
}

const OportunidadDetails: React.FC<OportunidadDetailsProps> = ({ open, onClose, oportunidad }) => {
  if (!oportunidad) return null;
  
  const { propiedad, etapa, prospecto } = oportunidad;
  const contacto = prospecto ? prospectoToContacto(prospecto) : null;

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Detalle de Oportunidad" width={600}>
      <Descriptions bordered column={1} size="middle" labelStyle={{ width: 180, fontWeight: 500 }}>
        <Descriptions.Item label="Etapa">
          <Tag color="blue">{etapa}</Tag>
        </Descriptions.Item>
      </Descriptions>

      {contacto && (
        <>
          <div className="font-semibold mb-8 mt-24">Prospecto</div>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Nombre">
              {contacto.nombre}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {contacto.email || 'No especificado'}
            </Descriptions.Item>
            <Descriptions.Item label="Teléfono">
              {contacto.telefono || 'No especificado'}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}

      {propiedad && (
        <>
          <div className="font-semibold mb-8 mt-24">Propiedad</div>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Título">{propiedad.titulo}</Descriptions.Item>
            <Descriptions.Item label="Dirección">{propiedad.direccion}</Descriptions.Item>
            <Descriptions.Item label="Operación">
              <Tag color="blue">{propiedad.arriendo ? 'Arriendo' : 'Venta'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Precio">
              {currencyFormatter((propiedad.arriendo ? propiedad.precio_arriendo : propiedad.precio_venta) || 0)} {propiedad.divisa}
            </Descriptions.Item>
          </Descriptions>
        </>
      )}
    </Modal>
  );
};

export default OportunidadDetails;
