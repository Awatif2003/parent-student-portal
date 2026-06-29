import { createFileRoute } from "@tanstack/react-router"

import { ContinuousAssessmentPage } from "@/features/results/pages/ContinuousAssessmentPage"

export const Route = createFileRoute("/_app/parent/results/continuous-assessments")({
  component: ContinuousAssessmentPage,
})
