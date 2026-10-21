import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getRaporKabupaten } from '../../services/api';

function formatAngka(value) {
  return new Intl.NumberFormat('id-ID').format(value ?? 0);
}

function formatPersen(value) {
  return `${Number(value ?? 0)}%`;
}

function StatusRapor({ status }) {
  const warna = {
    merah: {
      background: '#FEE2E2',
      color: '#B91C1C',
      label: 'Merah',
    },
    kuning: {
      background: '#FEF3C7',
      color: '#92400E',
      label: 'Kuning',
    },
    hijau: {
      background: '#DCFCE7',
      color: '#166534',
      label: 'Hijau',
    },
  };

  const style = warna[String(status ?? '').toLowerCase()] ?? {
    background: '#E5E7EB',
    color: '#374151',
    label: status || 'Belum ada status',
  };

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: '20px',
        background: style.background,
        color: style.color,
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'capitalize',
      }}
    >
      {style.label}
    </span>
  );
}

function KartuRingkasan({ judul, nilai, keterangan, accent }) {
  return (
    <div className="group relative overflow-hidden rounded-[26px] border border-blue-100 bg-gradient-to-br from-[#0B5ED7] via-[#0F6EE6] to-[#6AAEFF] p-5 text-white shadow-[0_18px_35px_rgba(1,100,221,0.22)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_40px_rgba(1,100,221,0.28)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.25),_transparent_28%)]" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-100">
            {judul}
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
            {nilai ?? '-'}
          </h2>

          <p className="mt-2 text-xs text-blue-100/90">
            {keterangan}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RaporKabupaten() {
  const [rapor, setRapor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function ambilData() {
      try {
        setLoading(true);
        setError('');

        const hasil = await getRaporKabupaten();
        setRapor(hasil);
      } catch (err) {
        setError(err.message || 'Gagal mengambil data rapor kabupaten.');
      } finally {
        setLoading(false);
      }
    }

    ambilData();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(1,100,221,0.12),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)] p-3 sm:p-5 lg:p-7">
        <div className="mx-auto w-full max-w-[1600px]">
          <header className="mb-6 overflow-hidden rounded-[30px] border border-blue-100 bg-gradient-to-r from-[#0A5BD6] via-[#0F6EE6] to-[#78BAFF] p-6 text-white shadow-[0_22px_40px_rgba(1,100,221,0.25)] sm:p-8">
            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-100">
                  Monitoring kabupaten
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Rapor Kabupaten
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-blue-100/90">
                  Pantau volume laporan dan hasil evaluasi penanganan di setiap kabupaten.
                </p>
              </div>

              <div className="flex items-center gap-3 self-start rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-lg font-bold text-white">
                  ↗
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
                    Data
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {rapor?.data?.length ?? 0} kabupaten
                  </p>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2),_transparent_58%)]" />
          </header>

          {loading && (
            <div className="flex min-h-[280px] items-center justify-center rounded-[28px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-[#0164DD]" />
                <p className="mt-4 text-sm text-slate-500">
                  Memuat data rapor kabupaten...
                </p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div role="alert" className="rounded-[28px] border border-red-200 bg-red-50 p-5 shadow-sm">
              <p className="text-base font-semibold text-red-700">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-500"
              >
                Muat ulang halaman
              </button>
            </div>
          )}

          {!loading && !error && rapor && (
            <>
              <div className="mb-6 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                <KartuRingkasan
                  judul="Kabupaten Aktif"
                  nilai={formatAngka(rapor.total_kabupaten_aktif)}
                  keterangan="Kabupaten dalam data rapor"
                  accent="from-[#0164DD] via-[#1685F7] to-[#6AB7FF]"
                />

                <KartuRingkasan
                  judul="Rapor Merah"
                  nilai={formatAngka(rapor.kabupaten_rapor_merah)}
                  keterangan="Kabupaten dengan status merah"
                  accent="from-[#F97316] via-[#FB7185] to-[#EF4444]"
                />

                <KartuRingkasan
                  judul="Volume Tertinggi"
                  nilai={rapor.kabupaten_volume_tertinggi || '-'}
                  keterangan="Kabupaten dengan laporan terbanyak"
                  accent="from-[#8B5CF6] via-[#A78BFA] to-[#6366F1]"
                />

                <KartuRingkasan
                  judul="Kabupaten Terlambat"
                  nilai={rapor.kabupaten_terlambat || '-'}
                  keterangan="Berdasarkan hasil evaluasi BE"
                  accent="from-[#10B981] via-[#2CCB94] to-[#0EA5A4]"
                />
              </div>

              <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                <div className="flex flex-col gap-2 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-4 py-4 sm:px-6 sm:py-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 sm:text-xl">
                      Detail Rapor Kabupaten
                    </h2>

                    <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                      Total {formatAngka(rapor.data?.length)} kabupaten pada hasil API.
                    </p>
                  </div>

                  <span className="inline-flex w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:text-[10px]">
                    Update terkini
                  </span>
                </div>

                {rapor.data?.length > 0 ? (
                  <>
                    <div className="block p-3 sm:p-4 lg:hidden">
                      <div className="space-y-3">
                        {rapor.data.map((item, index) => (
                          <div key={item.kode_kabupaten} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                                  {item.kode_kabupaten}
                                </p>
                                <h3 className="mt-1 text-base font-bold text-slate-900">
                                  {item.nama_kabupaten}
                                </h3>
                              </div>
                              <StatusRapor status={item.rapor} />
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
                              <div className="rounded-xl bg-white p-2.5">
                                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Total</p>
                                <p className="mt-1 font-bold text-slate-800">{formatAngka(item.total_laporan)}</p>
                              </div>
                              <div className="rounded-xl bg-white p-2.5">
                                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Selesai</p>
                                <p className="mt-1 font-bold text-slate-800">{formatAngka(item.selesai)}</p>
                              </div>
                              <div className="rounded-xl bg-white p-2.5">
                                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Diproses</p>
                                <p className="mt-1 font-bold text-slate-800">{formatAngka(item.diproses)}</p>
                              </div>
                              <div className="rounded-xl bg-white p-2.5">
                                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">Diajukan</p>
                                <p className="mt-1 font-bold text-slate-800">{formatAngka(item.diajukan)}</p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <div className="mb-1 flex items-center justify-between gap-3">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Penyelesaian</span>
                                <span className="text-xs font-bold text-slate-700">{formatPersen(item.persen_selesai)}</span>
                              </div>
                              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-[#0164DD] to-[#5AA8FF]"
                                  style={{
                                    width: `${Math.min(100, Math.max(0, Number(item.persen_selesai) || 0))}%`,
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="hidden overflow-x-auto lg:block">
                      <table className="w-full min-w-[1200px] border-collapse text-sm text-slate-700">
                        <thead>
                          <tr className="bg-gradient-to-r from-slate-100 to-blue-50 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">
                            {[
                              'No.',
                              'Kode',
                              'Kabupaten',
                              'Total Laporan',
                              'Diajukan',
                              'Diproses',
                              'Selesai',
                              'Ditolak',
                              'Penyelesaian',
                              'Rapor',
                            ].map((judul) => (
                              <th key={judul} className="border-b border-slate-200 px-4 py-3 text-center">
                                {judul}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {rapor.data.map((item, index) => (
                            <tr
                              key={item.kode_kabupaten}
                              className={`transition duration-200 hover:bg-blue-50/60 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}`}
                            >
                              <td className="border-b border-slate-200 px-4 py-3 text-center text-slate-600">{index + 1}</td>
                              <td className="border-b border-slate-200 px-4 py-3 text-center text-slate-600">{item.kode_kabupaten}</td>
                              <td className="border-b border-slate-200 px-4 py-3 text-center">
                                <span className="font-semibold text-slate-800">{item.nama_kabupaten}</span>
                              </td>
                              <td className="border-b border-slate-200 px-4 py-3 text-center font-semibold text-slate-800">{formatAngka(item.total_laporan)}</td>
                              <td className="border-b border-slate-200 px-4 py-3 text-center">{formatAngka(item.diajukan)}</td>
                              <td className="border-b border-slate-200 px-4 py-3 text-center">{formatAngka(item.diproses)}</td>
                              <td className="border-b border-slate-200 px-4 py-3 text-center">{formatAngka(item.selesai)}</td>
                              <td className="border-b border-slate-200 px-4 py-3 text-center">{formatAngka(item.ditolak)}</td>
                              <td className="border-b border-slate-200 px-4 py-3 text-center">
                                <div className="flex items-center justify-center gap-3">
                                  <div className="h-2.5 w-[90px] overflow-hidden rounded-full bg-slate-200">
                                    <div
                                      className="h-full rounded-full bg-gradient-to-r from-[#0164DD] to-[#5AA8FF]"
                                      style={{
                                        width: `${Math.min(100, Math.max(0, Number(item.persen_selesai) || 0))}%`,
                                      }}
                                    />
                                  </div>

                                  <span className="font-semibold text-slate-700">
                                    {formatPersen(item.persen_selesai)}
                                  </span>
                                </div>
                              </td>
                              <td className="border-b border-slate-200 px-4 py-3 text-center">
                                <StatusRapor status={item.rapor} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <p className="p-6 text-sm text-slate-500">
                    Belum ada data rapor kabupaten.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

const gayaSel = {
  padding: '14px 16px',
  borderBottom: '1px solid #E2E8F0',
  color: '#334155',
};