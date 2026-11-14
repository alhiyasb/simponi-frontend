import { motion } from 'framer-motion';

import AdminPemdaLayout from '../../components/admin/AdminPemdaLayout';
import { useAuth } from '../../hooks/useAuth';

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function InfoItem({ label, value, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>

      {children || (
        <p className="mt-2 break-words text-sm font-semibold text-slate-800">
          {value || '-'}
        </p>
      )}
    </div>
  );
}

export default function AdminPemdaProfil() {
  const { user } = useAuth();

  const initial =
    user?.full_name?.charAt(0)?.toUpperCase() || 'A';

  const isActive = user?.is_active !== false;

  return (
    <AdminPemdaLayout>
      <div className="relative min-h-screen bg-white">

        
        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="relative mx-auto max-w-[1250px] px-4 pb-12 pt-24 sm:px-6 lg:px-8 lg:pt-10">

          {/* =================================================
              HEADER
          ================================================== */}

          <Reveal>
            <div className="mb-6">

                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Profil Saya
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Informasi identitas dan akun yang sedang
                digunakan untuk mengakses SIMPONI.
              </p>

            </div>
          </Reveal>

          {/* =================================================
              PROFILE HERO
          ================================================== */}

          <Reveal>
            <section
              className="
                relative overflow-hidden
                rounded-[30px]
                bg-gradient-to-br
                from-[#155EEF]
                via-[#2563EB]
                to-[#08A7E8]
                p-6
                text-white
                shadow-[0_25px_70px_rgba(21,94,239,0.18)]
                sm:p-8
                lg:p-10
              "
            >

              {/* Inner glass border */}
              <div
                className="
                  pointer-events-none absolute inset-[10px]
                  rounded-[24px]
                  border border-white/15
                  bg-white/[0.03]
                "
              />

              {/* Glow */}
              <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

              <div className="pointer-events-none absolute bottom-[-120px] left-[40%] h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />

              {/* =================================================
                  GRID DI DALAM CARD DIHAPUS
                  Grid hanya berada di background halaman.
              ================================================== */}

              <div className="relative z-10 flex flex-col gap-7 md:flex-row md:items-center">

                {/* =================================================
                    AVATAR
                ================================================== */}

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="
                    flex h-28 w-28 shrink-0
                    items-center justify-center
                    rounded-[30px]
                    border-4 border-white/80
                    bg-white
                    text-4xl font-extrabold
                    text-[#155EEF]
                    shadow-[0_15px_40px_rgba(0,0,0,0.12)]
                    sm:h-32 sm:w-32
                    sm:text-5xl
                  "
                >
                  {initial}
                </motion.div>

                {/* =================================================
                    IDENTITY
                ================================================== */}

                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">


                  </div>

                  <h2 className="mt-4 break-words text-2xl font-extrabold tracking-tight sm:text-3xl">
                    {user?.full_name || 'Admin Pemda'}
                  </h2>

                  <p className="mt-2 text-sm text-blue-100">
                    Admin Pemerintah Daerah
                  </p>

                  <p className="mt-1 break-all text-sm text-blue-100/80">
                    {user?.email || '-'}
                  </p>

                </div>

                {/* =================================================
                    ROLE CARD
                ================================================== */}

                <div
                  className="
                    shrink-0
                    rounded-2xl
                    border border-white/15
                    bg-white/10
                    px-5 py-4
                    backdrop-blur-xl
                    md:min-w-[190px]
                  "
                >

                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-blue-100">
                    Role Sistem
                  </p>

                  <p className="mt-2 text-lg font-bold">
                    Admin Pemda
                  </p>

                  <p className="mt-1 text-xs text-blue-100">
                    Pemerintah Daerah
                  </p>

                </div>

              </div>

            </section>
          </Reveal>

          {/* =================================================
              ACCOUNT INFORMATION
          ================================================== */}

          <Reveal delay={0.08} className="mt-6">
            <section
              className="
                relative overflow-hidden
                rounded-[28px]
                border border-slate-200
bg-white
shadow-sm
                sm:p-7
              "
            >

              <div className="relative">

                <div className="mb-6">

                  <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Identitas Pengguna
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Data berikut berasal dari akun autentikasi
                    SIMPONI.
                  </p>

                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <InfoItem
                    label="Nama Lengkap"
                    value={user?.full_name}
                  />

                  <InfoItem
                    label="NIP"
                    value={user?.nip}
                  />

                  <InfoItem
                    label="Email"
                    value={user?.email}
                  />

                  <InfoItem label="Role">
                    <span className="mt-2 inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#155EEF]">
                      Admin Pemda
                    </span>
                  </InfoItem>

                  <InfoItem
                    label="Kode Kabupaten"
                    value={user?.kode_kabupaten ?? '-'}
                  />

                  <InfoItem label="Status Akun">
                    <span
                      className={`
                        mt-2 inline-flex items-center gap-2
                        rounded-full border
                        px-3 py-1.5
                        text-xs font-bold
                        ${
                          isActive
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-red-200 bg-red-50 text-red-700'
                        }
                      `}
                    >
                      <span
                        className={`
                          h-1.5 w-1.5 rounded-full
                          ${
                            isActive
                              ? 'bg-emerald-500'
                              : 'bg-red-500'
                          }
                        `}
                      />

                      {isActive
                        ? 'Aktif'
                        : 'Tidak Aktif'}
                    </span>
                  </InfoItem>

                </div>

              </div>

            </section>
          </Reveal>
          {/* =================================================
              INFORMATION NOTE
          ================================================== */}

          <Reveal delay={0.12} className="mt-6">

            <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white p-5 backdrop-blur-xl">

              <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-blue-300/15 blur-3xl" />

              <div className="relative flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-[#155EEF] shadow-sm">
                  i
                </div>

                <div>

                  <p className="text-sm font-bold text-blue-900">
                    Informasi profil
                  </p>

                  <p className="mt-1 text-sm leading-6 text-blue-800/80">
                    Informasi pada halaman ini ditampilkan
                    berdasarkan data akun yang diberikan oleh
                    sistem autentikasi SIMPONI.
                  </p>

                </div>

              </div>

            </div>

          </Reveal>

        </div>

      </div>
    </AdminPemdaLayout>
  );
}