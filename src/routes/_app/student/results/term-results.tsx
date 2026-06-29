import { createFileRoute } from "@tanstack/react-router"

import { ComingSoon } from "@/components/ComingSoon"

export const Route = createFileRoute("/_app/student/results/term-results")({
  component: () => <ComingSoon title="Term Results" eyebrow="Results" />,
})
