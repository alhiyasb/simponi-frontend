import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const menuItems = [
  {
    label: 'Dashboard',
    path: '/admin/pemda',
    icon: '⌂',
  },
  {
    label: 'Laporan',
    path: '/admin/pemda/laporan',
    icon: '▦',
  },
  {
    label: 'Penanganan',
    path: '/admin/pemda/penanganan',
    icon: '↻',
  },
  {
    label: 'Selesai',
    path: '/admin/pemda/selesai',
    icon: '✓',
  },
];

export default function AdminPemdaLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  const isActive = (path) => {
    if (path === '/admin/pemda') {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  const getInitial = () => {
    return (
      user?.full_name?.charAt(0)?.toUpperCase() ||
      'A'
    );
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-900">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      {/* Grid */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.055]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1683ff 1px, transparent 1px),
            linear-gradient(to bottom, #1683ff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Blue glow kiri atas */}
      <div className="pointer-events-none fixed -left-32 -top-32 z-0 h-[420px] w-[420px] rounded-full bg-cyan-300/20 blur-[100px]" />

      {/* Blue glow kanan atas */}
      <div className="pointer-events-none fixed right-[-120px] top-[15%] z-0 h-[420px] w-[420px] rounded-full bg-blue-400/15 blur-[110px]" />

      {/* Blue glow bawah */}
      <div className="pointer-events-none fixed bottom-[-180px] left-[35%] z-0 h-[420px] w-[520px] rounded-full bg-sky-300/15 blur-[120px]" />

      <div className="relative z-10 flex min-h-screen">

        {/* =====================================================
            SIDEBAR DESKTOP
        ====================================================== */}

        <motion.aside
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            fixed inset-y-4 left-4 z-40 hidden
            w-[248px]
            overflow-hidden
            rounded-[28px]
            border border-white/80
            bg-white/75
            shadow-[0_20px_60px_rgba(37,99,235,0.10)]
            backdrop-blur-2xl
            lg:flex lg:flex-col
          "
        >

          {/* Sidebar glow */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-400/10 blur-3xl" />

          {/* =================================================
              LOGO
          ================================================== */}

          <div className="relative flex h-[96px] items-center px-6">

            <button
              type="button"
              onClick={() => navigate('/admin/pemda')}
              className="group text-left"
            >
              <div className="flex items-center gap-2">

                <div
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-xl
                    bg-gradient-to-br from-[#155EEF] to-[#08A7E8]
                    text-sm font-black text-white
                    shadow-[0_8px_20px_rgba(21,94,239,0.22)]
                    transition duration-300
                    group-hover:scale-105
                  "
                >
                  S
                </div>

                <div>
                  <div className="text-xl font-extrabold tracking-tight text-[#155EEF]">
                    SIMPONI
                  </div>

                  <div className="text-[9px] font-medium uppercase tracking-[0.15em] text-slate-400">
                    Admin Pemda
                  </div>
                </div>

              </div>
            </button>

          </div>

          {/* =================================================
              MENU
          ================================================== */}

          <div className="relative flex-1 px-4 py-4">

            <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Menu Utama
            </p>

            <nav className="space-y-2">

              {menuItems.map((item, index) => {
                const active = isActive(item.path);

                return (
                  <motion.button
                    key={item.path}
                    type="button"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.08 + index * 0.06,
                    }}
                    onClick={() => navigate(item.path)}
                    className={`
                      group relative flex w-full items-center gap-3
                      overflow-hidden rounded-2xl px-3 py-3
                      text-left text-sm font-medium
                      transition-all duration-300
                      ${
                        active
                          ? 'text-white'
                          : 'text-slate-600 hover:bg-white/80 hover:text-[#155EEF]'
                      }
                    `}
                  >

                    {/* Active background */}
                    {active && (
                      <motion.div
                        layoutId="admin-pemda-active-menu"
                        className="
                          absolute inset-0 rounded-2xl
                          bg-gradient-to-r
                          from-[#155EEF]
                          via-[#2563EB]
                          to-[#08A7E8]
                          shadow-[0_10px_25px_rgba(21,94,239,0.20)]
                        "
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    {/* Icon */}
                    <span
                      className={`
                        relative z-10
                        flex h-9 w-9 shrink-0
                        items-center justify-center
                        rounded-xl text-base
                        transition-all duration-300
                        ${
                          active
                            ? 'bg-white/15 text-white'
                            : 'bg-blue-50 text-[#155EEF] group-hover:bg-blue-100'
                        }
                      `}
                    >
                      {item.icon}
                    </span>

                    <span className="relative z-10">
                      {item.label}
                    </span>

                    {/* Active dot */}
                    {active && (
                      <span className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    )}

                  </motion.button>
                );
              })}

            </nav>
          </div>

          {/* =================================================
              PROFILE + LOGOUT
          ================================================== */}

          <div className="relative border-t border-blue-100/70 p-4">

            {/* Profile */}
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              onClick={() => navigate('/admin/pemda/profil')}
              className="
                mb-3 w-full rounded-2xl
                border border-blue-100/70
                bg-white/65
                p-3
                text-left
                shadow-sm
                backdrop-blur-xl
                transition-all duration-300
                hover:border-blue-200
                hover:bg-blue-50/70
              "
            >
              <div className="flex items-center gap-3">

                <div
                  className="
                    flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-gradient-to-br from-blue-100 to-cyan-100
                    font-bold text-[#155EEF]
                    ring-1 ring-blue-200/60
                  "
                >
                  {getInitial()}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {user?.full_name || 'Admin Pemda'}
                  </p>

                  <p className="truncate text-[11px] text-slate-400">
                    Administrator Pemerintah Daerah
                  </p>
                </div>

              </div>
            </motion.button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="
                group flex w-full items-center gap-3
                rounded-2xl px-3 py-3
                text-sm font-medium text-slate-500
                transition-all duration-300
                hover:bg-red-50
                hover:text-red-600
              "
            >
              <span
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-xl
                  bg-slate-100
                  text-base
                  transition
                  group-hover:bg-red-100
                "
              >
                ↪
              </span>

              <span>Keluar</span>
            </button>

          </div>

        </motion.aside>

        {/* =====================================================
            MOBILE TOP BAR
        ====================================================== */}

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="
            fixed inset-x-3 top-3 z-40
            flex h-16 items-center justify-between
            rounded-2xl
            border border-white/80
            bg-white/80
            px-4
            shadow-[0_10px_35px_rgba(37,99,235,0.10)]
            backdrop-blur-2xl
            lg:hidden
          "
        >

          <button
            type="button"
            onClick={() => navigate('/admin/pemda')}
            className="flex items-center gap-2"
          >
            <span
              className="
                flex h-9 w-9 items-center justify-center
                rounded-xl
                bg-gradient-to-br from-[#155EEF] to-[#08A7E8]
                text-sm font-black text-white
              "
            >
              S
            </span>

            <span className="font-extrabold tracking-tight text-[#155EEF]">
              SIMPONI
            </span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="
              rounded-xl
              bg-slate-100
              px-3 py-2
              text-xs font-semibold text-slate-600
              transition
              hover:bg-red-50 hover:text-red-600
            "
          >
            Keluar
          </button>

        </motion.div>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <main className="relative min-h-screen w-full lg:ml-[280px]">

          {/* Top blue ambient glow */}
          <div className="pointer-events-none absolute left-[15%] top-[-100px] h-[300px] w-[500px] rounded-full bg-blue-400/10 blur-[100px]" />

          {/* Content */}
          <div className="relative">
            {children}
          </div>

        </main>

      </div>
    </div>
  );
}