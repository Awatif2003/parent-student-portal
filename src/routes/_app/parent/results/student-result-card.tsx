import { createFileRoute } from "@tanstack/react-router"

import { ResultCardPage } from "@/features/results/pages/ResultCardPage"

export const Route = createFileRoute("/_app/parent/results/student-result-card")({
  component: ResultCardPage,
})
