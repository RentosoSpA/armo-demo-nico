# 🧪 Guía de Testing - Sistema de Links de Invitación

## FASE 6: Testing Completo

### ✅ Test Flow Completo

#### 1. Creación de Link de Invitación
- [ ] Como admin, ir a `/roles`
- [ ] Verificar que la sección "Links de Invitación" esté visible
- [ ] Hacer clic en "Generar Nuevo Link"
- [ ] Seleccionar rol: "Agente"
- [ ] Dejar "Máximo de Usos" vacío (ilimitado)
- [ ] Dejar "Fecha de Expiración" vacío (nunca expira)
- [ ] Hacer clic en "Generar Link"
- [ ] **Esperado:** Modal muestra el link generado con botón "Copiar"
- [ ] Hacer clic en "Copiar Link"
- [ ] **Esperado:** Toast de éxito "Link copiado al portapapeles"

#### 2. Visualización del Link en Tabla
- [ ] Cerrar el modal
- [ ] Verificar que el nuevo link aparece en la tabla
- [ ] **Esperado:** 
  - Token visible (truncado)
  - Rol: "Agente"
  - Usos: 0 / ∞
  - Expira: "Nunca" (tag verde)
  - Estado: Switch en "Activo"
  - Botones de acciones visibles

#### 3. Registro de Nuevo Agente
- [ ] Abrir una ventana de incógnito
- [ ] Pegar el link copiado en el navegador
- [ ] **Esperado:** Página de registro con:
  - Título "Registro de Agente"
  - Info de empresa visible
  - Rol asignado visible ("Agente")
  - Formulario solo con: Nombre, Email, Contraseña, Confirmar Contraseña
- [ ] Completar formulario:
  - Nombre: "Juan Pérez Test"
  - Email: "juan.test@example.com"
  - Contraseña: "Test123456"
  - Confirmar: "Test123456"
- [ ] Hacer clic en "Completar Registro"
- [ ] **Esperado:**
  - Toast de éxito
  - Redirección automática al login (después de 2s)

#### 4. Verificación en Base de Datos
- [ ] Volver a la ventana del admin
- [ ] Recargar la tabla de links
- [ ] **Esperado:** El contador de usos debe ser 1 / ∞

#### 5. Login del Nuevo Agente
- [ ] En la ventana de incógnito, hacer login con:
  - Email: "juan.test@example.com"
  - Contraseña: "Test123456"
- [ ] **Esperado:**
  - Login exitoso
  - Acceso al dashboard
  - Rol de "Agente" aplicado

---

### 🔴 Test de Edge Cases

#### Test 1: Link Inactivo
- [ ] Como admin, crear un nuevo link
- [ ] Desactivar el link usando el switch "Activo/Inactivo"
- [ ] **Esperado:** Estado cambia a "Inactivo" (tag gris)
- [ ] Copiar el link inactivo
- [ ] Intentar acceder al link en incógnito
- [ ] **Esperado:** Error "Link de invitación inválido o inactivo"

#### Test 2: Link Expirado
- [ ] Como admin, crear un nuevo link con:
  - Rol: Agente
  - Fecha de Expiración: Ayer (seleccionar fecha pasada)
- [ ] **Esperado:** No debería permitir seleccionar fecha pasada
- [ ] Seleccionar fecha de mañana
- [ ] Guardar el link
- [ ] En Supabase, manualmente cambiar `expires_at` a una fecha pasada
- [ ] Recargar la tabla
- [ ] **Esperado:** 
  - Columna "Expira" muestra fecha + Tag "Expirado" (rojo)
  - Columna "Estado" muestra Tag "Expirado" (no switch)
  - Botón "Copiar link" está deshabilitado
- [ ] Intentar acceder al link
- [ ] **Esperado:** Error "El link de invitación ha expirado"

#### Test 3: Link con Máximo de Usos Alcanzado
- [ ] Como admin, crear un nuevo link con:
  - Rol: Agente
  - Máximo de Usos: 1
- [ ] Copiar el link
- [ ] Registrar un usuario usando ese link
- [ ] Recargar la tabla de links
- [ ] **Esperado:**
  - Usos: 1 / 1 (texto en rojo)
  - Tag "Máximo alcanzado" (rojo)
  - Estado: Tag "Agotado" (rojo)
  - Botón "Copiar link" deshabilitado
- [ ] Intentar registrar otro usuario con el mismo link
- [ ] **Esperado:** Error "El link de invitación ha alcanzado el máximo de usos"

#### Test 4: Indicador "Cerca del Límite"
- [ ] Como admin, crear un nuevo link con:
  - Máximo de Usos: 5
- [ ] Registrar 4 usuarios con ese link
- [ ] Recargar la tabla
- [ ] **Esperado:**
  - Usos: 4 / 5 (texto en naranja/warning)
  - Tag "Cerca del límite" (naranja)
  - Estado: Switch activo
  - Botón "Copiar link" habilitado

#### Test 5: Indicador "Expira Pronto"
- [ ] Como admin, crear un nuevo link con:
  - Fecha de Expiración: Dentro de 3 días
- [ ] **Esperado:**
  - Columna "Expira" muestra fecha + Tag "Expira pronto" (naranja)
  - Link sigue siendo funcional

#### Test 6: Editar Rol de Link
- [ ] Como admin, seleccionar un link activo
- [ ] Hacer clic en botón "Editar Rol" (ícono lápiz)
- [ ] Cambiar rol de "Agente" a "Supervisor"
- [ ] Hacer clic en "Guardar Cambios"
- [ ] **Esperado:**
  - Toast de éxito
  - Tabla actualizada con nuevo rol
- [ ] Usar el link para registrar un nuevo usuario
- [ ] Verificar que el nuevo usuario tiene rol "Supervisor"

#### Test 7: Eliminar Link con Countdown
- [ ] Como admin, seleccionar un link
- [ ] Hacer clic en botón "Eliminar" (ícono basurero)
- [ ] **Esperado:** Popconfirm aparece con:
  - Mensaje de confirmación
  - Botón "Sí, eliminar" deshabilitado
  - Texto del botón: "Espera 7s..."
- [ ] Esperar 7 segundos
- [ ] **Esperado:** Botón se habilita y texto cambia a "Sí, eliminar"
- [ ] Hacer clic en "Sí, eliminar"
- [ ] **Esperado:**
  - Toast de éxito
  - Link desaparece de la tabla
- [ ] Intentar usar el link eliminado
- [ ] **Esperado:** Error "Link de invitación inválido o inactivo"

#### Test 8: Cancelar Eliminación
- [ ] Hacer clic en "Eliminar" de un link
- [ ] Esperar 3 segundos (no los 7 completos)
- [ ] Hacer clic en "Cancelar"
- [ ] **Esperado:**
  - Popconfirm se cierra
  - Link sigue en la tabla
- [ ] Volver a hacer clic en "Eliminar" del mismo link
- [ ] **Esperado:** Countdown reinicia desde 7s

#### Test 9: Múltiples Links Simultáneos
- [ ] Crear 3 links diferentes:
  - Link 1: Rol Admin, sin límites
  - Link 2: Rol Agente, 2 usos máximo
  - Link 3: Rol Supervisor, expira en 30 días
- [ ] **Esperado:** Todos aparecen en la tabla con configuraciones correctas
- [ ] Usar cada link para registrar usuarios
- [ ] **Esperado:** Cada usuario recibe el rol correspondiente

#### Test 10: Validación de Formulario de Registro
- [ ] Acceder a un link válido
- [ ] Intentar enviar formulario vacío
- [ ] **Esperado:** Errores de validación en todos los campos
- [ ] Ingresar email inválido: "test@"
- [ ] **Esperado:** Error "Por favor ingresa un correo válido"
- [ ] Ingresar contraseña corta: "123"
- [ ] **Esperado:** Error "La contraseña debe tener al menos 6 caracteres"
- [ ] Ingresar contraseñas diferentes
- [ ] **Esperado:** Error "Las contraseñas no coinciden"
- [ ] Completar todo correctamente
- [ ] **Esperado:** Registro exitoso

---

### 📊 Checklist de Validaciones

#### UI/UX
- [ ] Todos los toasts funcionan correctamente
- [ ] Countdown de eliminación funciona (7 segundos)
- [ ] Indicadores visuales de estado (tags de colores)
- [ ] Tooltips informativos en botones
- [ ] Responsive en móvil y desktop

#### Funcionalidad
- [ ] Crear link genera token único
- [ ] Copiar link al portapapeles funciona
- [ ] Editar rol actualiza correctamente
- [ ] Toggle activo/inactivo funciona
- [ ] Eliminar remueve el link de DB
- [ ] Registro crea: usuario + rol + agente
- [ ] Contador de usos se incrementa

#### Seguridad
- [ ] RLS policies protegen invitation_links
- [ ] Solo admins pueden crear/editar links
- [ ] Links inactivos no permiten registro
- [ ] Links expirados no permiten registro
- [ ] Links agotados no permiten registro
- [ ] Validación de email en registro
- [ ] Contraseñas hasheadas en Supabase

#### Base de Datos
- [ ] Table `invitation_links` existe
- [ ] Función `increment_link_usage` funciona
- [ ] RLS policies activas
- [ ] Triggers de `updated_at` funcionan

---

### 🎯 Resultados Esperados

✅ **Todos los tests deben pasar** para considerar el sistema completo y funcional.

Si encuentras algún error:
1. Anota el paso exacto donde ocurrió
2. Captura el mensaje de error
3. Revisa los logs de Supabase Edge Functions
4. Verifica las políticas RLS en Supabase Dashboard
