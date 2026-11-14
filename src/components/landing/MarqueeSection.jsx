const marqueeItems = [
  "PELAPORAN PERNIKAHAN DINI",
  "PERLINDUNGAN MASYARAKAT",
  "LAYANAN DIGITAL TERINTEGRASI",
  "PEMANTAUAN LAPORAN TRANSPARAN",
  "PENDAMPINGAN MASYARAKAT",
  "DATA AMAN DAN TERPUSAT",
  "BERSAMA CEGAH PERNIKAHAN DINI",
];

export default function MarqueeSection() {
  return (
    <section className="overflow-hidden border-y border-neutral-300 bg-neutral-100 py-5">
      <div className="flex w-max animate-marquee">
        {[...marqueeItems, ...marqueeItems].map((item, index) => (
          <div
            key={index}
            className="flex shrink-0 items-center gap-10 px-8"
          >
            <span className="whitespace-nowrap text-sm font-extrabold uppercase tracking-[0.2em] text-[#0071fa]">
              {item}
            </span>

            <span className="h-3 w-3 rotate-45 bg-[#0071fa]" />
          </div>
        ))}
      </div>
    </section>
  );
}
