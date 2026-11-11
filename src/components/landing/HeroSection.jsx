import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jabar1 from '../../assets/images/jabar1.png';
import jabar2 from '../../assets/images/jabar2.png';
import jabar3 from '../../assets/images/jabar3.png';
import jabar4 from '../../assets/images/jabar4.png';

const backgroundSlides = [jabar1, jabar2, jabar3, jabar4];

const HeroSection = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundSlides.length);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleTrackSubmit = (e) => {
    e.preventDefault();

    if (trackingCode.trim()) {
      navigate(`/tracking?kode=${encodeURIComponent(trackingCode.trim())}`);
    } else {
      navigate('/tracking');
    }
  };

  return (
    <section className="relative min-h-[760px] overflow-hidden bg-[#0f172a] pb-20 pt-32 text-white sm:pt-36 lg:pb-24 lg:pt-40">
      <div className="absolute inset-0 overflow-hidden">
        {backgroundSlides.map((slide, index) => (
          <div
            key={slide}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${slide})`,
              filter: 'saturate(0.7) contrast(1.05)',
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.78),rgba(15,23,42,0.46),rgba(15,23,42,0.22))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_35%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px] -translate-y-[60px] pt-12 sm:pt-16 lg:pt-20">
          <div className="max-w-2xl pt-6 sm:pt-8 lg:pt-10">
          

            <h1 className="text-3xl font-black leading-[1.08] tracking-[-0.05em] text-white sm:text-4xl lg:text-[4rem]">
              Mencegah Pernikahan Dini,
              <span className="mt-2 block text-white">Wujudkan Generasi Emas.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              SIMPONI menghadirkan layanan pelaporan yang aman, cepat, dan terpercaya untuk membantu
              melindungi anak serta remaja. Setiap laporan dapat dipantau dan ditindaklanjuti secara
              terarah melalui sistem digital terpadu.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/pelaporan"
                className="inline-flex items-center gap-3 rounded-full bg-[#f8f9fa] px-6 py-3 text-sm font-semibold text-[#0f172a] shadow-[0_12px_30px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5"
              >
                <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#d92d2d]" />
                Lapor Sekarang
              </Link>

              <Link
                to="/tracking"
                className="inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Tracking Laporan
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
