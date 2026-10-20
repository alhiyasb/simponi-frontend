import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import Navbar from "../../components/layout/Navbar";
import { DoubleAxisChart } from "../Data/components";
import PetaPernikahanDini from "../Data/components/PetaPernikahanDini";

import {
  getPernikahanDini,
  getPutusSekolah,
  getStunting,
  getKemiskinan,
} from "../../services/api";
import {
  getPutusSekolahValue,
  getStatistikRegion,
  normalizeStatistikRegion,
} from "../../utils/statistik";

/* =========================================================
   HELPER
========================================================= */

function formatNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0";
  }

  return new Intl.NumberFormat("id-ID").format(number);
}

function extractList(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  return [];
}

function aggregateByRegion(data, valueGetter) {
  const result = {};

  data.forEach((item) => {
    const region = getStatistikRegion(item);

    if (!region) {
      return;
    }

    const key = normalizeStatistikRegion(region);

    if (!result[key]) {
      result[key] = {
        region,
        value: 0,
      };
    }

    result[key].value += Number(valueGetter(item)) || 0;
  });

  return result;
}

/* =========================================================
   STATISTIC CARD CONFIG
========================================================= */

const STATISTIC_CARDS = [
  {
    key: "pernikahanDini",
    label: "Pernikahan Dini",
    description: "Total kasus pernikahan dini",
    icon: "💍",
    accent: "rose",
    iconBg: "from-rose-500 to-pink-500",
    glow: "bg-rose-400/20",
  },
  {
    key: "putusSekolah",
    label: "Putus Sekolah",
    description: "Total kasus putus sekolah",
    icon: "📚",
    accent: "amber",
    iconBg: "from-amber-500 to-orange-500",
    glow: "bg-amber-400/20",
  },
  {
    key: "stunting",
    label: "Stunting",
    description: "Jumlah balita gizi kurang",
    icon: "📏",
    accent: "emerald",
    iconBg: "from-emerald-500 to-teal-500",
    glow: "bg-emerald-400/20",
  },
  {
    key: "kemiskinan",
    label: "Kemiskinan",
    description: "Penduduk miskin",
    icon: "💰",
    accent: "blue",
    iconBg: "from-blue-500 to-indigo-500",
    glow: "bg-blue-400/20",
  },
];

/* =========================================================
   ACCENT STYLE
========================================================= */

const accentStyles = {
  rose: {
    line: "bg-gradient-to-r from-rose-500 to-pink-400",
    text: "text-rose-600",
    soft: "bg-rose-50",
    border: "border-rose-100",
  },

  amber: {
    line: "bg-gradient-to-r from-amber-500 to-orange-400",
    text: "text-amber-600",
    soft: "bg-amber-50",
    border: "border-amber-100",
  },

  emerald: {
    line: "bg-gradient-to-r from-emerald-500 to-teal-400",
    text: "text-emerald-600",
    soft: "bg-emerald-50",
    border: "border-emerald-100",
  },

  blue: {
    line: "bg-gradient-to-r from-blue-500 to-indigo-500",
    text: "text-blue-600",
    soft: "bg-blue-50",
    border: "border-blue-100",
  },
};

/* =========================================================
   MODERN STATISTIC CARD
========================================================= */

function ModernStatisticCard({
  config,
  value,
  loading,
  index,
}) {
  const styles = accentStyles[config.accent];

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      whileHover={{
        y: -5,
      }}
      className="group relative"
    >
      {/* Glow ketika hover */}
      <div
        className={`absolute -inset-1 rounded-[28px] ${config.glow} opacity-0 blur-2xl transition duration-500 group-hover:opacity-100`}
      />

      {/* Card */}
      <div
        className={`relative min-h-[210px] overflow-hidden rounded-[24px] border bg-white ${styles.border} shadow-[0_10px_35px_rgba(15,23,42,0.07)] transition-all duration-500 group-hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)]`}
      >
        {/* Accent line */}
        <div
          className={`absolute left-0 right-0 top-0 h-[4px] ${styles.line}`}
        />

        {/* Decorative circle */}
        <div
          className={`absolute -right-12 -top-12 h-32 w-32 rounded-full ${styles.soft} opacity-70 transition-transform duration-500 group-hover:scale-125`}
        />

        <div className="relative flex min-h-[210px] flex-col p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            {/* Icon */}
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${config.iconBg} text-xl shadow-lg shadow-slate-200/60 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2`}
            >
              <span>{config.icon}</span>
            </div>

            {/* Wilayah */}
            <div
              className={`flex items-center gap-1.5 rounded-full ${styles.soft} px-3 py-1.5`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${styles.line}`}
              />

              <span
                className={`text-[10px] font-bold uppercase tracking-[0.12em] ${styles.text}`}
              >
                Jawa Barat
              </span>
            </div>
          </div>

          {/* Judul */}
          <div className="mt-5">
            <p className="text-sm font-bold tracking-tight text-slate-800">
              {config.label}
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              {config.description}
            </p>
          </div>

          {/* Nilai */}
          <div className="mt-auto pt-5">
            {loading ? (
              <div className="space-y-2">
                <div className="h-9 w-28 animate-pulse rounded-lg bg-slate-100" />

                <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
              </div>
            ) : (
              <>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                    {formatNumber(value)}
                  </span>

                  {config.key === "kemiskinan" && (
                    <span className="mb-1.5 text-xs font-semibold text-slate-400">
                      ribu
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <div
                    className={`h-1 w-8 rounded-full ${styles.line}`}
                  />

                  <span className="text-[11px] font-medium text-slate-400">
                    Data statistik
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function StatistikPublikPage() {
  const [data, setData] = useState({
    pernikahanDini: [],
    putusSekolah: [],
    stunting: [],
    kemiskinan: [],
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [selectedComparison, setSelectedComparison] =
    useState("stunting");

  /* =======================================================
     FETCH DATA
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      setLoading(true);

      const results = await Promise.allSettled([
        getPernikahanDini(),
        getPutusSekolah(),
        getStunting(),
        getKemiskinan(),
      ]);

      if (!mounted) {
        return;
      }

      const [
        pernikahanResult,
        putusResult,
        stuntingResult,
        kemiskinanResult,
      ] = results;

      const nextErrors = {};

      if (pernikahanResult.status === "rejected") {
        nextErrors.pernikahanDini =
          pernikahanResult.reason?.message ||
          "Data tidak dapat dimuat.";
      }

      if (putusResult.status === "rejected") {
        nextErrors.putusSekolah =
          putusResult.reason?.message ||
          "Data tidak dapat dimuat.";
      }

      if (stuntingResult.status === "rejected") {
        nextErrors.stunting =
          stuntingResult.reason?.message ||
          "Data tidak dapat dimuat.";
      }

      if (kemiskinanResult.status === "rejected") {
        nextErrors.kemiskinan =
          kemiskinanResult.reason?.message ||
          "Data tidak dapat dimuat.";
      }

      setErrors(nextErrors);

      setData({
        pernikahanDini:
          pernikahanResult.status === "fulfilled"
            ? extractList(pernikahanResult.value)
            : [],

        putusSekolah:
          putusResult.status === "fulfilled"
            ? extractList(putusResult.value)
            : [],

        stunting:
          stuntingResult.status === "fulfilled"
            ? extractList(stuntingResult.value)
            : [],

        kemiskinan:
          kemiskinanResult.status === "fulfilled"
            ? extractList(kemiskinanResult.value)
            : [],
      });

      setLoading(false);
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     SUMMARY VALUES
  ======================================================= */

  const summaryValues = useMemo(() => {
    const totalPernikahan = data.pernikahanDini.reduce(
      (total, item) =>
        total +
        (Number(item?.jumlah_perkawinan) || 0),
      0
    );

    const totalPutusSekolah = data.putusSekolah.reduce(
      (total, item) =>
        total + getPutusSekolahValue(item),
      0
    );

    const totalStunting = data.stunting.reduce(
      (total, item) =>
        total +
        (Number(
          item?.jumlah_balita_gizi_kurang
        ) || 0),
      0
    );

    const totalKemiskinan = data.kemiskinan.reduce(
      (total, item) =>
        total +
        (Number(
          item?.jumlah_penduduk_miskin_maret_ribu
        ) || 0),
      0
    );

    return {
      pernikahanDini: totalPernikahan,
      putusSekolah: totalPutusSekolah,
      stunting: totalStunting,
      kemiskinan: totalKemiskinan,
    };
  }, [data]);

  /* =======================================================
     COMPARISON OPTIONS
  ======================================================= */

  const comparisonOptions = useMemo(
    () => [
      {
        key: "stunting",
        label: "Stunting",
        color: "#10B981",
        unit: "balita",
        data: data.stunting,
        valueGetter: (item) =>
          Number(
            item?.jumlah_balita_gizi_kurang
          ) || 0,
      },

      {
        key: "kemiskinan",
        label: "Kemiskinan",
        color: "#9333EA",
        unit: "penduduk",
        data: data.kemiskinan,
        valueGetter: (item) =>
          Number(
            item?.jumlah_penduduk_miskin_maret_ribu
          ) * 1000 || 0,
      },

      {
        key: "putus-sekolah",
        label: "Putus Sekolah",
        color: "#F59E0B",
        unit: "kasus",
        data: data.putusSekolah,
        valueGetter: getPutusSekolahValue,
      },
    ],
    [data]
  );

  const selectedComparisonConfig =
    comparisonOptions.find(
      (item) =>
        item.key === selectedComparison
    ) || comparisonOptions[0];

  /* =======================================================
     CHART DATA
  ======================================================= */

  const correlationData = useMemo(() => {
    if (!selectedComparisonConfig) {
      return [];
    }

    const primary = aggregateByRegion(
      data.pernikahanDini,
      (item) =>
        Number(item?.jumlah_perkawinan) || 0
    );

    const secondary = aggregateByRegion(
      selectedComparisonConfig.data,
      selectedComparisonConfig.valueGetter
    );

    const regionKeys =
      selectedComparisonConfig.key === "putus-sekolah"
        ? new Set([
            ...Object.keys(primary),
            ...Object.keys(secondary),
          ])
        : new Set(Object.keys(primary));

    const chartRows = [...regionKeys]
      .map((key) => ({
        wilayah: primary[key]?.region || secondary[key]?.region,
        dispensasi_nikah: primary[key]?.value || 0,
        secondaryValue: secondary[key]?.value || 0,
      }))
      .sort(
        selectedComparisonConfig.key === "putus-sekolah"
          ? (a, b) => b.secondaryValue - a.secondaryValue
          : (a, b) => b.dispensasi_nikah - a.dispensasi_nikah
      );

    return selectedComparisonConfig.key === "putus-sekolah"
      ? chartRows
      : chartRows.slice(0, 15);
  }, [
    data.pernikahanDini,
    selectedComparisonConfig,
  ]);

  const correlationChartHeight =
    selectedComparison === "putus-sekolah"
      ? Math.max(500, correlationData.length * 26)
      : 500;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900">
      <Navbar />

      {/* ===================================================
          HERO
      =================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0B4DB8] via-[#155DFC] to-[#4388FF]">
        {/* Glow kiri */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        {/* Glow kanan */}
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="max-w-3xl"
          >
            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.8)]" />

              <span className="text-xs font-semibold tracking-wide text-white/90">
                STATISTIK PROVINSI JAWA BARAT
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Statistik & Data
              <br />

              <span className="text-blue-100">
                Pernikahan Dini
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-2xl text-sm leading-7 text-blue-100/90 sm:text-base">
              Pantau data pernikahan dini dan indikator
              sosial terkait di wilayah Jawa Barat melalui
              visualisasi data yang informatif dan mudah
              dipahami.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <main className="relative mx-auto -mt-10 max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">
        {/* =================================================
            4 MODERN STATISTIC CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {STATISTIC_CARDS.map(
            (card, index) => (
              <ModernStatisticCard
                key={card.key}
                config={card}
                index={index}
                loading={loading}
                value={summaryValues[card.key]}
              />
            )
          )}
        </div>

        {/* =================================================
            ERROR INFO
        ================================================= */}

        {Object.keys(errors).length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4"
          >
            <p className="text-sm font-semibold text-amber-800">
              Beberapa data statistik belum dapat dimuat.
            </p>

            <p className="mt-1 text-xs text-amber-700">
              Data yang tersedia tetap ditampilkan
              pada halaman.
            </p>
          </motion.div>
        )}

        {/* =================================================
            CHART SECTION
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mt-8"
        >
          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            {/* Chart Header */}
            <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-1 rounded-full bg-gradient-to-b from-blue-600 to-cyan-400" />

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Perbandingan Indikator
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        Dispensasi nikah dibandingkan
                        dengan indikator sosial terkait.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comparison selector */}
                <div className="flex flex-wrap gap-2">
                  {comparisonOptions.map(
                    (option) => {
                      const active =
                        selectedComparison ===
                        option.key;

                      return (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() =>
                            setSelectedComparison(
                              option.key
                            )
                          }
                          className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                            active
                              ? "bg-[#155DFC] text-white shadow-lg shadow-blue-500/20"
                              : "border border-slate-200 bg-white text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="p-4 sm:p-6">
              {loading ? (
                <div
                  className="flex items-center justify-center"
                  style={{ height: correlationChartHeight }}
                >
                  <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-[#155DFC]" />

                    <p className="mt-4 text-sm text-slate-400">
                      Memuat data statistik...
                    </p>
                  </div>
                </div>
              ) : (
                <DoubleAxisChart
                  data={correlationData}
                  height={correlationChartHeight}
                  primaryDataKey="dispensasi_nikah"
                  primaryName="Dispensasi Nikah"
                  primaryColor="#155DFC"
                  primaryUnit="kasus"
                  secondaryDataKey="secondaryValue"
                  secondaryName={
                    selectedComparisonConfig?.label ||
                    "Indikator"
                  }
                  secondaryColor={
                    selectedComparisonConfig?.color ||
                    "#10B981"
                  }
                  secondaryUnit={
                    selectedComparisonConfig?.unit ||
                    ""
                  }
                />
              )}
            </div>
          </div>
        </motion.section>

        {/* =================================================
            MAP
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mt-8"
        >
          <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            {/* Map Header */}
            <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-1 rounded-full bg-gradient-to-b from-blue-600 to-cyan-400" />

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Persebaran Pernikahan Dini
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Distribusi data berdasarkan wilayah
                    kabupaten/kota di Jawa Barat.
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="p-4 sm:p-6">
              <PetaPernikahanDini
                data={data.pernikahanDini}
              />
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}