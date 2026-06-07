const API_KEY = process.env.EXCHANGE_RATE_API_KEY;

// Monedas soportadas, deben coincidir con las columnas de SaldoPorMoneda en la base de datos
const MONEDAS_SOPORTADAS = ["usd", "eur", "ars", "cop"] as const;

// Llama a la API y devuelve los tipos de cambio desde la monedaBase
// Ejemplo: si monedaBase es "ARS", rates.USD = 0.001 significa que 1 ARS vale 0.001 USD
export async function obtenerTasas(
  monedaBase: string
): Promise<Record<string, number>> {
  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${monedaBase.toUpperCase()}`;

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
