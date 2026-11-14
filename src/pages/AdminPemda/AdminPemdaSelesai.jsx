import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import AdminPemdaLayout from "../../components/admin/AdminPemdaLayout";
import { getReports } from "../../services/api";

function formatDate(date) {
  if (!date) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

function Reveal({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StatusBadge({ value }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {value}
    </span>
  );
}

export default function AdminPemdaSelesai() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await getReports();
        const list = Array.isArray(res) ? res : res?.data || [];

        if (mounted) {
          setReports(list.filter((r) => r.status === "Selesai"));
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || "Gagal mengambil daftar laporan.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const keyword = search.trim().toLowerCase();

  const filtered = reports.filter((r) => {
    if (!keyword) return true;
    return (
      String(r.id).includes(keyword) ||
      (r.pelapor_nama || "").toLowerCase().includes(keyword) ||
      (r.lokasi_kabupaten || "").toLowerCase().includes(keyword)
    );
  });

  const totalKabupaten = new Set(
    reports.map((r) => (r.lokasi_kabupaten || "").trim()).filter(Boolean)
  ).size;

  return (
    <AdminPemdaLayout>
      <div className="relative min-h-screen bg-white px-4 pb-12 pt-24 lg:px-8 lg:pt-10">

        <div className="relative mx-auto max-w-[1200px]">
          <Reveal>
            <div className="rounded-[30px] border border-white/80 bg-gradient-to-br from-[#155EEF] via-[#2563EB] to-[#08A7E8] p-6 text-white shadow-[0_25px_70px_rgba(21,94,239,0.18)] sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">Laporan Selesai</h1>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-blue-50">
                    Daftar laporan yang telah selesai ditangani dan siap diarsipkan.
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm backdrop-blur-md">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
                  <span className="font-semibold">{reports.length} laporan selesai</span>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Reveal delay={0.05}>
              <div className="rounded-[24px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_45px_rgba(37,99,235,0.08)] backdrop-blur-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Total</p>
                <p className="mt-3 text-3xl font-extrabold text-slate-900">{reports.length}</p>
                <p className="mt-1 text-xs text-slate-500">Laporan selesai</p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="rounded-[24px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_45px_rgba(37,99,235,0.08)] backdrop-blur-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Filter aktif</p>
                <p className="mt-3 text-3xl font-extrabold text-slate-900">{keyword ? filtered.length : reports.length}</p>
                <p className="mt-1 text-xs text-slate-500">Data saat ini</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-[24px] border border-white/80 bg-white/80 p-5 shadow-[0_18px_45px_rgba(37,99,235,0.08)] backdrop-blur-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Kabupaten</p>
                <p className="mt-3 text-3xl font-extrabold text-slate-900">{totalKabupaten}</p>
                <p className="mt-1 text-xs text-slate-500">Wilayah terdampak</p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12} className="mt-6">
            <div className="rounded-[28px] border border-white/80 bg-white/80 p-4 shadow-[0_18px_45px_rgba(37,99,235,0.08)] backdrop-blur-2xl sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Pencarian</p>
                  <p className="mt-1 text-sm text-slate-500">Cari berdasarkan nomor, nama pelapor, atau kabupaten.</p>
                </div>
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari laporan..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-11 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">⌕</span>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mt-6">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-20 animate-pulse rounded-[24px] border border-slate-200 bg-white/80" />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600 shadow-sm">
                {error}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/80 p-10 text-center text-sm text-slate-500 shadow-[0_18px_45px_rgba(37,99,235,0.05)]">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400">
                  —
                </div>
                Tidak ada laporan selesai yang sesuai dengan pencarian.
              </div>
            ) : (
              <Reveal delay={0.14}>
                <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white/80 shadow-[0_18px_45px_rgba(37,99,235,0.08)] backdrop-blur-2xl">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        <tr>
                          <th className="px-5 py-4">No</th>
                          <th className="px-5 py-4">Pelapor</th>
                          <th className="px-5 py-4">Kabupaten/Kota</th>
                          <th className="px-5 py-4">Tanggal</th>
                          <th className="px-5 py-4">Status</th>
                          <th className="px-5 py-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((r) => (
                          <tr key={r.id} className="border-t border-slate-100 transition hover:bg-blue-50/50">
                            <td className="px-5 py-4">
                              <span className="inline-flex rounded-xl bg-slate-100 px-2.5 py-1.5 font-bold text-slate-700">#{r.id}</span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-800">{r.pelapor_nama || "-"}</span>
                                <span className="text-xs text-slate-400">Pelapor</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-slate-700">{r.lokasi_kabupaten || "-"}</td>
                            <td className="px-5 py-4 text-slate-500">{formatDate(r.created_at)}</td>
                            <td className="px-5 py-4"><StatusBadge value={r.status || "Selesai"} /></td>
                            <td className="px-5 py-4 text-right">
                              <Link
                                to={`/admin/pemda/selesai/${r.id}`}
                                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#155EEF] to-[#08A7E8] px-4 py-2.5 text-xs font-bold text-white shadow-[0_10px_25px_rgba(21,94,239,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(21,94,239,0.24)]"
                              >
                                Lihat Detail
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </AdminPemdaLayout>
  );
}