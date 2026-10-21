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
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(1,100,221,0.14),_transparent_30%),linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)] px-3 py-6 sm:px-5 lg:px-6">
        <div className="mx-auto w-full max-w-[1600px]">
          <header className="mb-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#0164DD]">
              Admin Pemprov
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Ekspor Data SIMPONI
            </h1>
          </header>

          <section className="relative mb-6 overflow-hidden rounded-[30px] border border-blue-100 bg-gradient-to-br from-[#0A5BD6] via-[#0E69E4] to-[#5AA8FF] p-5 text-white shadow-[0_24px_50px_rgba(1,100,221,0.24)] sm:p-7 lg:p-8">
            <div className="absolute inset-y-0 right-0 w-[52%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.18),_transparent_58%)]" />
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 right-16 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(255,255,255,0.08),transparent_45%,rgba(255,255,255,0.03))]" />

            <div className="relative z-10 grid gap-5 lg:grid-cols-[1.5fr_0.9fr] lg:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-100">
                  <span className="inline-flex h-2 w-2 rounded-full bg-white/80" />
                  Export File
                </div>

                <h2 className="mt-4 text-2xl font-black leading-tight sm:text-3xl lg:text-[2rem]">
                  Ambil data laporan dalam format yang siap dipakai.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">
                  Download laporan dalam format CSV atau Excel dengan
                  filter tanggal dan wilayah yang sudah disesuaikan.
                </p>
              </div>

              <div className="flex items-center gap-3 self-stretch rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-lg shadow-blue-900/10 backdrop-blur-sm lg:justify-center">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold ring-1 ring-white/15">
                  ⇩
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-blue-100">
                    Format tersedia
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    CSV / Excel
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:p-7 lg:p-8">
            <div className="mb-6 flex items-end justify-between gap-3 lg:mb-7">
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

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-12 xl:gap-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 xl:col-span-5">
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

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 xl:col-span-5">
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

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 xl:col-span-2 xl:flex xl:items-end">
                <div className="w-full">
                  <p className="mb-2 text-sm font-semibold text-slate-700">
                    Format
                  </p>
                  <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.12em] text-[#0164DD]">
                    {loading ? "Proses" : "Siap"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 xl:col-span-12">
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
