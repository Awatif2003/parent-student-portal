import DashboardLayout from "../../../components/DashboardLayout";
import ResultsPanel from "../../shared/ResultsPanel";
import ParentStudentTable from "../ParentStudentTable";
import { parentNavItems } from "../parentNavItems";

function ContinuousAssessments() {
  return (
    <DashboardLayout
      title="Continuous Assessment"
      subtitle="View coursework, quizzes, assignments, and other continuous assessment marks."
      navItems={parentNavItems}
    >
      <ParentStudentTable
        title="Students Continuous Assessment"
        description="Select a student to view continuous assessment records."
        actionPath="/parent/results/continuous-assessments"
      />
      <ResultsPanel variant="exam-cards" />
    </DashboardLayout>
  );
}

export default ContinuousAssessments;
