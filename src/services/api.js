const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api").replace(/\/+$/, "");
const AUTH_BASE_URL = API_BASE_URL.replace(/\/api$/, "") + "/api/v1/auth";

function normalizePayload(payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined && item !== "") {
          formData.append(`${key}[]`, String(item));
        }
      });
      return;
    }

    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
}

function getToken() {
  return localStorage.getItem('access_token');
}

function getAuthHeaders() {
  const token = getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function authFetch(url, options = {}) {
  const headers = {
    ...options.headers,
    ...getAuthHeaders(),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  return response;
}

export async function submitPelaporan(payload) {
  const formData = normalizePayload(payload);

  const response = await authFetch(`${API_BASE_URL}/pelaporan`, {
    method: "POST",
    body: formData,
  });

  const text = await response.text();
  let result;

  try {
    result = text ? JSON.parse(text) : null;
  } catch {
    result = text;
  }

  if (!response.ok) {
    const message = result?.detail?.[0]?.msg || result?.detail || result?.message || "Gagal mengirim laporan.";
    throw new Error(message);
  }

  return result;
}

export async function login(identifier, password) {
  const response = await fetch(`${AUTH_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data.detail?.[0]?.msg || data.detail || data.message || "Login gagal.";
    throw new Error(message);
  }

  return data;
}

export async function getProfile() {
  const response = await authFetch(`${AUTH_BASE_URL}/me`);

  const data = await response.json();

  if (!response.ok) {
    const message = data.detail?.[0]?.msg || data.detail || data.message || "Gagal mengambil profil.";
    throw new Error(message);
  }

  return data;
}

export async function logout() {
  const token = getToken();
  if (!token) return;

  try {
    await fetch(`${AUTH_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });
  } catch {
    // Ignore logout API errors
  }
}