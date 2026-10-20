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
    class: "border-blue-200 bg-blue-50 text-blue-700",
    progress: 25,
  },

  diverifikasi: {
    label: "Diverifikasi",
    class: "border-violet-200 bg-violet-50 text-violet-700",
    progress: 50,
  },

  diproses: {
    label: "Diproses",
    class: "border-amber-200 bg-amber-50 text-amber-700",
    progress: 75,
  },

  selesai: {
    label: "Selesai",
    class: "border-emerald-200 bg-emerald-50 text-emerald-700",
    progress: 100,
  },

  ditolak: {
    label: "Ditolak",
    class: "border-red-200 bg-red-50 text-red-700",
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

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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
      color: "from-sky-500 to-blue-600",
    },

    {
      label: "Diproses",
      value: allReports.filter(
        (report) =>
          normalizeStatus(report.status) === "diproses"
      ).length,
      color: "from-amber-500 to-orange-500",
    },

    {
      label: "Selesai",
      value: allReports.filter(
        (report) =>
          normalizeStatus(report.status) === "selesai"
      ).length,
      color: "from-emerald-500 to-teal-500",
    },

    {
      label: "Menunggu",
      value: allReports.filter((report) =>
        ["diajukan", "diverifikasi"].includes(
          normalizeStatus(report.status)
        )
      ).length,
      color: "from-blue-500 to-indigo-500",
    },
  ];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eaf4ff_0%,#f8fbff_28%,#eef6ff_100%)] text-slate-800">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <section className="overflow-hidden rounded-[36px] border border-sky-100 bg-white/80 p-6 shadow-[0_30px_80px_rgba(59,130,246,0.08)] backdrop-blur-md sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">

            <div className="max-w-2xl">

              <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-700">
                Tracking Laporan
              </span>

              <h1 className="mt-5 text-3xl font-black tracking-[-0.06em] text-slate-900 md:text-5xl">
                Pantau perkembangan{" "}
                <span className="text-blue-600">
                  laporan Anda
                </span>
              </h1>

              <p className="mt-4 text-base leading-7 text-slate-600">
                Lihat status, tahapan penanganan, dan
                perkembangan tindak lanjut laporan yang Anda
                ajukan.
              </p>

            </div>

            <div className="flex gap-3">

              <button
                onClick={doFetchReports}
                disabled={loading}
                className="rounded-full border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50 disabled:opacity-50"
              >
                {loading ? "Memuat..." : "Refresh"}
              </button>

            </div>

          </div>
        </section>

        {/* ====================================================
            SUMMARY
        ==================================================== */}

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {summary.map((item) => (
            <div
              key={item.label}
              className="rounded-[24px] border border-sky-100 bg-gradient-to-br from-white to-sky-50 p-4 shadow-sm"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                {item.label}
              </p>

              <p className="mt-3 text-3xl font-black text-slate-900">
                {item.value}
              </p>
            </div>
          ))}

        </section>

        {/* ====================================================
            SEARCH & FILTER
        ==================================================== */}

        <section className="mt-8">

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

              {/* Search */}

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
                  className="w-full rounded-xl border border-sky-200 bg-white py-2.5 pl-10 pr-4 text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 sm:w-72"
                />

              </div>

              {/* Filter status */}

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 sm:w-48"
              >
                {statusOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>
                Menampilkan {filteredReports.length} dari{" "}
                {allReports.length} laporan
              </span>
            </div>

          </div>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (

            <div className="space-y-4">

              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="animate-pulse rounded-[28px] border border-sky-100 bg-white/85 p-5"
                >

                  <div className="flex items-center gap-4">

                    <div className="h-12 w-12 rounded-2xl bg-sky-100" />

                    <div className="flex-1 space-y-2">

                      <div className="h-4 w-3/4 rounded bg-sky-100" />

                      <div className="h-3 w-1/2 rounded bg-sky-100" />

                    </div>

                  </div>

                </motion.div>
              ))}

            </div>

          ) : error ? (

            /* ==================================================
               ERROR
            ================================================== */

            <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-center">

              <p className="text-red-700">
                {error}
              </p>

              <button
                onClick={doFetchReports}
                className="mt-4 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Coba Lagi
              </button>

            </div>

          ) : filteredReports.length === 0 ? (

            /* ==================================================
               EMPTY
            ================================================== */

            <div className="rounded-[28px] border border-dashed border-sky-200 bg-sky-50/50 p-12 text-center">

              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sky-100">

                <svg
                  className="h-8 w-8 text-sky-600"
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
                  className="mt-6 inline-flex rounded-full bg-[linear-gradient(135deg,#155DFC_0%,#2d6bff_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(21,93,252,0.35)] hover:scale-[1.01]"
                >
                  Ajukan Laporan Pertama
                </button>
              )}

            </div>

          ) : (

            /* ==================================================
               LIST LAPORAN
            ================================================== */

            <>

              <div className="space-y-4">

                {paginatedReports.map((report, index) => {

                  const reportId =
                    report.id || report.report_id;

                  const cfg = getStatusConfig(
                    report.status
                  );

                  const progress = cfg.progress;

                  const location =
                    report.lokasi_kabupaten
                      ? `${report.lokasi_kabupaten}${
                          report.lokasi_kecamatan_desa
                            ? `, ${report.lokasi_kecamatan_desa}`
                            : ""
                        }`
                      : "-";

                  const reportTitle =
                    report.title ||
                    report.kasus ||
                    "Laporan";

                  const displayNumber =
                    (currentPage - 1) *
                      ITEMS_PER_PAGE +
                    index +
                    1;

                  return (

                    <motion.div
                      key={reportId || index}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                      className="cursor-pointer rounded-[28px] border border-sky-100 bg-white/85 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm transition-all hover:border-sky-200 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
                      onClick={() =>
                        handleViewDetail(reportId)
                      }
                    >

                      {/* Header Card */}

                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex items-center gap-4">

                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-lg font-bold text-white">
                            {displayNumber}
                          </div>

                          <div>

                            <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                              ID #{reportId || displayNumber}
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-slate-900">
                              {reportTitle}
                            </h2>

                          </div>

                        </div>

                        <div className="flex flex-wrap items-center gap-3">

                          {/* STATUS */}

                          <span
                            className={`rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${cfg.class}`}
                          >
                            {cfg.label}
                          </span>

                          {/* LOKASI */}

                          <span className="text-sm font-medium text-slate-500">
                            {location}
                          </span>

                        </div>

                      </div>

                      {/* Progress */}

                      <div className="mt-5">

                        <div className="mb-2 flex items-center justify-between text-sm text-slate-600">

                          <span>
                            Progress
                          </span>

                          <span className="font-bold text-slate-800">
                            {progress}%
                          </span>

                        </div>

                        <div className="h-2.5 rounded-full bg-sky-100">

                          <div
                            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-500"
                            style={{
                              width: `${progress}%`,
                            }}
                          />

                        </div>

                      </div>

                      {/* Footer Card */}

                      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">

                        <span>
                          Terakhir diperbarui
                        </span>

                        <span className="font-semibold text-slate-700">
                          {formatDate(
                            report.updated_at ||
                              report.created_at
                          )}
                        </span>

                      </div>

                    </motion.div>

                  );
                })}

              </div>

              {/* ==================================================
                  PAGINATION
              ================================================== */}

              {totalPages > 1 && (

                <div className="mt-6 flex items-center justify-center gap-2">

                  {/* Previous */}

                  <button
                    onClick={() =>
                      handlePageChange(
                        currentPage - 1
                      )
                    }
                    disabled={currentPage === 1}
                    className="rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40"
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

                  {/* Number */}

                  {Array.from(
                    {
                      length: Math.min(
                        totalPages,
                        5
                      ),
                    },
                    (_, i) => {

                      let pageNum;

                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (
                        currentPage <= 3
                      ) {
                        pageNum = i + 1;
                      } else if (
                        currentPage >=
                        totalPages - 2
                      ) {
                        pageNum =
                          totalPages -
                          4 +
                          i;
                      } else {
                        pageNum =
                          currentPage -
                          2 +
                          i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() =>
                            handlePageChange(
                              pageNum
                            )
                          }
                          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            currentPage ===
                            pageNum
                              ? "bg-blue-600 text-white shadow-sm"
                              : "border border-sky-200 bg-white text-slate-700 hover:bg-sky-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}

                  {/* Next */}

                  <button
                    onClick={() =>
                      handlePageChange(
                        currentPage + 1
                      )
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    className="rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40"
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

            </>
          )}

        </section>

      </main>

      <Footer />
    </div>
  );
}