import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

const contactItems = [
  {
    title: 'Telepon',
    value: '(022) 1234-5678',
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
    value: 'Jl. Diponegoro No. 12, Bandung',
    detail: 'Pusat Layanan Data & Pelaporan',
    icon: '⌖',
  },
];

export default function Contact() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f5f7] text-slate-800">
      <Navbar />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-120px)] max-w-[1200px] items-center justify-center px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:pt-20">
        <div className="w-full overflow-hidden rounded-[28px] border border-white/80 bg-[#f3f3f3] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
          <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
                KAMI SIAP MEMBANTU ANDA
              </p>

              <h1 className="max-w-[340px] text-3xl font-black leading-[1.05] tracking-[-0.06em] text-slate-900 sm:text-4xl lg:text-[3.35rem]">
                Diskusikan <br /> Kebutuhan <br /> Solusi Anda
              </h1>

              <p className="max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                Apakah Anda membutuhkan solusi kimia berkualitas terbaik yang sesuai dengan kebutuhan Anda? Hubungi kami.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm text-white shadow-[0_10px_25px_rgba(59,130,246,0.28)]">
                    ✉
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Email</p>
                    <p className="text-base font-semibold text-slate-800">helpdesk@simpani.go.id</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-700">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm text-white shadow-[0_10px_25px_rgba(59,130,246,0.28)]">
                    ☎
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Nomor telepon</p>
                    <p className="text-base font-semibold text-slate-800">(022) 1234-5678</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200/80 bg-[#f6f7f9] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:p-6">
              <div className="space-y-5">
                {contactItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-500 text-lg text-white shadow-[0_10px_25px_rgba(59,130,246,0.28)]">
                      {item.icon}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {item.title}
                      </p>
                      <p className="mt-1 text-base font-bold text-slate-800">{item.value}</p>
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