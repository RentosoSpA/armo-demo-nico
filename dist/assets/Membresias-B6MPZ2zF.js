import{c as j,j as e,c6 as u,c7 as C,P as k,K as w,bb as p,H as z,M as $,b8 as S,c5 as L,R as P,C as A,a as R,r as h,b7 as f,k as g,B as v,f as E,bu as T,g as N,t as y}from"./index-BmXdxNCh.js";/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]],U=j("award",D);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],F=j("chart-column",V);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M14 2v2",key:"6buw04"}],["path",{d:"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",key:"pwadti"}],["path",{d:"M6 2v2",key:"colzsn"}]],H=j("coffee",I);/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]],O=j("printer",B),Z=({membresia:s,onVerDetalle:o})=>{const l=i=>{const r={activa:{color:"success",text:"Activa"},renovacion_pendiente:{color:"warning",text:"Renovación Pendiente"},suspendida:{color:"error",text:"Suspendida"},cancelada:{color:"default",text:"Cancelada"}}[i]||{color:"default",text:i};return e.jsx(S,{status:r.color,text:r.text})},n=i=>({mensual:"#10b981",flexible:"#3b82f6",oficina_virtual:"#8b5cf6",sala_eventos:"#f59e0b"})[i]||"#6b7280",a=(()=>{var i;if(s.tipo_plan==="flexible"){const r=parseInt(((i=s.nombre_plan.match(/\d+/))==null?void 0:i[0])||"12"),m=Math.floor(Math.random()*r);return{usado:m,total:r,porcentaje:m/r*100,mostrar:!0}}return{mostrar:!1}})(),t=Math.floor(Math.random()*20)+5,b=i=>new Date(i).toLocaleDateString("es-CL",{day:"numeric",month:"short",year:"numeric"});return e.jsxs("div",{className:"membresia-card",onClick:o,children:[e.jsxs("div",{className:"membresia-card-header",children:[e.jsx("div",{className:"membresia-avatar",children:e.jsx(u,{size:24})}),e.jsxs("div",{className:"membresia-info",children:[e.jsx("h3",{className:"membresia-nombre",children:s.nombre_miembro}),e.jsx("p",{className:"membresia-email",children:s.email_miembro})]}),e.jsx("div",{className:"membresia-estado",children:l(s.estado)})]}),e.jsx("div",{className:"membresia-plan",children:e.jsx("span",{className:"plan-badge",style:{backgroundColor:`${n(s.tipo_plan)}20`,color:n(s.tipo_plan)},children:s.nombre_plan})}),e.jsxs("div",{className:"membresia-precio",children:[e.jsx(C,{size:18}),e.jsxs("span",{className:"precio-amount",children:["$",s.precio_mensual.toLocaleString("es-CL")]}),e.jsx("span",{className:"precio-period",children:"/ mes"})]}),a.mostrar&&e.jsxs("div",{className:"membresia-progreso",children:[e.jsxs("div",{className:"progreso-header",children:[e.jsx("span",{className:"progreso-label",children:"Uso del mes"}),e.jsxs("span",{className:"progreso-value",children:[a.usado,"/",a.total," días"]})]}),e.jsx(k,{percent:a.porcentaje,strokeColor:n(s.tipo_plan),showInfo:!1})]}),e.jsxs("div",{className:"membresia-stats",children:[e.jsxs("div",{className:"stat-item",children:[e.jsx(w,{size:16}),e.jsx("span",{children:"Próxima renovación"})]}),e.jsx("div",{className:"stat-value",children:b(s.fecha_renovacion)})]}),e.jsxs("div",{className:"membresia-checkins",children:[e.jsx("span",{className:"checkins-label",children:"Check-ins este mes:"}),e.jsxs("span",{className:"checkins-value",children:[t," visitas"]})]}),e.jsxs("div",{className:"membresia-servicios",children:[e.jsx("span",{className:"servicios-label",children:"Servicios incluidos:"}),e.jsxs("div",{className:"servicios-icons",children:[e.jsx(p,{title:"WiFi alta velocidad",children:e.jsx("div",{className:"servicio-icon",children:"📶"})}),s.tipo_plan!=="oficina_virtual"&&e.jsx(p,{title:"Café ilimitado",children:e.jsx("div",{className:"servicio-icon",children:e.jsx(H,{size:16})})}),e.jsx(p,{title:"Impresora",children:e.jsx("div",{className:"servicio-icon",children:e.jsx(O,{size:16})})}),s.horas_sala_incluidas&&e.jsx(p,{title:`${s.horas_sala_incluidas} hrs de sala`,children:e.jsx("div",{className:"servicio-icon",children:e.jsx(z,{size:16})})}),s.direccion_tributaria&&e.jsx(p,{title:"Dirección tributaria",children:e.jsx("div",{className:"servicio-icon",children:e.jsx($,{size:16})})}),s.acceso_24_7&&e.jsx(p,{title:"Acceso 24/7",children:e.jsx("div",{className:"servicio-icon",children:"🔑"})})]})]})]})},K=({membresias:s})=>{const o=s.filter(a=>a.estado==="activa"),l=o.reduce((a,t)=>a+t.precio_mensual,0),n=o.length>0?l/o.length:0,d=[{icon:e.jsx(u,{size:24}),label:"Miembros Activos",value:o.length,color:"#10b981"},{icon:e.jsx(C,{size:24}),label:"MRR Total",value:`$${(l/1e3).toFixed(0)}K`,color:"#3b82f6"},{icon:e.jsx(L,{size:24}),label:"Retención",value:"95%",color:"#8b5cf6"},{icon:e.jsx(U,{size:24}),label:"Miembro Promedio",value:`$${(n/1e3).toFixed(0)}K`,color:"#f59e0b"}];return e.jsx("div",{className:"membresia-stats-page",children:e.jsx(P,{gutter:[24,24],children:d.map((a,t)=>e.jsx(A,{xs:24,sm:12,lg:6,children:e.jsxs(R,{className:"stat-card",children:[e.jsx("div",{className:"stat-icon",style:{backgroundColor:`${a.color}20`,color:a.color},children:a.icon}),e.jsxs("div",{className:"stat-content",children:[e.jsx("div",{className:"stat-value",children:a.value}),e.jsx("div",{className:"stat-label",children:a.label})]})]})},t))})})};function G(s){const o=new Date().toLocaleDateString("es-CL",{year:"numeric",month:"long",day:"numeric"});return`<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Contrato de Membresía - ${s.nombre_miembro}</title>
  <style>
    body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color: #111827; line-height: 1.6; padding: 32px; }
    .header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
    .brand { font-weight: 700; font-size: 18px; color: #065f46; }
    h1 { font-size: 22px; margin: 0 0 8px; }
    h2 { font-size: 16px; margin: 24px 0 8px; color:#111827 }
    .muted { color:#6b7280; }
    .badge { display:inline-block; padding:4px 8px; border-radius:12px; background:#ecfdf5; color:#065f46; font-weight:600; font-size:12px; }
    .grid { display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
    .card { border:1px solid #e5e7eb; border-radius:12px; padding:16px; background:#fff; }
    .terms { font-size: 12px; color:#4b5563; }
    .footer { margin-top:24px; font-size:12px; color:#6b7280; }
    .sign { margin-top:32px; display:flex; gap:32px; }
    .sign .line { height:1px; background:#e5e7eb; margin-top:32px; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Contrato de Membresía</h1>
      <div class="muted">Fecha: ${o}</div>
    </div>
    <div class="brand">Nube Cowork</div>
  </div>

  <div class="grid">
    <div class="card">
      <h2>Miembro</h2>
      <div><strong>${s.nombre_miembro}</strong></div>
      <div class="muted">${s.email_miembro||""}</div>
    </div>
    <div class="card">
      <h2>Plan</h2>
      <div><strong>${s.nombre_plan}</strong> <span class="badge">${s.tipo_plan}</span></div>
      <div class="muted">Precio mensual: $${s.precio_mensual.toLocaleString("es-CL")}</div>
    </div>
  </div>

  <div class="card" style="margin-top:16px;">
    <h2>Condiciones</h2>
    <ol class="terms">
      <li>El plan se renueva automáticamente cada mes en la misma fecha de contratación.</li>
      <li>El pago se realiza por adelantado. Período no es reembolsable.</li>
      <li>El miembro acepta y respeta las normas de convivencia del espacio.</li>
      <li>Los servicios incluidos: WiFi, café, impresiones razonables y acceso a áreas comunes.</li>
      ${s.horas_sala_incluidas?`<li>Incluye ${s.horas_sala_incluidas} horas de sala de reunión al mes.</li>`:""}
      ${s.tipo_plan==="oficina_virtual"&&s.direccion_tributaria?"<li>Incluye dirección tributaria/comercial y recepción de correspondencia.</li>":""}
      <li>El cowork se reserva el derecho de admisión por conductas inapropiadas.</li>
    </ol>
  </div>

  <div class="sign">
    <div style="flex:1">
      <div class="line"></div>
      <div class="muted">Miembro: ${s.nombre_miembro}</div>
    </div>
    <div style="flex:1">
      <div class="line"></div>
      <div class="muted">Representante: Nube Cowork</div>
    </div>
  </div>

  <div class="footer">Documento generado automáticamente para fines demostrativos.</div>
</body>
</html>`}const q=({membresia:s,visible:o,onClose:l})=>{const[n,d]=h.useState(!1),[a,t]=h.useState(null),b=()=>{const r=G(s);t(r),d(!0)},i=()=>{if(!a)return;const r=new Blob([a],{type:"text/html"}),m=URL.createObjectURL(r),x=document.createElement("a");x.href=m,x.download=`Contrato-Membresia-${s.nombre_miembro}.html`,x.click(),URL.revokeObjectURL(m)};return e.jsxs(e.Fragment,{children:[e.jsx(f,{title:`Detalle de Membresía - ${s.nombre_miembro}`,open:o,onCancel:l,footer:e.jsxs(g,{children:[e.jsx(v,{onClick:l,children:"Cerrar"}),e.jsx(v,{type:"primary",onClick:b,children:"Generar contrato demo"})]}),width:800,children:e.jsxs("div",{style:{padding:"20px 0"},children:[e.jsxs("p",{children:["Nombre: ",s.nombre_miembro]}),e.jsxs("p",{children:["Email: ",s.email_miembro]}),e.jsxs("p",{children:["Plan: ",s.nombre_plan]}),e.jsxs("p",{children:["Precio: $",s.precio_mensual.toLocaleString("es-CL")]}),e.jsxs("p",{children:["Estado: ",s.estado]})]})}),e.jsx(f,{title:"Vista previa de contrato",open:n,onCancel:()=>d(!1),footer:e.jsxs(g,{children:[e.jsx(v,{onClick:()=>d(!1),children:"Cerrar"}),e.jsx(p,{title:"Descarga archivo HTML (demo)",children:e.jsx(v,{type:"primary",onClick:i,children:"Descargar"})})]}),width:900,children:e.jsx("div",{style:{border:"1px solid rgba(0,0,0,0.06)",borderRadius:8,overflow:"hidden"},children:e.jsx("iframe",{title:"preview",srcDoc:a||"",style:{width:"100%",height:600,border:"none"}})})})]})},W=[{id:"mem-001",empresa_id:"empresa-nubecowork",espacio_id:"esp-003",miembro_id:"miem-001",nombre_miembro:"Juan Pérez González",email_miembro:"juan.perez@email.com",telefono_miembro:"+56912345678",tipo_plan:"flexible",nombre_plan:"Escritorio Flexible - 8 días",estado:"renovacion_pendiente",precio_mensual:8e4,divisa:"CLP",fecha_inicio:"2025-01-01",fecha_renovacion:"2025-02-15",horas_sala_incluidas:2,acceso_24_7:!1,direccion_tributaria:!1,recepcion_correspondencia:!1,observaciones:"Renovación pendiente en 15 días",createdAt:"2025-01-01T10:00:00Z",updatedAt:"2025-01-20T15:30:00Z"},{id:"mem-003",empresa_id:"empresa-nubecowork",espacio_id:"esp-001",miembro_id:"miem-003",nombre_miembro:"Tech Startup SpA",email_miembro:"contacto@techstartup.cl",telefono_miembro:"+56934567890",tipo_plan:"mensual",nombre_plan:"Oficina Privada 201",estado:"activa",precio_mensual:45e4,divisa:"CLP",fecha_inicio:"2024-08-01",fecha_renovacion:"2025-02-01",horas_sala_incluidas:10,acceso_24_7:!0,direccion_tributaria:!0,recepcion_correspondencia:!0,observaciones:"Contrato de 6 meses. Cliente premium.",createdAt:"2024-08-01T08:00:00Z",updatedAt:"2025-01-10T16:00:00Z"},{id:"mem-004",empresa_id:"empresa-nubecowork",espacio_id:"esp-006",miembro_id:"miem-004",nombre_miembro:"Consultora ABC Ltda",email_miembro:"info@consultoraabc.cl",telefono_miembro:"+56945678901",tipo_plan:"oficina_virtual",nombre_plan:"Oficina Virtual Premium",estado:"activa",precio_mensual:75e3,divisa:"CLP",fecha_inicio:"2024-11-01",fecha_renovacion:"2025-02-01",horas_sala_incluidas:10,acceso_24_7:!1,direccion_tributaria:!0,recepcion_correspondencia:!0,observaciones:"Usa principalmente la dirección tributaria y salas de reunión",createdAt:"2024-11-01T10:30:00Z",updatedAt:"2025-01-18T14:20:00Z"}],Q=()=>{const{message:s}=E.useApp(),[o,l]=h.useState(!0),[n,d]=h.useState([]),[a,t]=h.useState(null),[b,i]=h.useState(!1);h.useEffect(()=>{r()},[]);const r=async()=>{try{l(!0),await new Promise(c=>setTimeout(c,500)),d(W)}catch(c){console.error("Error cargando membresías:",c),s.error("Error al cargar las membresías")}finally{l(!1)}},m=c=>{t(c),i(!0)},x=()=>{i(!1),t(null)},M=n.filter(c=>c.estado==="activa"),_=n.filter(c=>c.estado==="renovacion_pendiente");return e.jsxs("div",{className:"membresias-page",children:[e.jsxs("div",{className:"membresias-header",children:[e.jsx("h1",{className:"membresias-title",children:"💼 Membresías"}),e.jsx("p",{className:"membresias-subtitle",children:"Gestiona las membresías activas de tus miembros"})]}),e.jsx(T,{defaultActiveKey:"activas",className:"membresias-tabs",items:[{key:"activas",label:e.jsxs("span",{className:"tab-label",children:[e.jsx(u,{size:16}),e.jsxs("span",{children:["Activas (",M.length,")"]})]}),children:e.jsx("div",{className:"membresias-content",children:o?e.jsxs("div",{className:"membresias-loading",children:[e.jsx(N,{size:"large"}),e.jsx("p",{children:"Cargando membresías..."})]}):e.jsxs(e.Fragment,{children:[_.length>0&&e.jsxs("div",{className:"membresias-alert",children:[e.jsx("span",{className:"alert-icon",children:"⏰"}),e.jsxs("span",{className:"alert-text",children:["Tienes ",_.length," membresía(s) pendiente(s) de renovación"]})]}),e.jsx("div",{className:"membresias-grid",children:n.map(c=>e.jsx(Z,{membresia:c,onVerDetalle:()=>m(c)},c.id))}),n.length===0&&e.jsxs("div",{className:"membresias-empty",children:[e.jsx(u,{size:48}),e.jsx("p",{children:"No hay membresías activas"})]})]})})},{key:"estadisticas",label:e.jsxs("span",{className:"tab-label",children:[e.jsx(F,{size:16}),e.jsx("span",{children:"Estadísticas"})]}),children:e.jsx("div",{className:"membresias-content",children:o?e.jsx("div",{className:"membresias-loading",children:e.jsx(N,{size:"large"})}):e.jsx(K,{membresias:n})})},{key:"contratos",label:e.jsxs("span",{className:"tab-label",children:[e.jsx(y,{size:16}),e.jsx("span",{children:"Contratos"})]}),children:e.jsx("div",{className:"membresias-content",children:e.jsxs("div",{className:"contratos-section",children:[e.jsx("h3",{children:"📄 Documentos legales"}),e.jsx("p",{className:"section-subtitle",children:"Contratos firmados y plantillas disponibles"}),e.jsxs("div",{className:"contratos-placeholder",children:[e.jsx(y,{size:64}),e.jsx("p",{children:"Sección de contratos próximamente"}),e.jsx("small",{children:"Aquí podrás ver todos los contratos firmados y generar nuevos"})]})]})})}]}),a&&e.jsx(q,{membresia:a,visible:b,onClose:x})]})};export{Q as default};
