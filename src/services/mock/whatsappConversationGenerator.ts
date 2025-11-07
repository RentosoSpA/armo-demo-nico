import type { WhatsAppMessage, LeadProfile } from '../../types/whatsapp-chat';
import { 
  SALUDOS, 
  PREGUNTAS_PRECIO, 
  PREGUNTAS_DISPONIBILIDAD, 
  PREGUNTAS_VISITA,
  PREGUNTAS_CARACTERISTICAS,
  RESPUESTAS_CURIOSO,
  EXPRESIONES_CHILENAS 
} from './conversationTemplates';
import { 
  PREGUNTAS_COWORK, 
  RESPUESTAS_CURIOSO_COWORK 
} from '../../presets/coworking/mocks/conversationTemplatesCowork';
import { usePresetStore } from '../../store/presetStore';

// Tiempos de respuesta según personalidad (en segundos)
const PERSONALITY_TIMING = {
  formal: { min: 15, max: 45 },
  casual: { min: 8, max: 25 },
  coloquial: { min: 5, max: 15 },
  apurado: { min: 2, max: 8 },
  detallista: { min: 20, max: 60 }
};

const NOMBRES_MASCULINOS = [
  'Mateo', 'Sebastián', 'Diego', 'Lucas', 'Nicolás', 
  'Martín', 'Benjamín', 'Gabriel', 'Tomás', 'Santiago'
];

const NOMBRES_FEMENINOS = [
  'Sofía', 'Valentina', 'Isabella', 'Catalina', 'Emilia',
  'Martina', 'Florencia', 'Josefa', 'Isidora', 'Amanda'
];

const APELLIDOS = [
  'González', 'Rodríguez', 'Pérez', 'López', 'Martínez',
  'García', 'Hernández', 'Silva', 'Muñoz', 'Rojas'
];

function getRandomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Aplica el estilo de escritura consistente del lead a un texto
 * Orden crítico: signos → typos → mayúsculas → expresiones
 */
export function applyConsistentWriting(text: string, lead: LeadProfile): string {
  let result = text;
  
  // 1. Remover signos de puntuación si no los usa
  if (!lead.writingProfile.usesSignos) {
    result = result.replace(/[¿?¡!]/g, '');
  }
  
  // 2. Aplicar typos FIJOS del lead
  Object.entries(lead.writingProfile.fixedTypos).forEach(([correct, typo]) => {
    const regex = new RegExp(`\\b${correct}\\b`, 'gi');
    result = result.replace(regex, typo);
  });
  
  // 3. Remover mayúsculas si no las usa
  if (!lead.writingProfile.usesMayusculas) {
    result = result.toLowerCase();
  }
  
  // 4. Agregar expresiones chilenas al final si las usa
  if (lead.writingProfile.expresionesChilenas.length > 0 && Math.random() > 0.6) {
    const expresion = getRandomFromArray(lead.writingProfile.expresionesChilenas);
    // Solo agregar si no está ya en el texto
    if (!result.toLowerCase().includes(expresion.toLowerCase())) {
      result = `${result} ${expresion}`;
    }
  }
  
  return result.trim();
}

/**
 * Adapta las respuestas de CuriOso al tono del lead
 * Si el lead es formal → CuriOso formal
 * Si el lead es coloquial → CuriOso casual pero profesional
 */
function generateCuriosoResponse(
  templateType: keyof typeof RESPUESTAS_CURIOSO,
  lead: LeadProfile,
  data?: Record<string, string>
): string {
  const { activePreset } = usePresetStore.getState();
  
  // Usar plantillas de coworking si el preset es coworking
  let templates: string[] = RESPUESTAS_CURIOSO[templateType];
  
  if (activePreset === 'coworking') {
    const coworkTemplates = (RESPUESTAS_CURIOSO_COWORK as any)[templateType];
    if (Array.isArray(coworkTemplates)) {
      templates = coworkTemplates;
    }
  }
  
  let response: string = getRandomFromArray(templates);
  
  // Reemplazar variables
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      response = response.replace(`{${key}}`, value);
    });
  }
  
  // Adaptar tono según personalidad del lead
  switch (lead.personality) {
    case 'formal':
    case 'detallista':
      // Remover emojis, usar lenguaje más formal
      response = response.replace(/[🐻💰✅🚗🐕📅]/g, '').trim();
      response = response.replace('!', '.');
      response = response.replace('Genial', 'Perfecto');
      break;
      
    case 'casual':
      // Mantener emojis pero reducir exclamaciones
      response = response.replace(/!!/g, '!');
      break;
      
    case 'coloquial':
      // Mantener casual pero no copiar coloquialismos del lead
      break;
      
    case 'apurado':
      // Respuestas más cortas y directas
      response = response.split('.')[0]; // Solo primera oración
      response = response.replace(/[🐻💰✅🚗🐕📅]/g, '').trim();
      break;
  }
  
  return response;
}

/**
 * Genera un nombre realista
 */
function generateRealisticName(esFemenino: boolean): string {
  const nombre = esFemenino 
    ? getRandomFromArray(NOMBRES_FEMENINOS)
    : getRandomFromArray(NOMBRES_MASCULINOS);
  
  // 70% incluye apellido
  if (Math.random() > 0.3) {
    const apellido = getRandomFromArray(APELLIDOS);
    return `${nombre} ${apellido}`;
  }
  
  return nombre;
}

/**
 * Formatea la respuesta del nombre según personalidad
 */
function generateNameResponse(realName: string, lead: LeadProfile): string {
  let response = '';
  
  switch (lead.personality) {
    case 'formal':
      response = `Mi nombre es ${realName}`;
      break;
    case 'casual':
      response = Math.random() > 0.5 ? `Soy ${realName}` : `Mi nombre es ${realName}`;
      break;
    case 'coloquial':
      response = Math.random() > 0.5 ? `soy ${realName}` : `${realName}`;
      break;
    case 'apurado':
      response = realName;
      break;
    case 'detallista':
      response = `Mi nombre completo es ${realName}`;
      break;
  }
  
  return applyConsistentWriting(response, lead);
}

// ==================== BLOQUES CONVERSACIONALES ====================

interface ConversationBlock {
  messages: WhatsAppMessage[];
  lastTimestamp: Date;
}

/**
 * Bloque: Saludo inicial
 */
function createSaludoBlock(
  lead: LeadProfile,
  chatId: string,
  startTime: Date
): ConversationBlock {
  const messages: WhatsAppMessage[] = [];
  let currentTime = new Date(startTime);
  
  // Lead saluda
  const saludoTemplate = getRandomFromArray(SALUDOS[lead.personality]);
  const saludo = applyConsistentWriting(saludoTemplate, lead);
  
  messages.push({
    id: `${chatId}_msg_${Date.now()}_${Math.random()}`,
    chatId,
    sender: 'lead',
    content: saludo,
    timestamp: currentTime.toISOString(),
    read: true,
    status: 'read'
  });
  
  // CuriOso responde pidiendo nombre (adaptado al tono)
  currentTime = new Date(currentTime.getTime() + (5 + Math.random() * 5) * 1000);
  
  let curiosoGreeting = '';
  if (lead.personality === 'formal' || lead.personality === 'detallista') {
    curiosoGreeting = '¡Hola! Soy CuriOso 🐻, tu asistente virtual. ¿Cuál es tu nombre?';
  } else if (lead.personality === 'apurado') {
    curiosoGreeting = 'Hola! Soy CuriOso 🐻. ¿Tu nombre?';
  } else {
    curiosoGreeting = '¡Hola! Soy CuriOso 🐻. ¿Cómo te llamas?';
  }
  
  messages.push({
    id: `${chatId}_msg_${Date.now()}_${Math.random()}`,
    chatId,
    sender: 'curioso',
    content: curiosoGreeting,
    timestamp: currentTime.toISOString(),
    read: true,
    status: 'read'
  });
  
  return { messages, lastTimestamp: currentTime };
}

/**
 * Bloque: Lead da su nombre
 */
function createNameBlock(
  lead: LeadProfile,
  chatId: string,
  realName: string,
  startTime: Date
): ConversationBlock {
  const messages: WhatsAppMessage[] = [];
  
  const timing = PERSONALITY_TIMING[lead.personality];
  const delay = (timing.min + Math.random() * (timing.max - timing.min)) * 1000;
  const currentTime = new Date(startTime.getTime() + delay);
  
  const nameResponse = generateNameResponse(realName, lead);
  
  messages.push({
    id: `${chatId}_msg_${Date.now()}_${Math.random()}`,
    chatId,
    sender: 'lead',
    content: nameResponse,
    timestamp: currentTime.toISOString(),
    read: true,
    status: 'read'
  });
  
  return { messages, lastTimestamp: currentTime };
}

/**
 * Bloque: CuriOso saluda por nombre y ofrece ayuda
 */
function createCuriosoWelcomeBlock(
  lead: LeadProfile,
  chatId: string,
  realName: string,
  startTime: Date
): ConversationBlock {
  const messages: WhatsAppMessage[] = [];
  const currentTime = new Date(startTime.getTime() + (3 + Math.random() * 4) * 1000);
  
  const firstName = realName.split(' ')[0];
  const greeting = generateCuriosoResponse('saludo', lead, { nombre: firstName });
  
  messages.push({
    id: `${chatId}_msg_${Date.now()}_${Math.random()}`,
    chatId,
    sender: 'curioso',
    content: greeting,
    timestamp: currentTime.toISOString(),
    read: true,
    status: 'read'
  });
  
  return { messages, lastTimestamp: currentTime };
}

/**
 * Bloque: Pregunta sobre precio/planes
 */
function createPrecioBlock(
  lead: LeadProfile,
  chatId: string,
  propiedad: any,
  startTime: Date
): ConversationBlock {
  const messages: WhatsAppMessage[] = [];
  let currentTime = startTime;
  const { activePreset } = usePresetStore.getState();
  
  // Lead pregunta
  const timing = PERSONALITY_TIMING[lead.personality];
  const delay = (timing.min + Math.random() * (timing.max - timing.min)) * 1000;
  currentTime = new Date(currentTime.getTime() + delay);
  
  // Usar preguntas de coworking o inmobiliaria según preset
  let preguntasSource: string[];
  if (activePreset === 'coworking' && PREGUNTAS_COWORK.planes) {
    preguntasSource = PREGUNTAS_COWORK.planes[lead.personality];
  } else {
    preguntasSource = PREGUNTAS_PRECIO[lead.personality];
  }
  
  const preguntaTemplate = getRandomFromArray(preguntasSource);
  const pregunta = applyConsistentWriting(preguntaTemplate, lead);
  
  messages.push({
    id: `${chatId}_msg_${Date.now()}_${Math.random()}`,
    chatId,
    sender: 'lead',
    content: pregunta,
    timestamp: currentTime.toISOString(),
    read: true,
    status: 'read'
  });
  
  // CuriOso responde
  currentTime = new Date(currentTime.getTime() + (4 + Math.random() * 4) * 1000);
  
  const precio = propiedad.precio?.toLocaleString('es-CL') || '450000';
  const gastos = Math.floor(parseInt(precio.replace(/\./g, '')) * 0.08).toLocaleString('es-CL');
  
  const respuesta = generateCuriosoResponse('precio', lead, { precio, gastos });
  
  messages.push({
    id: `${chatId}_msg_${Date.now()}_${Math.random()}`,
    chatId,
    sender: 'curioso',
    content: respuesta,
    timestamp: currentTime.toISOString(),
    read: true,
    status: 'read'
  });
  
  return { messages, lastTimestamp: currentTime };
}

/**
 * Bloque: Pregunta sobre disponibilidad
 */
function createDisponibilidadBlock(
  lead: LeadProfile,
  chatId: string,
  startTime: Date
): ConversationBlock {
  const messages: WhatsAppMessage[] = [];
  let currentTime = startTime;
  
  const timing = PERSONALITY_TIMING[lead.personality];
  const delay = (timing.min + Math.random() * (timing.max - timing.min)) * 1000;
  currentTime = new Date(currentTime.getTime() + delay);
  
  const preguntaTemplate = getRandomFromArray(PREGUNTAS_DISPONIBILIDAD[lead.personality]);
  const pregunta = applyConsistentWriting(preguntaTemplate, lead);
  
  messages.push({
    id: `${chatId}_msg_${Date.now()}_${Math.random()}`,
    chatId,
    sender: 'lead',
    content: pregunta,
    timestamp: currentTime.toISOString(),
    read: true,
    status: 'read'
  });
  
  currentTime = new Date(currentTime.getTime() + (3 + Math.random() * 3) * 1000);
  const respuesta = generateCuriosoResponse('disponible_si', lead);
  
  messages.push({
    id: `${chatId}_msg_${Date.now()}_${Math.random()}`,
    chatId,
    sender: 'curioso',
    content: respuesta,
    timestamp: currentTime.toISOString(),
    read: true,
    status: 'read'
  });
  
  return { messages, lastTimestamp: currentTime };
}

/**
 * Bloque: Pregunta sobre característica específica o amenidades
 */
function createCaracteristicaBlock(
  lead: LeadProfile,
  chatId: string,
  tipo: 'estacionamiento' | 'bodega' | 'mascotas' | 'amoblado',
  startTime: Date
): ConversationBlock {
  const messages: WhatsAppMessage[] = [];
  let currentTime = startTime;
  const { activePreset } = usePresetStore.getState();
  
  const timing = PERSONALITY_TIMING[lead.personality];
  const delay = (timing.min + Math.random() * (timing.max - timing.min)) * 1000;
  currentTime = new Date(currentTime.getTime() + delay);
  
  // Usar preguntas de coworking o inmobiliaria
  let preguntasSource: string[];
  if (activePreset === 'coworking') {
    // Para coworking, combinar amenidades y flexibilidad según personalidad
    const amenidadesPreguntas = PREGUNTAS_COWORK.amenidades?.[lead.personality] || [];
    const flexibilidadPreguntas = PREGUNTAS_COWORK.flexibilidad?.[lead.personality] || [];
    const todasPreguntas = [...amenidadesPreguntas, ...flexibilidadPreguntas];
    preguntasSource = todasPreguntas.length > 0 ? todasPreguntas : PREGUNTAS_CARACTERISTICAS[tipo];
  } else {
    preguntasSource = PREGUNTAS_CARACTERISTICAS[tipo];
  }
  
  const preguntaTemplate = getRandomFromArray(preguntasSource);
  const pregunta = applyConsistentWriting(preguntaTemplate, lead);
  
  messages.push({
    id: `${chatId}_msg_${Date.now()}_${Math.random()}`,
    chatId,
    sender: 'lead',
    content: pregunta,
    timestamp: currentTime.toISOString(),
    read: true,
    status: 'read'
  });
  
  currentTime = new Date(currentTime.getTime() + (3 + Math.random() * 3) * 1000);
  
  let respuestaKey: keyof typeof RESPUESTAS_CURIOSO;
  if (tipo === 'estacionamiento') respuestaKey = 'estacionamiento_si';
  else if (tipo === 'mascotas') respuestaKey = 'mascotas_si';
  else respuestaKey = 'disponible_si'; // Fallback genérico
  
  const respuesta = generateCuriosoResponse(respuestaKey, lead);
  
  messages.push({
    id: `${chatId}_msg_${Date.now()}_${Math.random()}`,
    chatId,
    sender: 'curioso',
    content: respuesta,
    timestamp: currentTime.toISOString(),
    read: true,
    status: 'read'
  });
  
  return { messages, lastTimestamp: currentTime };
}

/**
 * Bloque: Coordinar visita
 */
function createVisitaBlock(
  lead: LeadProfile,
  chatId: string,
  startTime: Date
): ConversationBlock {
  const messages: WhatsAppMessage[] = [];
  let currentTime = startTime;
  
  const timing = PERSONALITY_TIMING[lead.personality];
  const delay = (timing.min + Math.random() * (timing.max - timing.min)) * 1000;
  currentTime = new Date(currentTime.getTime() + delay);
  
  const preguntaTemplate = getRandomFromArray(PREGUNTAS_VISITA[lead.personality]);
  const pregunta = applyConsistentWriting(preguntaTemplate, lead);
  
  messages.push({
    id: `${chatId}_msg_${Date.now()}_${Math.random()}`,
    chatId,
    sender: 'lead',
    content: pregunta,
    timestamp: currentTime.toISOString(),
    read: true,
    status: 'read'
  });
  
  currentTime = new Date(currentTime.getTime() + (4 + Math.random() * 4) * 1000);
  const respuesta = generateCuriosoResponse('coordinar_visita', lead);
  
  messages.push({
    id: `${chatId}_msg_${Date.now()}_${Math.random()}`,
    chatId,
    sender: 'curioso',
    content: respuesta,
    timestamp: currentTime.toISOString(),
    read: true,
    status: 'read'
  });
  
  return { messages, lastTimestamp: currentTime };
}

/**
 * Bloque: Solicitar documentos (solo si journeyStage >= docs_solicitados)
 */
function createDocsBlock(
  lead: LeadProfile,
  chatId: string,
  startTime: Date
): ConversationBlock {
  const messages: WhatsAppMessage[] = [];
  let currentTime = startTime;
  
  currentTime = new Date(currentTime.getTime() + (5 + Math.random() * 5) * 1000);
  
  let solicitud = '';
  if (lead.personality === 'formal' || lead.personality === 'detallista') {
    solicitud = 'Para avanzar con tu postulación, necesitaría que me envíes: liquidaciones de sueldo, contrato de trabajo y certificado de AFP.';
  } else if (lead.personality === 'apurado') {
    solicitud = 'Necesito: liquidaciones, contrato, certificado AFP';
  } else {
    solicitud = 'Para seguir, necesito que me mandes: liquidaciones de sueldo, contrato de trabajo y certificado de AFP';
  }
  
  messages.push({
    id: `${chatId}_msg_${Date.now()}_${Math.random()}`,
    chatId,
    sender: 'curioso',
    content: solicitud,
    timestamp: currentTime.toISOString(),
    read: true,
    status: 'read'
  });
  
  // Lead responde
  const timing = PERSONALITY_TIMING[lead.personality];
  const delay = (timing.min + Math.random() * (timing.max - timing.min)) * 1000;
  currentTime = new Date(currentTime.getTime() + delay);
  
  let respuestaLead = '';
  if (lead.personality === 'formal') {
    respuestaLead = 'Perfecto, los enviaré a la brevedad';
  } else if (lead.personality === 'apurado') {
    respuestaLead = 'ok';
  } else {
    respuestaLead = 'Dale, los mando';
  }
  
  const respuestaFinal = applyConsistentWriting(respuestaLead, lead);
  
  messages.push({
    id: `${chatId}_msg_${Date.now()}_${Math.random()}`,
    chatId,
    sender: 'lead',
    content: respuestaFinal,
    timestamp: currentTime.toISOString(),
    read: true,
    status: 'read'
  });
  
  return { messages, lastTimestamp: currentTime };
}

// ==================== GENERADOR PRINCIPAL ====================

/**
 * Genera una conversación completa con flujo variable según personalidad
 */
export function generateConversation(
  lead: LeadProfile,
  chatId: string,
  propiedad: any
): { messages: WhatsAppMessage[]; extractedName: string } {
  const allMessages: WhatsAppMessage[] = [];
  const esFemenino = Math.random() > 0.5;
  const realName = generateRealisticName(esFemenino);
  
  const ahora = new Date();
  const horasAtras = Math.floor(Math.random() * 48) + 1;
  let currentTime = new Date(ahora.getTime() - horasAtras * 60 * 60 * 1000);
  
  // 1. SIEMPRE: Saludo inicial
  const saludoBlock = createSaludoBlock(lead, chatId, currentTime);
  allMessages.push(...saludoBlock.messages);
  currentTime = saludoBlock.lastTimestamp;
  
  // 2. SIEMPRE: Lead da su nombre
  const nameBlock = createNameBlock(lead, chatId, realName, currentTime);
  allMessages.push(...nameBlock.messages);
  currentTime = nameBlock.lastTimestamp;
  
  // 3. SIEMPRE: CuriOso saluda por nombre
  const welcomeBlock = createCuriosoWelcomeBlock(lead, chatId, realName, currentTime);
  allMessages.push(...welcomeBlock.messages);
  currentTime = welcomeBlock.lastTimestamp;
  
  // 4. Flujo variable según personalidad
  const bloquesPosibles = ['precio', 'disponibilidad', 'caracteristica', 'visita'];
  const caracteristicasPosibles: Array<'estacionamiento' | 'bodega' | 'mascotas' | 'amoblado'> = 
    ['estacionamiento', 'bodega', 'mascotas', 'amoblado'];
  
  // Determinar cuántos bloques hacer según personalidad
  let numBloques = 2;
  if (lead.personality === 'detallista') numBloques = 4;
  else if (lead.personality === 'apurado') numBloques = 1;
  else numBloques = Math.floor(Math.random() * 2) + 2; // 2-3
  
  // Shuffle y seleccionar bloques
  const bloquesSeleccionados = [...bloquesPosibles]
    .sort(() => Math.random() - 0.5)
    .slice(0, numBloques);
  
  // Ejecutar bloques seleccionados
  for (const bloque of bloquesSeleccionados) {
    if (bloque === 'precio') {
      const block = createPrecioBlock(lead, chatId, propiedad, currentTime);
      allMessages.push(...block.messages);
      currentTime = block.lastTimestamp;
    } else if (bloque === 'disponibilidad') {
      const block = createDisponibilidadBlock(lead, chatId, currentTime);
      allMessages.push(...block.messages);
      currentTime = block.lastTimestamp;
    } else if (bloque === 'caracteristica') {
      const tipo = getRandomFromArray(caracteristicasPosibles);
      const block = createCaracteristicaBlock(lead, chatId, tipo, currentTime);
      allMessages.push(...block.messages);
      currentTime = block.lastTimestamp;
    } else if (bloque === 'visita') {
      const block = createVisitaBlock(lead, chatId, currentTime);
      allMessages.push(...block.messages);
      currentTime = block.lastTimestamp;
    }
  }
  
  // 5. Solicitar documentos (si corresponde según journeyStage)
  if (lead.journeyStage === 'docs_solicitados' || 
      lead.journeyStage === 'docs_enviados' || 
      lead.journeyStage === 'evaluado') {
    const docsBlock = createDocsBlock(lead, chatId, currentTime);
    allMessages.push(...docsBlock.messages);
    currentTime = docsBlock.lastTimestamp;
  }
  
  // 6. Si está evaluado, agregar mensaje de resultado
  if (lead.journeyStage === 'evaluado' && lead.scoring) {
    currentTime = new Date(currentTime.getTime() + (10 + Math.random() * 10) * 1000);
    
    const aprobado = lead.scoring.total >= 75;
    let mensaje = '';
    
    if (aprobado) {
      if (lead.personality === 'formal' || lead.personality === 'detallista') {
        mensaje = `Excelente noticia! Tu evaluación fue aprobada con un ${lead.scoring.total}% de match. Procederemos con los siguientes pasos.`;
      } else {
        mensaje = `¡Buenas noticias! Aprobaste con ${lead.scoring.total}% de match 🎉`;
      }
    } else {
      if (lead.personality === 'formal' || lead.personality === 'detallista') {
        mensaje = `Lamentablemente tu evaluación obtuvo un ${lead.scoring.total}% de match, lo cual no cumple con los requisitos mínimos.`;
      } else {
        mensaje = `Lo siento, tu evaluación fue de ${lead.scoring.total}%, no alcanza el mínimo requerido.`;
      }
    }
    
    allMessages.push({
      id: `${chatId}_msg_${Date.now()}_${Math.random()}`,
      chatId,
      sender: 'curioso',
      content: mensaje,
      timestamp: currentTime.toISOString(),
      read: true,
      status: 'read'
    });
  }
  
  return {
    messages: allMessages,
    extractedName: realName
  };
}
