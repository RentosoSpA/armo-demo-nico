import type { LeadProfile, ChatStatus } from '../../types/whatsapp-chat';

const NOMBRES_MASCULINOS = [
  'Mateo', 'Sebastián', 'Diego', 'Lucas', 'Nicolás', 
  'Martín', 'Benjamín', 'Gabriel', 'Tomás', 'Santiago',
  'Felipe', 'Maximiliano', 'Joaquín', 'Agustín', 'Vicente'
];

const NOMBRES_FEMENINOS = [
  'Sofía', 'Valentina', 'Isabella', 'Catalina', 'Emilia',
  'Martina', 'Florencia', 'Josefa', 'Isidora', 'Amanda',
  'Antonia', 'Fernanda', 'Camila', 'Francisca', 'Constanza'
];

const APELLIDOS = [
  'González', 'Rodríguez', 'Pérez', 'López', 'Martínez',
  'García', 'Hernández', 'Silva', 'Muñoz', 'Rojas',
  'Díaz', 'Torres', 'Vargas', 'Castro', 'Sepúlveda',
  'Morales', 'Figueroa', 'Reyes', 'Contreras', 'Vásquez'
];

const PERSONALIDADES: Array<'formal' | 'casual' | 'coloquial' | 'apurado' | 'detallista'> = [
  'formal', 'formal', // 20%
  'casual', 'casual', 'casual', // 30%
  'coloquial', 'coloquial', 'coloquial', // 25%
  'apurado', 'apurado', // 15%
  'detallista' // 10%
];

export function generateLeadName(esFemenino: boolean): string {
  const nombre = esFemenino 
    ? NOMBRES_FEMENINOS[Math.floor(Math.random() * NOMBRES_FEMENINOS.length)]
    : NOMBRES_MASCULINOS[Math.floor(Math.random() * NOMBRES_MASCULINOS.length)];
  
  const apellido1 = APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)];
  const apellido2 = Math.random() > 0.5 
    ? ' ' + APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)]
    : '';
  
  return `${nombre} ${apellido1}${apellido2}`;
}

export function generatePhoneNumber(): string {
  const numero = Math.floor(Math.random() * 90000000) + 10000000;
  return `+569${numero}`;
}

export function generateEmail(nombre: string): string {
  const nombreSinEspacios = nombre.toLowerCase().replace(/ /g, '.');
  const dominios = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
  const dominio = dominios[Math.floor(Math.random() * dominios.length)];
  return `${nombreSinEspacios}@${dominio}`;
}

export function getRandomPersonality(): 'formal' | 'casual' | 'coloquial' | 'apurado' | 'detallista' {
  return PERSONALIDADES[Math.floor(Math.random() * PERSONALIDADES.length)];
}

export function generateLeadJourney(): {
  journeyStage: LeadProfile['journeyStage'];
  status: ChatStatus;
  matchPercentage?: number;
  scoring?: any;
} {
  const rand = Math.random();
  
  // 30% inicial (sin evaluación)
  if (rand < 0.30) {
    return {
      journeyStage: 'inicial',
      status: 'activo'
    };
  }
  
  // 25% docs solicitados (sin evaluación)
  if (rand < 0.55) {
    return {
      journeyStage: 'docs_solicitados',
      status: 'en_espera'
    };
  }
  
  // 20% docs enviados (sin evaluación aún)
  if (rand < 0.75) {
    return {
      journeyStage: 'docs_enviados',
      status: 'en_espera'
    };
  }
  
  // 25% evaluado (CON match score)
  const aprobado = Math.random() > 0.2; // 80% aprobados, 20% rechazados
  const ingresos = aprobado ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 30) + 40;
  const documentos = aprobado ? Math.floor(Math.random() * 30) + 70 : Math.floor(Math.random() * 30) + 40;
  const total = Math.floor((ingresos + documentos) / 2);
  
  return {
    journeyStage: 'evaluado',
    status: total >= 75 ? 'aceptado' : 'rechazado',
    matchPercentage: total >= 75 ? Math.floor(Math.random() * 26) + 70 : Math.floor(Math.random() * 20) + 45,
    scoring: { ingresos, documentos, total }
  };
}

export function generateWritingProfile(
  personality: LeadProfile['personality']
): LeadProfile['writingProfile'] {
  let typoLevel = 0;
  let usesMayusculas = true;
  let usesSignos = true;
  let expresionesChilenas: string[] = [];
  
  switch (personality) {
    case 'formal':
      typoLevel = 0;
      usesMayusculas = true;
      usesSignos = true;
      expresionesChilenas = [];
      break;
      
    case 'casual':
      typoLevel = Math.random() > 0.7 ? 1 : 0;
      usesMayusculas = Math.random() > 0.5;
      usesSignos = Math.random() > 0.3;
      expresionesChilenas = Math.random() > 0.6 ? ['bacán', 'piola', 'cachai'] : [];
      break;
      
    case 'coloquial':
      typoLevel = 2;
      usesMayusculas = false;
      usesSignos = false;
      expresionesChilenas = ['bakn', 'weno', 'toy', 'pa', 'po', 'cachai', 'ta bien'];
      break;
      
    case 'apurado':
      typoLevel = 1;
      usesMayusculas = false;
      usesSignos = false;
      expresionesChilenas = [];
      break;
      
    case 'detallista':
      typoLevel = 0;
      usesMayusculas = true;
      usesSignos = true;
      expresionesChilenas = [];
      break;
  }
  
  // Generar typos fijos que SIEMPRE usará este lead
  const fixedTypos: Record<string, string> = {};
  if (typoLevel > 0) {
    const availableTypos: [string, string][] = [
      ['hola', 'ola'],
      ['cuando', 'cuadno'],
      ['esta', 'sta'],
      ['está', 'ta'],
      ['para', 'pa'],
      ['que', 'q'],
      ['porque', 'xq'],
      ['por que', 'xq'],
      ['propiedad', 'proeidad'],
      ['disponible', 'disponibe'],
      ['interesa', 'interza'],
      ['puede', 'pued'],
      ['cuanto', 'cuanto'],
      ['precio', 'precio'],
      ['bueno', 'weno'],
      ['estoy', 'toy'],
      ['cachai', 'cahai'],
      ['bacán', 'bakn'],
      ['bien', 'bn'],
      ['también', 'tmbn'],
      ['verdad', 'vdd'],
      ['visita', 'bicita'],
      ['arriendo', 'ariendo'],
      ['departamento', 'depto'],
      ['estacionamiento', 'estacionaminto'],
      ['incluye', 'inclulle'],
      ['tiene', 'tien'],
      ['quiero', 'quiro'],
      ['puedo', 'pueo'],
      ['saber', 'saber'],
      ['información', 'info']
    ];
    
    const numTypos = typoLevel === 1 ? 4 : 10;
    const shuffled = [...availableTypos].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < numTypos && i < shuffled.length; i++) {
      const [correct, typo] = shuffled[i];
      fixedTypos[correct] = typo;
    }
  }
  
  return {
    typoLevel,
    fixedTypos,
    usesMayusculas,
    usesSignos,
    expresionesChilenas
  };
}

export function generateLeadForProperty(propiedadId: string): LeadProfile {
  const telefono = generatePhoneNumber();
  const personality = getRandomPersonality();
  const journeyData = generateLeadJourney();
  const writingProfile = generateWritingProfile(personality);
  
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Inicialmente el nombre es temporal (se actualiza con el nombre extraído de la conversación)
  const nombre = "Lead Temporal";
  
  return {
    id: leadId,
    nombre,
    nombreReal: undefined,
    telefono,
    email: undefined, // Se generará después con el nombre real
    propiedadInteres: propiedadId,
    personality,
    writingProfile,
    ...journeyData
  };
}

export function generateLeadsForProperty(propiedadId: string, count?: number): LeadProfile[] {
  const numLeads = count || Math.floor(Math.random() * 6) + 2; // 2-7 leads
  const leads: LeadProfile[] = [];
  
  for (let i = 0; i < numLeads; i++) {
    leads.push(generateLeadForProperty(propiedadId));
  }
  
  return leads;
}
