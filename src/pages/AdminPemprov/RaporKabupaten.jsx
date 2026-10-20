import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { getRaporKabupaten } from '../../services/api';

function formatAngka(value) {
  return new Intl.NumberFormat('id-ID').format(value ?? 0);
}

function formatPersen(value) {
  return `${Number(value ?? 0)}%`;
}

function StatusRapor({ status }) {
  const warna = {
    merah: {
      background: '#FEE2E2',
      color: '#B91C1C',
      label: 'Merah',
    },
    kuning: {
      background: '#FEF3C7',
      color: '#92400E',
      label: 'Kuning',
    },
    hijau: {
      background: '#DCFCE7',
      color: '#166534',
      label: 'Hijau',
    },
  };

  const style = warna[String(status ?? '').toLowerCase()] ?? {
    background: '#E5E7EB',
    color: '#374151',
    label: status || 'Belum ada status',
  };

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: '20px',
        background: style.background,
        color: style.color,
        fontSize: '12px',
        fontWeight: 700,
        textTransform: 'capitalize',
      }}
    >
      {style.label}
    </span>
  );
}

function KartuRingkasan({ judul, nilai, keterangan }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '14px',
        padding: '20px',
        minWidth: 0,
      }}
    >
      <p style={{ margin: 0, color: '#64748B', fontSize: '13px' }}>
        {judul}
      </p>

      <h2
        style={{
          margin: '12px 0 8px',
          fontSize: '25px',
          color: '#0F172A',
          overflowWrap: 'anywhere',
        }}
      >
        {nilai ?? '-'}
      </h2>

      <p style={{ margin: 0, color: '#64748B', fontSize: '12px' }}>
        {keterangan}
      </p>
    </div>
  );
}

export default function RaporKabupaten() {
  const [rapor, setRapor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function ambilData() {
      try {
        setLoading(true);
        setError('');

        const hasil = await getRaporKabupaten();
        setRapor(hasil);
      } catch (err) {
        setError(err.message || 'Gagal mengambil data rapor kabupaten.');
      } finally {
        setLoading(false);
      }
    }

    ambilData();
  }, []);

  return (
    <AdminLayout>
      <div
        style={{
          padding: '24px',
          background: '#F8FAFC',
          minHeight: '100%',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <h1
            style={{
              margin: '0 0 8px',
              fontSize: '28px',
              color: '#0F172A',
            }}
          >
            Rapor Kabupaten
          </h1>

          <p style={{ margin: 0, color: '#64748B' }}>
            Pantau volume laporan dan penyelesaian laporan di setiap kabupaten.
          </p>
        </div>

        {loading && (
          <div
            style={{
              padding: '24px',
              background: '#FFFFFF',
              borderRadius: '12px',
            }}
          >
            Memuat data rapor kabupaten...
          </div>
        )}

        {!loading && error && (
          <div
            role="alert"
            style={{
              padding: '16px',
              marginBottom: '20px',
              borderRadius: '12px',
              background: '#FEE2E2',
              color: '#B91C1C',
            }}
          >
            <p style={{ marginTop: 0 }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '9px 14px',
                border: 0,
                borderRadius: '8px',
                background: '#B91C1C',
                color: '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              Muat ulang halaman
            </button>
          </div>
        )}

        {!loading && !error && rapor && (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <KartuRingkasan
                judul="Kabupaten Aktif"
                nilai={formatAngka(rapor.total_kabupaten_aktif)}
                keterangan="Kabupaten dalam data rapor"
              />

              <KartuRingkasan
                judul="Rapor Merah"
                nilai={formatAngka(rapor.kabupaten_rapor_merah)}
                keterangan="Kabupaten dengan status merah"
              />

              <KartuRingkasan
                judul="Volume Laporan Tertinggi"
                nilai={rapor.kabupaten_volume_tertinggi || '-'}
                keterangan="Kabupaten dengan laporan terbanyak"
              />

              <KartuRingkasan
                judul="Kabupaten Terlambat"
                nilai={rapor.kabupaten_terlambat || '-'}
                keterangan="Berdasarkan hasil evaluasi BE"
              />
            </div>

            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '14px',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '20px 20px 12px' }}>
                <h2
                  style={{
                    margin: '0 0 6px',
                    fontSize: '19px',
                    color: '#0F172A',
                  }}
                >
                  Detail Rapor Kabupaten
                </h2>

                <p style={{ margin: 0, color: '#64748B', fontSize: '13px' }}>
                  Total {formatAngka(rapor.data?.length)} kabupaten pada hasil
                  API.
                </p>
              </div>

              {rapor.data?.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '13px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <thead>
                      <tr style={{ background: '#F1F5F9', color: '#475569' }}>
                        {[
                          'No.',
                          'Kode',
                          'Kabupaten',
                          'Total Laporan',
                          'Diajukan',
                          'Diproses',
                          'Selesai',
                          'Ditolak',
                          'Penyelesaian',
                          'Rapor',
                        ].map((judul) => (
                          <th
                            key={judul}
                            style={{
                              padding: '14px 16px',
                              textAlign: 'left',
                              borderBottom: '1px solid #E2E8F0',
                            }}
                          >
                            {judul}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {rapor.data.map((item, index) => (
                        <tr key={item.kode_kabupaten}>
                          <td style={gayaSel}>{index + 1}</td>
                          <td style={gayaSel}>{item.kode_kabupaten}</td>
                          <td style={{ ...gayaSel, fontWeight: 600 }}>
                            {item.nama_kabupaten}
                          </td>
                          <td style={gayaSel}>
                            {formatAngka(item.total_laporan)}
                          </td>
                          <td style={gayaSel}>
                            {formatAngka(item.diajukan)}
                          </td>
                          <td style={gayaSel}>
                            {formatAngka(item.diproses)}
                          </td>
                          <td style={gayaSel}>
                            {formatAngka(item.selesai)}
                          </td>
                          <td style={gayaSel}>
                            {formatAngka(item.ditolak)}
                          </td>
                          <td style={gayaSel}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                              }}
                            >
                              <div
                                style={{
                                  width: '90px',
                                  height: '7px',
                                  borderRadius: '10px',
                                  background: '#E2E8F0',
                                  overflow: 'hidden',
                                }}
                              >
                                <div
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.max(
                                        0,
                                        Number(item.persen_selesai) || 0
                                      )
                                    )}%`,
                                    height: '100%',
                                    background: '#2563EB',
                                    borderRadius: '10px',
                                  }}
                                />
                              </div>

                              <span>{formatPersen(item.persen_selesai)}</span>
                            </div>
                          </td>
                          <td style={gayaSel}>
                            <StatusRapor status={item.rapor} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ padding: '20px', color: '#64748B' }}>
                  Belum ada data rapor kabupaten.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

const gayaSel = {
  padding: '14px 16px',
  borderBottom: '1px solid #E2E8F0',
  color: '#334155',
};