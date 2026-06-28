import { clearAuthSession } from "../utils/authStorage";

const DEFAULT_API_BASE_URL = "/api/v1";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

const AUTH_ENDPOINTS = {
  login: "/auth/login/",
  register: "/auth/register/",
  refreshToken: "/auth/token/refresh/",
};

export const buildApiUrl = (endpoint) => {
  const baseUrl = API_BASE_URL.replace(/\/$/, "");
  const apiEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  return `${baseUrl}${apiEndpoint}`;
};

export async function apiRequest(endpoint, options = {}) {
  const response = await fetchWithAuthRetry(endpoint, options);

  if (!response.ok) {
    const errorMessage = await getErrorMessage(response, "API request failed");

    if (isAuthExpiredMessage(errorMessage)) {
      handleExpiredSession();
      throw new Error("Your session has expired. Please sign in again.");
    }

    throw new Error(errorMessage);
  }

  return unwrapApiResponse(await readJsonResponse(response));
}

export async function apiDownload(endpoint, filename, options = {}) {
  const response = await fetchWithAuthRetry(endpoint, options);

  if (!response.ok) {
    const errorMessage = await getErrorMessage(response, "Download failed");

    if (isAuthExpiredMessage(errorMessage)) {
      handleExpiredSession();
      throw new Error("Your session has expired. Please sign in again.");
    }

    throw new Error(errorMessage);
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);

  return blob;
}

async function fetchWithAuthRetry(endpoint, options = {}) {
  const requestInit = buildRequestInit(options);
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    await refreshAccessToken(requestInit, endpoint);
  }

  let response = await fetch(buildApiUrl(endpoint), requestInit);

  if (response.status !== 401) {
    return response;
  }

  const newAccessToken = await refreshAccessToken(requestInit, endpoint);

  if (!newAccessToken) {
    return response;
  }

  const retryHeaders = {
    ...requestInit.headers,
    Authorization: `Bearer ${newAccessToken}`,
  };

  return fetch(buildApiUrl(endpoint), {
    ...requestInit,
    headers: retryHeaders,
  });
}

async function refreshAccessToken(requestInit, endpoint) {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    return null;
  }

  if (endpoint === AUTH_ENDPOINTS.login || endpoint === AUTH_ENDPOINTS.register) {
    return null;
  }

  const refreshResponse = await fetch(buildApiUrl(AUTH_ENDPOINTS.refreshToken), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!refreshResponse.ok) {
    handleExpiredSession();
    return null;
  }

  const refreshedTokens = unwrapApiResponse(await readJsonResponse(refreshResponse));
  const newAccessToken = refreshedTokens?.access || refreshedTokens?.accessToken || refreshedTokens?.token;

  if (!newAccessToken) {
    handleExpiredSession();
    return null;
  }

  localStorage.setItem("accessToken", newAccessToken);
  requestInit.headers.Authorization = `Bearer ${newAccessToken}`;

  return newAccessToken;
}

function buildRequestInit(options = {}) {
  const token = localStorage.getItem("accessToken");
  const headers = {
    "Content-Type": "application/json",
    // Declare this as the family (parent/student) portal so the backend scopes
    // the user to their own children/record even if they also hold staff roles.
    "X-Portal": "family",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return {
    credentials: "include",
    ...options,
    headers,
  };
}

async function readJsonResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  return JSON.parse(responseText);
}

async function getErrorMessage(response, fallbackMessage) {
  const defaultMessage = `${fallbackMessage} with status ${response.status}`;

  try {
    const errorData = await response.json();
    return extractErrorMessage(errorData) || defaultMessage;
  } catch {
    return response.statusText || defaultMessage;
  }
}

function extractErrorMessage(errorData) {
  if (!errorData) {
    return "";
  }

  if (typeof errorData === "string") {
    return errorData;
  }

  if (typeof errorData !== "object") {
    return String(errorData);
  }

  if (typeof errorData.message === "string") {
    return errorData.message;
  }

  if (typeof errorData.data?.message === "string") {
    return errorData.data.message;
  }

  if (typeof errorData.detail === "string") {
    return errorData.detail;
  }

  if (typeof errorData.data?.detail === "string") {
    return errorData.data.detail;
  }

  if (typeof errorData.error === "string") {
    return errorData.error;
  }

  if (typeof errorData.error?.message === "string") {
    return errorData.error.message;
  }

  if (typeof errorData.error?.detail === "string") {
    return errorData.error.detail;
  }

  if (typeof errorData.error?.details?.detail === "string") {
    return errorData.error.details.detail;
  }

  if (typeof errorData.error?.code === "string") {
    return errorData.error.code;
  }

  if (typeof errorData.details?.detail === "string") {
    return errorData.details.detail;
  }

  if (typeof errorData.code === "string") {
    return errorData.code;
  }

  return "";
}

export function unwrapApiResponse(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return payload;
  }

  if (Object.prototype.hasOwnProperty.call(payload, "success") && Object.prototype.hasOwnProperty.call(payload, "data")) {
    return payload.data;
  }

  return payload;
}

function isAuthExpiredMessage(message) {
  return [
    "token_not_valid",
    "not_authenticated",
    "Authentication credentials were not provided.",
    "Token is expired",
    "Token is blacklisted",
    "Given token not valid for any token type",
  ].includes(String(message || ""));
}

function handleExpiredSession() {
  clearAuthSession();
  window.dispatchEvent(new Event("auth:session-expired"));
}
