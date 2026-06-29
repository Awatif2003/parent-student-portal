import { createFileRoute } from "@tanstack/react-router"

import { ComingSoon } from "@/components/ComingSoon"

export const Route = createFileRoute("/_app/student/details")({
  component: () => <ComingSoon title="My Details" eyebrow="Student Portal" />,
})
