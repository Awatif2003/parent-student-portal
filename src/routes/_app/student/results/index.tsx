import { createFileRoute } from "@tanstack/react-router"

import { ComingSoon } from "@/components/ComingSoon"

export const Route = createFileRoute("/_app/student/results/")({
  component: () => <ComingSoon title="My Results" eyebrow="Results" />,
})
