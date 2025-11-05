export interface DocxProcessResult {
  plantilla_id: string;
  template_html: string;
}

export interface GuardarPlantillaResult {
  storage_url: string;
}

export async function procesarDocxMock(fileName: string, empresaId: string): Promise<DocxProcessResult> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock template ID
  const plantilla_id = `tpl-${Date.now()}`;
  
  // Generate mock HTML template based on file name
  const template_html = `
    <div class="contrato-template">
      <h1>Contrato de Arriendo</h1>
      <p>Procesado desde: ${fileName}</p>
      <p>Empresa ID: ${empresaId}</p>
      
      <div class="clausulas">
        <h2>Cláusulas Principales</h2>
        <p>Este contrato se genera automáticamente desde la plantilla ${fileName}</p>
        <p>Variables disponibles: {{nombre_inquilino}}, {{direccion_propiedad}}, {{valor_arriendo}}</p>
      </div>
      
      <div class="firmas">
        <div class="firma-arrendador">
          <p>_______________________</p>
          <p>Firma Arrendador</p>
        </div>
        <div class="firma-arrendatario">
          <p>_______________________</p>
          <p>Firma Arrendatario</p>
        </div>
      </div>
    </div>
  `;
  
  return {
    plantilla_id,
    template_html
  };
}

export async function guardarPlantillaMock(plantillaId: string, _html: string): Promise<GuardarPlantillaResult> {
  // Simulate save delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate mock Supabase storage URL
  const storage_url = `https://supabase.storage.url/templates/${plantillaId}_${Date.now()}.html`;
  
  return {
    storage_url
  };
}