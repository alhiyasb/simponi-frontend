import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../services/api';
import { parseApiError } from '../../utils/apiError';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setResendMessage('');

    if (!email.trim()) {
      setError('Email wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await forgotPassword(email);
      setSuccess(true);
      // Backward compat: default true if email_sent not present (old backend)
      const sent = result.email_sent !== false;
      setEmailSent(sent);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setResendLoading(true);
    setResendMessage('');
    try {
      const result = await forgotPassword(email);
      const sent = result.email_sent !== false;
      setEmailSent(sent);
      if (sent) {
        setResendMessage('Tautan reset password telah dikirim ulang.');
      } else {
        setResendMessage('Gagal mengirim ulang. Silakan coba lagi.');
      }
    } catch (err) {
      setResendMessage(parseApiError(err));
    } finally {
      setResendLoading(false);
    }
  };

  const handleResetForm = () => {
    setSuccess(false);
    setEmail('');
    setError('');
    setEmailSent(false);
    setResendMessage('');
  };

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
          <h1 className="text-2xl font-black text-slate-900">Lupa Password?</h1>
          <p className="mt-2 text-slate-600">
            Masukkan email yang terdaftar, kami akan mengirim tautan untuk membuat password baru.
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-4"
          >
            <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
              emailSent ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              {emailSent ? (
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-10 w-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {emailSent ? 'Periksa Email Anda' : 'Email Gagal Terkirim'}
            </h3>
            <p className="mt-2 text-slate-600">
              {emailSent
                ? `Kami telah mengirim tautan reset password ke <strong>{email}</strong>. Silakan cek inbox (dan folder spam) lalu klik tautan tersebut.`
                : 'Email reset password gagal terkirim. Silakan coba lagi.'}
            </p>
            {!emailSent && resendMessage && (
              <p className="mt-2 text-sm text-red-600">{resendMessage}</p>
            )}
            <div className="mt-6 space-y-3">
              {!emailSent && (
                <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-[#155DFC] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? 'Mengirim...' : 'Kirim Ulang'}
                </button>
              )}
              <button
                onClick={handleResetForm}
                className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-[#155DFC] hover:underline"
              >
                {emailSent ? 'Masukkan Email Lain' : 'Coba Lagi'}
              </button>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-block rounded-full bg-[linear-gradient(135deg,#155DFC_0%,#2f7bff_100%)] px-6 py-3 text-base font-semibold text-white shadow-[0_18px_36px_rgba(21,93,252,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(21,93,252,0.34)]"
              >
                Kembali ke Login
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-[#155DFC] focus:bg-white focus:ring-4 focus:ring-[#155DFC]/10"
                required
                autoFocus
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
              {isLoading ? 'Mengirim...' : 'Kirim Tautan Reset'}
            </button>

            <Link
              to="/login"
              className="block text-center text-sm font-semibold text-[#155DFC] hover:underline mt-4"
            >
              Kembali ke Login
            </Link>
          </form>
        )}
      </motion.div>
    </div>
  );
}