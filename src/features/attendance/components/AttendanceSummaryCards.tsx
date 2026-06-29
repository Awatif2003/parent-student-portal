import { CalendarCheck, CalendarX, Clock, Percent } from "lucide-react"

import { StatCard } from "@/components/ui/stat-card"
import { summarize } from "../utils/status"
import type { AttendanceRecord } from "../types"

export function AttendanceSummaryCards({
  records,
  loading,
}: {
  records: AttendanceRecord[]
  loading?: boolean
}) {
  const summary = summarize(records)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Attendance rate" value={`${summary.rate}%`} icon={<Percent />} loading={loading} />
      <StatCard label="Present" value={summary.present} icon={<CalendarCheck />} loading={loading} />
      <StatCard label="Absent" value={summary.absent} icon={<CalendarX />} loading={loading} />
      <StatCard label="Late" value={summary.late} icon={<Clock />} loading={loading} />
    </div>
  )
}
