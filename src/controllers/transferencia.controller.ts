import { Request, Response } from "express";
import {
  realizarTransferencia,
  obtenerHistorial,
} from "../services/transferencia.service";

export async function transferir(req: Request, res: Response) {
  try {
    const { codigoCuentaDestino, moneda, monto } = req.body;

    if (!codigoCuentaDestino || !moneda || monto === undefined) {
      res.status(400).json({
        message:
          "Faltan campos obligatorios: codigoCuentaDestino, moneda, monto",
      });
      return;
    }

    if (typeof monto !== "number" || monto <= 0) {
      res
        .status(400)
        .json({ message: "El monto debe ser un número mayor que 0" });
      return;
    }

    const resultado = await realizarTransferencia(
      req.usuario!.id,
      codigoCuentaDestino,
      moneda,
      monto
    );

    res.status(200).json(resultado);
  } catch (error: any) {
    const erroresConocidos = [
      "Moneda no válida. Usa: USD, EUR, ARS o COP",
      "Cuenta de origen no encontrada",
      "Cuenta de destino no encontrada",
      "No puedes transferirte dinero a ti mismo",
    ];

    const esErrorDeNegocio =
      erroresConocidos.includes(error.message) ||
      error.message.startsWith("Saldo insuficiente");

    if (esErrorDeNegocio) {
      res.status(400).json({ message: error.message });
      return;
    }

    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function historial(req: Request, res: Response) {
  try {
    const transferencias = await obtenerHistorial(req.usuario!.id);
    res.status(200).json({ transferencias });
  } catch (error: any) {
    if (error.message === "Cuenta no encontrada") {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
