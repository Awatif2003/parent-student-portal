export const studentNavItems = [
  {
    label: "Student Details",
    href: "/student/details",
  },
  {
    label: "Attendance",
    href: "/student/attendance",
  },
  {
    label: "Results",
    children: [
      {
        label: "Continuous Assessment",
        href: "/student/results/continuous-assessment",
      },
      {
        label: "Term Results",
        href: "/student/results/term-results",
      },
      {
        label: "Student Result",
        href: "/student/results",
      },
    ],
  },
  {
    label: "Notifications",
    href: "/student/notifications",
  },
];
