import DashboardLayout from "../../../components/DashboardLayout";
import FinancePanel from "../../shared/FinancePanel";
import ParentStudentTable from "../ParentStudentTable";
import { parentNavItems } from "../parentNavItems";

function Receipts() {
  return (
    <DashboardLayout
      title="Receipts"
      subtitle="Review payment records from the finance API."
      navItems={parentNavItems}
    >
      <ParentStudentTable title="Students Receipts" description="Select a student to view receipt information." actionPath="/parent/finance/receipts" />
      <FinancePanel variant="payments" />
    </DashboardLayout>
  );
}

export default Receipts;
