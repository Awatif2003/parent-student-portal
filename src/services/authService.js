import { apiRequest } from "./api";
import { clearAuthSession, getPrimaryRoleAssignment, saveAuthSession } from "../utils/authStorage";
import { PARENT_STUDENT_ENDPOINTS } from "./parentStudentEndpoints";

export const AUTH_ENDPOINTS = {
  ...PARENT_STUDENT_ENDPOINTS.auth,
};

export const login = async (credentials) => {
  const loginPayload = normalizeLoginCredentials(credentials);
  const loginData = await apiRequest(AUTH_ENDPOINTS.login, {
    method: "POST",
    body: JSON.stringify(loginPayload),
  });

  const authSession = normalizeAuthResponse(loginData);
  const fallbackUser = normalizeUserProfile(authSession.user || loginData?.user || null);
  const fallbackTenant = loginData?.tenant || null;

  if (!authSession.accessToken) {
    throw new Error("Login response did not include an access token.");
  }

  saveAuthSession({
    accessToken: authSession.accessToken,
    refreshToken: authSession.refreshToken,
    user: mergeAuthProfiles(fallbackUser, fallbackUser, fallbackTenant),
  });

  let currentUserProfile;

  try {
    currentUserProfile = await getCurrentUser();
  } catch {
    currentUserProfile = null;
  }

  const completeUser = mergeAuthProfiles(normalizeUserProfile(currentUserProfile) || fallbackUser, fallbackUser, fallbackTenant);
  const completeAuthSession = {
    ...authSession,
    user: completeUser,
  };

  saveAuthSession(completeAuthSession);

  return completeAuthSession;
};

export const logout = () =>
  apiRequest(AUTH_ENDPOINTS.logout, {
    method: "POST",
    body: JSON.stringify({
      refresh: localStorage.getItem("refreshToken"),
    }),
  }).finally(() => {
    clearAuthSession();
  });

export const getCurrentUser = async () => normalizeUserProfile(await apiRequest(AUTH_ENDPOINTS.me));

export const register = (userData) =>
  apiRequest(AUTH_ENDPOINTS.register, {
    method: "POST",
    body: JSON.stringify(userData),
  });

export const refreshToken = (tokenData) =>
  apiRequest(AUTH_ENDPOINTS.refreshToken, {
    method: "POST",
    body: JSON.stringify(tokenData),
  });

function normalizeAuthResponse(data) {
  const accessToken = data?.access || data?.accessToken || data?.token || data?.data?.access || data?.data?.accessToken || data?.data?.token;
  const refreshToken = data?.refresh || data?.refreshToken || data?.data?.refresh || data?.data?.refreshToken;
  const user = data?.user || data?.data?.user || null;

  return {
    accessToken,
    refreshToken,
    user,
  };
}

function normalizeUserProfile(user) {
  if (!user || typeof user !== "object") {
    return user || null;
  }

  const profile = user.data && typeof user.data === "object" ? user.data : user;
  // Use the shared family-first selector so the derived role/tenant matches what
  // getUserRole resolves (parent/student preferred over any staff role).
  const primaryRoleAssignment = getPrimaryRoleAssignment(profile);

  if (!primaryRoleAssignment) {
    return profile;
  }

  return {
    ...profile,
    organization_id: profile.organization_id || primaryRoleAssignment.organization,
    organization_name: profile.organization_name || primaryRoleAssignment.organization_name,
    school_id: profile.school_id || primaryRoleAssignment.school,
    school_name: profile.school_name || primaryRoleAssignment.school_name,
    role_id: profile.role_id || primaryRoleAssignment.role,
    role_name: profile.role_name || primaryRoleAssignment.role_name,
    role_codename: profile.role_codename || primaryRoleAssignment.role_codename,
    permissions: Array.isArray(profile.permissions) ? profile.permissions : primaryRoleAssignment.permissions || [],
    tenant: profile.tenant || {
      organization: primaryRoleAssignment.organization,
      organization_id: primaryRoleAssignment.organization,
      organization_name: primaryRoleAssignment.organization_name,
      school: primaryRoleAssignment.school,
      school_id: primaryRoleAssignment.school,
      school_name: primaryRoleAssignment.school_name,
      role: primaryRoleAssignment.role_codename,
      role_name: primaryRoleAssignment.role_name,
    },
  };
}

function normalizeLoginCredentials(credentials) {
  const username = credentials.username || credentials.email;

  return {
    email: username,
    username,
    password: credentials.password,
  };
}

function mergeAuthProfiles(profile, fallbackUser, fallbackTenant) {
  const baseProfile = profile || fallbackUser || {};

  if (baseProfile?.tenant || !fallbackTenant) {
    return baseProfile;
  }

  return {
    ...baseProfile,
    tenant: fallbackTenant,
  };
}
