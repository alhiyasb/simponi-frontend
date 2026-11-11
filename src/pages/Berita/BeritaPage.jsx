import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { NewsCardGrid } from "../../components/landing/StatisticSection";
import { getNews } from "../../services/api";

export default function BeritaPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const retryNews = () => {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  };

  useEffect(() => {
    let cancelled = false;

    getNews({ limit: 6 })
      .then((newsItems) => {
        if (!cancelled) setItems(newsItems);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Terjadi kesalahan saat memuat berita.");
          setItems([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">
              Berita terkini
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#111827]">
              Seputar Pernikahan Dini di Jawa Barat
            </h1>
          </div>

          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-[#D1D5DB] px-4 py-2 text-sm font-medium text-[#111827] transition hover:border-[#111827]"
          >
            Kembali ke Beranda
          </Link>
        </div>

        <NewsCardGrid items={items} loading={loading} error={error} onRetry={retryNews} />
      </div>
    </div>
  );
}
