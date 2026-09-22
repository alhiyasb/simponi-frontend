const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api").replace(/\/+$/, "");

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

export async function submitPelaporan(payload) {
  const formData = normalizePayload(payload);

  const response = await fetch(`${API_BASE_URL}/pelaporan`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const text = await response.text();
  let result = null;

  try {
    result = text ? JSON.parse(text) : null;
  } catch {
    result = text;
  }

  if (!response.ok) {
    throw new Error(result?.message || result?.error || "Gagal mengirim laporan.");
  }

  return result;
}
