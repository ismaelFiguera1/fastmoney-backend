import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import prisma from "../config/db";

export async function registrarUsuario(
  nombre: string,
  apellido: string,
  email: string,
  password: string,
  monedaBase: string
) {
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email },
  });
  if (usuarioExistente) {
    throw new Error("El email ya está registrado");
  }

  const hashContrasena = await bcrypt.hash(password, 10);

  let usuario;
  try {
    usuario = await prisma.$transaction(async (tx) => {
      const nuevoUsuario = await tx.usuario.create({
        data: { nombre, apellido, email, hashContrasena },
      });

      const nuevaCuenta = await tx.cuenta.create({
        data: {
          usuarioId: nuevoUsuario.id,
          codigoCuenta: randomUUID(),
          monedaBase,
        },
      });

      await tx.saldoPorMoneda.create({
        data: {
          cuentaId: nuevaCuenta.id,
          usd: 2000,
          eur: 2000,
          ars: 10000,
          cop: 10000,
        },
      });

      return nuevoUsuario;
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("El email ya está registrado");
    }
    throw error;
  }

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
    { expiresIn: (process.env.JWT_EXPIRES_IN ?? "24h") as any }
  );

  return {
    token,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
    },
  };
}
