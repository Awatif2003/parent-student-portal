import { useQuery } from "@tanstack/react-query"

import { invoicesQueryOptions, paymentsQueryOptions, receiptQueryOptions } from "./queries"

export function useInvoices() {
  return useQuery(invoicesQueryOptions())
}

export function usePayments() {
  return useQuery(paymentsQueryOptions())
}

export function useReceipt(paymentId: string | number | null) {
  return useQuery({
    ...receiptQueryOptions(paymentId ?? ""),
    enabled: paymentId != null && paymentId !== "",
  })
}
