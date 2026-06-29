import { createFileRoute } from "@tanstack/react-router"

import { ComingSoon } from "@/components/ComingSoon"

export const Route = createFileRoute("/_app/parent/results/student-result-card")({
  component: () => <ComingSoon title="Result Card" eyebrow="Results" />,
})
