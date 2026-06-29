import type { Dict } from "@/types"

/** First finite numeric value among `keys` on `source`, else null. */
export function getFirstNumber(source: Dict | null | undefined, keys: string[]): number | null {
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

/**
 * A trimmed decimal, e.g. 78.5 → "78.5", 78 → "78". Accepts the raw
 * string/number the backend returns; falls back to an em dash for nullish input.
 */
export function formatDecimal(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—"
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return String(value)
  return numeric.toFixed(2).replace(/\.?0+$/, "")
}

/** A rank as "#3", or an em dash when absent. */
export function formatRank(value: unknown): string {
  return value ? `#${value}` : "—"
}

/** Snake/UPPER case → Title Case, e.g. "not_promoted" → "Not Promoted". */
export function titleCase(value: unknown): string {
  if (!value) return "—"
  return String(value)
    .toLowerCase()
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}
