import{bO as g,bH as d,s as m}from"./index-BmXdxNCh.js";function h(e){return{id:e.id,titulo:e.titulo,tipo:e.tipo,estado:e.estado,direccion:e.direccion||"",habitaciones:e.habitaciones||0,banos:e.banos||0,areaTotal:e.area_total||0,operacion:(()=>{const i=[];return e.arriendo&&i.push(d.Renta),e.venta&&i.push(d.Venta),e.renta_temporal&&i.push(d.RentaTemporal),i.length>0?i:[d.Venta]})(),precio:e.arriendo?e.precio_arriendo:e.precio_venta,divisa:e.divisa||g.CLP,arriendo:e.arriendo,venta:e.venta,propietario:e.propietario?{id:e.propietario.id,nombre:e.propietario.nombre,email:"",telefono:"",codigo_telefonico:56,documento:"",tipo_documento:"RUT",propiedades_asociadas:0}:void 0,imagenPrincipal:null}}const f=async e=>{var i,a,l;try{console.log("🔧 getPropiedades: Called with empresaId:",e),console.time("⏱️ getPropiedades total"),console.time("⏱️ Parallel queries");const[t,n]=await Promise.all([m.from("propiedad").select(`
          id,
          titulo,
          tipo,
          estado,
          direccion,
          habitaciones,
          banos,
          area_total,
          arriendo,
          venta,
          precio_arriendo,
          precio_venta,
          divisa,
          propietario!inner(id, nombre)
        `).eq("empresa_id",e).order("created_at",{ascending:!1}),m.from("propiedad_imagenes").select("propiedad_id, url, tipo_imagen, orden").order("orden",{ascending:!0})]);if(console.timeEnd("⏱️ Parallel queries"),console.log("📊 Images query result:",{error:n.error,count:(i=n.data)==null?void 0:i.length,sample:(a=n.data)==null?void 0:a.slice(0,3)}),t.error)throw t.error;const p=t.data||[];if(p.length===0)return console.timeEnd("⏱️ getPropiedades total"),[];console.time("⏱️ Image mapping");const r=new Map;(n.data||[]).forEach(o=>{o.tipo_imagen==="principal"&&!r.has(o.propiedad_id)&&r.set(o.propiedad_id,o.url)}),(n.data||[]).forEach(o=>{r.has(o.propiedad_id)||r.set(o.propiedad_id,o.url)}),console.log("🗺️ Image map created:",{totalImages:(l=n.data)==null?void 0:l.length,propertiesWithImages:r.size,mapEntries:Array.from(r.entries()).slice(0,3)}),console.timeEnd("⏱️ Image mapping"),console.time("⏱️ Data mapping");const c=p.map(o=>{const s=h(o);return s.imagenPrincipal=r.get(o.id)||null,s});return console.timeEnd("⏱️ Data mapping"),console.timeEnd("⏱️ getPropiedades total"),console.log(`✅ getPropiedades: Loaded ${c.length} properties`),c}catch(t){throw console.error("❌ getPropiedades: Error fetching propiedades:",t),t}};export{f as getPropiedades};
