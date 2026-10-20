import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import AdminPemdaLayout from '../../components/admin/AdminPemdaLayout';
import { getAdminDashboard } from '../../services/api';

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StatusCard({
  label,
  value,
  description,
  icon,
  gradient = false,
  delay = 0,
}) {
  return (
    <Reveal delay={delay}>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className={`
          group relative overflow-hidden rounded-[24px]
          border p-5
          backdrop-blur-2xl
          transition-all duration-300
          ${
            gradient
              ? `
                border-blue-400/30
                bg-gradient-to-br
                from-[#155EEF]
                via-[#2563EB]
                to-[#08A7E8]
                text-white
                shadow-[0_18px_45px_rgba(21,94,239,0.20)]
              `
              : `
                border-white/80
                bg-white/75
                text-slate-900
                shadow-[0_15px_45px_rgba(37,99,235,0.08)]
                hover:border-blue-200
                hover:shadow-[0_20px_50px_rgba(37,99,235,0.12)]
              `
          }
        `}
      >
        {/* Decorative glow */}
        <div
          className={`
            pointer-events-none absolute -right-10 -top-10
            h-28 w-28 rounded-full blur-3xl
            ${
              gradient
                ? 'bg-white/15'
                : 'bg-blue-400/10'
            }
          `}
        />

        <div className="relative flex items-start justify-between">

          <div>
            <p
              className={`
                text-[10px] font-bold uppercase tracking-[0.16em]
                ${
                  gradient
                    ? 'text-blue-100'
                    : 'text-slate-400'
                }
              `}
            >
              {label}
            </p>

            <p
              className={`
                mt-3 text-3xl font-extrabold tracking-tight
                ${
                  gradient
                    ? 'text-white'
                    : 'text-slate-900'
                }
              `}
            >
              {value}
            </p>

            <p
              className={`
                mt-1 text-xs
                ${
                  gradient
                    ? 'text-blue-100'
                    : 'text-slate-500'
                }
              `}
            >
              {description}
            </p>
          </div>

          <div
            className={`
              flex h-11 w-11 items-center justify-center
              rounded-2xl text-lg
              ${
                gradient
                  ? 'bg-white/15 text-white'
                  : 'bg-blue-50 text-[#155EEF]'
              }
            `}
          >
            {icon}
          </div>

        </div>
      </motion.div>
    </Reveal>
  );
}

function StatusRow({ label, value, total, index }) {
  const percentage =
    total > 0
      ? Math.round((value / total) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
      }}
      className="group"
    >
      <div className="mb-2 flex items-center justify-between gap-4">

        <div className="flex min-w-0 items-center gap-2.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-[#155EEF] to-[#08A7E8]" />

          <span className="truncate text-sm font-medium text-slate-700">
            {label}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="text-sm font-bold text-slate-800">
            {value}
          </span>

          <span className="text-[10px] text-slate-400">
            {percentage}%
          </span>
        </div>

      </div>

      <div className="h-2 overflow-hidden rounded-full bg-blue-50">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.1 + index * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="h-full rounded-full bg-gradient-to-r from-[#155EEF] to-[#08A7E8]"
        />
      </div>
    </motion.div>
  );
}

export default function AdminPemdaDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');

        const data = await getAdminDashboard();

        if (mounted) {
          setDashboard(data);
        }
      } catch (err) {
        if (mounted) {
          setError(
            err?.message ||
              'Gagal mengambil data dashboard.'
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const byStatus = dashboard?.by_status || {};

  const total = Number(dashboard?.total || 0);

  const queue = Number(dashboard?.queue || 0);

  const diajukan = Number(byStatus?.Diajukan || 0);
  const diverifikasi = Number(byStatus?.Diverifikasi || 0);
  const diproses = Number(byStatus?.Diproses || 0);
  const selesai = Number(byStatus?.Selesai || 0);
  const ditolak = Number(byStatus?.Ditolak || 0);

  const statusItems = [
    {
      label: 'Diajukan',
      value: diajukan,
    },
    {
      label: 'Diverifikasi',
      value: diverifikasi,
    },
    {
      label: 'Diproses',
      value: diproses,
    },
    {
      label: 'Selesai',
      value: selesai,
    },
    {
      label: 'Ditolak',
      value: ditolak,
    },
  ];

  return (
    <AdminPemdaLayout>

      <div className="relative min-h-screen overflow-hidden">

        {/* =====================================================
            BACKGROUND
        ====================================================== */}

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #1683ff 1px, transparent 1px),
              linear-gradient(to bottom, #1683ff 1px, transparent 1px)
            `,
            backgroundSize: '42px 42px',
          }}
        />

        <div className="pointer-events-none absolute left-[10%] top-[-100px] h-[360px] w-[520px] rounded-full bg-cyan-300/20 blur-[110px]" />

        <div className="pointer-events-none absolute right-[-120px] top-[20%] h-[400px] w-[400px] rounded-full bg-blue-400/15 blur-[120px]" />

        <div className="pointer-events-none absolute bottom-[-180px] left-[35%] h-[420px] w-[520px] rounded-full bg-sky-300/15 blur-[120px]" />

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="relative mx-auto max-w-[1500px] px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pt-10">

          {/* =================================================
              HERO
          ================================================== */}

          <Reveal>

            <section
              className="
                relative overflow-hidden
                rounded-[30px]
                bg-gradient-to-br
                from-[#155EEF]
                via-[#2563EB]
                to-[#08A7E8]
                px-6 py-7
                text-white
                shadow-[0_25px_70px_rgba(21,94,239,0.20)]
                sm:px-8 sm:py-9
                lg:px-10 lg:py-10
              "
            >

              {/* Inner glass */}
              <div
                className="
                  pointer-events-none absolute inset-[10px]
                  rounded-[24px]
                  border border-white/15
                  bg-white/[0.03]
                "
              />

              {/* Glow */}
              <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-28 left-[30%] h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />

              <div className="relative z-10">

                <div className="mb-5 flex flex-wrap items-center gap-2">

                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-50 backdrop-blur-md">
                    Dashboard Admin Pemda
                  </span>

                  {dashboard?.scope && (
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-medium text-blue-50 backdrop-blur-md">
                      {dashboard.scope}
                    </span>
                  )}

                </div>

                <div className="max-w-3xl">

                  <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[42px]">
                    Selamat datang di
                    <br className="hidden sm:block" />
                    <span className="text-cyan-100">
                      Dashboard SIMPONI
                    </span>
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50 sm:text-base">
                    Pantau laporan pernikahan dini,
                    proses verifikasi, penanganan,
                    hingga laporan yang telah selesai
                    dalam satu dashboard.
                  </p>

                </div>

                {/* Mini information */}
                <div className="mt-8 flex flex-wrap gap-3">

                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-100">
                      Wilayah
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {dashboard?.nama_scope ||
                        dashboard?.scope ||
                        'Jawa Barat'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-blue-100">
                      Antrean
                    </p>

                    <p className="mt-1 text-sm font-semibold text-white">
                      {loading ? '...' : queue} laporan
                    </p>
                  </div>

                </div>

              </div>

            </section>

          </Reveal>

          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <Reveal className="mt-5">

              <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700 shadow-sm backdrop-blur-xl">
                <p className="font-semibold">
                  Data dashboard belum dapat dimuat.
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  {error}
                </p>
              </div>

            </Reveal>
          )}

          {/* =================================================
              STATISTICS
          ================================================== */}

          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatusCard
              label="Total Laporan"
              value={loading ? '...' : total}
              description="Seluruh laporan yang tercatat"
              icon="▦"
              gradient
              delay={0}
            />

            <StatusCard
              label="Menunggu Tindakan"
              value={loading ? '...' : queue}
              description="Laporan yang masuk antrean"
              icon="↻"
              delay={0.06}
            />

            <StatusCard
              label="Sedang Diproses"
              value={loading ? '...' : diproses}
              description="Laporan dalam penanganan"
              icon="◌"
              delay={0.12}
            />

            <StatusCard
              label="Selesai"
              value={loading ? '...' : selesai}
              description="Laporan yang telah selesai"
              icon="✓"
              delay={0.18}
            />

          </section>

          {/* =================================================
              LOWER CONTENT
          ================================================== */}

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">

            {/* STATUS */}
            <Reveal>

              <div
                className="
                  relative overflow-hidden
                  rounded-[28px]
                  border border-white/80
                  bg-white/75
                  p-6
                  shadow-[0_18px_55px_rgba(37,99,235,0.08)]
                  backdrop-blur-2xl
                  sm:p-7
                "
              >

                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />

                <div className="relative">

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#155EEF]">
                        Monitoring
                      </p>

                      <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                        Status Laporan
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Ringkasan posisi laporan berdasarkan status.
                      </p>
                    </div>

                    <div className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-[#155EEF]">
                      {loading ? 'Memuat...' : `${total} laporan`}
                    </div>

                  </div>

                  <div className="mt-7 space-y-5">

                    {statusItems.map((item, index) => (
                      <StatusRow
                        key={item.label}
                        label={item.label}
                        value={loading ? 0 : item.value}
                        total={total}
                        index={index}
                      />
                    ))}

                  </div>

                </div>

              </div>

            </Reveal>

            {/* QUICK INFO */}
            <Reveal delay={0.08}>

              <div
                className="
                  relative h-full overflow-hidden
                  rounded-[28px]
                  border border-blue-100/80
                  bg-gradient-to-br
                  from-blue-50/90
                  via-white/80
                  to-cyan-50/80
                  p-6
                  shadow-[0_18px_55px_rgba(37,99,235,0.07)]
                  backdrop-blur-2xl
                  sm:p-7
                "
              >

                <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-300/15 blur-3xl" />

                <div className="relative flex h-full flex-col">

                  <div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#155EEF] to-[#08A7E8] text-xl text-white shadow-[0_10px_25px_rgba(21,94,239,0.20)]">
                      i
                    </div>

                    <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#155EEF]">
                      SIMPONI
                    </p>

                    <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                      Pantau setiap laporan
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      Gunakan menu di sebelah kiri untuk
                      melihat laporan, melakukan penanganan,
                      dan memantau laporan yang sudah selesai.
                    </p>

                  </div>

                  <div className="mt-auto pt-8">

                    <div className="rounded-2xl border border-blue-100 bg-white/70 p-4 backdrop-blur-xl">

                      <div className="flex items-center justify-between">

                        <span className="text-xs font-medium text-slate-500">
                          Antrean laporan
                        </span>

                        <span className="text-lg font-extrabold text-[#155EEF]">
                          {loading ? '...' : queue}
                        </span>

                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-50">

                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{
                            width:
                              total > 0
                                ? `${Math.min(
                                    (queue / total) * 100,
                                    100
                                  )}%`
                                : '0%',
                          }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.9,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="h-full rounded-full bg-gradient-to-r from-[#155EEF] to-[#08A7E8]"
                        />

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </Reveal>

          </section>

          {/* =================================================
              FOOTER NOTE
          ================================================== */}

          <Reveal delay={0.12}>

            <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-blue-100/70 bg-white/55 px-5 py-4 text-xs text-slate-500 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">

              <span>
                Sistem Informasi Pemerintah Digital
              </span>

              <span className="font-medium text-[#155EEF]">
                SIMPONI
              </span>

            </div>

          </Reveal>

        </div>

      </div>

    </AdminPemdaLayout>
  );
}