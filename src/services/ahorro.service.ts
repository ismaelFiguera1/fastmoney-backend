import prisma from "../config/db";

export async function obtenerMeta(usuarioId: number) {
  const cuenta = await prisma.cuenta.findUnique({
    where: { usuarioId },
    include: { metaAhorro: true },
  });

  if (!cuenta) throw new Error("Cuenta no encontrada");

  return cuenta.metaAhorro || null;
}

export async function crearMeta(
  usuarioId: number,
  datos: { nombre: string; limite: number; divisa: string; imagen?: string }
) {
  const cuenta = await prisma.cuenta.findUnique({
    where: { usuarioId },
    include: { metaAhorro: true },
  });

  if (!cuenta) throw new Error("Cuenta no encontrada");

  if (cuenta.metaAhorro) throw new Error("Ya tienes una meta de ahorro activa");

  const meta = await prisma.metaAhorro.create({
    data: {
      cuentaId: cuenta.id,
      nombre: datos.nombre,
      limite: datos.limite,
      divisa: datos.divisa.toUpperCase(),
      imagen: datos.imagen || null,
      saldoAhorrado: 0,
    },
  });

  return meta;
}

export async function aportarAMeta(usuarioId: number, monto: number) {
  const cuenta = await prisma.cuenta.findUnique({
    where: { usuarioId },
    include: { metaAhorro: true, saldos: true },
  });

  if (!cuenta) throw new Error("Cuenta no encontrada");
  if (!cuenta.metaAhorro) throw new Error("No tienes ninguna meta de ahorro activa");
  if (!cuenta.saldos) throw new Error("No se encontraron saldos");

  const campo = cuenta.metaAhorro.divisa.toLowerCase() as "usd" | "eur" | "ars" | "cop";
  const saldoActual = Number(cuenta.saldos[campo]);

  if (monto > saldoActual) throw new Error("Saldo disponible insuficiente");

  // Ambas operaciones en una transacción: si una falla, la otra se deshace
  await prisma.$transaction([
    prisma.saldoPorMoneda.update({
      where: { cuentaId: cuenta.id },
      data: { [campo]: { decrement: monto } },
    }),
    prisma.metaAhorro.update({
      where: { cuentaId: cuenta.id },
      data: { saldoAhorrado: { increment: monto } },
    }),
  ]);

  return await prisma.metaAhorro.findUnique({ where: { cuentaId: cuenta.id } });
}

export async function retirarDeMeta(usuarioId: number, monto: number) {
  const cuenta = await prisma.cuenta.findUnique({
    where: { usuarioId },
    include: { metaAhorro: true, saldos: true },
  });

  if (!cuenta) throw new Error("Cuenta no encontrada");
  if (!cuenta.metaAhorro) throw new Error("No tienes ninguna meta de ahorro activa");

  const saldoAhorrado = Number(cuenta.metaAhorro.saldoAhorrado);

  if (monto > saldoAhorrado) throw new Error("Saldo ahorrado insuficiente");

  const campo = cuenta.metaAhorro.divisa.toLowerCase() as "usd" | "eur" | "ars" | "cop";

  await prisma.$transaction([
    prisma.metaAhorro.update({
      where: { cuentaId: cuenta.id },
      data: { saldoAhorrado: { decrement: monto } },
    }),
    prisma.saldoPorMoneda.update({
      where: { cuentaId: cuenta.id },
      data: { [campo]: { increment: monto } },
    }),
  ]);

  return await prisma.metaAhorro.findUnique({ where: { cuentaId: cuenta.id } });
}

export async function eliminarMeta(usuarioId: number) {
  const cuenta = await prisma.cuenta.findUnique({
    where: { usuarioId },
    include: { metaAhorro: true, saldos: true },
  });

  if (!cuenta) throw new Error("Cuenta no encontrada");
  if (!cuenta.metaAhorro) throw new Error("No tienes ninguna meta de ahorro activa");

  // Si hay saldo ahorrado, se reembolsa al saldo disponible antes de eliminar
  const saldoAhorrado = Number(cuenta.metaAhorro.saldoAhorrado);
  if (saldoAhorrado > 0 && cuenta.saldos) {
    const campo = cuenta.metaAhorro.divisa.toLowerCase() as "usd" | "eur" | "ars" | "cop";
    await prisma.saldoPorMoneda.update({
      where: { cuentaId: cuenta.id },
      data: { [campo]: { increment: saldoAhorrado } },
    });
  }

  await prisma.metaAhorro.delete({
    where: { cuentaId: cuenta.id },
  });
}
