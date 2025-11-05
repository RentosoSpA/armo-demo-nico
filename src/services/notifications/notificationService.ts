// TODO: Implement Firebase push notifications
// This service will handle notifications when new prospectos upload documents

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, string>;
  clickAction?: string;
}

export const sendNotification = async (notification: NotificationData) => {
  // TODO: Implement Firebase Cloud Messaging
  console.log('Notification would be sent:', notification);
};

export const sendProspectoUploadNotification = async (
  prospectoId: string,
  prospectoName?: string
) => {
  const notification: NotificationData = {
    title: 'Nuevo Prospecto',
    body: `${prospectoName || 'Un prospecto'} ha enviado documentos para evaluación`,
    data: {
      type: 'prospecto_upload',
      prospectoId,
      prospectoName: prospectoName || 'Prospecto',
    },
    clickAction: '/workspace?selectedKey=Oportunidades',
  };

  await sendNotification(notification);
};

export const sendEvaluationCompleteNotification = async (
  prospectoId: string,
  prospectoName: string,
  aprobado: boolean
) => {
  const notification: NotificationData = {
    title: 'Evaluación Completada',
    body: `La evaluación de ${prospectoName} ha sido ${aprobado ? 'aprobada' : 'rechazada'}`,
    data: {
      type: 'evaluation_complete',
      prospectoId,
      prospectoName,
      aprobado: aprobado.toString(),
    },
  };

  await sendNotification(notification);
};
