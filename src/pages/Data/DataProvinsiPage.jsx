import { useState, useMemo, useCallback } from 'react';
import { useStatistikData } from '../../hooks/useStatistikData';
import Navbar from '../../components/layout/Navbar';
import {
  Card,
  FilterBar,
  StatisticsCards,
  CaseBarChart,
  CaseTable,
} from './components';

const PAGE_STYLE = {
  minHeight: '100vh',
  background:
    'linear-gradient(135deg, #F8FBFF 0%, #EEF5FF 45%, #FFFFFF 100%)',
  fontFamily:
    "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  color: '#0F172A',
  padding: '140px 20px 60px',
};

const CONTAINER_STYLE = {
  maxWidth: 1200,
  margin: '0 auto',
};

const HEADER_STYLE = {
  marginBottom: 8,
};

const TITLE_STYLE = {
  margin: 0,
  fontSize: 'clamp(24px, 3vw, 36px)',
  fontWeight: 700,
  color: '#0F172A',
  lineHeight: 1.2,
};

const SUBTITLE_STYLE = {
  margin: '8px 0 0',
  fontSize: 14,
  color: '#64748B',
  fontWeight: 400,
};

const ERROR_STYLE = {
  padding: '24px',
  textAlign: 'center',
  color: '#B91C1C',
  fontWeight: 600,
  background: '#FEF2F2',
  border: '1px solid #FECACA',
  borderRadius: 12,
  marginBottom: 24,
};

const EMPTY_STYLE = {
  padding: '48px 24px',
  textAlign: 'center',
  color: '#64748B',
};

export default function DataProvinsiPage() {
  const {
    loading,
    error,
    refetch,
    filters,
    setFilters,
    resetFilters,
    filteredData,
    stats,
    chartData,
    years,
    kabupatens,
  } = useStatistikData();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredData.length / pageSize)),
    [filteredData.length, pageSize]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      setPage(Math.max(1, Math.min(newPage, totalPages)));
    },
    [totalPages]
  );

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setPage(1);
  }, []);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const hasActiveFilters =
    filters.tahun !== 'ALL' || filters.kabupaten !== 'ALL';

  if (error) {
    return (
      <>
        <Navbar />

        <div style={PAGE_STYLE}>
          <div style={CONTAINER_STYLE}>
            <div style={ERROR_STYLE}>
              {error}

              <button
                onClick={refetch}
                style={{
                  marginTop: 12,
                  padding: '10px 20px',
                  background: '#0164DD',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div style={PAGE_STYLE}>
        <div style={CONTAINER_STYLE}>
          <div style={HEADER_STYLE}>
            <h1 style={TITLE_STYLE}>Statistik Kasus - Provinsi</h1>

            <p style={SUBTITLE_STYLE}>
              Visualisasi data pernikahan dini tingkat provinsi. Gunakan
              filter untuk menyesuaikan tampilan.
            </p>
          </div>

          <FilterBar
            years={years}
            kabupatens={kabupatens}
            filters={filters}
            onChange={setFilters}
            loading={loading}
          />

          <StatisticsCards stats={stats} />

          <Card
            title="Distribusi Kasus"
            subtitle={
              filters.kategoriChart === 'kabupaten'
                ? 'Top 15 Kabupaten/Kota berdasarkan jumlah kasus'
                : filters.kategoriChart === 'tahun'
                  ? 'Distribusi kasus per tahun'
                  : 'Distribusi kasus per jenis kelamin'
            }
          >
            <CaseBarChart data={chartData} loading={loading} />
          </Card>

          <Card
            title="Detail Data"
            subtitle={`${filteredData.length} total record${
              filteredData.length !== 1 ? 's' : ''
            }${hasActiveFilters ? ' (terfilter)' : ''}`}
          >
            {loading ? (
              <div
                style={{
                  padding: 28,
                  textAlign: 'center',
                  color: '#475569',
                }}
              >
                Memuat data...
              </div>
            ) : filteredData.length === 0 ? (
              <div style={EMPTY_STYLE}>
                <svg
                  width="48"
                  height="48"
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
                    margin: '0 0 8px',
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  Tidak ada data untuk filter ini
                </p>

                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                  }}
                >
                  Coba reset filter atau pilih kombinasi lain
                </p>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    style={{
                      marginTop: 16,
                      padding: '10px 20px',
                      background: '#0164DD',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            ) : (
              <CaseTable
                data={paginatedData}
                pagination={{
                  page,
                  pageSize,
                  totalPages,
                  onPageChange: handlePageChange,
                  onPageSizeChange: handlePageSizeChange,
                }}
              />
            )}
          </Card>
        </div>
      </div>
    </>
  );
}