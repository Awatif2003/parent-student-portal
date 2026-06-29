/**
 * Date helpers. ISO `yyyy-mm-dd` math is done in LOCAL time —
 * `toISOString().slice(0,10)` is UTC and can drift a day around midnight.
 */

function toIsoDate(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/** Today's date in ISO `yyyy-mm-dd` form, local timezone. */
export function todayIso(): string {
  return toIsoDate(new Date())
}

/** The ISO `yyyy-mm-dd` form of `n` days before today (local timezone). */
export function isoDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return toIsoDate(d)
}

/** First day of the current year in ISO `yyyy-mm-dd` form (local timezone). */
export function startOfYearIso(): string {
  return toIsoDate(new Date(new Date().getFullYear(), 0, 1))
}

/** A readable date label, e.g. "Mon, 29 Jun 2026". */
export function formatReadableDate(value: string | number | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

/** A compact date label, e.g. "29 Jun 2026". Returns "—" for unparseable input. */
export function formatDate(value: string | number | Date | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—"
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}
