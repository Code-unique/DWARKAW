export type Currency = "NPR" | "USD"

export function formatPrice(amount: number, currency: Currency): string {
  if (currency === "NPR") {
    return `NPR ${amount.toLocaleString("en-NP")}`
  }
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function getPriceField(currency: Currency): "priceNPR" | "priceUSD" {
  return currency === "NPR" ? "priceNPR" : "priceUSD"
}
