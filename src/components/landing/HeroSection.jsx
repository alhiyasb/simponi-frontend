import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import pernikahanImage from "../../assets/images/pernikahan-dini.jpeg";

const HeroSection = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const navigate = useNavigate();

  const handleTrackSubmit = (e) => {
    e.preventDefault();

    if (trackingCode.trim()) {
      navigate(`/tracking?kode=${encodeURIComponent(trackingCode.trim())}`);
    } else {
      navigate("/tracking");
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-24">

      {/* =========================================================
          BASE GRADIENT - MESH STYLE
      ========================================================= */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#155dfc] via-[#1e6fff] through-[#4d8df5] via-[#7ab3f8] to-white" />

      {/* =========================================================
          GRADIENT MESH / AURORA LAYERS
      ========================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Aurora 1 - Top Left */}
        <div className="absolute -top-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-[#155dfc]/40 via-[#4d8df5]/20 to-transparent blur-[200px] animate-aurora-1" />
        {/* Aurora 2 - Top Right */}
        <div className="absolute -top-1/3 -right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-[#60a5fa]/35 via-[#93c5fd]/20 to-transparent blur-[180px] animate-aurora-2" />
        {/* Aurora 3 - Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#155dfc]/25 via-[#4d8df5]/15 to-[#93c5fd]/10 blur-[160px] animate-aurora-3" />
        {/* Aurora 4 - Bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-t-full bg-gradient-to-t from-[#155dfc]/20 via-[#4d8df5]/10 to-transparent blur-[150px] animate-aurora-4" />
        {/* Aurora 5 - Side accent */}
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-[#93c5fd]/30 via-[#dbeafe]/15 to-transparent blur-[140px] animate-aurora-5" />
      </div>

      {/* =========================================================
          FOTO BACKGROUND - SUBTLE TEXTURE
      ========================================================= */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
        style={{
          backgroundImage: `url(${pernikahanImage})`,
        }}
      />

      {/* =========================================================
          OVERLAY - GLASSMORPHISM BASE
      ========================================================= */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#155dfc]/10 via-transparent to-white/5" />

      {/* =========================================================
          GLAMOURISM BLUR EFFECTS - LAYERED DEPTH
      ========================================================= */}

      {/* Large soft glow - top right */}
      <div className="absolute -top-64 -right-64 w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-[#155dfc]/30 via-[#4d8df5]/15 to-transparent blur-[200px] pointer-events-none" />

      {/* Medium glow - left */}
      <div className="absolute top-1/3 -left-64 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#60a5fa]/25 via-[#93c5fd]/10 to-transparent blur-[180px] pointer-events-none" />

      {/* Center highlight */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-[#93c5fd]/20 via-[#dbeafe]/10 to-transparent blur-[150px] pointer-events-none" />

      {/* Bottom glow */}
      <div className="absolute -bottom-64 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-t from-[#155dfc]/15 via-[#4d8df5]/8 to-transparent blur-[180px] pointer-events-none" />

      {/* Subtle white highlight - top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-gradient-to-b from-white/15 via-white/5 to-transparent blur-[100px] pointer-events-none" />

      {/* =========================================================
          GLASSMORPHISM ACCENT LINES
      ========================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#155dfc]/15 to-transparent blur-sm" />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent blur-sm" />
        <div className="absolute top-0 left-1/4 h-full w-px bg-gradient-to-b from-transparent via-white/20 to-transparent blur-sm" />
        <div className="absolute top-0 right-1/4 h-full w-px bg-gradient-to-b from-transparent via-[#155dfc]/15 to-transparent blur-sm" />
      </div>

      {/* =========================================================
          SUBTLE NOISE TEXTURE
      ========================================================= */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")
          `,
        }}
      />

      {/* =========================================================
          DIAGONAL SHIMMER SWEEP
      ========================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/5 to-transparent blur-[1px] animate-shimmer-sweep" />
      </div>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">

          {/* =====================================================
              HERO TEXT
          ===================================================== */}
          <div className="lg:col-span-8 space-y-6">



            {/* =================================================
                HEADLINE
            ================================================= */}
            <h1
              className="
                text-4xl
                sm:text-5xl
                lg:text-6xl
                font-black
                leading-[1.1]
                tracking-tight
                text-white
              "
            >

              Mencegah Pernikahan Dini,

              <span
                className="
                  block
                  mt-2
                  bg-gradient-to-r
                  from-white
                  via-cyan-100
                  to-cyan-300
                  bg-clip-text
                  text-transparent
                "
              >
                Wujudkan Generasi Emas.
              </span>

            </h1>

            {/* =================================================
                DESCRIPTION
            ================================================= */}
            <p
              className="
                text-base
                sm:text-lg
                text-white/85
                leading-relaxed
                max-w-2xl
                font-normal
              "
            >
              SIMPONI menghadirkan layanan pelaporan yang aman, cepat,
              dan terpercaya untuk membantu melindungi anak serta remaja.
              Setiap laporan dapat dipantau dan ditindaklanjuti secara
              terarah melalui sistem digital terpadu.
            </p>

            {/* =================================================
                BUTTONS
            ================================================= */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-5">

              {/* LAPOR SEKARANG */}
              <div className="relative group">

                {/* Button Glow */}
                <div
                  className="
                    absolute
                    -inset-1
                    rounded-full
                    bg-gradient-to-r
                    from-white
                    via-cyan-300
                    to-blue-300
                    opacity-50
                    blur-md
                    group-hover:opacity-90
                    group-hover:blur-lg
                    transition-all
                    duration-300
                    pointer-events-none
                  "
                />

                <Link
                  to="/pelaporan"
                  className="
                    relative
                    inline-flex
                    items-center
                    gap-3.5
                    px-8
                    py-4
                    rounded-full
                    bg-white
                    text-[#155DFC]
                    font-bold
                    text-base
                    shadow-[0_12px_35px_rgba(0,0,0,0.15)]
                    overflow-hidden
                    hover:bg-cyan-50
                    hover:-translate-y-0.5
                    hover:scale-[1.02]
                    active:scale-95
                    transition-all
                    duration-300
                  "
                >

                  {/* Shimmer */}
                  <span
                    className="
                      absolute
                      top-0
                      -left-full
                      w-3/4
                      h-full
                      bg-gradient-to-r
                      from-transparent
                      via-[#155DFC]/10
                      to-transparent
                      transform
                      -skew-x-20
                      group-hover:translate-x-[350%]
                      transition-transform
                      duration-1000
                      ease-out
                      pointer-events-none
                    "
                  />

                  {/* Alert Dot */}
                  <span className="relative flex h-3 w-3">

                    <span
                      className="
                        animate-ping
                        absolute
                        inline-flex
                        h-full
                        w-full
                        rounded-full
                        bg-red-300
                        opacity-80
                      "
                    />

                    <span
                      className="
                        relative
                        inline-flex
                        rounded-full
                        h-3
                        w-3
                        bg-red-500
                        ring-2
                        ring-white
                      "
                    />

                  </span>

                  <span className="tracking-wide">
                    Lapor Sekarang
                  </span>

                  {/* Arrow */}
                  <span
                    className="
                      w-7
                      h-7
                      rounded-full
                      bg-[#155DFC]/10
                      text-[#155DFC]
                      flex
                      items-center
                      justify-center
                      transition-all
                      duration-300
                      group-hover:bg-[#155DFC]
                      group-hover:text-white
                      group-hover:translate-x-1
                    "
                  >
                    <svg
                      className="w-4 h-4"
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

              {/* TRACKING */}
              <Link
                to="/tracking"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2.5
                  px-7
                  py-4
                  rounded-full
                  border
                  border-white/50
                  bg-white/15
                  text-white
                  font-bold
                  text-base
                  backdrop-blur-xl
                  hover:bg-white
                  hover:text-[#155DFC]
                  hover:border-white
                  hover:shadow-[0_10px_30px_rgba(0,0,0,0.12)]
                  hover:-translate-y-0.5
                  transition-all
                  duration-300
                "
              >

                <span>
                  Tracking Laporan
                </span>

                <span
                  className="
                    w-6
                    h-6
                    rounded-full
                    bg-white/20
                    flex
                    items-center
                    justify-center
                    text-xs
                    group-hover:bg-[#155DFC]
                    group-hover:text-white
                    transition-all
                  "
                >
                  🔍
                </span>

              </Link>

            </div>

            {/* =================================================
                TRUST FEATURES
            ================================================= */}
            <div
              className="
                pt-4
                flex
                flex-wrap
                items-center
                gap-y-3
                gap-x-6
                text-xs
                sm:text-sm
                text-white/80
                font-medium
              "
            >

              <div className="flex items-center gap-2">
                <span className="text-cyan-200 text-base">
                  🛡️
                </span>

                <span>
                  Identitas Terlindungi
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-cyan-200 text-base">
                  ⚡
                </span>

                <span>
                  Tindak Lanjut Cepat
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-cyan-200 text-base">
                  📊
                </span>

                <span>
                  Monitoring Real-time
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* =======================================================
            BOTTOM STATISTICS
        ======================================================= */}
        <div className="mt-20 pt-10 border-t border-white/25">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">

            {/* STAT 1 */}
            <div
              className="
                p-5
                rounded-2xl
                bg-white/65
                hover:bg-white/80
                border border-white/70
                backdrop-blur-xl
                transition
                duration-300
                hover:-translate-y-1
                shadow-[0_10px_30px_rgba(0,0,0,0.06)]
              "
            >

              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                1.250
                <span className="text-[#155DFC]">
                  +
                </span>
              </div>

              <p className="mt-1 text-xs sm:text-sm font-bold text-[#155DFC]">
                Laporan Masuk
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500 hidden sm:block">
                Tercatat resmi dalam sistem
              </p>

            </div>

            {/* STAT 2 */}
            <div
              className="
                p-5
                rounded-2xl
                bg-white/65
                hover:bg-white/80
                border border-white/70
                backdrop-blur-xl
                transition
                duration-300
                hover:-translate-y-1
                shadow-[0_10px_30px_rgba(0,0,0,0.06)]
              "
            >

              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                890
                <span className="text-[#155DFC]">
                  +
                </span>
              </div>

              <p className="mt-1 text-xs sm:text-sm font-bold text-[#155DFC]">
                Kasus Didampingi
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500 hidden sm:block">
                Intervensi & penanganan tuntas
              </p>

            </div>

            {/* STAT 3 */}
            <div
              className="
                p-5
                rounded-2xl
                bg-white/65
                hover:bg-white/80
                border border-white/70
                backdrop-blur-xl
                transition
                duration-300
                hover:-translate-y-1
                shadow-[0_10px_30px_rgba(0,0,0,0.06)]
              "
            >

              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                27
              </div>

              <p className="mt-1 text-xs sm:text-sm font-bold text-[#155DFC]">
                Kabupaten / Kota
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500 hidden sm:block">
                Terintegrasi jaringan SIMPONI
              </p>

            </div>

            {/* STAT 4 */}
            <div
              className="
                p-5
                rounded-2xl
                bg-white/65
                hover:bg-white/80
                border border-white/70
                backdrop-blur-xl
                transition
                duration-300
                hover:-translate-y-1
                shadow-[0_10px_30px_rgba(0,0,0,0.06)]
              "
            >

              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                24/7
              </div>

              <p className="mt-1 text-xs sm:text-sm font-bold text-[#155DFC]">
                Layanan Siaga
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500 hidden sm:block">
                Pengaduan aktif setiap saat
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =========================================================
          BOTTOM TRANSITION - ELEGANT FADE
      ========================================================= */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-48
          bg-gradient-to-t
          from-white
          via-white/50
          to-transparent
          pointer-events-none
        "
      />

      {/* =========================================================
          KEYFRAME STYLES (inline untuk animasi custom)
      ========================================================= */}
      <style jsx global>{`
        @keyframes aurora-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          25% { transform: translate(-50px, -30px) scale(1.05); opacity: 0.8; }
          50% { transform: translate(30px, -50px) scale(0.95); opacity: 0.5; }
          75% { transform: translate(-30px, 40px) scale(1.02); opacity: 0.7; }
        }
        @keyframes aurora-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          25% { transform: translate(40px, -20px) scale(1.03); opacity: 0.7; }
          50% { transform: translate(-40px, 30px) scale(0.97); opacity: 0.4; }
          75% { transform: translate(20px, 50px) scale(1.01); opacity: 0.6; }
        }
        @keyframes aurora-3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          33% { transform: translate(-50%, -50%) translate(20px, -30px) scale(1.04); opacity: 0.6; }
          66% { transform: translate(-50%, -50%) translate(-25px, 20px) scale(0.96); opacity: 0.3; }
        }
        @keyframes aurora-4 {
          0%, 100% { transform: translateX(-50%) scaleX(1); opacity: 0.5; }
          50% { transform: translateX(-50%) scaleX(1.1); opacity: 0.7; }
        }
        @keyframes aurora-5 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
          50% { transform: translate(-30px, 30px) scale(1.05); opacity: 0.6; }
        }
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%) rotate(-15deg); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(100%) rotate(-15deg); opacity: 0; }
        }
        .animate-aurora-1 { animation: aurora-1 20s ease-in-out infinite; }
        .animate-aurora-2 { animation: aurora-2 25s ease-in-out infinite reverse; }
        .animate-aurora-3 { animation: aurora-3 18s ease-in-out infinite; }
        .animate-aurora-4 { animation: aurora-4 15s ease-in-out infinite; }
        .animate-aurora-5 { animation: aurora-5 22s ease-in-out infinite reverse; }
        .animate-shimmer-sweep { animation: shimmer-sweep 8s ease-in-out infinite; }
      `}</style>

    </section>
  );
};

export default HeroSection;