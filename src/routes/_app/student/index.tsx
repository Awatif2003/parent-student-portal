import { createFileRoute } from "@tanstack/react-router"

import { StudentDashboardPage } from "@/features/dashboard/pages/StudentDashboardPage"

export const Route = createFileRoute("/_app/student/")({
  component: StudentDashboardPage,
})
