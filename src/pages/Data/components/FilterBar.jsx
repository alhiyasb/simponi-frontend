const SELECT_STYLE = {
  width: '100%',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 14,
  padding: '12px 42px 12px 14px',
  background: 'rgba(255,255,255,0.06)',
  fontSize: 14,
  fontWeight: 500,
  color: '#FFFFFF',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'auto',
  boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
  transition: 'all 0.2s ease',
};

const LABEL_STYLE = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  color: 'rgba(255,255,255,0.72)',
  marginBottom: 7,
};

const FILTER_ITEM_STYLE = {
  flex: '1 1 200px',
  minWidth: 180,
};

export function FilterBar({
  years,
  kabupatens,
  filters,
  onChange,
  loading = false,
}) {
  const { tahun, kabupaten, kategoriChart } = filters;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        gap: 20,
        padding: '20px 22px',
        marginBottom: 24,
        background:
          'linear-gradient(135deg, rgba(17,17,17,0.98), rgba(29,29,29,0.96))',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 4,
          height: '100%',
          background: 'linear-gradient(180deg, #FFFFFF, #D1D5DB)',
          borderRadius: '20px 0 0 20px',
        }}
      />

      {/* Tahun */}
      <div style={FILTER_ITEM_STYLE}>
        <label htmlFor="filter-tahun" style={LABEL_STYLE}>
          Tahun
        </label>

        <select
          id="filter-tahun"
          value={tahun}
          onChange={(e) => onChange('tahun', e.target.value)}
          disabled={loading}
          style={SELECT_STYLE}
          onFocus={(e) => {
            e.target.style.borderColor = '#FFFFFF';
            e.target.style.boxShadow =
              '0 0 0 4px rgba(255,255,255,0.12)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.12)';
            e.target.style.boxShadow =
              '0 4px 14px rgba(0,0,0,0.18)';
          }}
        >
          <option value="ALL">Semua Tahun</option>

          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Kabupaten */}
      <div style={FILTER_ITEM_STYLE}>
        <label htmlFor="filter-kabupaten" style={LABEL_STYLE}>
          Kabupaten/Kota
        </label>

        <select
          id="filter-kabupaten"
          value={kabupaten}
          onChange={(e) => onChange('kabupaten', e.target.value)}
          disabled={loading}
          style={SELECT_STYLE}
          onFocus={(e) => {
            e.target.style.borderColor = '#FFFFFF';
            e.target.style.boxShadow =
              '0 0 0 4px rgba(255,255,255,0.12)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.12)';
            e.target.style.boxShadow =
              '0 4px 14px rgba(0,0,0,0.18)';
          }}
        >
          <option value="ALL">Semua Kabupaten</option>

          {kabupatens.map((kab) => (
            <option key={kab} value={kab}>
              {kab}
            </option>
          ))}
        </select>
      </div>

      {/* Kategori */}
      <div style={FILTER_ITEM_STYLE}>
        <label htmlFor="filter-kategori" style={LABEL_STYLE}>
          Kategori Chart
        </label>

        <select
          id="filter-kategori"
          value={kategoriChart}
          onChange={(e) => onChange('kategoriChart', e.target.value)}
          disabled={loading}
          style={SELECT_STYLE}
          onFocus={(e) => {
            e.target.style.borderColor = '#FFFFFF';
            e.target.style.boxShadow =
              '0 0 0 4px rgba(255,255,255,0.12)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255,255,255,0.12)';
            e.target.style.boxShadow =
              '0 4px 14px rgba(0,0,0,0.18)';
          }}
        >
          <option value="kabupaten">Kabupaten/Kota</option>
          <option value="tahun">Tahun</option>
          <option value="jenis_kelamin">Jenis Kelamin</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 44,
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              border: '2px solid rgba(255,255,255,0.18)',
              borderTopColor: '#FFFFFF',
              borderRadius: '50%',
              animation: 'filterSpin 0.8s linear infinite',
            }}
          />

          Memuat...
        </div>
      )}

      <style>
        {`
          @keyframes filterSpin {
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}