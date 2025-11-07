import React from 'react';
import { Modal } from 'antd';
import type { Membresia } from '../../presets/coworking/types/membresia';

interface MembresiaDetailModalProps {
  membresia: Membresia;
  visible: boolean;
  onClose: () => void;
}

const MembresiaDetailModal: React.FC<MembresiaDetailModalProps> = ({ membresia, visible, onClose }) => {
  return (
    <Modal
      title={`Detalle de Membresía - ${membresia.nombre_miembro}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div style={{ padding: '20px 0' }}>
        <p>Nombre: {membresia.nombre_miembro}</p>
        <p>Email: {membresia.email_miembro}</p>
        <p>Plan: {membresia.nombre_plan}</p>
        <p>Precio: ${membresia.precio_mensual.toLocaleString('es-CL')}</p>
        <p>Estado: {membresia.estado}</p>
      </div>
    </Modal>
  );
};

export default MembresiaDetailModal;
