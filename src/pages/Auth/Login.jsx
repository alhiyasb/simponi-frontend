import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const roles = [
  {
    id: 'masyarakat',
    label: 'Masyarakat',
    badge: 'Pelapor / Warga',
    description: 'Login cepat dengan OTP dan akses laporan',
  },
  {
    id: 'pemda',
    label: 'Admin Pemda',
    badge: 'Kabupaten/Kota',
    description: 'Kelola data wilayah dan pemantauan',
  },
  {
    id: 'pemprov',
    label: 'Admin Pemprov',
    badge: 'Provinsi',
    description: 'Monitoring dan evaluasi se-provinsi',
  },
];

const featureList = [
  'Proses login lebih cepat dan jelas',
  'Akses laporan dan monitoring terstruktur',
  'Keamanan data dengan validasi 2 langkah',
];

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [selectedRole, setSelectedRole] = useState('masyarakat');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSendOtp = () => {
    if (!identifier.trim()) {
      setError('Masukkan nomor HP atau email terlebih dahulu.');
      return;
    }

    setError('');
    setIsOtpSent(true);
  };

  const navigateByRole = () => {
    if (selectedRole === 'masyarakat') {
      navigate('/pelaporan');
      return;
    }

    if (selectedRole === 'pemda') {
      navigate('/data');
      return;
    }

    navigate('/data');
  };

  const handleRegister = (event) => {
    event.preventDefault();

    if (!fullName.trim() || !registerEmail.trim() || !registerPhone.trim()) {
      setError('Nama lengkap, email, dan nomor HP wajib diisi.');
      return;
    }

    if (!registerPassword.trim() || !confirmPassword.trim()) {
      setError('Password dan konfirmasi password wajib diisi.');
      return;
    }

    if (registerPassword.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    if (!acceptedTerms) {
      setError('Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi.');
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('simponi-users') || '[]');
    const emailExists = savedUsers.some((user) => user.email.toLowerCase() === registerEmail.toLowerCase());
    const phoneExists = savedUsers.some((user) => user.phone === registerPhone);

    if (emailExists || phoneExists) {
      setError('Akun dengan email atau nomor HP ini sudah terdaftar.');
      return;
    }

    const newUser = {
      id: Date.now(),
      fullName: fullName.trim(),
      email: registerEmail.trim(),
      phone: registerPhone.trim(),
      password: registerPassword,
      role: selectedRole,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('simponi-users', JSON.stringify([...savedUsers, newUser]));
    localStorage.setItem('simponi-user-logged-in', JSON.stringify(true));
    localStorage.setItem('simponi-user-role', JSON.stringify(selectedRole));
    localStorage.setItem('simponi-user-name', JSON.stringify(newUser.fullName));

    setError('');
    setMode('login');
    setIdentifier(registerEmail);
    setPassword(registerPassword);
    setRegisterEmail('');
    setRegisterPhone('');
    setRegisterPassword('');
    setConfirmPassword('');
    setAcceptedTerms(false);
    setFullName('');
    setOtp('');
    setIsOtpSent(false);

    navigateByRole();
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (selectedRole === 'masyarakat') {
      if (!identifier.trim()) {
        setError('Nomor HP atau email wajib diisi.');
        return;
      }

      if (isOtpSent && otp.trim().length < 4) {
        setError('Kode OTP tidak valid.');
        return;
      }
    }

    if (selectedRole !== 'masyarakat' && (!identifier.trim() || !password.trim())) {
      setError('Email dinas dan password wajib diisi.');
      return;
    }

    if (selectedRole !== 'masyarakat' && (!otp.trim() || otp.trim().length < 4)) {
      setError('Kode verifikasi 2FA wajib diisi.');
      return;
    }

    const userName =
      selectedRole === 'masyarakat'
        ? 'Warga SIMPONI'
        : selectedRole === 'pemda'
          ? 'Admin Pemda'
          : 'Admin Pemprov';

    localStorage.setItem('simponi-user-logged-in', JSON.stringify(true));
    localStorage.setItem('simponi-user-role', JSON.stringify(selectedRole));
    localStorage.setItem('simponi-user-name', JSON.stringify(userName));

    navigateByRole();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.25),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(6,182,212,0.18),_transparent_26%),linear-gradient(135deg,#edf6ff_0%,#f4f8ff_28%,#eef2ff_58%,#f8fafc_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-8 h-72 w-72 rounded-full bg-[#155DFC]/12 blur-3xl" />
        <div className="absolute left-1/3 top-1/4 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-[8%] top-[12%] h-32 w-32 rounded-full border border-white/60 bg-white/20 backdrop-blur-sm" />
        <div className="absolute left-[12%] bottom-[18%] h-20 w-20 rounded-full border border-white/50 bg-blue-100/40 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:56px_56px] opacity-30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/80 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl"
      >
        <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="relative overflow-hidden bg-[linear-gradient(135deg,#155DFC_0%,#0d47d6_100%)] p-6 text-white md:p-8 lg:p-10"
          >
            <div className="absolute -left-12 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-cyan-300/15 blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-100">SIMPONI</p>
                  <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Selamat datang</h1>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg shadow-blue-950/10">
                  <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current text-white" aria-hidden="true">
                    <path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Zm0 9.5A2.5 2.5 0 1 0 12 6a2.5 2.5 0 0 0 0 5.5Z" />
                  </svg>
                </div>
              </div>

              <p className="mt-5 max-w-md text-sm leading-7 text-blue-50 md:text-base">
                Sistem Informasi Pelaporan dan Monitoring untuk mendukung penanganan kasus secara cepat, aman, dan terdokumentasi dengan baik.
              </p>

              <div className="mt-8 grid gap-3">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role.id);
                      setError('');
                    }}
                    className={`flex w-full items-center justify-between rounded-[22px] border p-4 text-left transition-all duration-200 ${
                      selectedRole === role.id
                        ? 'border-white/60 bg-white/12 shadow-[0_18px_36px_rgba(15,23,42,0.12)]'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                    }`}
                  >
                    <div>
                      <p className="text-base font-bold text-white">{role.label}</p>
                      <p className="mt-1 text-sm text-blue-100">{role.description}</p>
                    </div>
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                      {role.badge}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-8 rounded-[24px] border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">Keunggulan</p>
                <ul className="mt-4 space-y-3 text-sm text-blue-50">
                  {featureList.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/20 text-xs text-emerald-200">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="bg-white p-6 md:p-8 lg:p-10"
          >
            <div className="mb-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#155DFC]">Autentikasi</p>
                  <h2 className="mt-3 text-3xl font-black text-slate-800">
                    {mode === 'login'
                      ? selectedRole === 'masyarakat'
                        ? 'Login Masyarakat'
                        : selectedRole === 'pemda'
                          ? 'Login Admin Pemda'
                          : 'Login Admin Pemprov'
                      : 'Buat Akun Baru'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
                    setError('');
                  }}
                  className="rounded-full border border-[#155DFC]/20 bg-[#155DFC]/5 px-3 py-1.5 text-xs font-semibold text-[#155DFC] transition hover:bg-[#155DFC]/10"
                >
                  {mode === 'login' ? 'Daftar' : 'Masuk'}
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                {mode === 'login'
                  ? selectedRole === 'masyarakat'
                    ? 'Masuk untuk mengajukan dan memantau laporan Anda.'
                    : 'Masuk dengan akun resmi untuk mengelola data dan dashboard.'
                  : 'Lengkapi data di bawah ini untuk membuat akun baru.'}
              </p>
            </div>

            {mode === 'register' ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Nama lengkap</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Masukkan nama lengkap"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(event) => setRegisterEmail(event.target.value)}
                    placeholder="nama@email.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Nomor HP</label>
                  <input
                    type="tel"
                    value={registerPhone}
                    onChange={(event) => setRegisterPhone(event.target.value)}
                    placeholder="0812..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(event) => setRegisterPassword(event.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Konfirmasi password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Ulangi password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(event) => setAcceptedTerms(event.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#155DFC] focus:ring-[#155DFC]"
                    />
                    <span>
                      Saya menyetujui <span className="font-semibold text-[#155DFC]">Syarat & Ketentuan</span> dan <span className="font-semibold text-[#155DFC]">Kebijakan Privasi</span>.
                    </span>
                  </label>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!acceptedTerms}
                  className="w-full rounded-full bg-[linear-gradient(135deg,#155DFC_0%,#2f7bff_100%)] px-5 py-3.5 text-base font-semibold text-white shadow-[0_18px_36px_rgba(21,93,252,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(21,93,252,0.34)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Daftar Sekarang
                </button>

                <p className="text-center text-sm text-slate-500">
                  Sudah punya akun?{' '}
                  <button type="button" onClick={() => { setMode('login'); setError(''); }} className="font-semibold text-[#155DFC] hover:underline">
                    Masuk di sini
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    {selectedRole === 'masyarakat' ? 'Nomor HP / Email' : 'Email dinas'}
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden="true">
                        <path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
                        <circle cx="10" cy="7" r="3.5" />
                        <path d="M20 19v-1a4 4 0 0 0-3-3.87" />
                        <path d="M16 4.13a4 4 0 0 1 0 7.74" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={identifier}
                      onChange={(event) => setIdentifier(event.target.value)}
                      placeholder={selectedRole === 'masyarakat' ? '0812... / nama@email.com' : 'nama@jabarprov.go.id'}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-800 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10"
                    />
                  </div>
                </div>

                {selectedRole !== 'masyarakat' && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2" aria-hidden="true">
                          <rect x="4" y="11" width="16" height="9" rx="2" />
                          <path d="M8 11V8a4 4 0 1 1 8 0v3" />
                        </svg>
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Masukkan password"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-11 text-slate-800 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-sm font-medium text-slate-500 hover:text-slate-700"
                      >
                        {showPassword ? 'Sembunyikan' : 'Tampil'}
                      </button>
                    </div>
                  </div>
                )}

                {selectedRole === 'masyarakat' && (
                  <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/70 p-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-slate-700">Verifikasi OTP</span>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="rounded-full bg-[#155DFC] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#0f47d6]"
                      >
                        {isOtpSent ? 'Kirim ulang' : 'Kirim OTP'}
                      </button>
                    </div>

                    {isOtpSent && (
                      <div className="mt-3">
                        <label className="mb-2 block text-sm font-semibold text-slate-700">Kode OTP</label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(event) => setOtp(event.target.value)}
                          placeholder="Masukkan 4 digit OTP"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-[#155DFC] focus:ring-4 focus:ring-[#155DFC]/10"
                        />
                      </div>
                    )}
                  </div>
                )}

                {selectedRole !== 'masyarakat' && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Kode 2FA</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(event) => setOtp(event.target.value)}
                      placeholder="Masukkan kode verifikasi"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 pt-1">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-[#155DFC] focus:ring-[#155DFC]" />
                    Ingat saya
                  </label>
                  <button type="button" className="text-sm font-semibold text-[#155DFC] hover:underline">
                    Lupa password?
                  </button>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-full bg-[linear-gradient(135deg,#155DFC_0%,#2f7bff_100%)] px-5 py-3.5 text-base font-semibold text-white shadow-[0_18px_36px_rgba(21,93,252,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(21,93,252,0.34)]"
                >
                  {selectedRole === 'masyarakat' ? 'Masuk ke Laporan Saya' : 'Masuk ke Dashboard'}
                </button>

                <p className="text-center text-sm text-slate-500">
                  Belum punya akun?{' '}
                  <button type="button" onClick={() => { setMode('register'); setError(''); }} className="font-semibold text-[#155DFC] hover:underline">
                    Daftar sekarang
                  </button>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
