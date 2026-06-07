import { Request, Response } from "express";
import { obtenerSaldos } from "../services/wallet.service";

export async function balance(req: Request, res: Response) {
  try {
    const saldos = await obtenerSaldos(req.usuario!.id);
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
