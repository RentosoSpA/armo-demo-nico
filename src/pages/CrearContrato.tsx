import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, App, Switch, Card } from 'antd';
import { ArrowLeft, Save, Download, FileText, MessageCircle } from 'lucide-react';
import type { Contrato, Propiedad, Prospecto } from '../lib/contratos-mock';
import { renderWithContext, hasEmptyPlaceholders } from '../lib/tokens';
import { saveDraft, makePublicLink, openWhatsApp, getPropiedad, getProspecto } from '../services/mock/contratosNewServiceMock';
import '../styles/crear-contrato.scss';

const CrearContrato = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { message, modal } = App.useApp();

  const contratoId = searchParams.get('contratoId');
  const propiedadId = searchParams.get('propiedadId');
  const prospectoId = searchParams.get('prospectoId');

  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [prospecto, setProspecto] = useState<Prospecto | null>(null);
  const [highlightFields, setHighlightFields] = useState(false);
  const [renderedHtml, setRenderedHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, [contratoId, propiedadId, prospectoId]);

  useEffect(() => {
    if (contrato && propiedad && prospecto) {
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

      const rendered = renderWithContext(contrato.html, ctx);
      setRenderedHtml(rendered);
    }
  }, [contrato, propiedad, prospecto]);

  const loadData = async () => {
    if (!contratoId || !propiedadId || !prospectoId) {
      message.error('Datos de contrato incompletos');
      navigate('/contratos');
      return;
    }

    try {
      setLoading(true);
      // In a real app, we'd fetch the contrato by ID
      // For now, we'll simulate with the mock data
      const [prop, prosp] = await Promise.all([
        getPropiedad(propiedadId),
        getProspecto(prospectoId)
      ]);

      if (!prop || !prosp) {
        message.error('No se pudo cargar los datos');
        navigate('/contratos');
        return;
      }

      // Mock contrato - in real app, fetch from service
      const mockContrato: Contrato = {
        id: contratoId,
        propiedadId,
        prospectoId,
        plantillaId: 'mock',
        titulo: 'Contrato de Arriendo',
        html: '<h1>CONTRATO DE ARRIENDO</h1><p>En la ciudad de [[propiedad.ciudad]], a [[fecha.hoy]], entre [[empresa.nombre]] y [[prospecto.nombre]], RUT [[prospecto.doc]], se celebra el presente contrato de arriendo sobre la propiedad ubicada en [[propiedad.direccion]].</p><p>El canon de arriendo mensual será de [[propiedad.moneda]] [[propiedad.canon_mensual]], pagadero el día [[propiedad.dia_pago]] de cada mes.</p>',
        estado: 'Pendiente',
        createdAt: new Date().toISOString()
      };

      setContrato(mockContrato);
      setPropiedad(prop);
      setProspecto(prosp);
    } catch (error) {
      message.error('Error al cargar el contrato');
      navigate('/contratos');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!contrato) return;

    try {
      await saveDraft(contrato.id, contrato.html);
      message.success('Borrador guardado correctamente');
    } catch (error) {
      message.error('Error al guardar el borrador');
    }
  };

  const handleExportPDF = () => {
    message.info('Generando PDF...');
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleExportDOCX = () => {
    if (!contrato) return;

    const blob = new Blob([contrato.html], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contrato.titulo}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('Documento DOCX descargado');
  };

  const handleSendWhatsApp = async () => {
    if (!contrato || !prospecto) return;

    if (hasEmptyPlaceholders(renderedHtml)) {
      modal.confirm({
        title: 'Campos incompletos',
        content: 'El contrato tiene campos sin completar. ¿Deseas enviarlo de todos modos?',
        okText: 'Enviar',
        cancelText: 'Cancelar',
        onOk: async () => {
          await sendWhatsApp();
        }
      });
    } else {
      await sendWhatsApp();
    }
  };

  const sendWhatsApp = async () => {
    if (!contrato || !prospecto) return;

    try {
      const publicUrl = await makePublicLink(contrato.id);
      const text = `Hola ${prospecto.nombre}, te comparto el contrato para revisión: ${publicUrl}`;

      if (prospecto.telefono) {
        openWhatsApp(prospecto.telefono, publicUrl, text);
        message.success('Abriendo WhatsApp...');
      } else {
        message.warning('El prospecto no tiene teléfono registrado');
      }
    } catch (error) {
      message.error('Error al generar el enlace');
    }
  };

  const handlePlaceholderClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('editable-placeholder') && !target.classList.contains('editing')) {
      const key = target.getAttribute('data-key');
      if (key) {
        setEditingKey(key);
        // Make the element editable
        setTimeout(() => {
          const editableElement = document.querySelector(`[data-key="${key}"]`) as HTMLElement;
          if (editableElement) {
            editableElement.contentEditable = 'true';
            editableElement.focus();
            // Select all text
            const range = document.createRange();
            range.selectNodeContents(editableElement);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
          }
        }, 0);
      }
    }
  };

  const handlePlaceholderBlur = (e: React.FocusEvent) => {
    const target = e.target as HTMLElement;
    const key = target.getAttribute('data-key');
    if (key) {
      const newValue = target.textContent || '';
      setPlaceholderValues(prev => ({ ...prev, [key]: newValue }));
      target.contentEditable = 'false';
      setEditingKey(null);
    }
  };

  const handlePlaceholderKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
    if (e.key === 'Escape') {
      const target = e.target as HTMLElement;
      const key = target.getAttribute('data-key');
      if (key) {
        // Restore original value
        const originalValue = placeholderValues[key] || `[[${key}]]`;
        target.textContent = originalValue;
        target.contentEditable = 'false';
        setEditingKey(null);
      }
    }
  };

  const processHtmlWithPlaceholders = (html: string): string => {
    return html.replace(/\[\[([a-zA-Z0-9_.]+)\]\]/g, (match, key) => {
      const value = placeholderValues[key] || match;
      const isEditing = editingKey === key;
      let className = 'editable-placeholder';
      if (highlightFields) className += ' highlighted';
      if (isEditing) className += ' editing';
      return `<span class="${className}" data-key="${key}" contenteditable="${isEditing}" onblur="handlePlaceholderBlur" onkeydown="handlePlaceholderKeyDown">${value}</span>`;
    });
  };

  useEffect(() => {
    // Attach event listeners for blur and keydown
    const placeholders = documentRef.current?.querySelectorAll('.editable-placeholder');
    placeholders?.forEach(el => {
      el.addEventListener('blur', handlePlaceholderBlur as any);
      el.addEventListener('keydown', handlePlaceholderKeyDown as any);
    });

    return () => {
      placeholders?.forEach(el => {
        el.removeEventListener('blur', handlePlaceholderBlur as any);
        el.removeEventListener('keydown', handlePlaceholderKeyDown as any);
      });
    };
  }, [processHtmlWithPlaceholders(renderedHtml), editingKey]);

  const processedHtml = processHtmlWithPlaceholders(renderedHtml);

  if (loading || !contrato || !propiedad || !prospecto) {
    return <div className="crear-contrato-loading">Cargando...</div>;
  }

  return (
    <div className="crear-contrato-container">
      <div className="crear-contrato-header">
        <Button
          type="text"
          icon={<ArrowLeft size={16} />}
          onClick={() => navigate('/contratos')}
          className="back-button"
        >
          Volver a Contratos
        </Button>
      </div>

      <div className="crear-contrato-body">
        <div className="document-section">
          <div className="document-wrapper" onClick={handlePlaceholderClick}>
            <div className="document-page">
              <div
                ref={documentRef}
                className="document-content"
                dangerouslySetInnerHTML={{ __html: processedHtml }}
              />
            </div>
          </div>
        </div>

        <div className="sidebar-section">
        

          <Card className="sidebar-card" title="Acciones">
            
            <div className="sidebar-actions">
              <div className="contract-title">
                <h3>{contrato.titulo}</h3>
              {hasEmptyPlaceholders(renderedHtml) && (
                <span className="incomplete-badge">Campos incompletos</span>
              )}
                 </div>

              
              <div className="option-item">
                <span className="option-label">Resaltar campos</span>
                <Switch checked={highlightFields} onChange={setHighlightFields} />
              </div>
            
              
              <Button
                icon={<Save size={16} />}
                onClick={handleSave}
                block
                size="large"
              >
                Guardar borrador
              </Button>
              <Button
                icon={<Download size={16} />}
                onClick={handleExportPDF}
                block
                size="large"
              >
                Exportar PDF
              </Button>
              <Button
                icon={<FileText size={16} />}
                onClick={handleExportDOCX}
                block
                size="large"
              >
                Exportar DOCX
              </Button>
              <Button
                type="primary"
                icon={<MessageCircle size={16} />}
                onClick={handleSendWhatsApp}
                block
                size="large"
              >
                Enviar por WhatsApp
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CrearContrato;
