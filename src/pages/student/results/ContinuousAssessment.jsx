import DashboardLayout from "../../../components/DashboardLayout";
import ResultsPanel from "../../shared/ResultsPanel";
import { studentNavItems } from "../studentNavItems";

function ContinuousAssessment() {
  return (
    <DashboardLayout
      title="Continuous Assessment"
      subtitle="View coursework, quizzes, assignments, and other continuous assessment marks."
      navItems={studentNavItems}
    >
      <ResultsPanel variant="exam-cards" />
    </DashboardLayout>
  );
}

export default ContinuousAssessment;
