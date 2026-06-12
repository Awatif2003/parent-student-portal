import DashboardLayout from "../../../components/DashboardLayout";
import ResultsPanel from "../../shared/ResultsPanel";
import { studentNavItems } from "../../student/studentNavItems";

function StudentResultCard() {
  return (
    <DashboardLayout
      title="Student Result Card"
      subtitle="Download the selected student's report card from the API."
      navItems={studentNavItems}
    >
      <ResultsPanel variant="report-card" />
    </DashboardLayout>
  );
}

export default StudentResultCard;
