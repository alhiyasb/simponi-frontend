import { Link } from "react-router-dom";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import pernikahanImage from "../../assets/images/pernikahan-dini.jpeg";

const HeroSection = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const navigate = useNavigate();

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    navigate("/tracking");
  };
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#04122d] via-[#092257] to-[#0e3b82] text-white pt-28 pb-20 lg:pt-32 lg:pb-24">
      {/* BACKGROUND IMAGE OVERLAY WITH SOFT BLEND */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-luminosity pointer-events-none scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${pernikahanImage})` }}
      />

      {/* AMBIENT GLOW ORBS */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-blue-600/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-sky-400/15 rounded-full blur-[100px] pointer-events-none" />

      {/* SUBTLE GRID PATTERN OVERLAY */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
        {/* MAIN HERO GRID: 2 COLUMNS */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: HERO HEADLINE & ACTIONS (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* BADGE PILL */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400" />
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-cyan-200">
                Platform Digital Terpadu SIMPONI
              </span>
              <span className="text-white/40">|</span>
              <span className="text-xs text-white/80 hidden sm:inline">
                Perlindungan Anak & Remaja
              </span>
            </div>

            {/* HEADLINE */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight">
              Mencegah Pernikahan Dini,{" "}
              <span className="block mt-1 bg-gradient-to-r from-cyan-300 via-sky-200 to-white bg-clip-text text-transparent">
                Wujudkan Generasi Emas.
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="text-base sm:text-lg text-blue-100/90 leading-relaxed max-w-2xl font-normal">
              SIMPONI menghadirkan layanan pelaporan yang aman, cepat, dan rahasia.
              Didukung pemantauan real-time serta pendampingan komprehensif bersama
              instansi terkait untuk melindungi hak anak dan masa depan bangsa.
            </p>

            {/* DUAL ACTION BUTTONS */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-5">
              {/* PRIMARY CTA: LAPOR SEKARANG */}
              <div className="relative group">
                {/* Outer Glow & Pulse */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 opacity-75 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-300 animate-pulse pointer-events-none" />

                <Link
                  to="/pelaporan"
                  className="relative inline-flex items-center gap-3.5 px-8 py-4 rounded-full bg-white text-blue-700 font-bold text-base shadow-xl overflow-hidden hover:bg-blue-50 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 border border-white/80 transition-all duration-300"
                >
                  {/* Dynamic Shimmer Sheen */}
                  <span className="absolute top-0 -left-full w-3/4 h-full bg-gradient-to-r from-transparent via-blue-200/50 to-transparent transform -skew-x-20 group-hover:translate-x-[350%] transition-transform duration-1000 ease-out pointer-events-none" />

                  {/* Pulsing Alert Dot */}
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>

                  <span className="tracking-wide group-hover:text-blue-800 transition-colors">
                    Lapor Sekarang
                  </span>

                  {/* Animated Arrow Icon */}
                  <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:translate-x-1 shadow-sm">
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </span>
                </Link>
              </div>

              {/* SECONDARY CTA: TRACKING LAPORAN */}
              <Link
                to="/tracking"
                className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-full border border-white/30 bg-white/10 text-white font-semibold text-base backdrop-blur-md hover:bg-white hover:text-blue-700 hover:-translate-y-0.5 transition-all duration-300 shadow-md"
              >
                <span>Tracking Laporan</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                  🔍
                </span>
              </Link>
            </div>

            {/* TRUST & SECURITY HIGHLIGHTS */}
            <div className="pt-4 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs sm:text-sm text-blue-200/80 font-medium">
              <div className="flex items-center gap-2">
                <span className="text-cyan-300 text-base">🛡️</span>
                <span>Identitas Terlindungi & Rahasia</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-300 text-base">⚡</span>
                <span>Tindak Lanjut Cepat</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-300 text-base">📊</span>
                <span>Monitoring Real-time</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: INTERACTIVE GLASS SHOWCASE CARD (5 cols) */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            
            {/* FLOATING BADGE TOP-RIGHT */}
            <div className="absolute -top-6 -right-3 sm:-right-4 z-20 hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/95 text-slate-800 shadow-2xl border border-sky-100 backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold">
                ✓
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Status Sistem</p>
                <p className="text-xs font-bold text-slate-800">24/7 Siaga Melayani</p>
              </div>
            </div>

            {/* MAIN GLASS SHOWCASE CONTAINER */}
            <div className="relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.35)] overflow-hidden">
              
              {/* CARD HEADER */}
              <div className="flex items-center justify-between pb-5 border-b border-white/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-md">
                    S
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">SIMPONI Portal</h3>
                    <p className="text-xs text-blue-200">Kementerian PPPA & Dinas Terkait</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Online
                </span>
              </div>

              {/* CARD IMAGE BANNER */}
              <div className="mt-5 relative h-48 sm:h-52 rounded-2xl overflow-hidden group/img">
                <img
                  src={pernikahanImage}
                  alt="Edukasi Pernikahan Dini"
                  className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/40 to-transparent" />
                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-cyan-400/20 border border-cyan-300/30 text-cyan-200 text-[11px] font-semibold">
                      Peduli Generasi
                    </span>
                    <p className="mt-1 text-sm font-bold text-white leading-snug">
                      Lindungi Anak dari Pernikahan Usia Dini
                    </p>
                  </div>
                </div>
              </div>

              {/* DIRECT QUICK TRACKING MINI-FORM */}
              <div className="mt-5 p-4 rounded-2xl bg-white/10 border border-white/15">
              <form onSubmit={handleTrackSubmit} className="mt-5 p-4 rounded-2xl bg-white/10 border border-white/15">
                <p className="text-xs font-semibold text-blue-200 mb-2.5 flex items-center gap-1.5">
                  <span>🔎</span> Cek Status Laporan Anda
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: SMPN-2026-XXXX"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/20 border border-white/20 text-xs text-white placeholder-blue-200/50 focus:outline-none focus:border-cyan-400 transition"
                    readOnly
                    onClick={() => { window.location.href = "/tracking"; }}
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    placeholder="Contoh: SMP-2048"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/20 text-xs text-white placeholder-blue-200/50 focus:outline-none focus:border-cyan-400 focus:bg-black/30 transition"
                  />
                  <Link
                    to="/tracking"
                    className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-blue-950 font-bold text-xs transition shadow-md whitespace-nowrap flex items-center"
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-blue-950 font-bold text-xs transition shadow-md whitespace-nowrap flex items-center cursor-pointer"
                  >
                    Lacak
                  </Link>
                  </button>
                </div>
              </div>
              </form>

              {/* MINI HIGHLIGHT CARDS */}
              <div className="mt-4 grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[11px] text-blue-200">Tingkat Penanganan</p>
                  <p className="text-lg font-bold text-cyan-300">98.4%</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[11px] text-blue-200">Respon Pertama</p>
                  <p className="text-lg font-bold text-cyan-300">&lt; 24 Jam</p>
                </div>
              </div>

            </div>

            {/* FLOATING BADGE BOTTOM-LEFT */}
            <div className="absolute -bottom-5 -left-3 sm:-left-4 z-20 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/95 text-slate-800 shadow-2xl border border-sky-100 backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 text-sm">
                🛡️
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Kerahasiaan Data</p>
                <p className="text-xs font-bold text-slate-800">100% Terenkripsi & Aman</p>
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM METRICS STRIP: 4 STAT CARDS */}
        <div className="mt-16 pt-10 border-t border-white/15">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition duration-300 hover:-translate-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                1.250<span className="text-cyan-400">+</span>
              </div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-cyan-200">
                Laporan Masuk
              </p>
              <p className="mt-0.5 text-[11px] text-blue-200/70 hidden sm:block">
                Tercatat resmi dalam sistem
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition duration-300 hover:-translate-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                890<span className="text-cyan-400">+</span>
              </div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-cyan-200">
                Kasus Didampingi
              </p>
              <p className="mt-0.5 text-[11px] text-blue-200/70 hidden sm:block">
                Intervensi & penanganan tuntas
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition duration-300 hover:-translate-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                27
              </div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-cyan-200">
                Kabupaten / Kota
              </p>
              <p className="mt-0.5 text-[11px] text-blue-200/70 hidden sm:block">
                Terintegrasi jaringan SIMPONI
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition duration-300 hover:-translate-y-1">
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                24/7
              </div>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-cyan-200">
                Layanan Siaga
              </p>
              <p className="mt-0.5 text-[11px] text-blue-200/70 hidden sm:block">
                Pengaduan aktif setiap saat
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* BOTTOM CURVED SMOOTH GRADIENT TRANSITION TO SERVICE SECTION */}
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-sky-100/30 to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;