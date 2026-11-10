import heroImage from "../../assets/images/seminar.jpeg";

const features = [
  "Pelaporan aman dan mudah diakses masyarakat",
  "Pemantauan laporan secara transparan",
  "Pendampingan melalui layanan terkait",
  "Data tersimpan dalam sistem digital",
];

export default function FeatureSection() {
  return (
    <section className="relative overflow-hidden bg-white py-8">
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-neutral-100 blur-3xl" />
      <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-neutral-200/80 blur-3xl" />

      <div className="relative mx-auto max-w-[1280px] px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-black lg:text-5xl">
              Solusi digital untuk perlindungan masyarakat.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-700 lg:text-lg">
              SIMPONI hadir sebagai platform digital yang membantu masyarakat melakukan
              pelaporan, monitoring, dan mendapatkan pendampingan secara cepat dan
              transparan.
            </p>

            <div className="mt-8 space-y-4">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-[24px] border border-neutral-200 bg-white p-3 shadow-[0_8px_20px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-bold text-white shadow-sm">
                    ✓
                  </div>

                  <p className="font-medium text-black">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-neutral-200/70 blur-3xl" />

            <div className="relative overflow-hidden rounded-[52px] border border-neutral-200 bg-white p-3 shadow-[0_25px_60px_rgba(0,0,0,0.08)]">
              <img
                src={heroImage}
                alt="SIMPONI"
                className="h-[520px] w-full rounded-[40px] object-cover"
              />
            </div>

            <div className="absolute -bottom-2 right-[-10px] rounded-[22px] border border-neutral-200 bg-white px-6 py-4 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
              <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Sistem aktif</p>
              <h3 className="mt-1 text-xl font-bold text-black">Real Time Monitoring</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}