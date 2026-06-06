import prisma from "../config/db";

export async function obtenerSaldos(usuarioId: number) {
  debugger;
  const cuenta = await prisma.cuenta.findUnique({
    where: { usuarioId },
    include: { saldos: true },
  });

  if (!cuenta) {
    throw new Error("Cuenta no encontrada");
  }

  const monedaBase = cuenta.monedaBase.toLowerCase() as
    | "usd"
    | "eur"
    | "ars"
    | "cop";

  return {
    monedaBase: cuenta.monedaBase,
    saldo: cuenta.saldos?.[monedaBase] ?? 0,
  };
}
