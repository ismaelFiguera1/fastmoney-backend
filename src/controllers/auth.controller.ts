import { Request, Response } from "express";
import { registrarUsuario, iniciarSesion } from "../services/auth.service";

export async function me(req: Request, res: Response) {
  res.status(200).json({ usuario: req.usuario });
}

export async function registrar(req: Request, res: Response) {
  const {
    name: nombre,
    lastName: apellido,
    email,
    password,
    monedaBase,
  } = req.body;

  if (!nombre || !apellido || !email || !password || !monedaBase) {
    res.status(400).json({
      message:
        "Nombre, apellido, email, contraseña y moneda base son obligatorios",
    });
    return;
  }

  const MONEDAS_VALIDAS = ["usd", "eur", "ars", "cop"];
  if (!MONEDAS_VALIDAS.includes(monedaBase.toLowerCase())) {
    res
      .status(400)
      .json({ message: "Moneda base no válida. Usa: USD, EUR, ARS o COP" });
    return;
  }

  if (password.length < 8) {
    res
      .status(400)
      .json({ message: "La contraseña debe tener al menos 8 caracteres" });
    return;
  }

  try {
    const usuario = await registrarUsuario(
      nombre,
      apellido,
      email,
      password,
      monedaBase.toUpperCase()
    );
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
