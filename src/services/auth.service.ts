import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import prisma from "../config/db";

export async function registrarUsuario(
  nombre: string,
  apellido: string,
  email: string,
  password: string
) {
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email },
  });
  if (usuarioExistente) {
    throw new Error("El email ya está registrado");
  }

  const hashContrasena = await bcrypt.hash(password, 10);

  const usuario = await prisma.$transaction(async (tx) => {
    const nuevoUsuario = await tx.usuario.create({
      data: { nombre, apellido, email, hashContrasena },
    });

    await tx.cuenta.create({
      data: {
        usuarioId: nuevoUsuario.id,
        codigoCuenta: randomUUID(),
        monedaBase: "USD",
      },
    });

    return nuevoUsuario;
  });

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
  };
}

export async function iniciarSesion(email: string, password: string) {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    throw new Error("Email o contraseña incorrectos");
  }

  const contrasenaCorrecta = await bcrypt.compare(
    password,
    usuario.hashContrasena
  );
  if (!contrasenaCorrecta) {
    throw new Error("Email o contraseña incorrectos");
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "24h" }
  );

  return {
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
  };
}
