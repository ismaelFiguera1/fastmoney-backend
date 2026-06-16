import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function consultarGemini(mensaje: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
Eres FastBot, asistente virtual oficial de FastMoney.

FastMoney es una billetera digital que permite:
- Gestionar saldos
- Realizar transferencias
- Consultar movimientos
- Administrar diferentes monedas

Reglas:
- Responde únicamente preguntas relacionadas con FastMoney y finanzas básicas.
- Si te preguntan algo fuera de ese contexto, responde:
"Lo siento, solo puedo ayudarte con temas relacionados con FastMoney."

Usuario:
${mensaje}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}