import { apiRequest } from "./api";
import { PARENT_STUDENT_ENDPOINTS } from "./parentStudentEndpoints";

export const GUARDIAN_ENDPOINTS = {
  students: PARENT_STUDENT_ENDPOINTS.students.guardianStudents,
};

export const getGuardianStudents = (guardianId) => apiRequest(GUARDIAN_ENDPOINTS.students(guardianId));
