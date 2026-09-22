import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const defaultProfile = {
  name: 'Ayu Rahma',
  role: 'Petugas SIMPONI',
  initials: 'AR',
  email: 'ayu.rahma@simpani.go.id',
  phone: '0812-3456-7890',
  unit: 'Dinas Pemberdayaan Perempuan & Perlindungan Anak',
  wilayah: 'Kota Bandung',
  kodeWilayah: '32.73',
  status: 'Aktif',
  lastLogin: '19 Sep 2026, 09:14 WIB',
  bio: 'Mengelola pengawasan laporan perlindungan anak dan memastikan data wilayah berjalan sesuai SOP.',
};

const fieldGroups = {
  personal: [
    { key: 'name', label: 'Nama lengkap', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'phone', label: 'Nomor HP', type: 'text' },
    { key: 'role', label: 'Role', type: 'text' },
  ],
  work: [
    { key: 'unit', label: 'Unit kerja', type: 'text' },
    { key: 'wilayah', label: 'Wilayah', type: 'text' },
    { key: 'kodeWilayah', label: 'Kode wilayah', type: 'text' },
    { key: 'status', label: 'Status akun', type: 'text' },
  ],
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('simponi-user-profile');
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('simponi-user-profile', JSON.stringify(profile));
  }, [profile]);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#edf5ff_0%,#f8fbff_30%,#ffffff_100%)] px-4 py-10 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#155DFC]">Profil</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.06em] text-slate-900 md:text-4xl">Pengaturan akun pengguna</h1>
          </div>

          <Link
            to="/"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Kembali
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <aside className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.04)]">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-3xl font-black text-white shadow-[0_18px_30px_rgba(37,99,235,0.25)]">
                {profile.initials}
              </div>

              <h2 className="mt-5 text-2xl font-black text-slate-900">{profile.name}</h2>
              <p className="mt-1 text-sm font-medium text-blue-700">{profile.role}</p>

              <div className="mt-5 w-full rounded-[22px] bg-blue-50 p-4 text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Status akun</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{profile.status}</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Email</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{profile.email}</p>
              </div>
              <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Nomor HP</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{profile.phone}</p>
              </div>
              <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Login terakhir</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{profile.lastLogin}</p>
              </div>
            </div>
          </aside>

          <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Detail akun</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">Profil pengguna</h2>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
                className="rounded-full bg-[linear-gradient(135deg,#155DFC_0%,#2f7bff_100%)] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(21,93,252,0.3)] transition hover:scale-[1.01]"
              >
                {isEditing ? 'Batal' : 'Edit profil'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {fieldGroups.personal.map((field) => (
                  <div key={field.key}>
                    <label className="mb-2 block text-sm font-medium text-slate-700">{field.label}</label>
                    <input
                      type={field.type}
                      value={profile[field.key] || ''}
                      onChange={(event) => handleChange(field.key, event.target.value)}
                      disabled={!isEditing}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10 disabled:cursor-not-allowed disabled:opacity-80"
                    />
                  </div>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {fieldGroups.work.map((field) => (
                  <div key={field.key}>
                    <label className="mb-2 block text-sm font-medium text-slate-700">{field.label}</label>
                    <input
                      type={field.type}
                      value={profile[field.key] || ''}
                      onChange={(event) => handleChange(field.key, event.target.value)}
                      disabled={!isEditing}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10 disabled:cursor-not-allowed disabled:opacity-80"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Deskripsi singkat</label>
                <textarea
                  rows="4"
                  value={profile.bio}
                  onChange={(event) => handleChange('bio', event.target.value)}
                  disabled={!isEditing}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10 disabled:cursor-not-allowed disabled:opacity-80"
                />
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="rounded-full bg-[linear-gradient(135deg,#10b981_0%,#059669_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(16,185,129,0.28)] transition hover:scale-[1.01]"
                  >
                    Simpan perubahan
                  </button>
                </div>
              )}
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
