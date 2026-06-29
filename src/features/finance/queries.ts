import { queryOptions } from "@tanstack/react-query"

import { fetchInvoices, fetchPayments, fetchReceipt } from "./api"

export const financeKeys = {
  all: ["finance"] as const,
  invoices: () => [...financeKeys.all, "invoices"] as const,
  payments: () => [...financeKeys.all, "payments"] as const,
  receipt: (id: string | number) => [...financeKeys.all, "receipt", String(id)] as const,
}

export function invoicesQueryOptions() {
  return queryOptions({
    queryKey: financeKeys.invoices(),
    queryFn: fetchInvoices,
    staleTime: 60_000,
  })
}

export function paymentsQueryOptions() {
  return queryOptions({
    queryKey: financeKeys.payments(),
    queryFn: fetchPayments,
    staleTime: 60_000,
  })
}

export function receiptQueryOptions(paymentId: string | number) {
  return queryOptions({
    queryKey: financeKeys.receipt(paymentId),
    queryFn: () => fetchReceipt(paymentId),
    staleTime: 60_000,
  })
}
