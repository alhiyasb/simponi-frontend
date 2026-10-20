import { useState, useMemo, useCallback } from 'react';
import Navbar from '../../components/layout/Navbar';
import { Link } from 'react-router-dom';
import { useStatistik } from '../../hooks/useStatistik';
import {
  Card,
  FilterBar,
  StatisticsCards,
  CaseBarChart,
  CaseTable,
} from '../Data/components';

function formatNumber(num) {
  return Number(num || 0).toLocaleString('id-ID');
}

const CATEGORY_CONFIG = {
  'pernikahan-dini': {
    title: 'Pernikahan Dini',
    subtitle: 'Visualisasi data pernikahan dini per kabupaten/kota',
    numericField: 'jumlah_perkawinan',
    hasGenderSplit: true,
    yAxisMin: 4000,
  },
  'putus-sekolah': {
    title: 'Putus Sekolah',
    subtitle: 'Visualisasi data putus sekolah per kabupaten/kota',
    numericField: 'jumlah_putus_sekolah',
    hasGenderSplit: false,
    yAxisMin: 0,
  },
  stunting: {
    title: 'Stunting',
    subtitle: 'Visualisasi data stunting per kabupaten/kota',
    numericField: 'jumlah_stunting',
    hasGenderSplit: false,
    yAxisMin: 4000,
  },
  'stunting-lokal': {
    title: 'Stunting Lokal',
    subtitle: 'Visualisasi data stunting lokal per kabupaten/kota',
    numericField: 'jumlah_stunting',
    hasGenderSplit: false,
    yAxisMin: 4000,
  },
  'stunting-bps': {
    title: 'Stunting BPS',
    subtitle: 'Visualisasi data stunting BPS per kabupaten/kota',
    numericField: 'jumlah_stunting',
    hasGenderSplit: false,
    yAxisMin: 4000,
  },
  kemiskinan: {
    title: 'Kemiskinan',
    subtitle: 'Visualisasi data kemiskinan per kabupaten/kota',
    numericField: 'jumlah_kemiskinan',
    hasGenderSplit: false,
    yAxisMin: 4000,
  },
  'kemiskinan-lokal': {
    title: 'Kemiskinan Lokal',
    subtitle: 'Visualisasi data kemiskinan lokal per kabupaten/kota',
    numericField: 'jumlah_kemiskinan',
    hasGenderSplit: false,
    yAxisMin: 4000,
  },
  'kemiskinan-bps': {
    title: 'Kemiskinan BPS',
    subtitle: 'Visualisasi data kemiskinan BPS per kabupaten/kota',
    numericField: 'jumlah_kemiskinan',
    hasGenderSplit: false,
    yAxisMin: 4000,
  },
  ringkasan: {
    title: 'Ringkasan & Korelasi',
    subtitle: 'Ringkasan data & korelasi antar variabel',
    numericField: 'jumlah',
    hasGenderSplit: false,
    yAxisMin: 0,
  },
};


export default function StatistikDetailPage({ endpointKey }) {
  const config = CATEGORY_CONFIG[endpointKey] || CATEGORY_CONFIG['pernikahan-dini'];
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
  } = useStatistik(endpointKey);

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

  const chartSubtitle = useMemo(() => {
    switch (filters.kategoriChart) {
      case 'tahun':
        return `Distribusi kasus per tahun`;
      case 'jenis_kelamin':
        return `Distribusi kasus per jenis kelamin`;
      case 'kabupaten':
      default:
        return `Top 15 Kabupaten/Kota berdasarkan jumlah kasus`;
    }
  }, [filters.kategoriChart]);

  const statsCards = config.hasGenderSplit ? [
    { label: 'Total Kasus', value: formatNumber(stats.totalKasus), icon: '📊' },
    { label: 'Perempuan', value: formatNumber(stats.totalPerempuan), icon: '👩' },
    { label: 'Laki-laki', value: formatNumber(stats.totalLaki), icon: '👨' },
    { label: 'Kabupaten/Kota', value: stats.uniqueKabupaten, icon: '📍' },
  ] : [
    { label: 'Total Kasus', value: formatNumber(stats.totalKasus), icon: '📊' },
    { label: 'Kabupaten/Kota', value: stats.uniqueKabupaten, icon: '📍' },
  ];

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[linear-gradient(180deg,#edf5ff_0%,#f8fbff_30%,#ffffff_100%)] px-4 py-10">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-red-700 font-semibold">{error}</p>
              <button
                onClick={refetch}
                className="mt-4 rounded-full bg-[#155DFC] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0f47d6]"
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

      <div className="min-h-screen bg-[linear-gradient(180deg,#edf5ff_0%,#f8fbff_30%,#ffffff_100%)] px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Link
              to="/statistik"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#155DFC] hover:underline mb-4"
            >
              ← Kembali ke Statistik
            </Link>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#155DFC]">Statistik Publik</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
                {config.title}
              </h1>
            </div>
          </div>

          <FilterBar
            years={years}
            kabupatens={kabupatens}
            filters={filters}
            onChange={setFilters}
            loading={loading}
          />

          <StatisticsCards stats={statsCards} />

          <Card
            title="Distribusi Kasus"
            subtitle={chartSubtitle}
          >
            <CaseBarChart 
              data={chartData} 
              loading={loading} 
              yAxisMin={config.yAxisMin || 0}
            />
          </Card>

          <Card
            title="Detail Data"
            subtitle={`${filteredData.length} total record${filteredData.length !== 1 ? 's' : ''}${hasActiveFilters ? ' (terfilter)' : ''}`}
          >
            {loading ? (
              <div className="py-8 text-center text-slate-500">Memuat data...</div>
            ) : filteredData.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2H7a2 2 0 01-2-2v-9" />
                </svg>
                <p className="mt-4 text-lg font-semibold">Tidak ada data untuk filter ini</p>
                <p className="mt-2">Coba reset filter atau pilih kombinasi lain</p>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 rounded-full bg-[#155DFC] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0f47d6]"
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

