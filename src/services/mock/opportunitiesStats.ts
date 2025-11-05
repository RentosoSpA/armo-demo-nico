export interface OpportunityStats {
  nuevosProspectos: number;
  prospectosCalificados: number;
  contratosNegociacion: number;
}

export const getOpportunityStats = (): OpportunityStats => {
  return {
    nuevosProspectos: 12,
    prospectosCalificados: 8,
    contratosNegociacion: 3,
  };
};