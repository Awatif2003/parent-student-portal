import { apiRequest } from "./api";
import { PARENT_STUDENT_ENDPOINTS } from "./parentStudentEndpoints";

export const ATTENDANCE_ENDPOINTS = {
  ...PARENT_STUDENT_ENDPOINTS.attendance,
};

// Fetch the parent's linked children (cross-school) with their nested
// attendance. Returns the raw `children` array from the API.
export const getParentChildren = (params = {}) =>
  apiRequest(withQueryParams(ATTENDANCE_ENDPOINTS.parentChildren, params)).then((data) =>
    Array.isArray(data?.children) ? data.children : [],
  );

// Flatten each child's nested attendance into table-ready rows enriched with
// the child's identity. AttendanceRecordsTable expects flat records.
export const getStudentAttendanceRecords = (params = {}) =>
  getParentChildren(params).then((children) =>
    children.flatMap((child) =>
      (child.attendance || []).map((record) => ({
        ...record,
        student_id: child.student_id,
        student_name: child.student_name,
        admission_number: child.admission_number,
        class_name: child.current_class,
        school: child.school,
      })),
    ),
  );

export const getMyChildrenAttendance = getStudentAttendanceRecords;

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
