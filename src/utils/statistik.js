const PUTUS_SEKOLAH_TOTAL_FIELDS = [
  "jumlah_putus_sekolah",
  "jumlah_siswa_putus_sekolah",
  "jumlah_peserta_didik_putus_sekolah",
  "jumlah",
  "total",
  "value",
];

const PUTUS_SEKOLAH_LEVEL_FIELDS = [
  "putus_sd",
  "putus_smp",
  "putus_sma",
  "putus_smk",
  "putus_slb",
];

const STATISTIK_VALUE_FIELDS = {
  "pernikahan-dini": ["jumlah_perkawinan", "jumlah"],
  stunting: [
    "jumlah_stunting",
    "jumlah_balita_gizi_kurang",
    "jumlah",
  ],
  "stunting-lokal": [
    "jumlah_stunting",
    "jumlah_balita_gizi_kurang",
    "jumlah",
  ],
  "stunting-bps": [
    "jumlah_stunting",
    "jumlah_balita_gizi_kurang",
    "jumlah",
  ],
  kemiskinan: [
    "jumlah_kemiskinan",
    "jumlah_penduduk_miskin_maret_ribu",
    "jumlah",
  ],
  "kemiskinan-lokal": [
    "jumlah_kemiskinan",
    "jumlah_penduduk_miskin_maret_ribu",
    "jumlah",
  ],
  "kemiskinan-bps": [
    "jumlah_kemiskinan",
    "jumlah_penduduk_miskin_maret_ribu",
    "jumlah",
  ],
};

function readNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function getStatistikRegion(item) {
  return (
    item?.nama_kabupaten_kota ||
    item?.wilayah ||
    item?.kabupaten_kota ||
    item?.kabupaten ||
    item?.nama_kabupaten ||
    item?.nama_wilayah ||
    ""
  );
}

export function normalizeStatistikRegion(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^(?:kabupaten|kab)\.?\s+/, "")
    .replace(/^kota\.?\s+/, "kota ")
    .replace(/[.,]/g, "")
    .replace(/\s+/g, " ");
}

export function getStatistikYear(item) {
  return item?.tahun ?? item?.tahun_ajaran ?? "";
}

export function getPutusSekolahValue(item) {
  for (const field of PUTUS_SEKOLAH_TOTAL_FIELDS.slice(0, 3)) {
    const value = readNumber(item?.[field]);

    if (value !== null) {
      return value;
    }
  }

  if (PUTUS_SEKOLAH_LEVEL_FIELDS.some((field) => item?.[field] !== undefined)) {
    return PUTUS_SEKOLAH_LEVEL_FIELDS.reduce(
      (total, field) => total + (readNumber(item?.[field]) ?? 0),
      0
    );
  }

  for (const field of PUTUS_SEKOLAH_TOTAL_FIELDS.slice(3)) {
    const value = readNumber(item?.[field]);

    if (value !== null) {
      return value;
    }
  }

  return 0;
}

export function getStatistikValue(item, endpointKey) {
  if (
    endpointKey === "putus-sekolah" ||
    PUTUS_SEKOLAH_LEVEL_FIELDS.some((field) => item?.[field] !== undefined) ||
    PUTUS_SEKOLAH_TOTAL_FIELDS.slice(0, 3).some((field) => item?.[field] !== undefined)
  ) {
    return getPutusSekolahValue(item);
  }

  const fields = STATISTIK_VALUE_FIELDS[endpointKey] || [
    "jumlah_perkawinan",
    "jumlah_putus_sekolah",
    "jumlah_stunting",
    "jumlah_kemiskinan",
    "jumlah",
  ];

  for (const field of fields) {
    const value = readNumber(item?.[field]);

    if (value !== null) {
      return value;
    }
  }

  return 0;
}
