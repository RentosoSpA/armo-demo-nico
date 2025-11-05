export const SALUDOS = {
  formal: ['Buenos días', 'Buenas tardes', 'Estimado', 'Estimada', 'Saludos'],
  casual: ['Hola', 'Hola, qué tal', 'Hola buenos días', 'Buenas', 'Hey'],
  coloquial: ['hola', 'hola que tal', 'buenas', 'hey'],
  apurado: ['hola', 'buenas'],
  detallista: ['Hola buenos días', 'Estimado, buenos días', 'Buenas tardes', 'Hola, espero se encuentre bien']
};

export const PREGUNTAS_PRECIO = {
  formal: [
    '¿Podría indicarme cuál es el valor del arriendo mensual?',
    '¿Cuál es el precio de la propiedad?',
    'Me gustaría conocer el valor de arriendo',
    '¿Cuál es el costo mensual incluyendo gastos comunes?'
  ],
  casual: [
    'Cuánto sale el arriendo?',
    'Cuál es el precio?',
    'Cuánto cuesta mensual?',
    'Y el precio?'
  ],
  coloquial: [
    'cuanto sale',
    'y cuanto es',
    'cuanto sale el arriendo',
    'y cuanto sale',
    'cuanto es'
  ],
  apurado: [
    'precio?',
    'cuanto?',
    'valor?'
  ],
  detallista: [
    '¿Podría detallarme el precio de arriendo y gastos comunes por separado?',
    'Me gustaría saber el costo mensual detallado',
    '¿Cuál es el valor de arriendo? ¿Los gastos comunes están incluidos?'
  ]
};

export const PREGUNTAS_DISPONIBILIDAD = {
  formal: [
    '¿La propiedad está disponible actualmente?',
    '¿Cuándo estaría disponible para arriendo?',
    'Me gustaría saber si está disponible'
  ],
  casual: [
    'Está disponible?',
    'Disponible?',
    'Sigue disponible la propiedad?'
  ],
  coloquial: [
    'esta disponible',
    'disponible',
    'sigue libre'
  ],
  apurado: [
    'disponible?',
    'libre?'
  ],
  detallista: [
    '¿Está disponible actualmente o tiene fecha de disponibilidad?',
    'Quisiera confirmar si la propiedad está libre'
  ]
};

export const PREGUNTAS_VISITA = {
  formal: [
    '¿Podríamos coordinar una visita?',
    'Me gustaría agendar una visita a la propiedad',
    '¿Cuándo podría visitarla?'
  ],
  casual: [
    'Cuándo puedo ir a verla?',
    'Puedo visitarla?',
    'Me gustaría verla'
  ],
  coloquial: [
    'cuando puedo ir a verla',
    'estoy interesada, cuando puedo ir',
    'al tiro, cuando voy'
  ],
  apurado: [
    'cuando puedo ver?',
    'visita?',
    'cuando voy?'
  ],
  detallista: [
    '¿Podríamos coordinar una visita? ¿Qué días y horarios tiene disponibles?',
    'Me gustaría agendar una visita. ¿Cuáles son los horarios disponibles?'
  ]
};

export const PREGUNTAS_CARACTERISTICAS = {
  estacionamiento: [
    'Tiene estacionamiento?',
    'Incluye estacionamiento?',
    'tiene parking?',
    'Hay estacionamiento?'
  ],
  bodega: [
    'Tiene bodega?',
    'Incluye bodega?',
    'viene con bodega?'
  ],
  mascotas: [
    'Se aceptan mascotas?',
    'Permiten mascotas?',
    'puedo tener perro?',
    'aceptan mascota?'
  ],
  amoblado: [
    'Está amoblado?',
    'Viene amoblado?',
    'tiene muebles?'
  ]
};

export const EXPRESIONES_CHILENAS = [
  'bacán',
  'piola',
  'al tiro',
  'cachar',
  'toy',
  'pa',
  'po',
  'cachai',
  'uff',
  'bakn',
  'weno',
  'sipo',
  'ta bien',
  'ta weno',
  'filo',
  'dale',
  'joya'
];

export const RESPUESTAS_CURIOSO = {
  saludo: [
    '¡Hola {nombre}! 🐻 Qué bueno que te interese.',
    '¡Hola {nombre}! 🐻 Con gusto te ayudo.',
    '¡Buenos días {nombre}! 🐻 Encantado de ayudarte.'
  ],
  precio: [
    'El arriendo es ${precio} + ${gastos} de gastos comunes 💰',
    'El valor mensual es ${precio}, más ${gastos} en gastos comunes 💰',
    'Son ${precio} mensuales + ${gastos} gastos comunes 💰'
  ],
  disponible_si: [
    'Sí, está disponible ✅',
    'Sí! Está disponible para entrar de inmediato ✅',
    'Disponible! ✅'
  ],
  estacionamiento_si: [
    'Sí! Incluye 1 estacionamiento 🚗',
    'Sí, viene con estacionamiento 🚗',
    'Incluye 1 estacionamiento ✅'
  ],
  mascotas_si: [
    'Sí se aceptan mascotas 🐕',
    'Sí! Se aceptan mascotas sin problema 🐕',
    'Aceptamos mascotas ✅'
  ],
  coordinar_visita: [
    'Puedo coordinar una visita para mañana o el jueves. ¿Cuál te acomoda mejor? 📅',
    'Genial! ¿Te acomoda esta semana? Tengo disponibilidad mañana y jueves 📅',
    '¿Qué día te viene bien? Puedo coordinar para esta semana 📅'
  ],
  confirmar_visita: [
    'Perfecto! Agendada para {fecha} ✅',
    'Genial! Te confirmo la visita para {fecha} 📅',
    'Listo! Visita agendada {fecha} ✅'
  ]
};

export const TYPOS_COMUNES: Record<string, string> = {
  'propiedad': 'propeida',
  'interesa': 'itneresa',
  'disponible': 'disponibe',
  'estacionamiento': 'estacionaminto',
  'cuando': 'cuadno',
  'quiero': 'quiro',
  'departamento': 'departamneto',
  'arriendo': 'ariendo',
  'bacán': 'bakn',
  'bueno': 'weno',
  'está': 'ta',
  'para': 'pa',
  'cachai': 'cahai'
};
