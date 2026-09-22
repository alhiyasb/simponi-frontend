import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const contactItems = [
  {
    title: 'Telepon',
    value: '(022) 1234-5678',
    detail: 'Layanan operasional SIMPONI',
  },
  {
    title: 'Email',
    value: 'helpdesk@simpani.go.id',
    detail: 'Balasan dalam 1x24 jam kerja',
  },
  {
    title: 'Alamat',
    value: 'Jl. Diponegoro No. 12, Bandung',
    detail: 'Pusat Layanan Data & Pelaporan',
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef6ff_0%,#f8fbff_30%,#ffffff_100%)] text-slate-800">
      <Navbar />

      <main className="mx-auto max-w-[1400px] px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <section className="rounded-[34px] border border-blue-100 bg-white p-6 shadow-[0_24px_60px_rgba(21,93,252,0.08)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-blue-700">
                Kontak
              </span>
              <h1 className="mt-5 text-3xl font-black tracking-[-0.06em] text-slate-900 md:text-5xl">
                Hubungi <span className="text-[#155DFC]">SIMPONI</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Tim kami siap membantu terkait akses akun, pelaporan, dan kebutuhan data wilayah. Silakan pilih kanal komunikasi yang paling nyaman untuk Anda.
              </p>
            </div>

            <div className="rounded-[28px] bg-[linear-gradient(135deg,#155DFC_0%,#1f78ff_100%)] p-5 text-white shadow-[0_24px_45px_rgba(21,93,252,0.28)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-100">Layanan cepat</p>
              <p className="mt-4 text-4xl font-black tracking-tight">24/7</p>
              <p className="mt-2 text-blue-100">Respon untuk laporan dan kebutuhan teknis SIMPONI.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {contactItems.map((item) => (
              <div key={item.title} className="rounded-[26px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{item.title}</p>
                <p className="mt-4 text-xl font-black text-slate-900">{item.value}</p>
                <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.04)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Form</p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">Kirim pertanyaan</h2>

            <form className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Nama</label>
                  <input type="text" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10" placeholder="Nama lengkap" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                  <input type="email" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10" placeholder="nama@email.com" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Subjek</label>
                <input type="text" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10" placeholder="Masukan subjek pertanyaan" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Pesan</label>
                <textarea rows="5" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10" placeholder="Tuliskan pertanyaan atau kebutuhan Anda" />
              </div>

              <button type="button" className="rounded-full bg-[linear-gradient(135deg,#155DFC_0%,#2f7bff_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(21,93,252,0.3)] transition hover:scale-[1.01]">
                Kirim Pesan
              </button>
            </form>
          </div>

          <div className="rounded-[30px] border border-slate-200 bg-slate-900 p-6 text-white shadow-[0_20px_45px_rgba(15,23,42,0.1)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-300">Jam operasional</p>
            <h2 className="mt-2 text-2xl font-black">Pusat Layanan</h2>

            <div className="mt-6 space-y-4 text-sm text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span>Senin - Jumat</span>
                <span className="font-semibold text-white">08.00 - 17.00</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <span>Sabtu</span>
                <span className="font-semibold text-white">08.00 - 12.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Minggu / Hari Libur</span>
                <span className="font-semibold text-white">Layanan darurat</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
