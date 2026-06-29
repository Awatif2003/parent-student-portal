import { createFileRoute } from "@tanstack/react-router"

import { ComingSoon } from "@/components/ComingSoon"

export const Route = createFileRoute("/_app/student/results/continuous-assessment")({
  component: () => <ComingSoon title="Continuous Assessment" eyebrow="Results" />,
})
