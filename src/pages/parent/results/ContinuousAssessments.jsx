import { useSearchParams } from "react-router-dom";
import DashboardLayout from "../../../components/DashboardLayout";
import ContinuousAssessmentMarks from "../../shared/ContinuousAssessmentMarks";
import ParentStudentTable from "../ParentStudentTable";
import { parentNavItems } from "../parentNavItems";

function ContinuousAssessments() {
  const [searchParams] = useSearchParams();
  const selectedStudentId = searchParams.get("studentId");

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
      <ContinuousAssessmentMarks studentId={selectedStudentId} />
    </DashboardLayout>
  );
}

export default ContinuousAssessments;
