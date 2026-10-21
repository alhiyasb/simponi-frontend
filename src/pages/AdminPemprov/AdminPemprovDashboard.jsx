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
    accent: 'from-amber-400 to-orange-400',
    soft: 'bg-amber-50 text-amber-700',
  },
  {
    key: 'Diverifikasi',
    label: 'Diverifikasi',
    description: 'Sudah diverifikasi',
    icon: '✓',
    accent: 'from-violet-500 to-indigo-500',
    soft: 'bg-violet-50 text-violet-700',
  },
  {
    key: 'Diproses',
    label: 'Diproses',
    description: 'Sedang ditangani',
    icon: '↻',
    accent: 'from-cyan-500 to-sky-500',
    soft: 'bg-cyan-50 text-cyan-700',
  },
  {
    key: 'Selesai',
    label: 'Selesai',
    description: 'Kasus telah selesai',
    icon: '✓',
    accent: 'from-emerald-500 to-teal-500',
    soft: 'bg-emerald-50 text-emerald-700',
  },
  {
    key: 'Ditolak',
    label: 'Ditolak',
    description: 'Laporan ditolak',
    icon: '×',
    accent: 'from-rose-500 to-red-500',
    soft: 'bg-rose-50 text-rose-700',
  },
];

function SmallStat({ label, value, description, icon, accent }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(15,23,42,0.08)] sm:p-5">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />

      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 sm:text-[11px]">
            {label}
          </p>

          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>

          <p className="mt-2 text-[11px] leading-5 text-slate-500 sm:text-xs">
            {description}
          </p>
        </div>

        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-base font-bold text-white shadow-lg shadow-slate-200 sm:h-11 sm:w-11 sm:text-lg`}>
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
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(1,100,221,0.16),_transparent_32%),linear-gradient(180deg,#f8fbff_0%,#eff5ff_100%)]">
        <div className="px-6 pb-7 pt-2 sm:px-8 lg:px-10">
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

          {!isLoading && error && (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
              <p className="font-semibold text-red-700">
                Dashboard gagal dimuat
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
              >
                Coba lagi
              </button>
            </div>
          )}

          {!isLoading && !error && dashboard && (
            <div className="space-y-4 sm:space-y-6">
              <section className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0A5BD6] via-[#0673E3] to-[#53A6FF] p-4 text-white shadow-[0_16px_35px_rgba(1,100,221,0.22)] sm:rounded-[26px] sm:p-6">
                <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.22),_transparent_52%)]" />
                <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-white/10 sm:h-36 sm:w-36" />
                <div className="absolute -bottom-12 right-8 h-24 w-24 rounded-full bg-white/10 sm:right-16 sm:h-32 sm:w-32" />

                <div className="relative z-10 max-w-2xl">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-100 sm:text-[10px]">
                    Monitoring Provinsi
                  </p>

                  <h2 className="mt-2 text-lg font-black leading-snug sm:text-xl lg:text-2xl">
                    Pantau Jawa Barat dalam satu dashboard.
                  </h2>

                  <p className="mt-2 max-w-xl text-xs leading-5 text-blue-100 sm:text-sm sm:leading-6">
                    Lihat jumlah laporan, status penanganan,
                    dan akses fitur pengelolaan Admin Pemprov
                    SIMPONI.
                  </p>
                </div>
              </section>

              <section>
                <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                      Ringkasan
                    </h2>

                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                      Kondisi laporan secara keseluruhan.
                    </p>
                  </div>

                  <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:text-[10px]">
                    Update real-time
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <SmallStat
                    label="Antrean"
                    value={dashboard.queue ?? 0}
                    description="Menunggu tindak lanjut"
                    icon="◷"
                    accent="from-[#FFB454] via-[#FF8A3D] to-[#FF5F6D]"
                  />

                  <SmallStat
                    label="Diproses"
                    value={byStatus.Diproses ?? 0}
                    description="Dalam penanganan"
                    icon="↻"
                    accent="from-[#20C6D8] via-[#32B5FF] to-[#1D7AF9]"
                  />

                  <SmallStat
                    label="Selesai"
                    value={byStatus.Selesai ?? 0}
                    description="Laporan terselesaikan"
                    icon="✓"
                    accent="from-[#10B981] via-[#2CCB94] to-[#10A48D]"
                  />
                </div>
              </section>

              <section className="grid gap-4 xl:grid-cols-[1.5fr_0.8fr] xl:gap-6">
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:rounded-[28px] sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                        Status Laporan
                      </h2>

                      <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                        Distribusi laporan berdasarkan tahapan.
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 space-y-5 sm:mt-6">
                    {statusItems.map((status) => {
                      const value = byStatus[status.key] ?? 0;
                      const total = dashboard.total || 0;
                      const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

                      return (
                        <div key={status.key}>
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${status.accent} text-sm font-bold text-white shadow-md`}>
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

                          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${status.accent} transition-all duration-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:rounded-[28px] sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                        Wilayah Kerja
                      </h2>

                      <p className="mt-1 text-[11px] text-slate-400 sm:text-xs">
                        Cakupan monitoring saat ini.
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#EAF3FF] to-[#DCEBFF] text-base text-[#0164DD] sm:h-10 sm:w-10 sm:text-lg">
                      ◫
                    </div>
                  </div>

                  <div className="mt-5 rounded-3xl bg-gradient-to-br from-[#0A5BD6] via-[#0F6EE6] to-[#6AAEFF] p-4 text-white shadow-[0_18px_35px_rgba(1,100,221,0.18)] sm:p-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-100 sm:text-[10px]">
                      Provinsi
                    </p>

                    <p className="mt-2 text-xl font-black text-white sm:text-2xl">
                      {dashboard.nama_scope || 'Jawa Barat'}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-white/12 p-3 ring-1 ring-white/15 backdrop-blur-sm sm:p-4">
                        <p className="text-xl font-black text-white sm:text-2xl">
                          {dashboard.total ?? 0}
                        </p>

                        <p className="mt-1 text-[10px] text-blue-100 sm:text-[11px]">
                          Total laporan
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white/12 p-3 ring-1 ring-white/15 backdrop-blur-sm sm:p-4">
                        <p className="text-xl font-black text-white sm:text-2xl">
                          {dashboard.queue ?? 0}
                        </p>

                        <p className="mt-1 text-[10px] text-blue-100 sm:text-[11px]">
                          Antrean
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              <section>
                <div className="mb-3 sm:mb-4">
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">
                    Akses Cepat
                  </h2>

                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Fitur utama untuk pengelolaan Admin Pemprov.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/pemprov/rapor')}
                    className="group rounded-[26px] border border-slate-200 bg-white p-5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_35px_rgba(1,100,221,0.12)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EAF3FF] to-[#D8E9FF] text-lg font-bold text-[#0164DD]">
                        ▦
                      </div>

                      <span className="text-lg text-slate-300 transition group-hover:text-[#0164DD]">
                        →
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      Rapor Kabupaten
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Pantau performa penanganan laporan
                      setiap kabupaten/kota.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/admin/pemprov/petugas')}
                    className="group rounded-[26px] border border-slate-200 bg-white p-5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_35px_rgba(1,100,221,0.12)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F5F0FF] to-[#E8E0FF] text-lg font-bold text-violet-600">
                        ♙
                      </div>

                      <span className="text-lg text-slate-300 transition group-hover:text-violet-600">
                        →
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      Manajemen Petugas
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Kelola akun Admin Pemda di Jawa Barat.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/admin/pemprov/ekspor')}
                    className="group rounded-[26px] border border-slate-200 bg-white p-5 text-left shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_35px_rgba(1,100,221,0.12)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ECFFF6] to-[#D8FDEB] text-lg font-bold text-emerald-600">
                        ⇩
                      </div>

                      <span className="text-lg text-slate-300 transition group-hover:text-emerald-600">
                        →
                      </span>
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      Ekspor Data
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
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
