import bcrypt from 'bcrypt';
import prisma from '../config/db';

export async function registerUser(nombre: string, email: string, password: string) {
  const usuarioExistente = await prisma.user.findUnique({ where: { email } });
  if (usuarioExistente) {
    throw new Error('El email ya está registrado');
  }

  const hashContraseña = await bcrypt.hash(password, 10);

  const usuario = await prisma.user.create({
    data: { nombre, email, hashContraseña },
  });

  return { id: usuario.id, nombre: usuario.nombre, email: usuario.email };
}
