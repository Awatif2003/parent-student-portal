import { apiRequest } from "./api";
import { PARENT_STUDENT_ENDPOINTS } from "./parentStudentEndpoints";

export const DASHBOARD_ENDPOINTS = {
  ...PARENT_STUDENT_ENDPOINTS.dashboard,
};

export const getDashboardOverview = () => apiRequest(DASHBOARD_ENDPOINTS.overview);

export const getDashboardAttendance = () => apiRequest(DASHBOARD_ENDPOINTS.attendance);

export const getDashboardExams = () => apiRequest(DASHBOARD_ENDPOINTS.exams);

export const getDashboardFinance = () => apiRequest(DASHBOARD_ENDPOINTS.finance);

export const getDashboardSummary = async () => {
  const [overview, attendance, exams, finance] = await Promise.all([
    getDashboardOverview(),
    getDashboardAttendance(),
    getDashboardExams(),
    getDashboardFinance(),
  ]);

  return {
    overview,
    attendance,
    exams,
    finance,
  };
};
