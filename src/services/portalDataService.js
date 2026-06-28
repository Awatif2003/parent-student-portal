import { apiDownload, apiRequest } from "./api";
import { PARENT_STUDENT_ENDPOINTS } from "./parentStudentEndpoints";
import { getParentChildren } from "./attendanceService";
import { normalizeCollectionResponse } from "../utils/portalIdentity";

// ── Logged-in student (self) ────────────────────────────────────────────────
// The backend scopes /students/ to the caller's OWN record for a student
// account, so the list returns exactly one row — the student themselves. This
// is how the student portal resolves its identity (the JWT carries the User id,
// not the Student id, so we must not guess it).
export const getMyStudent = () =>
  apiRequest(PARENT_STUDENT_ENDPOINTS.students.list).then(
    (data) => normalizeCollectionResponse(data)[0] || null,
  );

// Full detail (with current_enrollment) for the logged-in student.
export const getMyStudentDetail = () =>
  getMyStudent().then((student) => (student?.id ? getStudentProfile(student.id) : null));

// The logged-in student's OWN attendance records (backend-scoped to self).
export const getMyAttendance = () =>
  apiRequest(PARENT_STUDENT_ENDPOINTS.attendance.students).then((data) =>
    normalizeCollectionResponse(data),
  );

// The linked children list comes from the parent self-service endpoint, which
// is scoped to the authenticated guardian (cross-school) — no guardianId or
// admin permission required. Map each child to the shape the tables expect.
export const getGuardianChildren = (params = {}) =>
  getParentChildren(params).then((children) =>
    children.map((child) => ({
      id: child.student_id,
      student_id: child.student_id,
      full_name: child.student_name,
      admission_number: child.admission_number,
      school_name: child.school?.name,
      class_name: child.current_class,
      academic_year: child.academic_year,
      attendance: Array.isArray(child.attendance) ? child.attendance : [],
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

// Report cards for the caller. The bare /exams/report-cards/ list is a
// placeholder that always returns []; instead we derive cards from term-results,
// which is backend-scoped to the caller (student → self, guardian → children).
//
// The term-results LIST is a lightweight shape (no term id, no subject grades),
// so for each result we fetch its detail (the full serializer), which carries
// the term id, subject grades and term summary — everything a report card needs
// to render and to drive the PDF download.
export const getExamReportCards = () =>
  apiRequest(PARENT_STUDENT_ENDPOINTS.exams.termResults)
    .then((data) => normalizeCollectionResponse(data))
    .then((rows) =>
      Promise.all(
        rows.map((row) =>
          apiRequest(PARENT_STUDENT_ENDPOINTS.exams.termResultDetail(row.id)).then((full) => ({
            enrollment: full.enrollment,
            term: full.term,
            term_result: full,
            subject_grades: full.subject_grades || [],
          })),
        ),
      ),
    );

// Continuous-assessment (live) marks for a specific student. The backend
// authorizes the caller: a student only ever sees their own (get_queryset
// scope), a parent only their linked children. Returns a flat array of marks
// (subject, exam, marks, %, grade). `termId` is optional.
export const getContinuousAssessmentForStudent = (studentId, termId) => {
  if (!studentId) {
    return Promise.resolve([]);
  }

  const params = new URLSearchParams({ student: studentId });
  if (termId) {
    params.append("term", termId);
  }

  return apiRequest(`${PARENT_STUDENT_ENDPOINTS.exams.continuousAssessment}?${params.toString()}`).then(
    (data) => normalizeCollectionResponse(data),
  );
};

// Convenience for the student portal: resolve the logged-in student's own id
// from the (self-scoped) /students/ list, then fetch their CA marks.
export const getMyContinuousAssessment = (termId) =>
  getMyStudent().then((student) => getContinuousAssessmentForStudent(student?.id, termId));

export const getTermResults = () => apiRequest(PARENT_STUDENT_ENDPOINTS.exams.termResults);

export const getAnnualResults = () => apiRequest(PARENT_STUDENT_ENDPOINTS.exams.annualResults);

export const getBalanceStatement = (balanceId) => apiRequest(PARENT_STUDENT_ENDPOINTS.finance.balanceStatement(balanceId));

export const getInvoices = () => apiRequest(PARENT_STUDENT_ENDPOINTS.finance.invoices);

export const getPayments = () => apiRequest(PARENT_STUDENT_ENDPOINTS.finance.payments);
