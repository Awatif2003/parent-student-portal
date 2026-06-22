export const parentNavItems = [
  { label: "Parent Dashboard", href: "/parent" },
  { label: "My Children", href: "/parent/children" },
  { label: "Attendance", href: "/parent/attendance" },
  {
    label: "Results",
    children: [
      { label: "Continuous Assessment", href: "/parent/results/continuous-assessments" },
      { label: "Annual Results", href: "/parent/results/term-results" },
      { label: "Student Result Card", href: "/parent/results/student-result-card" },
    ],
  },
  {
    label: "Finance Information",
    children: [
      { label: "Invoice", href: "/parent/finance/invoice" },
      { label: "Receipts", href: "/parent/finance/receipts" },
    ],
  },
];
