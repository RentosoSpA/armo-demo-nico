# Testing Guide - Rentoso AI Chat

## Checklist de Testing Funcional

### ✅ FASE 1: Backend (Edge Functions)

#### 1. `transcribe-audio`
- [ ] Graba un audio corto (5-10 segundos) y verifica la transcripción
- [ ] Prueba con audio más largo (30-60 segundos)
- [ ] Verifica manejo de errores con audio inválido
- [ ] Comprueba que retorna error si no hay audio

**Ejemplo de prueba:**
```javascript
// Desde la consola del navegador
const testAudio = "base64_encoded_wav_audio_here";
const { data, error } = await supabase.functions.invoke('transcribe-audio', {
  body: { audio: testAudio }
});
console.log('Transcription:', data);
```

#### 2. `rentoso-chat`
- [ ] Envía mensaje de saludo y verifica respuesta
- [ ] Prueba intent de registro de propiedad
- [ ] Prueba consulta de visitas
- [ ] Verifica extracción de entidades (direcciones, precios, etc.)
- [ ] Comprueba que mantiene contexto en sesión

**Casos de prueba:**
```
1. "Hola" → Debe mostrar mensaje de bienvenida
2. "Quiero subir una propiedad" → Debe iniciar flujo de registro
3. "Es un departamento de 2 dormitorios en Las Condes" → Debe extraer tipo y ubicación
4. "Muéstrame las visitas de hoy" → Debe consultar BD y mostrar visitas
```

#### 3. `create-property`
- [ ] Completa formulario con datos válidos
- [ ] Sube 3-5 imágenes
- [ ] Verifica creación de propietario
- [ ] Verifica creación de propiedad
- [ ] Verifica subida de imágenes a storage
- [ ] Comprueba que las imágenes son visibles

### ✅ FASE 2: Frontend (Componentes)

#### RentosoChat
- [ ] Desktop: Abre como Drawer desde la derecha
- [ ] Mobile: Abre como Modal fullscreen
- [ ] Botón "Habla con Rentoso" funciona
- [ ] Botón flotante (mobile) es visible y funciona
- [ ] Scroll automático al agregar mensajes
- [ ] Estado de "Transcribiendo..." se muestra
- [ ] Estado de "Procesando..." se muestra

#### AudioRecorder
- [ ] Solicita permisos de micrófono
- [ ] Muestra indicador de grabación
- [ ] Contador de tiempo funciona
- [ ] Se detiene automáticamente a los 60 segundos
- [ ] Botón de stop funciona
- [ ] Audio se envía correctamente al backend

#### PropertyConfirmationForm
- [ ] Validación de email funciona
- [ ] Validación de teléfono (9 dígitos, empieza con 9)
- [ ] Validación de RUT funciona
- [ ] Upload de imágenes funciona
- [ ] Preview de imágenes se muestra
- [ ] Botón eliminar imagen funciona
- [ ] No permite enviar sin imágenes

#### MessageBubble & VisitsDisplay
- [ ] Mensajes de usuario se alinean a la derecha
- [ ] Mensajes de AI se alinean a la izquierda
- [ ] Visitas se muestran en cards
- [ ] Formato de fecha es correcto
- [ ] Tags de estado tienen colores correctos

### ✅ FASE 3: Integración UI

#### Desktop
- [ ] Botón "Habla con Rentoso" visible en sidebar
- [ ] Click abre Drawer desde la derecha
- [ ] Drawer tiene ancho de 400px
- [ ] Se puede cerrar con X
- [ ] Se puede cerrar clickeando fuera
- [ ] No interfiere con navegación

#### Mobile/Tablet
- [ ] Botón flotante visible abajo a la derecha
- [ ] Click abre Modal fullscreen
- [ ] Modal ocupa 100% de pantalla
- [ ] Se puede cerrar con X
- [ ] Teclado virtual funciona correctamente
- [ ] Botón de grabar es más grande en mobile

### ✅ FASE 4: Optimización

#### Performance
- [ ] Chat carga con lazy loading
- [ ] No hay lag al abrir el chat
- [ ] Scroll es fluido con muchos mensajes
- [ ] Imágenes se comprimen antes de subir
- [ ] No hay memory leaks (revisar con DevTools)

#### Responsividad
- [ ] Funciona en iPhone SE (375px)
- [ ] Funciona en tablet (768px)
- [ ] Funciona en desktop (1920px)
- [ ] Transiciones suaves entre breakpoints

## Casos de Uso Completos

### Caso 1: Registro de Propiedad Completo
1. Usuario: "Quiero publicar un departamento"
2. AI: "¿Qué tipo de propiedad es?"
3. Usuario: "Un departamento de 2 dormitorios y 1 baño"
4. AI: "¿Cuál es la dirección?"
5. Usuario: "Av. Providencia 1234, Providencia"
6. AI: "¿Cuál es el precio de arriendo?"
7. Usuario: "700 mil pesos"
8. AI: Muestra formulario de confirmación
9. Usuario: Completa datos del propietario y sube fotos
10. AI: "¡Propiedad creada exitosamente!"

### Caso 2: Consulta de Visitas por Voz
1. Usuario: *Graba audio* "Muéstrame las visitas de mañana"
2. AI: Transcribe el audio
3. AI: Consulta BD y muestra lista de visitas
4. Usuario puede ver detalles de cada visita

### Caso 3: Flujo Mixto (Texto + Voz)
1. Usuario: "Hola" (texto)
2. AI: Saludo
3. Usuario: *Audio* "Quiero cargar una propiedad"
4. AI: Inicia flujo de registro
5. Usuario: "Casa de 3 dormitorios" (texto)
6. AI: Continúa el flujo...

## Errores Comunes a Verificar

### Edge Functions
- [ ] Error 401: Verificar JWT en headers
- [ ] Error 500: Revisar logs en Supabase
- [ ] Timeout: Audio muy largo o red lenta
- [ ] CORS: Verificar headers en respuestas

### Frontend
- [ ] "Micrófono no disponible": Verificar permisos
- [ ] "No se pudo transcribir": Audio corrupto o formato incorrecto
- [ ] Layout roto: Verificar CSS y breakpoints
- [ ] Imágenes no cargan: Verificar storage bucket público

## Herramientas de Testing

### DevTools
```javascript
// Verificar memoria
// 1. Abrir DevTools > Memory
// 2. Tomar heap snapshot
// 3. Abrir chat, enviar mensajes, cerrar chat
// 4. Tomar otro snapshot
// 5. Comparar - no debería crecer mucho
```

### Network Tab
```
// Verificar llamadas a edge functions
// 1. Abrir DevTools > Network
// 2. Filtrar por "transcribe-audio", "rentoso-chat", "create-property"
// 3. Verificar status codes (200, 401, 500)
// 4. Ver payload request/response
```

### Console Logs
```javascript
// Los edge functions tienen logs automáticos
// Revisar en: Supabase Dashboard > Edge Functions > Logs
```

## Métricas de Éxito

- ✅ Tiempo de respuesta < 3 segundos
- ✅ Tasa de error < 5%
- ✅ Precisión de transcripción > 80%
- ✅ Precisión de extracción de entidades > 80%
- ✅ 100% responsive (mobile + desktop)
- ✅ Carga lazy exitosa (bundle < 500KB inicial)

## Próximos Pasos Post-Testing

1. [ ] Implementar analytics (track de eventos)
2. [ ] Agregar historial de conversaciones
3. [ ] Mejorar NLP para mejor extracción de entidades
4. [ ] Agregar más intents (cancelar visitas, reportes)
5. [ ] Implementar multi-idioma
6. [ ] Agregar sugerencias inteligentes
