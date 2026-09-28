const TH_STYLE = {
  padding: '15px 16px',
  textAlign: 'left',
  fontSize: 11,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#FFFFFF',
  borderBottom: 'none',
  background: 'linear-gradient(90deg, #155DFC, #3B82F6)',
  fontWeight: 700,
};

const TD_STYLE = {
  padding: '15px 16px',
  fontSize: 14,
  color: '#1E293B',
  whiteSpace: 'nowrap',
  borderBottom: '1px solid #E8F0FF',
};

const TABLE_WRAPPER_STYLE = {
  overflowX: 'auto',
  borderRadius: 16,
  border: '1px solid #DCE7FF',
  boxShadow: '0 6px 24px rgba(21, 93, 252, 0.05)',
};

const TABLE_STYLE = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: 960,
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const PAGINATION_STYLE = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 16,
  paddingTop: 16,
  borderTop: '1px solid #E2E8F0',
  flexWrap: 'wrap',
  gap: 12,
};

const PAGE_INFO_STYLE = {
  color: '#475569',
  fontSize: 14,
};

const BUTTON_STYLE = (disabled) => ({
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #E2E8F0',
  background: disabled ? '#F1F5F9' : '#FFFFFF',
  color: disabled ? '#94A3B8' : '#0F172A',
  fontSize: 13,
  fontWeight: 500,
  cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'all 0.15s',
  minWidth: 80,
});

const SELECT_STYLE = {
  marginLeft: 8,
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #CBD5E1',
  background: '#FFFFFF',
  fontSize: 13,
  color: '#0F172A',
  outline: 'none',
  cursor: 'pointer',
};

export function CaseTable({ data, pagination }) {
  const { page, pageSize, totalPages, onPageChange, onPageSizeChange } = pagination;

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#64748B' }}>
        Tidak ada data untuk ditampilkan
      </div>
    );
  }

  return (
    <div>
      <div style={TABLE_WRAPPER_STYLE}>
        <table style={TABLE_STYLE}>
          <thead>
            <tr>
              <th style={TH_STYLE}>ID</th>
              <th style={TH_STYLE}>Provinsi</th>
              <th style={TH_STYLE}>Kabupaten/Kota</th>
              <th style={TH_STYLE}>Jenis Kelamin</th>
              <th style={TH_STYLE}>Jumlah</th>
              <th style={TH_STYLE}>Satuan</th>
              <th style={TH_STYLE}>Tahun</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
          <tr
            key={`${item.id || index}-${item.nama_kabupaten_kota}-${item.tahun}`}
            style={{
              background:
                index % 2 === 0
                  ? '#FFFFFF'
                  : '#F8FBFF',
            }}
          >
                <td style={TD_STYLE}>{item.id || '-'}</td>
                <td style={TD_STYLE}>{item.nama_provinsi || '-'}</td>
                <td style={TD_STYLE}>{item.nama_kabupaten_kota || '-'}</td>
                <td style={TD_STYLE}>{item.jenis_kelamin || '-'}</td>
                <td style={{ ...TD_STYLE, fontWeight: 700, color: '#0F172A' }}>
                  {Number(item.jumlah_perkawinan || 0).toLocaleString('id-ID')}
                </td>
                <td style={TD_STYLE}>{item.satuan || '-'}</td>
                <td style={TD_STYLE}>{item.tahun || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={PAGINATION_STYLE}>
        <div style={PAGE_INFO_STYLE}>
          Menampilkan{' '}
          <strong>{Math.min((page - 1) * pageSize + 1, data.length)}</strong>{' '}
          -{' '}
          <strong>{Math.min(page * pageSize, data.length)}</strong>{' '}
          dari <strong>{data.length}</strong> baris
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            style={BUTTON_STYLE(page <= 1)}
          >
            Prev
          </button>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>
            {page} / {totalPages}
          </div>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            style={BUTTON_STYLE(page >= totalPages)}
          >
            Next
          </button>

          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={SELECT_STYLE}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>
      </div>
    </div>
  );
}