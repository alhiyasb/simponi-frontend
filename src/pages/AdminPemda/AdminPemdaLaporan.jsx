import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import AdminPemdaLayout from "../../components/admin/AdminPemdaLayout";
import { getReports } from "../../services/api";

function Reveal({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const config = {
    Diajukan: {
      label: "Diajukan",
      className:
        "bg-amber-50 text-amber-700 border border-amber-200",
    },
    Diverifikasi: {
      label: "Diverifikasi",
      className:
        "bg-blue-50 text-blue-700 border border-blue-200",
    },
    Diproses: {
      label: "Diproses",
      className:
        "bg-violet-50 text-violet-700 border border-violet-200",
    },
    Selesai: {
      label: "Selesai",
      className:
        "bg-emerald-50 text-emerald-700 border border-emerald-200",
    },
    Ditolak: {
      label: "Ditolak",
      className:
        "bg-red-50 text-red-700 border border-red-200",
    },
  };

  const current = config[status] || {
    label: status || "-",
    className:
      "bg-slate-50 text-slate-600 border border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminPemdaLaporan() {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadReports() {
      try {
        setLoading(true);
        setError("");

        const data = await getReports();

        if (mounted) {
          setReports(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Gagal mengambil laporan:", err);

        if (mounted) {
          setError(
            err?.message || "Gagal mengambil data laporan."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadReports();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Halaman Laporan hanya menampilkan laporan
   * yang baru masuk dari masyarakat.
   *
   * Proses penanganan dilakukan di halaman Penanganan.
   */
  const incomingReports = useMemo(() => {
    return reports.filter(
      (report) => report?.status === "Diajukan"
    );
  }, [reports]);

  const filteredReports = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return incomingReports;
    }

    return incomingReports.filter((report) => {
      const searchableText = [
        report?.id,
        report?.pelapor_nama,
        report?.pelapor_nik,
        report?.pelapor_email,
        report?.pelapor_telepon,
        report?.pelapor_domisili,
        report?.lokasi_kabupaten,
        report?.lokasi_kecamatan_desa,
        report?.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    });
  }, [incomingReports, search]);

  return (
    <AdminPemdaLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* HEADER */}
          <Reveal>
            <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#155DFC] via-[#2563EB] to-[#0F3FAE] p-6 text-white shadow-xl shadow-blue-100 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    Inbox Laporan
                  </div>

                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Laporan Masyarakat
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                    Menampilkan laporan yang baru diajukan oleh
                    masyarakat dan menunggu untuk ditangani.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-5 backdrop-blur-sm">
                  <p className="text-sm text-blue-100">
                    Laporan Masuk
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {incomingReports.length}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* SUMMARY */}
          <Reveal delay={0.05}>
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Total Laporan Masuk
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {incomingReports.length}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl">
                    📥
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Hasil Pencarian
                    </p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {filteredReports.length}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
                    🔎
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* SEARCH */}
          <Reveal delay={0.1}>
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                  🔎
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Cari nama, NIK, email, kabupaten, atau nomor laporan..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>
          </Reveal>

          {/* ERROR */}
          {error && (
            <Reveal>
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <div className="flex items-start gap-3">
                  <span className="text-lg">⚠️</span>

                  <div>
                    <p className="font-semibold">
                      Gagal memuat laporan
                    </p>

                    <p className="mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* DESKTOP TABLE */}
          <Reveal delay={0.15}>
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="font-bold text-slate-900">
                  Daftar Laporan
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Laporan yang masuk dari masyarakat.
                </p>
              </div>

              {loading ? (
                <div className="flex min-h-[280px] items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-[#155DFC]" />

                    <p className="mt-4 text-sm text-slate-500">
                      Memuat laporan...
                    </p>
                  </div>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
                    📭
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-800">
                    Tidak ada laporan
                  </h3>

                  <p className="mt-1 max-w-md text-sm text-slate-500">
                    Belum ada laporan masyarakat yang sesuai
                    dengan pencarian.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[950px]">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80">
                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Laporan
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Pelapor
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Wilayah
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Tanggal
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                          Status
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                          Aksi
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {filteredReports.map((report) => (
                        <tr
                          key={report.id}
                          className="transition hover:bg-blue-50/30"
                        >
                          <td className="px-6 py-5">
                            <div>
                              <p className="font-semibold text-slate-900">
                                Laporan #{report.id}
                              </p>

                              <p className="mt-1 text-xs text-slate-400">
                                {report.created_at
                                  ? formatDate(report.created_at)
                                  : "-"}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <p className="font-medium text-slate-800">
                              {report.pelapor_nama || "-"}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              NIK: {report.pelapor_nik || "-"}
                            </p>
                          </td>

                          <td className="px-6 py-5">
                            <p className="max-w-[200px] text-sm text-slate-700">
                              {report.lokasi_kabupaten || "-"}
                            </p>

                            <p className="mt-1 max-w-[220px] text-xs text-slate-400">
                              {report.lokasi_kecamatan_desa || "-"}
                            </p>
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-600">
                            {formatDate(report.created_at)}
                          </td>

                          <td className="px-6 py-5">
                            <StatusBadge status={report.status} />
                          </td>

                          <td className="px-6 py-5 text-right">
                            <Link
                              to="/admin/pemda/penanganan"
                              state={{
                                selectedReportId: report.id,
                              }}
                              className="inline-flex items-center gap-2 rounded-xl bg-[#155DFC] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                            >
                              Detail
                              <span>→</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Reveal>

          {/* MOBILE */}
          <div className="space-y-4 lg:hidden">
            {loading ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-[#155DFC]" />

                <p className="mt-4 text-sm text-slate-500">
                  Memuat laporan...
                </p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">
                  📭
                </div>

                <h3 className="mt-4 font-semibold text-slate-800">
                  Tidak ada laporan
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Belum ada laporan yang sesuai.
                </p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">
                        Laporan #{report.id}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(report.created_at)}
                      </p>
                    </div>

                    <StatusBadge status={report.status} />
                  </div>

                  <div className="mt-5 space-y-3">
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Pelapor
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {report.pelapor_nama || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        NIK
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {report.pelapor_nik || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        Wilayah
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {report.lokasi_kabupaten || "-"}
                      </p>

                      <p className="text-xs text-slate-400">
                        {report.lokasi_kecamatan_desa || "-"}
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/admin/pemda/penanganan"
                    state={{
                      selectedReportId: report.id,
                    }}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#155DFC] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Lihat di Penanganan
                    <span>→</span>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminPemdaLayout>
  );
}