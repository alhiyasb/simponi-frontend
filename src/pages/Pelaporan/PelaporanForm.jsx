import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { submitPelaporan } from "../../services/api";

const initialState = {
  // Bagian 1
  nama_pelapor: "",
  nik_pelapor: "",
  telepon: "",
  email: "",
  alamat: "",
  hubungan: "",
  persetujuan_kebenaran: false,
  // Bagian 2
  nama_perempuan: "",
  usia_perempuan: "",
  nama_laki: "",
  usia_laki: "",
  pendidikan_perempuan: "",
  pendidikan_laki: "",
  provinsi: "",
  kabupaten: "",
  kecamatan: "",
  desa: "",
  waktu_akad: "",
  faktor_pendorong: [],
  kronologi: "",
  dispensasi: "",
  korban_didampingi: "",
  // Dokumen
  foto_bukti: null,
  dokumen_pendukung: null,
  // Bagian 3
  checklist_kebenaran: false,
  checklist_pdp: false,
  kerahasiaan: "",
};

const steps = [
  { id: 0, title: "Identitas Pelapor", caption: "Data kontak dan kebenaran informasi" },
  { id: 1, title: "Kasus & Lokasi", caption: "Detail pernikahan dan lokasi kejadian" },
  { id: 2, title: "Dokumen & Persetujuan", caption: "Lampiran, kerahasiaan, dan validasi akhir" },
];

const StepIcon = ({ index, active, done }) => {
  const baseClass = "h-5 w-5";
  const commonProps = { className: baseClass, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" };

  if (index === 0) {
    return (
      <svg {...commonProps} aria-hidden="true">
        <path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
        <circle cx="10" cy="7" r="3.5" />
        <path d="M20 19v-1a4 4 0 0 0-3-3.87" />
        <path d="M16 4.13a4 4 0 0 1 0 7.74" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg {...commonProps} aria-hidden="true">
        <path d="M12 21s6-4.35 6-10A6 6 0 1 0 6 11c0 5.65 6 10 6 10Z" />
        <circle cx="12" cy="11" r="2.75" />
      </svg>
    );
  }

  return (
    <svg {...commonProps} aria-hidden="true">
      <path d="M7 11.5 10 14.5 17 7.5" />
      <path d="M20 12V6.5A2.5 2.5 0 0 0 17.5 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20h11A2.5 2.5 0 0 0 20 17.5V12" />
      <path d="M12 3v3" />
      <path d="M7 3v3" />
      <path d="M17 3v3" />
    </svg>
  );
};

export default function PelaporanForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  const sampleRegions = {
    "Provinsi A": {
      "Kabupaten A1": {
        "Kecamatan A1-1": ["Desa A1-1-1", "Desa A1-1-2"],
      },
      "Kabupaten A2": {
        "Kecamatan A2-1": ["Desa A2-1-1"],
      },
    },
    "Provinsi B": {
      "Kabupaten B1": {
        "Kecamatan B1-1": ["Desa B1-1-1"],
      },
    },
  };

  const provOptions = Object.keys(sampleRegions);
  const kabOptions = form.provinsi ? Object.keys(sampleRegions[form.provinsi] || {}) : [];
  const kecOptions = form.provinsi && form.kabupaten ? Object.keys((sampleRegions[form.provinsi] || {})[form.kabupaten] || {}) : [];
  const desaOptions = form.provinsi && form.kabupaten && form.kecamatan ? ((sampleRegions[form.provinsi] || {})[form.kabupaten] || {})[form.kecamatan] || [] : [];

  const validateStep = (stepIndex) => {
    const e = {};

    if (stepIndex === 0) {
      if (!form.nama_pelapor) e.nama_pelapor = "Nama pelapor wajib diisi";
      if (!form.nik_pelapor || !/^[0-9]{16}$/.test(form.nik_pelapor)) e.nik_pelapor = "NIK harus 16 digit";
      if (!form.telepon) e.telepon = "Nomor telepon wajib";
      if (!form.alamat) e.alamat = "Alamat lengkap wajib";
      if (!form.hubungan) e.hubungan = "Pilih hubungan pelapor";
      if (!form.persetujuan_kebenaran) e.persetujuan_kebenaran = "Anda harus bertanggung jawab atas kebenaran data";
    }

    if (stepIndex === 1) {
      if (!form.provinsi) e.provinsi = "Pilih provinsi";
      if (!form.kabupaten) e.kabupaten = "Pilih kabupaten/kota";
      if (!form.kecamatan) e.kecamatan = "Pilih kecamatan";
      if (!form.desa) e.desa = "Pilih desa/kelurahan";
      if (!form.kronologi) e.kronologi = "Deskripsi kronologi wajib diisi";
    }

    if (stepIndex === 2) {
      if (!form.checklist_kebenaran) e.checklist_kebenaran = "Checklist kebenaran wajib";
      if (!form.checklist_pdp) e.checklist_pdp = "Persetujuan pemrosesan data wajib";
      if (!form.kerahasiaan) e.kerahasiaan = "Pilih opsi kerahasiaan identitas";
    }

    setErrors((prev) => ({ ...prev, ...e }));
    return Object.keys(e).length === 0;
  };

  const validate = () => {
    const e = {};
    if (!form.nama_pelapor) e.nama_pelapor = "Nama pelapor wajib diisi";
    if (!form.nik_pelapor || !/^[0-9]{16}$/.test(form.nik_pelapor)) e.nik_pelapor = "NIK harus 16 digit";
    if (!form.telepon) e.telepon = "Nomor telepon wajib";
    if (!form.alamat) e.alamat = "Alamat lengkap wajib";
    if (!form.hubungan) e.hubungan = "Pilih hubungan pelapor";
    if (!form.persetujuan_kebenaran) e.persetujuan_kebenaran = "Anda harus bertanggung jawab atas kebenaran data";
    if (!form.provinsi) e.provinsi = "Pilih provinsi";
    if (!form.kabupaten) e.kabupaten = "Pilih kabupaten/kota";
    if (!form.kecamatan) e.kecamatan = "Pilih kecamatan";
    if (!form.desa) e.desa = "Pilih desa/kelurahan";
    if (!form.kronologi) e.kronologi = "Deskripsi kronologi wajib diisi";
    if (!form.checklist_kebenaran) e.checklist_kebenaran = "Checklist kebenaran wajib";
    if (!form.checklist_pdp) e.checklist_pdp = "Persetujuan pemrosesan data wajib";
    if (!form.kerahasiaan) e.kerahasiaan = "Pilih opsi kerahasiaan identitas";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleChange = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const handleFile = (k, file) => {
    if (!file) return handleChange(k, null);
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrors((prev) => ({ ...prev, [k]: "Ukuran file maksimal 5MB" }));
      return;
    }
    setErrors((prev) => ({ ...prev, [k]: "" }));
    handleChange(k, file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    try {
      const response = await submitPelaporan(form);
      console.log("Pelaporan submit:", response);
      setSubmitMessage({
        type: "success",
        text: response?.message || "Laporan berhasil dikirim. Tim kami akan meninjau pengajuan Anda.",
      });
      setForm(initialState);
      setErrors({});
      setCurrentStep(0);
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: error.message || "Gagal mengirim laporan. Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFactor = (val) => {
    setForm((prev) => {
      const existing = new Set(prev.faktor_pendorong);
      if (existing.has(val)) {
        existing.delete(val);
      } else existing.add(val);
      return { ...prev, faktor_pendorong: Array.from(existing) };
    });
  };

  const currentStepData = useMemo(() => {
    const stepContent = [
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" key="pelapor">
        <div className="sm:col-span-2">
          <div className="mb-4 rounded-2xl bg-[#155DFC]/5 p-3 text-sm text-slate-700 ring-1 ring-[#155DFC]/15">
            Pastikan data pelapor akurat agar proses verifikasi lebih cepat.
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nama lengkap pelapor</label>
          <input value={form.nama_pelapor} onChange={(e) => handleChange("nama_pelapor", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-[#155DFC] focus:ring-4 focus:ring-[#155DFC]/10" />
          {errors.nama_pelapor && <p className="mt-1 text-sm text-red-500">{errors.nama_pelapor}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">NIK pelapor</label>
          <input value={form.nik_pelapor} onChange={(e) => handleChange("nik_pelapor", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" placeholder="16 digit" />
          {errors.nik_pelapor && <p className="mt-1 text-sm text-red-500">{errors.nik_pelapor}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nomor telepon/WhatsApp</label>
          <input value={form.telepon} onChange={(e) => handleChange("telepon", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
          {errors.telepon && <p className="mt-1 text-sm text-red-500">{errors.telepon}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Alamat email</label>
          <input value={form.email} onChange={(e) => handleChange("email", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Alamat domisili lengkap</label>
          <textarea value={form.alamat} onChange={(e) => handleChange("alamat", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" rows={4} placeholder="RT/RW, Desa/Kelurahan, Kecamatan, Kabupaten/Kota, Provinsi" />
          {errors.alamat && <p className="mt-1 text-sm text-red-500">{errors.alamat}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Hubungan dengan korban</label>
          <select value={form.hubungan} onChange={(e) => handleChange("hubungan", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
            <option value="">-- pilih --</option>
            <option>Orang tua</option>
            <option>Kerabat</option>
            <option>Tetangga</option>
            <option>Guru</option>
            <option>Aparat desa</option>
            <option>Pendamping sosial</option>
            <option>Korban sendiri</option>
          </select>
          {errors.hubungan && <p className="mt-1 text-sm text-red-500">{errors.hubungan}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
            <input type="checkbox" checked={form.persetujuan_kebenaran} onChange={(e) => handleChange("persetujuan_kebenaran", e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            Saya bertanggung jawab atas kebenaran data yang saya berikan.
          </label>
          {errors.persetujuan_kebenaran && <p className="mt-1 text-sm text-red-500">{errors.persetujuan_kebenaran}</p>}
        </div>
      </div>,
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" key="kasus">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nama calon mempelai perempuan</label>
          <input value={form.nama_perempuan} onChange={(e) => handleChange("nama_perempuan", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-[#155DFC] focus:ring-4 focus:ring-[#155DFC]/10" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Usia perempuan</label>
          <input value={form.usia_perempuan} onChange={(e) => handleChange("usia_perempuan", e.target.value)} type="text" placeholder="Contoh: 17 tahun" className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-[#155DFC] focus:ring-4 focus:ring-[#155DFC]/10" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nama calon mempelai laki-laki</label>
          <input value={form.nama_laki} onChange={(e) => handleChange("nama_laki", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Usia laki-laki</label>
          <input value={form.usia_laki} onChange={(e) => handleChange("usia_laki", e.target.value)} type="text" placeholder="Contoh: 20 tahun" className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Pendidikan perempuan</label>
          <select value={form.pendidikan_perempuan} onChange={(e) => handleChange("pendidikan_perempuan", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
            <option value="">-- pilih --</option>
            <option>Masih sekolah</option>
            <option>Putus sekolah</option>
            <option>Tidak sekolah</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Pendidikan laki-laki</label>
          <select value={form.pendidikan_laki} onChange={(e) => handleChange("pendidikan_laki", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
            <option value="">-- pilih --</option>
            <option>Masih sekolah</option>
            <option>Putus sekolah</option>
            <option>Tidak sekolah</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Provinsi</label>
          <select value={form.provinsi} onChange={(e) => { handleChange("provinsi", e.target.value); handleChange("kabupaten", ""); handleChange("kecamatan", ""); handleChange("desa", ""); }} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
            <option value="">-- pilih provinsi --</option>
            {provOptions.map((p) => <option key={p}>{p}</option>)}
          </select>
          {errors.provinsi && <p className="mt-1 text-sm text-red-500">{errors.provinsi}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Kabupaten/Kota</label>
          <select value={form.kabupaten} onChange={(e) => { handleChange("kabupaten", e.target.value); handleChange("kecamatan", ""); handleChange("desa", ""); }} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
            <option value="">-- pilih kabupaten --</option>
            {kabOptions.map((k) => <option key={k}>{k}</option>)}
          </select>
          {errors.kabupaten && <p className="mt-1 text-sm text-red-500">{errors.kabupaten}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Kecamatan</label>
          <select value={form.kecamatan} onChange={(e) => { handleChange("kecamatan", e.target.value); handleChange("desa", ""); }} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
            <option value="">-- pilih kecamatan --</option>
            {kecOptions.map((kc) => <option key={kc}>{kc}</option>)}
          </select>
          {errors.kecamatan && <p className="mt-1 text-sm text-red-500">{errors.kecamatan}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Desa/Kelurahan</label>
          <select value={form.desa} onChange={(e) => handleChange("desa", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
            <option value="">-- pilih desa --</option>
            {desaOptions.map((d) => <option key={d}>{d}</option>)}
          </select>
          {errors.desa && <p className="mt-1 text-sm text-red-500">{errors.desa}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Waktu/rencana akad</label>
          <input type="date" value={form.waktu_akad} onChange={(e) => handleChange("waktu_akad", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Status pengajuan dispensasi</label>
          <select value={form.dispensasi} onChange={(e) => handleChange("dispensasi", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
            <option value="">-- pilih --</option>
            <option>Sudah</option>
            <option>Belum</option>
            <option>Tidak tahu</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Apakah korban sudah didampingi?</label>
          <select value={form.korban_didampingi} onChange={(e) => handleChange("korban_didampingi", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100">
            <option value="">-- pilih --</option>
            <option>Sudah</option>
            <option>Belum</option>
            <option>Tidak tahu</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Faktor pendorong utama</label>
          <div className="flex flex-wrap gap-2">
            {['Ekonomi', 'Tekanan keluarga', 'Hamil di luar nikah', 'Adat/budaya', 'Lainnya'].map((f) => (
              <label key={f} className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${form.faktor_pendorong.includes(f) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600'}`}>
                <input type="checkbox" checked={form.faktor_pendorong.includes(f)} onChange={() => toggleFactor(f)} className="sr-only" />
                {f}
              </label>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700">Deskripsi kronologi kasus</label>
          <textarea value={form.kronologi} onChange={(e) => handleChange("kronologi", e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100" rows={5} placeholder="Panduan: kapan diketahui, siapa yang terlibat, ada upaya pencegahan?" />
          {errors.kronologi && <p className="mt-1 text-sm text-red-500">{errors.kronologi}</p>}
        </div>
      </div>,
      <div className="space-y-5" key="dokumen">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 p-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">Foto/bukti awal</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFile('foto_bukti', e.target.files[0])} className="w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white" />
            {errors.foto_bukti && <p className="mt-1 text-sm text-red-500">{errors.foto_bukti}</p>}
          </div>
          <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 p-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">Dokumen pendukung lain</label>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFile('dokumen_pendukung', e.target.files[0])} className="w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="space-y-3">
            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input type="checkbox" checked={form.checklist_kebenaran} onChange={(e) => handleChange("checklist_kebenaran", e.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span>Saya menyatakan bahwa data yang saya berikan adalah benar.</span>
            </label>
            {errors.checklist_kebenaran && <p className="text-sm text-red-500">{errors.checklist_kebenaran}</p>}

            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input type="checkbox" checked={form.checklist_pdp} onChange={(e) => handleChange("checklist_pdp", e.target.checked)} className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span>Saya menyetujui pemrosesan data pribadi sesuai UU PDP dan perlindungan anak.</span>
            </label>
            {errors.checklist_pdp && <p className="text-sm text-red-500">{errors.checklist_pdp}</p>}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Opsi kerahasiaan identitas pelapor</label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 'anonim', label: 'Anonim' },
                  { value: 'rahasia', label: 'Rahasia (hanya petugas)' },
                  { value: 'biasa', label: 'Biasa (tidak rahasia)' },
                ].map((option) => (
                  <label key={option.value} className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${form.kerahasiaan === option.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-white text-slate-600'}`}>
                    <input type="radio" name="kerahasiaan" checked={form.kerahasiaan === option.value} onChange={() => handleChange("kerahasiaan", option.value)} className="sr-only" />
                    {option.label}
                  </label>
                ))}
              </div>
              {errors.kerahasiaan && <p className="mt-1 text-sm text-red-500">{errors.kerahasiaan}</p>}
            </div>
          </div>
        </div>
      </div>,
    ];

    return stepContent[currentStep];
  }, [currentStep, form, errors, kabOptions, kecOptions, desaOptions, provOptions]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#dff7ff_0%,#eaf9ff_18%,#f2fbff_42%,#ffffff_72%,#eff7ff_100%)] px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(125,211,252,0.9),transparent_18%),radial-gradient(circle_at_78%_12%,rgba(147,197,253,0.75),transparent_22%),radial-gradient(circle_at_68%_72%,rgba(186,230,253,0.9),transparent_28%),radial-gradient(circle_at_48%_42%,rgba(255,255,255,0.95),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.14)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-sky-300/55 blur-3xl" />
      <div className="absolute right-0 top-4 h-96 w-96 rounded-full bg-cyan-200/45 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-200/45 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">
        <div className="mb-8 overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_24%),linear-gradient(135deg,#155DFC_0%,#0f47d6_100%)] p-6 text-white shadow-[0_25px_70px_rgba(21,93,252,0.35)] md:p-8">
          <div className="relative isolate overflow-hidden rounded-[28px] border border-white/15 bg-white/5 p-4 md:p-6">
            <div className="absolute -left-10 top-6 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -right-8 bottom-0 h-28 w-28 rounded-full bg-sky-300/20 blur-3xl" />
            <div className="absolute right-8 top-10 h-16 w-16 rounded-2xl border border-white/15 bg-white/5" />
            <div className="absolute bottom-8 left-12 h-14 w-14 rounded-full border border-white/15 bg-white/5" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/90">
                  Layanan Pengaduan
                </span>
                <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">Ajukan laporan dengan aman & cepat</h1>
                <p className="mt-3 max-w-lg text-sm text-blue-50 md:text-base">
                  Simponi membantu masyarakat melaporkan kasus dengan proses yang jelas, aman, dan mudah dipahami.
                </p>
              </div>

              <div className="relative hidden min-h-[170px] flex-1 items-center justify-center lg:flex">
                <div className="absolute inset-x-8 top-4 h-24 rounded-full bg-white/10 blur-2xl" />
                <motion.div
                  initial={{ opacity: 0, y: 18, rotate: -8 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="relative flex h-40 w-40 items-center justify-center rounded-[30px] border border-white/20 bg-white/10 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-sm"
                >
                  <div className="absolute inset-3 rounded-[24px] border border-dashed border-white/20" />
                  <div className="space-y-3 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#155DFC] shadow-lg">
                      <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
                        <path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Zm0 9.5A2.5 2.5 0 1 0 12 6a2.5 2.5 0 0 0 0 5.5Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-blue-100">Protected</p>
                      <p className="mt-1 text-2xl font-black">24/7</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isDone = index < currentStep;

              return (
                <div key={step.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${isActive ? 'bg-white text-[#155DFC] shadow-lg shadow-blue-900/20' : isDone ? 'bg-emerald-400 text-white' : 'bg-white/10 text-white/80'}`}>
                    {isDone ? '✓' : (
                      <span className="flex items-center justify-center">
                        <StepIcon index={index} active={isActive} done={isDone} />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`truncate text-sm font-semibold ${isActive ? 'text-white' : 'text-blue-100'}`}>{step.title}</p>
                    <p className="truncate text-xs text-blue-100/80">{step.caption}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-[30px] border border-sky-200 bg-[linear-gradient(135deg,#dff4ff_0%,#eefcff_28%,#ffffff_58%,#f0f9ff_100%)] p-4 shadow-[0_30px_90px_rgba(59,130,246,0.15)] backdrop-blur-2xl sm:p-6 lg:p-8">
          <div className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-sky-200/65 blur-3xl" />
          <div className="absolute -bottom-12 left-16 h-36 w-36 rounded-full bg-blue-100/80 blur-3xl" />
          <div className="absolute left-10 top-6 h-28 w-28 rounded-full bg-cyan-200/45 blur-3xl" />
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
          {submitMessage.text && (
            <div className={`mb-5 rounded-2xl border px-4 py-3 text-sm ${submitMessage.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
              {submitMessage.text}
            </div>
          )}

          <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full bg-[linear-gradient(90deg,#155DFC_0%,#3f7cff_48%,#7aa7ff_100%)]"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.section
              key={currentStep}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction > 0 ? -50 : 50, y: -12, scale: 0.98 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="rounded-[26px] bg-gradient-to-br from-slate-50 to-white p-4 ring-1 ring-slate-100 sm:p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#155DFC]">Langkah {currentStep + 1}</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-800">{steps[currentStep].title}</h2>
                </div>
                <div className="rounded-full bg-[#155DFC]/5 px-3 py-1 text-xs font-medium text-[#155DFC]">{steps[currentStep].caption}</div>
              </div>

              {currentStepData}
            </motion.section>
          </AnimatePresence>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentStep === 0}
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Kembali
            </button>

            {currentStep < steps.length - 1 ? (
              <button type="button" onClick={goNext} className="rounded-full bg-[linear-gradient(135deg,#155DFC_0%,#2d6bff_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(21,93,252,0.35)] transition hover:scale-[1.01] hover:shadow-[0_16px_34px_rgba(21,93,252,0.42)]">
                Lanjutkan
              </button>
            ) : (
              <button type="submit" disabled={isSubmitting} className="rounded-full bg-[linear-gradient(135deg,#10b981_0%,#059669_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(5,150,105,0.35)] transition hover:scale-[1.01] hover:shadow-[0_16px_34px_rgba(5,150,105,0.42)] disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
