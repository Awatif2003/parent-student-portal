import { apiDownload, apiRequest } from "./api";
import { PARENT_STUDENT_ENDPOINTS } from "./parentStudentEndpoints";

export const getGuardianChildren = (guardianId) =>
  apiRequest(PARENT_STUDENT_ENDPOINTS.students.guardianStudents(guardianId));

export const getStudentProfile = (studentId) => apiRequest(PARENT_STUDENT_ENDPOINTS.students.detail(studentId));

export const getAttendanceSummary = () => apiRequest(PARENT_STUDENT_ENDPOINTS.attendance.summary);

export const getAttendanceByStream = (streamId) =>
  apiRequest(PARENT_STUDENT_ENDPOINTS.attendance.byStream(streamId));

export const getReportCard = (enrollmentId, termId) =>
  apiRequest(PARENT_STUDENT_ENDPOINTS.reports.reportCard(enrollmentId, termId));

export const downloadReportCard = (enrollmentId, termId, filename = "report-card.pdf") =>
  apiDownload(PARENT_STUDENT_ENDPOINTS.reports.reportCard(enrollmentId, termId), filename);

export const getExamReportCards = () => apiRequest(PARENT_STUDENT_ENDPOINTS.exams.reportCards);

export const getTermResults = () => apiRequest(PARENT_STUDENT_ENDPOINTS.exams.termResults);

export const getBalanceStatement = (balanceId) => apiRequest(PARENT_STUDENT_ENDPOINTS.finance.balanceStatement(balanceId));

export const getInvoices = () => apiRequest(PARENT_STUDENT_ENDPOINTS.finance.invoices);

export const getPayments = () => apiRequest(PARENT_STUDENT_ENDPOINTS.finance.payments);
