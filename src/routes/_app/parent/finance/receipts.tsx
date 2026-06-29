import { createFileRoute } from "@tanstack/react-router"

import { ComingSoon } from "@/components/ComingSoon"

export const Route = createFileRoute("/_app/parent/finance/receipts")({
  component: () => <ComingSoon title="Receipts" eyebrow="Finance" />,
})
