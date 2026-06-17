import { Request, Response } from "express";
import {
  obtenerSaldos,
  obtenerDesglose,
  obtenerTasasDeCambio,
  convertirSaldo,
} from "../services/wallet.service";

export async function balance(req: Request, res: Response) {
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

export async function desglose(req: Request, res: Response) {
  try {
    const resultado = await obtenerDesglose(req.usuario!.id);
    res.status(200).json({ desglose: resultado });
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

export async function convertir(req: Request, res: Response) {
  debugger;
  const { monto, desdeMoneda, haciaMoneda } = req.body;

  if (!monto || typeof monto !== "number" || monto <= 0) {
    res
      .status(400)
      .json({ message: "El monto debe ser un número mayor que 0" });
    return;
  }

  if (!desdeMoneda || !haciaMoneda) {
    res
      .status(400)
      .json({ message: "desdeMoneda y haciaMoneda son obligatorios" });
    return;
  }

  try {
    const resultado = await convertirSaldo(
      req.usuario!.id,
      desdeMoneda,
      haciaMoneda,
      monto,
    );
    res
      .status(200)
      .json({
        message: "Conversión realizada correctamente",
        detalle: resultado,
      });
  } catch (error: any) {
    if (
      error.message === "Cuenta no encontrada" ||
      error.message === "Saldo insuficiente" ||
      error.message === "El monto debe ser mayor que 0" ||
      error.message === "Las monedas de origen y destino deben ser distintas" ||
      error.message === "Moneda no válida. Usa: USD, EUR, ARS o COP"
    ) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
