const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "currentUser";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const getCurrentUser = () => {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    clearAuthSession();
    return null;
  }
};

export const saveAuthSession = ({ accessToken, refreshToken, user }) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => Boolean(getAccessToken() || getRefreshToken());

export const getPrimaryRoleAssignment = (user) => {
  if (!Array.isArray(user?.role_assignments)) {
    return null;
  }

  return (
    user.role_assignments.find((assignment) => assignment.is_primary && assignment.is_active) ||
    user.role_assignments.find((assignment) => assignment.is_active) ||
    user.role_assignments[0]
  );
};

export const getUserRole = (user) => {
  const role = user?.role;
  const primaryRoleAssignment = getPrimaryRoleAssignment(user);
  const roleValue =
    primaryRoleAssignment?.role_codename ||
    primaryRoleAssignment?.role_name ||
    role?.codename ||
    role?.name ||
    user?.tenant?.role ||
    user?.tenant?.role_name ||
    user?.role_codename ||
    user?.role_name ||
    (typeof role === "string" ? role : "");

  return roleValue.toLowerCase();
};

export const isParentRole = (role) => ["parent", "guardian"].includes(String(role || "").toLowerCase());

export const getDashboardPathForRole = (role) => {
  const normalizedRole = String(role || "").toLowerCase();

  if (isParentRole(normalizedRole)) {
    return "/parent";
  }

  if (normalizedRole === "student") {
    return "/student";
  }

  return "/";
};
