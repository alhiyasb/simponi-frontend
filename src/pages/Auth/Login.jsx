
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import jabar1 from '../../assets/images/jabar1.png';
import { useAuth } from '../../hooks/useAuth';
import { register, resendVerification } from '../../services/api';
import { parseApiError } from '../../utils/apiError';

const roles = [
  {
    id: 'masyarakat',
    label: 'Masyarakat',
    badge: 'Pelapor / Warga',
    description: 'Login dengan email/NIK dan password',
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
  const location = useLocation();
  const { login } = useAuth();

  const [mode, setMode] = useState('login');
  const [selectedRole, setSelectedRole] = useState('masyarakat');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerNik, setRegisterNik] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);
  const [resendEmail, setResendEmail] = useState('');

  const inputClass =
    'w-full rounded-2xl border border-[#D9D9D9] bg-[#F3F3F3] px-4 py-3 text-[#111111] outline-none transition-all duration-200 placeholder:text-[#888888] focus:border-[#0071FA] focus:bg-white focus:text-[#111111] focus:ring-4 focus:ring-[#0071FA]/10';

  const linkClass =
    'font-semibold text-[#0071FA] transition-colors hover:text-[#0063DC] hover:underline';

  const primaryButtonClass =
    'w-full rounded-full bg-[#0071FA] px-5 py-3.5 text-base font-semibold text-white shadow-[0_18px_32px_rgba(0,113,250,0.20)] transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#0063DC] disabled:cursor-not-allowed disabled:opacity-60';

  const navigateByRole = (user) => {
    if (user?.role === 'admin_pemprov') {
      navigate('/admin/pemprov', { replace: true });
      return;
    }

    if (user?.role === 'admin_pemda') {
      navigate('/admin/pemda', { replace: true });
      return;
    }

    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setResendMessage('');

    if (!fullName.trim() || !registerEmail.trim() || !registerNik.trim()) {
      setError('Nama lengkap, email, dan NIK wajib diisi.');
      return;
    }

    if (registerNik.length !== 16 || !/^\d+$/.test(registerNik)) {
      setError('NIK harus 16 digit angka.');
      return;
    }

    if (!registerPassword.trim() || !confirmPassword.trim()) {
      setError('Password dan konfirmasi password wajib diisi.');
      return;
    }

    if (registerPassword.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }

    if (registerPassword.length > 128) {
      setError('Password maksimal 128 karakter.');
      return;
    }

    if (registerPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    if (!acceptedTerms) {
      setError(
        'Anda harus menyetujui Syarat & Ketentuan serta Kebijakan Privasi.'
      );
      return;
    }

    setIsLoading(true);

    try {
      await register({
        nik: registerNik,
        email: registerEmail,
        full_name: fullName,
        password: registerPassword,
      });

      setRegisterSuccess(true);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async (event) => {
    event.preventDefault();

    if (!resendEmail.trim()) return;

    setResendLoading(true);
    setResendMessage('');

    try {
      await resendVerification(resendEmail);
      setResendMessage('Email verifikasi telah dikirim ulang.');
    } catch (err) {
      setResendMessage(parseApiError(err));
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!identifier.trim() || !password.trim()) {
      setError(
        selectedRole === 'masyarakat'
          ? 'Email/NIK dan password wajib diisi.'
          : 'NIP/email dan password wajib diisi.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const roleMap = {
        masyarakat: 'public',
        pemda: 'admin_pemda',
        pemprov: 'admin_pemprov',
      };

      const backendRole = roleMap[selectedRole];

      const loggedInUser = await login(
        identifier,
        password,
        backendRole
      );

      if (loggedInUser?.role !== backendRole) {
        throw new Error(
          'Role akun tidak sesuai dengan jenis login yang dipilih.'
        );
      }

      navigateByRole(loggedInUser);
    } catch (err) {
      setError(err.message || 'Login gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetRegisterForm = () => {
    setRegisterSuccess(false);
    setFullName('');
    setRegisterEmail('');
    setRegisterNik('');
    setRegisterPassword('');
    setConfirmPassword('');
    setAcceptedTerms(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-[#1A1A1A]/10 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.10)]"
      >
        <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="relative overflow-hidden p-6 text-white md:p-8 lg:p-10"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.42), rgba(0,0,0,0.6)), url(${jabar1})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute -left-16 top-12 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -right-12 bottom-12 h-52 w-52 rounded-full bg-red-500/20 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px] opacity-50" />

            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-lg font-bold">
                  S
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#D9D9D9]">
                    SIMPONI
                  </p>
                </div>
              </div>

              <div className="mt-12 max-w-md">
                <h1 className="text-4xl font-black tracking-[-0.06em] text-white md:text-5xl">
                  Selamat Datang
                </h1>
                <p className="mt-5 text-sm leading-7 text-[#D9D9D9] md:text-base">
                  Sistem Informasi Pelaporan dan Monitoring untuk mendukung penanganan kasus secara cepat,
                  aman, dan terdokumentasi dengan baik.
                </p>
              </div>

              <div className="mt-8 grid gap-3">
                {mode === 'login' &&
                  roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.id);
                        setError('');
                        setRegisterSuccess(false);
                        setShowResendForm(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-[22px] border p-4 text-left backdrop-blur-sm transition-all duration-200 ${
                        selectedRole === role.id
                          ? 'border-[#0071FA] bg-white/15 shadow-[0_16px_32px_rgba(0,113,250,0.15)]'
                          : 'border-white/10 bg-white/5 hover:border-[#0071FA] hover:bg-white/10'
                      }`}
                    >
                      <div>
                        <p className="text-base font-bold text-white">
                          {role.label}
                        </p>
                        <p className="mt-1 text-sm text-[#D9D9D9]">
                          {role.description}
                        </p>
                      </div>

                      <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#EAEAEA]">
                        {role.badge}
                      </span>
                    </button>
                  ))}
              </div>

              <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D9D9D9]">
                  Keunggulan
                </p>

                <ul className="mt-4 space-y-3 text-sm text-[#F2F2F2]">
                  {featureList.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs text-white">
                        ✓
                      </span>
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
            className="bg-white/75 p-6 backdrop-blur-sm md:p-8 lg:p-10"
          >
            <div className="mb-7">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#555555]">
                    Autentikasi
                  </p>

                  <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-[#111111]">
                    {mode === 'login'
                      ? selectedRole === 'masyarakat'
                        ? 'Login Masyarakat'
                        : selectedRole === 'pemda'
                          ? 'Login Admin Pemda'
                          : 'Login Admin Pemprov'
                      : 'Buat Akun Baru'}
                  </h2>
                </div>

                {selectedRole === 'masyarakat' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode((prev) =>
                        prev === 'login' ? 'register' : 'login'
                      );
                      setError('');
                      setRegisterSuccess(false);
                      setShowResendForm(false);
                    }}
                    className="rounded-full border border-[#0071FA]/20 bg-[#0071FA]/5 px-3 py-1.5 text-xs font-semibold text-[#0071FA] transition hover:bg-[#0071FA] hover:text-white"
                  >
                    {mode === 'login' ? 'Daftar' : 'Masuk'}
                  </button>
                )}
              </div>

              <p className="mt-2 text-sm text-[#666666]">
                {mode === 'login'
                  ? selectedRole === 'masyarakat'
                    ? 'Masuk untuk mengajukan dan memantau laporan Anda.'
                    : 'Masuk dengan akun resmi untuk mengelola data dan dashboard.'
                  : 'Lengkapi data di bawah ini untuk membuat akun baru.'}
              </p>
            </div>

            {mode === 'register' ? (
              registerSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-4 text-center"
                >
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#0071FA] text-white">
                    <svg
                      className="h-10 w-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>

                  <h3 className="text-xl font-bold text-[#111111]">
                    Periksa Email Anda
                  </h3>

                  <p className="mt-2 text-[#555555]">
                    Kami telah mengirim link verifikasi ke{' '}
                    <strong>{registerEmail}</strong>. Silakan cek inbox dan
                    folder spam lalu klik link tersebut.
                  </p>

                  <div className="mt-6 space-y-3">
                    <form
                      onSubmit={(event) => {
                        setResendEmail(registerEmail);
                        handleResendVerification(event);
                      }}
                      className="w-full"
                    >
                      <button
                        type="submit"
                        disabled={resendLoading}
                        className={linkClass}
                      >
                        {resendLoading
                          ? 'Mengirim...'
                          : 'Kirim Ulang Email Verifikasi'}
                      </button>
                    </form>

                    {resendMessage && (
                      <p className="text-sm text-[#111111]">
                        {resendMessage}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        resetRegisterForm();
                        setIdentifier(registerEmail);
                      }}
                      className={linkClass}
                    >
                      Kembali ke Login
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#111111]">
                      Nama lengkap
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#111111]">
                      Email
                    </label>
                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(event) => setRegisterEmail(event.target.value)}
                      placeholder="nama@email.com"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#111111]">
                      NIK
                    </label>
                    <input
                      type="text"
                      value={registerNik}
                      onChange={(event) => setRegisterNik(event.target.value)}
                      placeholder="3201xxxxxxxxxxxx (16 digit)"
                      maxLength={16}
                      className={inputClass}
                      required
                    />
                    <p className="mt-1 text-xs text-[#666666]">
                      NIK 16 digit, kode wilayah Jawa Barat (3201-3279)
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#111111]">
                      Password
                    </label>
                    <input
                      type="password"
                      value={registerPassword}
                      onChange={(event) =>
                        setRegisterPassword(event.target.value)
                      }
                      placeholder="Minimal 8 karakter"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#111111]">
                      Konfirmasi password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Ulangi password"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div className="rounded-2xl border border-[#E5E5E5] bg-[#F3F3F3] p-3.5">
                    <label className="flex items-start gap-3 text-sm text-[#111111]">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(event) =>
                          setAcceptedTerms(event.target.checked)
                        }
                        className="mt-0.5 h-4 w-4 rounded border-[#B0B0B0] text-[#0071FA] focus:ring-[#0071FA]"
                      />
                      <span>
                        Saya menyetujui{' '}
                        <span className="font-semibold text-[#0071FA]">
                          Syarat & Ketentuan
                        </span>{' '}
                        dan{' '}
                        <span className="font-semibold text-[#0071FA]">
                          Kebijakan Privasi
                        </span>
                        .
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
                    disabled={!acceptedTerms || isLoading}
                    className={primaryButtonClass}
                  >
                    {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
                  </button>

                  <p className="text-center text-sm text-[#666666]">
                    Sudah punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        resetRegisterForm();
                        setError('');
                      }}
                      className={linkClass}
                    >
                      Masuk di sini
                    </button>
                  </p>
                </form>
              )
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#111111]">
                    {selectedRole === 'masyarakat'
                      ? 'Email / NIK'
                      : 'NIP / Email'}
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#777777]">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 fill-none stroke-current stroke-2"
                        aria-hidden="true"
                      >
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
                      placeholder={
                        selectedRole === 'masyarakat'
                          ? 'Masukkan email atau NIK'
                          : 'Masukkan NIP atau email'
                      }
                      className="w-full rounded-2xl border border-[#D9D9D9] bg-[#F3F3F3] py-3.5 pl-12 pr-4 text-[#111111] outline-none transition-all duration-200 placeholder:text-[#888888] focus:border-[#0071FA] focus:bg-white focus:text-[#111111] focus:ring-4 focus:ring-[#0071FA]/10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#111111]">
                    Password
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#777777]">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5 fill-none stroke-current stroke-2"
                        aria-hidden="true"
                      >
                        <rect x="4" y="11" width="16" height="9" rx="2" />
                        <path d="M8 11V8a4 4 0 1 1 8 0v3" />
                      </svg>
                    </span>

                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Masukkan password"
                      className="w-full rounded-2xl border border-[#D9D9D9] bg-[#F3F3F3] py-3.5 pl-12 pr-28 text-[#111111] outline-none transition-all duration-200 placeholder:text-[#888888] focus:border-[#0071FA] focus:bg-white focus:text-[#111111] focus:ring-4 focus:ring-[#0071FA]/10"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-sm font-medium text-[#666666] transition hover:text-[#0071FA]"
                    >
                      {showPassword ? 'Sembunyikan' : 'Tampil'}
                    </button>
                  </div>
                </div>

                {selectedRole === 'masyarakat' && !showResendForm && (
                  <div className="pt-1 text-center text-sm text-[#666666]">
                    <button
                      type="button"
                      onClick={() => {
                        setShowResendForm(true);
                        setResendEmail('');
                        setResendMessage('');
                      }}
                      className={linkClass}
                    >
                      Belum verifikasi email? Kirim ulang
                    </button>
                  </div>
                )}

                {selectedRole === 'masyarakat' && showResendForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <div className="rounded-xl border border-[#E5E5E5] bg-[#F3F3F3] p-4">
                      <p className="mb-3 text-sm font-medium text-[#111111]">
                        Kirim Ulang Email Verifikasi
                      </p>

                      <form
                        onSubmit={handleResendVerification}
                        className="space-y-2"
                      >
                        <input
                          type="email"
                          value={resendEmail}
                          onChange={(event) =>
                            setResendEmail(event.target.value)
                          }
                          placeholder="Masukkan email yang terdaftar"
                          className="w-full rounded-xl border border-[#D9D9D9] bg-white px-4 py-3 text-[#111111] outline-none transition-all duration-200 focus:border-[#0071FA] focus:ring-4 focus:ring-[#0071FA]/10"
                          required
                        />

                        <button
                          type="submit"
                          disabled={resendLoading}
                          className="w-full rounded-full bg-[#0071FA] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0063DC] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {resendLoading ? 'Mengirim...' : 'Kirim Ulang'}
                        </button>

                        {resendMessage && (
                          <p className="text-center text-sm text-[#111111]">
                            {resendMessage}
                          </p>
                        )}
                      </form>

                      <button
                        type="button"
                        onClick={() => {
                          setShowResendForm(false);
                          setResendMessage('');
                        }}
                        className="mt-2 text-sm font-semibold text-[#0071FA] hover:text-[#0063DC] hover:underline"
                      >
                        Batal
                      </button>
                    </div>
                  </motion.div>
                )}

                <div className="flex items-center justify-between gap-3 pt-1">
                  <label className="inline-flex items-center gap-2 text-sm text-[#666666]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-[#B0B0B0] text-[#0071FA] focus:ring-[#0071FA]"
                    />
                    Ingat saya
                  </label>

                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className={linkClass}
                  >
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
                  disabled={isLoading}
                  className={primaryButtonClass}
                >
                  {isLoading
                    ? 'Memproses...'
                    : selectedRole === 'masyarakat'
                      ? 'Masuk ke Laporan Saya'
                      : 'Masuk ke Dashboard'}
                </button>

                {selectedRole === 'masyarakat' && (
                  <p className="text-center text-sm text-[#666666]">
                    Belum punya akun?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        resetRegisterForm();
                        setError('');
                      }}
                      className={linkClass}
                    >
                      Daftar sekarang
                    </button>
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
