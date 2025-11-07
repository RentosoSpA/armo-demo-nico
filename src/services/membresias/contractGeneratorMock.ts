import type { Membresia } from '../../presets/coworking/types/membresia';

export function generateMembershipContractHTML(m: Membresia): string {
  const today = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Contrato de Membresía - ${m.nombre_miembro}</title>
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
      <div class="muted">Fecha: ${today}</div>
    </div>
    <div class="brand">Nube Cowork</div>
  </div>

  <div class="grid">
    <div class="card">
      <h2>Miembro</h2>
      <div><strong>${m.nombre_miembro}</strong></div>
      <div class="muted">${m.email_miembro || ''}</div>
    </div>
    <div class="card">
      <h2>Plan</h2>
      <div><strong>${m.nombre_plan}</strong> <span class="badge">${m.tipo_plan}</span></div>
      <div class="muted">Precio mensual: $${m.precio_mensual.toLocaleString('es-CL')}</div>
    </div>
  </div>

  <div class="card" style="margin-top:16px;">
    <h2>Condiciones</h2>
    <ol class="terms">
      <li>El plan se renueva automáticamente cada mes en la misma fecha de contratación.</li>
      <li>El pago se realiza por adelantado. Período no es reembolsable.</li>
      <li>El miembro acepta y respeta las normas de convivencia del espacio.</li>
      <li>Los servicios incluidos: WiFi, café, impresiones razonables y acceso a áreas comunes.</li>
      ${m.horas_sala_incluidas ? `<li>Incluye ${m.horas_sala_incluidas} horas de sala de reunión al mes.</li>` : ''}
      ${m.tipo_plan === 'oficina_virtual' && m.direccion_tributaria ? '<li>Incluye dirección tributaria/comercial y recepción de correspondencia.</li>' : ''}
      <li>El cowork se reserva el derecho de admisión por conductas inapropiadas.</li>
    </ol>
  </div>

  <div class="sign">
    <div style="flex:1">
      <div class="line"></div>
      <div class="muted">Miembro: ${m.nombre_miembro}</div>
    </div>
    <div style="flex:1">
      <div class="line"></div>
      <div class="muted">Representante: Nube Cowork</div>
    </div>
  </div>

  <div class="footer">Documento generado automáticamente para fines demostrativos.</div>
</body>
</html>`;
}
