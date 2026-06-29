import type { AttendanceRecord, AttendanceTone } from "../types"

export function attendanceTone(record: AttendanceRecord): AttendanceTone {
  const raw = String(record?.status_display ?? record?.status ?? "").toLowerCase()
  if (raw.includes("present")) return "present"
  if (raw.includes("absent")) return "absent"
  if (raw.includes("late")) return "late"
  if (raw.includes("excus")) return "excused"
  return "unknown"
}

export const TONE_LABEL: Record<AttendanceTone, string> = {
  present: "Present",
  absent: "Absent",
  late: "Late",
  excused: "Excused",
  unknown: "No update",
}

export interface AttendanceSummary {
  total: number
  present: number
  absent: number
  late: number
  excused: number
  /** Present + late as a share of all recorded days, rounded to a percent. */
  rate: number
}

export function summarize(records: AttendanceRecord[]): AttendanceSummary {
  const summary: AttendanceSummary = {
    total: records.length,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    rate: 0,
  }

  for (const record of records) {
    const tone = attendanceTone(record)
    if (tone === "present") summary.present += 1
    else if (tone === "absent") summary.absent += 1
    else if (tone === "late") summary.late += 1
    else if (tone === "excused") summary.excused += 1
  }

  const counted = summary.present + summary.absent + summary.late + summary.excused
  summary.rate = counted ? Math.round(((summary.present + summary.late) / counted) * 100) : 0
  return summary
}
