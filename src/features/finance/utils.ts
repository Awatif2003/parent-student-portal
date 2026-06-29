import type { BadgeVariant } from "@/components/ui/badge"
import { firstDefined } from "@/lib/identity"
import type { Dict } from "@/types"

/** First numeric amount among the common backend field names, or null. */
export function amountOf(record: Dict, keys: string[]): number | null {
  for (const key of keys) {
    const value = record[key]
    const numeric = Number(value)
    if (value !== undefined && value !== null && value !== "" && Number.isFinite(numeric)) {
      return numeric
    }
  }
  return null
}

/** The display status string across the backend's varying field names. */
export function statusOf(record: Dict, keys: string[]): string | undefined {
  return firstDefined(...keys.map((key) => record[key]))
}

/** Map a finance status to a badge tone. */
export function statusTone(status: string | undefined): BadgeVariant {
  const raw = String(status ?? "").toLowerCase()
  if (raw.includes("paid") || raw.includes("complete") || raw.includes("success")) return "success"
  if (raw.includes("partial") || raw.includes("pending") || raw.includes("due")) return "warning"
  if (raw.includes("overdue") || raw.includes("fail") || raw.includes("cancel")) return "danger"
  return "muted"
}
