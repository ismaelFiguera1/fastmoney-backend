import { Request, Response } from "express";
import { procesarMensaje } from "../services/chatbot.service";

export async function chatbot(req: Request, res: Response) {
  const { mensaje } = req.body;

  if (!mensaje) {
    res.status(400).json({ message: "El mensaje es requerido" });
    return;
  }

  try {
    const respuesta = await procesarMensaje(mensaje);
    res.status(200).json({ respuesta });
  } catch (error) {
    console.error("Error en chatbot:", error);
    res.status(500).json({ message: "Error al procesar el mensaje" });
  }
}