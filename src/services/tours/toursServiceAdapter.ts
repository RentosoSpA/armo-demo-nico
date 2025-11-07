/**
 * Servicio adaptador para tours/visitas
 * Retorna datos de tours cuando preset es 'coworking'
 * Delega al servicio de visitas cuando preset es 'inmobiliaria'
 */

import { usePresetStore } from '../../store/presetStore';
import { getVisitas } from '../mock/visitasServiceMock';
import type { Visita } from '../../types/visita';
import type { Tour } from '../../presets/coworking/types/tour';

// Mock tours for coworking
const TOURS_MOCK: Tour[] = [
  {
    id: 'tour-001',
    espacio_id: 'esp-001',
    espacio_nombre: 'Oficina Privada 201',
    prospecto_id: 'prosp-001',
    prospecto_info: {
      id: 'prosp-001',
      nombre: 'María González',
      telefono: '+56912345678',
      email: 'maria.gonzalez@gmail.com',
    },
    fecha_inicio: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    hora_inicio: '10:00',
    hora_fin: '10:45',
    estado: 'Confirmado' as any,
    tipo: 'Presencial' as any,
    interes_en: 'Hot Desk',
    notas: 'Interesada en plan mensual',
  },
  {
    id: 'tour-002',
    espacio_id: 'esp-002',
    espacio_nombre: 'Sala Laurel',
    prospecto_id: 'prosp-002',
    prospecto_info: {
      id: 'prosp-002',
      nombre: 'Carlos Muñoz',
      telefono: '+56987654321',
      email: 'carlos.munoz@empresa.cl',
    },
    fecha_inicio: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    hora_inicio: '14:00',
    hora_fin: '15:00',
    estado: 'Agendado' as any,
    tipo: 'Presencial' as any,
    interes_en: 'Oficina Privada',
    notas: 'Tour programado para mañana',
  },
  {
    id: 'tour-003',
    espacio_id: 'esp-003',
    espacio_nombre: 'Hot Desk - Zona Norte',
    prospecto_id: 'prosp-003',
    prospecto_info: {
      id: 'prosp-003',
      nombre: 'Ana Torres',
      telefono: '+56911223344',
      email: 'ana.torres@freelance.com',
    },
    fecha_inicio: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    hora_inicio: '11:00',
    hora_fin: '11:30',
    estado: 'Completado' as any,
    tipo: 'Virtual' as any,
    plataforma: 'Zoom',
    interes_en: 'Escritorio Flexible',
  },
];

/**
 * Convierte un Tour a Visita para compatibilidad
 */
const tourToVisita = (tour: Tour): Visita => {
  return {
    id: tour.id,
    prospecto_id: tour.prospecto_id || '',
    propiedad_id: tour.espacio_id || '',
    propiedad: null as any, // No disponible en tour
    prospecto: null as any, // No disponible en tour
    agente_id: 'agente-cristobal',
    fecha_inicio: tour.fecha_inicio,
    fecha_fin: tour.fecha_fin,
    estado: tour.estado as any,
    plataforma: tour.plataforma,
    observaciones: tour.notas,
    propiedad_titulo: tour.espacio_nombre,
    prospecto_nombre: tour.prospecto_info?.nombre,
    prospecto_telefono: tour.prospecto_info?.telefono,
    prospecto_email: tour.prospecto_info?.email,
  } as Visita;
};

/**
 * Obtiene tours/visitas según el preset activo
 */
export const getTours = async (): Promise<Visita[]> => {
  const { activePreset } = usePresetStore.getState();
  
  if (activePreset === 'coworking') {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 400));
    return TOURS_MOCK.map(tourToVisita);
  }
  
  // Modo inmobiliaria: usar servicio real
  return getVisitas();
};
