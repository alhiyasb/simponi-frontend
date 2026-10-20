import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { motion } from "framer-motion";

import AdminPemdaLayout from "../../components/admin/AdminPemdaLayout";
import {
  getReports,
  getReportDetail,
  updateReport,
} from "../../services/api";

/* =========================================================
   HELPER
========================================================= */

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

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }) {
  const config = {
    Diajukan: {
      label: "Diajukan",
      className:
        "border border-amber-200 bg-amber-50 text-amber-700",
    },

    Diverifikasi: {
      label: "Diverifikasi",
      className:
        "border border-blue-200 bg-blue-50 text-blue-700",
    },

    Diproses: {
      label: "Diproses",
      className:
        "border border-violet-200 bg-violet-50 text-violet-700",
    },

    Selesai: {
      label: "Selesai",
      className:
        "border border-emerald-200 bg-emerald-50 text-emerald-700",
    },

    Ditolak: {
      label: "Ditolak",
      className:
        "border border-red-200 bg-red-50 text-red-700",
    },
  };

  const current = config[status] || {
    label: status || "-",
    className:
      "border border-slate-200 bg-slate-50 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value || "-"}
      </p>
    </div>
  );
}

function getFileUrl(file) {
  if (!file) return null;

  if (typeof file === "string") {
    if (
      file.startsWith("http://") ||
      file.startsWith("https://")
    ) {
      return file;
    }

    return file.startsWith("/")
      ? file
      : `/${file}`;
  }

  if (typeof file === "object") {
    const value =
      file.url ||
      file.path ||
      file.file_url ||
      file.filename ||
      file.name;

    if (!value) return null;

    if (
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {
      return value;
    }

    return value.startsWith("/")
      ? value
      : `/${value}`;
  }

  return null;
}


/* =========================================================
   LIST PENANGANAN
========================================================= */

function PenangananList() {
  const location = useLocation();

  const selectedReportId =
    location.state?.selectedReportId;

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
        console.error(
          "Gagal mengambil data penanganan:",
          err
        );

        if (mounted) {
          setError(
            err?.message ||
              "Gagal mengambil data penanganan."
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

  const handlingReports = useMemo(() => {
    return reports.filter((report) =>
      [
        "Diajukan",
        "Diverifikasi",
        "Diproses",
      ].includes(report?.status)
    );
  }, [reports]);

  const sortedReports = useMemo(() => {
    if (!selectedReportId) {
      return handlingReports;
    }

    return [...handlingReports].sort((a, b) => {
      if (String(a.id) === String(selectedReportId)) {
        return -1;
      }

      if (String(b.id) === String(selectedReportId)) {
        return 1;
      }

      return 0;
    });
  }, [handlingReports, selectedReportId]);

  const filteredReports = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return sortedReports;
    }

    return sortedReports.filter((report) => {
      const text = [
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

      return text.includes(keyword);
    });
  }, [sortedReports, search]);

  const incomingCount = handlingReports.filter(
    (report) => report.status === "Diajukan"
  ).length;

  const verifiedCount = handlingReports.filter(
    (report) => report.status === "Diverifikasi"
  ).length;

  const processingCount = handlingReports.filter(
    (report) => report.status === "Diproses"
  ).length;

  return (
    <AdminPemdaLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* HERO */}
          <Reveal>
            <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#155DFC] via-[#2563EB] to-[#0F3FAE] p-6 text-white shadow-xl shadow-blue-100 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    Pusat Penanganan
                  </div>

                  <h1 className="text-2xl font-bold sm:text-3xl">
                    Penanganan Laporan
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100 sm:text-base">
                    Semua laporan yang membutuhkan tindak
                    lanjut dikelola dari halaman ini.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-5 backdrop-blur-sm">
                  <p className="text-sm text-blue-100">
                    Total Perlu Ditangani
                  </p>

                  <p className="mt-1 text-3xl font-bold">
                    {handlingReports.length}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* SELECTED REPORT INFO */}
          {selectedReportId && (
            <Reveal delay={0.03}>
              <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
                <div className="flex items-start gap-3">
                  <span className="text-lg">ℹ️</span>

                  <div>
                    <p className="font-semibold">
                      Laporan dipilih dari halaman Laporan
                    </p>

                    <p className="mt-1">
                      Laporan #{selectedReportId} berada di
                      bagian paling atas daftar.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* SUMMARY */}
          <Reveal delay={0.05}>
            <div className="mb-6 grid gap-4 sm:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Menunggu Verifikasi
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {incomingCount}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Diverifikasi
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {verifiedCount}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">
                  Sedang Diproses
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {processingCount}
                </p>
              </div>

            </div>
          </Reveal>

          {/* SEARCH */}
          <Reveal delay={0.1}>
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Cari nama, NIK, kabupaten, nomor laporan..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </Reveal>

          {/* ERROR */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-semibold">
                Gagal memuat data
              </p>

              <p className="mt-1">
                {error}
              </p>
            </div>
          )}

          {/* TABLE */}
          <Reveal delay={0.15}>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="font-bold text-slate-900">
                  Daftar Penanganan
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Laporan yang membutuhkan tindak lanjut.
                </p>
              </div>

              {loading ? (
                <div className="flex min-h-[280px] items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-[#155DFC]" />

                    <p className="mt-4 text-sm text-slate-500">
                      Memuat data...
                    </p>
                  </div>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="flex min-h-[280px] flex-col items-center justify-center p-6 text-center">
                  <div className="text-5xl">
                    ✓
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-800">
                    Tidak ada laporan
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Tidak ada laporan yang membutuhkan
                    penanganan.
                  </p>
                </div>
              ) : (
                <>
                  {/* DESKTOP */}
                  <div className="hidden overflow-x-auto lg:block">
                    <table className="w-full min-w-[950px]">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50">
                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            Laporan
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            Pelapor
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            Wilayah
                          </th>

                          <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            Status
                          </th>

                          <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                            Aksi
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {filteredReports.map((report) => {
                          const selected =
                            String(report.id) ===
                            String(selectedReportId);

                          return (
                            <tr
                              key={report.id}
                              className={
                                selected
                                  ? "bg-blue-50"
                                  : "hover:bg-slate-50"
                              }
                            >
                              <td className="px-6 py-5">
                                <p className="font-semibold text-slate-900">
                                  Laporan #{report.id}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  {formatDate(
                                    report.created_at
                                  )}
                                </p>
                              </td>

                              <td className="px-6 py-5">
                                <p className="font-medium text-slate-800">
                                  {report.pelapor_nama ||
                                    "-"}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  NIK:{" "}
                                  {report.pelapor_nik ||
                                    "-"}
                                </p>
                              </td>

                              <td className="px-6 py-5">
                                <p className="text-sm text-slate-700">
                                  {report.lokasi_kabupaten ||
                                    "-"}
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                  {report.lokasi_kecamatan_desa ||
                                    "-"}
                                </p>
                              </td>

                              <td className="px-6 py-5">
                                <StatusBadge
                                  status={report.status}
                                />
                              </td>

                              <td className="px-6 py-5 text-right">
                                <Link
                                  to={`/admin/pemda/penanganan/${report.id}`}
                                  className="inline-flex items-center gap-2 rounded-xl bg-[#155DFC] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                  Tangani
                                  <span>→</span>
                                </Link>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* MOBILE */}
                  <div className="space-y-4 p-4 lg:hidden">
                    {filteredReports.map((report) => (
                      <div
                        key={report.id}
                        className="rounded-2xl border border-slate-200 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-slate-900">
                              Laporan #{report.id}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {formatDate(
                                report.created_at
                              )}
                            </p>
                          </div>

                          <StatusBadge
                            status={report.status}
                          />
                        </div>

                        <div className="mt-4">
                          <p className="text-xs text-slate-400">
                            Pelapor
                          </p>

                          <p className="font-semibold text-slate-800">
                            {report.pelapor_nama || "-"}
                          </p>
                        </div>

                        <Link
                          to={`/admin/pemda/penanganan/${report.id}`}
                          className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#155DFC] px-4 py-3 text-sm font-semibold text-white"
                        >
                          Tangani Laporan →
                        </Link>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Reveal>

        </div>
      </div>
    </AdminPemdaLayout>
  );
}


/* =========================================================
   DETAIL PENANGANAN
========================================================= */

function PenangananDetail({ reportId }) {
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadDetail() {
      try {
        setLoading(true);
        setError("");

        const data = await getReportDetail(reportId);

        if (mounted) {
          setReport(data);
        }
      } catch (err) {
        console.error(
          "Gagal mengambil detail laporan:",
          err
        );

        if (mounted) {
          setError(
            err?.message ||
              "Gagal mengambil detail laporan."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    if (reportId) {
      loadDetail();
    }

    return () => {
      mounted = false;
    };
  }, [reportId]);

  async function handleUpdateStatus(nextStatus) {
    if (!report?.id || updating) return;

    const confirmMessage =
      nextStatus === "Selesai"
        ? "Yakin laporan ini sudah selesai ditangani?"
        : nextStatus === "Ditolak"
        ? "Yakin laporan ini ingin ditolak?"
        : `Ubah status laporan menjadi ${nextStatus}?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const updated = await updateReport(report.id, {
        status: nextStatus,
        note: `Status laporan diubah menjadi ${nextStatus}.`,
      });

      setReport((current) => ({
        ...current,
        ...(updated || {}),
        status:
          updated?.status ||
          nextStatus,
      }));

      setSuccess(
        `Status laporan berhasil diubah menjadi ${nextStatus}.`
      );
    } catch (err) {
      console.error(
        "Gagal memperbarui status:",
        err
      );

      setError(
        err?.message ||
          "Gagal memperbarui status laporan."
      );
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <AdminPemdaLayout>
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-[#155DFC]" />

            <p className="mt-4 text-sm text-slate-500">
              Memuat detail penanganan...
            </p>
          </div>
        </div>
      </AdminPemdaLayout>
    );
  }

  if (error && !report) {
    return (
      <AdminPemdaLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-bold text-red-800">
              Gagal memuat laporan
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/pemda/penanganan")
              }
              className="mt-5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Kembali ke Penanganan
            </button>
          </div>
        </div>
      </AdminPemdaLayout>
    );
  }

  const status = report?.status;

  const canVerify = status === "Diajukan";
  const canProcess =
    status === "Diverifikasi";
  const canFinish =
    status === "Diproses";

  return (
    <AdminPemdaLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          {/* HEADER */}
          <Reveal>
            <div className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#155DFC] via-[#2563EB] to-[#0F3FAE] p-6 text-white shadow-xl shadow-blue-100 sm:p-8">
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/pemda/penanganan")
                }
                className="mb-5 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                ← Kembali ke Penanganan
              </button>

              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm text-blue-100">
                    Proses Penanganan
                  </p>

                  <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                    Laporan #{report?.id}
                  </h1>

                  <p className="mt-2 text-sm text-blue-100">
                    Diajukan pada{" "}
                    {formatDateTime(report?.created_at)}
                  </p>
                </div>

                <StatusBadge status={status} />
              </div>
            </div>
          </Reveal>

          {/* SUCCESS */}
          {success && (
            <Reveal>
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                <div className="flex items-start gap-3">
                  <span className="text-lg">✓</span>

                  <div>
                    <p className="font-semibold">
                      Berhasil
                    </p>

                    <p className="mt-1">
                      {success}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* ERROR UPDATE */}
          {error && (
            <Reveal>
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <p className="font-semibold">
                  Terjadi kesalahan
                </p>

                <p className="mt-1">
                  {error}
                </p>
              </div>
            </Reveal>
          )}

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

            {/* LEFT */}
            <div className="space-y-6">

              {/* PELAPOR */}
              <Reveal delay={0.05}>
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-6 py-5">
                    <h2 className="font-bold text-slate-900">
                      Data Pelapor
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Informasi masyarakat yang membuat laporan.
                    </p>
                  </div>

                  <div className="grid gap-4 p-6 sm:grid-cols-2">
                    <InfoItem
                      label="Nama"
                      value={report?.pelapor_nama}
                    />

                    <InfoItem
                      label="NIK"
                      value={report?.pelapor_nik}
                    />

                    <InfoItem
                      label="Nomor Telepon"
                      value={report?.pelapor_telepon}
                    />

                    <InfoItem
                      label="Email"
                      value={report?.pelapor_email}
                    />

                    <InfoItem
                      label="Domisili"
                      value={report?.pelapor_domisili}
                    />

                    <InfoItem
                      label="Hubungan dengan Kasus"
                      value={report?.hubungan_pelapor}
                    />
                  </div>
                </section>
              </Reveal>


              {/* DETAIL PERNIKAHAN */}
              <Reveal delay={0.1}>
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-6 py-5">
                    <h2 className="font-bold text-slate-900">
                      Detail Kasus
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Informasi mengenai kasus pernikahan dini.
                    </p>
                  </div>

                  <div className="grid gap-4 p-6 sm:grid-cols-2">
                    <InfoItem
                      label="Usia Perempuan"
                      value={
                        report?.usia_perempuan
                          ? `${report.usia_perempuan} tahun`
                          : "-"
                      }
                    />

                    <InfoItem
                      label="Usia Laki-laki"
                      value={
                        report?.usia_laki_laki
                          ? `${report.usia_laki_laki} tahun`
                          : "-"
                      }
                    />

                    <InfoItem
                      label="Status Pendidikan"
                      value={report?.status_pendidikan}
                    />

                    <InfoItem
                      label="Kabupaten/Kota"
                      value={report?.lokasi_kabupaten}
                    />

                    <InfoItem
                      label="Kecamatan / Desa"
                      value={report?.lokasi_kecamatan_desa}
                    />

                    <InfoItem
                      label="Rencana Akad"
                      value={formatDate(
                        report?.waktu_rencana_akad
                      )}
                    />

                    <div className="sm:col-span-2">
                      <InfoItem
                        label="Faktor Pendorong"
                        value={report?.faktor_pendorong}
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <InfoItem
                        label="Kronologi / Deskripsi"
                        value={report?.description}
                      />
                    </div>
                  </div>
                </section>
              </Reveal>


              {/* PERNYATAAN */}
              <Reveal delay={0.15}>
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-6 py-5">
                    <h2 className="font-bold text-slate-900">
                      Pernyataan Pelapor
                    </h2>
                  </div>

                  <div className="space-y-3 p-6">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-sm text-slate-700">
                        {report?.pernyataan_benar
                          ? "Pelapor menyatakan informasi yang diberikan benar."
                          : "Pernyataan kebenaran belum tersedia."}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-sm text-slate-700">
                        {report?.setuju_pemrosesan
                          ? "Pelapor menyetujui pemrosesan data."
                          : "Persetujuan pemrosesan data belum tersedia."}
                      </p>
                    </div>
                  </div>
                </section>
              </Reveal>


              {/* DESKRIPSI */}
              {report?.description && (
                <Reveal delay={0.2}>
                  <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-5">
                      <h2 className="font-bold text-slate-900">
                        Keterangan Laporan
                      </h2>
                    </div>

                    <div className="p-6">
                      <p className="whitespace-pre-line text-sm leading-7 text-slate-700">
                        {report.description}
                      </p>
                    </div>
                  </section>
                </Reveal>
              )}


              {/* BUKTI */}
              {(report?.foto_bukti ||
                report?.dokumen_pendukung) && (
                <Reveal delay={0.25}>
                  <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-5">
                      <h2 className="font-bold text-slate-900">
                        Bukti dan Dokumen Pendukung
                      </h2>
                    </div>

                    <div className="grid gap-4 p-6 sm:grid-cols-2">

                      {report?.foto_bukti && (
                        <div>
                          <p className="mb-2 text-sm font-semibold text-slate-700">
                            Foto / Bukti Awal
                          </p>

                          {getFileUrl(
                            report.foto_bukti
                          ) ? (
                            <img
                              src={getFileUrl(
                                report.foto_bukti
                              )}
                              alt="Bukti laporan"
                              className="max-h-72 w-full rounded-xl border border-slate-200 object-contain"
                            />
                          ) : (
                            <p className="text-sm text-slate-500">
                              File tidak tersedia.
                            </p>
                          )}
                        </div>
                      )}

                      {report?.dokumen_pendukung && (
                        <div>
                          <p className="mb-2 text-sm font-semibold text-slate-700">
                            Dokumen Pendukung
                          </p>

                          {getFileUrl(
                            report.dokumen_pendukung
                          ) ? (
                            <a
                              href={getFileUrl(
                                report.dokumen_pendukung
                              )}
                              target="_blank"
                              rel="noreferrer"
                              className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-blue-300 bg-blue-50 p-5 text-center text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                            >
                              📄 Buka Dokumen Pendukung
                            </a>
                          ) : (
                            <p className="text-sm text-slate-500">
                              File tidak tersedia.
                            </p>
                          )}
                        </div>
                      )}

                    </div>
                  </section>
                </Reveal>
              )}


              {/* RIWAYAT */}
              <Reveal delay={0.3}>
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-6 py-5">
                    <h2 className="font-bold text-slate-900">
                      Riwayat Penanganan
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Perubahan status laporan.
                    </p>
                  </div>

                  <div className="p-6">
                    {Array.isArray(report?.histories) &&
                    report.histories.length > 0 ? (
                      <div className="space-y-4">
                        {report.histories.map(
                          (history, index) => (
                            <div
                              key={
                                history.id ||
                                index
                              }
                              className="relative rounded-xl border border-slate-100 bg-slate-50 p-4"
                            >
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                  <p className="text-sm font-semibold text-slate-800">
                                    {history.old_status ||
                                      "Awal"}{" "}
                                    →{" "}
                                    {history.new_status ||
                                      "-"}
                                  </p>

                                  {history.note && (
                                    <p className="mt-1 text-sm text-slate-600">
                                      {history.note}
                                    </p>
                                  )}
                                </div>

                                <p className="text-xs text-slate-400">
                                  {formatDateTime(
                                    history.created_at
                                  )}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="rounded-xl bg-slate-50 p-6 text-center">
                        <p className="text-sm text-slate-500">
                          Belum ada riwayat perubahan status.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </Reveal>

            </div>


            {/* RIGHT - TINDAK LANJUT */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <Reveal delay={0.1}>
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-6 py-5">
                    <h2 className="font-bold text-slate-900">
                      Tindak Lanjut
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Kelola proses penanganan laporan.
                    </p>
                  </div>

                  <div className="space-y-3 p-6">

                    {/* STEP 1 */}
                    <button
                      type="button"
                      disabled={
                        !canVerify || updating
                      }
                      onClick={() =>
                        handleUpdateStatus(
                          "Diverifikasi"
                        )
                      }
                      className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        canVerify && !updating
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "cursor-not-allowed bg-slate-100 text-slate-400"
                      }`}
                    >
                      {updating &&
                      canVerify
                        ? "Memproses..."
                        : "✓ Verifikasi Laporan"}
                    </button>


                    {/* STEP 2 */}
                    <button
                      type="button"
                      disabled={
                        !canProcess || updating
                      }
                      onClick={() =>
                        handleUpdateStatus(
                          "Diproses"
                        )
                      }
                      className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        canProcess && !updating
                          ? "bg-violet-600 text-white hover:bg-violet-700"
                          : "cursor-not-allowed bg-slate-100 text-slate-400"
                      }`}
                    >
                      {updating &&
                      canProcess
                        ? "Memproses..."
                        : "⚙ Mulai Proses Penanganan"}
                    </button>


                    {/* STEP 3 */}
                    <button
                      type="button"
                      disabled={
                        !canFinish || updating
                      }
                      onClick={() =>
                        handleUpdateStatus(
                          "Selesai"
                        )
                      }
                      className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        canFinish && !updating
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "cursor-not-allowed bg-slate-100 text-slate-400"
                      }`}
                    >
                      {updating &&
                      canFinish
                        ? "Menyelesaikan..."
                        : "✓ Tandai Selesai"}
                    </button>


                    {/* TOLAK */}
                    {(status === "Diajukan" ||
                      status === "Diverifikasi") && (
                      <button
                        type="button"
                        disabled={updating}
                        onClick={() =>
                          handleUpdateStatus(
                            "Ditolak"
                          )
                        }
                        className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        ✕ Tolak Laporan
                      </button>
                    )}

                  </div>


                  {/* STATUS FLOW */}
                  <div className="border-t border-slate-100 p-6">
                    <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Alur Status
                    </p>

                    <div className="space-y-3">

                      {[
                        "Diajukan",
                        "Diverifikasi",
                        "Diproses",
                        "Selesai",
                      ].map(
                        (item, index) => {
                          const active =
                            item === status;

                          return (
                            <div
                              key={item}
                              className="flex items-center gap-3"
                            >
                              <div
                                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                                  active
                                    ? "bg-[#155DFC] text-white"
                                    : "bg-slate-100 text-slate-400"
                                }`}
                              >
                                {index + 1}
                              </div>

                              <span
                                className={`text-sm ${
                                  active
                                    ? "font-semibold text-slate-900"
                                    : "text-slate-500"
                                }`}
                              >
                                {item}
                              </span>
                            </div>
                          );
                        }
                      )}

                    </div>
                  </div>


                  {/* BACK */}
                  <div className="border-t border-slate-100 p-6">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/admin/pemda/penanganan"
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      ← Kembali ke Daftar Penanganan
                    </button>
                  </div>

                </section>
              </Reveal>
            </div>

          </div>
        </div>
      </div>
    </AdminPemdaLayout>
  );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AdminPemdaPenanganan() {
  const { reportId } = useParams();

  /*
   * Kalau ada reportId:
   * tampilkan DETAIL PENANGANAN.
   *
   * Kalau tidak ada:
   * tampilkan LIST PENANGANAN.
   */
  if (reportId) {
    return (
      <PenangananDetail
        reportId={reportId}
      />
    );
  }

  return <PenangananList />;
}