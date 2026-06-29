import { createFileRoute } from "@tanstack/react-router"

import { TermResultsPage } from "@/features/results/pages/TermResultsPage"

export const Route = createFileRoute("/_app/parent/results/term-results")({
  component: TermResultsPage,
})
