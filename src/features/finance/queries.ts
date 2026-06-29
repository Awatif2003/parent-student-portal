import { queryOptions } from "@tanstack/react-query"

import { fetchInvoices, fetchPayments } from "./api"

export const financeKeys = {
  all: ["finance"] as const,
  invoices: () => [...financeKeys.all, "invoices"] as const,
  payments: () => [...financeKeys.all, "payments"] as const,
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
