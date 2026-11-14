import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNews } from "../../services/api";
import defaultNewsImage from "../../assets/images/seminar.jpeg";

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
      <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)]"
          >
            <div className="h-[220px] animate-pulse bg-neutral-200" />
            <div className="space-y-3 p-5">
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
      <div className="mt-10 rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] p-6 text-center">
        <p className="text-base font-medium text-[#1F2937]">
          Berita sedang tidak dapat dimuat.
        </p>
        <p className="mt-2 text-sm text-[#6B7280]">
          Silakan coba beberapa saat lagi.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full border border-[#D1D5DB] bg-white px-5 py-2 text-sm font-medium text-[#111827] transition hover:border-[#0071FA] hover:text-[#0071FA]"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <article
          key={`${item.link}-${item.title}-${index}`}
          className="group overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_8px_20px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0071FA] hover:shadow-[0_14px_30px_rgba(0,113,250,0.12)]"
        >
          {/* Gambar Berita */}
          <div className="relative h-[230px] overflow-hidden bg-gray-100">
            <img
              src={item.image || defaultNewsImage}
              alt={item.title || "Gambar berita"}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = defaultNewsImage;
              }}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Konten Berita */}
          <div className="p-5">
            <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#6B7280] transition-colors duration-200 group-hover:text-[#0071FA]">
              <span className="inline-flex items-center justify-center">
                🗓️
              </span>

              <span>{formatDate(item.published_at)}</span>
              <span className="mx-1">•</span>
              <span>{item.source || "Sumber berita"}</span>
            </div>

            <h3
              className="mt-3 text-[18px] font-bold leading-[1.45] text-[#111827] transition-colors duration-200 group-hover:text-[#0071FA]"
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
              className="mt-3 text-sm leading-[1.7] text-[#6B7280] transition-colors duration-200 group-hover:text-[#0071FA]"
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
              className="mt-5 inline-flex rounded-full border border-[#D1D5DB] px-5 py-2 text-sm font-medium text-[#111827] transition-all duration-200 hover:border-[#0071FA] hover:bg-[#EFF6FF] hover:text-[#0071FA]"
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
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[30px] font-extrabold tracking-[-0.03em] text-[#111827]">
            Berita Terkini Jawa Barat
          </h2>

          <Link
            to="/berita"
            className="inline-flex shrink-0 items-center rounded-full border border-[#D1D5DB] bg-white px-5 py-2 text-sm font-medium text-[#111827] transition-all duration-200 hover:border-[#0071FA] hover:bg-[#EFF6FF] hover:text-[#0071FA]"
          >
            Lihat Semua Berita
          </Link>
        </div>

        <NewsCardGrid
          items={items}
          loading={loading}
          error={error}
          onRetry={retryNews}
        />
      </div>
    </section>
  );
}