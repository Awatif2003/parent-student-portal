import { createFileRoute } from "@tanstack/react-router"

import { StudentAttendancePage } from "@/features/attendance/pages/StudentAttendancePage"

export const Route = createFileRoute("/_app/student/attendance")({
  component: StudentAttendancePage,
})
