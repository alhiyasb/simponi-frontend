import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { verifyEmail, resendVerification } from '../../services/api';
import { parseApiError } from '../../utils/apiError';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      if (!token) {
        if (mounted) {
          setStatus('error');
          setMessage('Token verifikasi tidak ditemukan di URL.');
        }
        return;
      }

      try {
        const data = await verifyEmail(token);
        if (mounted) {
          setStatus('success');
          setMessage(data.message || 'Email berhasil diverifikasi');
        }
      } catch (err) {
        if (mounted) {
          setStatus('error');
          setMessage(parseApiError(err));
        }
      }
    };

    verify();

    return () => {
      mounted = false;
    };
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
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

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(180deg,#edf5ff_0%,#f8fbff_30%,#ffffff_100%)] px-4 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md rounded-[24px] border border-slate-200 bg-white p-8 shadow-[0_20px_45px_rgba(15,23,42,0.04)] text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-900">Memverifikasi...</h2>
          <p className="mt-2 text-slate-500">Mohon tunggu sebentar</p>
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
        <div className="text-center">
          <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
            status === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {status === 'success' ? (
              <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            {status === 'success' ? 'Email Terverifikasi' : 'Verifikasi Gagal'}
          </h1>
          <p className="mt-2 text-slate-600">{message}</p>

          {status === 'success' ? (
            <Link
              to="/login"
              className="mt-8 inline-block rounded-full bg-[linear-gradient(135deg,#155DFC_0%,#2f7bff_100%)] px-6 py-3 text-base font-semibold text-white shadow-[0_18px_36px_rgba(21,93,252,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(21,93,252,0.34)]"
            >
              Login Sekarang
            </Link>
          ) : (
            <>
              <p className="mt-6 text-sm text-slate-500">Kirim ulang email verifikasi:</p>
              <form onSubmit={handleResend} className="mt-4 space-y-3">
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Masukkan email Anda"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-[#155DFC] focus:ring-2 focus:ring-[#155DFC]/10"
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={resendLoading}
                  className="w-full rounded-full bg-[#155DFC] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed transition hover:bg-[#0f47d6]"
                >
                  {resendLoading ? 'Mengirim...' : 'Kirim Ulang'}
                </button>
                {resendMessage && (
                  <p className="text-sm text-green-700 text-center">{resendMessage}</p>
                )}
              </form>
              <Link
                to="/login"
                className="mt-6 inline-block text-sm font-semibold text-[#155DFC] hover:underline"
              >
                Kembali ke Login
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}