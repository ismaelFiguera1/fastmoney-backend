import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// Inicialización del cliente de AWS SES
const sesClient = new SESClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

interface DatosEmailTransferencia {
  remitenteEmail: string;
  remitenteNombre: string;
  remitenteApellido: string;
  destinatarioEmail: string;
  destinatarioNombre: string;
  destinatarioApellido: string;
  monto: number;
  moneda: string;
  comision: number;
  totalDescontado: number;
  transferenciaId: number;
  fecha: Date;
}

/**
 * Plantilla HTML base con diseño premium estilo dark mode para los correos
 */
function obtenerBaseHtml(contenido: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FastMoney Notificación</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0914;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0b0914;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #131121;
      border: 1px solid #28244a;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .header {
      background: linear-gradient(135deg, #2b1f54 0%, #171133 100%);
      padding: 30px;
      text-align: center;
      border-bottom: 1px solid #28244a;
    }
    .logo {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #a78bfa;
    }
    .brand-accent {
      color: #f59e0b;
    }
    .content {
      padding: 40px 30px;
    }
    .title {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      margin-top: 0;
      margin-bottom: 10px;
      text-align: center;
    }
    .subtitle {
      font-size: 15px;
      color: #94a3b8;
      margin-bottom: 30px;
      text-align: center;
      line-height: 1.5;
    }
    .amount-box {
      background: rgba(124, 58, 237, 0.08);
      border: 1px solid rgba(124, 58, 237, 0.2);
      border-radius: 12px;
      padding: 24px;
      text-align: center;
      margin-bottom: 30px;
    }
    .amount-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #a78bfa;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .amount-value {
      font-size: 36px;
      font-weight: 800;
    }
    .amount-value.sent {
      color: #f87171;
    }
    .amount-value.received {
      color: #34d399;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .details-table th, .details-table td {
      padding: 12px 0;
      border-bottom: 1px solid #231f3d;
      font-size: 14px;
    }
    .details-table th {
      text-align: left;
      color: #94a3b8;
      font-weight: 500;
    }
    .details-table td {
      text-align: right;
      color: #ffffff;
      font-weight: 600;
    }
    .btn {
      display: block;
      width: 220px;
      margin: 30px auto 10px;
      padding: 14px 24px;
      background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 700;
      text-align: center;
      border-radius: 30px;
      box-shadow: 0 4px 15px rgba(124, 58, 237, 0.4);
    }
    .footer {
      background: #0f0c1b;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      border-top: 1px solid #231f3d;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">Fast<span class="brand-accent">Money</span></div>
      </div>
      <div class="content">
        ${contenido}
      </div>
      <div class="footer">
        <p>Este correo electrónico fue enviado de forma automática por FastMoney.</p>
        <p>&copy; ${new Date().getFullYear()} FastMoney. Todos los derechos reservados.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Envía notificaciones de correo tanto al remitente como al destinatario.
 */
export async function enviarEmailsDeTransferencia(datos: DatosEmailTransferencia): Promise<void> {
  const fromEmail = process.env.AWS_SES_FROM_EMAIL || "capitaldevs.fastmoney@gmail.com";

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.warn(
      "⚠️ Advertencia: AWS_ACCESS_KEY_ID o AWS_SECRET_ACCESS_KEY no están configurados en el archivo .env. " +
      "Se omite el envío de correos de la transferencia."
    );
    return;
  }

  const {
    remitenteEmail,
    remitenteNombre,
    remitenteApellido,
    destinatarioEmail,
    destinatarioNombre,
    destinatarioApellido,
    monto,
    moneda,
    comision,
    totalDescontado,
    transferenciaId,
    fecha,
  } = datos;

  const mSymbol = moneda.toUpperCase();
  const fechaFormateada = new Date(fecha).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  // 1. Correo para el Remitente (quien envía el dinero)
  const htmlRemitenteContent = `
    <h1 class="title">Transferencia Enviada</h1>
    <p class="subtitle">Hola ${remitenteNombre}, tu transferencia se ha procesado con éxito. A continuación encuentras los detalles de tu comprobante.</p>
    
    <div class="amount-box">
      <div class="amount-label">Total Debitado</div>
      <div class="amount-value sent">-${totalDescontado.toFixed(2)} ${mSymbol}</div>
    </div>

    <table class="details-table">
      <tr>
        <th>Destinatario</th>
        <td>${destinatarioNombre} ${destinatarioApellido}</td>
      </tr>
      <tr>
        <th>Monto enviado</th>
        <td>${monto.toFixed(2)} ${mSymbol}</td>
      </tr>
      <tr>
        <th>Comisión (${process.env.COMMISSION_RATE || "1.5"}%)</th>
        <td>${comision.toFixed(2)} ${mSymbol}</td>
      </tr>
      <tr>
        <th>Fecha y Hora</th>
        <td>${fechaFormateada}</td>
      </tr>
      <tr>
        <th>ID de Transacción</th>
        <td>#${transferenciaId}</td>
      </tr>
    </table>

    <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard" class="btn">Ir al Dashboard</a>
  `;

  // 2. Correo para el Destinatario (quien recibe el dinero)
  const htmlDestinatarioContent = `
    <h1 class="title">¡Dinero Recibido!</h1>
    <p class="subtitle">Hola ${destinatarioNombre}, has recibido una transferencia de dinero de un usuario de FastMoney en tu cuenta.</p>
    
    <div class="amount-box">
      <div class="amount-label">Monto Acreditado</div>
      <div class="amount-value received">+${monto.toFixed(2)} ${mSymbol}</div>
    </div>

    <table class="details-table">
      <tr>
        <th>Remitente</th>
        <td>${remitenteNombre} ${remitenteApellido}</td>
      </tr>
      <tr>
        <th>Fecha y Hora</th>
        <td>${fechaFormateada}</td>
      </tr>
      <tr>
        <th>ID de Transacción</th>
        <td>#${transferenciaId}</td>
      </tr>
    </table>

    <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard" class="btn">Revisar mi Saldo</a>
  `;

  const htmlRemitente = obtenerBaseHtml(htmlRemitenteContent);
  const htmlDestinatario = obtenerBaseHtml(htmlDestinatarioContent);

  // Crear comandos de SES
  const remitenteCommand = new SendEmailCommand({
    Destination: { ToAddresses: [remitenteEmail] },
    Message: {
      Body: {
        Html: { Charset: "UTF-8", Data: htmlRemitente },
      },
      Subject: { Charset: "UTF-8", Data: `FastMoney - Tu transferencia de ${monto.toFixed(2)} ${mSymbol} fue enviada` },
    },
    Source: fromEmail,
  });

  const destinatarioCommand = new SendEmailCommand({
    Destination: { ToAddresses: [destinatarioEmail] },
    Message: {
      Body: {
        Html: { Charset: "UTF-8", Data: htmlDestinatario },
      },
      Subject: { Charset: "UTF-8", Data: `FastMoney - ¡Has recibido ${monto.toFixed(2)} ${mSymbol} de ${remitenteNombre}!` },
    },
    Source: fromEmail,
  });

  // Envío en paralelo de forma asíncrona
  try {
    const promises = [
      sesClient.send(remitenteCommand).then(() => console.log(`📧 Correo de transferencia enviado al remitente: ${remitenteEmail}`)),
      sesClient.send(destinatarioCommand).then(() => console.log(`📧 Correo de transferencia enviado al destinatario: ${destinatarioEmail}`)),
    ];
    await Promise.all(promises);
  } catch (error: any) {
    console.error("❌ Error al enviar correos mediante AWS SES:", error.message || error);
  }
}
