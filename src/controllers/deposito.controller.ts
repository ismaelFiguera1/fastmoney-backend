import { Request, Response } from "express";
import { realizarDeposito, obtenerHistorialDepositos } from "../services/deposito.service";

const MONEDAS_VALIDAS = ["USD", "EUR", "ARS", "COP"];

export async function depositar(req: Request, res: Response) {
  const { moneda, monto } = req.body;

  if (!moneda || !MONEDAS_VALIDAS.includes(moneda.toUpperCase())) {
    res.status(400).json({ message: "Moneda no válida. Usa: USD, EUR, ARS o COP" });
    return;
  }

  if (!monto || typeof monto !== "number" || monto <= 0) {
    res.status(400).json({ message: "El monto debe ser un número mayor que 0" });
    return;
  }

  try {
    await realizarDeposito(req.usuario!.id, moneda.toUpperCase(), monto);
    res.status(200).json({ message: "Depósito realizado correctamente" });
  } catch (error: any) {
    if (error.message === "Cuenta no encontrada") {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function historialDepositos(req: Request, res: Response) {
  try {
    const depositos = await obtenerHistorialDepositos(req.usuario!.id);
    res.status(200).json({ depositos });
  } catch (error: any) {
    if (error.message === "Cuenta no encontrada") {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
