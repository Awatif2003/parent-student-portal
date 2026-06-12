import DashboardLayout from "../../../components/DashboardLayout";
import FinancePanel from "../../shared/FinancePanel";

function Invoice() {
  return (
    <DashboardLayout
      title="Invoice"
      subtitle="Review invoices and the current balance statement from the finance API."
      navItems={[
        { label: "Parent Dashboard", href: "/parent" },
        { label: "My Children", href: "/parent/children" },
        { label: "Invoice", href: "/parent/finance/invoice" },
        { label: "Receipts", href: "/parent/finance/receipts" },
      ]}
    >
      <FinancePanel variant="invoices" />
    </DashboardLayout>
  );
}

export default Invoice;
