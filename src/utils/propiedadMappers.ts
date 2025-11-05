import type { Propiedad } from '../types/propiedad';
import { TipoPropiedad, EstadoPropiedad, TipoOperacion, Divisa, Banco, Region, TipoPiso, TipoDepartamento, RecepcionFinal, Orientacion, TipoAguaCaliente, TipoCalefaccion, TipoCocina, TipoConstruccion, TipoVentanas, Disposicion, TipoSeguridad } from '../types/propiedad';

/**
 * Lightweight mapper for property list view (only essential fields)
 */
export function mapSupabaseToList(supabaseData: any): Propiedad {
  return {
    id: supabaseData.id,
    titulo: supabaseData.titulo,
    tipo: supabaseData.tipo as TipoPropiedad,
    estado: supabaseData.estado as EstadoPropiedad,
    direccion: supabaseData.direccion || '',
    habitaciones: supabaseData.habitaciones || 0,
    banos: supabaseData.banos || 0,
    areaTotal: supabaseData.area_total || 0,
    operacion: (() => {
      const ops = [];
      if (supabaseData.arriendo) ops.push(TipoOperacion.Renta);
      if (supabaseData.venta) ops.push(TipoOperacion.Venta);
      if (supabaseData.renta_temporal) ops.push(TipoOperacion.RentaTemporal);
      return ops.length > 0 ? ops : [TipoOperacion.Venta];
    })(),
    precio: supabaseData.arriendo ? supabaseData.precio_arriendo : supabaseData.precio_venta,
    divisa: supabaseData.divisa as Divisa || Divisa.CLP,
    arriendo: supabaseData.arriendo,
    venta: supabaseData.venta,
    propietario: supabaseData.propietario ? {
      id: supabaseData.propietario.id,
      nombre: supabaseData.propietario.nombre,
      email: '',
      telefono: '',
      codigo_telefonico: 56,
      documento: '',
      tipo_documento: 'RUT',
      propiedades_asociadas: 0
    } : undefined,
    imagenPrincipal: null,
  } as Propiedad;
}

/**
 * Map Supabase data to form-friendly Propiedad structure
 */
export function mapSupabaseToForm(supabaseData: any): Propiedad {
  const propiedad: Propiedad = {
    id: supabaseData.id,
    titulo: supabaseData.titulo,
    tipo: supabaseData.tipo as TipoPropiedad,
    estado: supabaseData.estado as EstadoPropiedad,

    // Map operacion from arriendo/venta booleans - now returns array
    operacion: (() => {
      const ops = [];
      if (supabaseData.arriendo) ops.push(TipoOperacion.Renta);
      if (supabaseData.venta) ops.push(TipoOperacion.Venta);
      if (supabaseData.renta_temporal) ops.push(TipoOperacion.RentaTemporal);
      return ops.length > 0 ? ops : [TipoOperacion.Venta];
    })(),

    // Map precio from precio_arriendo or precio_venta
    precio: supabaseData.arriendo ? supabaseData.precio_arriendo : supabaseData.precio_venta,
    divisa: supabaseData.divisa as Divisa || Divisa.CLP,
    
    // Location
    direccion: supabaseData.direccion,
    comuna: supabaseData.comuna,
    region: supabaseData.region as Region,
    nombreCalle: supabaseData.nombre_calle,
    numeroCalle: supabaseData.numero_calle,
    unidad: supabaseData.unidad,
    letra: supabaseData.letra,
    etapa: supabaseData.etapa,
    
    // Description
    descripcion: supabaseData.descripcion,
    
    // Características
    habitaciones: supabaseData.habitaciones,
    banos: supabaseData.banos,
    piso: supabaseData.piso,
    tipo_piso: supabaseData.tipo_piso as TipoPiso,
    tipo_departamento: supabaseData.tipo_departamento as TipoDepartamento,
    recepcion_final: supabaseData.recepcion_final as RecepcionFinal,
    orientacion: supabaseData.orientacion as Orientacion,
    tipo_agua_caliente: supabaseData.tipo_agua_caliente as TipoAguaCaliente,
    tipo_calefaccion: supabaseData.tipo_calefaccion as TipoCalefaccion,
    tipo_cocina: supabaseData.tipo_cocina as TipoCocina,
    tipo_construccion: supabaseData.tipo_construccion as TipoConstruccion,
    tipo_ventanas: supabaseData.tipo_ventanas as TipoVentanas,
    disposicion: supabaseData.disposicion as Disposicion,
    tipo_seguridad: supabaseData.tipo_seguridad as TipoSeguridad,
    areaTotal: supabaseData.area_total,
    areaUsable: supabaseData.area_usable,
    
    // Additional fields
    suites: 0, // Not in DB
    plazasServicio: 0, // Not in DB
    m2Terreno: supabaseData.area_total,
    m2Construidos: supabaseData.area_usable,
    m2Terraza: 0, // Not in DB
    numEstacionamientos: supabaseData.num_estacionamientos,
    numBodegas: supabaseData.num_bodegas,
    estacionamientos: supabaseData.num_estacionamientos,
    bodegas: supabaseData.num_bodegas,
    
    // Construction
    anioConstruccion: supabaseData.anio_construccion,
    fechaConstruccion: supabaseData.fecha_construccion ? new Date(supabaseData.fecha_construccion) : undefined,
    
    // Financial
    gastosComunes: supabaseData.gastos_comunes,
    precioVenta: supabaseData.precio_venta,
    banco: supabaseData.banco as Banco,
    hipoteca: supabaseData.hipoteca,
    deuda: supabaseData.deuda,

    // Flags
    arriendo: supabaseData.arriendo,
    venta: supabaseData.venta,

    // Coordinates
    lat: supabaseData.lat,
    lng: supabaseData.lng,

    // Propietario
    propietarioId: supabaseData.propietario_id,
    propietario: supabaseData.propietario ? {
      id: supabaseData.propietario.id,
      nombre: supabaseData.propietario.nombre,
      email: supabaseData.propietario.email || '',
      telefono: supabaseData.propietario.telefono?.toString() || '',
      codigo_telefonico: supabaseData.propietario.codigo_telefonico || 56,
      documento: supabaseData.propietario.documento || '',
      tipo_documento: supabaseData.propietario.tipo_documento || 'RUT',
      propiedades_asociadas: 0
    } : undefined,
    
    // Amenidades
    amenidades: supabaseData.amenidades ? {
      id: supabaseData.amenidades.id,
      propiedadId: supabaseData.amenidades.propiedad_id,

      // Amenidades básicas
      amoblado: supabaseData.amenidades.amoblado || false,
      cocina: supabaseData.amenidades.cocina || false,
      mascota: supabaseData.amenidades.mascota || false,
      estacionamiento: supabaseData.amenidades.estacionamiento || false,
      balcon: supabaseData.amenidades.balcon || false,
      jardin: supabaseData.amenidades.jardin || false,
      wifi: supabaseData.amenidades.wifi || false,
      garage: supabaseData.amenidades.garage || false,
      zonaFumador: supabaseData.amenidades.zona_fumador || false,
      lavaplatos: supabaseData.amenidades.lavaplatos || false,
      lavadora: supabaseData.amenidades.lavadora || false,
      tvCable: supabaseData.amenidades.tv_cable || false,

      // Amenidades del condominio/edificio
      enCondominio: supabaseData.amenidades.en_condominio || false,
      permiteMascotas: supabaseData.amenidades.permite_mascotas || false,
      piscina: supabaseData.amenidades.piscina || false,
      gimnasio: supabaseData.amenidades.gimnasio || false,
      sauna: supabaseData.amenidades.sauna || false,
      jacuzzi: supabaseData.amenidades.jacuzzi || false,
      canchaTenis: supabaseData.amenidades.cancha_tenis || false,

      // Amenidades adicionales
      recibos: supabaseData.amenidades.recibos || false,
      llavesOficina: supabaseData.amenidades.llaves_oficina || false,
      tieneLetrero: supabaseData.amenidades.tiene_letrero || false,
      bodega: supabaseData.amenidades.bodega || false,
      piezaServicio: supabaseData.amenidades.pieza_servicio || false,
      regularizada: supabaseData.amenidades.regularizada || false,

      // Servicios
      agua: supabaseData.amenidades.agua || false,
      caldera: supabaseData.amenidades.caldera || false,
      gasNatural: supabaseData.amenidades.gas_natural || false,
      luz: supabaseData.amenidades.luz || false,
      alcantarillado: supabaseData.amenidades.alcantarillado || false
    } : undefined,

    // Imagen principal (se asigna después en el servicio)
    imagenPrincipal: null,

    // Timestamps
    createdAt: supabaseData.created_at ? new Date(supabaseData.created_at) : undefined,
    updatedAt: supabaseData.updated_at ? new Date(supabaseData.updated_at) : undefined
  };
  
  return propiedad;
}

/**
 * Map form data to Supabase-compatible structure
 */
export function mapFormToSupabase(formData: any, empresaId: string) {
  // ✅ VALIDACIÓN CRÍTICA: Verificar que propietario_id esté presente
  if (!formData.propietario_id || formData.propietario_id.trim() === '') {
    console.error('❌ mapFormToSupabase: propietario_id is missing or empty!', formData);
    throw new Error('El campo propietario_id es obligatorio y no puede estar vacío');
  }

  console.log('✅ mapFormToSupabase: propietario_id validated:', formData.propietario_id);

  // Handle operacion as array or string
  const operacionArray = Array.isArray(formData.operacion) ? formData.operacion : [formData.operacion];
  const isRenta = operacionArray.includes(TipoOperacion.Renta);
  const isVenta = operacionArray.includes(TipoOperacion.Venta);
  const isRentaTemporal = operacionArray.includes(TipoOperacion.RentaTemporal);

  const propiedad = {
    titulo: formData.titulo,
    tipo: formData.tipo,
    estado: formData.estado || EstadoPropiedad.Disponible,

    // Set arriendo/venta/renta_temporal flags based on operacion array
    arriendo: isRenta,
    venta: isVenta,
    renta_temporal: isRentaTemporal,

    // Set precio_arriendo or precio_venta based on operacion
    // Si tiene ambos, usar el precio para ambos
    precio_arriendo: isRenta || isRentaTemporal ? formData.precio_venta : null,
    precio_venta: isVenta ? formData.precio_venta : null,
    divisa: formData.divisa || Divisa.CLP,
    
    // Location
    direccion: formData.direccion,
    comuna: formData.comuna,
    region: formData.region,
    nombre_calle: formData.nombre_calle || null,
    numero_calle: formData.numero_calle || null,
    unidad: formData.unidad || null,
    letra: formData.letra || null,
    etapa: formData.etapa || null,
    
    // Description
    descripcion: formData.descripcion || null,
    
    // Características
    habitaciones: formData.habitaciones || 0,
    banos: formData.banos || 0,
    piso: formData.piso || null,
    tipo_piso: formData.tipo_piso || null,
    tipo_departamento: formData.tipo_departamento || null,
    recepcion_final: formData.recepcion_final || null,
    orientacion: formData.orientacion || null,
    tipo_agua_caliente: formData.tipo_agua_caliente || null,
    tipo_calefaccion: formData.tipo_calefaccion || null,
    tipo_cocina: formData.tipo_cocina || null,
    tipo_construccion: formData.tipo_construccion || null,
    tipo_ventanas: formData.tipo_ventanas || null,
    disposicion: formData.disposicion || null,
    tipo_seguridad: formData.tipo_seguridad || null,
    area_total: formData.m2_terreno || 0,
    area_usable: formData.m2_construidos || null,
    
    // Additional fields
    num_estacionamientos: formData.num_estacionamientos || null,
    num_bodegas: formData.num_bodegas || null,
    
    // Construction
    anio_construccion: formData.anio_construccion || null,
    fecha_construccion: formData.fecha_construccion || null,
    
    // Financial
    gastos_comunes: formData.gastos_comunes || null,
    banco: formData.banco || null,
    hipoteca: formData.hipoteca || null,
    deuda: formData.deuda || null,

    // Propietario - ✅ Ya validado arriba
    propietario_id: formData.propietario_id,
    empresa_id: empresaId,
    
    // Visibility and location
    visible: true,
    ubicacion_general: false,
    lat: formData.lat || null,
    lng: formData.lng || null,

    // Availability
    disponibilidad_desde: formData.disponible_desde || null,
    permite_mascotas: formData.permite_mascotas || false,
    
    // Media
    url_video: null,
    documentos_requeridos: []
  };
  
  // Build amenidades object if any amenity is selected
  const amenidades = {
    // Amenidades básicas
    amoblado: formData.amoblado || false,
    cocina: formData.cocina || false,
    mascota: formData.permite_mascotas || false,
    estacionamiento: formData.num_estacionamientos > 0,
    balcon: formData.balcon || false,
    jardin: formData.jardin || false,
    wifi: formData.wifi || false,
    garage: formData.garage || false,
    zona_fumador: formData.zona_fumador || false,
    lavaplatos: formData.lavaplatos || false,
    lavadora: formData.lavadora || false,
    tv_cable: formData.tv_cable || false,

    // Amenidades del condominio/edificio
    en_condominio: formData.en_condominio || false,
    permite_mascotas: formData.permite_mascotas || false,
    piscina: formData.piscina || false,
    gimnasio: formData.gimnasio || false,
    sauna: formData.sauna || false,
    jacuzzi: formData.jacuzzi || false,
    cancha_tenis: formData.cancha_tenis || false,

    // Amenidades adicionales
    recibos: formData.recibos || false,
    llaves_oficina: formData.llaves_oficina || false,
    tiene_letrero: formData.tiene_letrero || false,
    bodega: formData.bodega || false,
    pieza_servicio: formData.pieza_servicio || false,
    regularizada: formData.Regularizada || false,

    // Servicios
    agua: formData.agua || false,
    caldera: formData.caldera || false,
    gas_natural: formData.gas_natural || false,
    luz: formData.luz || false,
    alcantarillado: formData.alcantarillado || false
  };
  
  return {
    propiedad,
    amenidades
  };
}
