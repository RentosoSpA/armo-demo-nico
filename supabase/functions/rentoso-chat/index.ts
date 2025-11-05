import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// In-memory sessions store (TTL: 30 minutes)
const sessions = new Map<string, { context: any; lastActivity: number }>();
const SESSION_TTL = 30 * 60 * 1000; // 30 minutes

// Clean up expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastActivity > SESSION_TTL) {
      sessions.delete(sessionId);
      console.log('Session expired:', sessionId);
    }
  }
}, 5 * 60 * 1000);

// Intent detection keywords
const INTENTS = {
  property_register: ['subir', 'publicar', 'cargar', 'registrar', 'poner', 'agregar', 'añadir', 'ingresar'],
  show_visits: ['mostrame', 'agendadas', 'ver', 'tengo', 'confirmadas', 'próximas', 'visitas', 'visita'],
  cancel_visit: ['cancela', 'cancelar', 'elimina', 'borra', 'borrar'],
  show_report: ['reporte', 'resumen', 'rendimiento', 'enviame', 'crea', 'genera', 'informe'],
  general_inquiry: ['hola', 'ayuda', 'qué', 'cómo', 'puedes', 'gracias']
};

function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  for (const [intent, keywords] of Object.entries(INTENTS)) {
    if (keywords.some(kw => lowerMessage.includes(kw))) {
      return intent;
    }
  }
  
  return 'general_inquiry';
}

function extractEntities(message: string): any {
  const lowerMessage = message.toLowerCase();
  const entities: any = {};

  // Extraer tipo de propiedad
  const propertyTypes: { [key: string]: string } = {
    'departamento': 'Departamento',
    'depto': 'Departamento',
    'casa': 'Casa',
    'oficina': 'Oficina',
    'ph': 'PH',
    'terreno': 'Terreno'
  };
  for (const [keyword, type] of Object.entries(propertyTypes)) {
    if (lowerMessage.includes(keyword)) {
      entities.tipo = type;
      break;
    }
  }

  // Extraer habitaciones
  const bedroomMatch = message.match(/(\d+)\s*(dormitorio|habitacion|pieza)/i);
  if (bedroomMatch) {
    entities.habitaciones = parseInt(bedroomMatch[1]);
  }

  // Extraer baños
  const bathroomMatch = message.match(/(\d+)\s*(baño|bano)/i);
  if (bathroomMatch) {
    entities.banos = parseInt(bathroomMatch[1]);
  }

  // Extraer precios (flexible: 700k, $700000, 700.000, etc)
  const priceMatches = message.match(/\$?\s*(\d{1,3}(?:[.,]\d{3})*(?:[kK])?|\d+[kK])/g);
  if (priceMatches) {
    const prices = priceMatches.map(p => {
      let value = p.replace(/[$\s.,]/g, '');
      if (value.toLowerCase().endsWith('k')) {
        value = value.slice(0, -1) + '000';
      }
      return parseInt(value);
    });
    
    if (lowerMessage.includes('arriendo') || lowerMessage.includes('alquiler')) {
      entities.precio_arriendo = prices[0];
    } else if (lowerMessage.includes('venta')) {
      entities.precio_venta = prices[0];
    } else {
      entities.precio_arriendo = prices[0];
      if (prices.length > 1) {
        entities.precio_venta = prices[1];
      }
    }
  }

  // Detectar amenidades
  const amenidades: { [key: string]: string } = {
    'mascota': 'permite_mascotas',
    'amoblado': 'amoblado',
    'estacionamiento': 'estacionamiento',
    'piscina': 'piscina',
    'gimnasio': 'gimnasio'
  };
  entities.amenidades = {};
  for (const [keyword, field] of Object.entries(amenidades)) {
    if (lowerMessage.includes(keyword)) {
      entities.amenidades[field] = true;
    }
  }

  // Extraer dirección (básico)
  const addressMatch = message.match(/(?:en|ubicado|ubicada|dirección)\s+([^,\.]+)/i);
  if (addressMatch) {
    entities.direccion = addressMatch[1].trim();
  }

  // Extraer comuna y región (básico)
  const comunaMatch = message.match(/(?:comuna|en)\s+([\w\s]+?)(?:,|\.|$)/i);
  if (comunaMatch) {
    entities.comuna = comunaMatch[1].trim();
  }

  // Detectar fechas relativas
  const today = new Date();
  if (lowerMessage.includes('hoy')) {
    entities.fecha = today.toISOString().split('T')[0];
  } else if (lowerMessage.includes('mañana')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    entities.fecha = tomorrow.toISOString().split('T')[0];
  }

  return entities;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, sessionId } = await req.json();
    
    if (!message || !sessionId) {
      throw new Error('Message and sessionId are required');
    }

    console.log('Processing message:', message, 'Session:', sessionId);

    // Get or create session
    let session = sessions.get(sessionId);
    if (!session) {
      session = { context: {}, lastActivity: Date.now() };
      sessions.set(sessionId, session);
      console.log('New session created:', sessionId);
    }
    session.lastActivity = Date.now();

    // Detect intent
    const intent = detectIntent(message);
    console.log('Detected intent:', intent);

    // Extract entities
    const entities = extractEntities(message);
    console.log('Extracted entities:', entities);

    // Merge entities into session context
    session.context = { ...session.context, ...entities };

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let response: any = {
      intent,
      entities,
      reply: ''
    };

    switch (intent) {
      case 'property_register':
        response.reply = 'Perfecto, voy a ayudarte a cargar la propiedad. ';
        
        if (!entities.tipo) {
          response.reply += '¿Qué tipo de propiedad es? (departamento, casa, oficina, etc.)';
          response.needsInfo = 'tipo';
        } else if (!entities.direccion) {
          response.reply += '¿Cuál es la dirección exacta?';
          response.needsInfo = 'direccion';
        } else if (!entities.comuna) {
          response.reply += '¿En qué comuna está ubicada?';
          response.needsInfo = 'comuna';
        } else if (!entities.habitaciones) {
          response.reply += '¿Cuántos dormitorios tiene?';
          response.needsInfo = 'habitaciones';
        } else if (!entities.banos) {
          response.reply += '¿Cuántos baños tiene?';
          response.needsInfo = 'banos';
        } else if (!entities.precio_arriendo && !entities.precio_venta) {
          response.reply += '¿Cuál es el precio? (arriendo y/o venta)';
          response.needsInfo = 'precio';
        } else {
          // All required info collected
          response.reply = 'Excelente, tengo toda la información de la propiedad. Ahora necesito algunos datos del propietario y las fotos de la propiedad.';
          response.readyForConfirmation = true;
          response.propertyData = session.context;
        }
        break;

      case 'show_visits':
        try {
          const { data: visitas, error } = await supabase
            .from('visitas')
            .select(`
              id,
              fecha_inicio,
              fecha_fin,
              estado,
              tipo_visita,
              observaciones,
              propiedad:propiedad_id(titulo, direccion),
              prospecto:prospecto_id(display_name, phone_e164)
            `)
            .gte('fecha_inicio', entities.fecha || new Date().toISOString())
            .order('fecha_inicio', { ascending: true })
            .limit(10);

          if (error) throw error;

          response.visits = visitas || [];
          response.reply = visitas && visitas.length > 0
            ? `Encontré ${visitas.length} visita(s) agendada(s):`
            : 'No hay visitas agendadas para las próximas fechas.';
        } catch (error) {
          console.error('Error fetching visits:', error);
          response.reply = 'Hubo un error al consultar las visitas. Por favor intenta nuevamente.';
        }
        break;

      case 'cancel_visit':
        response.reply = 'Para cancelar una visita, necesito que me indiques el ID o la fecha de la visita que deseas cancelar.';
        response.needsInfo = 'visit_id';
        break;

      case 'show_report':
        response.reply = 'La funcionalidad de reportes estará disponible próximamente. ¿Hay algo más en lo que pueda ayudarte?';
        break;

      case 'general_inquiry':
      default:
        response.reply = 'Hola! Soy Rentoso, tu asistente virtual. Puedo ayudarte a:\n\n' +
          '• Cargar nuevas propiedades\n' +
          '• Ver visitas agendadas\n' +
          '• Consultar información\n\n' +
          '¿En qué puedo ayudarte hoy?';
        break;
    }

    console.log('Response:', response);

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
        reply: 'Lo siento, ocurrió un error procesando tu mensaje. Por favor intenta nuevamente.'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
