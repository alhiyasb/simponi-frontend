import React from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* =========================================================
   DOUBLE AXIS CHART
   ========================================================= */

export function DoubleAxisChart({
  data = [],
  height = 500,
  loading = false,

  primaryDataKey = "jumlah",
  secondaryDataKey = "jumlah_korelasi",

  primaryName = "Pernikahan Dini",
  secondaryName = "Korelasi",

  primaryColor = "#155DFC",
  secondaryColor = "#10B981",

  primaryUnit = "kasus",
  secondaryUnit = "%",

  primaryYAxisMin = 0,
  primaryYAxisMax,

  secondaryYAxisMin = 0,
  secondaryYAxisMax,
}) {
  /* =======================================================
     LOADING
     ======================================================= */

  if (loading) {
    return (
      <div
        className="flex items-center justify-center rounded-3xl bg-white"
        style={{ height }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#155DFC]" />

          <p className="text-sm font-medium text-slate-500">
            Memuat data statistik...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     EMPTY DATA
     ======================================================= */

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-3xl bg-white"
        style={{ height }}
      >
        <div className="text-center">
          <div className="mb-3 text-4xl">📊</div>

          <p className="font-semibold text-slate-700">
            Data belum tersedia
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Belum ada data yang dapat ditampilkan.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     NORMALIZE DATA
     ======================================================= */

  const chartData = data.map((item, index) => {
    const rawRegion =
      item?.wilayah ||
      item?.nama_kabupaten_kota ||
      item?.kabupaten_kota ||
      item?.kabupaten ||
      item?.nama_wilayah ||
      `Wilayah ${index + 1}`;

    /*
     * Membersihkan:
     * - newline
     * - carriage return
     * - spasi berlebih
     *
     * Contoh:
     * "KABUPATEN\nTASIKMALAYA"
     * menjadi:
     * "KABUPATEN TASIKMALAYA"
     */
    const wilayah = String(rawRegion)
      .replace(/\r?\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const primaryValue = Number(
      item?.[primaryDataKey]
    );

    const secondaryValue = Number(
      item?.[secondaryDataKey]
    );

    return {
      ...item,

      wilayah,

      [primaryDataKey]: Number.isFinite(primaryValue)
        ? primaryValue
        : 0,

      [secondaryDataKey]: Number.isFinite(secondaryValue)
        ? secondaryValue
        : 0,
    };
  });

  /* =======================================================
     PRIMARY RANGE
     ======================================================= */

  const primaryValues = chartData.map((item) =>
    Number(item?.[primaryDataKey]) || 0
  );

  const secondaryValues = chartData.map((item) =>
    Number(item?.[secondaryDataKey]) || 0
  );

  const maxPrimary = Math.max(
    ...primaryValues,
    Number(primaryYAxisMin) || 0
  );

  const maxSecondary = Math.max(
    ...secondaryValues,
    Number(secondaryYAxisMin) || 0
  );

  const safePrimaryMax =
    primaryYAxisMax !== undefined
      ? primaryYAxisMax
      : Math.ceil(maxPrimary * 1.1 || 1);

  const safeSecondaryMax =
    secondaryYAxisMax !== undefined
      ? secondaryYAxisMax
      : Math.ceil(maxSecondary * 1.1 || 1);

  /* =======================================================
     FORMAT TOOLTIP
     ======================================================= */

  const formatNumber = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return "0";
    }

    return new Intl.NumberFormat("id-ID").format(number);
  };

  /* =======================================================
     CUSTOM Y AXIS TICK
     ======================================================= */

  const CustomYAxisTick = (props) => {
    const {
      x,
      y,
      payload,
    } = props;

    /*
     * Pastikan nama wilayah selalu menjadi
     * SATU BARIS.
     */
    const label = String(
      payload?.value || ""
    )
      .replace(/\r?\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return (
      <text
        x={x - 12}
        y={y}
        textAnchor="end"
        dominantBaseline="central"
        fill="#334155"
        fontSize={10}
        fontWeight={600}
        style={{
          whiteSpace: "nowrap",
          overflow: "visible",
        }}
      >
        {label}
      </text>
    );
  };

  /* =======================================================
     CUSTOM TOOLTIP
     ======================================================= */

  const CustomTooltip = ({
    active,
    payload,
    label,
  }) => {
    if (
      !active ||
      !payload ||
      payload.length === 0
    ) {
      return null;
    }

    const cleanLabel = String(label || "")
      .replace(/\r?\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return (
      <div className="min-w-[220px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
        <p className="mb-3 border-b border-slate-100 pb-2 text-sm font-bold text-slate-800">
          {cleanLabel}
        </p>

        {payload.map((entry, index) => {
          const value = entry?.value ?? 0;

          const name =
            entry?.dataKey === primaryDataKey
              ? primaryName
              : secondaryName;

          const unit =
            entry?.dataKey === primaryDataKey
              ? primaryUnit
              : secondaryUnit;

          return (
            <div
              key={`${entry?.dataKey}-${index}`}
              className="mb-2 flex items-center justify-between gap-5 last:mb-0"
            >
              <span className="text-xs text-slate-500">
                {name}
              </span>

              <span className="text-sm font-bold text-slate-800">
                {formatNumber(value)}{" "}
                <span className="font-normal text-slate-400">
                  {unit}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div
      className="w-full overflow-hidden rounded-3xl bg-white"
      style={{ height }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <ComposedChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 35,
            right: 65,
            left: 15,
            bottom: 35,
          }}
        >
          {/* =================================================
              GRID
             ================================================= */}

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E2E8F0"
            horizontal={false}
          />

          {/* =================================================
              PRIMARY X AXIS
             ================================================= */}

          <XAxis
            xAxisId="primary"
            type="number"
            orientation="bottom"
            domain={[
              primaryYAxisMin,
              safePrimaryMax,
            ]}
            tickLine={false}
            axisLine={{
              stroke: "#CBD5E1",
            }}
            tick={{
              fill: "#64748B",
              fontSize: 10,
            }}
            tickFormatter={(value) =>
              formatNumber(value)
            }
          />

          {/* =================================================
              SECONDARY X AXIS
             ================================================= */}

          <XAxis
            xAxisId="secondary"
            type="number"
            orientation="top"
            domain={[
              secondaryYAxisMin,
              safeSecondaryMax,
            ]}
            tickLine={false}
            axisLine={{
              stroke: "#CBD5E1",
            }}
            tick={{
              fill: "#64748B",
              fontSize: 10,
            }}
            tickFormatter={(value) =>
              formatNumber(value)
            }
          />

          {/* =================================================
              Y AXIS

              PENTING:
              Custom tick dipakai supaya nama kabupaten/
              kota TIDAK WRAP menjadi dua baris.
             ================================================= */}

          <YAxis
            type="category"
            dataKey="wilayah"
            width={235}
            tickLine={false}
            axisLine={false}
            interval={0}
            tick={CustomYAxisTick}
          />

          {/* =================================================
              TOOLTIP
             ================================================= */}

          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              fill: "rgba(21, 93, 252, 0.04)",
            }}
          />

          {/* =================================================
              LEGEND
             ================================================= */}

          <Legend
            verticalAlign="bottom"
            height={30}
            iconType="circle"
            wrapperStyle={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#475569",
            }}
          />

          {/* =================================================
              PRIMARY BAR

              Contoh:
              Pernikahan Dini / Dispensasi Nikah
             ================================================= */}

          <Bar
            xAxisId="primary"
            dataKey={primaryDataKey}
            name={primaryName}
            fill={primaryColor}
            radius={[
              0,
              8,
              8,
              0,
            ]}
            barSize={18}
          />

          {/* =================================================
              SECONDARY LINE

              Contoh:
              Stunting / Kemiskinan / Putus Sekolah
             ================================================= */}

          <Line
            xAxisId="secondary"
            type="monotone"
            dataKey={secondaryDataKey}
            name={secondaryName}
            stroke={secondaryColor}
            strokeWidth={3}
            dot={{
              r: 4,
              strokeWidth: 2,
              fill: "#FFFFFF",
            }}
            activeDot={{
              r: 6,
              strokeWidth: 2,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}