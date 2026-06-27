import DashboardLayout from "../../../components/DashboardLayout";
import ContinuousAssessmentMarks from "../../shared/ContinuousAssessmentMarks";
import { studentNavItems } from "../studentNavItems";

function ContinuousAssessment() {
  return (
    <DashboardLayout
      title="Continuous Assessment"
      subtitle="View coursework, quizzes, assignments, and other continuous assessment marks."
      navItems={studentNavItems}
    >
      <ContinuousAssessmentMarks self />
    </DashboardLayout>
  );
}

export default ContinuousAssessment;
