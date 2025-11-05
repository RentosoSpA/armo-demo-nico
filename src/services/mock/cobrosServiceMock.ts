import type { Cobro, CobroCreate, CobroStats } from '../../types/cobro';
import { EstadoCobro } from '../../types/cobro';
import { simulateDelay, generateId, MOCK_DATA } from './mockData';

// Nombres de clientes ficticios para las propiedades arrendadas
const MOCK_CLIENTES = [
  { nombre: 'María González Pérez', telefono: '+56 9 9123 4567', email: 'maria.gonzalez@email.cl' },
  { nombre: 'Carlos Rodríguez Silva', telefono: '+56 9 8765 4321', email: 'carlos.rodriguez@email.cl' },
  { nombre: 'Ana Patricia López', telefono: '+56 9 7654 3210', email: 'ana.lopez@email.cl' },
  { nombre: 'Javier Morales Castro', telefono: '+56 9 6543 2109', email: 'javier.morales@email.cl' },
  { nombre: 'Sofía Martínez Rojas', telefono: '+56 9 5432 1098', email: 'sofia.martinez@email.cl' },
  { nombre: 'Roberto Valdés Torres', telefono: '+56 9 4321 0987', email: 'roberto.valdes@email.cl' },
  { nombre: 'Claudia Pérez Muñoz', telefono: '+56 9 3210 9876', email: 'claudia.perez@email.cl' },
  { nombre: 'Diego Fuentes Soto', telefono: '+56 9 2109 8765', email: 'diego.fuentes@email.cl' },
  { nombre: 'Inmobiliaria Centro SA', telefono: '+56 2 2345 6789', email: 'contacto@inmocentro.cl' },
  { nombre: 'Corporación Edificios SpA', telefono: '+56 2 2876 5432', email: 'admin@corpedificios.cl' },
];

// Generar cobros desde propiedades arrendadas
const generateCobrosFromPropiedades = (): Cobro[] => {
  const propiedadesArrendadas = MOCK_DATA.propiedades.filter(
    p => p.arriendo === true && p.venta === false && p.propiedadArriendo
  );

  return propiedadesArrendadas.map((prop, index) => {
    const cliente = MOCK_CLIENTES[index % MOCK_CLIENTES.length];
    const propiedadArriendo = prop.propiedadArriendo!;
    
    // Generar estados realistas: 60% Por cobrar, 20% Pagado, 15% Atrasado, 5% Cobrado parcialmente
    const random = Math.random();
    let estado: EstadoCobro;
    let fechaPago: Date | undefined;
    let montoAbonado: number | undefined;
    
    if (random < 0.60) {
      estado = EstadoCobro.PorCobrar;
    } else if (random < 0.80) {
      estado = EstadoCobro.Pagado;
      fechaPago = new Date(2025, 9, Math.floor(Math.random() * 20) + 1); // Entre 1-20 de octubre
    } else if (random < 0.95) {
      estado = EstadoCobro.Atrasado;
    } else {
      estado = EstadoCobro.CobradoParcialmente;
      montoAbonado = Math.floor(propiedadArriendo.precioPrincipal * 0.6);
    }

    // Fechas de vencimiento realistas para octubre-noviembre 2025
    const daysOffset = Math.floor(index * (60 / propiedadesArrendadas.length));
    const fechaVencimiento = new Date(2025, 9, 5 + daysOffset); // Octubre 5 en adelante

    return {
      id: `cobro-${prop.id}`,
      propiedad: {
        id: prop.id,
        titulo: prop.titulo,
        direccion: `${prop.nombreCalle} ${prop.numeroCalle}${prop.unidad ? `, ${prop.unidad}` : ''}, ${prop.comuna}`,
        imagenUrl: prop.imagenPrincipal || undefined,
      },
      cliente: {
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        email: cliente.email,
      },
      estado,
      monto: propiedadArriendo.precioPrincipal,
      divisa: propiedadArriendo.divisa,
      fechaVencimiento,
      fechaPago,
      montoAbonado,
      observaciones: estado === EstadoCobro.Atrasado 
        ? 'Cliente con historial de pagos atrasados. CuriOso recomienda seguimiento.' 
        : undefined,
    };
  });
};

// Mock data para cobros generados desde propiedades
const mockCobros: Cobro[] = generateCobrosFromPropiedades();

export const getCobrosByEmpresa = async (_empresaId: string): Promise<Cobro[]> => {
  await simulateDelay();
  return mockCobros;
};

export const getCobroById = async (id: string): Promise<Cobro> => {
  await simulateDelay();
  const cobro = mockCobros.find(c => c.id === id);
  if (!cobro) {
    throw new Error(`Cobro with id ${id} not found`);
  }
  return cobro;
};

export const createCobro = async (cobro: CobroCreate): Promise<Cobro> => {
  await simulateDelay();
  const newCobro: Cobro = {
    id: generateId(),
    propiedad: {
      id: cobro.propiedadId,
      titulo: 'Nueva Propiedad',
      direccion: 'Dirección por definir',
    },
    cliente: {
      nombre: 'Cliente por definir',
      telefono: '+57 300 000 0000',
      email: 'cliente@example.com'
    },
    estado: EstadoCobro.PorCobrar,
    monto: cobro.monto,
    divisa: 'COP',
    fechaVencimiento: cobro.fechaVencimiento,
    observaciones: cobro.observaciones,
  };
  mockCobros.push(newCobro);
  return newCobro;
};

export const updateCobro = async (id: string, updates: Partial<Cobro>): Promise<Cobro> => {
  await simulateDelay();
  const index = mockCobros.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error(`Cobro with id ${id} not found`);
  }
  mockCobros[index] = { ...mockCobros[index], ...updates };
  return mockCobros[index];
};

export const getCobrosStats = async (_empresaId: string): Promise<CobroStats> => {
  await simulateDelay();
  const pendientes = mockCobros.filter(c => c.estado === EstadoCobro.PorCobrar).length;
  const atrasados = mockCobros.filter(c => c.estado === EstadoCobro.Atrasado).length;
  const cobrados = mockCobros.filter(c => c.estado === EstadoCobro.Pagado).length;
  const totalMonto = mockCobros.reduce((sum, c) => sum + c.monto, 0);

  return {
    pendientesCobrar: pendientes,
    atrasados: atrasados,
    cobradosExito: cobrados,
    totalMonto: totalMonto,
  };
};