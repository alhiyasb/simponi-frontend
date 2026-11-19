
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import AdminPemdaLayout from "../../components/admin/AdminPemdaLayout";
import { getReportDetail } from "../../services/api";

// ======================================================
// HELPER ANIMASI
// ======================================================

function Reveal({ children, delay = 0, className = "", animate = true }) {
  if (!animate) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ======================================================
// FORMAT TANGGAL
// ======================================================

function formatDate(date) {
  if (!date) return "-";

  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function formatDateTime(date) {
  if (!date) return "-";

  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({ status }) {
  const config = {
    Selesai: {
      label: "Selesai",
      dot: "bg-emerald-500",
      text: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    Diajukan: {
      label: "Diajukan",
      dot: "bg-blue-500",
      text: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    Diverifikasi: {
      label: "Diverifikasi",
      dot: "bg-violet-500",
      text: "text-violet-700",
      bg: "bg-violet-50",
      border: "border-violet-200",
    },
    Diproses: {
      label: "Diproses",
      dot: "bg-amber-500",
      text: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-200",
    },
    Ditolak: {
      label: "Ditolak",
      dot: "bg-red-500",
      text: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
    },
  };

  const current = config[status] || {
    label: status || "-",
    dot: "bg-slate-400",
    text: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border ${current.border} ${current.bg} px-3 py-1.5 text-xs font-bold ${current.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      {current.label}
    </span>
  );
}

// ======================================================
// ITEM INFORMASI
// ======================================================

function InfoItem({ label, value }) {
  return (
    <div className="info-item rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-semibold leading-6 text-slate-700">
        {value || "-"}
      </p>
    </div>
  );
}

// ======================================================
// GET URL FILE
// ======================================================

function getFileUrl(file) {
  if (!file) return null;

  const backendRoot = (
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8000/api"
  )
    .replace(/\/+$/, "")
    .replace(/\/api$/, "");

  const toAbsoluteUrl = (value) => {
    if (!value) return null;

    if (
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {
      return value;
    }

    const cleanValue = String(value).replace(/^\/+/, "");
    return `${backendRoot}/${cleanValue}`;
  };

  if (typeof file === "string") {
    return toAbsoluteUrl(file);
  }

  if (typeof file === "object") {
    const value =
      file.url ||
      file.path ||
      file.file_url ||
      file.filename ||
      file.name;

    return toAbsoluteUrl(value);
  }

  return null;
}

// ======================================================
// JUDUL BAGIAN
// ======================================================

function SectionTitle({ number, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-extrabold text-[#155EEF]">
        {number}
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

// ======================================================
// ISI LAPORAN
// Dipakai untuk layar dan cetak
// ======================================================

function ReportBody({
  report,
  histories,
  fotoUrl,
  dokumenUrl,
  animate = true,
}) {
  return (
    <div className="report-document">
      {/* HEADER */}
      <Reveal animate={animate}>
        <section className="print-card print-header relative overflow-hidden rounded-[30px] border border-slate-200 bg-white px-6 py-7 text-slate-900 shadow-sm sm:px-8 sm:py-9 lg:px-10">
          <div className="relative z-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#155EEF]">
                  SIMPONI
                </p>

                <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  Laporan Pernikahan Dini
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  Dokumen laporan masyarakat yang telah selesai melalui
                  proses penanganan.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
                  Nomor Laporan
                </p>

                <p className="mt-1 text-xl font-extrabold text-slate-900">
                  #{report.id}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <StatusBadge status={report.status} />

              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
                Dibuat {formatDate(report.created_at)}
              </span>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 01 DATA PELAPOR */}
      <Reveal delay={0.05} className="mt-6" animate={animate}>
        <section className="print-card rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionTitle
            number="01"
            title="Data Pelapor"
            description="Informasi identitas pihak yang mengajukan laporan."
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="Nama Pelapor" value={report.pelapor_nama} />
            <InfoItem label="NIK" value={report.pelapor_nik} />
            <InfoItem label="Nomor Telepon" value={report.pelapor_telepon} />
            <InfoItem label="Email" value={report.pelapor_email} />
            <InfoItem label="Domisili" value={report.pelapor_domisili} />
            <InfoItem
              label="Hubungan dengan Kasus"
              value={report.hubungan_pelapor}
            />
          </div>
        </section>
      </Reveal>

      {/* 02 DETAIL KASUS */}
      <Reveal delay={0.1} className="mt-6" animate={animate}>
        <section className="print-card rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionTitle
            number="02"
            title="Detail Kasus"
            description="Informasi terkait kasus pernikahan dini yang dilaporkan."
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
              value={
                report.usia_perempuan
                  ? `${report.usia_perempuan} tahun`
                  : "-"
              }
            />

            <InfoItem
              label="Usia Laki-laki"
              value={
                report.usia_laki_laki
                  ? `${report.usia_laki_laki} tahun`
                  : "-"
              }
            />

            <InfoItem
              label="Status Pendidikan"
              value={report.status_pendidikan}
            />

            <InfoItem
              label="Rencana Akad"
              value={formatDate(report.waktu_rencana_akad)}
            />
          </div>
        </section>
      </Reveal>

      {/* 03 KETERANGAN LAPORAN */}
      <Reveal delay={0.15} className="mt-6" animate={animate}>
        <section className="print-card rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionTitle
            number="03"
            title="Keterangan Laporan"
            description="Informasi tambahan yang disampaikan oleh pelapor."
          />

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Faktor Pendorong
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {report.faktor_pendorong || "-"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Kronologi / Keterangan
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {report.description || "-"}
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 04 PERNYATAAN */}
      <Reveal delay={0.2} className="mt-6" animate={animate}>
        <section className="print-card rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionTitle
            number="04"
            title="Pernyataan Pelapor"
            description="Persetujuan dan pernyataan yang diberikan saat pelaporan."
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div
              className={`rounded-2xl border p-4 ${
                report.pernyataan_benar
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Kebenaran Data
              </p>

              <p className="mt-2 text-sm font-bold text-slate-700">
                {report.pernyataan_benar
                  ? "✓ Pelapor menyatakan data benar"
                  : "Tidak tersedia"}
              </p>
            </div>

            <div
              className={`rounded-2xl border p-4 ${
                report.setuju_pemrosesan
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                Persetujuan Pemrosesan
              </p>

              <p className="mt-2 text-sm font-bold text-slate-700">
                {report.setuju_pemrosesan
                  ? "✓ Pelapor menyetujui pemrosesan data"
                  : "Tidak tersedia"}
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* 05 BUKTI DAN DOKUMEN */}
      <Reveal delay={0.25} className="mt-6" animate={animate}>
        <section className="print-card rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionTitle
            number="05"
            title="Bukti dan Dokumen"
            description="Dokumen pendukung yang terkait dengan laporan."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 bg-white p-4">
                <p className="text-xs font-bold text-slate-700">
                  Dokumen Pendukung
                </p>
              </div>

             
<div className="flex min-h-[220px] items-center justify-center p-6">
  {dokumenUrl ? (
    <div className="w-full text-center">
      <a
        href={dokumenUrl}
        target="_blank"
        rel="noreferrer"
        className="block"
      >
        <img
          src={dokumenUrl}
          alt="Dokumen Pendukung Laporan"
          className="mx-auto max-h-[400px] w-auto max-w-full rounded-xl border border-slate-200 object-contain"
        />
      </a>

      <p className="mt-3 text-xs font-semibold text-slate-500">
        Dokumen Pendukung Laporan
      </p>

      <a
        href={dokumenUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-xs font-semibold text-[#155EEF]"
      >
        Buka gambar asli →
      </a>
    </div>
  ) : (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        —
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Tidak ada dokumen pendukung.
      </p>
    </div>
  )}
</div>

            </div>
          </div>
        </section>
      </Reveal>

      {/* 06 RIWAYAT LAPORAN */}
      <Reveal delay={0.3} className="mt-6" animate={animate}>
        <section className="print-card rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <SectionTitle
            number="06"
            title="Riwayat Laporan"
            description="Riwayat perubahan status selama proses penanganan."
          />

          {histories.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
              <p className="text-sm text-slate-500">
                Belum ada riwayat status.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {histories.map((history, index) => (
                <div
                  key={history.id || index}
                  className="history-item relative rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        {history.old_status && (
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                            {history.old_status}
                          </span>
                        )}

                        {history.old_status && (
                          <span className="text-xs text-slate-400">
                            →
                          </span>
                        )}

                        <StatusBadge
                          status={history.new_status || report.status}
                        />
                      </div>

                      {history.note && (
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {history.note}
                        </p>
                      )}
                    </div>

                    <p className="shrink-0 text-xs text-slate-400">
                      {formatDateTime(history.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </Reveal>

      {/* FOOTER */}
      <Reveal delay={0.35} className="mt-6" animate={animate}>
        <section className="print-card rounded-[28px] border border-slate-200 bg-white p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#155EEF]">
                Dokumen SIMPONI
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Laporan ini merupakan arsip laporan masyarakat yang telah
                dinyatakan selesai oleh pemerintah daerah.
              </p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-slate-400">
                Nomor Laporan
              </p>

              <p className="mt-1 text-lg font-extrabold text-slate-800">
                #{report.id}
              </p>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

// ======================================================
// MAIN COMPONENT
// ======================================================

export default function AdminPemdaSelesaiDetail() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ====================================================
  // LOAD DETAIL
  // ====================================================

  useEffect(() => {
    if (!reportId) {
      setLoading(false);
      return undefined;
    }

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
    }

    loadDetail();

    return () => {
      mounted = false;
    };
  }, [reportId]);

  // ====================================================
  // PRINT
  // ====================================================

  const handlePrint = () => {
    window.print();
  };

  // ====================================================
  // ID TIDAK DITEMUKAN
  // ====================================================

  if (!reportId) {
    return (
      <AdminPemdaLayout>
        <div className="min-h-screen bg-white px-4 pb-12 pt-24 lg:px-8 lg:pt-10">
          <div className="mx-auto max-w-[900px]">
            <div className="rounded-[28px] border border-red-200 bg-white p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-xl text-red-600">
                !
              </div>

              <h2 className="mt-5 text-lg font-bold text-red-800">
                ID laporan tidak ditemukan
              </h2>

              <p className="mt-2 text-sm leading-6 text-red-600">
                URL tidak menyertakan identitas laporan yang valid.
              </p>

              <button
                type="button"
                onClick={() => navigate("/admin/pemda/selesai")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#155EEF] px-5 py-3 text-sm font-semibold text-white"
              >
                ← Kembali ke Selesai
              </button>
            </div>
          </div>
        </div>
      </AdminPemdaLayout>
    );
  }

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <AdminPemdaLayout>
        <div className="min-h-screen bg-white px-4 pb-12 pt-24 lg:px-8 lg:pt-10">
          <div className="mx-auto max-w-[1200px]">
            <div className="animate-pulse">
              <div className="h-10 w-64 rounded-xl bg-slate-200" />
              <div className="mt-3 h-5 w-96 max-w-full rounded-lg bg-slate-200" />
              <div className="mt-8 h-40 rounded-[28px] bg-slate-200" />
              <div className="mt-6 h-80 rounded-[28px] bg-slate-200" />
              <div className="mt-6 h-80 rounded-[28px] bg-slate-200" />
            </div>
          </div>
        </div>
      </AdminPemdaLayout>
    );
  }

  // ====================================================
  // ERROR
  // ====================================================

  if (error || !report) {
    return (
      <AdminPemdaLayout>
        <div className="min-h-screen bg-white px-4 pb-12 pt-24 lg:px-8 lg:pt-10">
          <div className="mx-auto max-w-[900px]">
            <div className="rounded-[28px] border border-red-200 bg-white p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-xl text-red-600">
                !
              </div>

              <h2 className="mt-5 text-lg font-bold text-red-800">
                Detail laporan tidak dapat dimuat
              </h2>

              <p className="mt-2 text-sm leading-6 text-red-600">
                {error || "Data laporan tidak ditemukan."}
              </p>

              <button
                type="button"
                onClick={() => navigate("/admin/pemda/selesai")}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#155EEF] px-5 py-3 text-sm font-semibold text-white"
              >
                ← Kembali ke Selesai
              </button>
            </div>
          </div>
        </div>
      </AdminPemdaLayout>
    );
  }

  // ====================================================
  // DATA LAPORAN
  // ====================================================

    // ====================================================
  // DATA LAPORAN
  // ====================================================

  const histories = Array.isArray(report.histories)
    ? report.histories
    : [];

  const fotoUrl = getFileUrl(report.foto_bukti);
  const dokumenUrl = getFileUrl(report.dokumen_pendukung);

  console.log("DATA DOKUMEN:", report.dokumen_pendukung);
  console.log("URL DOKUMEN:", dokumenUrl);

  // ====================================================
  // MAIN RETURN
  // ====================================================
  // ====================================================
  // MAIN RETURN
  // ====================================================

  return (
    <>
      <style>
        {`
          @page {
            size: A4 portrait;
            margin: 12mm;
          }

          @media screen {
            #print-root {
              display: none !important;
            }
          }

          @media print {
            html,
            body {
              width: 100% !important;
              height: auto !important;
              min-height: 0 !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: visible !important;
              background: #ffffff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            #root {
              display: none !important;
            }

            #print-root {
              display: block !important;
              position: static !important;
              width: 100% !important;
              max-width: none !important;
              height: auto !important;
              min-height: 0 !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: visible !important;
              background: #ffffff !important;
              color: #1e293b !important;
              font-family: Arial, Helvetica, sans-serif !important;
              font-size: 10pt !important;
            }

            #print-root .report-document {
              display: block !important;
              width: 100% !important;
              max-width: none !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            #print-root * {
              box-sizing: border-box !important;
              animation: none !important;
              transition: none !important;
              transform: none !important;
              box-shadow: none !important;
              backdrop-filter: none !important;
              text-shadow: none !important;
            }

            #print-root .print-card {
              width: 100% !important;
              max-width: none !important;
              margin: 0 0 12px 0 !important;
              padding: 14px !important;
              border: 1px solid #cbd5e1 !important;
              border-radius: 8px !important;
              background: #ffffff !important;
              color: #1e293b !important;
              break-inside: auto !important;
              page-break-inside: auto !important;
            }

            #print-root .print-header {
              margin-bottom: 12px !important;
              padding: 20px !important;
              border: 1px solid #cbd5e1 !important;
              background: #f8fafc !important;
            }

            #print-root .mt-6 {
              margin-top: 0 !important;
            }

            #print-root .grid {
              display: grid !important;
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 8px !important;
            }

            #print-root .info-item {
              min-width: 0 !important;
              padding: 10px !important;
              border: 1px solid #e2e8f0 !important;
              border-radius: 6px !important;
              background: #ffffff !important;
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            #print-root .history-item {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            #print-root h1 {
              margin-top: 8px !important;
              font-size: 19pt !important;
              line-height: 1.25 !important;
              color: #0f172a !important;
            }

            #print-root h2 {
              font-size: 12pt !important;
              color: #0f172a !important;
            }

            #print-root p {
              line-height: 1.5 !important;
              overflow-wrap: anywhere !important;
            }

            #print-root span {
              overflow-wrap: anywhere !important;
            }

            #print-root img {
              display: block !important;
              max-width: 100% !important;
              max-height: 160mm !important;
              width: auto !important;
              height: auto !important;
              margin: 0 auto !important;
              object-fit: contain !important;
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }

            #print-root a {
              color: #155EEF !important;
              text-decoration: none !important;
            }

            #print-root .min-h-\\[220px\\] {
              min-height: 0 !important;
            }

            #print-root .rounded-2xl {
              border-radius: 6px !important;
            }

            #print-root .print-card,
            #print-root .print-card * {
              visibility: visible !important;
            }

            #print-root .print-card > div {
              max-width: 100% !important;
            }

            #print-root .space-y-4 > div,
            #print-root .space-y-3 > div {
              break-inside: avoid !important;
              page-break-inside: avoid !important;
            }
          }
        `}
      </style>

      {/* ==================================================
          TAMPILAN LAYAR
      ================================================== */}

      <AdminPemdaLayout>
        <div className="min-h-screen bg-white">
          <div className="mx-auto max-w-[1200px] px-4 pb-14 pt-24 sm:px-6 lg:px-8 lg:pt-10">

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => navigate("/admin/pemda/selesai")}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#155EEF]"
              >
                ← Kembali ke Selesai
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#155EEF] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                <span className="text-base">🖨</span>
                Cetak Laporan
              </button>
            </div>

            <ReportBody
              report={report}
              histories={histories}
              fotoUrl={fotoUrl}
              dokumenUrl={dokumenUrl}
              animate={true}
            />

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/admin/pemda/selesai"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#155EEF]"
              >
                ← Kembali ke Selesai
              </Link>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#155EEF] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
              >
                🖨 Cetak Laporan
              </button>
            </div>
          </div>
        </div>
      </AdminPemdaLayout>

      {/* ==================================================
          KHUSUS CETAK
          Portal dipisahkan dari layout admin
      ================================================== */}

      {createPortal(
        <div id="print-root">
          <ReportBody
            report={report}
            histories={histories}
            fotoUrl={fotoUrl}
            dokumenUrl={dokumenUrl}
            animate={false}
          />
        </div>,
        document.body
      )}
    </>
  );
}
