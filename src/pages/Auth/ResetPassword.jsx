import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { resetPassword } from '../../services/api';
import { parseApiError } from '../../utils/apiError';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(null); // null = checking, true = valid, false = invalid

  useEffect(() => {
    let mounted = true;

    const validateToken = () => {
      if (!token) {
        if (mounted) {
          setTokenValid(false);
          setError('Token reset password tidak ditemukan di URL.');
        }
        return;
      }
      // Token format validation (basic)
      if (token.length < 10) {
        if (mounted) {
          setTokenValid(false);
          setError('Token tidak valid.');
        }
      } else {
        if (mounted) {
          setTokenValid(true);
        }
      }
    };

    validateToken();

    return () => {
      mounted = false;
    };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Token tidak ditemukan.');
      return;
    }

    if (!password.trim() || !confirmPassword.trim()) {
      setError('Password dan konfirmasi password wajib diisi.');
      return;
    }

    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }

    if (password.length > 128) {
      setError('Password maksimal 128 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);

    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#edf5ff_0%,#f8fbff_30%,#ffffff_100%)] px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_20px_45px_rgba(15,23,42,0.04)] text-center"
        >
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Token Tidak Valid</h1>
          <p className="mt-2 text-slate-600">{error}</p>
          <div className="mt-6 space-y-3">
            <Link
              to="/forgot-password"
              className="w-full sm:w-auto inline-block rounded-full bg-[linear-gradient(135deg,#155DFC_0%,#2f7bff_100%)] px-6 py-3 text-base font-semibold text-white shadow-[0_18px_36px_rgba(21,93,252,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(21,93,252,0.34)]"
            >
              Minta Tautan Baru
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-block rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            >
              Kembali ke Login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#edf5ff_0%,#f8fbff_30%,#ffffff_100%)] px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_20px_45px_rgba(15,23,42,0.04)] text-center"
        >
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Password Berhasil Diubah</h1>
          <p className="mt-2 text-slate-600">Password Anda telah diperbarui. Silakan login dengan password baru.</p>
          <Link
            to="/login"
            className="mt-8 inline-block rounded-full bg-[linear-gradient(135deg,#155DFC_0%,#2f7bff_100%)] px-6 py-3 text-base font-semibold text-white shadow-[0_18px_36px_rgba(21,93,252,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(21,93,252,0.34)]"
          >
            Login Sekarang
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#edf5ff_0%,#f8fbff_30%,#ffffff_100%)] px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_20px_45px_rgba(15,23,42,0.04)]"
      >
        <div className="text-center mb-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#155DFC] hover:underline mb-6"
          >
            ← Kembali ke Login
          </Link>
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Atur Ulang Password</h1>
          <p className="mt-2 text-slate-600">Masukkan password baru Anda di bawah ini.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Password Baru</label>
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-11 text-slate-800 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10"
                required
                autoFocus
                disabled={isLoading}
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

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Konfirmasi Password Baru</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password baru"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-full bg-[linear-gradient(135deg,#155DFC_0%,#2f7bff_100%)] px-5 py-3.5 text-base font-semibold text-white shadow-[0_18px_36px_rgba(21,93,252,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(21,93,252,0.34)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Memproses...' : 'Simpan Password Baru'}
          </button>

          <Link
            to="/login"
            className="block text-center text-sm font-semibold text-[#155DFC] hover:underline mt-4"
          >
            Kembali ke Login
          </Link>
        </form>
      </motion.div>
    </div>
  );
}