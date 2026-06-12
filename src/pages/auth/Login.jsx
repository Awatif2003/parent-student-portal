import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../components/brand/Logo";
import { login } from "../../services/authService";
import { getDashboardPathForRole, getUserRole } from "../../utils/authStorage";

const features = [
  "Academic progress",
  "Attendance updates",
  "School announcements",
];

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [language, setLanguage] = useState("english");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { user } = await login(formData);
      const role = getUserRole(user);
      const dashboardPath = getDashboardPathForRole(role);

      if (role === "parent" || role === "guardian" || role === "student") {
        navigate(dashboardPath, { replace: true });
        return;
      }

      setError("Login successful, but your account role is not supported yet.");
    } catch (loginError) {
      setError(loginError.message || "Login failed. Please check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="school-mark">
          <Logo variant="login" />
        </div>

        <div className="education-illustration" aria-hidden="true">
          <div className="illustration-card illustration-card-parent">
            <span>P</span>
          </div>
          <div className="illustration-card illustration-card-student">
            <span>S</span>
          </div>
          <div className="illustration-card illustration-card-school">
            <span>School</span>
          </div>
          <div className="illustration-book" />
        </div>

        <div className="login-hero-copy">
          <h1>Parent Student Portal</h1>
          <p>
            A secure school-management system for families and students to stay informed, prepared, and connected.
          </p>

          <ul className="feature-list" aria-label="Portal features">
            {features.map((feature) => (
              <li key={feature}>
                <span aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="login-panel" aria-labelledby="login-heading">
        <div className="login-card">
          <div className="login-card-header">
            <p className="login-kicker">ShuleYangu</p>
            <h2 id="login-heading">Welcome Back</h2>
            <p>
              Access your student or parent portal to view academic progress,
              attendance, announcements, and school updates.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field">
              Username
              <input
                type="text"
                name="email"
                placeholder="Enter your username"
                value={formData.email}
                onChange={handleChange}
                autoComplete="username"
                required
              />
            </label>

            <label className="field">
              Password
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowPassword((currentValue) => !currentValue)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </label>

            <a className="forgot-link" href="#forgot-password">
              Forgot Password?
            </a>

            {error ? <p className="form-error">{error}</p> : null}

            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="login-secondary">
            <div className="language-switcher" aria-label="Select language">
              <span>Select Language</span>
              <button
                className={language === "english" ? "active" : ""}
                type="button"
                onClick={() => setLanguage("english")}
              >
                English
              </button>
              <span aria-hidden="true">|</span>
              <button
                className={language === "swahili" ? "active" : ""}
                type="button"
                onClick={() => setLanguage("swahili")}
              >
                Kiswahili
              </button>
            </div>

            <p className="help-message">
              Need help signing in? Contact your school administrator.
            </p>

          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
