import type { ActivityEvent } from '../types/activity';

const agents = ['OptimizOso', 'Oso Curioso', 'Oso Cauteloso', 'Oso Notarioso', 'Oso Cuidadoso'] as const;
const statuses = ['Completado', 'En proceso', 'Pendiente'] as const;

// Actividades específicas por cada oso
const activityByAgent: Record<typeof agents[number], string[]> = {
  'OptimizOso': [
    'Análisis de mercado actualizado - Recomendación de ajuste +8%',
    'Detectado precio competitivo en Providencia - Sugerencia de ajuste',
    'Análisis de vacancia: 3 propiedades optimizables detectadas',
    'Benchmark de precios completado - Informe disponible',
    'Oportunidad detectada: Propiedad Ñuñoa con potencial +12%',
    'Comparativa de mercado: Las Condes vs Vitacura actualizada',
    'Alertas de precio: 2 propiedades requieren revisión',
  ],
  'Oso Curioso': [
    'Nuevo prospecto interesado en Depto. Ñuñoa - Agendando visita',
    'WhatsApp enviado a lead "María González" - Dpto. Providencia',
    'Mensaje de bienvenida enviado a 3 nuevos contactos',
    'Interés detectado: Cliente consulta por Casa Las Condes',
    'Follow-up automático enviado - Cliente "Juan Pérez"',
    'Lead calificado: Carlos Rojas muestra alto interés',
    'Recordatorio de visita enviado - Depto. Vitacura 2D/2B',
    'Nuevo contacto desde portal web - Oficina Providencia',
    'Respuesta automática enviada - Consulta Parcela San Miguel',
    'Engagement alto: Cliente revisó propiedad 3 veces',
  ],
  'Oso Cauteloso': [
    'Evaluación de prospecto completada - Score: 8.5/10',
    'Verificación de ingresos: Documentos aprobados',
    'Análisis crediticio finalizado - Cliente "Ana Silva"',
    'Checklist de documentos: 3 de 5 completados',
    'Capacidad de pago verificada - Prospecto calificado',
    'Alerta: Documentos faltantes en expediente "Rodríguez"',
    'Validación de aval completada satisfactoriamente',
    'Historial crediticio revisado - Sin observaciones',
    'Score de riesgo calculado: Bajo riesgo',
    'Documentación completa - Cliente listo para contrato',
  ],
  'Oso Notarioso': [
    'Generando contrato de arriendo - Propiedad Ñuñoa',
    'Orden de visita creada - Depto. Las Condes',
    'Contrato enviado para firma digital - Cliente "López"',
    'Plantilla de contrato actualizada según nueva ley',
    'Documento de reserva generado - Oficina Providencia',
    'Adenda de contrato preparada - Modificación cláusula 5',
    'Certificado de dominio vigente solicitado',
    'Minutas preparadas para notaría - Venta terreno',
    'Borrador de contrato revisado por cliente',
    'Anexo de inventario agregado al contrato',
  ],
  'Oso Cuidadoso': [
    'Recordatorio de pago enviado - Arrendatario Depto. 302',
    'Cobranza conciliada con banco - Cliente "Martínez"',
    'Alerta: Pago pendiente hace 5 días - Casa Ñuñoa',
    'Confirmación de pago recibida - Local comercial',
    'Recordatorio preventivo enviado 5 días antes',
    'Seguimiento de mora iniciado - 3 días de atraso',
    'Estado de cuenta enviado al propietario',
    'Programación automática: 8 cobros para próxima semana',
    'Notificación de vencimiento: 2 arriendos mañana',
    'Comprobante de pago validado y archivado',
  ]
};

// Combinar todas las actividades para selección aleatoria general
const samples = Object.values(activityByAgent).flat();

export function startMockActivityStream(onMessage: (e: ActivityEvent) => void) {
  let alive = true;
  const tick = () => {
    if (!alive) return;
    
    // Seleccionar agente aleatorio
    const agent = agents[Math.floor(Math.random() * agents.length)];
    
    // Obtener actividades específicas de ese agente
    const agentActivities = activityByAgent[agent];
    const description = agentActivities[Math.floor(Math.random() * agentActivities.length)];
    
    const ev: ActivityEvent = {
      id: crypto.randomUUID(),
      agent,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      description,
      timestamp: new Date().toISOString(),
    };
    onMessage(ev);
    
    // Intervalo más frecuente: entre 1.5 y 4 segundos
    setTimeout(tick, 1500 + Math.random() * 2500);
  };
  
  const t = setTimeout(tick, 500);
  return () => { clearTimeout(t); alive = false; };
}
