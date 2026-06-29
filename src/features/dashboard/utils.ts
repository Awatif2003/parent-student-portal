import { attendanceTone } from "@/features/attendance/utils/status"
import type { ChildAttendance } from "@/features/attendance/types"

/** Count present/absent among children based on their latest attendance record. */
export function countTodayAttendance(children: ChildAttendance[]): {
  present: number
  absent: number
} {
  let present = 0
  let absent = 0
  for (const child of children) {
    const tone = attendanceTone(child.attendance?.[0] ?? {})
    if (tone === "present") present += 1
    else if (tone === "absent") absent += 1
  }
  return { present, absent }
}
