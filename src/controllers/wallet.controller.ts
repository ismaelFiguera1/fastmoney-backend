import { Request, Response } from "express";
import {
  obtenerSaldos,
  obtenerTasasDeCambio,
} from "../services/wallet.service";

export async function balance(req: Request, res: Response) {
  debugger;
  try {
    const moneda = (req.params.moneda as string)?.toUpperCase();

    if (!moneda) {
      res.status(400).json({ message: "El parámetro moneda es obligatorio" });
      return;
    }

    const saldos = await obtenerSaldos(req.usuario!.id, moneda);
    res.status(200).json({ saldos });
  } catch (error: any) {
    if (
      error.message === "Cuenta no encontrada" ||
      error.message === "Saldos no encontrados"
    ) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function tasas(req: Request, res: Response) {
  try {
    const resultado = await obtenerTasasDeCambio();
    res.status(200).json(resultado);
  } catch (error: any) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
