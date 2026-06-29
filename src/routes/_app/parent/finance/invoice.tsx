import { createFileRoute } from "@tanstack/react-router"

import { ComingSoon } from "@/components/ComingSoon"

export const Route = createFileRoute("/_app/parent/finance/invoice")({
  component: () => <ComingSoon title="Invoices" eyebrow="Finance" />,
})
