import prisma from "../config/db";

export async function realizarDeposito(usuarioId: number, moneda: string, monto: number) {
  const cuenta = await prisma.cuenta.findUnique({
    where: { usuarioId },
  });

  if (!cuenta) throw new Error("Cuenta no encontrada");

  const campo = moneda.toLowerCase() as "usd" | "eur" | "ars" | "cop";

  await prisma.$transaction([
    prisma.saldoPorMoneda.update({
      where: { cuentaId: cuenta.id },
      data: { [campo]: { increment: monto } },
    }),
    prisma.deposito.create({
      data: {
        cuentaId: cuenta.id,
        moneda,
        monto,
      },
    }),
  ]);
}

export async function obtenerHistorialDepositos(usuarioId: number) {
  const cuenta = await prisma.cuenta.findUnique({
    where: { usuarioId },
  });

  if (!cuenta) throw new Error("Cuenta no encontrada");

  return prisma.deposito.findMany({
    where: { cuentaId: cuenta.id },
    orderBy: { createdAt: "desc" },
  });
}
