import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNews } from "../../services/api";

const formatDate = (dateString) => {
  if (!dateString) return "Baru-baru ini";

  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(dateString));
  } catch {
    return "Baru-baru ini";
  }
};

const stripHtml = (text = "") =>
  text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function NewsCardGrid({ items, loading, error, onRetry }) {
  if (loading) {
    return (
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
          >
            <div className="h-[190px] animate-pulse bg-neutral-200" />
            <div className="space-y-3 p-4">
              <div className="h-3 w-28 animate-pulse rounded bg-neutral-200" />
              <div className="h-5 w-full animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] p-6 text-center">
        <p className="text-base font-medium text-[#1F2937]">Berita sedang tidak dapat dimuat.</p>
        <p className="mt-2 text-sm text-[#6B7280]">Silakan coba beberapa saat lagi.</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-medium text-[#111827] transition hover:border-[#111827]"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article
          key={`${item.link}-${item.title}`}
          className="group overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
        >
          <div className="relative h-[190px] overflow-hidden">
            {item.image ? (
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 text-sm font-semibold text-[#4B5563]">
                Berita Pernikahan Dini
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
              <span className="inline-flex h-4 w-4 items-center justify-center text-[12px]">🗓️</span>
              <span>{formatDate(item.published_at)}</span>
              <span className="mx-1">•</span>
              <span>{item.source || "Sumber berita"}</span>
            </div>

            <h3
              className="mt-3 text-[17px] font-bold leading-[1.45] text-[#111827]"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.title}
            </h3>

            <p
              className="mt-3 text-sm leading-[1.6] text-[#6B7280]"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {stripHtml(item.description || item.title)}
            </p>

            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex rounded-full border border-[#D1D5DB] px-4 py-2 text-sm font-medium text-[#111827] transition hover:border-[#111827] hover:bg-[#F3F4F6]"
            >
              Lihat Detail
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function StatisticSection() {
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

    getNews({ limit: 3 })
      .then((newsItems) => {
        if (!cancelled) setItems(newsItems);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Terjadi kesalahan saat mengambil berita.");
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
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[30px] font-extrabold tracking-[-0.03em] text-[#111827]">
            Berita Terkini Jawa Barat
          </h2>

          <Link
            to="/berita"
            className="inline-flex items-center rounded-full border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-medium text-[#111827] transition hover:border-[#111827] hover:bg-[#F9FAFB]"
          >
            Lihat Semua Berita
          </Link>
        </div>

        <NewsCardGrid items={items} loading={loading} error={error} onRetry={retryNews} />
      </div>
    </section>
  );
}
