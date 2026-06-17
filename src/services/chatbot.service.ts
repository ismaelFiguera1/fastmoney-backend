import { consultarGemini } from "./gemini.service";

const RESUMEN_GASTOS = `📊 *Resumen de gastos - Junio 2026*

🍔 Alimentación: $450.000
🚕 Transporte: $200.000
🛒 Compras: $300.000
🎮 Entretenimiento: $150.000

💰 Total gastado: $1.100.000`;

const GUIA_TRANSFERENCIA = `💸 *Pasos para realizar una transferencia:*

1. Ingresa al módulo Transferencias
2. Ingresa el codigo de cuenta
3. Selecciona la moneda y el monto
4. Verifica los datos
5. Confirma la operación`;

export async function procesarMensaje(mensaje: string): Promise<string> {
  const lower = mensaje.toLowerCase();

  if (lower.includes("gasto") || lower.includes("resumen") || lower.includes("gasté")) {
    return RESUMEN_GASTOS;
  }

  if (lower.includes("transferencia") || lower.includes("transferir") || lower.includes("enviar")) {
    return GUIA_TRANSFERENCIA;
  }

  return "Lo siento, no entendí tu consulta. ¿Puedo ayudarte con transferencias, saldos o movimientos?";
}