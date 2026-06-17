import { Request, Response } from "express";
import {
  obtenerMeta,
  crearMeta,
  eliminarMeta,
  aportarAMeta,
  retirarDeMeta,
} from "../services/ahorro.service";

const MONEDAS_VALIDAS = ["USD", "EUR", "ARS", "COP"];

export async function getMeta(req: Request, res: Response) {
  try {
    const meta = await obtenerMeta(req.usuario!.id);
    res.status(200).json({ meta });
  } catch (error: any) {
    if (error.message === "Cuenta no encontrada") {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function postMeta(req: Request, res: Response) {
  const { nombre, limite, divisa, imagen } = req.body;

  if (!nombre || typeof nombre !== "string" || !nombre.trim()) {
    res.status(400).json({ message: "El nombre de la meta es obligatorio" });
    return;
  }

  if (!limite || typeof limite !== "number" || limite <= 0) {
    res
      .status(400)
      .json({ message: "El límite debe ser un número mayor que 0" });
    return;
  }

  if (!divisa || !MONEDAS_VALIDAS.includes(divisa.toUpperCase())) {
    res
      .status(400)
      .json({ message: "Divisa no válida. Usa: USD, EUR, ARS o COP" });
    return;
  }

  try {
    const meta = await crearMeta(req.usuario!.id, {
      nombre: nombre.trim(),
      limite,
      divisa,
      imagen,
    });
    res
      .status(201)
      .json({ message: "Meta de ahorro creada correctamente", meta });
  } catch (error: any) {
    if (error.message === "Cuenta no encontrada") {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error.message === "Ya tienes una meta de ahorro activa") {
      res.status(409).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function postAportar(req: Request, res: Response) {
  const { monto } = req.body;

  if (!monto || typeof monto !== "number" || monto <= 0) {
    res
      .status(400)
      .json({ message: "El monto debe ser un número mayor que 0" });
    return;
  }

  try {
    const meta = await aportarAMeta(req.usuario!.id, monto);
    res
      .status(200)
      .json({ message: "Aportación realizada correctamente", meta });
  } catch (error: any) {
    if (error.message === "Cuenta no encontrada") {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error.message === "No tienes ninguna meta de ahorro activa") {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error.message === "Saldo disponible insuficiente") {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function postRetirar(req: Request, res: Response) {
  const { monto } = req.body;

  if (!monto || typeof monto !== "number" || monto <= 0) {
    res
      .status(400)
      .json({ message: "El monto debe ser un número mayor que 0" });
    return;
  }

  try {
    const meta = await retirarDeMeta(req.usuario!.id, monto);
    res.status(200).json({ message: "Retiro realizado correctamente", meta });
  } catch (error: any) {
    if (error.message === "Cuenta no encontrada") {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error.message === "No tienes ninguna meta de ahorro activa") {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error.message === "Saldo ahorrado insuficiente") {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function deleteMeta(req: Request, res: Response) {
  try {
    await eliminarMeta(req.usuario!.id);
    res.status(200).json({
      message: "Meta de ahorro eliminada y saldo reembolsado correctamente",
    });
  } catch (error: any) {
    if (error.message === "Cuenta no encontrada") {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error.message === "No tienes ninguna meta de ahorro activa") {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
