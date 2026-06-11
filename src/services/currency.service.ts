const API_KEY = process.env.EXCHANGE_RATE_API_KEY;

// Monedas soportadas, deben coincidir con las columnas de SaldoPorMoneda en la base de datos
const MONEDAS_SOPORTADAS = ["usd", "eur", "ars", "cop"] as const;

const OCHO_HORAS_MS = 8 * 60 * 60 * 1000;

// Caché por moneda base. Ejemplo: cache["USD"] = { rates: { EUR: 0.92, ... }, timestamp: 1749600000000 }
const cache: Record<string, { rates: Record<string, number>; timestamp: number }> = {};

// Llama a la API y devuelve los tipos de cambio desde la monedaBase
// Ejemplo: si monedaBase es "ARS", rates.USD = 0.001 significa que 1 ARS vale 0.001 USD
export async function obtenerTasas(
  monedaBase: string
): Promise<Record<string, number>> {
  const moneda = monedaBase.toUpperCase();
  const ahora = Date.now();

  // Si hay datos en caché para esta moneda y no han pasado 8 horas, los devolvemos
  if (cache[moneda] && ahora - cache[moneda].timestamp < OCHO_HORAS_MS) {
    return cache[moneda].rates;
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
    throw new Error(
      `Error de la API de tipos de cambio: ${
        datos["error-type"] ?? "desconocido"
      }`
    );
  }

  // Guardamos los datos nuevos junto con el momento actual
  cache[moneda] = {
    rates: datos.conversion_rates,
    timestamp: ahora,
  };

  return datos.conversion_rates;
}

// Convierte todos los saldos a la moneda base y devuelve el total
// Fórmula: monto_en_monedaBase = monto_en_X / rates[X]
export function calcularTotalEnMonedaBase(
  saldos: { usd: number; eur: number; ars: number; cop: number },
  rates: Record<string, number>
): number {
  let total = 0;
  for (const moneda of MONEDAS_SOPORTADAS) {
    total += saldos[moneda] / rates[moneda.toUpperCase()];
  }
  return total;
}
