export const DISTRICT_NAMES = {
  3201: "Kab. Bogor",
  3202: "Kab. Sukabumi",
  3203: "Kab. Cianjur",
  3204: "Kab. Bandung",
  3205: "Kab. Garut",
  3206: "Kab. Tasikmalaya",
  3207: "Kab. Ciamis",
  3208: "Kab. Kuningan",
  3209: "Kab. Cirebon",
  3210: "Kab. Majalengka",
  3211: "Kab. Sumedang",
  3212: "Kab. Indramayu",
  3213: "Kab. Subang",
  3214: "Kab. Purwakarta",
  3215: "Kab. Karawang",
  3216: "Kab. Bekasi",
  3217: "Kab. Bandung Barat",
  3218: "Kab. Pangandaran",
  3271: "Kota Bogor",
  3272: "Kota Sukabumi",
  3273: "Kota Bandung",
  3274: "Kota Cirebon",
  3275: "Kota Bekasi",
  3276: "Kota Depok",
  3277: "Kota Cimahi",
  3278: "Kota Tasikmalaya",
  3279: "Kota Banjar",
};

export function normalizeDistrictCode(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? String(numeric) : String(value).trim();
}

export function getDistrictName(code) {
  const normalized = normalizeDistrictCode(code);
  return DISTRICT_NAMES[normalized] || "";
}