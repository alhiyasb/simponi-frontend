import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Reveal from "../animation/Reveal";
import jabar5 from "../../assets/images/jabar5.jpg";
import jabar6 from "../../assets/images/jabar6.jpg";

const services = [
  {
    icon: "📝",
    title: "Pelaporan Kasus",
    description:
      "Masyarakat dapat menyampaikan laporan pernikahan dini secara aman melalui platform digital SIMPONI.",
    to: "/pelaporan",
    image: jabar6,
  },
  {
    icon: "🔎",
    title: "Tracking Laporan",
    description:
      "Pantau perkembangan laporan secara transparan menggunakan sistem pelacakan digital.",
    to: "/tracking",
    image: jabar5,
  },
  {
    icon: "📊",
    title: "Melihat Data Transparan",
    description:
      "Akses data dan informasi secara terbuka untuk meningkatkan transparansi serta kepercayaan publik.",
    to: "/data",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
  },
];

const cardLinkLabel = ["Lapor Sekarang", "Tracking Sekarang", "Lihat Sekarang"];

export default function ServiceSection() {
  return (
    <section id="layanan" className="bg-white py-18">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-5">
        <Reveal>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
           
            <h2 className="mt-4 text-4xl font-black tracking-tight text-[#0071fa] lg:text-5xl">
              Solusi digital yang lebih mudah, lebih aman, dan lebih transparan.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#5F5F5F] lg:text-lg">
              Satu platform digital untuk membantu masyarakat melaporkan, memantau, dan
              mendapatkan informasi secara mudah dan akuntabel.
            </p>
          </motion.div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.28,
                  delay: 0.1 + index * 0.12,
                  ease: "easeOut",
                }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="group flex h-[360px] flex-col overflow-hidden rounded-[18px] border border-[#D9D9D9] bg-white transition-all duration-200 hover:border-[#0071fa]"
              >
                <div
                  className="relative h-[80px] w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(18, 18, 18, 0.35), rgba(18, 18, 18, 0.35)), url(${service.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                <div className="relative flex flex-1 flex-col px-4 pb-6 pt-0 sm:px-5">
                  <div className="mt-[-36px] flex items-center">
                    <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#E8E8E8] bg-white text-3xl shadow-[0_8px_18px_rgba(15,23,42,0.08)]">
                      {service.icon}
                    </div>
                  </div>

                  <div className="mt-5 flex-1">
                    <h3 className="text-[17px] font-semibold leading-tight text-[#222222] transition-colors duration-200 group-hover:text-[#0071fa]">
                      {service.title}
                    </h3>
                    <p
                      className="mt-3 text-sm leading-[1.6] text-[#777777]"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {service.description}
                    </p>
                  </div>

                  <Link
                    to={service.to}
                    className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-[#1E3A5F] transition-all duration-200 hover:text-[#0071fa]"
                  >
                    <span>{cardLinkLabel[index]}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
