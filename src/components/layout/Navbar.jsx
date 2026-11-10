import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const getMenuItems = (user, logout) => {
  const baseItems = [
    { label: 'Beranda', to: '/' },
    {
      label: 'Layanan',
      hasDropdown: true,
      items: [
        { label: 'Pelaporan Kasus', to: '/pelaporan' },
        { label: 'Tracking Laporan', to: '/tracking' },
      ],
    },
    { label: 'Statistik', to: '/statistik' },
    { label: 'Kontak', to: '/contact' },
  ];

  if (!user) {
    return [
      ...baseItems,
      { label: 'Masuk', to: '/login', isAuthLink: true },
    ];
  }

  const roleMenus = {
    public: [
      {
        label: 'Layanan',
        hasDropdown: true,
        items: [
          { label: 'Pelaporan Kasus', to: '/pelaporan' },
          { label: 'Tracking Laporan', to: '/tracking' },
        ],
      },
      { label: 'Statistik', to: '/statistik' },
    ],
    admin_pemda: [{ label: 'Data', to: '/data' }],
    admin_pemprov: [{ label: 'Data Provinsi', to: '/data-provinsi' }],
  };

  return [
    ...baseItems,
    ...(roleMenus[user.role] || []),
    {
      label: user.name || user.full_name || 'Pengguna',
      hasDropdown: true,
      isUserMenu: true,
      items: [
        { label: 'Profil', to: '/profile' },
        { label: 'Keluar', action: logout },
      ],
    },
  ];
};

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = location.pathname === '/';
  const isSolidNavbar = !isHomePage || isScrolled;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const loadProfilePhoto = () => {
      const savedProfile = localStorage.getItem('simponi-user-profile');

      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          setProfilePhoto(profile.photo || null);
        } catch (error) {
          console.error('Gagal membaca foto profil:', error);
        }
      }
    };

    loadProfilePhoto();
    window.addEventListener('profile-updated', loadProfilePhoto);

    return () => {
      window.removeEventListener('profile-updated', loadProfilePhoto);
    };
  }, []);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
    logout();
    navigate('/');
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsServiceMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const menuItems = getMenuItems(isAuthenticated ? user : null, handleLogout);
  const isTopState = !isSolidNavbar;

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-300 ease-in-out ${
        isTopState
          ? 'border-b border-transparent bg-transparent shadow-none'
          : 'border-b border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]'
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-5 transition-colors duration-300 ease-in-out sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <NavLink to="/" onClick={closeMobileMenu} className="flex items-center gap-3 transition hover:opacity-90">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-bold shadow-sm transition-colors duration-300 ${
                isTopState ? 'border-white/30 bg-white/10 text-white' : 'border-slate-200 bg-slate-900 text-white'
              }`}
            >
              S
            </div>
            <div>
              <h1 className={`text-xl font-bold tracking-tight sm:text-2xl transition-colors duration-300 ${isTopState ? 'text-white' : 'text-[#111827]'}`}>
                SIMPONI
              </h1>
            </div>
          </NavLink>
        </div>

        <div className="hidden items-center gap-1 lg:flex">
          {menuItems.map((item) => {
            if (item.hasDropdown) {
              const isUserMenu = item.isUserMenu;
              const openState = isUserMenu ? isUserMenuOpen : isServiceMenuOpen;
              const setOpenState = isUserMenu ? setIsUserMenuOpen : setIsServiceMenuOpen;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenState(true)}
                  onMouseLeave={() => setOpenState(false)}
                >
                  <button
                    type="button"
                    aria-expanded={openState}
                    className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                      isTopState ? 'text-white hover:bg-white/10' : 'text-[#111827] hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>

                    {!isUserMenu && (
                      <svg
                        className={`h-4 w-4 transition-transform duration-200 ${openState ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M5.25 7.5 10 12.25 14.75 7.5H5.25Z" />
                      </svg>
                    )}

                    {isUserMenu && (
                      <div className={`h-8 w-8 overflow-hidden rounded-full border bg-gradient-to-br from-sky-500 to-blue-600 text-sm font-semibold text-white shadow-sm transition-colors duration-300 ${isTopState ? 'border-white/30' : 'border-slate-200'}`}>
                        {profilePhoto ? (
                          <img src={profilePhoto} alt="Foto profil" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            {(user?.name || user?.full_name || 'U')[0].toUpperCase()}
                          </div>
                        )}
                      </div>
                    )}
                  </button>

                  {openState && (
                    <div className="absolute left-0 top-full pt-3">
                      <div
                        className={`overflow-hidden rounded-xl border p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)] ${
                          isTopState
                            ? 'border-white/10 bg-[#0f172a]/90 text-slate-200'
                            : 'border-slate-200 bg-white text-slate-700'
                        } ${isUserMenu ? 'w-48' : 'w-56'}`}
                      >
                        {item.items.map((menu) =>
                          menu.action ? (
                            <button
                              key={menu.label}
                              type="button"
                              onClick={() => {
                                menu.action();
                                setOpenState(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                                isTopState ? 'text-slate-200 hover:bg-white/5 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                            >
                              {menu.label}
                            </button>
                          ) : (
                            <NavLink
                              key={menu.label}
                              to={menu.to}
                              onClick={() => setOpenState(false)}
                              className={`block rounded-lg px-3 py-2 text-sm transition ${
                                isTopState ? 'text-slate-200 hover:bg-white/5 hover:text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                            >
                              {menu.label}
                            </NavLink>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            if (item.isAuthLink) {
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {item.label}
                </NavLink>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? isTopState
                        ? 'bg-white/10 text-white'
                        : 'bg-slate-100 text-[#111827]'
                      : isTopState
                        ? 'text-white hover:bg-white/10'
                        : 'text-[#111827] hover:bg-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            );
          })}

         
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => navigate('/pelaporan')}
            className="inline-flex items-center gap-2 rounded-full bg-[#d92d2d] px-3 py-2 text-xs font-semibold text-white shadow-[0_10px_25px_rgba(217,45,45,0.35)]"
          >
            Emergency
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-300 ${
              isTopState ? 'border-white/20 bg-white/5 text-white' : 'border-slate-200 bg-white text-slate-900'
            }`}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path d="M3 5h14v2H3V5zm0 6h14v2H3v-2zm0 6h14v2H3v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={`border-t px-4 py-3 shadow-sm lg:hidden transition-colors duration-300 ${isTopState ? 'border-white/10 bg-[#0f172a]/90' : 'border-slate-200 bg-white'}`}>
          <div className="mx-auto max-w-[1200px] space-y-2">
            {menuItems.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div
                    key={item.label}
                    className={`rounded-lg border px-3 py-2 ${isTopState ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}
                  >
                    <div className={`mb-2 font-medium ${isTopState ? 'text-white/90' : 'text-[#111827]'}`}>{item.label}</div>
                    {item.items.map((subItem) => (
                      <NavLink
                        key={subItem.label}
                        to={subItem.to}
                        onClick={closeMobileMenu}
                        className={`block rounded-md px-2 py-2 text-sm ${isTopState ? 'text-slate-200 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-100'}`}
                      >
                        {subItem.label}
                      </NavLink>
                    ))}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={closeMobileMenu}
                  className={`block rounded-lg px-3 py-2 text-sm ${isTopState ? 'text-white hover:bg-white/5' : 'text-[#111827] hover:bg-slate-100'}`}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
