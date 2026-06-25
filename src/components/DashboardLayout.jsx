import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Logo from "./brand/Logo";
import Icon from "./ui/Icon";
import NotificationBell from "./NotificationBell";
import { clearAuthSession, getCurrentUser, getUserRole } from "../utils/authStorage";

function DashboardLayout({
  title,
  subtitle,
  sections = [],
  // `accent` / `hideDashboardHeader` may still be passed by older call sites;
  // the unified shell renders one consistent header, so they are ignored here.
  navItems,
  children,
  contentClassName = "",
  pageClassName = "",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const role = getUserRole(user);
  const isStudent = role === "student";
  const homePath = isStudent ? "/student" : "/parent";
  const notificationsPath = isStudent ? "/student/notifications" : "/parent/notifications";
  const roleLabel = isStudent ? "Student Portal" : "Parent Portal";
  const displayName = getDisplayName(user, isStudent);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const sidebarItems = useMemo(
    () =>
      navItems ||
      sections.map((section) => ({
        label: section.title,
        href: `#${section.id}`,
      })),
    [navItems, sections],
  );

  useEffect(() => {
    const handleSessionExpired = () => {
      clearAuthSession();
      navigate("/", { replace: true });
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, [navigate]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    void Promise.resolve().then(() => setIsNavOpen(false));
  }, [location.pathname]);

  const handleSignOut = () => {
    clearAuthSession();
    navigate("/", { replace: true });
  };

  return (
    <div className={`app-shell ${pageClassName}`}>
      {isNavOpen ? <div className="app-scrim" onClick={() => setIsNavOpen(false)} aria-hidden="true" /> : null}

      <aside className={`app-sidebar${isNavOpen ? " is-open" : ""}`}>
        <div className="app-sidebar-top">
          <Link className="app-brand" to={homePath}>
            <Logo variant="sidebar" />
          </Link>
          <button
            className="app-sidebar-close"
            type="button"
            onClick={() => setIsNavOpen(false)}
            aria-label="Close menu"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="app-user-card">
          <span className="app-user-avatar" aria-hidden="true">
            {getInitials(displayName)}
          </span>
          <div className="app-user-meta">
            <strong>{displayName}</strong>
            <small>{user?.email || roleLabel}</small>
          </div>
        </div>

        <nav className="app-nav" aria-label={`${title} navigation`}>
          <NavItem to={homePath} icon="dashboard" label="Overview" end />
          {sidebarItems.map((item) => (
            <NavGroup key={item.label} item={item} />
          ))}
        </nav>

        <button className="app-signout" type="button" onClick={handleSignOut}>
          <Icon name="logout" />
          <span>Sign out</span>
        </button>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <button
            className="app-menu-btn"
            type="button"
            onClick={() => setIsNavOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="menu" />
          </button>

          <div className="app-topbar-titles">
            <p className="app-topbar-eyebrow">{roleLabel}</p>
            <h1>{title}</h1>
          </div>

          <div className="app-topbar-actions">
            <time className="app-topbar-date" dateTime={toIsoDate(new Date())}>
              {formatReadableDate(new Date())}
            </time>
            <NotificationBell to={notificationsPath} />
            <div className="app-profile" title={displayName}>
              <span className="app-profile-avatar" aria-hidden="true">
                {getInitials(displayName)}
              </span>
              <span className="app-profile-name">{displayName}</span>
            </div>
          </div>
        </header>

        <main className={`app-content ${contentClassName}`}>
          {subtitle ? <p className="app-page-subtitle">{subtitle}</p> : null}

          {children || (
            <div className="dashboard-grid">
              {sections.map((section) => (
                <article
                  className={`dashboard-card ${section.content ? "dashboard-card-wide" : ""}`}
                  id={section.id}
                  key={section.title}
                >
                  <div className="card-icon" aria-hidden="true">
                    {section.icon}
                  </div>
                  <div>
                    <h2>{section.title}</h2>
                    <p>{section.description}</p>
                  </div>
                  {section.content ? <div className="card-content">{section.content}</div> : null}
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function NavGroup({ item }) {
  const icon = iconForLabel(item.label);

  if (item.children) {
    return (
      <div className="app-nav-group">
        <div className="app-nav-group-label">
          <Icon name={icon} />
          <span>{item.label}</span>
        </div>
        <div className="app-nav-sub">
          {item.children.map((child) => (
            <NavLink
              key={child.href}
              to={child.href}
              className={({ isActive }) => `app-nav-sublink${isActive ? " active" : ""}`}
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      </div>
    );
  }

  if (item.href?.startsWith("#")) {
    return (
      <a className="app-nav-link" href={item.href}>
        <Icon name={icon} />
        <span>{item.label}</span>
      </a>
    );
  }

  return <NavItem to={item.href} icon={icon} label={item.label} />;
}

function NavItem({ to, icon, label, end = false }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => `app-nav-link${isActive ? " active" : ""}`}>
      <Icon name={icon} />
      <span>{label}</span>
    </NavLink>
  );
}

function iconForLabel(label) {
  const value = String(label || "").toLowerCase();

  if (value.includes("dashboard") || value.includes("overview")) return "dashboard";
  if (value.includes("child")) return "children";
  if (value.includes("attendance")) return "attendance";
  if (value.includes("assessment")) return "assessment";
  if (value.includes("result")) return "results";
  if (value.includes("invoice")) return "invoice";
  if (value.includes("receipt")) return "receipt";
  if (value.includes("finance") || value.includes("fee")) return "finance";
  if (value.includes("notification")) return "bell";
  if (value.includes("sponsor")) return "sponsor";
  if (value.includes("detail") || value.includes("profile")) return "user";

  return "results";
}

function getDisplayName(user, isStudent) {
  return (
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    user?.email ||
    (isStudent ? "Student" : "Parent")
  );
}

function getInitials(name) {
  const initials = String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "SY";
}

function formatReadableDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

export default DashboardLayout;
