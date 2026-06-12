import DashboardLayout from "../../components/DashboardLayout";
import AttendancePreview from "../shared/AttendancePreview";
import { studentNavItems } from "./studentNavItems";

const studentSections = [
  {
    id: "my-details",
    title: "Student Details",
    icon: "D",
    description: "See personal information, class placement, admission number, and school profile details.",
  },
  {
    id: "attendance",
    title: "Attendance",
    icon: "A",
    description: "Check attendance records, present days, absences, and late marks.",
    content: <AttendancePreview />,
  },
  {
    id: "results",
    title: "Results",
    icon: "R",
    description: "Review continuous assessments, term results, and academic progress across subjects.",
  },
];

function StudentDashboard() {
  return (
    <DashboardLayout
      title="Student Dashboard"
      subtitle="A clear place to view student details, attendance, assessments, and term results."
      sections={studentSections}
      navItems={studentNavItems}
    />
  );
}

export default StudentDashboard;
