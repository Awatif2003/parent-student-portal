import { createFileRoute } from "@tanstack/react-router"

import { ReceiptsPage } from "@/features/finance/pages/ReceiptsPage"

export const Route = createFileRoute("/_app/parent/finance/receipts")({
  component: ReceiptsPage,
})
