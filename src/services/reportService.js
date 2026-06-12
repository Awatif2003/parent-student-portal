import { apiDownload, apiRequest } from "./api";
import { PARENT_STUDENT_ENDPOINTS } from "./parentStudentEndpoints";

export const REPORT_ENDPOINTS = {
  ...PARENT_STUDENT_ENDPOINTS.reports,
};

export const downloadReportCard = (enrollmentId, termId, filename = "report-card.pdf") =>
  apiDownload(REPORT_ENDPOINTS.reportCard(enrollmentId, termId), filename);

export const generateReportCard = (enrollmentId, termId) =>
  apiRequest(REPORT_ENDPOINTS.reportCard(enrollmentId, termId), {
    method: "POST",
  });

export const downloadBulkReportCards = (filename = "report-cards.zip") =>
  apiDownload(REPORT_ENDPOINTS.bulkReportCards, filename);

export const generateBulkReportCards = (payload) =>
  apiRequest(REPORT_ENDPOINTS.bulkReportCards, {
    method: "POST",
    body: payload ? JSON.stringify(payload) : undefined,
  });
