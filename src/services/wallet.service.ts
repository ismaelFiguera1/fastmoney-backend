import prisma from "../config/db";
import { obtenerTasas, calcularTotalEnMonedaBase } from "./currency.service";

export async function obtenerSaldos(usuarioId: number) {
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

  const monedaBase = cuenta.monedaBase;

  // Convertimos a number porque Prisma devuelve Decimal, no number
  const saldos = {
    usd: Number(cuenta.saldos.usd),
    eur: Number(cuenta.saldos.eur),
    ars: Number(cuenta.saldos.ars),
    cop: Number(cuenta.saldos.cop),
  };

  const rates = await obtenerTasas(monedaBase);
  const total = calcularTotalEnMonedaBase(saldos, rates);

  return {
    monedaBase,
    saldoTotal: parseFloat(total.toFixed(2)),
    desglose: saldos,
  };
}
