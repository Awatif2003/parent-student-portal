import type { Dict } from "@/types"

/** First finite numeric value among `keys` on `source`, else null. */
export function getFirstNumber(
  source: Dict | null | undefined,
  keys: string[],
): number | null {
  if (!source || typeof source !== "object") return null
  for (const key of keys) {
    const value = source[key]
    const numeric = Number(value)
    if (value !== undefined && value !== null && value !== "" && Number.isFinite(numeric)) {
      return numeric
    }
  }
  return null
}

/** Group-separated number, or an em dash for nullish input. */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—"
  return new Intl.NumberFormat("en-US").format(value)
}

/** Money with a thousands separator (no currency symbol — the backend varies). */
export function formatMoney(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—"
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)
}
