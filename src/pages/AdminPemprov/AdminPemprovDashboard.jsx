import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { getAdminDashboard } from '../../services/api';

const statusItems = [
  {
    key: 'Diajukan',
    label: 'Diajukan',
    description: 'Menunggu verifikasi',
    icon: '◷',
  },
  {
    key: 'Diverifikasi',
    label: 'Diverifikasi',
    description: 'Sudah diverifikasi',
    icon: '✓',
  },
  {
    key: 'Diproses',
    label: 'Diproses',
    description: 'Sedang ditangani',
    icon: '↻',
  },
  {
    key: 'Selesai',
    label: 'Selesai',
    description: 'Kasus telah selesai',
    icon: '✓',
  },
  {
    key: 'Ditolak',
    label: 'Ditolak',
    description: 'Laporan ditolak',
    icon: '×',
  },
];

function SmallStat({ label, value, description, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.07)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-[#0164DD]">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminPemprovDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError('');

        const data = await getAdminDashboard();

        if (mounted) {
          setDashboard(data);
        }
      } catch (err) {
        console.error('Gagal memuat dashboard:', err);

        if (mounted) {
          setError(
            err?.message ||
              'Data dashboard tidak dapat dimuat.'
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const byStatus = dashboard?.by_status || {};

  return (
    <AdminLayout>
      <div className="min-h-screen">

        {/* =====================================================
            HEADER
        ===================================================== */}
        <header className="border-b border-slate-200 bg-white">
          <div className="px-6 py-7 sm:px-8 lg:px-10">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

              <div>
                <p className="text-sm font-semibold text-[#0164DD]">
                  Selamat datang kembali 👋
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Dashboard
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                  Pantau kondisi pelaporan pernikahan dini
                  di seluruh wilayah Jawa Barat.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 sm:block">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Wilayah kerja
                  </p>

                  <p className="mt-0.5 text-sm font-semibold text-[#0164DD]">
                    {dashboard?.nama_scope || 'Jawa Barat'}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-[#0164DD]">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* =====================================================
            CONTENT
        ===================================================== */}
        <div className="px-6 py-7 sm:px-8 lg:px-10">

          {/* Loading */}
          {isLoading && (
            <div className="flex min-h-[500px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-[#0164DD]" />

                <p className="mt-4 text-sm text-slate-500">
                  Memuat dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="font-semibold text-red-700">
                Dashboard gagal dimuat
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
              >
                Coba lagi
              </button>
            </div>
          )}

          {/* Dashboard */}
          {!isLoading && !error && dashboard && (
            <div className="space-y-6">

              {/* =================================================
                  WELCOME BANNER
              ================================================= */}
              <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0164DD] via-[#1778E8] to-[#3C91EF] p-7 text-white shadow-[0_12px_30px_rgba(1,100,221,0.16)] sm:p-8">

                <div className="relative z-10 max-w-2xl">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
                    Monitoring Provinsi
                  </p>

                  <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                    Pantau Jawa Barat dalam satu dashboard.
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">
                    Lihat jumlah laporan, status penanganan,
                    dan akses fitur pengelolaan Admin Pemprov
                    SIMPONI.
                  </p>
                </div>

                {/* Decorative shapes */}
                <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10" />
                <div className="absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-white/10" />
              </section>

              {/* =================================================
                  STATISTICS
              ================================================= */}
              <section>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    Ringkasan
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Kondisi laporan secara keseluruhan.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <SmallStat
                    label="Total laporan"
                    value={dashboard.total ?? 0}
                    description="Seluruh laporan masuk"
                    icon="▣"
                  />

                  <SmallStat
                    label="Antrean"
                    value={dashboard.queue ?? 0}
                    description="Menunggu tindak lanjut"
                    icon="◷"
                  />

                  <SmallStat
                    label="Diproses"
                    value={byStatus.Diproses ?? 0}
                    description="Dalam penanganan"
                    icon="↻"
                  />

                  <SmallStat
                    label="Selesai"
                    value={byStatus.Selesai ?? 0}
                    description="Laporan terselesaikan"
                    icon="✓"
                  />
                </div>
              </section>

              {/* =================================================
                  TWO COLUMN
              ================================================= */}
              <section className="grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">

                {/* STATUS */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-slate-900">
                        Status Laporan
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        Distribusi laporan berdasarkan tahapan.
                      </p>
                    </div>

                    <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0164DD]">
                      Jawa Barat
                    </span>
                  </div>

                  <div className="mt-6 space-y-5">
                    {statusItems.map((status) => {
                      const value =
                        byStatus[status.key] ?? 0;

                      const total = dashboard.total || 0;

                      const percentage =
                        total > 0
                          ? Math.round(
                              (value / total) * 100
                            )
                          : 0;

                      return (
                        <div key={status.key}>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-[#0164DD]">
                                {status.icon}
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-700">
                                  {status.label}
                                </p>

                                <p className="text-[11px] text-slate-400">
                                  {status.description}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-sm font-bold text-slate-800">
                                {value}
                              </p>

                              <p className="text-[10px] text-slate-400">
                                {percentage}%
                              </p>
                            </div>
                          </div>

                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-[#0164DD] transition-all duration-500"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* WILAYAH */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_4px_18px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-slate-900">
                        Wilayah Kerja
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        Cakupan monitoring saat ini.
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0164DD]">
                      ◫
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-[#F4F8FC] p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Provinsi
                    </p>

                    <p className="mt-2 text-2xl font-bold text-[#0164DD]">
                      {dashboard.nama_scope || 'Jawa Barat'}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-white p-4">
                        <p className="text-2xl font-bold text-slate-900">
                          {dashboard.total ?? 0}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          Total laporan
                        </p>
                      </div>

                      <div className="rounded-xl bg-white p-4">
                        <p className="text-2xl font-bold text-slate-900">
                          {dashboard.queue ?? 0}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          Antrean
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate('/data-provinsi')
                    }
                    className="mt-4 flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0164DD]"
                  >
                    <span>Lihat data provinsi</span>
                    <span>→</span>
                  </button>
                </div>
              </section>

              {/* =================================================
                  QUICK ACTION
              ================================================= */}
              <section>
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    Akses Cepat
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Fitur utama untuk pengelolaan Admin Pemprov.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                  <button
                    type="button"
                    onClick={() =>
                      navigate('/admin/pemprov/rapor')
                    }
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_10px_28px_rgba(1,100,221,0.09)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-[#0164DD]">
                        ▦
                      </div>

                      <span className="text-lg text-slate-300 transition group-hover:text-[#0164DD]">
                        →
                      </span>
                    </div>

                    <h3 className="mt-5 font-semibold text-slate-900">
                      Rapor Kabupaten
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Pantau performa penanganan laporan
                      setiap kabupaten/kota.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate('/admin/pemprov/petugas')
                    }
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_10px_28px_rgba(1,100,221,0.09)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-[#0164DD]">
                        ♙
                      </div>

                      <span className="text-lg text-slate-300 transition group-hover:text-[#0164DD]">
                        →
                      </span>
                    </div>

                    <h3 className="mt-5 font-semibold text-slate-900">
                      Manajemen Petugas
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Kelola akun Admin Pemda di Jawa Barat.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate('/admin/pemprov/ekspor')
                    }
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_10px_28px_rgba(1,100,221,0.09)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-[#0164DD]">
                        ⇩
                      </div>

                      <span className="text-lg text-slate-300 transition group-hover:text-[#0164DD]">
                        →
                      </span>
                    </div>

                    <h3 className="mt-5 font-semibold text-slate-900">
                      Ekspor Data
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      Unduh data laporan untuk kebutuhan
                      evaluasi dan dokumentasi.
                    </p>
                  </button>

                </div>
              </section>

            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
