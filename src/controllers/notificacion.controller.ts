import { Request, Response } from "express";
import { obtenerNotificaciones, marcarLeidas } from "../services/notificacion.service";

export async function getNotificaciones(req: Request, res: Response) {
  try {
    const notificaciones = await obtenerNotificaciones(req.usuario!.id);
    res.status(200).json({ notificaciones });
  } catch {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function patchMarcarLeidas(req: Request, res: Response) {
  try {
    await marcarLeidas(req.usuario!.id);
    res.status(200).json({ message: "Notificaciones marcadas como leídas" });
  } catch {
    res.status(500).json({ message: "Error interno del servidor" });
  }
}