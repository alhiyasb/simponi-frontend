import heroImage from "../../assets/images/jabar4.png";
import Reveal from "../animation/Reveal";

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
            <Reveal>
              <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight text-black lg:text-5xl">
                Solusi digital untuk perlindungan masyarakat.
              </h2>
            </Reveal>

            <Reveal>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-700 lg:text-lg">
                SIMPONI hadir sebagai platform digital yang membantu masyarakat melakukan
                pelaporan, monitoring, dan mendapatkan pendampingan secara cepat dan
                transparan.
              </p>
            </Reveal>

            <div className="mt-8 space-y-4">
              {features.map((item, index) => (
                <Reveal key={index}>
                  <button
                    type="button"
                    className="group flex w-full items-center gap-4 rounded-[24px] border border-neutral-200 bg-white p-3 text-left shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-red-500 hover:text-red-600 focus:border-red-500 focus:text-red-600 active:border-red-600 active:text-red-600"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-bold text-white shadow-sm transition-colors duration-200 group-hover:bg-red-600 group-focus:bg-red-600 group-active:bg-red-600">
                      ✓
                    </div>

                    <p className="font-medium text-black transition-colors duration-200 group-hover:text-red-600 group-focus:text-red-600 group-active:text-red-600">
                      {item}
                    </p>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-neutral-200/70 blur-3xl" />

            <Reveal>
              <div className="relative overflow-hidden rounded-[52px] border border-neutral-200 bg-white p-3 shadow-[0_25px_60px_rgba(0,0,0,0.08)]">
                <img
                  src={heroImage}
                  alt="SIMPONI"
                  className="h-[520px] w-full rounded-[40px] object-cover"
                />
              </div>
            </Reveal>

       
          </div>
        </div>
      </div>
    </section>
  );
}