import type { Dict } from "@/types"

/** A single subject row inside a term result / report card. */
export interface SubjectGrade extends Dict {
  id?: string | number
  subject_name?: string
  subject?: string
  average_marks?: number | string
  total_marks?: number | string
  grade?: string
  points?: number | string
  subject_rank?: number | string
}

/** A published term result (the list shape is lighter than the detail shape). */
export interface TermResult extends Dict {
  id?: string | number
  enrollment?: string | number
  term?: string | number
  term_name?: string
  student_name?: string
  student_admission?: string
  admission_number?: string
  class_name?: string
  stream_name?: string
  average_marks?: number | string
  average?: number | string
  grade?: string
  division?: string
  stream_rank?: number | string
  subjects_passed?: number | string
  status_display?: string
  status?: string
  subject_grades?: SubjectGrade[]
}

/** Live (pre-publication) marks for one student. */
export interface ContinuousAssessmentMark extends Dict {
  id?: string | number
  student_id?: string | number
  subject_name?: string
  subject?: string
  exam_name?: string
  exam?: string
  marks?: number | string
  total_marks?: number | string
  percentage?: number | string
  grade?: string
  recorded_at?: string
}

/** A report card assembled from a term-result detail. */
export interface ReportCard {
  enrollment?: string | number
  term?: string | number
  term_result: TermResult
  subject_grades: SubjectGrade[]
}
