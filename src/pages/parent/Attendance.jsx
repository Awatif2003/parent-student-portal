import DashboardLayout from "../../components/DashboardLayout";
import AttendancePreview from "../shared/AttendancePreview";

function Attendance() {
  return (
    <DashboardLayout
      title="Attendance"
      subtitle="Review attendance summary and the latest attendance records returned by the API."
      navItems={[
        { label: "Parent Dashboard", href: "/parent" },
        { label: "My Children", href: "/parent/children" },
        { label: "Attendance", href: "/parent/attendance" },
      ]}
    >
      <AttendancePreview />
    </DashboardLayout>
  );
}

export default Attendance;
