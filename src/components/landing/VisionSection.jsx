
import jabar1 from "../../assets/images/jabar1.png";
import jabar2 from "../../assets/images/jabar2.png";
import jabar3 from "../../assets/images/jabar3.png";
import jabar5 from "../../assets/images/jabar4.png";

import jabar11 from "../../assets/images/jabar1.1.png";
import jabar12 from "../../assets/images/jabar1.2.png";
import jabar13 from "../../assets/images/jabar1.3.png";

export default function VisionSection() {
  const imageStyle =
    "h-full w-full object-cover grayscale transition-all duration-700 ease-in-out group-hover:grayscale-0 group-hover:scale-105";

  return (
    <section className="overflow-hidden bg-white py-20">

      {/* Heading */}
      <div className="mb-14 px-6">



        <h2 className="mx-auto max-w-4xl text-center text-4xl font-bold leading-tight text-[#0071FA] md:text-5xl">
          Membangun Perlindungan Masyarakat melalui Teknologi Digital.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-center text-sm leading-relaxed text-slate-600 md:text-base">
          SIMPONI menjadi ruang digital untuk mendukung pelaporan,
          pemantauan, dan pendampingan masyarakat secara cepat,
          transparan, dan terintegrasi.
        </p>

      </div>

      {/* FULL WIDTH IMAGE COLLAGE */}
      <div className="
        grid w-full grid-cols-2
        auto-rows-[110px] gap-1
        md:grid-cols-12
        md:auto-rows-[120px]
        lg:auto-rows-[9vw]
      ">

        {/* 1. Foto kiri utama */}
        <div className="
          group col-span-1 row-span-3
          overflow-hidden
          md:col-start-1 md:row-start-1
          md:col-span-3 md:row-span-4
        ">
          <img
            src={jabar1}
            alt="Dokumentasi SIMPONI"
            className={imageStyle}
          />
        </div>

        {/* 2. Foto atas tengah */}
        <div className="
          group col-span-1 row-span-2
          overflow-hidden
          md:col-start-4 md:row-start-1
          md:col-span-6 md:row-span-2
        ">
          <img
            src={jabar2}
            alt="Dokumentasi kegiatan"
            className={imageStyle}
          />
        </div>

        {/* 3. Foto atas kanan */}
        <div className="
          group col-span-1 row-span-2
          overflow-hidden
          md:col-start-10 md:row-start-1
          md:col-span-3 md:row-span-2
        ">
          <img
            src={jabar5}
            alt="Ilustrasi kegiatan SIMPONI"
            className={imageStyle}
          />
        </div>

        {/* 4. Foto utama tengah */}
        <div className="
          group col-span-2 row-span-2
          overflow-hidden
          md:col-start-4 md:row-start-3
          md:col-span-6 md:row-span-2
        ">
          <img
            src={jabar3}
            alt="Dokumentasi kegiatan utama"
            className={imageStyle}
          />
        </div>

        {/* 5. Foto kanan tengah */}
        <div className="
          group col-span-1 row-span-2
          overflow-hidden
          md:col-start-10 md:row-start-3
          md:col-span-3 md:row-span-2
        ">
          <img
            src={jabar11}
            alt="Kegiatan sosialisasi di Kapanewon Kasihan"
            className={imageStyle}
          />
        </div>

        {/* 6. Foto kiri bawah */}
        <div className="
          group col-span-1 row-span-2
          overflow-hidden
          md:col-start-1 md:row-start-5
          md:col-span-4 md:row-span-2
        ">
          <img
            src={jabar12}
            alt="Dokumentasi kegiatan bersama"
            className={imageStyle}
          />
        </div>

        {/* 7. Foto kanan bawah */}
        <div className="
          group col-span-1 row-span-2
          overflow-hidden
          md:col-start-5 md:row-start-5
          md:col-span-8 md:row-span-2
        ">
          <img
            src={jabar13}
            alt="Dokumentasi sosialisasi pencegahan pernikahan dini"
            className={imageStyle}
          />
        </div>

      </div>

    </section>
  );
}
