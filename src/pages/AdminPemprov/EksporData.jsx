
import { useState } from "react";
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
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6">
          <p className="mb-2 text-sm font-medium text-blue-600">
            ADMIN PEMPROV
          </p>

          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Ekspor Data SIMPONI
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Unduh data laporan berdasarkan rentang tanggal
            dan kode kabupaten.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <h2 className="mb-5 text-lg font-semibold text-slate-800">
            Filter Data
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="start-date"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Tanggal Mulai
              </label>

              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="end-date"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Tanggal Akhir
              </label>

              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="kode-kabupaten"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Kode Kabupaten
              </label>

              <input
                id="kode-kabupaten"
                type="text"
                value={kodeKabupaten}
                onChange={(e) => setKodeKabupaten(e.target.value)}
                placeholder="Contoh: 3201 (kosongkan untuk semua)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-xs text-slate-500">
                Contoh kode 3201. Kosongkan jika backend
                mendukung ekspor seluruh kabupaten.
              </p>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="mt-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
            >
              {success}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={Boolean(loading)}
              onClick={() => handleExport("csv")}
              className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading === "csv" ? "Mengunduh..." : "Ekspor CSV"}
            </button>

            <button
              type="button"
              disabled={Boolean(loading)}
              onClick={() => handleExport("xlsx")}
              className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading === "xlsx" ? "Mengunduh..." : "Ekspor Excel"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
