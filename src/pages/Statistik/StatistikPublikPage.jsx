
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

  if (!Number.isFinite(number)) return "0";

  return new Intl.NumberFormat("id-ID").format(number);
}

function extractList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.results)) return response.results;

  return [];
}

function aggregateByRegion(data, valueGetter) {
  const result = {};

  data.forEach((item) => {
    const region = getStatistikRegion(item);

    if (!region) return;

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
  },
  {
    key: "putusSekolah",
    label: "Putus Sekolah",
    description: "Total kasus putus sekolah",
    icon: "📚",
  },
  {
    key: "stunting",
    label: "Stunting",
    description: "Jumlah balita gizi kurang",
    icon: "📏",
  },
  {
    key: "kemiskinan",
    label: "Kemiskinan",
    description: "Penduduk miskin",
    icon: "💰",
  },
];

/* =========================================================
   MODERN STATISTIC CARD
========================================================= */

function ModernStatisticCard({ config, loading, value }) {
  return (
    <div className="relative min-h-[175px] overflow-hidden rounded-2xl border border-[#0071FA] bg-[#0071FA] p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#0056D6] hover:shadow-lg">

      {/* Dekorasi Card */}
      <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-12 -right-4 h-28 w-28 rounded-full bg-white/10" />

      {/* Header Card */}
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-xl">
          {config.icon}
        </div>

        <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          Jawa Barat
        </span>
      </div>

      {/* Informasi */}
      <div className="relative mt-4">
        <p className="text-sm font-bold text-white">
          {config.label}
        </p>

        <p className="mt-1 text-xs text-blue-100">
          {config.description}
        </p>
      </div>

      {/* Nilai Statistik */}
      <div className="relative mt-4 border-t border-white/20 pt-3">
        {loading ? (
          <div className="h-8 w-28 animate-pulse rounded bg-white/20" />
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-white">
              {formatNumber(value)}
            </span>

            {config.key === "kemiskinan" && (
              <span className="text-xs font-medium text-blue-100">
                ribu
              </span>
            )}
          </div>
        )}

        <p className="mt-1 text-[10px] font-medium text-blue-100">
          Data statistik
        </p>
      </div>
    </div>
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

      if (!mounted) return;

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
        total + (Number(item?.jumlah_perkawinan) || 0),
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
        (Number(item?.jumlah_balita_gizi_kurang) || 0),
      0
    );

    const totalKemiskinan = data.kemiskinan.reduce(
      (total, item) =>
        total +
        (Number(item?.jumlah_penduduk_miskin_maret_ribu) || 0),
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
        color: "#0071FA",
        unit: "balita",
        data: data.stunting,
        valueGetter: (item) =>
          Number(item?.jumlah_balita_gizi_kurang) || 0,
      },
      {
        key: "kemiskinan",
        label: "Kemiskinan",
        color: "#0056D6",
        unit: "penduduk",
        data: data.kemiskinan,
        valueGetter: (item) =>
          Number(item?.jumlah_penduduk_miskin_maret_ribu) *
            1000 || 0,
      },
      {
        key: "putus-sekolah",
        label: "Putus Sekolah",
        color: "#60A5FA",
        unit: "kasus",
        data: data.putusSekolah,
        valueGetter: getPutusSekolahValue,
      },
    ],
    [data]
  );

  const selectedComparisonConfig =
    comparisonOptions.find(
      (item) => item.key === selectedComparison
    ) || comparisonOptions[0];

  /* =======================================================
     CHART DATA
  ======================================================= */

  const correlationData = useMemo(() => {
    if (!selectedComparisonConfig) return [];

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
        wilayah:
          primary[key]?.region ||
          secondary[key]?.region,

        dispensasi_nikah:
          primary[key]?.value || 0,

        secondaryValue:
          secondary[key]?.value || 0,
      }))
      .sort(
        selectedComparisonConfig.key === "putus-sekolah"
          ? (a, b) =>
              b.secondaryValue - a.secondaryValue
          : (a, b) =>
              b.dispensasi_nikah - a.dispensasi_nikah
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
    <div className="min-h-screen bg-white text-slate-900">

      <Navbar />

      {/* HERO */}
      <section className="relative bg-white">
        <div className="relative mx-auto max-w-7xl px-5 pb-8 pt-28 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">

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
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Statistik & Data
              <br />

              <span className="text-[#0071FA]">
                Pernikahan Dini
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Pantau data pernikahan dini dan indikator
              sosial terkait di wilayah Jawa Barat melalui
              visualisasi data yang informatif dan mudah
              dipahami.
            </p>
          </motion.div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="relative mx-auto max-w-7xl px-5 pb-20 pt-6 sm:px-6 lg:px-8">

        {/* STATISTIC CARDS */}
        <section>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {STATISTIC_CARDS.map((card, index) => (
              <ModernStatisticCard
                key={card.key}
                config={card}
                index={index}
                loading={loading}
                value={summaryValues[card.key]}
              />
            ))}

          </div>
        </section>

        {/* ERROR INFO */}
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
            className="mt-6 rounded-xl border border-[#0071FA]/20 bg-[#0071FA]/5 px-5 py-4"
          >
            <p className="text-sm font-semibold text-[#0056D6]">
              Beberapa data statistik belum dapat dimuat.
            </p>

            <p className="mt-1 text-xs text-[#0071FA]">
              Data yang tersedia tetap ditampilkan pada halaman.
            </p>
          </motion.div>
        )}

        {/* COMPARISON CHART */}
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
          <div className="overflow-hidden rounded-[24px] bg-white">

            {/* Chart Header */}
            <div className="px-4 py-5 sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-3">
                  <div className="h-10 w-1 rounded-full bg-[#0071FA]" />

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Perbandingan Indikator
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Dispensasi nikah dibandingkan dengan
                      indikator sosial terkait.
                    </p>
                  </div>
                </div>

                {/* Comparison Selector */}
                <div className="flex flex-wrap gap-2">
                  {comparisonOptions.map((option) => {
                    const active =
                      selectedComparison === option.key;

                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() =>
                          setSelectedComparison(option.key)
                        }
                        className={`rounded-lg px-4 py-2.5 text-xs font-bold transition-all ${
                          active
                            ? "bg-[#0071FA] text-white shadow-sm"
                            : "border border-slate-200 bg-white text-slate-600 hover:border-[#0071FA] hover:bg-[#0071FA]/5 hover:text-[#0071FA]"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* Chart */}
            <div className="px-2 pb-2 sm:px-4 sm:pb-4">
              {loading ? (
                <div
                  className="flex items-center justify-center"
                  style={{
                    height: correlationChartHeight,
                  }}
                >
                  <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#0071FA]/20 border-t-[#0071FA]" />

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
                  primaryColor="#0071FA"
                  primaryUnit="kasus"
                  secondaryDataKey="secondaryValue"
                  secondaryName={
                    selectedComparisonConfig?.label ||
                    "Indikator"
                  }
                  secondaryColor={
                    selectedComparisonConfig?.color ||
                    "#0056D6"
                  }
                  secondaryUnit={
                    selectedComparisonConfig?.unit || ""
                  }
                />
              )}
            </div>
          </div>
        </motion.section>

        {/* MAP SECTION */}
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
          <div className="overflow-hidden rounded-[24px] bg-white">

            {/* Map Header */}
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-1 rounded-full bg-[#0071FA]" />

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Persebaran Pernikahan Dini
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Distribusi data berdasarkan wilayah
                    kabupaten/kota di Jawa Barat.
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="px-2 pb-2 sm:px-4 sm:pb-4">
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
