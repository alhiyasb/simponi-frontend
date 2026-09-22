import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import heroImage from "../../assets/images/pernikahan-dini.jpeg";
import logo from "../../assets/logo/simponi-logo.svg";
import iconReport from "../../assets/icons/report.svg";
import iconHeart from "../../assets/icons/heart.svg";
import iconMap from "../../assets/icons/map.svg";

function Count({ value = 0, duration = 900, className = "" }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let raf = null;
    const start = performance.now();
    const from = 0;
    const to = Number(value) || 0;
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const current = Math.floor(from + (to - from) * t);
      setCount(current);
      if (t < 1) raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <span className={className}>{count.toLocaleString()}</span>;
}

const HeroSection = () => {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-28 pb-20 bg-gradient-to-br from-sky-700 via-blue-600 to-cyan-500">
      <motion.img
        src={heroImage}
        alt="Pernikahan Dini"
        className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-30 pointer-events-none"
        {...(!reduce ? { animate: { x: [-12, 0, -12] }, transition: { duration: 12, repeat: Infinity } } : {})}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex items-start gap-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="SIMPONI" className="h-12 w-auto" />
          </Link>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/80">Lapor Cepat · Aman · Rahasia</h2>
            <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 via-white to-yellow-200">Sistem Informasi</span>
              <span className="block text-cyan-100 mt-1">Pelaporan dan Pelacakan Kasus</span>
            </h1>

            <p className="mt-4 max-w-2xl text-white/90">SIMPONI membantu warga melaporkan indikasi pernikahan dini dan menghubungkan kasus ke pendampingan yang sesuai. Tindakan cepat sangat membantu pendidikan, kesehatan, dan keselamatan anak.</p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link to="/pelaporan" className="inline-flex items-center px-6 py-3 rounded-full bg-white text-blue-700 font-semibold shadow-lg">Ajukan Laporan →</Link>
              <button className="px-5 py-3 rounded-full border border-white/40 text-white hover:bg-white/10">Lihat Data</button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div className="rounded-xl bg-white/10 p-4" {...(!reduce ? { whileHover: { scale: 1.03 }, transition: { type: 'spring', stiffness: 260 } } : {})}>
              <div className="flex items-center gap-3">
                <img src={iconReport} alt="report" className="h-8 w-8" />
                <p className="text-sm text-white/80">Jumlah kasus terlapor (tahun berjalan)</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-white"><Count value={1250} /></p>
            </motion.div>
            <motion.div className="rounded-xl bg-white/10 p-4" {...(!reduce ? { whileHover: { scale: 1.03 }, transition: { type: 'spring', stiffness: 260 } } : {})}>
              <div className="flex items-center gap-3">
                <img src={iconHeart} alt="handled" className="h-8 w-8" />
                <p className="text-sm text-white/80">Jumlah kasus tertangani/didampingi</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-white"><Count value={890} /></p>
            </motion.div>
            <motion.div className="rounded-xl bg-white/10 p-4" {...(!reduce ? { whileHover: { scale: 1.03 }, transition: { type: 'spring', stiffness: 260 } } : {})}>
              <div className="flex items-center gap-3">
                <img src={iconMap} alt="map" className="h-8 w-8" />
                <p className="text-sm text-white/80">Sebaran wilayah (tertinggi)</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-white">Kab. X, Kab. Y</p>
            </motion.div>
          </div>

          <aside className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm text-white">
            <h3 className="font-semibold">Apa itu Pernikahan Dini</h3>
            <p className="mt-2 text-sm text-white/80">Pernikahan dini adalah pernikahan yang terjadi pada usia di bawah batas yang ditetapkan oleh hukum; pelaporan membantu intervensi dan perlindungan anak.</p>
            <hr className="my-3 border-white/10" />
            <h4 className="font-semibold">Dampak</h4>
            <ul className="mt-2 text-sm text-white/80 list-disc ml-5">
              <li>Kesehatan: risiko komplikasi kehamilan remaja</li>
              <li>Pendidikan: risiko putus sekolah</li>
              <li>Psikososial: tekanan dan stigma</li>
            </ul>
            <hr className="my-3 border-white/10" />
            <p className="text-xs text-white/70">Sumber data: Dinas/Perda (contoh). Perbarui sumber pada produksi.</p>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
