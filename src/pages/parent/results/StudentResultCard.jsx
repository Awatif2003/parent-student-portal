import DashboardLayout from "../../../components/DashboardLayout";
import ResultsPanel from "../../shared/ResultsPanel";
import ParentStudentTable from "../ParentStudentTable";
import { parentNavItems } from "../parentNavItems";

function StudentResultCard() {
  return (
    <DashboardLayout
      title="Student Result Card"
      subtitle="Download the selected student's report card from the API."
      navItems={parentNavItems}
    >
      <ParentStudentTable title="Students Result Card" description="Select a student to download a result card." actionPath="/parent/results/student-result-card" />
      <ResultsPanel variant="report-card" />
    </DashboardLayout>
  );
}

export default StudentResultCard;
