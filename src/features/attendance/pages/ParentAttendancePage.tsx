import { CalendarCheck } from "lucide-react"

import { ErrorState } from "@/components/ui/error-state"
import { PageHeader } from "@/components/ui/page-header"
import { AttendanceSummaryCards } from "../components/AttendanceSummaryCards"
import { AttendanceTable } from "../components/AttendanceTable"
import { useParentAttendance } from "../hooks"

export function ParentAttendancePage() {
  const { data = [], isLoading, isError, error, refetch } = useParentAttendance()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Parent Portal"
        title="Attendance"
        icon={<CalendarCheck />}
        description="Daily attendance across all your children."
      />
      {isError ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : (
        <>
          <AttendanceSummaryCards records={data} loading={isLoading} />
          <AttendanceTable records={data} loading={isLoading} showStudent />
        </>
      )}
    </div>
  )
}
