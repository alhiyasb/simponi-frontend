import heroImage from "../../assets/images/seminar.jpeg";

const features = [
  "Pelaporan aman dan mudah diakses masyarakat",
  "Pemantauan laporan secara transparan",
  "Pendampingan melalui layanan terkait",
  "Data tersimpan dalam sistem digital",
];

export default function FeatureSection() {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_left,_rgba(186,230,253,0.55),_rgba(255,255,255,0)_40%)] py-28">
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-blue-200/25 blur-3xl" />

      <div className="relative mx-auto max-w-[1280px] px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-sm backdrop-blur-sm">
              Kenapa kami hadir
            </span>

            <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-900 lg:text-5xl">
              Solusi digital untuk perlindungan masyarakat.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 lg:text-lg">
              SIMPONI hadir sebagai platform digital yang membantu masyarakat melakukan
              pelaporan, monitoring, dan mendapatkan pendampingan secara cepat dan
              transparan.
            </p>

            <div className="mt-8 space-y-4">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-2xl border border-sky-100 bg-white/80 p-3 shadow-[0_12px_30px_rgba(14,116,144,0.06)] backdrop-blur-sm"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-200">
                    ✓
                  </div>

                  <p className="font-medium text-slate-700">{item}</p>
                </div>
              ))}
            </div>

          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-300/30 blur-3xl" />

            <div className="relative overflow-hidden rounded-[42px] border border-slate-100 bg-white p-3 shadow-[0_30px_80px_rgba(15,23,42,0.1)]">
              <img
                src={heroImage}
                alt="SIMPONI"
                className="h-[520px] w-full rounded-[32px] object-cover"
              />
            </div>

            <div className="absolute -bottom-2 right-[-10px] rounded-2xl border border-sky-100 bg-white/90 px-6 py-4 shadow-[0_18px_45px_rgba(59,130,246,0.12)] backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Sistem aktif</p>
              <h3 className="mt-1 text-xl font-bold text-blue-600">Real Time Monitoring</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}