import { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  exportAdminCSV,
  exportAdminExcel,
} from "../../services/api";

export default function EksporData() {
  const [startDate, setStartDate] = useState("2026-09-01");
  const [endDate, setEndDate] = useState("2026-10-14");
  const [kodeKabupaten, setKodeKabupaten] = useState("3201");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleExport(format) {
    setError("");
    setSuccess("");

    if (!startDate || !endDate) {
      setError("Tanggal mulai dan tanggal akhir wajib diisi.");
      return;
    }

    if (startDate > endDate) {
      setError("Tanggal mulai tidak boleh melebihi tanggal akhir.");
      return;
    }

    setLoading(format);

    try {
      const filters = {
        start_date: startDate,
        end_date: endDate,
      };

      if (kodeKabupaten.trim()) {
        filters.kode_kabupaten = kodeKabupaten.trim();
      }

      if (format === "csv") {
        await exportAdminCSV(filters);
      } else {
        await exportAdminExcel(filters);
      }

      setSuccess(
        `Permintaan ekspor ${format.toUpperCase()} berhasil.`
      );
    } catch (err) {
      setError(err.message || "Ekspor gagal. Silakan coba lagi.");
    } finally {
      setLoading("");
    }
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(1,100,221,0.14),_transparent_30%),linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#0164DD]">
              Admin Pemprov
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Ekspor Data SIMPONI
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Unduh data laporan berdasarkan rentang tanggal dan
              kabupaten untuk kebutuhan analisis dan pelaporan.
            </p>
          </header>

          <section className="relative mb-6 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0A5BD6] via-[#0673E3] to-[#53A6FF] p-7 text-white shadow-[0_20px_40px_rgba(1,100,221,0.22)] sm:p-8">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.22),_transparent_52%)]" />
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10" />
            <div className="absolute -bottom-14 right-20 h-44 w-44 rounded-full bg-white/10" />

            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100">
                  Export file
                </p>

                <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                  Siapkan data laporan dalam format siap unduh.
                </h2>
              </div>

              <div className="flex items-center gap-3 self-start rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-lg font-bold">
                  ⇩
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-blue-100">
                    Format
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    CSV / Excel
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Filter Data
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Sesuaikan rentang waktu dan wilayah yang ingin diunduh.
                </p>
              </div>

              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Ready export
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label
                  htmlFor="start-date"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Tanggal Mulai
                </label>

                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0164DD] focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label
                  htmlFor="end-date"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Tanggal Akhir
                </label>

                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0164DD] focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div className="sm:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label
                  htmlFor="kode-kabupaten"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Kode Kabupaten
                </label>

                <input
                  id="kode-kabupaten"
                  type="text"
                  value={kodeKabupaten}
                  onChange={(e) => setKodeKabupaten(e.target.value)}
                  placeholder="Contoh: 3201 (kosongkan untuk semua)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0164DD] focus:ring-4 focus:ring-blue-50"
                />

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Contoh kode 3201. Kosongkan jika backend mendukung
                  ekspor seluruh kabupaten.
                </p>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
              >
                {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
              >
                {success}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={Boolean(loading)}
                onClick={() => handleExport("csv")}
                className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(16,185,129,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(16,185,129,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading === "csv" ? "Mengunduh..." : "Ekspor CSV"}
              </button>

              <button
                type="button"
                disabled={Boolean(loading)}
                onClick={() => handleExport("xlsx")}
                className="rounded-2xl bg-gradient-to-r from-[#0164DD] to-[#1386FF] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(1,100,221,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(1,100,221,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading === "xlsx" ? "Mengunduh..." : "Ekspor Excel"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </AdminLayout>
  );
}
