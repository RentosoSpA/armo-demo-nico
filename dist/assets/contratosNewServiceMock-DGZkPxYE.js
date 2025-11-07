const m=[{id:"plt-1",titulo:"Contrato Arriendo Estándar",tipo:"Arriendo",html:`<div style="font-family: 'Poppins', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
      <h1 style="text-align: center; margin-bottom: 30px;">CONTRATO DE ARRIENDO</h1>
      <p><strong>ARRENDADOR:</strong> {{empresa.nombre}}</p>
      <p><strong>ARRENDATARIO:</strong> {{prospecto.nombre}}, identificado con documento {{prospecto.doc}}</p>
      <p><strong>INMUEBLE:</strong> {{propiedad.direccion}}, {{propiedad.ciudad}}</p>
      <p><strong>CANON MENSUAL:</strong> {{propiedad.moneda}} {{propiedad.canon_mensual}}</p>
      <p><strong>DÍA DE PAGO:</strong> {{propiedad.dia_pago}} de cada mes</p>
      <p><strong>FECHA:</strong> {{fecha.hoy}}</p>
      <h2>CLÁUSULAS</h2>
      <p>El presente contrato se celebra entre las partes mencionadas para el arrendamiento del inmueble ubicado en {{propiedad.direccion}}...</p>
    </div>`,updatedAt:"2025-01-15",source:"auto"},{id:"plt-2",titulo:"Contrato Compraventa Inmueble",tipo:"Compra",html:`<div style="font-family: 'Poppins', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
      <h1 style="text-align: center; margin-bottom: 30px;">CONTRATO DE COMPRAVENTA</h1>
      <p><strong>VENDEDOR:</strong> {{empresa.nombre}}</p>
      <p><strong>COMPRADOR:</strong> {{prospecto.nombre}}, con email {{prospecto.email}}</p>
      <p><strong>INMUEBLE:</strong> {{propiedad.titulo}} - {{propiedad.direccion}}</p>
      <p><strong>PRECIO:</strong> {{propiedad.moneda}} {{propiedad.canon_mensual}}</p>
      <p><strong>FECHA:</strong> {{fecha.hoy}}</p>
      <h2>OBJETO DEL CONTRATO</h2>
      <p>El vendedor transfiere al comprador la propiedad del inmueble ubicado en {{propiedad.ciudad}}...</p>
    </div>`,updatedAt:"2025-01-20",source:"auto"},{id:"plt-3",titulo:"Contrato Encargo Venta",tipo:"Encargo",html:`<div style="font-family: 'Poppins', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
      <h1 style="text-align: center; margin-bottom: 30px;">CONTRATO DE ENCARGO DE VENTA</h1>
      <p><strong>INMOBILIARIA:</strong> {{empresa.nombre}}</p>
      <p><strong>PROPIETARIO:</strong> {{prospecto.nombre}}, teléfono {{prospecto.telefono}}</p>
      <p><strong>PROPIEDAD:</strong> {{propiedad.titulo}}</p>
      <p><strong>UBICACIÓN:</strong> {{propiedad.direccion}}, {{propiedad.ciudad}}</p>
      <p><strong>FECHA:</strong> {{fecha.hoy}}</p>
      <h2>OBJETO</h2>
      <p>El propietario encarga a {{empresa.nombre}} la gestión de venta de la propiedad mencionada...</p>
    </div>`,updatedAt:"2025-01-10",source:"manual"},{id:"plt-4",titulo:"Anexo Modificación Contrato",tipo:"Otro",html:`<div style="font-family: 'Poppins', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
      <h1 style="text-align: center; margin-bottom: 30px;">ANEXO MODIFICATORIO</h1>
      <p><strong>ENTRE:</strong> {{empresa.nombre}} y {{prospecto.nombre}}</p>
      <p><strong>PROPIEDAD:</strong> {{propiedad.direccion}}</p>
      <p><strong>FECHA:</strong> {{fecha.hoy}}</p>
      <h2>MODIFICACIONES</h2>
      <p>Las partes acuerdan modificar los siguientes aspectos del contrato original...</p>
    </div>`,updatedAt:"2024-12-28",source:"auto"}],u=[],p=[{id:"prop-1",titulo:"Apartamento Centro Histórico",direccion:"Calle 10 #5-25",ciudad:"Bogotá",canon_mensual:25e5,moneda:"COP",dia_pago:5},{id:"prop-2",titulo:"Casa Campestre Norte",direccion:"Km 3 Vía La Calera",ciudad:"La Calera",canon_mensual:4e6,moneda:"COP",dia_pago:1},{id:"prop-3",titulo:"Oficina Zona Rosa",direccion:"Carrera 13 #85-40",ciudad:"Bogotá",canon_mensual:32e5,moneda:"COP",dia_pago:10},{id:"prop-4",titulo:"Apartaestudio Chapinero",direccion:"Calle 63 #7-15",ciudad:"Bogotá",canon_mensual:18e5,moneda:"COP",dia_pago:15},{id:"prop-5",titulo:"Local Comercial Usaquén",direccion:"Carrera 7 #116-30",ciudad:"Bogotá",canon_mensual:55e5,moneda:"COP",dia_pago:5}],s=[{id:"pros-1",nombre:"Carlos Rodríguez",doc:"1234567890",telefono:"573001234567",email:"carlos.rodriguez@email.com"},{id:"pros-2",nombre:"María González",doc:"9876543210",telefono:"573109876543",email:"maria.gonzalez@email.com"},{id:"pros-3",nombre:"Juan Martínez",doc:"5555555555",telefono:"573205555555",email:"juan.martinez@email.com"},{id:"pros-4",nombre:"Ana López",doc:"7777777777",telefono:"573157777777",email:"ana.lopez@email.com"},{id:"pros-5",nombre:"Pedro Sánchez",doc:"9999999999",telefono:"573009999999",email:"pedro.sanchez@email.com"}],l=[...u],d=[...m];async function g(){return await new Promise(o=>setTimeout(o,200)),d}async function O(o){await new Promise(t=>setTimeout(t,800));const e={id:`plt-upload-${Date.now()}`,titulo:o.name.replace(/\.(docx|pdf)$/i,""),tipo:"Otro",html:`<div style="font-family: 'Poppins', sans-serif; padding: 40px;">
      <h1>Documento importado: ${o.name}</h1>
      <p><strong>Propietario:</strong> {{prospecto.nombre}}</p>
      <p><strong>Propiedad:</strong> {{propiedad.titulo}}</p>
      <p><strong>Fecha:</strong> {{fecha.hoy}}</p>
      <p>Contenido del documento convertido...</p>
    </div>`,updatedAt:new Date().toISOString().split("T")[0],source:"upload"};return d.push(e),e}async function C(o,e,t){await new Promise(a=>setTimeout(a,500));const n=d.find(a=>a.id===o);if(!n)throw new Error("Plantilla no encontrada");const i=p.find(a=>a.id===e),r=s.find(a=>a.id===t),c={id:`ctr-${Date.now()}`,propiedadId:e,prospectoId:t,plantillaId:o,titulo:`${n.titulo} - ${(i==null?void 0:i.titulo)||"Propiedad"} - ${(r==null?void 0:r.nombre)||"Cliente"}`,html:n.html,estado:"Pendiente",createdAt:new Date().toISOString()};return l.push(c),c}async function f(o,e){await new Promise(n=>setTimeout(n,300));const t=l.find(n=>n.id===o);t&&(t.html=e)}async function h(o){return await new Promise(e=>setTimeout(e,200)),`https://rentoso.app/contratos/view/${o}?token=mock-token-${Date.now()}`}function A(o,e,t){const n=o.replace(/\D/g,""),i=t||`Te comparto el contrato: ${e}`,r=encodeURIComponent(i);window.open(`https://wa.me/${n}?text=${r}`,"_blank")}async function P(o){return await new Promise(e=>setTimeout(e,100)),p.find(e=>e.id===o)}async function E(o){return await new Promise(e=>setTimeout(e,100)),s.find(e=>e.id===o)}async function w(){return await new Promise(o=>setTimeout(o,150)),p}async function T(){return await new Promise(o=>setTimeout(o,150)),s}export{w as a,T as b,C as c,E as d,P as g,g as l,h as m,A as o,f as s,O as u};
