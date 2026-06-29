import { CalendarCheck } from "lucide-react"

import { ErrorState } from "@/components/ui/error-state"
import { PageHeader } from "@/components/ui/page-header"
import { AttendanceSummaryCards } from "../components/AttendanceSummaryCards"
import { AttendanceTable } from "../components/AttendanceTable"
import { useMyAttendance } from "../hooks"

export function StudentAttendancePage() {
  const { data = [], isLoading, isError, error, refetch } = useMyAttendance()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student Portal"
        title="My Attendance"
        icon={<CalendarCheck />}
        description="Your attendance record for the term."
      />
      {isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : (
        <>
          <AttendanceSummaryCards records={data} loading={isLoading} />
          <AttendanceTable records={data} loading={isLoading} />
        </>
      )}
    </div>
  )
}
