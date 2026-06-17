import DashboardLayout from "../../../components/DashboardLayout";
import FinancePanel from "../../shared/FinancePanel";
import ParentStudentTable from "../ParentStudentTable";
import { parentNavItems } from "../parentNavItems";

function Invoice() {
  return (
    <DashboardLayout
      title="Invoice"
      subtitle="Review invoices and the current balance statement from the finance API."
      navItems={parentNavItems}
    >
      <ParentStudentTable title="Students Invoice" description="Select a student to view invoice information." actionPath="/parent/finance/invoice" />
      <FinancePanel variant="invoices" />
    </DashboardLayout>
  );
}

export default Invoice;
