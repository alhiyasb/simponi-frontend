import { useState, useEffect, useMemo, useCallback } from 'react';

const API_URL = `${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/+$/, '')}/v1/statistik/pernikahan-dini`;

function toArrayData(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

const CHART_COLORS = ['#0164DD', '#0EA5E9', '#38BDF8', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export function useStatistikData() {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    tahun: 'ALL',
    kabupaten: 'ALL',
    kategoriChart: 'kabupaten',
  });

  const fetchData = useCallback(async () => {
    try {
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
      setRawData(list);
      setError('');
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const years = useMemo(
    () => [...new Set(rawData.map((item) => Number(item.tahun)).filter((year) => !Number.isNaN(year)))].sort((a, b) => b - a),
    [rawData]
  );

  const kabupatens = useMemo(
    () => [...new Set(rawData.map((item) => item.nama_kabupaten_kota).filter(Boolean))].sort(),
    [rawData]
  );

  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      if (filters.tahun !== 'ALL' && Number(item.tahun) !== Number(filters.tahun)) return false;
      if (filters.kabupaten !== 'ALL' && item.nama_kabupaten_kota !== filters.kabupaten) return false;
      return true;
    });
  }, [rawData, filters.tahun, filters.kabupaten]);

  const stats = useMemo(() => {
    const totalKasus = filteredData.reduce((sum, item) => sum + Number(item.jumlah_perkawinan || 0), 0);
    const totalPerempuan = filteredData
      .filter((item) => item.jenis_kelamin === 'Perempuan')
      .reduce((sum, item) => sum + Number(item.jumlah_perkawinan || 0), 0);
    const totalLaki = filteredData
      .filter((item) => item.jenis_kelamin === 'Laki-laki')
      .reduce((sum, item) => sum + Number(item.jumlah_perkawinan || 0), 0);
    const uniqueKabupaten = new Set(filteredData.map((item) => item.nama_kabupaten_kota)).size;

    return {
      totalKasus,
      totalPerempuan,
      totalLaki,
      uniqueKabupaten,
    };
  }, [filteredData]);

  const chartData = useMemo(() => {
    let groupKey;
    switch (filters.kategoriChart) {
      case 'tahun':
        groupKey = 'tahun';
        break;
      case 'jenis_kelamin':
        groupKey = 'jenis_kelamin';
        break;
      case 'kabupaten':
      default:
        groupKey = 'nama_kabupaten_kota';
        break;
    }

    const groups = {};
    filteredData.forEach((item) => {
      const key = item[groupKey];
      if (!key) return;
      groups[key] = (groups[key] || 0) + Number(item.jumlah_perkawinan || 0);
    });

    let data = Object.entries(groups)
      .map(([kategori, jumlah]) => ({ kategori, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah);

    if (filters.kategoriChart === 'kabupaten') {
      data = data.slice(0, 15);
    }

    return data.map((d, i) => ({
      ...d,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }));
  }, [filteredData, filters.kategoriChart]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ tahun: 'ALL', kabupaten: 'ALL', kategoriChart: 'kabupaten' });
  }, []);

  const refetch = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return {
    rawData,
    loading,
    error,
    refetch,
    filters,
    setFilters: updateFilter,
    resetFilters,
    filteredData,
    stats,
    chartData,
    years,
    kabupatens,
  };
}