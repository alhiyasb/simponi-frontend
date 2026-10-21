import { useAuth } from '../../hooks/useAuth';
import AdminLayout from '../../components/layout/AdminLayout';

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-base font-semibold text-slate-800">
        {value || '-'}
      </p>
    </div>
  );
}

export default function AdminPemprovProfil() {
  const { user } = useAuth();

  const initial = user?.full_name?.charAt(0)?.toUpperCase() || 'A';
  const isActive = user?.is_active !== false;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(1,100,221,0.16),_transparent_32%),linear-gradient(180deg,#f8fbff_0%,#eff5ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="mb-6">
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#0164DD]">
              Admin Pemprov
            </span>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Profil Saya
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Informasi akun Admin Pemprov yang sedang aktif digunakan untuk mengelola sistem SIMPONI.
            </p>
          </div>

          <section className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#0A5BD6] via-[#0D6AE5] to-[#63AFFF] p-6 text-white shadow-[0_24px_60px_rgba(1,100,221,0.22)] sm:p-8">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2),_transparent_52%)]" />
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 right-16 h-36 w-36 rounded-full bg-white/10" />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border-4 border-white/80 bg-white text-3xl font-black text-[#0164DD] shadow-[0_18px_35px_rgba(15,23,42,0.12)]">
                  {initial}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-100">
                      Administrator
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold ${
                        isActive
                          ? 'border-emerald-200/30 bg-emerald-400/15 text-white'
                          : 'border-slate-200/30 bg-slate-400/15 text-slate-100'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-emerald-300' : 'bg-slate-300'}`} />
                      {isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
                    {user?.full_name || 'Admin Pemprov'}
                  </h2>

                  <p className="mt-2 text-sm text-blue-100">
                    {user?.email || 'admin.pemprov@simpovi.id'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100">
                  Role
                </p>

                <p className="mt-2 text-lg font-bold text-white">
                  Admin Pemprov
                </p>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Nama lengkap" value={user?.full_name} />
            <InfoCard label="Email" value={user?.email} />
            <InfoCard label="Role" value="Admin Pemprov" />
            <InfoCard label="Status akun" value={isActive ? 'Aktif' : 'Nonaktif'} />
          </section>

          <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Informasi akun
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Detail akses dan cakupan administrasi Anda.
                </p>
              </div>

              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Aman
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <InfoCard label="Wilayah kerja" value="Provinsi Jawa Barat" />
              <InfoCard label="Jenis akses" value="Pengelola sistem" />
              <InfoCard label="Last login" value={user?.last_login || 'Belum tersedia'} />
              <InfoCard label="Status koneksi" value={isActive ? 'Online' : 'Offline'} />
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
