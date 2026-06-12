import DashboardLayout from "../../../components/DashboardLayout";
import ResultsPanel from "../../shared/ResultsPanel";
import { studentNavItems } from "../../student/studentNavItems";

function TermResults() {
  return (
    <DashboardLayout
      title="Term Results"
      subtitle="View published term exam results, grades, and teacher comments."
      navItems={studentNavItems}
    >
      <ResultsPanel variant="term-results" />
    </DashboardLayout>
  );
}

export default TermResults;
