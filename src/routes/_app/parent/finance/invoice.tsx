import { createFileRoute } from "@tanstack/react-router"

import { InvoicesPage } from "@/features/finance/pages/InvoicesPage"

export const Route = createFileRoute("/_app/parent/finance/invoice")({
  component: InvoicesPage,
})
