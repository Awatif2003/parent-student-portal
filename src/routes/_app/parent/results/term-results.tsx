import { createFileRoute } from "@tanstack/react-router"

import { ComingSoon } from "@/components/ComingSoon"

export const Route = createFileRoute("/_app/parent/results/term-results")({
  component: () => <ComingSoon title="Annual Results" eyebrow="Results" />,
})
