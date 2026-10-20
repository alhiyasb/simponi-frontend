import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const getMenuItems = (user, logout) => {
  const baseItems = [
    { label: 'Beranda', to: '/' },
    { label: 'Kontak', to: '/contact' },
  ];

  if (!user) {
    return [
      ...baseItems,
      {
        label: 'Layanan',
        hasDropdown: true,
        items: [
          { label: 'Pelaporan Kasus', to: '/pelaporan' },
          { label: 'Tracking Laporan', to: '/tracking' },
        ],
      },
      { label: 'Statistik', to: '/statistik' },
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

    admin_pemda: [
      { label: 'Data', to: '/data' },
    ],

    admin_pemprov: [
      { label: 'Data Provinsi', to: '/data-provinsi' },
    ],
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

  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ================================
  // FOTO PROFIL
  // ================================
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    const loadProfilePhoto = () => {
      const savedProfile = localStorage.getItem(
        'simponi-user-profile'
      );

      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);

          setProfilePhoto(profile.photo || null);
        } catch (error) {
          console.error(
            'Gagal membaca foto profil:',
            error
          );
        }
      }
    };

    loadProfilePhoto();

    window.addEventListener(
      'profile-updated',
      loadProfilePhoto
    );

    return () => {
      window.removeEventListener(
        'profile-updated',
        loadProfilePhoto
      );
    };
  }, []);

  // ================================
  // LOGOUT
  // ================================
  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);

    logout();
    navigate('/');
  };

  // ================================
  // TUTUP MOBILE MENU
  // ================================
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsServiceMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const menuItems = getMenuItems(
    isAuthenticated ? user : null,
    handleLogout
  );

  return (
    <header className="absolute left-0 top-6 z-50 w-full">
      <div className="mx-auto w-full max-w-[1520px] px-4 sm:px-6 lg:px-8">

        {/* ==================================================
            NAVBAR UTAMA
        ================================================== */}
        <nav className="relative flex min-h-20 w-full items-center justify-between rounded-full border border-white/70 bg-[linear-gradient(135deg,rgba(220,242,255,0.78),rgba(255,255,255,0.62),rgba(225,242,255,0.72))] px-5 py-3 shadow-[0_15px_45px_rgba(37,99,235,0.16)] backdrop-blur-2xl sm:px-9 lg:h-20 lg:px-10">

          {/* ==================================================
              LOGO SIMPONI
          ================================================== */}
          <div className="shrink-0">
            <NavLink
              to="/"
              onClick={closeMobileMenu}
              className="block transition hover:opacity-90"
            >
              <h1 className="text-2xl font-bold tracking-tight text-blue-700">
                SIMPONI
              </h1>

              <p className="hidden text-[11px] tracking-wide text-slate-500 sm:block">
                Sistem Informasi Pemerintah Digital
              </p>
            </NavLink>
          </div>

          {/* ==================================================
              MENU DESKTOP
              Hanya tampil mulai ukuran lg
          ================================================== */}
          <div className="hidden items-center gap-2 lg:flex">

            {menuItems.map((item) => {

              // ==================================================
              // MENU DROPDOWN DESKTOP
              // ==================================================
              if (item.hasDropdown) {

                const isUserMenu = item.isUserMenu;

                const openState = isUserMenu
                  ? isUserMenuOpen
                  : isServiceMenuOpen;

                const setOpenState = isUserMenu
                  ? setIsUserMenuOpen
                  : setIsServiceMenuOpen;

                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() =>
                      setOpenState(true)
                    }
                    onMouseLeave={() =>
                      setOpenState(false)
                    }
                  >

                    <button
                      type="button"
                      aria-expanded={openState}
                      className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-100 hover:text-blue-600"
                    >

                      <span>
                        {item.label}
                      </span>

                      {/* PANAH LAYANAN */}
                      {!isUserMenu && (
                        <svg
                          className={`h-4 w-4 transition-transform duration-200 ${
                            openState
                              ? 'rotate-180'
                              : ''
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M5.25 7.5 10 12.25 14.75 7.5H5.25Z" />
                        </svg>
                      )}

                      {/* FOTO PROFIL */}
                      {isUserMenu && (
                        <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-md shadow-blue-300/40">

                          {profilePhoto ? (
                            <img
                              src={profilePhoto}
                              alt="Foto profil"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              {(
                                user?.name ||
                                user?.full_name ||
                                'U'
                              )[0].toUpperCase()}
                            </div>
                          )}

                        </div>
                      )}

                    </button>

                    {/* DROPDOWN DESKTOP */}
                    {openState && (
                      <div className="absolute left-0 top-full pt-3">

                        <div
                          className={`overflow-hidden rounded-2xl border border-sky-100 bg-white/95 p-2 shadow-[0_25px_60px_rgba(37,99,235,0.15)] backdrop-blur-xl ${
                            isUserMenu
                              ? 'w-48'
                              : 'w-56'
                          }`}
                        >

                          {item.items.map((subItem) => (

                            subItem.action ? (

                              <button
                                key={subItem.label}
                                type="button"
                                onClick={() => {
                                  setOpenState(false);
                                  subItem.action();
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                              >

                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                  />
                                </svg>

                                {subItem.label}

                              </button>

                            ) : (

                              <NavLink
                                key={subItem.label}
                                to={subItem.to}
                                onClick={() =>
                                  setOpenState(false)
                                }
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

                            )

                          ))}

                        </div>
                      </div>
                    )}

                  </div>
                );
              }

              // ==================================================
              // TOMBOL MASUK
              // ==================================================
              if (item.isAuthLink) {
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-300/40 transition hover:scale-[1.02] hover:shadow-blue-300/50"
                  >
                    {item.label}
                  </NavLink>
                );
              }

              // ==================================================
              // MENU BIASA
              // ==================================================
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

          {/* ==================================================
              HAMBURGER MOBILE
              Hanya tampil di bawah lg
          ================================================== */}
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(
                !isMobileMenuOpen
              );

              setIsServiceMenuOpen(false);
              setIsUserMenuOpen(false);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm ring-1 ring-white/80 transition hover:bg-white hover:text-blue-600 lg:hidden"
            aria-label={
              isMobileMenuOpen
                ? 'Tutup menu'
                : 'Buka menu'
            }
            aria-expanded={isMobileMenuOpen}
          >

            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}

          </button>

          {/* ==================================================
              MOBILE MENU
          ================================================== */}
          {isMobileMenuOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+12px)] overflow-hidden rounded-3xl border border-white/70 bg-white/95 p-3 shadow-[0_20px_50px_rgba(37,99,235,0.18)] backdrop-blur-2xl lg:hidden">

              {menuItems.map((item) => {

                // ==================================================
                // DROPDOWN MOBILE
                // ==================================================
                if (item.hasDropdown) {

                  const isUserMenu = item.isUserMenu;

                  const openState = isUserMenu
                    ? isUserMenuOpen
                    : isServiceMenuOpen;

                  const setOpenState = isUserMenu
                    ? setIsUserMenuOpen
                    : setIsServiceMenuOpen;

                  return (
                    <div
                      key={item.label}
                      className="border-b border-slate-100 last:border-b-0"
                    >

                      {/* HEADER DROPDOWN MOBILE */}
                      <button
                        type="button"
                        onClick={() =>
                          setOpenState(
                            !openState
                          )
                        }
                        className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-sky-50 hover:text-blue-600"
                      >

                        <div className="flex items-center gap-3">

                          {/* FOTO USER MOBILE */}
                          {isUserMenu && (
                            <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-blue-600 to-cyan-500 text-sm font-bold text-white shadow-md">

                              {profilePhoto ? (
                                <img
                                  src={profilePhoto}
                                  alt="Foto profil"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  {(
                                    user?.name ||
                                    user?.full_name ||
                                    'U'
                                  )[0].toUpperCase()}
                                </div>
                              )}

                            </div>
                          )}

                          <span>
                            {item.label}
                          </span>

                        </div>

                        <svg
                          className={`h-4 w-4 transition-transform duration-200 ${
                            openState
                              ? 'rotate-180'
                              : ''
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M5.25 7.5 10 12.25 14.75 7.5H5.25Z" />
                        </svg>

                      </button>

                      {/* ISI DROPDOWN MOBILE */}
                      {openState && (
                        <div className="mb-2 ml-3 space-y-1 border-l-2 border-blue-100 pl-3">

                          {item.items.map(
                            (subItem) => (

                              subItem.action ? (

                                <button
                                  key={subItem.label}
                                  type="button"
                                  onClick={
                                    subItem.action
                                  }
                                  className="flex w-full items-center rounded-xl px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                                >
                                  {subItem.label}
                                </button>

                              ) : (

                                <NavLink
                                  key={subItem.label}
                                  to={subItem.to}
                                  onClick={
                                    closeMobileMenu
                                  }
                                  className={({ isActive }) =>
                                    `block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                                      isActive
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-slate-700 hover:bg-sky-50 hover:text-blue-600'
                                    }`
                                  }
                                >
                                  {subItem.label}
                                </NavLink>

                              )

                            )
                          )}

                        </div>
                      )}

                    </div>
                  );
                }

                // ==================================================
                // TOMBOL MASUK MOBILE
                // ==================================================
                if (item.isAuthLink) {
                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      onClick={
                        closeMobileMenu
                      }
                      className="mt-2 block rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-300/30 transition hover:opacity-90"
                    >
                      {item.label}
                    </NavLink>
                  );
                }

                // ==================================================
                // MENU BIASA MOBILE
                // ==================================================
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-700 hover:bg-sky-50 hover:text-blue-600'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                );
              })}

            </div>
          )}

        </nav>
      </div>
    </header>
  );
}