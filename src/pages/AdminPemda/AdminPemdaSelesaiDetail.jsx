import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import AdminPemdaLayout from "../../components/admin/AdminPemdaLayout";
import { getReportDetail } from "../../services/api";

// ======================================================
// HELPER ANIMASI
// ======================================================

function Reveal({ children, delay = 0, className = "" }) {
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
      className={`
        inline-flex items-center gap-2
        rounded-full
        border
        ${current.border}
        ${current.bg}
        px-3 py-1.5
        text-xs font-bold
        ${current.text}
      `}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${current.dot}`}
      />

      {current.label}
    </span>
  );
}

// ======================================================
// ITEM INFORMASI
// ======================================================

function InfoItem({ label, value }) {
  return (
    <div
      className="
        rounded-2xl
        border border-slate-100
        bg-slate-50/70
        p-4
      "
    >
      <p
        className="
          text-[9px]
          font-bold
          uppercase
          tracking-[0.12em]
          text-slate-400
        "
      >
        {label}
      </p>

      <p
        className="
          mt-1.5
          break-words
          text-sm
          font-semibold
          leading-6
          text-slate-700
        "
      >
        {value || "-"}
      </p>
    </div>
  );
}

// ======================================================
// GET URL FILE
// ======================================================

function getFileUrl(file) {
  if (!file) return "";

  if (
    typeof file === "string" &&
    (file.startsWith("http://") ||
      file.startsWith("https://"))
  ) {
    return file;
  }

  const apiBase =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8000/api";

  const cleanBase = apiBase.replace(/\/+$/, "");

  const cleanFile = String(file).replace(/^\/+/, "");

  if (cleanFile.startsWith("uploads/")) {
    return `${cleanBase.replace(/\/api$/, "")}/${cleanFile}`;
  }

  return `${cleanBase.replace(/\/api$/, "")}/uploads/${cleanFile}`;
}

// ======================================================
// SECTION TITLE
// ======================================================

function SectionTitle({ number, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div
        className="
          flex h-9 w-9
          shrink-0
          items-center justify-center
          rounded-xl
          bg-blue-50
          text-xs
          font-extrabold
          text-[#155EEF]
        "
      >
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

  // ====================================================
  // PRINT
  // ====================================================

  const handlePrint = () => {
    window.print();
  };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <AdminPemdaLayout>
        <div className="min-h-screen bg-slate-50 px-4 pb-12 pt-24 lg:px-8 lg:pt-10">
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
        <div className="min-h-screen bg-slate-50 px-4 pb-12 pt-24 lg:px-8 lg:pt-10">
          <div className="mx-auto max-w-[900px]">

            <div
              className="
                rounded-[28px]
                border border-red-200
                bg-red-50
                p-8
                text-center
              "
            >
              <div
                className="
                  mx-auto flex h-14 w-14
                  items-center justify-center
                  rounded-2xl
                  bg-red-100
                  text-xl
                  text-red-600
                "
              >
                !
              </div>

              <h2 className="mt-5 text-lg font-bold text-red-800">
                Detail laporan tidak dapat dimuat
              </h2>

              <p className="mt-2 text-sm leading-6 text-red-600">
                {error ||
                  "Data laporan tidak ditemukan."}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/pemda/selesai")
                }
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#155EEF]
                  px-5 py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                "
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
  // DATA
  // ====================================================

  const histories = Array.isArray(report.histories)
    ? report.histories
    : [];

  const fotoUrl = getFileUrl(report.foto_bukti);

  const dokumenUrl = getFileUrl(
    report.dokumen_pendukung
  );

  return (
    <AdminPemdaLayout>

      {/* ==================================================
          PRINT STYLE
      ================================================== */}

      <style>
        {`
          @media print {

            @page {
              size: A4;
              margin: 15mm;
            }

            body {
              background: white !important;
            }

            body * {
              visibility: hidden;
            }

            #print-area,
            #print-area * {
              visibility: visible;
            }

            #print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              background: white !important;
              box-shadow: none !important;
              border: none !important;
            }

            .print-hidden {
              display: none !important;
            }

            .print-card {
              box-shadow: none !important;
              border: 1px solid #e2e8f0 !important;
              break-inside: avoid;
            }

            .print-break {
              break-before: page;
            }

            .no-print-bg {
              background: white !important;
            }
          }
        `}
      </style>

      <div
        id="print-area"
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-slate-50
        "
      >

        {/* ==================================================
            BACKGROUND
        ================================================== */}

        <div
          className="
            print-hidden
            pointer-events-none
            absolute
            inset-0
            opacity-[0.045]
          "
          style={{
            backgroundImage: `
              linear-gradient(to right, #1683ff 1px, transparent 1px),
              linear-gradient(to bottom, #1683ff 1px, transparent 1px)
            `,
            backgroundSize: "42px 42px",
          }}
        />

        <div
          className="
            print-hidden
            pointer-events-none
            absolute
            -left-32
            top-[-100px]
            h-[400px]
            w-[500px]
            rounded-full
            bg-cyan-300/20
            blur-[120px]
          "
        />

        <div
          className="
            print-hidden
            pointer-events-none
            absolute
            right-[-120px]
            top-[20%]
            h-[420px]
            w-[420px]
            rounded-full
            bg-blue-400/15
            blur-[120px]
          "
        />

        {/* ==================================================
            CONTENT
        ================================================== */}

        <div
          className="
            relative
            mx-auto
            max-w-[1200px]
            px-4
            pb-14
            pt-24
            sm:px-6
            lg:px-8
            lg:pt-10
          "
        >

          {/* ==================================================
              TOP ACTION
          ================================================== */}

          <div
            className="
              print-hidden
              mb-5
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <button
              type="button"
              onClick={() =>
                navigate("/admin/pemda/selesai")
              }
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4 py-2.5
                text-sm
                font-semibold
                text-slate-600
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:border-blue-200
                hover:bg-blue-50
                hover:text-[#155EEF]
              "
            >
              ← Kembali ke Selesai
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="
                inline-flex
                w-fit
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#155EEF]
                px-5 py-2.5
                text-sm
                font-bold
                text-white
                shadow-[0_10px_25px_rgba(21,94,239,0.22)]
                transition
                hover:-translate-y-0.5
                hover:bg-blue-700
              "
            >
              <span className="text-base">
                🖨
              </span>

              Cetak Laporan
            </button>

          </div>


          {/* ==================================================
              HEADER DOKUMEN
          ================================================== */}

          <Reveal>

            <section
              className="
                print-card
                relative
                overflow-hidden
                rounded-[30px]
                bg-gradient-to-br
                from-[#155EEF]
                via-[#2563EB]
                to-[#08A7E8]
                px-6 py-7
                text-white
                shadow-[0_25px_70px_rgba(21,94,239,0.18)]
                sm:px-8
                sm:py-9
                lg:px-10
              "
            >

              <div
                className="
                  print-hidden
                  pointer-events-none
                  absolute
                  inset-[10px]
                  rounded-[24px]
                  border
                  border-white/15
                  bg-white/[0.03]
                "
              />

              <div
                className="
                  print-hidden
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  h-64
                  w-64
                  rounded-full
                  bg-white/10
                  blur-3xl
                "
              />

              <div className="relative z-10">

                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">

                  <div>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
                      SIMPONI
                    </p>

                    <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                      Laporan Pernikahan Dini
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-50">
                      Dokumen laporan masyarakat yang telah
                      selesai melalui proses penanganan.
                    </p>

                  </div>

                  <div
                    className="
                      rounded-2xl
                      border
                      border-white/20
                      bg-white/10
                      px-5
                      py-4
                      backdrop-blur-md
                    "
                  >

                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-100">
                      Nomor Laporan
                    </p>

                    <p className="mt-1 text-xl font-extrabold">
                      #{report.id}
                    </p>

                  </div>

                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">

                  <StatusBadge status={report.status} />

                  <span
                    className="
                      rounded-full
                      border
                      border-white/20
                      bg-white/10
                      px-3 py-1.5
                      text-xs
                      font-semibold
                      text-white
                    "
                  >
                    Dibuat{" "}
                    {formatDate(report.created_at)}
                  </span>

                </div>

              </div>

            </section>

          </Reveal>


          {/* ==================================================
              DATA PELAPOR
          ================================================== */}

          <Reveal delay={0.05} className="mt-6">

            <section
              className="
                print-card
                rounded-[28px]
                border
                border-white/80
                bg-white/80
                p-5
                shadow-[0_18px_55px_rgba(37,99,235,0.07)]
                backdrop-blur-2xl
                sm:p-7
              "
            >

              <SectionTitle
                number="01"
                title="Data Pelapor"
                description="Informasi identitas pihak yang mengajukan laporan."
              />

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

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
                  label="Hubungan dengan Kasus"
                  value={report.hubungan_pelapor}
                />

              </div>

            </section>

          </Reveal>


          {/* ==================================================
              DETAIL KASUS
          ================================================== */}

          <Reveal delay={0.1} className="mt-6">

            <section
              className="
                print-card
                rounded-[28px]
                border
                border-white/80
                bg-white/80
                p-5
                shadow-[0_18px_55px_rgba(37,99,235,0.07)]
                backdrop-blur-2xl
                sm:p-7
              "
            >

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
                  value={formatDate(
                    report.waktu_rencana_akad
                  )}
                />

              </div>

            </section>

          </Reveal>


          {/* ==================================================
              FAKTOR & KRONOLOGI
          ================================================== */}

          <Reveal delay={0.15} className="mt-6">

            <section
              className="
                print-card
                rounded-[28px]
                border
                border-white/80
                bg-white/80
                p-5
                shadow-[0_18px_55px_rgba(37,99,235,0.07)]
                backdrop-blur-2xl
                sm:p-7
              "
            >

              <SectionTitle
                number="03"
                title="Keterangan Laporan"
                description="Informasi tambahan yang disampaikan oleh pelapor."
              />

              <div className="space-y-4">

                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-100
                    bg-slate-50/70
                    p-5
                  "
                >

                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    Faktor Pendorong
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {report.faktor_pendorong || "-"}
                  </p>

                </div>


                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-100
                    bg-slate-50/70
                    p-5
                  "
                >

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


          {/* ==================================================
              PERNYATAAN
          ================================================== */}

          <Reveal delay={0.2} className="mt-6">

            <section
              className="
                print-card
                rounded-[28px]
                border
                border-white/80
                bg-white/80
                p-5
                shadow-[0_18px_55px_rgba(37,99,235,0.07)]
                backdrop-blur-2xl
                sm:p-7
              "
            >

              <SectionTitle
                number="04"
                title="Pernyataan Pelapor"
                description="Persetujuan dan pernyataan yang diberikan saat pelaporan."
              />

              <div className="grid gap-3 sm:grid-cols-2">

                <div
                  className={`
                    rounded-2xl
                    border
                    p-4
                    ${
                      report.pernyataan_benar
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-100 bg-slate-50"
                    }
                  `}
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
                  className={`
                    rounded-2xl
                    border
                    p-4
                    ${
                      report.setuju_pemrosesan
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-100 bg-slate-50"
                    }
                  `}
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


          {/* ==================================================
              BUKTI / DOKUMEN
          ================================================== */}

          <Reveal delay={0.25} className="mt-6">

            <section
              className="
                print-card
                rounded-[28px]
                border
                border-white/80
                bg-white/80
                p-5
                shadow-[0_18px_55px_rgba(37,99,235,0.07)]
                backdrop-blur-2xl
                sm:p-7
              "
            >

              <SectionTitle
                number="05"
                title="Bukti dan Dokumen"
                description="Dokumen pendukung yang terkait dengan laporan."
              />

              <div className="grid gap-4 sm:grid-cols-2">

                {/* FOTO */}

                <div
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-100
                    bg-slate-50
                  "
                >

                  <div className="border-b border-slate-100 bg-white p-4">

                    <p className="text-xs font-bold text-slate-700">
                      Foto / Bukti Awal
                    </p>

                  </div>

                  <div className="flex min-h-[220px] items-center justify-center p-4">

                    {fotoUrl ? (
                      <img
                        src={fotoUrl}
                        alt="Bukti laporan"
                        className="
                          max-h-[300px]
                          w-auto
                          max-w-full
                          rounded-xl
                          object-contain
                          shadow-sm
                        "
                      />
                    ) : (
                      <div className="text-center">

                        <div
                          className="
                            mx-auto
                            flex h-12 w-12
                            items-center justify-center
                            rounded-xl
                            bg-slate-100
                            text-slate-400
                          "
                        >
                          —
                        </div>

                        <p className="mt-3 text-xs text-slate-400">
                          Tidak ada foto bukti.
                        </p>

                      </div>
                    )}

                  </div>

                </div>


                {/* DOKUMEN */}

                <div
                  className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-100
                    bg-slate-50
                  "
                >

                  <div className="border-b border-slate-100 bg-white p-4">

                    <p className="text-xs font-bold text-slate-700">
                      Dokumen Pendukung
                    </p>

                  </div>

                  <div className="flex min-h-[220px] items-center justify-center p-6">

                    {dokumenUrl ? (
                      <a
                        href={dokumenUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          flex
                          flex-col
                          items-center
                          text-center
                        "
                      >

                        <div
                          className="
                            flex h-16 w-16
                            items-center justify-center
                            rounded-2xl
                            bg-blue-50
                            text-2xl
                            text-[#155EEF]
                          "
                        >
                          📄
                        </div>

                        <p className="mt-4 text-sm font-bold text-slate-700">
                          Lihat Dokumen Pendukung
                        </p>

                        <p className="mt-1 text-xs text-[#155EEF]">
                          Buka dokumen →
                        </p>

                      </a>
                    ) : (
                      <div className="text-center">

                        <div
                          className="
                            mx-auto
                            flex h-12 w-12
                            items-center justify-center
                            rounded-xl
                            bg-slate-100
                            text-slate-400
                          "
                        >
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


          {/* ==================================================
              RIWAYAT STATUS
          ================================================== */}

          <Reveal delay={0.3} className="mt-6">

            <section
              className="
                print-card
                rounded-[28px]
                border
                border-white/80
                bg-white/80
                p-5
                shadow-[0_18px_55px_rgba(37,99,235,0.07)]
                backdrop-blur-2xl
                sm:p-7
              "
            >

              <SectionTitle
                number="06"
                title="Riwayat Laporan"
                description="Riwayat perubahan status selama proses penanganan."
              />

              {histories.length === 0 ? (
                <div
                  className="
                    rounded-2xl
                    border
                    border-slate-100
                    bg-slate-50
                    p-5
                    text-center
                  "
                >
                  <p className="text-sm text-slate-500">
                    Belum ada riwayat status.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">

                  {histories.map((history, index) => (
                    <div
                      key={history.id || index}
                      className="
                        relative
                        rounded-2xl
                        border
                        border-slate-100
                        bg-slate-50/70
                        p-4
                      "
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
                              status={
                                history.new_status ||
                                report.status
                              }
                            />

                          </div>

                          {history.note && (
                            <p className="mt-3 text-sm leading-6 text-slate-600">
                              {history.note}
                            </p>
                          )}

                        </div>

                        <p className="shrink-0 text-xs text-slate-400">
                          {formatDateTime(
                            history.created_at
                          )}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </section>

          </Reveal>


          {/* ==================================================
              FOOTER DOKUMEN
          ================================================== */}

          <Reveal delay={0.35} className="mt-6">

            <section
              className="
                print-card
                rounded-[28px]
                border
                border-blue-100
                bg-blue-50/60
                p-5
                sm:p-7
              "
            >

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#155EEF]">
                    Dokumen SIMPONI
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Laporan ini merupakan arsip laporan
                    masyarakat yang telah dinyatakan selesai
                    oleh pemerintah daerah.
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


          {/* ==================================================
              BOTTOM ACTION
          ================================================== */}

          <div
            className="
              print-hidden
              mt-8
              flex
              flex-col-reverse
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <Link
              to="/admin/pemda/selesai"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-5 py-3
                text-sm
                font-semibold
                text-slate-600
                shadow-sm
                transition
                hover:border-blue-200
                hover:bg-blue-50
                hover:text-[#155EEF]
              "
            >
              ← Kembali ke Selesai
            </Link>

            <button
              type="button"
              onClick={handlePrint}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#155EEF]
                px-6 py-3
                text-sm
                font-bold
                text-white
                shadow-[0_10px_25px_rgba(21,94,239,0.22)]
                transition
                hover:-translate-y-0.5
                hover:bg-blue-700
              "
            >
              🖨 Cetak Laporan
            </button>

          </div>

        </div>

      </div>

    </AdminPemdaLayout>
  );
}