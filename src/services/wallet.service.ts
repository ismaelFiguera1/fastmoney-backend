import prisma from "../config/db";
import { obtenerTasas } from "./currency.service";

async function obtenerCuentaConSaldos(usuarioId: number) {
  const cuenta = await prisma.cuenta.findUnique({
    where: { usuarioId },
    include: { saldos: true },
  });

  if (!cuenta) throw new Error("Cuenta no encontrada");
  if (!cuenta.saldos) throw new Error("Saldos no encontrados");

  // Prisma devuelve Decimal, lo convertimos a number
  return {
    usd: Number(cuenta.saldos.usd),
    eur: Number(cuenta.saldos.eur),
    ars: Number(cuenta.saldos.ars),
    cop: Number(cuenta.saldos.cop),
  };
}

export async function obtenerSaldos(usuarioId: number, moneda: string) {
  const saldos = await obtenerCuentaConSaldos(usuarioId);
  const matriz = await obtenerTasas();

  const saldoTotal = parseFloat(
    (
      saldos.usd * matriz["USD"][moneda] +
      saldos.eur * matriz["EUR"][moneda] +
      saldos.ars * matriz["ARS"][moneda] +
      saldos.cop * matriz["COP"][moneda]
    ).toFixed(2)
  );

  return { moneda, saldoTotal };
}

export async function obtenerDesglose(usuarioId: number) {
  return await obtenerCuentaConSaldos(usuarioId);
}

export async function obtenerTasasDeCambio() {
  const tasas = await obtenerTasas();
  return { tasas };
}
