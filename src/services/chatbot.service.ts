import { consultarGemini } from "./gemini.service";

export async function procesarMensaje(mensaje: string): Promise<string> {
  return await consultarGemini(mensaje);
}