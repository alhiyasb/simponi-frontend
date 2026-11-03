import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { getReportDetail } from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";

const statusConfig = {
  Diajukan: { label: "Diajukan", class: "border-blue-200 bg-blue-50 text-blue-700", icon: "📨", progress: 25 },
  Diverifikasi: { label: "Diverifikasi", class: "border-violet-200 bg-violet-50 text-violet-700", icon: "🔍", progress: 50 },
  Diproses: { label: "Diproses", class: "border-amber-200 bg-amber-50 text-amber-700", icon: "⚙️", progress: 75 },
  Selesai: { label: "Selesai", class: "border-emerald-200 bg-emerald-50 text-emerald-700", icon: "✅", progress: 100 },
  Ditolak: { label: "Ditolak", class: "border-red-200 bg-red-50 text-red-700", icon: "❌", progress: 0 },
};

const defaultStatus = { label: "Tidak diketahui", class: "border-slate-200 bg-slate-50 text-slate-700", icon: "❓", progress: 0 };

function getStatusConfig(status) {
  if (!status) return defaultStatus;
  if (statusConfig[status]) return statusConfig[status];
  const normalized = status.trim().toLowerCase();
  const match = Object.entries(statusConfig).find(([key]) => key.toLowerCase() === normalized);
  return match ? match[1] : defaultStatus;
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatDateShort(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

function formatFaktorPendorong(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function getFirstDefined(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return "-";
}

function getFileUrl(file) {
  if (!file) return "";

  if (Array.isArray(file)) {
    return getFileUrl(file[0]);
  }

  if (typeof file === "object") {
    const value =
      file.url ||
      file.path ||
      file.file_url ||
      file.filename ||
      file.name ||
      file.link;
    return getFileUrl(value);
  }

  const rawValue = String(file).trim();
  if (!rawValue) return "";

  if (/^https?:\/\//i.test(rawValue)) {
    return rawValue;
  }

  const apiBase = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api")
    .replace(/\/+$/, "");
  const backendRoot = apiBase.replace(/\/api$/, "");
  const normalized = rawValue.replace(/^\/+/, "").replace(/\\/g, "/");
  const cleanValue = normalized.startsWith("api/") ? normalized.slice(4) : normalized;

  if (cleanValue.startsWith("uploads/")) {
    return `${backendRoot}/${cleanValue}`;
  }

  return `${backendRoot}/uploads/${cleanValue}`;
}

function Field({ label, children, wide = false }) {
  return (
    <div className={wide ? "min-w-0 md:col-span-2" : "min-w-0"}>
      {label && (
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
      )}
      <div className="print-value rounded-2xl border border-sky-100 bg-white/70 px-3 py-2 text-sm text-slate-700 shadow-inner shadow-sky-100/60">
        {children ?? "-"}
      </div>
    </div>
  );
}

export default function ReportDetailPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getReportDetail(reportId);
        setReport(data);
      } catch (err) {
        console.error("Gagal mengambil detail laporan:", err);
        setError(err?.message || "Gagal memuat detail laporan.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [reportId]);

  const handleBack = () => navigate("/tracking");
  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#eaf4ff_0%,#f8fbff_28%,#eef6ff_100%)]">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 pb-20 pt-28">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-[28px] border border-sky-100 bg-white p-6">
                <div className="mb-4 h-6 w-1/3 rounded bg-sky-100" />
                <div className="h-4 w-full rounded bg-sky-100" />
                <div className="mt-2 h-4 w-2/3 rounded bg-sky-100" />
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#eaf4ff_0%,#f8fbff_28%,#eef6ff_100%)]">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 pb-20 pt-28">
          <div className={`rounded-[28px] p-8 text-center ${error ? "border border-red-200 bg-red-50" : "border border-sky-100 bg-white"}`}>
            <p className={error ? "mb-4 text-red-700" : "text-slate-600"}>{error || "Laporan tidak ditemukan"}</p>
            <button onClick={handleBack} className="rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-700">Kembali</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const cfg = getStatusConfig(report.status);
  const faktorPendorong = formatFaktorPendorong(report.faktor_pendorong);
  const histories = Array.isArray(report.histories) ? report.histories : [];
  const dokumenPendukungUrl = getFileUrl(report.dokumen_pendukung);

  const namaPerempuan = getFirstDefined(
    report.nama_perempuan,
    report.nama_korban,
    report.nama_korban_perempuan,
    report.nama_pasangan_perempuan,
    report.calon_mempelai_perempuan,
    report.perempuan_nama,
    report.nama_pelapor_perempuan,
    report.nama_laki_laki,
    report.nama_laki,
  );

  const namaLaki = getFirstDefined(
    report.nama_laki_laki,
    report.nama_laki,
    report.nama_korban_laki,
    report.nama_pasangan_laki,
    report.calon_mempelai_laki,
    report.laki_laki_nama,
    report.nama_pelapor_laki,
    report.nama_perempuan,
  );

  const pendidikanPerempuan = getFirstDefined(
    report.pendidikan_perempuan,
    report.pendidikan_korban_perempuan,
    report.pendidikan_pasangan_perempuan,
    report.status_pendidikan_perempuan,
    report.status_pendidikan,
  );

  const pendidikanLaki = getFirstDefined(
    report.pendidikan_laki,
    report.pendidikan_laki_laki,
    report.pendidikan_korban_laki,
    report.pendidikan_pasangan_laki,
    report.status_pendidikan_laki,
    report.status_pendidikan,
  );

  return (
    <div className="report-detail-page min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.25),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_22%),linear-gradient(180deg,#edf6ff_0%,#f8fbff_28%,#eef6ff_100%)] text-slate-800">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 12mm; }
          html, body {
            background: #fff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-hidden, nav, footer { display: none !important; }
          .report-detail-page { min-height: auto !important; background: #fff !important; }
          .print-container { max-width: none !important; width: 100% !important; padding: 0 !important; margin: 0 !important; }
          .print-header { margin-bottom: 14px !important; }
          .print-card {
            background: #fff !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 10px !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            margin-bottom: 10px !important;
            padding: 14px !important;
            break-inside: avoid;
            page-break-inside: avoid;
          }
          .print-title { font-size: 21px !important; color: #0f172a !important; }
          .print-label { color: #64748b !important; font-size: 10px !important; }
          .print-value { color: #0f172a !important; font-size: 11px !important; }
          .print-muted { color: #64748b !important; }
          .print-progress { background: #e2e8f0 !important; }
          .print-progress-fill { background: #2563eb !important; }
          .print-no-break { break-inside: avoid; page-break-inside: avoid; }
          a { color: #0f172a !important; text-decoration: none !important; }
        }
      `}</style>

      <Navbar />

      <main className="print-container mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="print-header print-no-break flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-[30px] border border-white/60 bg-gradient-to-r from-white/80 via-sky-50/80 to-blue-50/80 p-5 shadow-[0_18px_45px_rgba(59,130,246,0.08)] backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <button onClick={handleBack} className="print-hidden flex h-10 w-10 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-600 shadow-sm hover:bg-sky-50" title="Kembali">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7 7" /></svg>
              </button>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Detail Laporan</p>
                <h1 className="print-title text-2xl font-bold text-slate-900">Laporan #{report.id || reportId}</h1>
              </div>
            </div>
            <button onClick={handlePrint} className="print-hidden flex h-10 w-10 items-center justify-center rounded-full border border-sky-200 bg-white text-sky-600 shadow-sm hover:bg-sky-50" title="Cetak laporan">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            </button>
          </div>

          <section className="print-card rounded-[30px] border border-blue-200 bg-gradient-to-br from-blue-600 via-sky-600 to-blue-500 p-6 text-white shadow-[0_18px_50px_rgba(37,99,235,0.28)] backdrop-blur-xl">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cfg.icon}</span>
                <div>
                  <p className="print-muted text-sm text-blue-100">Status</p>
                  <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1 text-sm font-semibold text-white">{cfg.label}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-blue-50">
                <span>ID: <b className="text-white">{report.id || reportId}</b></span>
                <span>Dibuat: <b className="text-white">{formatDateShort(report.created_at)}</b></span>
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm text-blue-100"><span>Progress</span><b className="text-white">{cfg.progress}%</b></div>
              <div className="print-progress h-3 overflow-hidden rounded-full bg-white/20">
                <div style={{ width: `${cfg.progress}%` }} className="print-progress-fill h-full rounded-full bg-gradient-to-r from-sky-200 to-white" />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-blue-100"><span>Diajukan</span><span>Diverifikasi</span><span>Diproses</span><span>Selesai</span></div>
            </div>
          </section>

          <section className="print-card rounded-[30px] border border-white/60 bg-gradient-to-br from-white/90 via-sky-50/90 to-blue-50/90 p-6 shadow-[0_18px_50px_rgba(59,130,246,0.08)] backdrop-blur-xl">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Informasi Laporan</h2>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 min-w-0">
              <Field label="Nama Pelapor">{report.pelapor_nama}</Field>
              <Field label="NIK Pelapor"><span className="font-mono">{report.pelapor_nik}</span></Field>
              <Field label="Telepon">{report.pelapor_telepon}</Field>
              <Field label="Email"><span className="break-words">{report.pelapor_email}</span></Field>
              <Field label="Alamat / Domisili Pelapor" wide>{report.pelapor_domisili}</Field>
              <Field label="Hubungan dengan Korban">{report.hubungan_pelapor}</Field>
              <Field label="Lokasi Kejadian" wide>
                {report.lokasi_kabupaten || "-"}{report.lokasi_kecamatan_desa ? ` — ${report.lokasi_kecamatan_desa}` : ""}
              </Field>
            </div>
          </section>

          <section className="print-card rounded-[30px] border border-white/60 bg-gradient-to-br from-white/90 via-sky-50/90 to-blue-50/90 p-6 shadow-[0_18px_50px_rgba(59,130,246,0.08)] backdrop-blur-xl">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Detail Kasus</h2>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 min-w-0">
              <Field label="Nama Perempuan">{namaPerempuan}</Field>
              <Field label="Nama Laki-laki">{namaLaki}</Field>
              <Field label="Usia Perempuan">{report.usia_perempuan}</Field>
              <Field label="Usia Laki-laki">{report.usia_laki_laki}</Field>
              <Field label="Pendidikan Perempuan">{pendidikanPerempuan}</Field>
              <Field label="Pendidikan Laki-laki">{pendidikanLaki}</Field>
              <Field label="Waktu Rencana Akad">{report.waktu_rencana_akad ? formatDateShort(report.waktu_rencana_akad) : "-"}</Field>
              <Field label="Faktor Pendorong">
                <div className="flex flex-wrap gap-2">
                  {faktorPendorong.length ? faktorPendorong.map((factor, i) => <span key={i} className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm text-sky-700">{factor}</span>) : "-"}
                </div>
              </Field>
              <Field label="Kronologi / Keterangan" wide>
                <div className="mt-2 overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 via-white to-blue-50 p-4 leading-7 text-slate-700 shadow-inner shadow-sky-100/60 break-words">
                  {report.description || "-"}
                </div>
              </Field>
            </div>
          </section>

          {dokumenPendukungUrl && (
            <section className="print-card rounded-[30px] border border-white/60 bg-gradient-to-br from-white/90 via-sky-50/90 to-blue-50/90 p-6 shadow-[0_18px_50px_rgba(59,130,246,0.08)] backdrop-blur-xl">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Dokumen Pendukung</h2>
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                <p className="text-sm text-slate-500">Dokumen Pendukung</p>
                <a href={dokumenPendukungUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-sm font-semibold text-violet-600 hover:underline">Lihat Dokumen</a>
              </div>
            </section>
          )}

          <section className="print-card rounded-[30px] border border-white/60 bg-gradient-to-br from-white/90 via-sky-50/90 to-blue-50/90 p-6 shadow-[0_18px_50px_rgba(59,130,246,0.08)] backdrop-blur-xl">
            <h2 className="mb-4 text-lg font-bold text-slate-900">Riwayat & Catatan</h2>
            <div className="border-l-2 border-sky-200 pl-4">
              {histories.length ? histories.map((item, index) => (
                <motion.div key={item.id || index} className="relative mb-6 last:mb-0">
                  <div className="absolute left-[-6px] top-1 h-3 w-3 rounded-full border-2 border-white bg-sky-500" />
                  <p className="print-muted text-sm text-slate-500">{formatDate(item.created_at)}</p>
                  <p className="mt-1 font-semibold text-slate-900">{item.new_status || "Perubahan Status"}</p>
                  {item.note && <p className="mt-1 text-slate-600">{item.note}</p>}
                </motion.div>
              )) : <p className="py-4 text-center text-slate-500">Belum ada riwayat aktivitas</p>}
            </div>
          </section>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
