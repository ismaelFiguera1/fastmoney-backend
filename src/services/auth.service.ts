import bcrypt from 'bcrypt';
import prisma from '../config/db';

export async function registerUser(nombre: string, email: string, password: string) {
  const usuarioExistente = await prisma.user.findUnique({ where: { email } });
  if (usuarioExistente) {
    throw new Error('El email ya está registrado');
  }

  const hashContrasena = await bcrypt.hash(password, 10);

  const usuario = await prisma.user.create({
    data: { nombre, email, hashContrasena },
  });

  return { id: usuario.id, nombre: usuario.nombre, email: usuario.email };
}


export async function loginUser(email: string, password: string) {
  const usuario = await prisma.user.findUnique({ where: { email } });
  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  const contraseñaValida = await bcrypt.compare(password, usuario.hashContrasena);
  if (!contraseñaValida) {
    throw new Error('Contraseña incorrecta');
  }

  return { id: usuario.id, nombre: usuario.nombre, email: usuario.email };
}
