import { useQuery } from "@tanstack/react-query"

import { invoicesQueryOptions, paymentsQueryOptions } from "./queries"

export function useInvoices() {
  return useQuery(invoicesQueryOptions())
}

export function usePayments() {
  return useQuery(paymentsQueryOptions())
}
