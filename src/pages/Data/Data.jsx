import React, { useEffect, useMemo, useState } from 'react';

const API_URL = `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/+$/, '')}/v1/statistik/pernikahan-dini`;

function toArrayData(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

export default function DataPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'ngrok-skip-browser-warning': 'true',
      },
    });

        if (!response.ok) {
          throw new Error(`Request gagal (${response.status})`);
        }

        const payload = await response.json();
        const list = toArrayData(payload);
        setData(list);
      } catch (err) {
        const message = err?.message || 'Gagal mengambil data dari API.';
        setError(
          message.includes('Failed to fetch') || message.includes('connect')
            ? 'Tidak dapat terhubung ke backend. Pastikan server API sudah berjalan di 127.0.0.1:8000.'
            : message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const years = useMemo(
    () => [...new Set(data.map((item) => Number(item.tahun)).filter((year) => !Number.isNaN(year)))].sort((a, b) => b - a),
    [data]
  );

  const filteredData = useMemo(() => {
    if (selectedYear === 'ALL') return data;
    return data.filter((item) => Number(item.tahun) === Number(selectedYear));
  }, [data, selectedYear]);

  const totalJumlah = filteredData.reduce((sum, item) => sum + Number(item.jumlah_perkawinan || 0), 0);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  // Reset page when filter or pageSize changes
  useEffect(() => {
    setPage(1);
  }, [selectedYear, pageSize]);

  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #eaf4ff 0%, #f8fbff 100%)',
      fontFamily: 'Inter, Arial, sans-serif',
      color: '#0f172a',
      padding: '32px 20px 60px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid #dbeafe',
          borderRadius: 18,
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)',
          padding: '24px 24px 20px',
          marginBottom: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: '#2563eb', fontWeight: 700 }}>
                Statistik Pernikahan Dini
              </div>
              <h1 style={{ margin: '8px 0 0', fontSize: 'clamp(24px, 3vw, 42px)', lineHeight: 1.2 }}>Data API</h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <label htmlFor="yearFilter" style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>Tahun:</label>
              <select
                id="yearFilter"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: 10,
                  padding: '10px 12px',
                  background: '#fff',
                  fontSize: 14,
                  minWidth: 150,
                }}
              >
                <option value="ALL">Semua tahun</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginTop: 20 }}>
            <StatCard label="Total data" value={filteredData.length} />
            <StatCard label="Jumlah perkawinan" value={totalJumlah.toLocaleString('id-ID')} />
            <StatCard label="Provinsi" value={new Set(filteredData.map((item) => item.nama_provinsi)).size} />
            <StatCard label="Tahun aktif" value={selectedYear === 'ALL' ? `${years[0] || '-'} / ${years[years.length - 1] || '-'}` : selectedYear} />
          </div>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: 18,
          border: '1px solid #e2e8f0',
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.04)',
          overflow: 'hidden',
        }}>
          {loading ? (
            <div style={{ padding: 28, textAlign: 'center', color: '#475569' }}>Memuat data...</div>
          ) : error ? (
            <div style={{ padding: 28, textAlign: 'center', color: '#b91c1c', fontWeight: 600 }}>{error}</div>
          ) : filteredData.length === 0 ? (
            <div style={{ padding: 28, textAlign: 'center', color: '#475569' }}>Tidak ada data untuk filter yang dipilih.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 960 }}>
                <thead>
                  <tr style={{ background: '#eff6ff' }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>Provinsi</th>
                    <th style={thStyle}>Kabupaten/Kota</th>
                    <th style={thStyle}>Jenis Kelamin</th>
                    <th style={thStyle}>Jumlah</th>
                    <th style={thStyle}>Satuan</th>
                    <th style={thStyle}>Tahun</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, index) => (
                    <tr key={`${item.id || index}-${item.nama_kabupaten_kota}-${item.tahun}`} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={tdStyle}>{item.id}</td>
                      <td style={tdStyle}>{item.nama_provinsi}</td>
                      <td style={tdStyle}>{item.nama_kabupaten_kota}</td>
                      <td style={tdStyle}>{item.jenis_kelamin}</td>
                      <td style={{ ...tdStyle, fontWeight: 700, color: '#0f172a' }}>{Number(item.jumlah_perkawinan || 0).toLocaleString('id-ID')}</td>
                      <td style={tdStyle}>{item.satuan}</td>
                      <td style={tdStyle}>{item.tahun}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Pagination controls */}
        {filteredData.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <div style={{ color: '#475569' }}>
              Menampilkan {Math.min((page - 1) * pageSize + 1, filteredData.length)} - {Math.min(page * pageSize, filteredData.length)} dari {filteredData.length} baris
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', background: page <= 1 ? '#f1f5f9' : '#fff' }}>Prev</button>
              <div style={{ fontWeight: 700 }}>{page} / {totalPages}</div>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #e2e8f0', background: page >= totalPages ? '#f1f5f9' : '#fff' }}>Next</button>

              <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} style={{ marginLeft: 8, padding: '8px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: 14,
      padding: '18px 16px',
    }}>
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', fontWeight: 700 }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{value}</div>
    </div>
  );
}

const thStyle = {
  padding: '14px 16px',
  textAlign: 'left',
  fontSize: 12,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#334155',
  borderBottom: '1px solid #cbd5e1',
};

const tdStyle = {
  padding: '14px 16px',
  fontSize: 14,
  color: '#1e293b',
  whiteSpace: 'nowrap',
};
