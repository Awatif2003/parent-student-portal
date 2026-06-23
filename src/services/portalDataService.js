import { apiDownload, apiRequest } from "./api";
import { PARENT_STUDENT_ENDPOINTS } from "./parentStudentEndpoints";
import { getParentChildren } from "./attendanceService";

// The linked children list comes from the parent self-service endpoint, which
// is scoped to the authenticated guardian (cross-school) — no guardianId or
// admin permission required. Map each child to the shape the tables expect.
export const getGuardianChildren = () =>
  getParentChildren().then((children) =>
    children.map((child) => ({
      id: child.student_id,
      student_id: child.student_id,
      full_name: child.student_name,
      admission_number: child.admission_number,
      school_name: child.school?.name,
      class_name: child.current_class,
      academic_year: child.academic_year,
    })),
  );

export const getStudentProfile = (studentId) => apiRequest(PARENT_STUDENT_ENDPOINTS.students.detail(studentId));

export const getAttendanceSummary = () => apiRequest(PARENT_STUDENT_ENDPOINTS.attendance.summary);

export const getStudentAttendance = (studentId) =>
  apiRequest(PARENT_STUDENT_ENDPOINTS.attendance.studentDetail(studentId));

export const getAttendanceByStream = (streamId) =>
  apiRequest(PARENT_STUDENT_ENDPOINTS.attendance.byStream(streamId));

export const getReportCard = (enrollmentId, termId) =>
  apiRequest(PARENT_STUDENT_ENDPOINTS.reports.reportCard(enrollmentId, termId));

export const downloadReportCard = (enrollmentId, termId, filename = "report-card.pdf") =>
  apiDownload(PARENT_STUDENT_ENDPOINTS.reports.reportCard(enrollmentId, termId), filename);

export const getExamReportCards = () => apiRequest(PARENT_STUDENT_ENDPOINTS.exams.reportCards);

export const getTermResults = () => apiRequest(PARENT_STUDENT_ENDPOINTS.exams.termResults);

export const getAnnualResults = () => apiRequest(PARENT_STUDENT_ENDPOINTS.exams.annualResults);

export const getBalanceStatement = (balanceId) => apiRequest(PARENT_STUDENT_ENDPOINTS.finance.balanceStatement(balanceId));

export const getInvoices = () => apiRequest(PARENT_STUDENT_ENDPOINTS.finance.invoices);

export const getPayments = () => apiRequest(PARENT_STUDENT_ENDPOINTS.finance.payments);
