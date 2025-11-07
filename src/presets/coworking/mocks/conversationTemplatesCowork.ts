/**
 * Templates de conversación específicos para coworking
 */

export const PREGUNTAS_COWORK = {
  planes: {
    formal: [
      '¿Qué planes tienen disponibles?',
      'Me gustaría conocer los diferentes planes de membresía',
      'Quisiera información sobre sus planes'
    ],
    casual: [
      'Qué planes tienen?',
      'Cuéntame sobre los planes',
      'Tienen planes mensuales?'
    ],
    coloquial: [
      'q planes tienen',
      'cuales son los planes',
      'tienen hot desk'
    ],
    apurado: [
      'planes?',
      'que tienen',
      'opciones'
    ],
    detallista: [
      '¿Podrían detallarme los planes disponibles y qué incluye cada uno?',
      'Necesito información completa sobre los planes de membresía'
    ]
  },
  
  oficina_virtual: {
    formal: [
      '¿Cómo funciona la oficina virtual?',
      'Necesito información sobre oficina virtual',
      '¿Qué incluye el servicio de oficina virtual?'
    ],
    casual: [
      'Tienen oficina virtual?',
      'Como funciona la oficina virtual',
      'La oficina virtual incluye salas?'
    ],
    coloquial: [
      'tienen oficina virtual',
      'como es lo de oficina virtual',
      'q incluye oficina virtual'
    ],
    apurado: [
      'oficina virtual?',
      'virtual incluye q',
      'precio virtual'
    ],
    detallista: [
      '¿Podrían explicarme detalladamente qué servicios incluye la oficina virtual?',
      'Necesito entender completamente el funcionamiento de la oficina virtual'
    ]
  },
  
  salas_eventos: {
    formal: [
      '¿Tienen salas disponibles para eventos?',
      'Necesito información sobre sus salas de reunión',
      '¿Cuánto cuesta la Sala Laurel?'
    ],
    casual: [
      'Tienen salas para eventos?',
      'Cuanto sale la Sala Laurel',
      'Necesito una sala para 20 personas'
    ],
    coloquial: [
      'tienen salas pa eventos',
      'cuanto la sala laurel',
      'sala para 20'
    ],
    apurado: [
      'salas?',
      'Laurel precio',
      'sala 20 personas'
    ],
    detallista: [
      '¿Podrían darme información detallada sobre las salas disponibles, capacidad y precios?',
      'Necesito saber qué salas tienen, equipamiento y tarifas'
    ]
  },
  
  amenidades: {
    formal: [
      '¿Qué amenidades están incluidas?',
      '¿Incluye café y servicios básicos?',
      '¿Tienen estacionamiento?'
    ],
    casual: [
      'Incluye café?',
      'Tienen impresora?',
      'Hay estacionamiento?'
    ],
    coloquial: [
      'incluye cafe',
      'tienen impresora',
      'hay estacionamiento'
    ],
    apurado: [
      'café?',
      'impresora?',
      'parking?'
    ],
    detallista: [
      '¿Podrían detallarme todas las amenidades y servicios incluidos en el plan?',
      'Necesito saber exactamente qué servicios están incluidos'
    ]
  },
  
  flexibilidad: {
    formal: [
      '¿Hay contrato de permanencia?',
      '¿Puedo cambiar mi plan después?',
      '¿Cuántos días incluye el plan flexible?'
    ],
    casual: [
      'Tienen contrato de permanencia?',
      'Se puede cambiar el plan',
      'Cuantos días incluye el flexible'
    ],
    coloquial: [
      'hay contrato',
      'se puede cambiar plan',
      'cuantos dias flexible'
    ],
    apurado: [
      'contrato?',
      'cambiar plan?',
      'días flex'
    ],
    detallista: [
      '¿Podrían explicarme las condiciones de flexibilidad y permanencia de los contratos?',
      'Necesito entender los términos de cambio de plan y cancelación'
    ]
  }
};

export const RESPUESTAS_CURIOSO_COWORK = {
  planes_generales: [
    'Tenemos varios planes 💼: Hot Desk ($120k/mes), Escritorio Flexible desde $80k, y Oficinas Privadas desde $450k. ¿Qué tipo de espacio buscas?',
    'Manejamos planes mensuales, flexibles (5, 8 o 12 días) y oficinas virtuales 🏢. ¿Para qué lo necesitas?',
    'Contamos con Hot Desk mensual $120k, planes flexibles desde $80k, oficinas privadas desde $450k y oficina virtual $75k 📊'
  ],
  
  oficina_virtual: [
    'La oficina virtual incluye dirección tributaria/comercial + recepción de correspondencia + 10 hrs de sala al mes por $75k 📬',
    'Con la oficina virtual tienes domicilio comercial, correspondencia y 10 horas de sala incluidas. Ideal para freelancers! 💼',
    'Oficina Virtual $75k/mes: dirección fiscal, recepción de correo y 10 hrs de sala mensual ✉️'
  ],
  
  sala_evento: [
    'La Sala Laurel cuesta $45k/hora y tiene capacidad para 80 personas con proyector y sonido 🎤',
    'Tenemos salas desde 6 hasta 80 personas. ¿Para cuántos necesitas? 📊',
    'Sala Laurel (80 personas) $45k/hora. Incluye proyector, sonido y coffee break opcional ☕',
    'Tenemos: Salas 6 personas ($20k/hora), 15-20 personas ($30k/hora), Laurel 80 personas ($45k/hora) 🏢'
  ],
  
  amenidades: [
    'Todos los planes incluyen: WiFi alta velocidad, café ilimitado ☕, impresora y áreas comunes',
    'Sí! Café ilimitado ☕, WiFi fibra óptica, impresora, cocina equipada y terraza incluidos en todos los planes ✨',
    'Incluye: WiFi profesional, café/té ilimitado, impresora, cocina completa, terraza y áreas comunes 🌟'
  ],
  
  tour: [
    'Te puedo agendar un tour para que conozcas el espacio. ¿Qué día te acomoda? 🚪',
    'Genial! Podemos hacer un tour virtual ahora o presencial. ¿Cuál prefieres? 📅',
    'Perfecto! Te agendo un tour. ¿Mañana o esta semana te viene bien? 🗓️'
  ],
  
  hot_desk: [
    'El Hot Desk es $120k/mes con acceso todos los días laborales de 8am a 8pm 🪑',
    'Hot Desk mensual: $120k. Llegas y eliges tu escritorio del día. Incluye todo: WiFi, café, impresora ☕',
    'Plan Hot Desk $120k/mes: acceso diario lun-vie 8am-8pm, sin escritorio fijo, todas las amenidades incluidas 💼'
  ],
  
  flexible: [
    'Planes flexibles: 5 días $45k, 8 días $80k o 12 días $120k al mes. Usas cuando quieras 📅',
    'El flexible 8 días cuesta $80k/mes y los usas cuando necesites durante el mes 🗓️',
    'Flexibles: 5 días ($45k), 8 días ($80k), 12 días ($120k). Válidos 30 días desde activación ⏱️'
  ],
  
  privada: [
    'Las oficinas privadas van desde $450k (6 personas) hasta $800k (12 personas). Incluyen todo 🏢',
    'Oficina Privada 6 personas: $450k/mes con llave, acceso 24/7 y todas las amenidades 🔑',
    'Tenemos oficinas privadas de 4, 6, 8 y 12 personas desde $450k/mes. ¿Para cuántos la necesitas? 👥'
  ],
  
  saludo: [
    'Hola {nombre}! 🐻 ¿En qué te puedo ayudar hoy?',
    'Genial, {nombre}! Cuéntame qué tipo de espacio estás buscando 💼',
    'Perfecto {nombre}! ¿Qué necesitas: escritorio, oficina o sala? 🏢'
  ],
  
  estacionamiento: [
    'Sí, tenemos estacionamiento disponible por $50k/mes adicional 🚗',
    'Contamos con estacionamientos por $50k adicionales al mes 🅿️'
  ],
  
  acceso_247: [
    'Las oficinas privadas tienen acceso 24/7 con llave propia 🔑',
    'Solo oficinas privadas tienen acceso 24/7. Hot desk y flexibles: lun-vie 8am-8pm ⏰'
  ]
};

export const EXPRESIONES_COWORK_CASUAL = [
  'bacán',
  'piola',
  'dale',
  'perfecto',
  'genial'
];
