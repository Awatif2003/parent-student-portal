import { apiRequest } from "./api";
import { clearAuthSession, saveAuthSession } from "../utils/authStorage";
import { PARENT_STUDENT_ENDPOINTS } from "./parentStudentEndpoints";

export const AUTH_ENDPOINTS = {
  ...PARENT_STUDENT_ENDPOINTS.auth,
};

export const login = async (credentials) => {
  const loginData = await apiRequest(AUTH_ENDPOINTS.login, {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  const authSession = normalizeAuthResponse(loginData);
  saveAuthSession({
    accessToken: authSession.accessToken,
    refreshToken: authSession.refreshToken,
  });

  const user = await getCurrentUser();
  const completeAuthSession = {
    ...authSession,
    user,
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

export const getCurrentUser = () => apiRequest(AUTH_ENDPOINTS.me);

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
  const accessToken = data.access || data.accessToken || data.token || data.data?.accessToken || data.data?.token;
  const refreshToken = data.refresh || data.refreshToken || data.data?.refreshToken;
  const user = data.user || data.data?.user || null;

  return {
    accessToken,
    refreshToken,
    user,
  };
}
