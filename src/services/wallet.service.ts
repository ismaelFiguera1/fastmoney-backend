import prisma from "../config/db";
import { obtenerTasas } from "./currency.service";

const MONEDAS_VALIDAS = ["usd", "eur", "ars", "cop"] as const;
type Moneda = (typeof MONEDAS_VALIDAS)[number];

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

export async function convertirSaldo(
  usuarioId: number,
  desdeMoneda: string,
  haciaMoneda: string,
  monto: number
) {
  const desde = desdeMoneda.toLowerCase();
  const hacia = haciaMoneda.toLowerCase();

  if (!MONEDAS_VALIDAS.includes(desde as Moneda) || !MONEDAS_VALIDAS.includes(hacia as Moneda)) {
    throw new Error("Moneda no válida. Usa: USD, EUR, ARS o COP");
  }

  if (desde === hacia) {
    throw new Error("Las monedas de origen y destino deben ser distintas");
  }

  const cuenta = await prisma.cuenta.findUnique({
    where: { usuarioId },
    include: { saldos: true },
  });

  if (!cuenta || !cuenta.saldos) throw new Error("Cuenta no encontrada");

  const saldoDisponible = Number(cuenta.saldos[desde as Moneda]);

  if (monto <= 0) throw new Error("El monto debe ser mayor que 0");
  if (monto > saldoDisponible) throw new Error("Saldo insuficiente");

  // Consultamos la tasa real: cuántas unidades de "hacia" vale 1 unidad de "desde"
  const matriz = await obtenerTasas();
  const tasa = matriz[desde.toUpperCase()][hacia.toUpperCase()];
  const montoConvertido = parseFloat((monto * tasa).toFixed(2));

  // Descontamos de la moneda origen y sumamos en la moneda destino
  await prisma.$transaction([
    prisma.saldoPorMoneda.update({
      where: { cuentaId: cuenta.id },
      data: { [desde]: { decrement: monto } },
    }),
    prisma.saldoPorMoneda.update({
      where: { cuentaId: cuenta.id },
      data: { [hacia]: { increment: montoConvertido } },
    }),
  ]);

  return {
    desdeMoneda: desde.toUpperCase(),
    haciaMoneda: hacia.toUpperCase(),
    montoOriginal: monto,
    montoConvertido,
    tasa,
  };
}
