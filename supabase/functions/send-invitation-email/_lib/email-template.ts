interface EmailTemplateProps {
  companyName: string;
  invitationLink: string;
  role: string;
  expiresInDays: number;
}

const roleTranslations: Record<string, string> = {
  admin: 'Administrador',
  agent: 'Agente',
  supervisor: 'Supervisor',
  assistant: 'Asistente',
};

export function generateEmailTemplate({
  companyName,
  invitationLink,
  role,
  expiresInDays,
}: EmailTemplateProps): string {
  const roleSpanish = roleTranslations[role] || role;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitación a ${companyName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">¡Bienvenido a RentOso!</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #333333; font-size: 22px; font-weight: 600;">Has sido invitado a unirte a ${companyName}</h2>
              
              <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                Has sido invitado a formar parte de <strong>${companyName}</strong> como <strong>${roleSpanish}</strong> en la plataforma RentOso.
              </p>
              
              <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                Para aceptar la invitación y crear tu cuenta, haz clic en el botón a continuación:
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <a href="${invitationLink}" target="_blank" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      Aceptar Invitación
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 0; color: #999999; font-size: 14px; line-height: 1.6;">
                Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
              </p>
              
              <p style="margin: 10px 0 0; word-break: break-all;">
                <a href="${invitationLink}" style="color: #667eea; text-decoration: none; font-size: 14px;">${invitationLink}</a>
              </p>
              
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eeeeee;">
                <p style="margin: 0 0 10px; color: #999999; font-size: 13px;">
                  <strong>Información de la empresa:</strong>
                </p>
                <p style="margin: 0 0 5px; color: #666666; font-size: 14px;">
                  📍 Empresa: ${companyName}
                </p>
                <p style="margin: 0 0 5px; color: #666666; font-size: 14px;">
                  👤 Rol: ${roleSpanish}
                </p>
                <p style="margin: 0; color: #666666; font-size: 14px;">
                  ⏰ Esta invitación expira en ${expiresInDays} días
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; color: #999999; font-size: 12px;">
                Si no esperabas esta invitación, puedes ignorar este correo de forma segura.
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} RentOso. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
