import { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./brand/Logo";
import { clearAuthSession, getCurrentUser, getUserRole } from "../utils/authStorage";

function DashboardLayout({
  title,
  subtitle,
  sections = [],
  accent = "blue",
  navItems,
  children,
  hideDashboardHeader = false,
  contentClassName = "",
  pageClassName = "",
}) {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const role = getUserRole(user);
  const homePath = role === "student" ? "/student" : "/parent";
  const sidebarItems =
    navItems ||
    sections.map((section) => ({
      label: section.title,
      href: `#${section.id}`,
    }));
  const navLinkClassName = ({ isActive }) => (isActive ? "sidebar-nav-link active" : "sidebar-nav-link");
  const subnavLinkClassName = ({ isActive }) => (isActive ? "sidebar-subnav-link active" : "sidebar-subnav-link");

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

  const handleSignOut = () => {
    clearAuthSession();
    navigate("/", { replace: true });
  };

  return (
    <main className={`dashboard-page ${pageClassName}`}>
      <aside className="sidebar">
        <Link className="brand" to={homePath}>
          <Logo variant="sidebar" />
        </Link>

        <div className="sidebar-user">
          <span>{user?.full_name || "Portal User"}</span>
          <small>{user?.email || "Signed in"}</small>
        </div>

        <nav className="sidebar-nav" aria-label={`${title} navigation`}>
          {sidebarItems.map((item) => (
            <div className="sidebar-nav-item" key={item.label}>
              {item.children ? (
                <>
                  <div className="sidebar-nav-heading">{item.label}</div>
                  <div className="sidebar-subnav">
                    {item.children.map((child) => (
                      <NavLink className={subnavLinkClassName} key={child.href} to={child.href}>
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                </>
              ) : item.href?.startsWith("#") ? (
                <a className="sidebar-nav-link" href={item.href}>
                  {item.label}
                </a>
              ) : (
                <NavLink className={navLinkClassName} to={item.href}>
                  {item.label}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        <button className="sidebar-signout" type="button" onClick={handleSignOut}>
          Sign Out
        </button>
      </aside>

      <section className={`dashboard-content ${contentClassName}`}>
        <div className="dashboard-topbar">
          <Link className="dashboard-topbar-brand" to={homePath}>
            <Logo variant="sidebar" />
          </Link>
        </div>

        {!hideDashboardHeader ? (
          <header className={`dashboard-header dashboard-header-${accent}`}>
            <div>
              <p className="eyebrow">Dashboard</p>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
          </header>
        ) : null}

        {children || (
          <div className="dashboard-grid">
            {sections.map((section) => (
              <article className={`dashboard-card ${section.content ? "dashboard-card-wide" : ""}`} id={section.id} key={section.title}>
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
      </section>
    </main>
  );
}

export default DashboardLayout;
