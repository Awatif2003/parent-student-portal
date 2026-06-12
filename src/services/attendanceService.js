import { apiRequest } from "./api";
import { PARENT_STUDENT_ENDPOINTS } from "./parentStudentEndpoints";

export const ATTENDANCE_ENDPOINTS = {
  ...PARENT_STUDENT_ENDPOINTS.attendance,
};

export const getStudentAttendanceRecords = (params = {}) =>
  apiRequest(withQueryParams(ATTENDANCE_ENDPOINTS.students, params));

export const createStudentAttendanceRecord = (attendanceData) =>
  apiRequest(ATTENDANCE_ENDPOINTS.students, {
    method: "POST",
    body: JSON.stringify(attendanceData),
  });

export const getStudentAttendanceRecord = (id) => apiRequest(ATTENDANCE_ENDPOINTS.studentDetail(id));

export const updateStudentAttendanceRecord = (id, attendanceData) =>
  apiRequest(ATTENDANCE_ENDPOINTS.studentDetail(id), {
    method: "PUT",
    body: JSON.stringify(attendanceData),
  });

export const deleteStudentAttendanceRecord = (id) =>
  apiRequest(ATTENDANCE_ENDPOINTS.studentDetail(id), {
    method: "DELETE",
  });

export const recordBulkStudentAttendance = (attendanceData) =>
  apiRequest(ATTENDANCE_ENDPOINTS.bulk, {
    method: "POST",
    body: JSON.stringify(attendanceData),
  });

export const getStudentAttendanceByDate = (date) => apiRequest(ATTENDANCE_ENDPOINTS.byDate(date));

export const getStudentAttendanceByStream = (streamId) => apiRequest(ATTENDANCE_ENDPOINTS.byStream(streamId));

function withQueryParams(endpoint, params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `${endpoint}?${queryString}` : endpoint;
}
