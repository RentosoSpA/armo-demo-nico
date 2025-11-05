import { useState, useEffect } from 'react';
import { Button, Switch, App, Modal } from 'antd';
import { Save, Download, FileText, MessageCircle } from 'lucide-react';
import type { Contrato, Propiedad, Prospecto } from '../../lib/contratos-mock';
import { renderWithContext, hasEmptyPlaceholders } from '../../lib/tokens';

interface PlaceholderEditorProps {
  contrato: Contrato;
  propiedad: Propiedad;
  prospecto: Prospecto;
  onSave: (html: string) => void;
  onExportPDF: () => void;
  onExportDOCX: () => void;
  onSendWhatsApp: () => void;
  onClose: () => void;
}

const PlaceholderEditor: React.FC<PlaceholderEditorProps> = ({
  contrato,
  propiedad,
  prospecto,
  onSave,
  onExportPDF,
  onExportDOCX,
  onSendWhatsApp,
  onClose
}) => {
  const { message } = App.useApp();
  const [html] = useState(contrato.html);
  const [highlightFields, setHighlightFields] = useState(false);
  const [renderedHtml, setRenderedHtml] = useState('');

  useEffect(() => {
    const ctx = {
      propiedad: {
        titulo: propiedad.titulo,
        direccion: propiedad.direccion,
        ciudad: propiedad.ciudad,
        canon_mensual: propiedad.canon_mensual,
        moneda: propiedad.moneda,
        dia_pago: propiedad.dia_pago
      },
      prospecto: {
        nombre: prospecto.nombre,
        doc: prospecto.doc,
        telefono: prospecto.telefono,
        email: prospecto.email
      },
      fecha: {
        hoy: new Date().toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      },
      empresa: {
        nombre: 'Rentoso'
      }
    };

    const rendered = renderWithContext(html, ctx);
    setRenderedHtml(rendered);
  }, [html, propiedad, prospecto]);

  const handleSave = () => {
    onSave(html);
    message.success('Borrador guardado correctamente');
  };

  const handleSendWhatsApp = () => {
    if (hasEmptyPlaceholders(renderedHtml)) {
      Modal.confirm({
        title: 'Campos incompletos',
        content: 'El contrato tiene campos sin completar. ¿Deseas enviarlo de todos modos?',
        okText: 'Enviar',
        cancelText: 'Cancelar',
        onOk: onSendWhatsApp
      });
    } else {
      onSendWhatsApp();
    }
  };

  const highlightedHtml = highlightFields
    ? renderedHtml.replace(/\[\[([a-zA-Z0-9_.]+)\]\]/g, '<span class="empty-token">$&</span>')
    : renderedHtml;

  return (
    <div className="placeholder-editor">
      <div className="editor-header">
        <div className="editor-header-left">
          <h2>{contrato.titulo}</h2>
          {hasEmptyPlaceholders(renderedHtml) && (
            <span className="incomplete-badge">Campos incompletos</span>
          )}
        </div>
        <div className="editor-header-right">
          <span className="highlight-label">Resaltar campos</span>
          <Switch checked={highlightFields} onChange={setHighlightFields} />
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>

      <div className={`editor-content ${highlightFields ? 'highlight-mode' : ''}`}>
        <div
          className="contract-document"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </div>

      <div className="editor-footer">
        <div className="editor-footer-left">
          <Button icon={<Save size={16} />} onClick={handleSave}>
            Guardar borrador
          </Button>
        </div>
        <div className="editor-footer-right">
          <Button icon={<Download size={16} />} onClick={onExportPDF}>
            Exportar PDF
          </Button>
          <Button icon={<FileText size={16} />} onClick={onExportDOCX}>
            Exportar DOCX
          </Button>
          <Button
            type="primary"
            icon={<MessageCircle size={16} />}
            onClick={handleSendWhatsApp}
          >
            Enviar por WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderEditor;
