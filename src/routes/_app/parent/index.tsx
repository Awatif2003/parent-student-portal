import { createFileRoute } from "@tanstack/react-router"

import { ParentDashboardPage } from "@/features/dashboard/pages/ParentDashboardPage"

export const Route = createFileRoute("/_app/parent/")({
  component: ParentDashboardPage,
})
