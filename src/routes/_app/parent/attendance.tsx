import { createFileRoute } from "@tanstack/react-router"

import { ParentAttendancePage } from "@/features/attendance/pages/ParentAttendancePage"

export const Route = createFileRoute("/_app/parent/attendance")({
  component: ParentAttendancePage,
})
