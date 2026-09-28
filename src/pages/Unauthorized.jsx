import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Unauthorized() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#edf5ff_0%,#f8fbff_30%,#ffffff_100%)] px-4 py-20 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-slate-900">Akses Ditolak</h1>
        <p className="mt-3 text-lg text-slate-600">
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </p>

        {user && (
          <p className="mt-2 text-sm text-slate-500">
            Role Anda: <span className="font-semibold capitalize">{user.role.replace('_', ' ')}</span>
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={logout}
            className="w-full sm:w-auto rounded-full bg-[linear-gradient(135deg,#155DFC_0%,#2f7bff_100%)] px-6 py-3 text-base font-semibold text-white shadow-[0_18px_36px_rgba(21,93,252,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(21,93,252,0.34)]"
          >
            Keluar & Login Ulang
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}