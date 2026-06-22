import DashboardLayout from "../../../components/DashboardLayout";
import ResultsPanel from "../../shared/ResultsPanel";
import ParentStudentTable from "../ParentStudentTable";
import { parentNavItems } from "../parentNavItems";

function TermResults() {
  return (
    <DashboardLayout
      title="Annual Results"
      subtitle="View published annual results, divisions, rankings, promotion status, and teacher comments."
      navItems={parentNavItems}
    >
      <ParentStudentTable title="Students Annual Results" description="Select a student to view annual result records." actionPath="/parent/results/term-results" />
      <ResultsPanel variant="annual-results" />
    </DashboardLayout>
  );
}

export default TermResults;
