// Shared stroke-icon set for the portal. One source of truth keeps the
// sidebar, top bar, cards, and notifications visually consistent.
const ICON_PATHS = {
  dashboard: (
    <>
      <path d="M4 13h6V4H4zM14 9h6V4h-6zM14 20h6v-9h-6zM4 20h6v-5H4z" />
    </>
  ),
  children: (
    <>
      <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M17 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M3.5 19c.6-3.6 2.6-5.5 5.5-5.5s4.9 1.9 5.5 5.5" />
      <path d="M15 13.7c2.3.2 3.8 1.9 4.3 4.3" />
    </>
  ),
  attendance: (
    <>
      <path d="M5 4h14v16H5z" />
      <path d="M8 3v3M16 3v3M5 9h14" />
      <path d="m9 14 2 2 4-4" />
    </>
  ),
  results: (
    <>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h4" />
    </>
  ),
  assessment: (
    <>
      <path d="M8 4h8v3H8z" />
      <path d="M6 5H5a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1" />
      <path d="m8.5 13 2 2 4-4.5" />
    </>
  ),
  finance: (
    <>
      <path d="M3 7h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M3 7V6a2 2 0 0 1 2-2h11" />
      <path d="M16 13h.01" />
    </>
  ),
  invoice: (
    <>
      <path d="M7 3h10v18l-2.5-1.5L12 21l-2.5-1.5L7 21z" />
      <path d="M10 8h4M10 12h4" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 2v20l2-1.3L10 22l2-1.3L14 22l2-1.3L18 22V2l-2 1.3L14 2l-2 1.3L10 2 8 3.3z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </>
  ),
  megaphone: (
    <>
      <path d="m3 11 14-6v14L3 13z" />
      <path d="M3 11v2a2 2 0 0 0 2 2h1v4h3v-4" />
      <path d="M20 9a3 3 0 0 1 0 6" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12M18 6 6 18" />
    </>
  ),
  logout: (
    <>
      <path d="M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3" />
      <path d="M10 17l-5-5 5-5" />
      <path d="M5 12h11" />
    </>
  ),
  chevron: (
    <>
      <path d="m6 9 6 6 6-6" />
    </>
  ),
  user: (
    <>
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M5 20c.8-3.5 3.3-5.5 7-5.5s6.2 2 7 5.5" />
    </>
  ),
  school: (
    <>
      <path d="m3 9 9-5 9 5-9 5z" />
      <path d="M7 11v5c0 1.4 2.5 2.5 5 2.5s5-1.1 5-2.5v-5" />
      <path d="M21 9v5" />
    </>
  ),
  sponsor: (
    <>
      <path d="M12 20s-7-4.2-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.8-7 9-7 9Z" />
    </>
  ),
  check: (
    <>
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path d="m8.5 12 2.2 2.2L15.5 9.5" />
    </>
  ),
  cross: (
    <>
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path d="m9.5 9.5 5 5M14.5 9.5l-5 5" />
    </>
  ),
  clock: (
    <>
      <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path d="M12 7.5V12l3 1.7" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 0 0-14-4.5L4 8" />
      <path d="M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14 4.5L20 16" />
      <path d="M20 20v-4h-4" />
    </>
  ),
  inbox: (
    <>
      <path d="M4 13h4l1.5 2.5h5L16 13h4" />
      <path d="M5 5h14l2 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5z" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v11" />
      <path d="m8 11 4 4 4-4" />
      <path d="M5 19h14" />
    </>
  ),
};

function Icon({ name, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      className={`ui-icon ${className}`.trim()}
    >
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {ICON_PATHS[name] || ICON_PATHS.dashboard}
      </g>
    </svg>
  );
}

export default Icon;
