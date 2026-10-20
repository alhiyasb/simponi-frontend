import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AdminPemdaLayout from "../../components/admin/AdminPemdaLayout";
import { getReportDetail, updateReport } from "../../services/api";

/* =========================================================
   HELPERS
========================================================= */

function InfoItem({ label, value, fullWidth = false }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white/80 p-4 ${
        fullWidth ? "md:col-span-2" : ""
      }`}
    >
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="break-words text-sm font-semibold leading-relaxed text-slate-700">
        {value || "-"}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    Diajukan: {
      label: "Diajukan",
      className: "border-blue-200 bg-blue-50 text-blue-700",
    },

    Diverifikasi: {
      label: "Diverifikasi",
      className: "border-indigo-200 bg-indigo-50 text-indigo-700",
    },

    Diproses: {
      label: "Diproses",
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },

    Selesai: {
      label: "Selesai",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },

    Ditolak: {
      label: "Ditolak",
      className: "border-red-200 bg-red-50 text-red-700",
    },
  };

  const current = config[status] || {
    label: status || "Tidak diketahui",
    className: "border-slate-200 bg-slate-50 text-slate-600",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-bold ${current.className}`}
    >
      <span className="mr-2 h-1.5 w-1.5 rounded-full bg-current" />
      {current.label}
    </span>
  );
}

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateTime(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getFileUrl(filePath) {
  if (!filePath) return "";

  if (
    filePath.startsWith("http://") ||
    filePath.startsWith("https://")
  ) {
    return filePath;
  }

  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8000/api";

  const backendBase = apiBase.replace(/\/api\/?$/, "");

  const cleanPath = filePath.replace(/^\/+/, "");

  return `${backendBase}/${cleanPath}`;
}

/* =========================================================
   STATUS FLOW
========================================================= */

const statusFlow = [
  "Diajukan",
  "Diverifikasi",
  "Diproses",
  "Selesai",
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AdminPemdaLaporanDetail() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  const [updating, setUpdating] = useState(false);

  /* =======================================================
     FETCH DETAIL
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const loadReport = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getReportDetail(reportId);

        if (mounted) {
          setReport(data);
        }
      } catch (err) {
        console.error("Gagal mengambil detail laporan:", err);

        if (mounted) {
          setError(
            err?.message || "Gagal mengambil detail laporan."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (reportId) {
      loadReport();
    }

    return () => {
      mounted = false;
    };
  }, [reportId]);

  /* =======================================================
     UPDATE STATUS
  ======================================================= */

  const handleUpdateStatus = async (nextStatus) => {
    if (!report || !nextStatus || updating) return;

    /*
      Untuk halaman Laporan:

      Diajukan
          ↓
      Diverifikasi
          ↓
      masuk Penanganan

      Jadi setelah Admin Pemda memilih Diverifikasi,
      user langsung diarahkan ke halaman Penanganan.
    */

    setUpdating(true);
    setUpdateError("");
    setUpdateSuccess("");

    const statusNotes = {
      Diverifikasi:
        "Laporan telah diverifikasi oleh Admin Pemda dan diteruskan ke tahap penanganan.",

      Diproses:
        "Laporan telah diteruskan ke tahap penanganan.",

      Selesai:
        "Penanganan laporan telah selesai.",

      Ditolak:
        "Laporan ditolak oleh Admin Pemda.",
    };

    try {
      await updateReport(report.id, {
        status: nextStatus,
        note:
          statusNotes[nextStatus] ||
          `Status laporan diubah menjadi ${nextStatus}.`,
      });

      /*
        =====================================================
        NAVIGASI SETELAH BERHASIL UPDATE
        =====================================================

        Jika laporan sudah Diverifikasi atau Diproses,
        laporan bukan lagi laporan masuk.

        Maka langsung pindah ke Penanganan.
      */

      if (
        nextStatus === "Diverifikasi" ||
        nextStatus === "Diproses"
      ) {
        navigate("/admin/pemda/penanganan", {
          replace: true,
          state: {
            successMessage: `Laporan #${report.id} berhasil diperbarui dan masuk ke Penanganan.`,
          },
        });

        return;
      }

      /*
        Untuk Selesai atau Ditolak, tetap tampilkan
        informasi perubahan terlebih dahulu.
      */

      setReport((current) => ({
        ...current,
        status: nextStatus,
      }));

      setUpdateSuccess(
        `Status laporan berhasil diubah menjadi ${nextStatus}.`
      );
    } catch (err) {
      console.error("Gagal memperbarui status:", err);

      setUpdateError(
        err?.message || "Gagal memperbarui status laporan."
      );
    } finally {
      setUpdating(false);
    }
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <AdminPemdaLayout>
        <div className="min-h-[70vh] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#155DFC]" />

                <p className="text-sm font-medium text-slate-500">
                  Memuat detail laporan...
                </p>
              </div>
            </div>
          </div>
        </div>
      </AdminPemdaLayout>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error || !report) {
    return (
      <AdminPemdaLayout>
        <div className="min-h-[70vh] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-[28px] border border-red-100 bg-white shadow-xl shadow-slate-200/50">
              <div className="bg-gradient-to-br from-red-500 to-rose-600 px-6 py-10 text-white sm:px-10">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur">
                  !
                </div>

                <h1 className="text-2xl font-black">
                  Laporan Tidak Ditemukan
                </h1>

                <p className="mt-2 text-sm leading-relaxed text-red-50">
                  {error ||
                    "Data laporan tidak tersedia atau tidak dapat diakses."}
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/admin/pemda/laporan")
                  }
                  className="rounded-xl bg-[#155DFC] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#124ed0]"
                >
                  Kembali ke Laporan
                </button>
              </div>
            </div>
          </div>
        </div>
      </AdminPemdaLayout>
    );
  }

  /* =======================================================
     DATA
  ======================================================= */

  const currentStatusIndex =
    statusFlow.indexOf(report.status);

  const histories = Array.isArray(report.histories)
    ? report.histories
    : [];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <AdminPemdaLayout>
      <div className="min-h-screen bg-slate-50">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden bg-gradient-to-br from-[#0B4DB8] via-[#155DFC] to-[#3B82F6]">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

            {/* BACK */}
            <Link
              to="/admin/pemda/laporan"
              className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <span className="text-lg">←</span>
              Kembali ke Laporan
            </Link>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-2 text-sm font-semibold text-blue-100">
                  Detail Laporan
                </p>

                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Laporan #{report.id}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-blue-100 sm:text-base">
                  Tinjau informasi laporan, periksa riwayat
                  penanganan, dan perbarui status sesuai
                  proses tindak lanjut.
                </p>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-md">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-100">
                  Status Saat Ini
                </p>

                <StatusBadge status={report.status} />
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* ALERT UPDATE */}

          {updateSuccess && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800 shadow-sm">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                ✓
              </div>

              <div>
                <p className="text-sm font-bold">
                  Berhasil
                </p>

                <p className="mt-0.5 text-sm">
                  {updateSuccess}
                </p>
              </div>
            </div>
          )}

          {updateError && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
                !
              </div>

              <div>
                <p className="text-sm font-bold">
                  Gagal memperbarui
                </p>

                <p className="mt-0.5 text-sm">
                  {updateError}
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">

            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div className="space-y-6">

              {/* DATA PELAPOR */}

              <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-lg shadow-slate-200/40">
                <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                      👤
                    </div>

                    <div>
                      <h2 className="text-lg font-black text-slate-800">
                        Data Pelapor
                      </h2>

                      <p className="text-sm text-slate-500">
                        Informasi identitas pihak yang
                        membuat laporan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                  <InfoItem
                    label="Nama Pelapor"
                    value={report.pelapor_nama}
                  />

                  <InfoItem
                    label="NIK"
                    value={report.pelapor_nik}
                  />

                  <InfoItem
                    label="Nomor Telepon"
                    value={report.pelapor_telepon}
                  />

                  <InfoItem
                    label="Email"
                    value={report.pelapor_email}
                  />

                  <InfoItem
                    label="Domisili"
                    value={report.pelapor_domisili}
                  />

                  <InfoItem
                    label="Hubungan dengan Pihak"
                    value={report.hubungan_pelapor}
                  />
                </div>
              </section>

              {/* DETAIL PERNIKAHAN */}

              <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-lg shadow-slate-200/40">
                <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-xl">
                      💍
                    </div>

                    <div>
                      <h2 className="text-lg font-black text-slate-800">
                        Detail Pernikahan
                      </h2>

                      <p className="text-sm text-slate-500">
                        Informasi terkait rencana pernikahan
                        yang dilaporkan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">
                  <InfoItem
                    label="Kabupaten/Kota"
                    value={report.lokasi_kabupaten}
                  />

                  <InfoItem
                    label="Kecamatan / Desa"
                    value={report.lokasi_kecamatan_desa}
                  />

                  <InfoItem
                    label="Usia Perempuan"
                    value={report.usia_perempuan}
                  />

                  <InfoItem
                    label="Usia Laki-laki"
                    value={report.usia_laki_laki}
                  />

                  <InfoItem
                    label="Status Pendidikan"
                    value={report.status_pendidikan}
                  />

                  <InfoItem
                    label="Rencana Akad"
                    value={formatDate(
                      report.waktu_rencana_akad
                    )}
                  />

                  <InfoItem
                    label="Faktor Pendorong"
                    value={report.faktor_pendorong}
                    fullWidth
                  />

                  <InfoItem
                    label="Kronologi / Deskripsi"
                    value={report.description}
                    fullWidth
                  />
                </div>
              </section>

              {/* PERNYATAAN */}

              <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-lg shadow-slate-200/40">
                <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
                      ✓
                    </div>

                    <div>
                      <h2 className="text-lg font-black text-slate-800">
                        Pernyataan Pelapor
                      </h2>

                      <p className="text-sm text-slate-500">
                        Konfirmasi persetujuan yang diberikan
                        saat pelaporan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Kebenaran Informasi
                    </p>

                    <div
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold ${
                        report.pernyataan_benar
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {report.pernyataan_benar
                        ? "✓ Informasi benar"
                        : "✕ Tidak disetujui"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
                      Pemrosesan Data
                    </p>

                    <div
                      className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold ${
                        report.setuju_pemrosesan
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {report.setuju_pemrosesan
                        ? "✓ Menyetujui pemrosesan"
                        : "✕ Tidak menyetujui"}
                    </div>
                  </div>

                  {/* FOTO / BUKTI AWAL */}

                  <div className="md:col-span-2">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Foto / Bukti Awal
                    </p>

                    {report.foto_bukti_awal ? (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        <img
                          src={getFileUrl(
                            report.foto_bukti_awal
                          )}
                          alt="Foto atau bukti awal laporan"
                          className="max-h-[500px] w-full object-contain bg-white p-3"
                          onError={(event) => {
                            console.error(
                              "Gagal menampilkan foto:",
                              getFileUrl(
                                report.foto_bukti_awal
                              )
                            );

                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-400">
                        Tidak ada foto atau bukti awal.
                      </div>
                    )}
                  </div>

                  {/* DOKUMEN PENDUKUNG */}

                  <div className="md:col-span-2">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Dokumen Pendukung
                    </p>

                    {report.dokumen_pendukung ? (
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                        <img
                          src={getFileUrl(
                            report.dokumen_pendukung
                          )}
                          alt="Dokumen pendukung"
                          className="max-h-[420px] w-full object-contain bg-white p-3"
                          onError={(event) => {
                            console.error(
                              "Gagal menampilkan dokumen:",
                              getFileUrl(
                                report.dokumen_pendukung
                              )
                            );

                            event.currentTarget.style.display =
                              "none";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-400">
                        Tidak ada dokumen pendukung.
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* RIWAYAT */}

              <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-lg shadow-slate-200/40">
                <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-xl">
                      🕘
                    </div>

                    <div>
                      <h2 className="text-lg font-black text-slate-800">
                        Riwayat Laporan
                      </h2>

                      <p className="text-sm text-slate-500">
                        Perubahan status dan catatan proses
                        penanganan.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  {histories.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                      <p className="text-sm font-medium text-slate-500">
                        Belum ada riwayat tambahan.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {histories.map(
                        (history, index) => (
                          <div
                            key={
                              history.id ||
                              `${history.created_at}-${index}`
                            }
                            className="relative flex gap-4"
                          >
                            {index <
                              histories.length - 1 && (
                              <div className="absolute left-[15px] top-8 h-[calc(100%+24px)] w-px bg-slate-200" />
                            )}

                            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#155DFC] text-xs font-bold text-white shadow-md shadow-blue-500/20">
                              {index + 1}
                            </div>

                            <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap items-center gap-2">
                                  {history.old_status && (
                                    <>
                                      <StatusBadge
                                        status={
                                          history.old_status
                                        }
                                      />

                                      <span className="text-slate-400">
                                        →
                                      </span>
                                    </>
                                  )}

                                  <StatusBadge
                                    status={
                                      history.new_status
                                    }
                                  />
                                </div>

                                <span className="text-xs font-medium text-slate-400">
                                  {formatDateTime(
                                    history.created_at
                                  )}
                                </span>
                              </div>

                              {history.note && (
                                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                  {history.note}
                                </p>
                              )}

                              <p className="mt-2 text-xs text-slate-400">
                                Actor ID:{" "}
                                {history.actor_id || "-"}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* =================================================
                RIGHT SIDEBAR
            ================================================= */}

            <aside className="space-y-6">

              {/* STATUS CARD */}

              <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-lg shadow-slate-200/40">
                <div className="bg-gradient-to-br from-[#155DFC] to-[#2563EB] p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-100">
                    Tindak Lanjut
                  </p>

                  <h2 className="mt-2 text-xl font-black">
                    Kelola Status
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-blue-100">
                    Perbarui status laporan sesuai tahapan
                    penanganan.
                  </p>
                </div>

                <div className="space-y-3 p-5">

                  {statusFlow.map(
                    (status, index) => {
                      const isCurrent =
                        report.status === status;

                      const isCompleted =
                        currentStatusIndex >= 0 &&
                        index <= currentStatusIndex;

                      return (
                        <div
                          key={status}
                          className={`rounded-2xl border p-4 transition ${
                            isCurrent
                              ? "border-blue-300 bg-blue-50 shadow-sm"
                              : isCompleted
                              ? "border-slate-200 bg-slate-50"
                              : "border-slate-100 bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">

                            <div className="flex min-w-0 items-center gap-3">
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                                  isCurrent
                                    ? "bg-[#155DFC] text-white"
                                    : isCompleted
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-slate-100 text-slate-400"
                                }`}
                              >
                                {isCompleted
                                  ? "✓"
                                  : index + 1}
                              </div>

                              <div className="min-w-0">
                                <p
                                  className={`text-sm font-bold ${
                                    isCurrent
                                      ? "text-blue-700"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {status}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-400">
                                  Tahap {index + 1}
                                </p>
                              </div>
                            </div>

                            {!isCurrent && (
                              <button
                                type="button"
                                disabled={updating}
                                onClick={() =>
                                  handleUpdateStatus(
                                    status
                                  )
                                }
                                className="shrink-0 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-blue-100 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Pilih
                              </button>
                            )}

                            {isCurrent && (
                              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-blue-700">
                                Aktif
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}

                  {/* DITOLAK */}

                  <div className="border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      disabled={
                        updating ||
                        report.status === "Ditolak"
                      }
                      onClick={() =>
                        handleUpdateStatus("Ditolak")
                      }
                      className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                        report.status === "Ditolak"
                          ? "border-red-200 bg-red-50 text-red-700"
                          : "border-red-200 bg-white text-red-600 hover:bg-red-50"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <span>✕</span>

                      {report.status === "Ditolak"
                        ? "Laporan Ditolak"
                        : "Tolak Laporan"}
                    </button>
                  </div>

                  {updating && (
                    <div className="flex items-center justify-center gap-2 pt-2 text-xs font-semibold text-slate-400">
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-[#155DFC]" />

                      Memperbarui status...
                    </div>
                  )}
                </div>
              </section>

              {/* INFO LAPORAN */}

              <section className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/40">
                <h3 className="text-sm font-black text-slate-800">
                  Informasi Laporan
                </h3>

                <div className="mt-5 space-y-4">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      ID Laporan
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                      #{report.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Dibuat
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {formatDateTime(
                        report.created_at
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Diperbarui
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {formatDateTime(
                        report.updated_at
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Wilayah
                    </p>

                    <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-700">
                      {report.lokasi_kabupaten ||
                        report.pelapor_domisili ||
                        "-"}
                    </p>
                  </div>

                </div>
              </section>

              {/* QUICK ACTION */}

              <section className="rounded-[28px] border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-500">
                  Aksi Cepat
                </p>

                <h3 className="mt-2 text-base font-black text-slate-800">
                  Lihat penanganan
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Setelah laporan diverifikasi atau diproses,
                  laporan akan dikelola melalui halaman
                  Penanganan.
                </p>

                <Link
                  to="/admin/pemda/penanganan"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-[#155DFC] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-[#124ed0]"
                >
                  Buka Penanganan
                </Link>
              </section>

            </aside>
          </div>
        </main>
      </div>
    </AdminPemdaLayout>
  );
}