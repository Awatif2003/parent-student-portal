import { apiClient } from "@/lib/api/client"
import { FINANCE } from "@/lib/api/endpoints"
import { normalizeCollection } from "@/lib/identity"
import type { Dict } from "@/types"
import type { Invoice, Payment, Receipt } from "./types"

/** Invoices for the caller (backend-scoped: a guardian sees their children's). */
export async function fetchInvoices(): Promise<Invoice[]> {
  const { data } = await apiClient.get<Dict>(FINANCE.INVOICES)
  return normalizeCollection<Invoice>(data)
}

/** Payments / receipts for the caller (backend-scoped). */
export async function fetchPayments(): Promise<Payment[]> {
  const { data } = await apiClient.get<Dict>(FINANCE.PAYMENTS)
  return normalizeCollection<Payment>(data)
}

/** Printable receipt payload for a single payment (backend-scoped). */
export async function fetchReceipt(paymentId: string | number): Promise<Receipt> {
  const { data } = await apiClient.get<Receipt>(FINANCE.PAYMENT_RECEIPT(paymentId))
  return data
}
