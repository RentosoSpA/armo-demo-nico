export interface PaymentStats {
  pendientesCobrar: number;
  atrasados: number;
  cobradosExito: number;
}

export const getPaymentStats = (): PaymentStats => {
  return {
    pendientesCobrar: 15,
    atrasados: 3,
    cobradosExito: 42,
  };
};