import { Navigate } from "react-router-dom";
import { getCurrentUser, getDashboardPathForRole, getUserRole, isAuthenticated, isParentRole } from "../utils/authStorage";

function ProtectedRoute({ children, allowedRoles }) {
  const user = getCurrentUser();
  const role = getUserRole(user);

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles?.length) {
    const roleAllowed = allowedRoles.includes(role) || (isParentRole(role) && allowedRoles.includes("parent"));

    if (!roleAllowed) {
      return <Navigate to={getDashboardPathForRole(role)} replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
