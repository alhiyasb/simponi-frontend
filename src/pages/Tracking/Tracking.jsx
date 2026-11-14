import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getMyReports } from "../../services/api";
import { useNavigate } from "react-router-dom";

// ============================================================
// KONFIGURASI STATUS
// ============================================================

const statusConfig = {
  diajukan: {
    label: "Diajukan",
    class: "border-slate-200 bg-slate-50 text-slate-700",
    progress: 25,
  },

  diverifikasi: {
    label: "Diverifikasi",
    class: "border-slate-300 bg-slate-100 text-slate-800",
    progress: 50,
  },

diproses: {
  label: "Diproses",
  class: "border-[#0071FA]/20 bg-[#0071FA]/10 text-[#0071FA]",
  progress: 75,
},

  selesai: {
    label: "Selesai",
    class: "border-[#0071FA]/20 bg-[#0071FA]/10 text-[#0071FA]",
    progress: 100,
  },

ditolak: {
  label: "Ditolak",
  class: "border-[#0071FA]/20 bg-[#0071FA]/10 text-[#0071FA]",
  progress: 0,
},
  default: {
    label: "Tidak diketahui",
    class: "border-slate-200 bg-slate-50 text-slate-700",
    progress: 0,
  },
};

// Urutan laporan berdasarkan proses penanganan
const statusOrder = [
  "diajukan",
  "diverifikasi",
  "diproses",
  "selesai",
  "ditolak",
];

// Pilihan filter status
const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "diajukan", label: "Diajukan" },
  { value: "diverifikasi", label: "Diverifikasi" },
  { value: "diproses", label: "Diproses" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak" },
];

const ITEMS_PER_PAGE = 10;

// ============================================================
// HELPER
// ============================================================

// Menyamakan format status dari backend.
// Contoh:
// "Diajukan"     -> "diajukan"
// "Diverifikasi" -> "diverifikasi"
// "Diproses"     -> "diproses"
function normalizeStatus(status) {
  return String(status || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

// Mengambil konfigurasi berdasarkan status backend
function getStatusConfig(status) {
  const key = normalizeStatus(status);

  return statusConfig[key] || statusConfig.default;
}

// Format tanggal lengkap
function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Format tanggal pendek
function formatDateShort(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getFirstDefined(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      return String(value).trim();
    }
  }
  return "-";
}

// ============================================================
// HALAMAN TRACKING
// ============================================================

export default function TrackingPage() {
  const navigate = useNavigate();

  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const initialized = useRef(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ==========================================================
  // AMBIL DATA LAPORAN
  // ==========================================================

  const doFetchReports = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const data = await getMyReports();

      // Backend mengembalikan array:
      // [
      //   {
      //     id,
      //     status,
      //     pelapor_nama,
      //     pelapor_nik,
      //     ...
      //   }
      // ]
      const reportsData = Array.isArray(data)
        ? data
        : data?.data || data?.results || [];

      // Urutkan berdasarkan status
      const sorted = [...reportsData].sort((a, b) => {
        const statusA = statusOrder.indexOf(
          normalizeStatus(a.status)
        );

        const statusB = statusOrder.indexOf(
          normalizeStatus(b.status)
        );

        // Status yang tidak dikenal diletakkan paling belakang
        const safeStatusA = statusA === -1 ? 999 : statusA;
        const safeStatusB = statusB === -1 ? 999 : statusB;

        if (safeStatusA !== safeStatusB) {
          return safeStatusA - safeStatusB;
        }

        // Kalau status sama, laporan terbaru di atas
        const dateA = new Date(
          a.created_at || a.updated_at || 0
        ).getTime();

        const dateB = new Date(
          b.created_at || b.updated_at || 0
        ).getTime();

        return dateB - dateA;
      });

      setAllReports(sorted);
      setCurrentPage(1);
    } catch (err) {
      console.error("Gagal mengambil laporan:", err);

      setError(
        err.message || "Gagal memuat daftar laporan."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================
  // LOAD PERTAMA KALI
  // ==========================================================

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      doFetchReports();
    }
  }, [doFetchReports]);

  // ==========================================================
  // FILTER DAN SEARCH
  // ==========================================================

  const filteredReports = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    return allReports.filter((report) => {
      // ------------------------------------------------------
      // DATA YANG DIGUNAKAN UNTUK SEARCH
      // Sesuai field backend snake_case
      // ------------------------------------------------------

      const reportId = String(
        report.id || report.report_id || ""
      ).toLowerCase();

      const reportTitle = String(
        report.title || report.kasus || "Laporan"
      ).toLowerCase();

      const reportLocation = String(
        report.location ||
          report.lokasi ||
          report.alamat ||
          report.lokasi_kabupaten ||
          report.lokasi_kecamatan_desa ||
          ""
      ).toLowerCase();

      const reporterName = String(
        report.pelapor_nama || ""
      ).toLowerCase();

      const matchesSearch =
        !keyword ||
        reportId.includes(keyword) ||
        reportTitle.includes(keyword) ||
        reportLocation.includes(keyword) ||
        reporterName.includes(keyword);

      // ------------------------------------------------------
      // FILTER STATUS
      // ------------------------------------------------------

      const normalizedReportStatus = normalizeStatus(
        report.status
      );

      const matchesStatus =
        !statusFilter ||
        normalizedReportStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [allReports, searchQuery, statusFilter]);

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages =
    Math.ceil(filteredReports.length / ITEMS_PER_PAGE) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedReports = filteredReports.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  // ==========================================================
  // DETAIL LAPORAN
  // ==========================================================

  const handleViewDetail = (reportId) => {
    if (!reportId) return;

    navigate(`/tracking/${reportId}`);
  };

  // ==========================================================
  // PERGANTIAN HALAMAN
  // ==========================================================

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // ==========================================================
  // RINGKASAN STATISTIK
  // ==========================================================

  const summary = [
    {
      label: "Total Laporan",
      value: allReports.length,
      color: "from-slate-900 to-slate-700",
    },

    {
      label: "Diproses",
      value: allReports.filter(
        (report) =>
          normalizeStatus(report.status) === "diproses"
      ).length,
      color: "from-[#0071FA] to-[#0056D6]",
    },

    {
      label: "Selesai",
      value: allReports.filter(
        (report) =>
          normalizeStatus(report.status) === "selesai"
      ).length,
      color: "from-slate-900 to-black",
    },

    {
      label: "Menunggu",
      value: allReports.filter((report) =>
        ["diajukan", "diverifikasi"].includes(
          normalizeStatus(report.status)
        )
      ).length,
      color: "from-[#60A5FA] to-[#0071FA]",
    },
  ];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-800">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-20 h-64 w-64 rounded-fullbg-[#0071FA]/10 blur-3xl" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-slate-200/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#0071FA]/10 blur-3xl" />
      </div>

      <Navbar />

      <main className="relative mx-auto max-w-[1500px] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-[#0071fa] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_18%)]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">

              <h1 className="mt-5 text-3xl font-black tracking-[-0.06em] text-white md:text-5xl">
                Pantau perkembangan{" "}
                <span className="text-white]">
                  laporan Anda
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-slate-200">
                Lihat status, tahapan penanganan, dan perkembangan
                tindak lanjut laporan yang Anda ajukan dengan
                tampilan yang lebih modern dan mudah dipantau.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={doFetchReports}
                disabled={loading}
                className="rounded-full border border-white/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-[0_12px_25px_rgba(15,23,42,0.12)] transition hover:bg-slate-100 disabled:opacity-50"
              >
                {loading ? "Memuat..." : "Refresh"}
              </button>
            </div>
          </div>
        </motion.section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summary.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(15,23,42,0.08)]"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.color}`} />
              <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-4 text-3xl font-black tracking-tight text-slate-900">
                {item.value}
              </p>
            </motion.div>
          ))}
        </section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mt-8"
        >
          <div className="mb-6 flex flex-col gap-4 rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Cari ID, judul, lokasi, nama pelapor..."
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-800 outline-none transition focus:border-red-400 focus:ring-4 focus:border-[#0071FA] focus:ring-[#0071FA]/10 sm:w-[420px]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-red-400 focus:ring-4 focus:ring-red-100 sm:w-52"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                {filteredReports.length} hasil
              </span>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="animate-pulse rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_16px_38px_rgba(15,23,42,0.04)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-slate-200" />
                      <div className="h-3 w-1/2 rounded bg-slate-200" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[28px] border border-[#0071FA]/20 bg-[#0071FA]/5 p-6 text-center shadow-[0_18px_45px_rgba(0,113,250,0.08)]">
  <p className="text-[#0071FA]">{error}</p>
  <button
    onClick={doFetchReports}
    className="mt-4 rounded-full bg-[#0071FA] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0056D6]"
  >
    Coba Lagi
  </button>
</div>
          ) : filteredReports.length === 0 ? (
            <div className="rounded-[30px] border border-dashed border-slate-200 bg-white p-12 text-center shadow-[0_18px_40px_rgba(15,23,42,0.03)]">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <svg
                  className="h-8 w-8 text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-slate-900">
                {searchQuery || statusFilter
                  ? "Tidak ada laporan cocok"
                  : "Belum ada laporan"}
              </h3>
              <p className="mt-2 text-slate-600">
                {searchQuery || statusFilter
                  ? "Coba ubah filter atau kata kunci pencarian."
                  : "Anda belum mengajukan laporan apapun."}
              </p>

              {!searchQuery && !statusFilter && (
                <button
                  onClick={() => navigate("/pelaporan")}
                  className="mt-6 inline-flex rounded-full bg-[#111827] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(17,24,39,0.18)] transition hover:scale-[1.01] hover:bg-[#1f2937]"
                >
                  Ajukan Laporan Pertama
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedReports.map((report, index) => {
                const reportId = report.id || report.report_id;
                const cfg = getStatusConfig(report.status);
                const progress = cfg.progress;
                const location = report.lokasi_kabupaten
                  ? `${report.lokasi_kabupaten}${
                      report.lokasi_kecamatan_desa
                        ? `, ${report.lokasi_kecamatan_desa}`
                        : ""
                    }`
                  : "-";
                const reportTitle = report.title || report.kasus || "Laporan";
                const displayNumber = (safeCurrentPage - 1) * ITEMS_PER_PAGE + index + 1;

                const namaPerempuan = getFirstDefined(
                  report.nama_perempuan,
                  report.nama_korban,
                  report.nama_korban_perempuan,
                  report.calon_mempelai_perempuan,
                  report.nama_pasangan_perempuan,
                  report.perempuan_nama,
                  "-"
                );

                const namaLaki = getFirstDefined(
                  report.nama_laki_laki,
                  report.nama_laki,
                  report.nama_korban_laki,
                  report.calon_mempelai_laki,
                  report.nama_pasangan_laki,
                  report.laki_laki_nama,
                  "-"
                );

                const pendidikanPerempuan = getFirstDefined(
                  report.pendidikan_perempuan,
                  report.pendidikan_korban_perempuan,
                  report.pendidikan_pasangan_perempuan,
                  report.status_pendidikan_perempuan,
                  report.status_pendidikan,
                  "-"
                );

                const pendidikanLaki = getFirstDefined(
                  report.pendidikan_laki,
                  report.pendidikan_laki_laki,
                  report.pendidikan_korban_laki,
                  report.pendidikan_pasangan_laki,
                  report.status_pendidikan_laki,
                  report.status_pendidikan,
                  "-"
                );

                return (
                  <motion.div
                    key={reportId || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                   className="cursor-pointer rounded-[30px] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0071FA]/40 hover:shadow-[0_18px_40px_rgba(0,113,250,0.08)]"
                    onClick={() => handleViewDetail(reportId)}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111827] text-lg font-bold text-white shadow-[0_12px_25px_rgba(17,24,39,0.18)]">
                          {displayNumber}
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
                            ID #{reportId || displayNumber}
                          </p>
                          <h2 className="mt-1 text-xl font-bold text-slate-900">
                            {reportTitle}
                          </h2>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${cfg.class}`}
                        >
                          {cfg.label}
                        </span>
                        <span className="text-sm font-medium text-slate-500">
                          {location}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
                          Perempuan: {namaPerempuan}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">
                          Laki-laki: {namaLaki}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
                          Pendidikan P: {pendidikanPerempuan}
                        </span>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-700">
                          Pendidikan L: {pendidikanLaki}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                        <span>Progress</span>
                        <span className="font-bold text-slate-800">{progress}%</span>
                      </div>

                      <div className="h-2.5 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#0071FA] transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                      <span>Terakhir diperbarui</span>
                      <span className="font-semibold text-slate-700">
                        {formatDate(report.updated_at || report.created_at)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;

                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (safeCurrentPage <= 3) {
                  pageNum = i + 1;
                } else if (safeCurrentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = safeCurrentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      safeCurrentPage === pageNum
                        ? "bg-[#111827] text-white shadow-[0_12px_25px_rgba(17,24,39,0.18)]"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}