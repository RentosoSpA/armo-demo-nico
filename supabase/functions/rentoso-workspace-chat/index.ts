import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ========================================
// 1. SISTEMA DE INTENTS EXTENDIDO
// ========================================
const WORKSPACE_INTENTS = {
  // CONSULTAS - PROPIEDADES
  'propiedades_listar': {
    keywords: ['propiedades', 'inmuebles', 'listar propiedades', 'ver propiedades', 'todas las propiedades'],
    description: 'Listar todas las propiedades disponibles'
  },
  'propiedades_filtrar': {
    keywords: ['buscar propiedad', 'filtrar', 'propiedades con', 'departamentos en', 'casas de'],
    description: 'Buscar propiedades con filtros específicos'
  },
  'propiedades_estadisticas': {
    keywords: ['cuántas propiedades', 'total propiedades', 'estadísticas propiedades'],
    description: 'Estadísticas agregadas de propiedades'
  },
  
  // CONSULTAS - OPORTUNIDADES
  'oportunidades_listar': {
    keywords: ['oportunidades', 'leads', 'clientes potenciales', 'ver oportunidades'],
    description: 'Listar oportunidades abiertas'
  },
  'oportunidades_etapa': {
    keywords: ['oportunidades en', 'leads en etapa', 'etapa de', 'fase de'],
    description: 'Filtrar oportunidades por etapa del funnel'
  },
  'oportunidades_agente': {
    keywords: ['mis oportunidades', 'oportunidades de', 'asignadas a'],
    description: 'Oportunidades de un agente específico'
  },
  
  // CONSULTAS - PROSPECTOS
  'prospectos_listar': {
    keywords: ['prospectos', 'contactos', 'clientes', 'ver prospectos'],
    description: 'Listar prospectos registrados'
  },
  'prospectos_buscar': {
    keywords: ['buscar prospecto', 'contacto llamado', 'prospecto con'],
    description: 'Buscar prospecto por nombre, email o teléfono'
  },
  
  // CONSULTAS - VISITAS
  'visitas_proximas': {
    keywords: ['visitas', 'agendadas', 'próximas visitas', 'visitas programadas'],
    description: 'Ver visitas agendadas'
  },
  'visitas_hoy': {
    keywords: ['visitas hoy', 'visitas de hoy', 'agenda de hoy'],
    description: 'Visitas específicas de hoy'
  },
  'visitas_propiedad': {
    keywords: ['visitas de', 'visitas para', 'visitas en'],
    description: 'Visitas de una propiedad específica'
  },
  
  // CONSULTAS - COBROS
  'cobros_pendientes': {
    keywords: ['cobros', 'por cobrar', 'pendientes de cobro', 'pagos pendientes'],
    description: 'Cobros pendientes de pago'
  },
  'cobros_atrasados': {
    keywords: ['cobros atrasados', 'morosos', 'vencidos', 'en mora'],
    description: 'Cobros vencidos no pagados'
  },
  'cobros_propiedad': {
    keywords: ['cobros de', 'pagos de', 'cobros propiedad'],
    description: 'Cobros de una propiedad específica'
  },
  
  // ANÁLISIS Y REPORTES
  'dashboard_resumen': {
    keywords: ['resumen', 'dashboard', 'métricas', 'panorama general', 'estado actual'],
    description: 'Resumen ejecutivo del workspace'
  },
  'reporte_propiedades': {
    keywords: ['reporte de propiedades', 'estadísticas propiedades', 'análisis propiedades'],
    description: 'Análisis detallado de propiedades'
  },
  'reporte_oportunidades': {
    keywords: ['reporte de oportunidades', 'funnel de ventas', 'conversión'],
    description: 'Análisis del funnel de oportunidades'
  },
  'reporte_financiero': {
    keywords: ['reporte financiero', 'estado de cobros', 'ingresos'],
    description: 'Análisis financiero de cobros'
  }
};

// ========================================
// 2. INTEGRACIÓN CON GEMINI API
// ========================================
async function analyzeMessageWithGemini(message: string, sessionContext: any) {
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY not configured');
    throw new Error('GEMINI_API_KEY not configured');
  }
  
  const intentsList = Object.entries(WORKSPACE_INTENTS)
    .map(([key, value]) => `- ${key}: ${value.description}`)
    .join('\n');
  
  const prompt = `
Eres un analizador de intenciones para un sistema de gestión inmobiliaria.

Contexto de la conversación:
${JSON.stringify(sessionContext, null, 2)}

Lista de intenciones disponibles:
${intentsList}

Mensaje del usuario: "${message}"

Analiza el mensaje y extrae:
1. Intent principal (debe ser EXACTAMENTE uno de los keys listados arriba)
2. Entidades y filtros relevantes (fechas, nombres, números, ubicaciones, estados, etapas, etc.)
3. Referencias implícitas a datos anteriores en la conversación
4. Nivel de confianza (0-1)

IMPORTANTE:
- Para fechas relativas: convierte "hoy", "mañana", "esta semana" a fechas ISO
- Para búsquedas: extrae términos clave y tipo de búsqueda
- Para filtros: identifica campos y valores exactos
- Si menciona "mis" o "mi", el contexto es del usuario actual

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown):
{
  "intent": "intent_exacto",
  "entities": {
    "tipo_propiedad": "Departamento",
    "comuna": "Las Condes",
    "habitaciones_min": 2,
    "precio_max": 150000000,
    "estado": "Disponible",
    "fecha_desde": "2025-10-22",
    "fecha_hasta": "2025-10-29",
    "etapa": "Negociacion",
    "agente_id": null,
    "prospecto_nombre": null,
    "propiedad_id": null
  },
  "confidence": 0.95,
  "implicitContext": ["referencia a búsqueda anterior", "usuario actual"],
  "needsClarification": false,
  "clarificationQuestion": null
}
`;

  try {
    console.log('Calling Gemini API for intent analysis...');
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 2048,
            responseMimeType: "application/json"
          }
        })
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    const analysisText = data.candidates[0].content.parts[0].text;
    console.log('Gemini analysis result:', analysisText);
    
    const analysis = JSON.parse(analysisText);
    return analysis;
  } catch (error) {
    console.error('Gemini analysis error:', error);
    return fallbackIntentDetection(message);
  }
}

// ========================================
// 3. QUERY BUILDER INTELIGENTE
// ========================================
function buildDatabaseQuery(intent: string, entities: any, userContext: any, supabase: any) {
  const { empresaId, userId } = userContext;
  
  let query;
  let tableName: string;
  
  console.log('Building query for intent:', intent, 'entities:', entities);
  
  switch (intent) {
    case 'propiedades_listar':
    case 'propiedades_filtrar':
    case 'propiedades_estadisticas':
      tableName = 'propiedades';
      query = supabase
        .from('propiedades')
        .select(`
          id, titulo, tipo, direccion, comuna, region,
          habitaciones, banos, superficie_total, superficie_util,
          precio_venta, precio_arriendo, divisa, estado,
          imagenPrincipal, created_at
        `)
        .eq('empresa_id', empresaId);
      
      if (entities.tipo_propiedad) {
        query = query.eq('tipo', entities.tipo_propiedad);
      }
      if (entities.comuna) {
        query = query.ilike('comuna', `%${entities.comuna}%`);
      }
      if (entities.habitaciones_min) {
        query = query.gte('habitaciones', entities.habitaciones_min);
      }
      if (entities.precio_max) {
        query = query.lte('precio_venta', entities.precio_max);
      }
      if (entities.estado) {
        query = query.eq('estado', entities.estado);
      }
      
      query = query.order('created_at', { ascending: false }).limit(20);
      break;
    
    case 'oportunidades_listar':
    case 'oportunidades_etapa':
    case 'oportunidades_agente':
      tableName = 'oportunidades';
      query = supabase
        .from('oportunidades')
        .select(`
          id, tipo_oportunidad, etapa_oportunidad, fecha_inicio,
          fecha_ultima_actualizacion, monto_estimado, divisa, status,
          prospecto_id, propiedad_id, agente_id
        `)
        .eq('empresa_id', empresaId)
        .eq('status', 'Open');
      
      if (entities.etapa) {
        query = query.eq('etapa_oportunidad', entities.etapa);
      }
      if (entities.agente_id || intent === 'oportunidades_agente') {
        const targetAgentId = entities.agente_id || userId;
        query = query.eq('agente_id', targetAgentId);
      }
      
      query = query.order('fecha_ultima_actualizacion', { ascending: false }).limit(20);
      break;
    
    case 'visitas_proximas':
    case 'visitas_hoy':
    case 'visitas_propiedad':
      tableName = 'visitas';
      const today = new Date().toISOString();
      
      query = supabase
        .from('visitas')
        .select(`
          id, fecha_inicio, fecha_fin, estado, tipo_visita,
          observaciones, created_at, propiedad_id, prospecto_id
        `)
        .eq('empresa_id', empresaId)
        .gte('fecha_inicio', entities.fecha_desde || today);
      
      if (intent === 'visitas_hoy') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        query = query.lt('fecha_inicio', tomorrow.toISOString());
      }
      
      if (entities.propiedad_id) {
        query = query.eq('propiedad_id', entities.propiedad_id);
      }
      
      query = query.order('fecha_inicio', { ascending: true }).limit(20);
      break;
    
    case 'cobros_pendientes':
    case 'cobros_atrasados':
    case 'cobros_propiedad':
      tableName = 'cobros';
      query = supabase
        .from('cobros')
        .select(`
          id, monto, divisa, fecha_vencimiento, fecha_pago,
          estado, concepto, created_at, propiedad_id, cliente_id
        `)
        .eq('empresa_id', empresaId);
      
      if (intent === 'cobros_pendientes') {
        query = query.in('estado', ['Por cobrar', 'Cobrado parcialmente']);
      }
      
      if (intent === 'cobros_atrasados') {
        const today = new Date().toISOString().split('T')[0];
        query = query
          .lt('fecha_vencimiento', today)
          .neq('estado', 'Pagado');
      }
      
      if (entities.propiedad_id) {
        query = query.eq('propiedad_id', entities.propiedad_id);
      }
      
      query = query.order('fecha_vencimiento', { ascending: true }).limit(20);
      break;
    
    case 'dashboard_resumen':
      return { tableName: 'dashboard', query: null };
    
    default:
      console.log('No query builder for intent:', intent);
      return null;
  }
  
  return { query, tableName };
}

// ========================================
// 4. GENERACIÓN DE RESPUESTAS CON GEMINI
// ========================================
async function generateResponseWithGemini(
  intent: string,
  queryResults: any,
  entities: any,
  sessionContext: any
) {
  const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY not configured');
    throw new Error('GEMINI_API_KEY not configured');
  }
  
  const prompt = `
Eres Rentoso, un asistente virtual experto en gestión inmobiliaria de Chile.

Contexto:
- Intent detectado: ${intent}
- Filtros aplicados: ${JSON.stringify(entities)}
- Resultados encontrados: ${queryResults?.length || 0}
- Conversación previa: ${JSON.stringify(sessionContext.lastMessages || [])}

Datos obtenidos:
${JSON.stringify(queryResults, null, 2)}

Genera una respuesta natural en español de Chile que:
1. Confirme cuántos resultados se encontraron
2. Resuma las características o datos más relevantes
3. Ofrezca insights útiles si aplica (tendencias, alertas, etc.)
4. Sugiera acciones siguientes que el usuario podría querer realizar
5. Use formato amigable con emojis cuando sea apropiado

Respuesta debe ser concisa (máximo 200 palabras), profesional pero cercana.
Si no hay resultados, ofrece alternativas o sugerencias.

RESPONDE SOLO EL TEXTO DE LA RESPUESTA (sin JSON, sin markdown):
`;

  try {
    console.log('Calling Gemini API for response generation...');
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
          }
        })
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    console.log('Gemini response generated successfully');
    
    return responseText.trim();
  } catch (error) {
    console.error('Gemini response generation error:', error);
    return `Encontré ${queryResults?.length || 0} resultado(s) para tu consulta.`;
  }
}

// ========================================
// 5. DASHBOARD RESUMEN
// ========================================
async function getDashboardResumen(empresaId: string, supabase: any) {
  console.log('Getting dashboard resumen for empresa:', empresaId);
  
  const [propiedadesResult, oportunidadesResult, visitasResult, cobrosResult] = await Promise.all([
    supabase.from('propiedades').select('id, estado', { count: 'exact' }).eq('empresa_id', empresaId),
    supabase.from('oportunidades').select('id, etapa_oportunidad, status', { count: 'exact' }).eq('empresa_id', empresaId).eq('status', 'Open'),
    supabase.from('visitas').select('id, estado', { count: 'exact' }).eq('empresa_id', empresaId).gte('fecha_inicio', new Date().toISOString()),
    supabase.from('cobros').select('id, estado, monto', { count: 'exact' }).eq('empresa_id', empresaId).in('estado', ['Por cobrar', 'Cobrado parcialmente'])
  ]);
  
  const propiedades = propiedadesResult.data || [];
  const oportunidades = oportunidadesResult.data || [];
  const visitas = visitasResult.data || [];
  const cobros = cobrosResult.data || [];
  
  const resumen = {
    propiedades: {
      total: propiedades.length,
      disponibles: propiedades.filter((p: any) => p.estado === 'Disponible').length,
      vendidas: propiedades.filter((p: any) => p.estado === 'Vendida').length
    },
    oportunidades: {
      total: oportunidades.length,
      por_etapa: {
        Exploracion: oportunidades.filter((o: any) => o.etapa_oportunidad === 'Exploracion').length,
        Evaluacion: oportunidades.filter((o: any) => o.etapa_oportunidad === 'Evaluacion').length,
        Negociacion: oportunidades.filter((o: any) => o.etapa_oportunidad === 'Negociacion').length,
        Cierre: oportunidades.filter((o: any) => o.etapa_oportunidad === 'Cierre').length
      }
    },
    visitas: {
      total: visitas.length,
      confirmadas: visitas.filter((v: any) => v.estado === 'Confirmada').length,
      pendientes: visitas.filter((v: any) => v.estado === 'Pendiente').length
    },
    cobros: {
      pendientes: cobros.length,
      monto_total: cobros.reduce((sum: number, c: any) => sum + (c.monto || 0), 0)
    }
  };
  
  return resumen;
}

// ========================================
// 6. SISTEMA DE SESIONES
// ========================================
interface WorkspaceSession {
  sessionId: string;
  userId: string;
  empresaId: string;
  context: {
    lastMessages: Array<{ role: string; content: string }>;
    lastIntent: string;
    lastEntities: any;
    filters: any;
  };
  lastActivity: number;
}

const sessions = new Map<string, WorkspaceSession>();
const SESSION_TTL = 30 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActivity > SESSION_TTL) {
      sessions.delete(sessionId);
      console.log('Session expired:', sessionId);
    }
  }
}, 5 * 60 * 1000);

// ========================================
// 7. HANDLER PRINCIPAL
// ========================================
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, sessionId, context } = await req.json();
    
    console.log('Received message:', message, 'sessionId:', sessionId);
    
    if (!message || !sessionId) {
      throw new Error('Message and sessionId are required');
    }
    
    const authHeader = req.headers.get('authorization');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader! } }
    });
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('Unauthorized: no user found');
      throw new Error('Unauthorized');
    }
    
    console.log('User authenticated:', user.id);
    
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('empresa_id, role')
      .eq('user_id', user.id)
      .single();
    
    if (!userRole) {
      console.error('User role not found for user:', user.id);
      throw new Error('User role not found');
    }
    
    console.log('User role:', userRole.role, 'empresa:', userRole.empresa_id);
    
    const userContext = {
      userId: user.id,
      empresaId: userRole.empresa_id,
      role: userRole.role
    };
    
    let session = sessions.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        userId: user.id,
        empresaId: userRole.empresa_id,
        context: {
          lastMessages: [],
          lastIntent: '',
          lastEntities: {},
          filters: {}
        },
        lastActivity: Date.now()
      };
      sessions.set(sessionId, session);
      console.log('New session created:', sessionId);
    }
    session.lastActivity = Date.now();
    
    session.context.lastMessages.push({ role: 'user', content: message });
    if (session.context.lastMessages.length > 10) {
      session.context.lastMessages = session.context.lastMessages.slice(-10);
    }
    
    const analysis = await analyzeMessageWithGemini(message, session.context);
    const { intent, entities, confidence } = analysis;
    
    console.log('Intent detected:', intent, 'Confidence:', confidence);
    console.log('Entities extracted:', entities);
    
    session.context.lastIntent = intent;
    session.context.lastEntities = entities;
    
    let response: any = {
      intent,
      entities,
      confidence,
      reply: '',
      dataType: null,
      dataResults: null,
      actions: []
    };
    
    if (intent === 'dashboard_resumen') {
      const resumenData = await getDashboardResumen(userContext.empresaId, supabase);
      response.reply = await generateResponseWithGemini(intent, resumenData, entities, session.context);
      response.dataType = 'dashboard';
      response.dataResults = resumenData;
      response.actions = ['ver_detalles'];
    } else {
      const queryInfo = buildDatabaseQuery(intent, entities, userContext, supabase);
      
      if (queryInfo) {
        const { query, tableName } = queryInfo;
        const { data, error } = await query;
        
        if (error) {
          console.error('Database query error:', error);
          response.reply = 'Hubo un error al consultar los datos. Por favor intenta nuevamente.';
        } else {
          console.log('Query results:', data?.length || 0, 'rows');
          response.reply = await generateResponseWithGemini(intent, data, entities, session.context);
          response.dataType = tableName;
          response.dataResults = data;
          response.actions = suggestActions(tableName, data);
        }
      } else {
        response.reply = await generateResponseWithGemini(intent, null, entities, session.context);
      }
    }
    
    session.context.lastMessages.push({ role: 'assistant', content: response.reply });
    
    console.log('Response generated successfully');
    
    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        reply: 'Lo siento, ocurrió un error procesando tu mensaje.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// ========================================
// 8. HELPERS
// ========================================
function suggestActions(tableName: string, data: any[]): string[] {
  if (!data || data.length === 0) return [];
  
  const actions: string[] = [];
  
  switch (tableName) {
    case 'propiedades':
      actions.push('ver_detalles', 'exportar_excel');
      if (data.length > 1) actions.push('comparar');
      break;
    case 'oportunidades':
      actions.push('ver_detalles', 'actualizar_etapa');
      break;
    case 'visitas':
      actions.push('ver_detalles', 'cancelar');
      break;
    case 'cobros':
      actions.push('ver_detalles', 'registrar_pago');
      break;
  }
  
  return actions;
}

function fallbackIntentDetection(message: string): any {
  const lowerMessage = message.toLowerCase();
  
  for (const [intent, config] of Object.entries(WORKSPACE_INTENTS)) {
    if (config.keywords.some((kw: string) => lowerMessage.includes(kw))) {
      console.log('Fallback intent detected:', intent);
      return {
        intent,
        entities: {},
        confidence: 0.6,
        implicitContext: [],
        needsClarification: false
      };
    }
  }
  
  console.log('No intent matched, using general_inquiry');
  return {
    intent: 'general_inquiry',
    entities: {},
    confidence: 0.5,
    implicitContext: [],
    needsClarification: true
  };
}
