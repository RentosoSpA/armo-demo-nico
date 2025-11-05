export interface Amenidades {
  id: string;
  propiedadId: string;

  // Amenidades básicas
  amoblado?: boolean;
  cocina?: boolean;
  mascota?: boolean;
  estacionamiento?: boolean;
  balcon?: boolean;
  jardin?: boolean;
  wifi?: boolean;
  garage?: boolean;
  zonaFumador?: boolean;
  lavaplatos?: boolean;
  lavadora?: boolean;
  tvCable?: boolean;

  // Amenidades del condominio/edificio
  enCondominio?: boolean;
  permiteMascotas?: boolean;
  piscina?: boolean;
  gimnasio?: boolean;
  sauna?: boolean;
  jacuzzi?: boolean;

  // Amenidades adicionales del formulario
  recibos?: boolean;
  llavesOficina?: boolean;
  tieneLetrero?: boolean;
  canchaTenis?: boolean;
  bodega?: boolean;
  piezaServicio?: boolean;
  regularizada?: boolean;

  // Servicios adicionales
  agua?: boolean;
  caldera?: boolean;
  gasNatural?: boolean;
  luz?: boolean;
  alcantarillado?: boolean;
}
