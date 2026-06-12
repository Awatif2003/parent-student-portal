import DashboardLayout from "../../../components/DashboardLayout";
import ResultsPanel from "../../shared/ResultsPanel";
import { studentNavItems } from "../studentNavItems";

function StudentResults() {
  return (
    <DashboardLayout
      title="Student Result"
      subtitle="Review overall academic performance, subject scores, and progress across terms."
      navItems={studentNavItems}
    >
      <ResultsPanel variant="exam-cards" />
    </DashboardLayout>
  );
}

export default StudentResults;
