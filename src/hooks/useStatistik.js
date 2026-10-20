import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getPernikahanDini,
  getPetaPernikahanDini,
  getPutusSekolah,
  getStunting,
  getStuntingLokal,
  getStuntingBps,
  getKemiskinan,
  getKemiskinanLokal,
  getKemiskinanBps,
  getRingkasan,
} from '../services/api';

const endpointMap = {
  'pernikahan-dini': getPernikahanDini,
  'peta-pernikahan-dini': getPetaPernikahanDini,
  'putus-sekolah': getPutusSekolah,
  stunting: getStunting,
  'stunting-lokal': getStuntingLokal,
  'stunting-bps': getStuntingBps,
  kemiskinan: getKemiskinan,
  'kemiskinan-lokal': getKemiskinanLokal,
  'kemiskinan-bps': getKemiskinanBps,
  ringkasan: getRingkasan,
};

export function useStatistik(endpointKey) {
  const fetchFn = endpointMap[endpointKey];

  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    tahun: 'ALL',
    kabupaten: 'ALL',
    kategoriChart: 'kabupaten',
  });

  const fetchData = useCallback(async () => {
    if (!fetchFn) return;

    try {
      setLoading(true);
      setError('');

      const payload = await fetchFn({
        tahun: filters.tahun !== 'ALL' ? filters.tahun : undefined,
        kabupaten: filters.kabupaten !== 'ALL' ? filters.kabupaten : undefined,
      });

      const list = Array.isArray(payload) ? payload : 
                   Array.isArray(payload?.data) ? payload.data :
                   Array.isArray(payload?.results) ? payload.results : [];
      
      setRawData(list);
    } catch (err) {
      const message = err?.message || 'Gagal mengambil data dari API.';
      setError(
        message.includes('Failed to fetch') || message.includes('connect')
          ? 'Tidak dapat terhubung ke backend. Pastikan server API sudah berjalan.'
          : message
      );
    } finally {
      setLoading(false);
    }
  }, [fetchFn, filters.tahun, filters.kabupaten]);

  useEffect(() => {
    let mounted = true;
    const executeFetch = async () => {
      await fetchData();
      if (mounted) {
        setLoading(false);
      }
    };
    executeFetch();
    return () => { mounted = false; };
  }, [fetchData]);

  const years = useMemo(
    () => [...new Set(rawData.map((item) => Number(item.tahun)).filter((year) => !Number.isNaN(year)))].sort((a, b) => b - a),
    [rawData]
  );

  const kabupatens = useMemo(
    () => [...new Set(rawData.map((item) => item.nama_kabupaten_kota || item.kabupaten || item.nama_kabupaten).filter(Boolean))].sort(),
    [rawData]
  );

  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      if (filters.tahun !== 'ALL' && Number(item.tahun) !== Number(filters.tahun)) return false;
      if (filters.kabupaten !== 'ALL' && (item.nama_kabupaten_kota || item.kabupaten || item.nama_kabupaten) !== filters.kabupaten) return false;
      return true;
    });
  }, [rawData, filters.tahun, filters.kabupaten]);

  const stats = useMemo(() => {
    const totalKasus = filteredData.reduce((sum, item) => sum + Number(item.jumlah_perkawinan || item.jumlah_putus_sekolah || item.jumlah_stunting || item.jumlah_kemiskinan || item.jumlah || 0), 0);
    const uniqueKabupaten = new Set(filteredData.map((item) => item.nama_kabupaten_kota || item.kabupaten || item.nama_kabupaten).filter(Boolean)).size;
    
    let totalPerempuan = 0;
    let totalLaki = 0;
    if (filteredData.some(item => item.jenis_kelamin)) {
      totalPerempuan = filteredData
        .filter((item) => item.jenis_kelamin === 'Perempuan')
        .reduce((sum, item) => sum + Number(item.jumlah_perkawinan || 0), 0);
      totalLaki = filteredData
        .filter((item) => item.jenis_kelamin === 'Laki-laki')
        .reduce((sum, item) => sum + Number(item.jumlah_perkawinan || 0), 0);
    }

    return {
      totalKasus,
      uniqueKabupaten,
      totalPerempuan,
      totalLaki,
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
        if (!filteredData.some(item => item.nama_kabupaten_kota)) {
          groupKey = 'kabupaten';
        }
        if (!filteredData.some(item => item[groupKey])) {
          groupKey = 'nama_kabupaten';
        }
        break;
    }

    const groups = {};
    filteredData.forEach((item) => {
      const key = item[groupKey];
      if (!key) return;
      groups[key] = (groups[key] || 0) + Number(item.jumlah_perkawinan || item.jumlah_putus_sekolah || item.jumlah_stunting || item.jumlah_kemiskinan || item.jumlah || 0);
    });

    let data = Object.entries(groups)
      .map(([kategori, jumlah]) => ({ kategori, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah);

    if (filters.kategoriChart === 'kabupaten') {
      data = data.slice(0, 15);
    }

    return data;
  }, [filteredData, filters.kategoriChart]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ tahun: 'ALL', kabupaten: 'ALL', kategoriChart: 'kabupaten' });
  }, []);

  const refetch = useCallback(() => {
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