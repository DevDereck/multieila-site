// Serverless function (Vercel / Netlify compatible) to send mails via SMTP (Nodemailer).
// Environment variables required:
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, TO_EMAIL
//
// Deploy notes:
// - For Vercel: place this file in /api/send-email.js
// - For Netlify functions: adapt to the handler signature or use Netlify's builder
//
// This example uses CommonJS / Node style and works on Vercel's serverless runtime.

const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const {
    type = 'contact',
    client = {},
    services = [],
    options = {},
    notes = '',
    message = '',
    total = 0
  } = req.body || {};

  // Validate minimal payload
  if (!client || !client.email || !client.name) {
    res.status(400).json({ error: 'Faltan datos del cliente (name, email).' });
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Build email content
  const subject = type === 'quote' ? `Nueva solicitud de cotización - ${client.name}` : `Contacto desde web - ${client.name}`;
  let html = `<h2>${subject}</h2>`;
  html += `<p><strong>Nombre:</strong> ${escapeHtml(client.name)}</p>`;
  html += `<p><strong>Email:</strong> ${escapeHtml(client.email)}</p>`;
  if(client.phone) html += `<p><strong>Teléfono:</strong> ${escapeHtml(client.phone)}</p>`;

  if (type === 'quote') {
    html += `<h3>Servicios solicitados</h3>`;
    if (services && services.length) {
      html += '<ul>';
      services.forEach(s => {
        html += `<li>${escapeHtml(String(s.name))} x${escapeHtml(String(s.qty))} — ${escapeHtml(String(s.unitPrice || ''))}</li>`;
      });
      html += '</ul>';
    } else {
      html += '<p>Ninguno</p>';
    }

    html += `<p><strong>Opciones:</strong> ${options.rush ? 'Servicio urgente, ' : ''}${options.repuestos ? 'Incluye repuestos' : ''}</p>`;
    html += `<p><strong>Total estimado:</strong> ${escapeHtml(String(total))}</p>`;
    if(notes) html += `<h4>Observaciones</h4><p>${escapeHtml(notes)}</p>`;
  } else {
    html += `<h3>Mensaje</h3><p>${escapeHtml(message)}</p>`;
  }

  // send mail
  try {
    const info = await transporter.sendMail({
      from: `"Multieila Web" <${process.env.SMTP_USER}>`,
      to: process.env.TO_EMAIL,
      subject,
      html
    });

    return res.status(200).json({ ok: true, message: 'Correo enviado', info: info.messageId });
  } catch (err) {
    console.error('Error sending email', err);
    return res.status(500).json({ error: 'Error al enviar correo: ' + (err.message || err) });
  }
};

// simple escape to avoid injection in the html preview
function escapeHtml(s){
  if(!s) return '';
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}
