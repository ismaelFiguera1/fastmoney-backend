const API_KEY = process.env.EXCHANGE_RATE_API_KEY;

const OCHO_HORAS_MS = 8 * 60 * 60 * 1000;

const MONEDAS = ["USD", "EUR", "ARS", "COP"] as const;

// Caché por moneda. cache["EUR"] guarda las tasas desde EUR y cuándo se pidieron.
const cache: Record<string, { rates: Record<string, number>; timestamp: number }> = {};

// Pide las tasas para USD, EUR, ARS y COP una por una.
// Si la caché de una moneda tiene menos de 8 horas, la usa sin llamar a la API.
// Devuelve una matriz: resultado["EUR"]["ARS"] = cuántos ARS vale 1 EUR
export async function obtenerTasas(): Promise<Record<string, Record<string, number>>> {
  const ahora = Date.now();
  const resultado: Record<string, Record<string, number>> = {};

  for (const moneda of MONEDAS) {
    if (cache[moneda] && ahora - cache[moneda].timestamp < OCHO_HORAS_MS) {
      resultado[moneda] = cache[moneda].rates;
      continue;
    }

    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${moneda}`;
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error("Error al contactar la API de tipos de cambio");
    }

    const datos = (await respuesta.json()) as {
      result: string;
      "error-type"?: string;
      conversion_rates: Record<string, number>;
    };

    if (datos.result !== "success") {
      throw new Error(`Error de la API de tipos de cambio: ${datos["error-type"] ?? "desconocido"}`);
    }

    const rates = {
      USD: datos.conversion_rates["USD"],
      EUR: datos.conversion_rates["EUR"],
      ARS: datos.conversion_rates["ARS"],
      COP: datos.conversion_rates["COP"],
    };

    cache[moneda] = { rates, timestamp: ahora };
    resultado[moneda] = rates;
  }

  return resultado;
}

