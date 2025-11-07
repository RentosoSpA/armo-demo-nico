export const DASHBOARD_COWORK_MOCK = {
  kpis: {
    espacios_disponibles: 12,
    espacios_ocupados: 8,
    total_espacios: 20,
    miembros_activos: 42,
    tours_mes: 18,
    tours_semana: 8,
    mrr: 5250000, // Monthly Recurring Revenue en CLP
    tasa_ocupacion: 65, // Porcentaje
    ingresos_adicionales: 450000, // Salas, impresión, etc.
  },
  
  ocupacion_por_tipo: [
    { tipo: 'Oficinas Privadas', ocupados: 3, disponibles: 2, total: 5 },
    { tipo: 'Hot Desk', ocupados: 15, disponibles: 5, total: 20 },
    { tipo: 'Escritorio Flexible', ocupados: 8, disponibles: 12, total: 20 },
    { tipo: 'Oficina Virtual', ocupados: 6, disponibles: 4, total: 10 },
  ],
  
  ingresos_mensuales: [
    { mes: 'Jul', ingresos: 4200000 },
    { mes: 'Ago', ingresos: 4500000 },
    { mes: 'Sep', ingresos: 4800000 },
    { mes: 'Oct', ingresos: 5000000 },
    { mes: 'Nov', ingresos: 5100000 },
    { mes: 'Dic', ingresos: 5250000 },
    { mes: 'Ene', ingresos: 5250000 },
  ],
  
  tours_vs_conversiones: [
    { etapa: 'Leads', cantidad: 120 },
    { etapa: 'Tours Agendados', cantidad: 80 },
    { etapa: 'Tours Completados', cantidad: 65 },
    { etapa: 'Evaluación', cantidad: 35 },
    { etapa: 'Conversiones', cantidad: 18 },
  ],
  
  uso_salas: [
    { sala: 'Sala Laurel', horas_usadas: 45, capacidad_mensual: 160 },
    { sala: 'Sala Reunión 1', horas_usadas: 78, capacidad_mensual: 160 },
    { sala: 'Sala Reunión 2', horas_usadas: 65, capacidad_mensual: 160 },
    { sala: 'Sala Reunión 3', horas_usadas: 52, capacidad_mensual: 160 },
    { sala: 'Sala Streaming', horas_usadas: 28, capacidad_mensual: 100 },
  ],
  
  nuevos_miembros_mes: [
    { mes: 'Jul', nuevos: 5 },
    { mes: 'Ago', nuevos: 7 },
    { mes: 'Sep', nuevos: 6 },
    { mes: 'Oct', nuevos: 8 },
    { mes: 'Nov', nuevos: 4 },
    { mes: 'Dic', nuevos: 6 },
    { mes: 'Ene', nuevos: 8 },
  ],
  
  actividad_reciente: [
    {
      id: '1',
      tipo: 'tour_completado',
      titulo: 'Tour completado - María González',
      descripcion: 'Interesada en Hot Desk mensual',
      timestamp: '2025-01-31T14:30:00Z'
    },
    {
      id: '2',
      tipo: 'nueva_membresia',
      titulo: 'Nueva membresía - Tech Startup SpA',
      descripcion: 'Oficina Privada 201 por 6 meses',
      timestamp: '2025-01-31T10:15:00Z'
    },
    {
      id: '3',
      tipo: 'renovacion',
      titulo: 'Renovación pendiente - Juan Pérez',
      descripcion: 'Escritorio Flexible 12 días vence en 15 días',
      timestamp: '2025-01-30T16:00:00Z'
    },
    {
      id: '4',
      tipo: 'tour_agendado',
      titulo: 'Tour agendado - Carlos Muñoz',
      descripcion: 'Tour presencial programado para mañana 10:00',
      timestamp: '2025-01-30T11:20:00Z'
    },
    {
      id: '5',
      tipo: 'reserva_sala',
      titulo: 'Reserva Sala Laurel',
      descripcion: 'Evento de 50 personas - 5 Feb, 18:00-21:00',
      timestamp: '2025-01-29T15:45:00Z'
    }
  ]
};
