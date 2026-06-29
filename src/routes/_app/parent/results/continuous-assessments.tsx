import { createFileRoute } from "@tanstack/react-router"

import { ComingSoon } from "@/components/ComingSoon"

export const Route = createFileRoute("/_app/parent/results/continuous-assessments")({
  component: () => <ComingSoon title="Continuous Assessment" eyebrow="Results" />,
})
