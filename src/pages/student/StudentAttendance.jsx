import DashboardLayout from "../../components/DashboardLayout";
import AttendancePreview from "../shared/AttendancePreview";
import { studentNavItems } from "./studentNavItems";

function StudentAttendance() {
  return (
    <DashboardLayout
      title="Attendance"
      subtitle="View attendance records, present days, absences, and late marks."
      navItems={studentNavItems}
    >
      <AttendancePreview />
    </DashboardLayout>
  );
}

export default StudentAttendance;
