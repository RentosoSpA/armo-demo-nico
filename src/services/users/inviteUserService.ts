import type { Empresa } from '../../types/empresa';

export interface InvitationData {
  email: string;
  rol: string;
  empresaInfo: Empresa;
  invitationToken: string;
}

// Simula el envío de correo de invitación
export const sendUserInvitation = async (
  email: string,
  rol: string,
  empresaInfo: Empresa
): Promise<void> => {
  // Simulamos un delay para el envío del correo
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Generar un token de invitación único
  const invitationToken = `inv_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  // En un entorno real, aquí se enviaría el correo a través de un servicio backend
  // que se comunicaría con un proveedor de email (SendGrid, SES, etc.)
  const invitationData: InvitationData = {
    email,
    rol,
    empresaInfo,
    invitationToken,
  };

  // Simular el almacenamiento de la invitación pendiente
  const pendingInvitations = JSON.parse(
    localStorage.getItem('pendingInvitations') || '[]'
  );
  pendingInvitations.push({
    ...invitationData,
    createdAt: new Date().toISOString(),
    status: 'pending',
  });
  localStorage.setItem('pendingInvitations', JSON.stringify(pendingInvitations));

  console.log('Invitación enviada:', invitationData);
  console.log(`
    ========================================
    📧 CORREO DE INVITACIÓN
    ========================================
    Para: ${email}
    Rol: ${rol}
    Empresa: ${empresaInfo.nombre}

    ¡Hola!

    Has sido invitado a unirte a ${empresaInfo.nombre} en RentOso.

    Para completar tu registro, haz clic en el siguiente enlace:
    ${window.location.origin}/aceptar-invitacion?token=${invitationToken}

    Cuando accedas, la información de la empresa ya estará precargada,
    solo necesitarás crear tu contraseña.

    Detalles de la empresa:
    - Nombre: ${empresaInfo.nombre}
    - Email: ${empresaInfo.email}
    - Teléfono: +${empresaInfo.codigo_telefonico} ${empresaInfo.telefono}

    ¡Bienvenido al equipo!
    ========================================
  `);

  // Simular éxito o error aleatorio (90% éxito)
  if (Math.random() < 0.1) {
    throw new Error('Error al enviar el correo de invitación');
  }
};

// Verifica un token de invitación
export const verifyInvitationToken = async (
  token: string
): Promise<InvitationData | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const pendingInvitations = JSON.parse(
    localStorage.getItem('pendingInvitations') || '[]'
  );

  const invitation = pendingInvitations.find(
    (inv: any) => inv.invitationToken === token && inv.status === 'pending'
  );

  return invitation || null;
};

// Acepta una invitación (marca como usada)
export const acceptInvitation = async (token: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const pendingInvitations = JSON.parse(
    localStorage.getItem('pendingInvitations') || '[]'
  );

  const updatedInvitations = pendingInvitations.map((inv: any) =>
    inv.invitationToken === token ? { ...inv, status: 'accepted' } : inv
  );

  localStorage.setItem('pendingInvitations', JSON.stringify(updatedInvitations));
};
