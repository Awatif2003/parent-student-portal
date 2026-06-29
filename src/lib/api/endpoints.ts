/**
 * Centralized API path constants for the family portal — the single source of
 * truth for URL strings.
 *
 * ⚠️ All endpoints require a TRAILING slash. Django's APPEND_SLASH redirects
 * slashless POST requests and drops the body, causing 404s. Do NOT let axios,
 * an interceptor, or any helper strip these trailing slashes.
 *
 * These are scoped to what a parent/guardian or student account is authorized
 * to read: the backend auto-scopes most collections to the caller (a student
 * sees only their own record; a guardian only their linked children).
 */

// ──── Auth ────
export const AUTH = {
  LOGIN: "/auth/login/",
  LOGOUT: "/auth/logout/",
  REFRESH: "/auth/token/refresh/",
  ME: "/auth/me/",
  REGISTER: "/auth/register/",
} as const

// ──── Dashboard ────
export const DASHBOARD = {
  OVERVIEW: "/dashboard/overview/",
  ATTENDANCE: "/dashboard/attendance/",
  EXAMS: "/dashboard/exams/",
  FINANCE: "/dashboard/finance/",
  STUDENTS: "/dashboard/students/",
} as const

// ──── Students ────
// For a student account the list is backend-scoped to the caller's OWN record
// (returns exactly one row) — this is how the student portal resolves its
// identity (the JWT carries the User id, not the Student id).
export const STUDENTS = {
  LIST: "/students/",
  DETAIL: (id: string | number) => `/students/${id}/`,
  ENROLLMENTS: "/students/enrollments/",
  ENROLLMENT_DETAIL: (id: string | number) => `/students/enrollments/${id}/`,
  ENROLLMENT_BY_STREAM: (streamId: string | number) =>
    `/students/enrollments/by-stream/${streamId}/`,
  ENROLLMENT_BY_YEAR: (yearId: string | number) =>
    `/students/enrollments/by-year/${yearId}/`,
  CLASS_LIST: "/students/enrollments/class_list/",
  GUARDIANS: "/students/guardians/",
  GUARDIAN_DETAIL: (id: string | number) => `/students/guardians/${id}/`,
  GUARDIAN_STUDENTS: (id: string | number) =>
    `/students/guardians/${id}/students/`,
  STUDENT_GUARDIANS: (studentId: string | number) =>
    `/students/${studentId}/guardians/`,
} as const

// ──── Attendance ────
export const ATTENDANCE = {
  STUDENTS: "/attendance/students/",
  // Parent self-service: cross-school list of linked children, each with a
  // nested attendance array. Supports student_id/date/start_date/end_date.
  PARENT_CHILDREN: "/attendance/parent/children/",
  STUDENT_DETAIL: (id: string | number) => `/attendance/students/${id}/`,
  BULK: "/attendance/students/bulk/",
  BY_DATE: (date: string) => `/attendance/students/by-date/${date}/`,
  BY_STREAM: (streamId: string | number) =>
    `/attendance/students/by-stream/${streamId}/`,
  SUMMARY: "/attendance/students/summary/",
} as const

// ──── Exams / Results ────
export const EXAMS = {
  MARKS: "/exams/marks/",
  MARKS_BY_EXAM: (examId: string | number) => `/exams/marks/by-exam/${examId}/`,
  // Live marks (visible before results are published) for one student.
  CONTINUOUS_ASSESSMENT: "/exams/marks/continuous-assessment/",
  SUBJECT_GRADES: "/exams/subject-grades/",
  TERM_RESULTS: "/exams/term-results/",
  TERM_RESULT_DETAIL: (id: string | number) => `/exams/term-results/${id}/`,
  TERM_RESULTS_BY_STREAM: "/exams/term-results/by-stream/",
  ANNUAL_RESULTS: "/exams/annual-results/",
} as const

// ──── Reports ────
export const REPORTS = {
  REPORT_CARD: (enrollmentId: string | number, termId: string | number) =>
    `/reports/report-card/${enrollmentId}/${termId}/`,
  BULK_REPORT_CARDS: "/reports/report-cards/bulk/",
} as const

// ──── Finance ────
export const FINANCE = {
  BALANCES: "/finance/balances/",
  BALANCE_DETAIL: (id: string | number) => `/finance/balances/${id}/`,
  BALANCE_STATEMENT: (id: string | number) =>
    `/finance/balances/${id}/statement/`,
  BALANCES_BY_STREAM: "/finance/balances/by-stream/",
  INVOICES: "/finance/invoices/",
  INVOICE_DETAIL: (id: string | number) => `/finance/invoices/${id}/`,
  PAYMENTS: "/finance/payments/",
  PAYMENT_DETAIL: (id: string | number) => `/finance/payments/${id}/`,
  DAILY_COLLECTION: "/finance/payments/daily_collection/",
} as const

// ──── Notifications ────
export const NOTIFICATIONS = {
  LIST: "/notifications/",
  UNREAD: "/notifications/unread/",
  MARK_READ: (id: string | number) => `/notifications/${id}/read/`,
  READ_ALL: "/notifications/read-all/",
} as const
