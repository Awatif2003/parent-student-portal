import syLogo from "../../assets/logos/sy-logo.svg";
import shuleYanguLogo from "../../assets/logos/shuleyangu-logo.svg";

const variantClassNames = {
  icon: "logo logo-icon",
  full: "logo logo-full",
  sidebar: "logo logo-sidebar",
  login: "logo logo-login",
};

function Logo({ variant = "full", className = "" }) {
  const isIconOnly = variant === "icon";
  const usesTextLockup = variant === "sidebar" || variant === "login";
  const logoSource = isIconOnly ? syLogo : shuleYanguLogo;
  const classNames = `${variantClassNames[variant] || variantClassNames.full} ${className}`.trim();

  if (usesTextLockup) {
    return (
      <span className={classNames}>
        <img src={syLogo} alt="" aria-hidden="true" />
        <span className="logo-copy">
          <span className="logo-name">ShuleYangu</span>
          <span className="logo-tagline">Parent & Student Portal</span>
        </span>
      </span>
    );
  }

  return (
    <span className={classNames}>
      <img src={logoSource} alt={isIconOnly ? "ShuleYangu" : "ShuleYangu Parent & Student Portal"} />
    </span>
  );
}

export default Logo;
