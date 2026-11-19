import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="
      relative
      overflow-hidden
      bg-[#0071fa]
      text-white
      pt-20
      pb-8
      shadow-[0_-1px_0_rgba(15,23,42,0.08)]
    ">

      {/* DECORATION */}
      <div className="
        absolute
        top-[-150px]
        right-[-100px]
        w-[400px]
        h-[400px]
        rounded-full
        bg-white/10
        blur-3xl
      "></div>

      <div className="
        max-w-[1280px]
        mx-auto
        px-8
        relative
        z-10
      ">

        <div className="
          grid
          md:grid-cols-2
          lg:grid-cols-4
          gap-12
        ">

          {/* BRAND */}
          <div>
            <h2 className="text-3xl font-bold text-white">
              SIMPONI
            </h2>

            <p className="
              mt-4
              text-sm
              leading-relaxed
              text-white/80
            ">
              Sistem Informasi Pemerintah Digital
              untuk pelaporan, monitoring,
              dan pendampingan masyarakat.
            </p>

            <div className="mt-6 flex gap-3">
           
            </div>
          </div>


        {/* MENU */}
        <div>
        <h3 className="text-lg font-semibold text-white">
            Menu
        </h3>

        <ul className="mt-5 space-y-3 text-sm text-white/80">
            <li>
            <Link to="/" className="hover:text-white hover:underline transition">
                Beranda
            </Link>
            </li>

            <li>
            <Link to="/statistik" className="hover:text-white hover:underline transition">
                Data
            </Link>
            </li>

            <li>
            <Link to="/kontak" className="hover:text-white hover:underline transition">
                Kontak
            </Link>
            </li>
        </ul>
        </div>

        {/* SERVICES */}
        <div>
        <h3 className="text-lg font-semibold text-white">
            Layanan
        </h3>

        <ul className="mt-5 space-y-3 text-sm text-white/80">
            <li>
            <Link to="/pelaporan" className="hover:text-white hover:underline transition">
                Pelaporan Kasus
            </Link>
            </li>

            <li>
            <Link to="/tracking" className="hover:text-white hover:underline transition">
                Tracking Laporan
            </Link>
            </li>
        </ul>
        </div>


                {/* CONTACT */}
                <div id="kontak">
                    <h3 className="text-lg font-semibold text-white">
                    Kontak
                    </h3>

                    <div className="
                    mt-5
                    space-y-4
                    text-sm
                    text-white/80
                    ">
                    <p>📍 Jawa Barat, Indonesia</p>
                    <p>✉ info@simponi.go.id</p>
                    <p>☎ Layanan 24/7</p>
                    </div>
                </div>

                </div>

        {/* COPYRIGHT */}
        <div className="
          mt-16
          pt-6
          border-t
          border-white/20
          flex
          flex-col
          md:flex-row
          justify-between
          gap-4
          text-sm
          text-white/70
        ">
          <p>
            © 2026 SIMPONI. All Rights Reserved.
          </p>

          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms & Conditions</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
