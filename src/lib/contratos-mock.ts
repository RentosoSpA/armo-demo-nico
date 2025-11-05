export type Estado = 'Pendiente' | 'Enviado' | 'Firmado';

export type Plantilla = {
  id: string;
  titulo: string;
  tipo: 'Arriendo' | 'Compra' | 'Encargo' | 'Otro';
  html: string;
  updatedAt: string;
  source: 'auto' | 'upload' | 'manual';
};

export type Contrato = {
  id: string;
  propiedadId: string;
  prospectoId: string;
  plantillaId: string;
  titulo: string;
  html: string;
  estado: Estado;
  createdAt: string;
  publicUrl?: string;
};

export type Propiedad = {
  id: string;
  titulo: string;
  direccion: string;
  ciudad: string;
  canon_mensual?: number;
  moneda?: string;
  dia_pago?: number;
};

export type Prospecto = {
  id: string;
  nombre: string;
  doc?: string;
  telefono?: string;
  email?: string;
};

export const MOCK_PLANTILLAS: Plantilla[] = [
  {
    id: 'plt-1',
    titulo: 'Contrato Arriendo Estándar',
    tipo: 'Arriendo',
    html: `<div style="font-family: 'Poppins', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
      <h1 style="text-align: center; margin-bottom: 30px;">CONTRATO DE ARRIENDO</h1>
      <p><strong>ARRENDADOR:</strong> {{empresa.nombre}}</p>
      <p><strong>ARRENDATARIO:</strong> {{prospecto.nombre}}, identificado con documento {{prospecto.doc}}</p>
      <p><strong>INMUEBLE:</strong> {{propiedad.direccion}}, {{propiedad.ciudad}}</p>
      <p><strong>CANON MENSUAL:</strong> {{propiedad.moneda}} {{propiedad.canon_mensual}}</p>
      <p><strong>DÍA DE PAGO:</strong> {{propiedad.dia_pago}} de cada mes</p>
      <p><strong>FECHA:</strong> {{fecha.hoy}}</p>
      <h2>CLÁUSULAS</h2>
      <p>El presente contrato se celebra entre las partes mencionadas para el arrendamiento del inmueble ubicado en {{propiedad.direccion}}...</p>
    </div>`,
    updatedAt: '2025-01-15',
    source: 'auto'
  },
  {
    id: 'plt-2',
    titulo: 'Contrato Compraventa Inmueble',
    tipo: 'Compra',
    html: `<div style="font-family: 'Poppins', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
      <h1 style="text-align: center; margin-bottom: 30px;">CONTRATO DE COMPRAVENTA</h1>
      <p><strong>VENDEDOR:</strong> {{empresa.nombre}}</p>
      <p><strong>COMPRADOR:</strong> {{prospecto.nombre}}, con email {{prospecto.email}}</p>
      <p><strong>INMUEBLE:</strong> {{propiedad.titulo}} - {{propiedad.direccion}}</p>
      <p><strong>PRECIO:</strong> {{propiedad.moneda}} {{propiedad.canon_mensual}}</p>
      <p><strong>FECHA:</strong> {{fecha.hoy}}</p>
      <h2>OBJETO DEL CONTRATO</h2>
      <p>El vendedor transfiere al comprador la propiedad del inmueble ubicado en {{propiedad.ciudad}}...</p>
    </div>`,
    updatedAt: '2025-01-20',
    source: 'auto'
  },
  {
    id: 'plt-3',
    titulo: 'Contrato Encargo Venta',
    tipo: 'Encargo',
    html: `<div style="font-family: 'Poppins', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
      <h1 style="text-align: center; margin-bottom: 30px;">CONTRATO DE ENCARGO DE VENTA</h1>
      <p><strong>INMOBILIARIA:</strong> {{empresa.nombre}}</p>
      <p><strong>PROPIETARIO:</strong> {{prospecto.nombre}}, teléfono {{prospecto.telefono}}</p>
      <p><strong>PROPIEDAD:</strong> {{propiedad.titulo}}</p>
      <p><strong>UBICACIÓN:</strong> {{propiedad.direccion}}, {{propiedad.ciudad}}</p>
      <p><strong>FECHA:</strong> {{fecha.hoy}}</p>
      <h2>OBJETO</h2>
      <p>El propietario encarga a {{empresa.nombre}} la gestión de venta de la propiedad mencionada...</p>
    </div>`,
    updatedAt: '2025-01-10',
    source: 'manual'
  },
  {
    id: 'plt-4',
    titulo: 'Anexo Modificación Contrato',
    tipo: 'Otro',
    html: `<div style="font-family: 'Poppins', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
      <h1 style="text-align: center; margin-bottom: 30px;">ANEXO MODIFICATORIO</h1>
      <p><strong>ENTRE:</strong> {{empresa.nombre}} y {{prospecto.nombre}}</p>
      <p><strong>PROPIEDAD:</strong> {{propiedad.direccion}}</p>
      <p><strong>FECHA:</strong> {{fecha.hoy}}</p>
      <h2>MODIFICACIONES</h2>
      <p>Las partes acuerdan modificar los siguientes aspectos del contrato original...</p>
    </div>`,
    updatedAt: '2024-12-28',
    source: 'auto'
  }
];

export const MOCK_CONTRATOS: Contrato[] = [];

export const MOCK_PROPIEDADES: Propiedad[] = [
  {
    id: 'prop-1',
    titulo: 'Apartamento Centro Histórico',
    direccion: 'Calle 10 #5-25',
    ciudad: 'Bogotá',
    canon_mensual: 2500000,
    moneda: 'COP',
    dia_pago: 5
  },
  {
    id: 'prop-2',
    titulo: 'Casa Campestre Norte',
    direccion: 'Km 3 Vía La Calera',
    ciudad: 'La Calera',
    canon_mensual: 4000000,
    moneda: 'COP',
    dia_pago: 1
  },
  {
    id: 'prop-3',
    titulo: 'Oficina Zona Rosa',
    direccion: 'Carrera 13 #85-40',
    ciudad: 'Bogotá',
    canon_mensual: 3200000,
    moneda: 'COP',
    dia_pago: 10
  },
  {
    id: 'prop-4',
    titulo: 'Apartaestudio Chapinero',
    direccion: 'Calle 63 #7-15',
    ciudad: 'Bogotá',
    canon_mensual: 1800000,
    moneda: 'COP',
    dia_pago: 15
  },
  {
    id: 'prop-5',
    titulo: 'Local Comercial Usaquén',
    direccion: 'Carrera 7 #116-30',
    ciudad: 'Bogotá',
    canon_mensual: 5500000,
    moneda: 'COP',
    dia_pago: 5
  }
];

export const MOCK_PROSPECTOS: Prospecto[] = [
  {
    id: 'pros-1',
    nombre: 'Carlos Rodríguez',
    doc: '1234567890',
    telefono: '573001234567',
    email: 'carlos.rodriguez@email.com'
  },
  {
    id: 'pros-2',
    nombre: 'María González',
    doc: '9876543210',
    telefono: '573109876543',
    email: 'maria.gonzalez@email.com'
  },
  {
    id: 'pros-3',
    nombre: 'Juan Martínez',
    doc: '5555555555',
    telefono: '573205555555',
    email: 'juan.martinez@email.com'
  },
  {
    id: 'pros-4',
    nombre: 'Ana López',
    doc: '7777777777',
    telefono: '573157777777',
    email: 'ana.lopez@email.com'
  },
  {
    id: 'pros-5',
    nombre: 'Pedro Sánchez',
    doc: '9999999999',
    telefono: '573009999999',
    email: 'pedro.sanchez@email.com'
  }
];
