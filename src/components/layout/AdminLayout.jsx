import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const menuItems = [
  {
    label: 'Dashboard',
    path: '/admin/pemprov',
    icon: '⌂',
  },
  {
    label: 'Rapor Kabupaten',
    path: '/admin/pemprov/rapor',
    icon: '▦',
  },
  {
    label: 'Manajemen Petugas',
    path: '/admin/pemprov/petugas',
    icon: '♙',
  },
  {
    label: 'Ekspor Data',
    path: '/admin/pemprov/ekspor',
    icon: '⇩',
  },
];

export default function AdminLayout({ children }) {
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
    if (path === '/admin/pemprov') {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-slate-900">
      <div className="flex min-h-screen">

        {/* =====================================================
            SIDEBAR
        ===================================================== */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-blue-200 bg-gradient-to-b from-[#0F6EE6] via-[#0E69E4] to-[#0A5BD6] text-white shadow-[8px_0_24px_rgba(10,91,214,0.18)] lg:flex lg:flex-col">

          {/* Logo */}
          <div className="flex h-[88px] items-center px-7">
            <button
              type="button"
              onClick={() => navigate('/admin/pemprov')}
              className="text-left"
            >
              <div className="text-xl font-extrabold tracking-tight text-white">
                SIMPONI
              </div>

              <div className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-blue-100">
                Admin Pemprov
              </div>
            </button>
          </div>

          {/* Menu */}
          <div className="flex-1 px-4 py-4">
            <p className="px-4 pb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-blue-100/90">
              Menu Utama
            </p>

            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const active = isActive(item.path);

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-white text-[#0A5BD6] shadow-[0_10px_24px_rgba(255,255,255,0.22)]'
                        : 'text-blue-50 hover:bg-white hover:text-[#0A5BD6]'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${
                        active
                          ? 'bg-blue-50 text-[#0A5BD6]'
                          : 'bg-white/10 text-white group-hover:bg-blue-50 group-hover:text-[#0A5BD6]'
                      }`}
                    >
                      {item.icon}
                    </span>

                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom profile */}
          <div className="border-t border-white/15 p-4">
            <button
              type="button"
              onClick={() => navigate('/admin/pemprov/profil')}
              className="mb-3 flex w-full items-center gap-3 rounded-2xl bg-white/10 p-3 text-left ring-1 ring-white/10 backdrop-blur-sm transition hover:bg-white/15"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 font-bold text-white ring-1 ring-white/15">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.full_name || 'Admin Pemprov'}
                </p>

                <p className="truncate text-xs text-blue-100">
                  Profil Admin
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-blue-50 transition hover:bg-white hover:text-[#0A5BD6]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-base text-white">
                ↪
              </span>

              Keluar
            </button>
          </div>
        </aside>

        {/* =====================================================
            MOBILE TOP BAR
        ===================================================== */}
        <div className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => navigate('/admin/pemprov')}
            className="font-extrabold tracking-tight text-[#0164DD]"
          >
            SIMPONI
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600"
          >
            Keluar
          </button>
        </div>

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}
        <main className="w-full lg:ml-[260px]">
          {children}
        </main>
      </div>
    </div>
  );
}