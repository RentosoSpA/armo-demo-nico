// Plantillas
export {
  getPlantillasByEmpresa,
  getPlantillaById
} from './mock/plantillasServiceMock';

// DOCX Processing
export {
  procesarDocxMock,
  guardarPlantillaMock,
  type DocxProcessResult,
  type GuardarPlantillaResult
} from './mock/docxServiceMock';

// Contratos
export {
  getContratosByEmpresa,
  getContratosByPropiedad,
  crearContratoDesdePlantillaMock,
  getContratoById,
  actualizarContrato
} from './mock/contratosServiceMock';

// Re-export types
export type {
  FormatoPlantilla,
  EstadoPlantilla,
  EstadoContrato,
  Plantilla,
  Contrato,
  ContratoCreate
} from '../types/contratos';