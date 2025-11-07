# Documentación de Templates Coworking

## 📋 Mapeo de Claves entre Sistemas

Para mantener la compatibilidad entre los modos **Inmobiliaria** y **Coworking**, es crucial que ambos objetos de respuestas tengan las mismas claves base.

### Claves Obligatorias (deben existir en ambos sistemas)

Estas claves son utilizadas por el generador de conversaciones y **DEBEN** estar presentes tanto en `RESPUESTAS_CURIOSO` como en `RESPUESTAS_CURIOSO_COWORK`:

| Clave | Descripción | Uso |
|-------|-------------|-----|
| `saludo` | Saludo inicial de CuriOso | Primer contacto con el lead |
| `precio` | Respuesta sobre precio/planes | Cuando el lead pregunta por costos |
| `disponible_si` | Confirmación de disponibilidad | Cuando hay espacios/propiedades libres |
| `estacionamiento_si` | Confirmación de estacionamiento | Característica consultada frecuentemente |
| `mascotas_si` | Confirmación sobre mascotas | Solo relevante para inmobiliaria, pero debe existir |
| `coordinar_visita` | Propuesta de visita/tour | Cuando el lead quiere conocer el espacio |
| `confirmar_visita` | Confirmación de visita agendada | Después de acordar fecha/hora |

### Claves Específicas de Coworking

Estas claves son exclusivas del modo coworking y no generan errores si no existen en inmobiliaria:

- `planes_generales`
- `oficina_virtual`
- `sala_evento`
- `amenidades`
- `hot_desk`
- `flexible`
- `privada`
- `tour`
- `estacionamiento` (versión coworking)
- `acceso_247`

## 🔧 Proceso para Agregar Nuevas Respuestas

### 1. Agregar en RESPUESTAS_CURIOSO (inmobiliaria)

```typescript
// src/services/mock/conversationTemplates.ts
export const RESPUESTAS_CURIOSO = {
  // ... respuestas existentes
  
  nueva_respuesta: [
    'Respuesta opción 1 para inmobiliaria',
    'Respuesta opción 2 para inmobiliaria',
    'Respuesta opción 3 para inmobiliaria'
  ]
};
```

### 2. Agregar equivalente en RESPUESTAS_CURIOSO_COWORK

```typescript
// src/presets/coworking/mocks/conversationTemplatesCowork.ts
export const RESPUESTAS_CURIOSO_COWORK = {
  // ... respuestas existentes
  
  nueva_respuesta: [
    'Respuesta opción 1 adaptada a coworking',
    'Respuesta opción 2 adaptada a coworking',
    'Respuesta opción 3 adaptada a coworking'
  ]
};
```

### 3. Actualizar generador si es necesario

Si la nueva respuesta tiene lógica especial, actualizar `generateCuriosoResponse()` en:
`src/services/mock/whatsappConversationGenerator.ts`

## 🛡️ Sistema de Fallbacks

El generador de conversaciones incluye múltiples niveles de fallback:

```typescript
// Nivel 1: Intentar usar plantilla de coworking
if (activePreset === 'coworking') {
  const coworkTemplates = RESPUESTAS_CURIOSO_COWORK[key];
  if (isValidStringArray(coworkTemplates)) {
    templates = coworkTemplates;
  }
}

// Nivel 2: Usar plantilla inmobiliaria como fallback
if (!isValidStringArray(templates)) {
  templates = RESPUESTAS_CURIOSO[key];
}

// Nivel 3: Fallback genérico
if (!isValidStringArray(templates)) {
  templates = ['Entendido'];
}
```

## ⚠️ Errores Comunes a Evitar

1. **No agregar clave en ambos archivos**: Genera error de TypeScript en build
2. **Usar valores que no son arrays**: El generador espera arrays de strings
3. **Arrays vacíos**: Activarán el fallback genérico
4. **No validar con `isValidStringArray()`**: Puede causar undefined en runtime

## ✅ Checklist de Validación

Antes de hacer push:

- [ ] Ambos archivos tienen las mismas claves base
- [ ] Cada clave tiene un array con al menos 1 string
- [ ] Las respuestas están adaptadas al contexto (inmobiliaria vs coworking)
- [ ] No hay typos en las claves
- [ ] Build local pasa sin errores: `npm run build`
- [ ] No hay warnings de TypeScript

## 📚 Referencias

- **Archivo inmobiliaria**: `src/services/mock/conversationTemplates.ts`
- **Archivo coworking**: `src/presets/coworking/mocks/conversationTemplatesCowork.ts`
- **Generador**: `src/services/mock/whatsappConversationGenerator.ts`
- **Type guard**: `isValidStringArray()` en `whatsappConversationGenerator.ts`
