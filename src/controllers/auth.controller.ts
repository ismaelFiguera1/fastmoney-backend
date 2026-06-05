import { Request, Response } from "express";
import { registrarUsuario, iniciarSesion } from "../services/auth.service";

export async function me(req: Request, res: Response) {
  res.status(200).json({ usuario: req.usuario });
}

export async function registrar(req: Request, res: Response) {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    res
      .status(400)
      .json({ message: "Nombre, email y contraseña son obligatorios" });
    return;
  }

  if (password.length < 6) {
    res
      .status(400)
      .json({ message: "La contraseña debe tener al menos 6 caracteres" });
    return;
  }

  try {
    const usuario = await registrarUsuario(nombre, email, password);
    res
      .status(201)
      .json({ message: "Usuario registrado correctamente", usuario });
  } catch (error: any) {
    if (error.message === "El email ya está registrado") {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email y contraseña son obligatorios" });
    return;
  }

  try {
    const resultado = await iniciarSesion(email, password);
    res.status(200).json({ message: "Login correcto", ...resultado });
  } catch (error: any) {
    if (error.message === "Email o contraseña incorrectos") {
      res.status(401).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
