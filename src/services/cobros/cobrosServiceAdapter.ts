/**
 * Servicio adaptador para cobros
 * Retorna cobros de coworking cuando preset es 'coworking'
 * Delega al servicio inmobiliario cuando preset es 'inmobiliaria'
 */

import { usePresetStore } from '../../store/presetStore';
import { 
  getCobrosByEmpresa as getCobrosByEmpresaInmobiliaria,
  getCobrosStats as getCobrosStatsInmobiliaria,
  updateCobro as updateCobroInmobiliaria
} from '../mock/cobrosServiceMock';
import type { Cobro, CobroStats, EstadoCobro } from '../../types/cobro';

/**
 * Genera cobros de ejemplo para coworking
 */
const generateCobrosCoworking = (): Cobro[] => {
  return [
    // Membresía Hot Desk - Pagada
    {
      id: 'cobro-hotdesk-001',
      propiedad: {
        id: 'esp-002',
        titulo: 'Hot Desk Mensual - Sofía Martínez',
        direccion: 'Zona Norte, Piso 1',
      },
      cliente: {
        nombre: 'Sofía Martínez',
        telefono: '+56 9 8765 4321',
        email: 'sofia.martinez@email.cl'
      },
      estado: 'Pagado' as EstadoCobro,
      monto: 120000,
      divisa: 'CLP',
      fechaVencimiento: new Date(2025, 10, 5),
      fechaPago: new Date(2025, 10, 3),
    },
    
    // Oficina Privada - Por Cobrar
    {
      id: 'cobro-oficina-001',
      propiedad: {
        id: 'esp-001',
        titulo: 'Oficina Privada 201 - Tech Startup',
        direccion: 'Ala Norte, Piso 2',
      },
      cliente: {
        nombre: 'Tech Startup SpA',
        telefono: '+56 9 3456 7890',
        email: 'contacto@techstartup.cl'
      },
      estado: 'Por cobrar' as EstadoCobro,
      monto: 450000,
      divisa: 'CLP',
      fechaVencimiento: new Date(2025, 11, 1),
    },
    
    // Reserva Sala Laurel - Por Cobrar
    {
      id: 'cobro-sala-001',
      propiedad: {
        id: 'esp-004',
        titulo: 'Sala Laurel - Evento Corporativo',
        direccion: 'Sector Central, Piso 1',
      },
      cliente: {
        nombre: 'Corporación ABC',
        telefono: '+56 2 2345 6789',
        email: 'eventos@corpabc.cl'
      },
      estado: 'Por cobrar' as EstadoCobro,
      monto: 180000, // 4 horas * $45k
      divisa: 'CLP',
      fechaVencimiento: new Date(2025, 10, 15),
      observaciones: 'Reserva: 4 horas + coffee break'
    },
    
    // Oficina Virtual - Atrasado
    {
      id: 'cobro-virtual-001',
      propiedad: {
        id: 'esp-006',
        titulo: 'Oficina Virtual - Consultora ABC',
        direccion: 'Servicio digital',
      },
      cliente: {
        nombre: 'Consultora ABC Ltda',
        telefono: '+56 9 4567 8901',
        email: 'info@consultoraabc.cl'
      },
      estado: 'Atrasado' as EstadoCobro,
      monto: 75000,
      divisa: 'CLP',
      fechaVencimiento: new Date(2025, 9, 28), // Hace 3 días
      observaciones: 'Cliente contactado. Confirma pago para esta semana.'
    },
    
    // Escritorio Flexible - Pagado
    {
      id: 'cobro-flex-001',
      propiedad: {
        id: 'esp-003',
        titulo: 'Escritorio Flexible 12 días - Juan Pérez',
        direccion: 'Zona Flexible',
      },
      cliente: {
        nombre: 'Juan Pérez',
        telefono: '+56 9 2345 6789',
        email: 'juan.perez@email.cl'
      },
      estado: 'Pagado' as EstadoCobro,
      monto: 120000,
      divisa: 'CLP',
      fechaVencimiento: new Date(2025, 10, 10),
      fechaPago: new Date(2025, 10, 8),
    },
    
    // Reserva Sala Reunión - Pagado parcialmente
    {
      id: 'cobro-sala-002',
      propiedad: {
        id: 'esp-004',
        titulo: 'Sala Reunión - Workshop Consultora XYZ',
        direccion: 'Sala 15 personas',
      },
      cliente: {
        nombre: 'Consultora XYZ',
        telefono: '+56 9 8765 1234',
        email: 'contacto@xyz.cl'
      },
      estado: 'Cobrado parcialmente' as EstadoCobro,
      monto: 120000, // 4 horas * $30k
      divisa: 'CLP',
      fechaVencimiento: new Date(2025, 10, 20),
      montoAbonado: 60000,
      observaciones: 'Abonó $60k, saldo pendiente $60k'
    },
  ];
};

/**
 * Genera estadísticas de cobros para coworking
 */
const generateCobrosStatsCoworking = (cobros: Cobro[]): CobroStats => {
  const pendientes = cobros.filter(c => c.estado === 'Por cobrar' || c.estado === 'Cobrado parcialmente');
  const atrasados = cobros.filter(c => c.estado === 'Atrasado');
  const pagados = cobros.filter(c => c.estado === 'Pagado');
  
  const totalMonto = cobros.reduce((sum, c) => sum + c.monto, 0);
  
  return {
    pendientesCobrar: pendientes.length,
    atrasados: atrasados.length,
    cobradosExito: pagados.length,
    totalMonto
  };
};

/**
 * Obtiene cobros según el preset activo
 */
export const getCobrosByEmpresa = async (empresaId: string): Promise<Cobro[]> => {
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 400));
    return generateCobrosCoworking();
  }
  
  // Modo inmobiliaria
  return getCobrosByEmpresaInmobiliaria(empresaId);
};

/**
 * Obtiene estadísticas de cobros según el preset activo
 */
export const getCobrosStats = async (empresaId: string): Promise<CobroStats> => {
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    await new Promise(resolve => setTimeout(resolve, 300));
    const cobros = generateCobrosCoworking();
    return generateCobrosStatsCoworking(cobros);
  }
  
  return getCobrosStatsInmobiliaria(empresaId);
};

/**
 * Actualiza un cobro
 */
export const updateCobro = async (
  cobroId: string, 
  updates: Partial<Cobro>
): Promise<Cobro> => {
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    await new Promise(resolve => setTimeout(resolve, 300));
    // En modo coworking, simulamos la actualización
    const cobros = generateCobrosCoworking();
    const cobro = cobros.find(c => c.id === cobroId);
    if (!cobro) throw new Error('Cobro no encontrado');
    return { ...cobro, ...updates };
  }
  
  return updateCobroInmobiliaria(cobroId, updates);
};
