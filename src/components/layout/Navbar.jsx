import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { label: 'Beranda', to: '/' },
  { label: 'Data', to: '/data' },
  {
    label: 'Layanan',
    hasDropdown: true,
    items: [
      { label: 'Pelaporan Kasus', to: '/pelaporan' },
      { label: 'Tracking Laporan', to: '/tracking' },
    ],
  },
  { label: 'Kontak', to: '/contact' },
];

const defaultUserProfile = {
  name: 'Ayu Rahma',
  role: 'Petugas SIMPONI',
  initials: 'AR',
  email: 'ayu.rahma@simpani.go.id',
  phone: '0812-3456-7890',
  unit: 'Dinas Pemberdayaan Perempuan & Perlindungan Anak',
  wilayah: 'Kota Bandung',
  kodeWilayah: '32.73',
};

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('simponi-user-logged-in');
    return saved ? JSON.parse(saved) : false;
  });
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);

  const savedProfile = localStorage.getItem('simponi-user-profile');
  const user = savedProfile ? { ...defaultUserProfile, ...JSON.parse(savedProfile) } : defaultUserProfile;

  useEffect(() => {
    localStorage.setItem('simponi-user-logged-in', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  return (
    <header className="absolute left-0 top-6 z-50 w-full">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <nav className="flex h-20 items-center justify-between rounded-full border border-sky-200/70 bg-[linear-gradient(135deg,rgba(214,245,255,0.85),rgba(255,255,255,0.72),rgba(232,245,255,0.8))] px-5 shadow-[0_10px_30px_rgba(59,130,246,0.12)] backdrop-blur-xl sm:px-8">
          <div>
            <NavLink to="/" className="block transition hover:opacity-90">
              <h1 className="text-2xl font-bold tracking-tight text-blue-700">SIMPONI</h1>
              <p className="text-[11px] tracking-wide text-slate-500">Sistem Informasi Pemerintah Digital</p>
            </NavLink>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {menuItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setIsServiceMenuOpen(true)}
                    onMouseLeave={() => setIsServiceMenuOpen(false)}
                  >
                    <button
                      type="button"
                      aria-expanded={isServiceMenuOpen}
                      className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:text-blue-600"
                    >
                      <span>{item.label}</span>
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${isServiceMenuOpen ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M5.25 7.5 10 12.25 14.75 7.5H5.25Z" />
                      </svg>
                    </button>

                    {isServiceMenuOpen && (
                      <div className="absolute left-0 top-full pt-3">
                        <div className="w-56 overflow-hidden rounded-2xl border border-sky-100 bg-white/95 p-2 shadow-[0_25px_60px_rgba(37,99,235,0.15)] backdrop-blur-xl">
                          {item.items.map((subItem) => (
                            <NavLink
                              key={subItem.label}
                              to={subItem.to}
                              onClick={() => setIsServiceMenuOpen(false)}
                              className={({ isActive }) =>
                                `block rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                                  isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-slate-700 hover:bg-sky-50 hover:text-blue-600'
                                }`
                              }
                            >
                              {subItem.label}
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          {isLoggedIn ? (
            <NavLink to="/profile" className="flex items-center gap-3 rounded-full border border-blue-100 bg-blue-50/80 px-2 py-1.5 shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-100/80">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-md shadow-blue-300/40">
                {user.initials}
              </div>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{user.role}</p>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  setIsLoggedIn(false);
                }}
                className="hidden rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 sm:inline-flex"
              >
                Keluar
              </button>
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-300/40 transition hover:scale-[1.02] hover:shadow-blue-300/50"
            >
              Masuk
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}