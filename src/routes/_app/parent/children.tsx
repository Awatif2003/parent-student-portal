import { createFileRoute } from "@tanstack/react-router"

import { ComingSoon } from "@/components/ComingSoon"

export const Route = createFileRoute("/_app/parent/children")({
  component: () => <ComingSoon title="My Children" eyebrow="Parent Portal" />,
})
