import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const reports = [
  {
    id: 'SMP-2048',
    title: 'Kasus perkawinan anak',
    status: 'Diproses',
    progress: '68%',
    updated: '2 jam yang lalu',
    location: 'Bandung',
  },
  {
    id: 'SMP-1984',
    title: 'Permintaan pendampingan keluarga',
    status: 'Dalam pengecekan',
    progress: '42%',
    updated: '5 jam yang lalu',
    location: 'Bogor',
  },
  {
    id: 'SMP-1876',
    title: 'Laporan kebutuhan konseling',
    status: 'Selesai',
    progress: '100%',
    updated: '1 hari yang lalu',
    location: 'Cirebon',
  },
];

const summary = [
  { label: 'Laporan aktif', value: '128' },
  { label: 'Dalam proses', value: '74' },
  { label: 'Selesai', value: '46' },
  { label: 'Respon rata-rata', value: '2h' },
];

export default function TrackingPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eaf4ff_0%,#f8fbff_28%,#eef6ff_100%)] text-slate-800">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[36px] border border-sky-100 bg-white/80 p-6 shadow-[0_30px_80px_rgba(59,130,246,0.08)] backdrop-blur-md sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-700">
                Tracking laporan
              </span>
              <h1 className="mt-5 text-3xl font-black tracking-[-0.06em] text-slate-900 md:text-5xl">
                Pantau perkembangan <span className="text-blue-600">laporan Anda</span>
              </h1>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Sistem ini membantu masyarakat melihat status laporan, tahapan penanganan, dan perkembangan tindak lanjut secara transparan.
              </p>
            </div>

            <div className="grid w-full max-w-lg gap-3 sm:grid-cols-2">
              {summary.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-sky-100 bg-gradient-to-br from-white to-sky-50 p-4 shadow-sm">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
                  <p className="mt-3 text-3xl font-black text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 space-y-4">
          {reports.map((report, index) => (
            <div
              key={report.id}
              className="rounded-[28px] border border-sky-100 bg-white/85 p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)] backdrop-blur-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-lg font-bold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">{report.id}</p>
                    <h2 className="mt-1 text-xl font-bold text-slate-900">{report.title}</h2>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                    {report.status}
                  </span>
                  <span className="text-sm font-medium text-slate-500">{report.location}</span>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                  <span>Progress</span>
                  <span className="font-bold text-slate-800">{report.progress}</span>
                </div>
                <div className="h-2.5 rounded-full bg-sky-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600"
                    style={{ width: report.progress }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                <span>Terakhir diperbarui</span>
                <span className="font-semibold text-slate-700">{report.updated}</span>
              </div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
