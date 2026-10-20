import { useEffect, useRef, useState } from 'react';
import Navbar from '../../components/layout/Navbar';

const kabupatenKotaJawaBarat = [
  'Kabupaten Bandung',
  'Kabupaten Bandung Barat',
  'Kabupaten Bekasi',
  'Kabupaten Bogor',
  'Kabupaten Ciamis',
  'Kabupaten Cianjur',
  'Kabupaten Cirebon',
  'Kabupaten Garut',
  'Kabupaten Indramayu',
  'Kabupaten Karawang',
  'Kabupaten Kuningan',
  'Kabupaten Majalengka',
  'Kabupaten Pangandaran',
  'Kabupaten Purwakarta',
  'Kabupaten Subang',
  'Kabupaten Sukabumi',
  'Kabupaten Sumedang',
  'Kabupaten Tasikmalaya',
  'Kota Bandung',
  'Kota Banjar',
  'Kota Bekasi',
  'Kota Bogor',
  'Kota Cimahi',
  'Kota Cirebon',
  'Kota Depok',
  'Kota Sukabumi',
  'Kota Tasikmalaya',
];

const defaultProfile = {
  name: 'Ayu Rahma',
  nik: '3273014509010001',
  email: 'ayu.rahma@email.com',
  phone: '0812-3456-7890',
  wilayah: 'Kota Bandung',
  status: 'Aktif',
  photo: '',
};

/* =========================================================
   LOGIN TERAKHIR
========================================================= */

const getLastLogin = () => {
  const saved = localStorage.getItem('simponi-last-login');

  if (!saved) {
    return 'Belum tersedia';
  }

  const date = new Date(saved);

  if (Number.isNaN(date.getTime())) {
    return 'Belum tersedia';
  }

  return (
    date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    }) + ' WIB'
  );
};

function ProfilePage() {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('simponi-user-profile');

      if (saved) {
        return {
          ...defaultProfile,
          ...JSON.parse(saved),
        };
      }
    } catch (error) {
      console.error('Gagal membaca profil:', error);
    }

    return defaultProfile;
  });

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        'simponi-user-profile',
        JSON.stringify(profile)
      );
    } catch (error) {
      console.error('Gagal menyimpan profil:', error);
    }
  }, [profile]);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE FOTO
  // =========================================================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto maksimal 2 MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      setProfile((prev) => ({
        ...prev,
        photo: event.target.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // =========================================================
  // SIMPAN
  // =========================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      localStorage.setItem(
        'simponi-user-profile',
        JSON.stringify(profile)
      );

      window.dispatchEvent(new Event('profile-updated'));

      setIsEditing(false);
    } catch (error) {
      console.error('Gagal menyimpan profil:', error);
    }
  };

  // =========================================================
  // BATAL
  // =========================================================

  const handleCancel = () => {
    setIsEditing(false);
  };

  // =========================================================
  // INITIAL
  // =========================================================

  const initials =
    profile.name
      ?.split(' ')
      .map((word) => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'AR';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f9ff] text-slate-800">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(37,99,235,0.10),transparent_28%),radial-gradient(circle_at_90%_5%,rgba(6,182,212,0.10),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(79,70,229,0.07),transparent_35%)]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '42px 42px',
          maskImage:
            'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.65) 60%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, rgba(0,0,0,0.65) 60%, transparent 100%)',
        }}
      />

      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="pointer-events-none absolute -right-40 top-32 h-[450px] w-[450px] rounded-full bg-cyan-400/10 blur-[120px]" />

      <div className="pointer-events-none absolute bottom-[-180px] left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <div className="relative z-50">
        <Navbar />
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="relative mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8 lg:pt-10">

        {/* ===================================================
            PAGE HEADER
        =================================================== */}

        <div className="mb-8">

          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span>Beranda</span>

            <span className="text-slate-300">
              /
            </span>

            <span className="font-semibold text-blue-600">
              Profil
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                Profil
              </h1>
            </div>
          </div>
        </div>

        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <div className="grid gap-6 lg:grid-cols-[350px_minmax(0,1fr)]">

          {/* =================================================
              PROFILE CARD
          ================================================= */}

          <section className="group relative overflow-hidden rounded-[30px] border border-white/80 bg-white/65 shadow-[0_20px_70px_rgba(30,64,175,0.09)] backdrop-blur-2xl">

            <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl transition-opacity duration-500 group-hover:bg-blue-500/15" />

            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-500/[0.08] to-transparent" />

            <div className="relative p-6 sm:p-7">

              {/* AVATAR */}

              <div className="flex flex-col items-center text-center">

                <div className="relative">

                  <div className="absolute -inset-2 rounded-[35px] bg-gradient-to-br from-blue-500/30 via-cyan-400/20 to-indigo-500/30 blur-md" />

                  <div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-[30px] border-[5px] border-white bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 text-4xl font-black text-white shadow-[0_18px_45px_rgba(37,99,235,0.25)]">

                    {profile.photo ? (
                      <img
                        src={profile.photo}
                        alt="Foto profil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}

                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 flex h-11 w-11 items-center justify-center rounded-2xl border-4 border-white bg-slate-900 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-blue-600"
                    title="Ubah foto profil"
                  >
                    <svg
                      className="h-4.5 w-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 7h3l2-3h6l2 3h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2z"
                      />
                      <circle
                        cx="12"
                        cy="13"
                        r="3"
                      />
                    </svg>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                <h2 className="mt-6 text-xl font-black tracking-tight text-slate-900">
                  {profile.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Masyarakat Jawa Barat
                </p>

              </div>

              <div className="my-7 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              {/* CONTACT INFORMATION */}

              <div className="space-y-3">

                {/* EMAIL */}

                <div className="group/item rounded-2xl border border-slate-100 bg-white/60 p-3.5 transition-all duration-300 hover:border-blue-100 hover:bg-blue-50/40">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-transform duration-300 group-hover/item:scale-105">
                      <svg
                        className="h-4.5 w-4.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 7l9 6 9-6"
                        />

                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                        />
                      </svg>
                    </div>

                    <div className="min-w-0">

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Email
                      </p>

                      <p className="mt-0.5 truncate text-sm font-semibold text-slate-700">
                        {profile.email}
                      </p>

                    </div>

                  </div>
                </div>

                {/* PHONE */}

                <div className="group/item rounded-2xl border border-slate-100 bg-white/60 p-3.5 transition-all duration-300 hover:border-cyan-100 hover:bg-cyan-50/40">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition-transform duration-300 group-hover/item:scale-105">
                      <svg
                        className="h-4.5 w-4.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 4h4l2 5-2.5 1.5a16 16 0 007 7L17 15l5 2v3a2 2 0 01-2 2C10.163 22 2 13.837 2 4a2 2 0 012-2h1z"
                        />
                      </svg>
                    </div>

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Nomor Telepon
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-slate-700">
                        {profile.phone}
                      </p>

                    </div>

                  </div>
                </div>

                {/* LAST LOGIN */}

                <div className="group/item rounded-2xl border border-slate-100 bg-white/60 p-3.5 transition-all duration-300 hover:border-indigo-100 hover:bg-indigo-50/40">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform duration-300 group-hover/item:scale-105">

                      <svg
                        className="h-4.5 w-4.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 7v5l3 2"
                        />

                      </svg>

                    </div>

                    <div>

                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Login Terakhir
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-slate-700">
                        {getLastLogin()}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* PHOTO INFO */}

              <div className="mt-5 rounded-2xl border border-blue-100/80 bg-gradient-to-br from-blue-50/80 to-cyan-50/60 p-4">

                <div className="flex gap-3">

                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">

                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16h.01"
                      />

                    </svg>

                  </div>

                  <div>

                    <p className="text-xs font-bold text-slate-700">
                      Foto profil
                    </p>

                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                      JPG, PNG, atau WEBP dengan ukuran maksimal 2 MB.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              ACCOUNT INFORMATION
          ================================================= */}

          <section className="group relative overflow-hidden rounded-[30px] border border-white/80 bg-white/65 shadow-[0_20px_70px_rgba(30,64,175,0.09)] backdrop-blur-2xl">

            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/[0.07] blur-3xl transition-all duration-500 group-hover:bg-blue-500/[0.10]" />

            <div className="relative p-6 sm:p-8">

              {/* HEADER */}

              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <div className="mb-2 flex items-center gap-2">

                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">

                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-1.8 1.8-.06-.06a1.7 1.7 0 00-1.88-.34 1.7 1.7 0 00-1.03 1.56V20h-2.55v-.1a1.7 1.7 0 00-1.03-1.56 1.7 1.7 0 00-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 008.1 15a1.7 1.7 0 00-1.56-1.03H6V11.4h.1A1.7 1.7 0 007.66 10a1.7 1.7 0 00-.34-1.88l-.06-.06 1.8-1.8.06.06A1.7 1.7 0 0011 6a1.7 1.7 0 001.03-1.56V4h2.55v.1A1.7 1.7 0 0015.6 5.66a1.7 1.7 0 001.88-.34l.06-.06 1.8 1.8-.06.06A1.7 1.7 0 0018.94 9c.22.64.82 1.07 1.5 1.07h.1v2.55h-.1A1.7 1.7 0 0019.4 15z"
                        />

                      </svg>

                    </div>

                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
                      Account Settings
                    </span>

                  </div>

                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    Informasi Akun
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Kelola informasi pribadi dan domisili akun Anda.
                  </p>

                </div>

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="group/button inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-600 hover:shadow-xl"
                  >

                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover/button:-rotate-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 20h9"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 3.5a2.121 2.121 0 013 3L8 18l-4 1 1-4L16.5 3.5z"
                      />

                    </svg>

                    Edit Profil

                  </button>
                )}

              </div>

              {/* FORM */}

              <form onSubmit={handleSubmit}>

                {/* IDENTITAS */}

                <div className="mb-8">

                  <div className="mb-5 flex items-center gap-3">

                    <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Identitas Pribadi
                    </span>

                    <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />

                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">

                    {/* Nama */}

                    <div>

                      <label className="mb-2 block text-xs font-bold text-slate-600">
                        Nama Lengkap
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-medium outline-none transition-all duration-300 ${
                          isEditing
                            ? 'border-blue-200 bg-white/90 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                            : 'border-slate-100 bg-slate-50/60 text-slate-600'
                        }`}
                      />

                    </div>

                    {/* NIK */}

                    <div>

                      <label className="mb-2 block text-xs font-bold text-slate-600">
                        NIK
                      </label>

                      <div className="relative">

                        <input
                          type="text"
                          name="nik"
                          value={profile.nik}
                          disabled
                          className="w-full rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3.5 pr-11 text-sm font-medium tracking-wide text-slate-500"
                        />

                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">

                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <rect
                              x="3"
                              y="5"
                              width="18"
                              height="14"
                              rx="2"
                            />

                            <path d="M7 9h.01M11 9h6M7 13h.01M11 13h6" />

                          </svg>

                        </div>

                      </div>

                      <p className="mt-1.5 text-[10px] text-slate-400">
                        NIK tidak dapat diubah.
                      </p>

                    </div>

                    {/* EMAIL */}

                    <div>

                      <label className="mb-2 block text-xs font-bold text-slate-600">
                        Alamat Email
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-medium outline-none transition-all duration-300 ${
                          isEditing
                            ? 'border-blue-200 bg-white/90 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                            : 'border-slate-100 bg-slate-50/60 text-slate-600'
                        }`}
                      />

                    </div>

                    {/* PHONE */}

                    <div>

                      <label className="mb-2 block text-xs font-bold text-slate-600">
                        Nomor Telepon
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-medium outline-none transition-all duration-300 ${
                          isEditing
                            ? 'border-blue-200 bg-white/90 text-slate-800 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                            : 'border-slate-100 bg-slate-50/60 text-slate-600'
                        }`}
                      />

                    </div>

                  </div>
                </div>

                {/* DOMISILI */}

                <div className="mb-8">

                  <div className="mb-5 flex items-center gap-3">

                    <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Domisili
                    </span>

                    <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />

                  </div>

                  <div className="rounded-2xl border border-blue-100/80 bg-gradient-to-br from-blue-50/70 via-white/60 to-cyan-50/50 p-4 sm:p-5">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">

                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 21s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z"
                            />

                            <circle
                              cx="12"
                              cy="9"
                              r="2.5"
                            />

                          </svg>

                        </div>

                        <div>

                          <p className="text-xs font-bold text-slate-500">
                            Kabupaten / Kota
                          </p>

                          <p className="mt-0.5 text-sm font-black text-slate-800">
                            Domisili Terdaftar
                          </p>

                        </div>

                      </div>

                      <div className="sm:min-w-[260px]">

                        <select
                          name="wilayah"
                          value={profile.wilayah}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className={`w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition-all duration-300 ${
                            isEditing
                              ? 'border-blue-200 bg-white text-slate-700 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                              : 'border-white bg-white/60 text-slate-600'
                          }`}
                        >

                          {kabupatenKotaJawaBarat.map((wilayah) => (
                            <option
                              key={wilayah}
                              value={wilayah}
                            >
                              {wilayah}
                            </option>
                          ))}

                        </select>

                      </div>

                    </div>

                    <div className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-slate-400">

                      <svg
                        className="mt-0.5 h-3.5 w-3.5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8v4"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 16h.01"
                        />

                      </svg>

                      Wilayah digunakan untuk menentukan cakupan laporan berdasarkan domisili Anda.

                    </div>

                  </div>

                </div>

                {/* STATUS AKUN */}

                <div className="mb-8">

                  <div className="mb-5 flex items-center gap-3">

                    <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Status Akun
                    </span>

                    <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent" />

                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">

                    {/* STATUS */}

                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">

                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12l2 2 4-4"
                            />

                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                            />

                          </svg>

                        </div>

                        <div>

                          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/70">
                            Status Akun
                          </p>

                          <p className="text-sm font-black text-emerald-700">
                            {profile.status}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* LAST LOGIN */}

                    <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">

                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.8"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                            />

                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 7v5l3 2"
                            />

                          </svg>

                        </div>

                        <div className="min-w-0">

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Login Terakhir
                          </p>

                          <p className="truncate text-sm font-bold text-slate-700">
                            {getLastLogin()}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                {/* ACTION */}

                {isEditing && (
                  <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">

                    <button
                      type="button"
                      onClick={handleCancel}
                      className="rounded-2xl border border-slate-200 bg-white/70 px-5 py-3 text-sm font-bold text-slate-600 transition-all duration-300 hover:border-slate-300 hover:bg-white"
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      className="group/save inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/25"
                    >

                      <svg
                        className="h-4 w-4 transition-transform duration-300 group-hover/save:scale-110"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />

                      </svg>

                      Simpan Perubahan

                    </button>

                  </div>
                )}

              </form>

              {/* SECURITY NOTE */}

              <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3.5">

                <div className="flex items-center gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">

                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 3l7 4v5c0 4.5-3 7.8-7 9-4-1.2-7-4.5-7-9V7l7-4z"
                      />

                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4"
                      />

                    </svg>

                  </div>

                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Data profil Anda disimpan secara lokal pada perangkat
                    dan digunakan untuk kebutuhan akun SIMPONI.
                  </p>

                </div>

              </div>

            </div>

          </section>

        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-200/60 pt-5 text-center text-[11px] text-slate-400 sm:flex-row sm:text-left">

          <p>
            © 2026 SIMPONI — Sistem Informasi Pelaporan Pernikahan Dini
          </p>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>Sistem berjalan normal</span>
          </div>

        </footer>

      </main>

    </div>
  );
}

export default ProfilePage;