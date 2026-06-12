import DashboardLayout from "../../../components/DashboardLayout";
import FinancePanel from "../../shared/FinancePanel";

function Receipts() {
  return (
    <DashboardLayout
      title="Receipts"
      subtitle="Review payment records from the finance API."
      navItems={[
        { label: "Parent Dashboard", href: "/parent" },
        { label: "My Children", href: "/parent/children" },
        { label: "Invoice", href: "/parent/finance/invoice" },
        { label: "Receipts", href: "/parent/finance/receipts" },
      ]}
    >
      <FinancePanel variant="payments" />
    </DashboardLayout>
  );
}

export default Receipts;
