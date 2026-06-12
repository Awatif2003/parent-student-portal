const DEFAULT_API_BASE_URL = "/api/v1";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

export const buildApiUrl = (endpoint) => {
  const baseUrl = API_BASE_URL.replace(/\/$/, "");
  const apiEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  return `${baseUrl}${apiEndpoint}`;
};

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("accessToken");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildApiUrl(endpoint), {
    credentials: "include",
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `API request failed with status ${response.status}`;

    try {
      const errorData = await response.json();
      message = errorData.message || errorData.detail || errorData.error || message;
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  return JSON.parse(responseText);
}

export async function apiDownload(endpoint, filename, options = {}) {
  const token = localStorage.getItem("accessToken");
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildApiUrl(endpoint), {
    credentials: "include",
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Download failed with status ${response.status}`;

    try {
      const errorData = await response.json();
      message = errorData.message || errorData.detail || errorData.error || message;
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
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
