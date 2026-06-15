import prisma from "../config/db";
import { obtenerTasas } from "./currency.service";

export async function obtenerSaldos(usuarioId: number, moneda: string) {
  const cuenta = await prisma.cuenta.findUnique({
    where: { usuarioId },
    include: { saldos: true },
  });

  if (!cuenta) {
    throw new Error("Cuenta no encontrada");
  }

  if (!cuenta.saldos) {
    throw new Error("Saldos no encontrados");
  }

  // Convertimos a number porque Prisma devuelve Decimal, no number
  const saldos = {
    usd: Number(cuenta.saldos.usd),
    eur: Number(cuenta.saldos.eur),
    ars: Number(cuenta.saldos.ars),
    cop: Number(cuenta.saldos.cop),
  };

  const matriz = await obtenerTasas();

  const saldoTotal = parseFloat(
    (
      saldos.usd * matriz["USD"][moneda] +
      saldos.eur * matriz["EUR"][moneda] +
      saldos.ars * matriz["ARS"][moneda] +
      saldos.cop * matriz["COP"][moneda]
    ).toFixed(2)
  );

  return {
    moneda,
    saldoTotal,
    desglose: saldos,
  };
}

export async function obtenerTasasDeCambio() {
  const tasas = await obtenerTasas();
  return { tasas };
}
