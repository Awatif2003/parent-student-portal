import { Badge, type BadgeVariant } from "@/components/ui/badge"
import { attendanceTone, TONE_LABEL } from "../utils/status"
import type { AttendanceRecord, AttendanceTone } from "../types"

const VARIANT_BY_TONE: Record<AttendanceTone, BadgeVariant> = {
  present: "success",
  absent: "danger",
  late: "warning",
  excused: "muted",
  unknown: "muted",
}

export function AttendanceStatusBadge({ record }: { record: AttendanceRecord }) {
  const tone = attendanceTone(record)
  return (
    <Badge variant={VARIANT_BY_TONE[tone]}>
      {record.status_display || TONE_LABEL[tone]}
    </Badge>
  )
}
