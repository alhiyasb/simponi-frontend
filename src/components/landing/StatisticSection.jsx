const statistics = [
  {
    number: "1.250",
    label: "Laporan masuk",
    description: "Total pengaduan yang tercatat di platform",
    icon: "📄",
  },
  {
    number: "890",
    label: "Kasus selesai",
    description: "Laporan yang telah ditangani dengan baik",
    icon: "✓",
  },
  {
    number: "27",
    label: "Wilayah aktif",
    description: "Kabupaten/kota yang terhubung ke sistem",
    icon: "📍",
  },
  {
    number: "24/7",
    label: "Pemantauan",
    description: "Sistem selalu siap memantau perkembangan",
    icon: "◷",
  },
];

export default function StatisticSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.18),_transparent_30%),linear-gradient(180deg,#f8fbff_0%,#eef6ff_100%)] py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent" />
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700 shadow-sm">
              Transparansi data
            </span>
            <h2 className="mt-5 text-4xl font-black tracking-[-0.04em] text-slate-900 lg:text-5xl">
              Informasi layanan
              <span className="mt-2 block text-sky-700">dalam angka</span>
            </h2>
          </div>

          <p className="max-w-md text-base leading-7 text-slate-600">
            Data statistik membantu masyarakat melihat transparansi layanan serta perkembangan penanganan kasus secara jelas dan akuntabel.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {statistics.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-[30px] border border-sky-100 bg-white/85 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.07)] backdrop-blur-sm transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(14,116,144,0.14)]"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500" />

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-blue-50 text-xl shadow-inner shadow-sky-100">
                {item.icon}
              </div>

              <h3 className="mt-6 text-4xl font-black tracking-[-0.05em] text-sky-700">
                {item.number}
              </h3>

              <h4 className="mt-2 text-lg font-bold text-slate-900">
                {item.label}
              </h4>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-sky-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">Poin utama</p>
            <p className="mt-3 text-2xl font-black text-slate-900">94%</p>
            <p className="mt-1 text-sm text-slate-600">Pernikahan dini berhasil diidentifikasi lebih cepat</p>
          </div>

          <div className="rounded-[24px] border border-sky-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">Keterjangkauan</p>
            <p className="mt-3 text-2xl font-black text-slate-900">18.600</p>
            <p className="mt-1 text-sm text-slate-600">Akses layanan dari masyarakat dan mitra</p>
          </div>

          <div className="rounded-[24px] border border-sky-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">Edukasi</p>
            <p className="mt-3 text-2xl font-black text-slate-900">42</p>
            <p className="mt-1 text-sm text-slate-600">Materi edukasi dan literasi yang dibagikan</p>
          </div>
        </div>
      </div>
    </section>
  );
}
