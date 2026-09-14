/**
 * Format a numeric value as currency.
 * Uses Indian Rupee (₹) by default — school currency is configurable later.
 */
export function formatCurrency(
  amount: number,
  options?: { currency?: string; locale?: string }
): string {
  const { currency = 'INR', locale = 'en-IN' } = options ?? {}
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}
