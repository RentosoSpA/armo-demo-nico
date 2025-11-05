# Sistema de Invitaciones - Guía de Configuración

## Requisitos Previos

### 1. Resend API Key (OBLIGATORIO)
El sistema requiere una cuenta de Resend para enviar correos electrónicos.

**Pasos para obtener la API Key:**
1. Ir a [resend.com](https://resend.com)
2. Crear una cuenta o iniciar sesión
3. Ir a [API Keys](https://resend.com/api-keys)
4. Crear una nueva API key
5. Copiar la key (formato: `re_xxxxxxxxxxxxxxxx`)

**Configurar en Supabase:**
```bash
# En el dashboard de Supabase
1. Ir a Project Settings > Edge Functions
2. Agregar secret: RESEND_API_KEY
3. Pegar el valor de la key
```

### 2. Validar Dominio de Email (IMPORTANTE)
Resend requiere que valides tu dominio antes de enviar emails:

1. Ir a [Domains](https://resend.com/domains)
2. Agregar tu dominio
3. Seguir las instrucciones para agregar registros DNS
4. Esperar validación (puede tomar hasta 24 horas)

**Mientras tanto:** Puedes usar `onboarding@resend.dev` para pruebas (limitado).

## Verificación de Configuración

### Health Check Automático
La Edge Function valida automáticamente la configuración al iniciar:

```typescript
// Ver logs en: Supabase Dashboard > Edge Functions > send-invitation-email > Logs
🔧 Configuration check:
  RESEND_API_KEY: ✅ Configured
  SUPABASE_URL: ✅ Configured
  SUPABASE_SERVICE_ROLE_KEY: ✅ Configured
```

### Códigos de Error Comunes

| Código | Significado | Solución |
|--------|-------------|----------|
| `RESEND_NOT_CONFIGURED` | API key no configurada | Agregar `RESEND_API_KEY` en Supabase secrets |
| `CONNECTION_ERROR` | No se pudo conectar al servidor | Verificar conexión de internet |
| `EMAIL_SEND_FAILED` | Error al enviar email | Verificar dominio validado en Resend |
| `RATE_LIMIT_EXCEEDED` | Límite de invitaciones alcanzado | Esperar 24 horas o contactar admin |
| `AUTH_HEADER_MISSING` | Header de autorización faltante | Error de aplicación - verificar código frontend |
| `AUTH_INVALID` | Token de autenticación inválido | Usuario necesita iniciar sesión nuevamente |
| `SESSION_EXPIRED` | Sesión expirada | Recargar página e iniciar sesión |
| `NO_SESSION` | No hay sesión activa | Usuario necesita iniciar sesión |

## Flujo de Invitación

1. **Admin envía invitación** (`/roles`)
   - Sistema valida configuración
   - Crea registro en `user_invitations`
   - Envía email con link único

2. **Usuario recibe email**
   - Link válido por 7 días
   - Formato: `https://tu-app.com/aceptar-invitacion?token=xxx`

3. **Usuario acepta invitación** (`/aceptar-invitacion`)
   - Verifica token válido
   - Muestra info de empresa y rol
   - Crea cuenta con datos de empresa precargados

4. **Sistema completa registro**
   - Crea usuario en `auth.users`
   - Asigna rol en `user_roles`
   - Marca invitación como `accepted`

## Seguridad

### Row Level Security (RLS)
Todas las tablas tienen políticas RLS:

- ✅ `user_roles`: Solo admins pueden gestionar roles
- ✅ `user_invitations`: Solo admins de la empresa pueden ver/crear invitaciones
- ✅ `email_rate_limits`: 50 emails por usuario cada 24 horas

### Validaciones
- Email: Validación con Zod
- Roles: Enum estricto (`admin`, `agent`, `supervisor`, `assistant`)
- Tokens: UUID único + timestamp
- Expiración: 7 días automático

## Troubleshooting

### "Servicio de email no configurado"
```bash
# Verificar que RESEND_API_KEY esté configurada
1. Dashboard Supabase > Settings > Edge Functions
2. Buscar RESEND_API_KEY en la lista de secrets
3. Si no existe, agregarla
```

### "Error al enviar el correo electrónico"
```bash
# Verificar logs de la Edge Function
1. Dashboard Supabase > Edge Functions > send-invitation-email > Logs
2. Buscar errores relacionados con Resend
3. Verificar que el dominio esté validado en Resend
```

### Invitación no recibida
1. Verificar carpeta de spam
2. Verificar que el email sea válido
3. Revisar logs de Resend: [Logs](https://resend.com/logs)
4. Verificar límite de rate (50/24h)

### "Edge Function returned a non-2xx status code" / "AuthSessionMissingError"
Este error ocurría cuando el header de Authorization no se pasaba correctamente al Edge Function.

**Solución implementada:**
1. **Frontend** (`sendInvitationEmail`):
   - Obtiene la sesión actual con `supabase.auth.getSession()`
   - Pasa el token explícitamente en el header `Authorization`
   - Valida que exista sesión antes de hacer la petición
   - Maneja códigos de error específicos de autenticación

2. **Edge Function** (`send-invitation-email`):
   - Valida que el header `Authorization` esté presente
   - Verifica la identidad del usuario con `supabase.auth.getUser(token)`
   - Retorna códigos específicos: `AUTH_HEADER_MISSING`, `AUTH_INVALID`, `SESSION_EXPIRED`
   - Proporciona mensajes de error detallados

**Si aún ves este error:**
1. Asegúrate de que el usuario esté autenticado
2. Intenta recargar la página para refrescar la sesión
3. Revisa la consola del navegador para ver códigos de error específicos
4. Verifica los logs de la Edge Function en el dashboard de Supabase

## Personalización

### Cambiar email "from"
Editar `supabase/functions/send-invitation-email/index.ts`:
```typescript
from: 'TuEmpresa <noreply@tudominio.com>',  // Cambiar esto
```

### Modificar plantilla de email
Editar `supabase/functions/send-invitation-email/_lib/email-template.ts`

### Ajustar tiempo de expiración
Editar migración de `user_invitations`:
```sql
expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '14 days')  -- Cambiar de 7 a 14 días
```

## Monitoreo

### Métricas Importantes
- Invitaciones enviadas vs aceptadas
- Tiempo promedio de aceptación
- Rate limits alcanzados
- Errores de email

### Queries Útiles
```sql
-- Ver invitaciones pendientes
SELECT * FROM user_invitations 
WHERE status = 'pending' AND expires_at > now();

-- Ver tasa de aceptación
SELECT 
  status, 
  COUNT(*) as count 
FROM user_invitations 
GROUP BY status;

-- Ver rate limits por usuario
SELECT * FROM email_rate_limits 
WHERE email_count > 40;
```

## Recursos

- [Documentación Resend](https://resend.com/docs)
- [Edge Functions Logs](https://supabase.com/dashboard/project/xyuyvtqmwjeklmxrmyed/functions/send-invitation-email/logs)
- [Supabase Secrets](https://supabase.com/dashboard/project/xyuyvtqmwjeklmxrmyed/settings/functions)
- [User Invitations Table](https://supabase.com/dashboard/project/xyuyvtqmwjeklmxrmyed/editor)
