/** Mongolian tugrik (MNT) — prefix symbol, same layout as former USD. */
export const CURRENCY_SYMBOL = "₮";

export function formatCurrency(amount, decimals = 2) {
  const n = Number(amount);
  if (Number.isNaN(n)) {
    return `${CURRENCY_SYMBOL}${(0).toFixed(decimals)}`;
  }
  return `${CURRENCY_SYMBOL}${n.toFixed(decimals)}`;
}
