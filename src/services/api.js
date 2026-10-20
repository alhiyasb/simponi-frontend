
/* =========================================================
   BASE URL
========================================================= */

/*
  .env:

  VITE_API_BASE_URL=https://pulmonary-stained-catnip.ngrok-free.dev/api
*/

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000/api"
).replace(/\/+$/, "");

const BASE_URL_V1 =
  API_BASE_URL.replace(/\/api$/, "") + "/api/v1";

const AUTH_BASE_URL = BASE_URL_V1 + "/auth";
const STATISTIK_BASE_URL = BASE_URL_V1 + "/statistik";
const REPORTS_BASE_URL = BASE_URL_V1 + "/reports";

/* Wajib untuk ngrok versi gratis */
const NGROK_HEADERS = {
  "ngrok-skip-browser-warning": "true",
};


/* =========================================================
   HELPER
========================================================= */

function normalizePayload(payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (
          item !== null &&
          item !== undefined &&
          item !== ""
        ) {
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
  return localStorage.getItem("access_token");
}

function getAuthHeaders() {
  const token = getToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

function getErrorMessage(data, fallback) {
  if (Array.isArray(data?.detail)) {
    return data.detail?.[0]?.msg || fallback;
  }

  return data?.detail || data?.message || fallback;
}


/* =========================================================
   AUTHENTICATED FETCH
========================================================= */

async function authFetch(url, options = {}) {
  const headers = {
    ...options.headers,
    ...getAuthHeaders(),
    ...NGROK_HEADERS,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("simponi-user-role");

    window.location.href = "/login";

    throw new Error("Sesi login telah berakhir.");
  }

  return response;
}


/* =========================================================
   REQUEST JSON
========================================================= */

async function postJson(url, body, fallbackMessage) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...NGROK_HEADERS,
    },
    body: JSON.stringify(body),
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(data, fallbackMessage));
  }

  return data;
}


/* =========================================================
   LAPORAN
========================================================= */

/* POST /api/v1/reports */
export async function submitPelaporan(payload) {
  const formData = normalizePayload(payload);

  const response = await authFetch(
    `${REPORTS_BASE_URL}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const text = await response.text();

  let result;

  try {
    result = text ? JSON.parse(text) : null;
  } catch {
    result = text;
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessage(result, "Gagal mengirim laporan.")
    );
  }

  return result;
}


/* GET /api/v1/reports */
export async function getReports() {
  const response = await authFetch(`${REPORTS_BASE_URL}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Gagal mengambil data laporan.")
    );
  }

  return Array.isArray(data) ? data : [];
}


/* GET /api/v1/reports/mine */
export async function getMyReports() {
  const response = await authFetch(
    `${REPORTS_BASE_URL}/mine`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Gagal mengambil data laporan.")
    );
  }

  return Array.isArray(data) ? data : [];
}


/* GET /api/v1/reports/{report_id} */
export async function getReportDetail(reportId) {
  const response = await authFetch(
    `${REPORTS_BASE_URL}/${reportId}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Gagal mengambil detail laporan.")
    );
  }

  return data;
}


/* PATCH /api/v1/reports/{report_id} */
export async function updateReport(reportId, payload) {
  const response = await authFetch(
    `${REPORTS_BASE_URL}/${reportId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Gagal memperbarui laporan.")
    );
  }

  return data;
}


/* POST /api/v1/reports/{report_id}/disposisi */
export async function createDisposisi(reportId, payload) {
  const response = await authFetch(
    `${REPORTS_BASE_URL}/${reportId}/disposisi`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Gagal membuat disposisi.")
    );
  }

  return data;
}


/* =========================================================
   AUTH
========================================================= */

/*
  ROLE BACKEND:

  public        -> POST /api/v1/auth/login
  admin_pemda   -> POST /api/v1/auth/login/admin-pemda
  admin_pemprov -> POST /api/v1/auth/login/admin-pemprov
*/

export async function login(
  identifier,
  password,
  role = "public"
) {
  let endpoint = "/login";

  if (role === "admin_pemda") {
    endpoint = "/login/admin-pemda";
  }

  if (role === "admin_pemprov") {
    endpoint = "/login/admin-pemprov";
  }

  return postJson(
    `${AUTH_BASE_URL}${endpoint}`,
    {
      identity: identifier.trim(),
      password,
    },
    "Login gagal."
  );
}

export async function loginAdminPemda(identifier, password) {
  return login(identifier, password, "admin_pemda");
}

export async function loginAdminPemprov(identifier, password) {
  return login(identifier, password, "admin_pemprov");
}


/* GET /api/v1/auth/me */
export async function getProfile() {
  const response = await authFetch(`${AUTH_BASE_URL}/me`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Gagal mengambil profil.")
    );
  }

  return data;
}


/* POST /api/v1/auth/logout */
export async function logout() {
  const token = getToken();

  if (!token) {
    return;
  }

  try {
    await fetch(`${AUTH_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
        ...NGROK_HEADERS,
      },
    });
  } catch {
    // Error logout backend diabaikan.
  }
}


/* POST /api/v1/auth/register */
export async function register({
  nik,
  email,
  full_name,
  password,
}) {
  return postJson(
    `${AUTH_BASE_URL}/register`,
    {
      nik,
      email,
      full_name,
      password,
    },
    "Register gagal."
  );
}


/* POST /api/v1/auth/verify-email */
export async function verifyEmail(token) {
  const response = await fetch(
    `${AUTH_BASE_URL}/verify-email?token=${encodeURIComponent(token)}`,
    {
      method: "POST",
      headers: {
        ...NGROK_HEADERS,
      },
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Verifikasi gagal.")
    );
  }

  return data;
}


/* POST /api/v1/auth/resend-verification */
export async function resendVerification(email) {
  return postJson(
    `${AUTH_BASE_URL}/resend-verification`,
    { email },
    "Gagal kirim ulang verifikasi."
  );
}


/* POST /api/v1/auth/forgot-password */
export async function forgotPassword(email) {
  return postJson(
    `${AUTH_BASE_URL}/forgot-password`,
    { email },
    "Gagal mengirim email reset."
  );
}


/* POST /api/v1/auth/reset-password */
export async function resetPassword(token, password) {
  return postJson(
    `${AUTH_BASE_URL}/reset-password`,
    {
      token,
      password,
    },
    "Gagal mereset password."
  );
}


/* =========================================================
   ADMIN
========================================================= */

/* GET /api/v1/admin/dashboard */
export async function getAdminDashboard() {
  const response = await authFetch(
    `${BASE_URL_V1}/admin/dashboard`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Gagal mengambil data dashboard admin."
      )
    );
  }

  return data;
}


/* GET /api/v1/admin/dashboard/rapor-kabupaten */
export async function getRaporKabupaten() {
  const response = await authFetch(
    `${BASE_URL_V1}/admin/dashboard/rapor-kabupaten`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        "Gagal mengambil rapor kinerja kabupaten."
      )
    );
  }

  return data;
}


/* =========================================================
   STATISTIK - HELPER
========================================================= */

function buildStatistikUrl(endpoint, params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.append(key, value);
    }
  });

  const query = searchParams.toString();

  return `${STATISTIK_BASE_URL}/${endpoint}${
    query ? `?${query}` : ""
  }`;
}


/* =========================================================
   STATISTIK - LIST
========================================================= */

async function fetchStatistik(endpoint, params = {}) {
  const response = await fetch(
    buildStatistikUrl(endpoint, params),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...NGROK_HEADERS,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Request gagal (${response.status})`);
  }

  const payload = await response.json();

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  return [];
}


/* =========================================================
   STATISTIK - RAW
========================================================= */

async function fetchStatistikRaw(endpoint, params = {}) {
  const response = await fetch(
    buildStatistikUrl(endpoint, params),
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        ...NGROK_HEADERS,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Request gagal (${response.status})`);
  }

  return response.json();
}


/* =========================================================
   STATISTIK ENDPOINTS
========================================================= */

export async function getPernikahanDini(params) {
  return fetchStatistik("pernikahan-dini", params);
}

export async function getPetaPernikahanDini({ tahun } = {}) {
  return fetchStatistikRaw("peta-pernikahan-dini", { tahun });
}

export async function getPutusSekolah(params) {
  return fetchStatistik("putus-sekolah", params);
}

export async function getStunting(params) {
  return fetchStatistik("stunting", params);
}

export async function getStuntingLokal(params) {
  return fetchStatistik("stunting-lokal", params);
}

export async function getStuntingBps(params) {
  return fetchStatistik("stunting-bps", params);
}

export async function getKemiskinan(params) {
  return fetchStatistik("kemiskinan", params);
}

export async function getKemiskinanLokal(params) {
  return fetchStatistik("kemiskinan-lokal", params);
}

export async function getKemiskinanBps(params) {
  return fetchStatistik("kemiskinan-bps", params);
}

export async function getRingkasan(params) {
  return fetchStatistik("ringkasan", params);
}


/* =========================================================
   ADMIN PEMPROV - MANAJEMEN PETUGAS
========================================================= */

/* GET /api/v1/admin/officers */
export async function getAdminOfficers() {
  const response = await authFetch(
    `${BASE_URL_V1}/admin/officers`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Gagal mengambil data petugas.")
    );
  }

  return Array.isArray(data) ? data : [];
}


/* POST /api/v1/admin/officers */
export async function createAdminOfficer(payload) {
  const response = await authFetch(
    `${BASE_URL_V1}/admin/officers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, "Gagal membuat akun petugas.")
    );
  }

  return data;
}


/* PATCH /api/v1/admin/officers/{id} */
export async function updateAdminOfficer(id, payload) {
  const response = await authFetch(
    `${BASE_URL_V1}/admin/officers/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    let message = "Gagal memperbarui data petugas.";

    try {
      const data = await response.json();
      message = getErrorMessage(data, message);
    } catch {
      // Gunakan pesan default.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  return text ? JSON.parse(text) : null;
}


/* DELETE /api/v1/admin/officers/{id} */
export async function deleteAdminOfficer(id) {
  const response = await authFetch(
    `${BASE_URL_V1}/admin/officers/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    let message = "Gagal menghapus akun petugas.";

    try {
      const data = await response.json();
      message = getErrorMessage(data, message);
    } catch {
      // Gunakan pesan default.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  return text ? JSON.parse(text) : null;
}


/*
  AKTIFKAN / NONAKTIFKAN PETUGAS

  Endpoint:
  /api/v1/admin/officers/{officer_id}/active

  Catatan:
  Metode PATCH dan body is_active perlu sesuai
  dengan kontrak endpoint backend.
*/


export async function toggleAdminOfficerStatus(officerId, active) {
  const token =
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Token login tidak ditemukan. Silakan login kembali.");
  }

  const response = await fetch(
    `${API_BASE_URL.replace(/\/api$/, "")}/api/v1/admin/officers/${officerId}/active?active=${active}`,
    {
      method: "PATCH",
      headers: {
        ...NGROK_HEADERS,
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Gagal mengubah status admin");
  }

  return response.json();
}




/* =========================================================
   ADMIN - EKSPOR DATA CSV DAN EXCEL
========================================================= */

async function exportAdminData(format, filters = {}) {
  if (!["csv", "xlsx"].includes(format)) {
    throw new Error("Format ekspor tidak valid.");
  }

  const params = new URLSearchParams();

  if (filters.start_date) {
    params.set("start_date", filters.start_date);
  }

  if (filters.end_date) {
    params.set("end_date", filters.end_date);
  }

  if (filters.kode_kabupaten) {
    params.set(
      "kode_kabupaten",
      String(filters.kode_kabupaten)
    );
  }

  const query = params.toString();

  const url =
    `${BASE_URL_V1}/admin/export.${format}` +
    (query ? `?${query}` : "");

  const response = await authFetch(url, {
    method: "GET",
    headers: {
      Accept:
        format === "csv"
          ? "text/csv"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });

  if (!response.ok) {
    let message = "Gagal mengekspor data.";

    try {
      const data = await response.json();
      message = getErrorMessage(data, message);
    } catch {
      // Respons mungkin bukan JSON.
    }

    throw new Error(message);
  }

  const blob = await response.blob();

  if (blob.size === 0) {
    throw new Error("File ekspor kosong.");
  }

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = `laporan-simponi.${format}`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export function exportAdminCSV(filters = {}) {
  return exportAdminData("csv", filters);
}

export function exportAdminExcel(filters = {}) {
  return exportAdminData("xlsx", filters);
}
