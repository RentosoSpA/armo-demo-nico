import React, { useMemo, useState } from 'react';
import { Modal, Button, Space, Tooltip } from 'antd';
import type { Membresia } from '../../presets/coworking/types/membresia';
import { generateMembershipContractHTML } from '../../services/membresias/contractGeneratorMock';

interface MembresiaDetailModalProps {
  membresia: Membresia;
  visible: boolean;
  onClose: () => void;
}

const MembresiaDetailModal: React.FC<MembresiaDetailModalProps> = ({ membresia, visible, onClose }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [html, setHtml] = useState<string | null>(null);

  const handleGenerate = () => {
    const content = generateMembershipContractHTML(membresia);
    setHtml(content);
    setPreviewOpen(true);
  };

  const handleDownload = () => {
    if (!html) return;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Contrato-Membresia-${membresia.nombre_miembro}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Modal
        title={`Detalle de Membresía - ${membresia.nombre_miembro}`}
        open={visible}
        onCancel={onClose}
        footer={
          <Space>
            <Button onClick={onClose}>Cerrar</Button>
            <Button type="primary" onClick={handleGenerate}>
              Generar contrato demo
            </Button>
          </Space>
        }
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

      <Modal
        title="Vista previa de contrato"
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setPreviewOpen(false)}>Cerrar</Button>
            <Tooltip title="Descarga archivo HTML (demo)">
              <Button type="primary" onClick={handleDownload}>Descargar</Button>
            </Tooltip>
          </Space>
        }
        width={900}
      >
        <div style={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: 8, overflow: 'hidden' }}>
          <iframe title="preview" srcDoc={html || ''} style={{ width: '100%', height: 600, border: 'none' }} />
        </div>
      </Modal>
    </>
  );
};

export default MembresiaDetailModal;
