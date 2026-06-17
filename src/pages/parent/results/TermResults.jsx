import DashboardLayout from "../../../components/DashboardLayout";
import ResultsPanel from "../../shared/ResultsPanel";
import ParentStudentTable from "../ParentStudentTable";
import { parentNavItems } from "../parentNavItems";

function TermResults() {
  return (
    <DashboardLayout
      title="Term Results"
      subtitle="View published term exam results, grades, and teacher comments."
      navItems={parentNavItems}
    >
      <ParentStudentTable title="Students Term Results" description="Select a student to view term result records." actionPath="/parent/results/term-results" />
      <ResultsPanel variant="term-results" />
    </DashboardLayout>
  );
}

export default TermResults;
