import prisma from "../config/db";
import { enviarEmailsDeTransferencia } from "./email.service";

const MONEDAS_VALIDAS = ["usd", "eur", "ars", "cop"] as const;
type Moneda = (typeof MONEDAS_VALIDAS)[number];

export async function realizarTransferencia(
  usuarioId: number,
  codigoCuentaDestino: string,
  moneda: string,
  monto: number
) {
  const monedaLower = moneda.toLowerCase();

  if (!MONEDAS_VALIDAS.includes(monedaLower as Moneda)) {
    throw new Error("Moneda no válida. Usa: USD, EUR, ARS o COP");
  }

  // Buscar cuenta del remitente
  const cuentaOrigen = await prisma.cuenta.findUnique({
    where: { usuarioId },
    include: { saldos: true, usuario: true },
  });

  if (!cuentaOrigen || !cuentaOrigen.saldos) {
    throw new Error("Cuenta de origen no encontrada");
  }

  // Buscar cuenta del destinatario por codigoCuenta
  const cuentaDestino = await prisma.cuenta.findUnique({
    where: { codigoCuenta: codigoCuentaDestino },
    include: { usuario: true },
  });

  if (!cuentaDestino) {
    throw new Error("Cuenta de destino no encontrada");
  }

  // No se puede transferir a uno mismo
  if (cuentaOrigen.id === cuentaDestino.id) {
    throw new Error("No puedes transferirte dinero a ti mismo");
  }

  // Calcular comisión: COMMISSION_RATE es un porcentaje (ej: 1.5 = 1.5%)
  const tasaComision =
    parseFloat(process.env.COMMISSION_RATE ?? "1.5") / 100;
  const comision = monto * tasaComision;
  const totalDescontado = monto + comision;

  // Comprobar saldo suficiente (monto + comisión)
  const saldoDisponible = Number(
    cuentaOrigen.saldos[monedaLower as Moneda]
  );

  if (saldoDisponible < totalDescontado) {
    throw new Error(
      `Saldo insuficiente. Necesitas ${totalDescontado.toFixed(2)} ${moneda.toUpperCase()} (monto + comisión) y tienes ${saldoDisponible.toFixed(2)}`
    );
  }

  // Ejecutar todo dentro de una transacción
  const transferencia = await prisma.$transaction(async (tx) => {
    // Restar monto + comisión al remitente
    await tx.saldoPorMoneda.update({
      where: { cuentaId: cuentaOrigen.id },
      data: { [monedaLower]: { decrement: totalDescontado } } as any,
    });

    // Sumar monto al destinatario
    await tx.saldoPorMoneda.update({
      where: { cuentaId: cuentaDestino.id },
      data: { [monedaLower]: { increment: monto } } as any,
    });

    // Registrar la transferencia
    return tx.transferencia.create({
      data: {
        cuentaOrigenId: cuentaOrigen.id,
        cuentaDestinoId: cuentaDestino.id,
        moneda: monedaLower,
        monto: monto,
        comision: comision,
      },
    });
  });

  // Enviar correos en segundo plano de manera segura (sin bloquear la respuesta de la API)
  enviarEmailsDeTransferencia({
    remitenteEmail: cuentaOrigen.usuario.email,
    remitenteNombre: cuentaOrigen.usuario.nombre,
    remitenteApellido: cuentaOrigen.usuario.apellido,
    destinatarioEmail: cuentaDestino.usuario.email,
    destinatarioNombre: cuentaDestino.usuario.nombre,
    destinatarioApellido: cuentaDestino.usuario.apellido,
    monto: monto,
    moneda: moneda,
    comision: comision,
    totalDescontado: totalDescontado,
    transferenciaId: transferencia.id,
    fecha: transferencia.createdAt,
  }).catch((err) => {
    console.error("❌ Error de fondo al enviar correos de la transferencia:", err);
  });

  return {
    mensaje: "Transferencia realizada correctamente",
    detalle: {
      montoEnviado: monto,
      comision: parseFloat(comision.toFixed(2)),
      totalDescontado: parseFloat(totalDescontado.toFixed(2)),
      moneda: moneda.toUpperCase(),
      transferenciaId: transferencia.id,
      fecha: transferencia.createdAt,
      // ✅ ÚNICO CAMBIO: agregar nombre del destinatario
      nombreDestinatario: `${cuentaDestino.usuario.nombre} ${cuentaDestino.usuario.apellido}`,
    },
  };
}

export async function obtenerHistorial(usuarioId: number) {
  const cuenta = await prisma.cuenta.findUnique({
    where: { usuarioId },
  });

  if (!cuenta) {
    throw new Error("Cuenta no encontrada");
  }

  const transferencias = await prisma.transferencia.findMany({
    where: {
      OR: [{ cuentaOrigenId: cuenta.id }, { cuentaDestinoId: cuenta.id }],
    },
    include: {
      cuentaOrigen: { include: { usuario: true } },
      cuentaDestino: { include: { usuario: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return transferencias.map((t) => ({
    id: t.id,
    tipo: t.cuentaOrigenId === cuenta.id ? "ENVIADA" : "RECIBIDA",
    moneda: t.moneda.toUpperCase(),
    monto: Number(t.monto),
    comision: Number(t.comision),
    contraparte:
      t.cuentaOrigenId === cuenta.id
        ? {
            nombre: t.cuentaDestino.usuario.nombre,
            apellido: t.cuentaDestino.usuario.apellido,
          }
        : {
            nombre: t.cuentaOrigen.usuario.nombre,
            apellido: t.cuentaOrigen.usuario.apellido,
          },
    fecha: t.createdAt,
  }));
}