import prisma from "../config/db";

export async function crearNotificacion(
  usuarioId: number,
  tipo: string,
  titulo: string,
  mensaje: string
) {
  return prisma.notificacion.create({
    data: { usuarioId, tipo, titulo, mensaje },
  });
}

export async function obtenerNotificaciones(usuarioId: number) {
  return prisma.notificacion.findMany({
    where: { usuarioId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

export async function marcarLeidas(usuarioId: number) {
  return prisma.notificacion.updateMany({
    where: { usuarioId, leida: false },
    data: { leida: true },
  });
}