import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

const COLORS = [
  '#155DFC',
  '#2874F0',
  '#3987F4',
  '#4B9AF5',
  '#5DADF6',
];

const TOOLTIP_STYLE = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #D9E5FF',
  borderRadius: 14,
  boxShadow: '0 12px 30px rgba(21, 93, 252, 0.14)',
  padding: '12px 16px',
};

const LABEL_STYLE = {
  fontSize: 11,
  fontWeight: 700,
  fill: '#334155',
  dx: 8,
};

const SKELETON_HEIGHTS = [
  35,
  55,
  45,
  70,
  40,
  60,
  50,
  65,
];

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const item = payload[0].payload;

    return (
      <div style={TOOLTIP_STYLE}>
        <p
          style={{
            margin: '0 0 5px',
            fontSize: 12,
            color: '#64748B',
            fontWeight: 600,
          }}
        >
          {item.kategori}
        </p>

        <p
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 800,
            color: '#155DFC',
          }}
        >
          {Number(item.jumlah).toLocaleString('id-ID')} kasus
        </p>
      </div>
    );
  }

  return null;
}

export function CaseBarChart({
  data,
  height = 380,
  showLabels = true,
  loading = false,
}) {
  if (loading) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'flex-end',
            height: '60%',
          }}
        >
          {SKELETON_HEIGHTS.map((h, i) => (
            <div
              key={i}
              style={{
                width: 34,
                height: `${h}%`,
                background:
                  'linear-gradient(180deg, #E8F0FF, #D9E5FF)',
                borderRadius: '8px 8px 0 0',
                animation:
                  'chartShimmer 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}

          <style>
            {`
              @keyframes chartShimmer {
                0%, 100% {
                  opacity: 0.45;
                }

                50% {
                  opacity: 1;
                }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748B',
          padding: 32,
          textAlign: 'center',
        }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{
            marginBottom: 16,
            opacity: 0.5,
          }}
        >
          <path d="M3 3v18h18" />
          <path d="M7 16l4-4 4 4 6-6" />
        </svg>

        <p
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Tidak ada data untuk visualisasi
        </p>

        <p
          style={{
            margin: '8px 0 0',
            fontSize: 14,
          }}
        >
          Coba ubah filter atau pilih kategori chart lain
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 10,
            right: 45,
            left: 10,
            bottom: 10,
          }}
        >
          <defs>
            <linearGradient
              id="caseBarGradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop
                offset="0%"
                stopColor="#155DFC"
              />

              <stop
                offset="100%"
                stopColor="#38BDF8"
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#EAF0FA"
            vertical={false}
            horizontal={true}
          />

          <XAxis
            type="number"
            tick={{
              fontSize: 11,
              fill: '#64748B',
            }}
            axisLine={{
              stroke: '#D9E5FF',
            }}
            tickLine={false}
            interval={0}
            tickCount={5}
            tickFormatter={(value) =>
              value.toLocaleString('id-ID')
            }
          />

          <YAxis
            type="category"
            dataKey="kategori"
            width={190}
            tick={{
              fontSize: 11,
              fill: '#334155',
              fontWeight: 600,
            }}
            axisLine={false}
            tickLine={false}
            interval={0}
          />

          <Tooltip content={CustomTooltip} />

          <Bar
            dataKey="jumlah"
            radius={[0, 8, 8, 0]}
            maxBarSize={28}
            minPointSize={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill="url(#caseBarGradient)"
              />
            ))}
          </Bar>

          {showLabels && (
            <LabelList
              dataKey="jumlah"
              position="right"
              offset={8}
              formatter={(value) =>
                Number(value).toLocaleString('id-ID')
              }
              style={LABEL_STYLE}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
