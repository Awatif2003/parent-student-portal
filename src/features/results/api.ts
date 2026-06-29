import { apiClient, apiDownload } from "@/lib/api/client"
import { EXAMS, REPORTS } from "@/lib/api/endpoints"
import { normalizeCollection } from "@/lib/identity"
import type { Dict } from "@/types"
import type { ContinuousAssessmentMark, ReportCard, TermResult } from "./types"

/**
 * Published term results for the caller. The backend scopes this to the caller
 * (a student → self, a guardian → all linked children), so no id is required.
 */
export async function fetchTermResults(): Promise<TermResult[]> {
  const { data } = await apiClient.get<Dict>(EXAMS.TERM_RESULTS)
  return normalizeCollection<TermResult>(data)
}

/**
 * Live continuous-assessment marks for ONE student. The backend authorizes the
 * caller (a parent only their linked children). Returns [] without a student.
 */
export async function fetchContinuousAssessment(
  studentId: string | number | undefined,
  termId?: string | number,
): Promise<ContinuousAssessmentMark[]> {
  if (!studentId) return []
  const params: Dict = { student: studentId }
  if (termId) params.term = termId
  const { data } = await apiClient.get<Dict>(EXAMS.CONTINUOUS_ASSESSMENT, { params })
  return normalizeCollection<ContinuousAssessmentMark>(data)
}

/**
 * Report cards for the caller. The bare report-card list is a placeholder, so we
 * derive cards from term-results: the LIST shape is light (no term id, no
 * subject grades), so for each row we fetch its detail (the full serializer),
 * which carries enrollment, term, subject grades and the term summary —
 * everything a report card needs to render and to drive the PDF download.
 */
export async function fetchReportCards(): Promise<ReportCard[]> {
  const rows = await fetchTermResults()
  return Promise.all(
    rows
      .filter((row) => row.id !== undefined && row.id !== null)
      .map(async (row) => {
        const { data } = await apiClient.get<TermResult>(EXAMS.TERM_RESULT_DETAIL(row.id!))
        const full = (data ?? {}) as TermResult
        return {
          enrollment: full.enrollment,
          term: full.term,
          term_result: full,
          subject_grades: full.subject_grades ?? [],
        }
      }),
  )
}

/** Download a single report-card PDF (needs an enrollment + term). */
export function downloadReportCard(
  enrollmentId: string | number,
  termId: string | number,
): Promise<Blob> {
  return apiDownload(
    REPORTS.REPORT_CARD(enrollmentId, termId),
    `report-card-${enrollmentId}-${termId}.pdf`,
  )
}
