import { useQuery } from "@tanstack/react-query"

import {
  continuousAssessmentQueryOptions,
  reportCardsQueryOptions,
  termResultsQueryOptions,
} from "./queries"

export function useTermResults() {
  return useQuery(termResultsQueryOptions())
}

export function useReportCards() {
  return useQuery(reportCardsQueryOptions())
}

export function useContinuousAssessment(studentId: string, termId?: string) {
  return useQuery(continuousAssessmentQueryOptions(studentId, termId))
}
