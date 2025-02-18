export function extractPriceInfo(priceString: string) {
  // Eliminar espacios extra y dividir en número y moneda
  const parts = priceString.trim().split(/\s+/);

  // Extraer el monto numérico (eliminar símbolos de moneda si existen)
  const amount = parseFloat(parts[0].replace(/[^0-9.]/g, ""));

  // Extraer la moneda (si existe, por defecto USD)
  const currency = parts[1] || "USD";

  return {
    amount,
    currency,
  };
}
