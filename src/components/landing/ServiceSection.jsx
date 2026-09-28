import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Reveal from "../animation/Reveal";

const services = [
  {
    icon: "📝",
    label: "01",
    title: "Pelaporan Kasus",
    description:
      "Masyarakat dapat menyampaikan laporan pernikahan dini secara aman melalui platform digital SIMPONI.",
    to: "/pelaporan",
  },
  {
    icon: "🔎",
    label: "02",
    title: "Tracking Laporan",
    description:
      "Pantau perkembangan laporan secara transparan menggunakan sistem pelacakan digital.",
    to: "/tracking",
  },
  {
    icon: "📊",
    label: "03",
    title: "Melihat Data Transparan",
    description:
      "Akses data dan informasi secara terbuka untuk meningkatkan transparansi serta kepercayaan publik.",
    to: "/data",
  },
];

export default function ServiceSection() {
  return (
    <section
      id="layanan"
      className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(191,219,254,0.6),_rgba(255,255,255,0)_42%)] py-28"
    >
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-sky-100/60 to-transparent" />
      <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-[1280px] px-8">
        <Reveal>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center rounded-full border border-sky-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-sm backdrop-blur-sm">
              Layanan unggulan
            </span>
            <h2 className="mt-6 text-4xl font-black tracking-tight text-slate-900 lg:text-5xl">
              Solusi digital yang lebih mudah, lebih aman, dan lebih transparan.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600 lg:text-lg">
              Satu platform digital untuk membantu masyarakat melaporkan, memantau, dan
              mendapatkan informasi secara mudah dan akuntabel.
            </p>
          </motion.div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-16 grid gap-7 lg:grid-cols-12 lg:items-stretch">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.15 + index * 0.12, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.01 }}
                className={[
                  "group relative overflow-hidden rounded-[32px] border border-sky-100 bg-white/80 p-7 shadow-[0_20px_45px_rgba(14,116,144,0.08)] backdrop-blur-sm transition-all duration-300 hover:shadow-[0_35px_80px_rgba(59,130,246,0.18)]",
                  index === 0 && "lg:col-span-4 lg:translate-y-8",
                  index === 1 && "lg:col-span-4 lg:-translate-y-2",
                  index === 2 && "lg:col-span-4 lg:translate-y-14",
                ].join(" ")}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-100/80 blur-2xl transition duration-300 group-hover:bg-sky-200/80" />
                <div className="absolute -bottom-12 -left-6 h-24 w-24 rounded-full bg-blue-100/80 blur-2xl transition duration-300 group-hover:bg-blue-200/80" />

                <div className="relative">
                  <div className="flex items-center justify-between">
                    <motion.div
                      whileHover={{ rotate: 8, scale: 1.08 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18 }}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-2xl shadow-lg shadow-blue-200"
                    >
                      {service.icon}
                    </motion.div>
                    <span className="text-xl font-black text-sky-100">{service.label}</span>
                  </div>

                  <h3 className="mt-8 text-2xl font-bold text-slate-900">{service.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>

                  <Link
                    to={service.to}
                    className="mt-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-600 hover:text-white hover:shadow-[0_12px_30px_rgba(37,99,235,0.22)]"
                  >
                    <span>
                      {index === 0
                        ? "Lapor Sekarang"
                        : index === 1
                        ? "Tracking Sekarang"
                        : "Lihat Sekarang"}
                    </span>

                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="inline-block"
                    >
                      →
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
