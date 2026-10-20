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
import {
  getStatistikRegion,
  getStatistikValue,
  getStatistikYear,
} from '../utils/statistik';

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
    () => [...new Set(rawData.map(getStatistikYear).filter(Boolean))]
      .sort((a, b) => String(b).localeCompare(String(a), undefined, { numeric: true })),
    [rawData]
  );

  const kabupatens = useMemo(
    () => [...new Set(rawData.map(getStatistikRegion).filter(Boolean))].sort(),
    [rawData]
  );

  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      if (filters.tahun !== 'ALL' && String(getStatistikYear(item)) !== filters.tahun) return false;
      if (filters.kabupaten !== 'ALL' && getStatistikRegion(item) !== filters.kabupaten) return false;
      return true;
    });
  }, [rawData, filters.tahun, filters.kabupaten]);

  const stats = useMemo(() => {
    const totalKasus = filteredData.reduce(
      (sum, item) => sum + getStatistikValue(item, endpointKey),
      0
    );
    const uniqueKabupaten = new Set(filteredData.map(getStatistikRegion).filter(Boolean)).size;
    
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
  }, [filteredData, endpointKey]);

  const chartData = useMemo(() => {
    const groups = {};
    filteredData.forEach((item) => {
      const key = filters.kategoriChart === 'tahun'
        ? getStatistikYear(item)
        : filters.kategoriChart === 'jenis_kelamin'
          ? item.jenis_kelamin
          : getStatistikRegion(item);
      if (!key) return;
      groups[key] = (groups[key] || 0) + getStatistikValue(item, endpointKey);
    });

    let data = Object.entries(groups)
      .map(([kategori, jumlah]) => ({ kategori, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah);

    if (filters.kategoriChart === 'kabupaten') {
      data = data.slice(0, 15);
    }

    return data;
  }, [filteredData, filters.kategoriChart, endpointKey]);

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