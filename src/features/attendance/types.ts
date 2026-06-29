import type { Dict } from "@/types"

export interface AttendanceRecord extends Dict {
  id?: string | number
  date?: string
  status?: string
  status_display?: string
  remarks?: string
  student_id?: string | number
  student_name?: string
  admission_number?: string
  class_name?: string
  school?: { name?: string } | string
}

export interface ChildAttendance extends Dict {
  student_id: string | number
  student_name?: string
  admission_number?: string
  current_class?: string
  academic_year?: string
  school?: { name?: string }
  attendance?: AttendanceRecord[]
}

export type AttendanceTone = "present" | "absent" | "late" | "excused" | "unknown"
