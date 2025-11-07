import type { Plantilla } from '../../../lib/contratos-mock';

export const PLANTILLAS_COWORK_MOCK: Plantilla[] = [
  {
    id: 'plt-cowork-1',
    titulo: 'Contrato Membresía Mensual',
    tipo: 'Otro',
    html: `<div style="font-family: 'Poppins', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
      <h1 style="text-align: center; margin-bottom: 30px;">CONTRATO DE MEMBRESÍA COWORKING</h1>
      <p><strong>OPERADOR:</strong> {{empresa.nombre}}</p>
      <p><strong>MIEMBRO:</strong> {{prospecto.nombre}}, identificado con email {{prospecto.email}}</p>
      <p><strong>ESPACIO:</strong> {{propiedad.titulo}}</p>
      <p><strong>PLAN:</strong> Membresía Mensual</p>
      <p><strong>PRECIO MENSUAL:</strong> {{propiedad.moneda}} {{propiedad.canon_mensual}}</p>
      <p><strong>DÍA DE PAGO:</strong> {{propiedad.dia_pago}} de cada mes</p>
      <p><strong>FECHA:</strong> {{fecha.hoy}}</p>
      <h2>SERVICIOS INCLUIDOS</h2>
      <ul>
        <li>Acceso a escritorio compartido (Hot Desk)</li>
        <li>WiFi de alta velocidad</li>
        <li>Café ilimitado</li>
        <li>Uso de salas de reunión (según disponibilidad)</li>
        <li>Acceso a espacios comunes</li>
      </ul>
      <h2>TÉRMINOS Y CONDICIONES</h2>
      <p>El presente contrato se celebra para el uso de espacios de coworking ubicados en {{propiedad.direccion}}. El miembro se compromete a respetar las normas de convivencia y hacer uso responsable de las instalaciones.</p>
    </div>`,
    updatedAt: '2025-01-30',
    source: 'auto'
  },
  {
    id: 'plt-cowork-2',
    titulo: 'Contrato Escritorio Flexible',
    tipo: 'Otro',
    html: `<div style="font-family: 'Poppins', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
      <h1 style="text-align: center; margin-bottom: 30px;">CONTRATO ESCRITORIO FLEXIBLE</h1>
      <p><strong>OPERADOR:</strong> {{empresa.nombre}}</p>
      <p><strong>MIEMBRO:</strong> {{prospecto.nombre}}</p>
      <p><strong>EMAIL:</strong> {{prospecto.email}}</p>
      <p><strong>TELÉFONO:</strong> {{prospecto.telefono}}</p>
      <p><strong>PLAN:</strong> Escritorio Flexible - 8 días al mes</p>
      <p><strong>PRECIO MENSUAL:</strong> {{propiedad.moneda}} {{propiedad.canon_mensual}}</p>
      <p><strong>FECHA:</strong> {{fecha.hoy}}</p>
      <h2>DESCRIPCIÓN DEL PLAN</h2>
      <p>El plan de Escritorio Flexible permite al miembro acceso a las instalaciones hasta 8 días por mes calendario. Los días no son acumulables y deben ser reservados con al menos 24 horas de anticipación.</p>
      <h2>SERVICIOS INCLUIDOS</h2>
      <ul>
        <li>8 días de acceso por mes</li>
        <li>WiFi de alta velocidad</li>
        <li>Café y té ilimitado</li>
        <li>2 horas de sala de reunión incluidas</li>
      </ul>
    </div>`,
    updatedAt: '2025-01-30',
    source: 'auto'
  },
  {
    id: 'plt-cowork-3',
    titulo: 'Contrato Oficina Virtual',
    tipo: 'Otro',
    html: `<div style="font-family: 'Poppins', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
      <h1 style="text-align: center; margin-bottom: 30px;">CONTRATO OFICINA VIRTUAL</h1>
      <p><strong>OPERADOR:</strong> {{empresa.nombre}}</p>
      <p><strong>CLIENTE:</strong> {{prospecto.nombre}}</p>
      <p><strong>DIRECCIÓN PROPORCIONADA:</strong> {{propiedad.direccion}}, {{propiedad.ciudad}}</p>
      <p><strong>PRECIO MENSUAL:</strong> {{propiedad.moneda}} {{propiedad.canon_mensual}}</p>
      <p><strong>FECHA:</strong> {{fecha.hoy}}</p>
      <h2>SERVICIOS INCLUIDOS</h2>
      <ul>
        <li>Dirección comercial y tributaria</li>
        <li>Recepción de correspondencia</li>
        <li>Notificación de documentos recibidos</li>
        <li>10 horas mensuales de sala de reunión</li>
        <li>Atención telefónica personalizada (opcional)</li>
      </ul>
      <h2>OBJETO DEL CONTRATO</h2>
      <p>El operador proporciona al cliente una dirección comercial/tributaria oficial, así como servicios de recepción de correspondencia y acceso a salas de reunión según disponibilidad.</p>
    </div>`,
    updatedAt: '2025-01-30',
    source: 'auto'
  }
];
