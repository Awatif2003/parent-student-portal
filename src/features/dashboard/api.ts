import { apiClient } from "@/lib/api/client"
import { DASHBOARD } from "@/lib/api/endpoints"
import type { Dict } from "@/types"

async function fetchSection(path: string): Promise<Dict> {
  const { data } = await apiClient.get<Dict>(path)
  return (data ?? {}) as Dict
}

export const fetchOverview = () => fetchSection(DASHBOARD.OVERVIEW)
export const fetchAttendanceSummary = () => fetchSection(DASHBOARD.ATTENDANCE)
export const fetchExamSummary = () => fetchSection(DASHBOARD.EXAMS)
export const fetchFinanceSummary = () => fetchSection(DASHBOARD.FINANCE)
