# Parent and Student API Scope

This portal should only consume endpoints needed for parent and student experiences.

## Auth
- POST /api/v1/auth/login/
- POST /api/v1/auth/logout/
- GET /api/v1/auth/me/
- POST /api/v1/auth/token/refresh/

## Dashboard
- GET /api/v1/dashboard/overview/
- GET /api/v1/dashboard/attendance/
- GET /api/v1/dashboard/exams/
- GET /api/v1/dashboard/finance/
- GET /api/v1/dashboard/students/

## Students and Guardians
- GET /api/v1/students/
- GET /api/v1/students/{id}/
- GET /api/v1/students/{id}/enrollments/
- GET /api/v1/students/{id}/guardians/
- GET /api/v1/students/enrollments/
- GET /api/v1/students/enrollments/{id}/
- GET /api/v1/students/enrollments/by-stream/{streamId}/
- GET /api/v1/students/enrollments/by-year/{yearId}/
- GET /api/v1/students/enrollments/class_list/
- GET /api/v1/students/guardians/
- GET /api/v1/students/guardians/{id}/
- GET /api/v1/students/guardians/{id}/students/

## Attendance
- GET /api/v1/attendance/students/
- GET /api/v1/attendance/students/{id}/
- POST /api/v1/attendance/students/bulk/
- GET /api/v1/attendance/students/by-date/{date}/
- GET /api/v1/attendance/students/by-stream/{streamId}/
- GET /api/v1/attendance/students/summary/

## Results and Report Cards
- GET /api/v1/exams/marks/
- GET /api/v1/exams/marks/by-exam/{examId}/
- GET /api/v1/exams/subject-grades/
- GET /api/v1/exams/term-results/
- GET /api/v1/exams/term-results/{id}/
- GET /api/v1/exams/term-results/by-stream/
- GET /api/v1/exams/report-cards/
- GET /api/v1/exams/annual-results/
- GET /api/v1/reports/report-card/{enrollmentId}/{termId}/
- POST /api/v1/reports/report-card/{enrollmentId}/{termId}/
- GET /api/v1/reports/report-cards/bulk/
- POST /api/v1/reports/report-cards/bulk/

## Finance (Parent)
- GET /api/v1/finance/balances/
- GET /api/v1/finance/balances/{id}/
- GET /api/v1/finance/balances/{id}/statement/
- GET /api/v1/finance/balances/by-stream/
- GET /api/v1/finance/invoices/
- GET /api/v1/finance/invoices/{id}/
- GET /api/v1/finance/payments/
- GET /api/v1/finance/payments/{id}/
- GET /api/v1/finance/payments/daily_collection/

## Notifications
- GET /api/v1/notifications/
- GET /api/v1/notifications/unread/
- POST /api/v1/notifications/{id}/read/
- POST /api/v1/notifications/read-all/

## Current Frontend Mapping
- src/services/parentStudentEndpoints.js: single source of scoped endpoints.
- src/services/authService.js: auth calls.
- src/services/attendanceService.js: attendance calls.
- src/services/dashboardService.js: parent/student dashboard summary calls.
- src/services/guardianService.js: guardian to student mapping call.
- src/services/reportService.js: report-card generation and downloads.
