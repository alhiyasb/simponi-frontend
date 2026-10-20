import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const contactItems = [
  {
    title: 'Telepon',
    value: '(022) 1234-5678',
    detail: 'Layanan operasional SIMPONI',
    icon: '☎',
  },
  {
    title: 'Email',
    value: 'helpdesk@simpani.go.id',
    detail: 'Balasan dalam 1x24 jam kerja',
    icon: '✉',
  },
  {
    title: 'Alamat',
    value: 'Jl. Diponegoro No. 12, Bandung',
    detail: 'Pusat Layanan Data & Pelaporan',
    icon: '⌖',
  },
];

export default function Contact() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#eef6ff_0%,#f8fbff_42%,#ffffff_100%)] text-slate-800">

      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      {/* Grid tipis */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.32]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(21,93,252,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(21,93,252,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '42px 42px',
          maskImage:
            'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.55) 45%, transparent 90%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.55) 45%, transparent 90%)',
        }}
      />

      {/* Glow kiri atas */}
      <div className="pointer-events-none absolute -left-32 top-32 h-80 w-80 rounded-full bg-blue-400/20 blur-[110px]" />

      {/* Glow kanan */}
      <div className="pointer-events-none absolute -right-32 top-[520px] h-96 w-96 rounded-full bg-cyan-300/20 blur-[120px]" />

      {/* Glow tengah */}
      <div className="pointer-events-none absolute left-1/2 top-[850px] h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-[100px]" />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-[1400px] px-4 pb-24 pt-28 sm:px-6 lg:px-8">

        {/* =====================================================
            HERO CONTACT
        ====================================================== */}

        <section className="relative overflow-hidden rounded-[38px] border border-white/80 bg-white/65 p-6 shadow-[0_30px_80px_rgba(21,93,252,0.10)] backdrop-blur-2xl sm:p-8 lg:p-12">

          {/* decorative glow dalam card */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/15 blur-[80px]" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-cyan-300/10 blur-[70px]" />

          <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">

            {/* LEFT */}
            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#155DFC] backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#155DFC] shadow-[0_0_10px_rgba(21,93,252,0.8)]" />
                Kontak SIMPONI
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.05] tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
                Hubungi{' '}
                <span className="bg-[linear-gradient(135deg,#155DFC_10%,#008CFF_90%)] bg-clip-text text-transparent">
                  SIMPONI
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Tim kami siap membantu terkait akses akun, pelaporan,
                dan kebutuhan data wilayah. Silakan pilih kanal komunikasi
                yang paling nyaman untuk Anda.
              </p>

              {/* mini indicator */}
              <div className="mt-7 flex flex-wrap items-center gap-3">

                <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                  Layanan aktif
                </div>

                <div className="rounded-full border border-blue-100 bg-blue-50/60 px-4 py-2 text-xs font-medium text-blue-700 backdrop-blur-md">
                  Pusat informasi & pelaporan
                </div>

              </div>
            </div>

            {/* RIGHT - 24/7 CARD */}
            <div className="relative">

              {/* glow */}
              <div className="absolute inset-4 rounded-[32px] bg-blue-500/30 blur-3xl" />

              <div className="relative overflow-hidden rounded-[30px] border border-white/30 bg-[linear-gradient(135deg,#155DFC_0%,#1677F5_50%,#008CFF_100%)] p-7 text-white shadow-[0_30px_60px_rgba(21,93,252,0.28)] sm:p-8">

                {/* decorative circles */}
                <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border border-white/10 bg-white/10 backdrop-blur-md" />
                <div className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full border border-white/10 bg-white/5" />

                <div className="relative">

                  <div className="flex items-center justify-between">

                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-100">
                      Layanan cepat
                    </p>

                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold backdrop-blur-md">
                      ONLINE
                    </span>

                  </div>

                  <p className="mt-8 text-5xl font-black tracking-[-0.05em]">
                    24/7
                  </p>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-blue-50">
                    Respon untuk laporan dan kebutuhan teknis SIMPONI.
                  </p>

                  <div className="mt-7 h-px bg-white/20" />

                  <div className="mt-5 flex items-center gap-3 text-xs text-blue-50">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
                      ✓
                    </span>
                    Dukungan layanan SIMPONI
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* =====================================================
              CONTACT CARDS
          ====================================================== */}

          <div className="relative mt-10 grid gap-4 md:grid-cols-3">

            {contactItems.map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[26px] border border-white/80 bg-white/65 p-5 shadow-[0_15px_40px_rgba(15,23,42,0.05)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:bg-white/80 hover:shadow-[0_20px_45px_rgba(21,93,252,0.10)]"
              >

                {/* hover glow */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/20" />

                <div className="relative">

                  <div className="flex items-center justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg text-[#155DFC] shadow-sm">
                      {item.icon}
                    </div>

                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      {item.title}
                    </span>

                  </div>

                  <p className="mt-5 break-words text-lg font-black tracking-tight text-slate-900">
                    {item.value}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.detail}
                  </p>

                </div>
              </div>
            ))}

          </div>
        </section>


        {/* =====================================================
            FORM + OPERATIONAL
        ====================================================== */}

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">

          {/* =====================================================
              FORM
          ====================================================== */}

          <div className="relative overflow-hidden rounded-[32px] border border-white/80 bg-white/70 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.06)] backdrop-blur-2xl sm:p-8">

            {/* subtle glow */}
            <div className="pointer-events-none absolute -right-20 top-10 h-52 w-52 rounded-full bg-blue-500/10 blur-[80px]" />

            <div className="relative">

              <div className="flex items-end justify-between gap-4">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#155DFC]">
                    Formulir
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                    Kirim pertanyaan
                  </h2>

                  <p className="mt-2 max-w-lg text-sm leading-6 text-slate-500">
                    Sampaikan pertanyaan atau kebutuhan Anda kepada
                    tim layanan SIMPONI.
                  </p>
                </div>

                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#155DFC] sm:flex">
                  ✦
                </div>

              </div>


              <form className="mt-8 space-y-5">

                {/* Nama + Email */}
                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-700">
                      Nama
                    </label>

                    <input
                      type="text"
                      placeholder="Nama lengkap"
                      className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-700">
                      Email
                    </label>

                    <input
                      type="email"
                      placeholder="nama@email.com"
                      className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                </div>


                {/* Subjek */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    Subjek
                  </label>

                  <input
                    type="text"
                    placeholder="Masukkan subjek pertanyaan"
                    className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>


                {/* Pesan */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-700">
                    Pesan
                  </label>

                  <textarea
                    rows="5"
                    placeholder="Tuliskan pertanyaan atau kebutuhan Anda"
                    className="w-full resize-none rounded-2xl border border-slate-200/80 bg-slate-50/70 px-4 py-3.5 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>


                {/* Button */}
                <button
                  type="button"
                  className="group relative overflow-hidden rounded-full bg-[linear-gradient(135deg,#155DFC,#008CFF)] px-7 py-3.5 text-sm font-bold text-white shadow-[0_15px_35px_rgba(21,93,252,0.28)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(21,93,252,0.35)]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Kirim Pesan
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </button>

              </form>
            </div>
          </div>


          {/* =====================================================
              OPERATIONAL CARD
          ====================================================== */}

          <div className="relative overflow-hidden rounded-[32px] border border-blue-400/10 bg-[#0B1630] p-7 text-white shadow-[0_25px_60px_rgba(15,23,42,0.16)] sm:p-8">

            {/* blue glow */}
            <div className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-blue-500/30 blur-[90px]" />

            <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-400/10 blur-[80px]" />

            {/* subtle grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
                `,
                backgroundSize: '34px 34px',
              }}
            />

            <div className="relative">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-300">
                    Jam operasional
                  </p>

                  <h2 className="mt-2 text-2xl font-black tracking-tight">
                    Pusat Layanan
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-blue-300 backdrop-blur-md">
                  ◷
                </div>

              </div>


              {/* status */}
              <div className="mt-7 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">

                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />

                <span className="text-xs font-medium text-slate-300">
                  Pusat layanan aktif
                </span>

              </div>


              {/* schedule */}
              <div className="mt-6 space-y-0">

                <div className="flex items-center justify-between border-b border-white/10 py-5">
                  <span className="text-sm text-slate-300">
                    Senin - Jumat
                  </span>

                  <span className="text-sm font-bold text-white">
                    08.00 - 17.00
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 py-5">
                  <span className="text-sm text-slate-300">
                    Sabtu
                  </span>

                  <span className="text-sm font-bold text-white">
                    08.00 - 12.00
                  </span>
                </div>

                <div className="flex items-center justify-between py-5">
                  <span className="max-w-[170px] text-sm text-slate-300">
                    Minggu / Hari Libur
                  </span>

                  <span className="text-right text-sm font-bold text-blue-300">
                    Layanan darurat
                  </span>
                </div>

              </div>


              {/* bottom info */}
              <div className="mt-5 rounded-2xl border border-blue-400/10 bg-blue-500/10 p-4 backdrop-blur-md">

                <p className="text-xs leading-5 text-slate-300">
                  Untuk kebutuhan pelaporan SIMPONI, gunakan kanal
                  layanan yang tersedia agar proses dapat ditindaklanjuti
                  dengan tepat.
                </p>

              </div>

            </div>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}