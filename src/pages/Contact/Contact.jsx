import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const contactItems = [
  {
    title: 'Telepon',
    value: '+62 22 0000 0000',
    detail: 'Layanan operasional SIMPONI',
    icon: '☎',
  },
  {
    title: 'Email',
    value: 'helpdesk@simpani.go.id',
    detail: 'Balasan dalam 1x24 jam kerja',
    icon: '✉',
  },
  {
    title: 'Alamat',
    value: 'Jl. Pusat Pemerintahan No. 00, Bandung',
    detail: 'Pusat layanan data & pelaporan',
    icon: '⌖',
  },
  {
    title: 'Jam operasi',
    value: 'Senin - Jumat, 08.00 - 17.00 WIB',
    detail: 'Layanan publik SIMPONI',
    icon: '⏰',
  },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#f5f7f8] text-slate-800">
      <Navbar />

      <main className="relative z-10 mx-auto max-w-[1200px] px-4 pb-16 pt-32 sm:px-6 lg:px-8 lg:pt-36">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
            

              <h1 className="max-w-[440px] text-3xl font-black leading-[1.06] tracking-[-0.06em] text-slate-900 sm:text-4xl lg:text-[3.1rem]">
                Ada Pertanyaan atau Ingin Melaporkan Sesuatu?
              </h1>

              <p className="max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                SIMPONI adalah platform informasi dan pelaporan yang mendukung upaya pencegahan pernikahan dini,
                perlindungan anak, serta pendampingan masyarakat. Jika Anda memiliki pertanyaan, kebutuhan informasi,
                atau ingin melaporkan kondisi yang memerlukan perhatian, kami siap membantu dengan layanan yang ramah,
                cepat, dan responsif.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d92d2d] text-base text-white shadow-[0_10px_25px_rgba(217,45,45,0.25)]">
                    ✉
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Email</p>
                    <p className="text-base font-semibold text-slate-800">helpdesk@simpani.go.id</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d92d2d] text-base text-white shadow-[0_10px_25px_rgba(217,45,45,0.25)]">
                    ☎
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Nomor layanan</p>
                    <p className="text-base font-semibold text-slate-800">+62 22 0000 0000</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-[#f8fafc] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:p-6">
              <div className="mb-5">
                <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em] text-slate-900">Informasi Layanan</h2>
              </div>

              <div className="space-y-4">
                {contactItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d92d2d] text-lg text-white">
                      {item.icon}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {item.title}
                      </p>
                      <p className="mt-1 text-base font-semibold text-slate-800">{item.value}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}