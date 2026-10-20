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
  {
    label: 'Data Provinsi',
    path: '/data-provinsi',
    icon: '◫',
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
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-slate-200 bg-white lg:flex lg:flex-col">

          {/* Logo */}
          <div className="flex h-[88px] items-center px-7">
            <button
              type="button"
              onClick={() => navigate('/admin/pemprov')}
              className="text-left"
            >
              <div className="text-xl font-extrabold tracking-tight text-[#0164DD]">
                SIMPONI
              </div>

              <div className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                Admin Pemprov
              </div>
            </button>
          </div>

          {/* Menu */}
          <div className="flex-1 px-4 py-4">
            <p className="px-4 pb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
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
                        ? 'bg-[#0164DD] text-white shadow-[0_8px_20px_rgba(1,100,221,0.18)]'
                        : 'text-slate-600 hover:bg-blue-50 hover:text-[#0164DD]'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${
                        active
                          ? 'bg-white/15 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-[#0164DD]'
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
          <div className="border-t border-slate-100 p-4">
            <div className="mb-3 rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-[#0164DD]">
                  {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {user?.full_name || 'Admin Pemprov'}
                  </p>

                  <p className="truncate text-xs text-slate-400">
                    Admin Pemprov
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-base">
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