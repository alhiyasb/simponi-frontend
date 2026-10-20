import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { submitPelaporan } from "../../services/api";

const initialState = {

  // =========================

  // BAGIAN 1 - IDENTITAS PELAPOR

  // =========================

  nama_pelapor: "",

  nik_pelapor: "",

  telepon: "",

  email: "",

  alamat: "",

  hubungan: "",

  persetujuan_kebenaran: false,

  // =========================

  // BAGIAN 2 - DETAIL KASUS

  // =========================

  nama_perempuan: "",

  usia_perempuan: "",

  nama_laki: "",

  usia_laki: "",

  pendidikan_perempuan: "",

  pendidikan_laki: "",

  provinsi: "Jawa Barat",

  kabupaten: "",

  kecamatan: "",

  desa: "",

  waktu_akad: "",

  faktor_pendorong: [],

  kronologi: "",

  dispensasi: "",

  korban_didampingi: "",

  // =========================

  // DOKUMEN

  // =========================

  foto_bukti: null,

  dokumen_pendukung: null,

  // =========================

  // BAGIAN 3 - PERSETUJUAN

  // =========================

  checklist_kebenaran: false,

  checklist_pdp: false,

  kerahasiaan: "",

};

const steps = [

  {

    id: 0,

    title: "Identitas Pelapor",

    caption: "Data kontak dan kebenaran informasi",

  },

  {

    id: 1,

    title: "Kasus & Lokasi",

    caption: "Detail pernikahan dan lokasi kejadian",

  },

  {

    id: 2,

    title: "Dokumen & Persetujuan",

    caption: "Lampiran, kerahasiaan, dan validasi akhir",

  },

];

const inputClass =

  "w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-slate-800 shadow-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100";

const errorClass = "mt-1 text-sm text-red-500";

const StepIcon = ({ index }) => {

  const commonProps = {

    className: "h-5 w-5",

    viewBox: "0 0 24 24",

    fill: "none",

    stroke: "currentColor",

    strokeWidth: "1.8",

    strokeLinecap: "round",

    strokeLinejoin: "round",

  };

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

  const [submitMessage, setSubmitMessage] = useState({

    type: "",

    text: "",

  });

  // =========================

  // DATA WILAYAH

  // =========================

  const [kabupatenOptions, setKabupatenOptions] = useState([]);

  const [kecamatanOptions, setKecamatanOptions] = useState([]);

  const [desaOptions, setDesaOptions] = useState([]);

  const [loadingKabupaten, setLoadingKabupaten] = useState(false);

  const [loadingKecamatan, setLoadingKecamatan] = useState(false);

  const [loadingDesa, setLoadingDesa] = useState(false);

  const [wilayahError, setWilayahError] = useState("");

  // =====================================================

  // LOAD KABUPATEN / KOTA JAWA BARAT

  // =====================================================

  useEffect(() => {

    const loadKabupaten = async () => {

      setLoadingKabupaten(true);

      setWilayahError("");

      try {

        const response = await fetch(

          "https://www.emsifa.com/api-wilayah-indonesia/v2/regencies/32.json"

        );

        if (!response.ok) {

          throw new Error(

            "Gagal mengambil data kabupaten."

          );

        }

        const result = await response.json();

        setKabupatenOptions(result.data || []);

      } catch (error) {

        console.error(

          "Gagal mengambil kabupaten Jawa Barat:",

          error

        );

        setWilayahError(

          "Data kabupaten Jawa Barat gagal dimuat."

        );

        setKabupatenOptions([]);

      } finally {

        setLoadingKabupaten(false);

      }

    };

    loadKabupaten();

  }, []);

  // =====================================================

  // LOAD KECAMATAN BERDASARKAN KABUPATEN

  // =====================================================

  useEffect(() => {

    if (!form.kabupaten) {

      setKecamatanOptions([]);

      setDesaOptions([]);

      return;

    }

    const loadKecamatan = async () => {

      setLoadingKecamatan(true);

      setWilayahError("");

      try {

        const response = await fetch(

          `https://www.emsifa.com/api-wilayah-indonesia/v2/districts/${form.kabupaten}.json`

        );

        if (!response.ok) {

          throw new Error(

            "Gagal mengambil data kecamatan."

          );

        }

        const result = await response.json();

        setKecamatanOptions(result.data || []);

      } catch (error) {

        console.error(

          "Gagal mengambil kecamatan:",

          error

        );

        setWilayahError(

          "Data kecamatan gagal dimuat."

        );

        setKecamatanOptions([]);

      } finally {

        setLoadingKecamatan(false);

      }

    };

    loadKecamatan();

  }, [form.kabupaten]);

  // =====================================================

  // LOAD DESA / KELURAHAN BERDASARKAN KECAMATAN

  // =====================================================

  useEffect(() => {

    if (!form.kecamatan) {

      setDesaOptions([]);

      return;

    }

    const loadDesa = async () => {

      setLoadingDesa(true);

      setWilayahError("");

      try {

        const response = await fetch(

          `https://www.emsifa.com/api-wilayah-indonesia/v2/villages/${form.kecamatan}.json`

        );

        if (!response.ok) {

          throw new Error(

            "Gagal mengambil data desa/kelurahan."

          );

        }

        const result = await response.json();

        setDesaOptions(result.data || []);

      } catch (error) {

        console.error(

          "Gagal mengambil desa/kelurahan:",

          error

        );

        setWilayahError(

          "Data desa/kelurahan gagal dimuat."

        );

        setDesaOptions([]);

      } finally {

        setLoadingDesa(false);

      }

    };

    loadDesa();

  }, [form.kecamatan]);

  // =====================================================

  // HANDLE CHANGE

  // =====================================================

  const handleChange = (key, value) => {

    setForm((prev) => ({

      ...prev,

      [key]: value,

    }));

    setErrors((prev) => ({

      ...prev,

      [key]: "",

    }));

  };

  // =====================================================

  // HANDLE FILE

  // =====================================================

  const handleFile = (key, file) => {

    if (!file) {

      handleChange(key, null);

      return;

    }

    const maxBytes = 5 * 1024 * 1024;

    if (file.size > maxBytes) {

      setErrors((prev) => ({

        ...prev,

        [key]: "Ukuran file maksimal 5MB.",

      }));

      return;

    }

    setErrors((prev) => ({

      ...prev,

      [key]: "",

    }));

    handleChange(key, file);

  };

  // =====================================================

  // VALIDASI STEP

  // =====================================================

  const validateStep = (stepIndex) => {

    const e = {};

    // =========================

    // STEP 1

    // =========================

    if (stepIndex === 0) {

      if (!form.nama_pelapor.trim()) {

        e.nama_pelapor =

          "Nama pelapor wajib diisi.";

      }

      if (

        !form.nik_pelapor ||

        !/^[0-9]{16}$/.test(

          form.nik_pelapor

        )

      ) {

        e.nik_pelapor =

          "NIK harus terdiri dari 16 digit.";

      }

      if (!form.telepon.trim()) {

        e.telepon =

          "Nomor telepon wajib diisi.";

      }

      if (!form.alamat.trim()) {

        e.alamat =

          "Alamat lengkap wajib diisi.";

      }

      if (!form.hubungan) {

        e.hubungan =

          "Pilih hubungan pelapor.";

      }

      if (!form.persetujuan_kebenaran) {

        e.persetujuan_kebenaran =

          "Anda harus menyatakan bertanggung jawab atas kebenaran data.";

      }

    }

    // =========================

    // STEP 2

    // =========================

    if (stepIndex === 1) {

      if (!form.usia_perempuan.trim()) {

        e.usia_perempuan =

          "Usia perempuan wajib diisi.";

      }

      if (!form.usia_laki.trim()) {

        e.usia_laki =

          "Usia laki-laki wajib diisi.";

      }

      if (!form.provinsi) {

        e.provinsi =

          "Provinsi wajib dipilih.";

      }

      if (!form.kabupaten) {

        e.kabupaten =

          "Pilih kabupaten/kota.";

      }

      if (!form.kecamatan) {

        e.kecamatan =

          "Pilih kecamatan.";

      }

      if (!form.desa) {

        e.desa =

          "Pilih desa/kelurahan.";

      }

      if (!form.kronologi.trim()) {

        e.kronologi =

          "Deskripsi kronologi wajib diisi.";

      }

    }

    // =========================

    // STEP 3

    // =========================

    if (stepIndex === 2) {

      if (

        !form.foto_bukti &&

        !form.dokumen_pendukung

      ) {

        e.foto_bukti =

          "Minimal satu file bukti wajib diunggah.";

      }

      if (!form.checklist_kebenaran) {

        e.checklist_kebenaran =

          "Checklist kebenaran wajib dicentang.";

      }

      if (!form.checklist_pdp) {

        e.checklist_pdp =

          "Persetujuan pemrosesan data wajib dicentang.";

      }

      if (!form.kerahasiaan) {

        e.kerahasiaan =

          "Pilih opsi kerahasiaan identitas.";

      }

    }

    setErrors((prev) => ({

      ...prev,

      ...e,

    }));

    return Object.keys(e).length === 0;

  };

  // =====================================================

  // VALIDASI SEMUA

  // =====================================================

  const validate = () => {

    const e = {};

    if (!form.nama_pelapor.trim()) {

      e.nama_pelapor =

        "Nama pelapor wajib diisi.";

    }

    if (

      !form.nik_pelapor ||

      !/^[0-9]{16}$/.test(

        form.nik_pelapor

      )

    ) {

      e.nik_pelapor =

        "NIK harus terdiri dari 16 digit.";

    }

    if (!form.telepon.trim()) {

      e.telepon =

        "Nomor telepon wajib diisi.";

    }

    if (!form.alamat.trim()) {

      e.alamat =

        "Alamat lengkap wajib diisi.";

    }

    if (!form.hubungan) {

      e.hubungan =

        "Pilih hubungan pelapor.";

    }

    if (!form.persetujuan_kebenaran) {

      e.persetujuan_kebenaran =

        "Anda harus menyatakan bertanggung jawab atas kebenaran data.";

    }

    if (!form.usia_perempuan.trim()) {

      e.usia_perempuan =

        "Usia perempuan wajib diisi.";

    }

    if (!form.usia_laki.trim()) {

      e.usia_laki =

        "Usia laki-laki wajib diisi.";

    }

    if (!form.provinsi) {

      e.provinsi =

        "Provinsi wajib dipilih.";

    }

    if (!form.kabupaten) {

      e.kabupaten =

        "Pilih kabupaten/kota.";

    }

    if (!form.kecamatan) {

      e.kecamatan =

        "Pilih kecamatan.";

    }

    if (!form.desa) {

      e.desa =

        "Pilih desa/kelurahan.";

    }

    if (!form.kronologi.trim()) {

      e.kronologi =

        "Deskripsi kronologi wajib diisi.";

    }

    // =========================

    // FILE

    // =========================

    if (

      !form.foto_bukti &&

      !form.dokumen_pendukung

    ) {

      e.foto_bukti =

        "Minimal satu file bukti wajib diunggah.";

    }

    if (!form.checklist_kebenaran) {

      e.checklist_kebenaran =

        "Checklist kebenaran wajib dicentang.";

    }

    if (!form.checklist_pdp) {

      e.checklist_pdp =

        "Persetujuan pemrosesan data wajib dicentang.";

    }

    if (!form.kerahasiaan) {

      e.kerahasiaan =

        "Pilih opsi kerahasiaan identitas.";

    }

    setErrors(e);

    return Object.keys(e).length === 0;

  };

  // =====================================================

  // NEXT

  // =====================================================

  const goNext = () => {

    if (!validateStep(currentStep)) {

      return;

    }

    setDirection(1);

    setCurrentStep((prev) =>

      Math.min(

        prev + 1,

        steps.length - 1

      )

    );

  };

  // =====================================================

  // PREVIOUS

  // =====================================================

  const goPrev = () => {

    setDirection(-1);

    setCurrentStep((prev) =>

      Math.max(prev - 1, 0)

    );

  };

  // =====================================================

  // TOGGLE FAKTOR

  // =====================================================

  const toggleFactor = (value) => {

    setForm((prev) => {

      const existing = new Set(

        prev.faktor_pendorong

      );

      if (existing.has(value)) {

        existing.delete(value);

      } else {

        existing.add(value);

      }

      return {

        ...prev,

        faktor_pendorong:

          Array.from(existing),

      };

    });

  };

  // =====================================================

  // SUBMIT

  // =====================================================

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (!validate()) {

      setCurrentStep(2);

      return;

    }

    setIsSubmitting(true);

    setSubmitMessage({

      type: "",

      text: "",

    });

    try {

      // ================================================

      // CARI NAMA KABUPATEN

      // ================================================

      const selectedKabupaten =

        kabupatenOptions.find(

          (item) =>

            String(item.id) ===

            String(form.kabupaten)

        );

      // ================================================

      // CARI NAMA KECAMATAN

      // ================================================

      const selectedKecamatan =

        kecamatanOptions.find(

          (item) =>

            String(item.id) ===

            String(form.kecamatan)

        );

      // ================================================

      // NAMA DESA

      // ================================================

      const selectedDesa =

        desaOptions.find(

          (item) =>

            String(item.id) ===

            String(form.desa)

        );

      // ================================================

      // PAYLOAD

      // ================================================

      const payload = {

        // =========================

        // IDENTITAS PELAPOR

        // =========================

        pelapor_nama:

          form.nama_pelapor,

        pelapor_nik:

          form.nik_pelapor,

        pelapor_telepon:

          form.telepon,

        pelapor_email:

          form.email,

        pelapor_domisili:

          form.alamat,

        hubungan_pelapor:

          form.hubungan,

        // =========================

        // DETAIL KASUS

        // =========================

        usia_perempuan:

          form.usia_perempuan,

        usia_laki_laki:

          form.usia_laki,

        status_pendidikan:

          form.pendidikan_perempuan,

        // =========================

        // LOKASI

        // =========================

        lokasi_kabupaten:

  selectedKabupaten?.name ||

  form.kabupaten,

kode_kabupaten: Number(form.kabupaten),

lokasi_kecamatan_desa: [

  selectedKecamatan?.name,

  selectedDesa?.name ||

    form.desa,

]

          .filter(Boolean)

          .join(", "),

        // =========================

        // DETAIL LAPORAN

        // =========================

        waktu_rencana_akad:

          form.waktu_akad,

        faktor_pendorong:

          Array.isArray(

            form.faktor_pendorong

          )

            ? form.faktor_pendorong.join(

                ", "

              )

            : form.faktor_pendorong || "",

        description:

          form.kronologi,

        // =========================

        // PERSETUJUAN

        // =========================

        pernyataan_benar:

          form.checklist_kebenaran,

        setuju_pemrosesan:

          form.checklist_pdp,

        // =========================

        // FILE

        // =========================

        foto_bukti:

          form.foto_bukti || null,

        dokumen_pendukung:

          form.dokumen_pendukung || null,

      };

      // ================================================

      // DEBUG

      // ================================================

      console.log(

        "Payload pelaporan:",

        payload

      );

      console.log(

        "Foto bukti:",

        form.foto_bukti

      );

      console.log(

        "Dokumen pendukung:",

        form.dokumen_pendukung

      );

      // ================================================

      // KIRIM KE BACKEND

      // ================================================

      const response =

        await submitPelaporan(payload);

      console.log(

        "Pelaporan submit:",

        response

      );

      // ================================================

      // BERHASIL

      // ================================================

      setSubmitMessage({

        type: "success",

        text:

          response?.message ||

          "Laporan berhasil dikirim. Tim kami akan meninjau pengajuan Anda.",

      });

      // Reset form

      setForm(initialState);

      setErrors({});

      setCurrentStep(0);

      setDirection(-1);

      // Reset data wilayah

      setKecamatanOptions([]);

      setDesaOptions([]);

      // Reset input file secara visual

      const fileInputs =

        document.querySelectorAll(

          'input[type="file"]'

        );

      fileInputs.forEach((input) => {

        input.value = "";

      });

    } catch (error) {

      console.error(

        "Gagal submit pelaporan:",

        error

      );

      setSubmitMessage({

        type: "error",

        text:

          error?.message ||

          "Gagal mengirim laporan. Silakan coba lagi.",

      });

    } finally {

      setIsSubmitting(false);

    }

  };

  // =====================================================

  // STEP CONTENT

  // =====================================================

  const renderStepContent = () => {

    // ===================================================

    // STEP 1

    // ===================================================

    if (currentStep === 0) {

      return (

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          <div className="sm:col-span-2">

            <div className="mb-4 rounded-2xl bg-[#155DFC]/5 p-3 text-sm text-slate-700 ring-1 ring-[#155DFC]/15">

              Pastikan data pelapor akurat agar proses

              verifikasi lebih cepat.

            </div>

          </div>

          {/* Nama */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Nama lengkap pelapor

            </label>

            <input

              value={form.nama_pelapor}

              onChange={(e) =>

                handleChange(

                  "nama_pelapor",

                  e.target.value

                )

              }

              className={inputClass}

              placeholder="Masukkan nama lengkap"

            />

            {errors.nama_pelapor && (

              <p className={errorClass}>

                {errors.nama_pelapor}

              </p>

            )}

          </div>

          {/* NIK */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              NIK pelapor

            </label>

            <input

              value={form.nik_pelapor}

              onChange={(e) =>

                handleChange(

                  "nik_pelapor",

                  e.target.value.replace(

                    /\D/g,

                    ""

                  )

                )

              }

              maxLength={16}

              inputMode="numeric"

              className={inputClass}

              placeholder="16 digit"

            />

            {errors.nik_pelapor && (

              <p className={errorClass}>

                {errors.nik_pelapor}

              </p>

            )}

          </div>

          {/* Telepon */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Nomor telepon / WhatsApp

            </label>

            <input

              value={form.telepon}

              onChange={(e) =>

                handleChange(

                  "telepon",

                  e.target.value

                )

              }

              className={inputClass}

              placeholder="Contoh: 081234567890"

            />

            {errors.telepon && (

              <p className={errorClass}>

                {errors.telepon}

              </p>

            )}

          </div>

          {/* Email */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Alamat email

            </label>

            <input

              type="email"

              value={form.email}

              onChange={(e) =>

                handleChange(

                  "email",

                  e.target.value

                )

              }

              className={inputClass}

              placeholder="nama@email.com"

            />

          </div>

          {/* Alamat */}

          <div className="sm:col-span-2">

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Alamat domisili lengkap

            </label>

            <textarea

              value={form.alamat}

              onChange={(e) =>

                handleChange(

                  "alamat",

                  e.target.value

                )

              }

              className={inputClass}

              rows={4}

              placeholder="RT/RW, Desa/Kelurahan, Kecamatan, Kabupaten/Kota, Provinsi"

            />

            {errors.alamat && (

              <p className={errorClass}>

                {errors.alamat}

              </p>

            )}

          </div>

          {/* Hubungan */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Hubungan dengan korban

            </label>

            <select

              value={form.hubungan}

              onChange={(e) =>

                handleChange(

                  "hubungan",

                  e.target.value

                )

              }

              className={inputClass}

            >

              <option value="">

                -- pilih --

              </option>

              <option>

                Orang tua

              </option>

              <option>

                Kerabat

              </option>

              <option>

                Tetangga

              </option>

              <option>

                Guru

              </option>

              <option>

                Aparat desa

              </option>

              <option>

                Pendamping sosial

              </option>

              <option>

                Korban sendiri

              </option>

            </select>

            {errors.hubungan && (

              <p className={errorClass}>

                {errors.hubungan}

              </p>

            )}

          </div>

          {/* Pernyataan */}

          <div className="sm:col-span-2">

            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">

              <input

                type="checkbox"

                checked={

                  form.persetujuan_kebenaran

                }

                onChange={(e) =>

                  handleChange(

                    "persetujuan_kebenaran",

                    e.target.checked

                  )

                }

                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"

              />

              <span>

                Saya bertanggung jawab atas

                kebenaran data yang saya berikan.

              </span>

            </label>

            {errors.persetujuan_kebenaran && (

              <p className={errorClass}>

                {

                  errors.persetujuan_kebenaran

                }

              </p>

            )}

          </div>

        </div>

      );

    }

    // ===================================================

    // STEP 2

    // ===================================================

    if (currentStep === 1) {

      return (

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Nama perempuan */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Nama calon mempelai perempuan

            </label>

            <input

              value={form.nama_perempuan}

              onChange={(e) =>

                handleChange(

                  "nama_perempuan",

                  e.target.value

                )

              }

              className={inputClass}

              placeholder="Masukkan nama"

            />

          </div>

          {/* Usia perempuan */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Usia perempuan

            </label>

            <input

              value={form.usia_perempuan}

              onChange={(e) =>

                handleChange(

                  "usia_perempuan",

                  e.target.value

                )

              }

              type="text"

              className={inputClass}

              placeholder="Contoh: 17 tahun"

            />

            {errors.usia_perempuan && (

              <p className={errorClass}>

                {errors.usia_perempuan}

              </p>

            )}

          </div>

          {/* Nama laki-laki */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Nama calon mempelai laki-laki

            </label>

            <input

              value={form.nama_laki}

              onChange={(e) =>

                handleChange(

                  "nama_laki",

                  e.target.value

                )

              }

              className={inputClass}

              placeholder="Masukkan nama"

            />

          </div>

          {/* Usia laki-laki */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Usia laki-laki

            </label>

            <input

              value={form.usia_laki}

              onChange={(e) =>

                handleChange(

                  "usia_laki",

                  e.target.value

                )

              }

              type="text"

              className={inputClass}

              placeholder="Contoh: 20 tahun"

            />

            {errors.usia_laki && (

              <p className={errorClass}>

                {errors.usia_laki}

              </p>

            )}

          </div>

          {/* Pendidikan perempuan */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Pendidikan perempuan

            </label>

            <select

              value={

                form.pendidikan_perempuan

              }

              onChange={(e) =>

                handleChange(

                  "pendidikan_perempuan",

                  e.target.value

                )

              }

              className={inputClass}

            >

              <option value="">

                -- pilih --

              </option>

              <option>

                Masih sekolah

              </option>

              <option>

                Putus sekolah

              </option>

              <option>

                Tidak sekolah

              </option>

            </select>

          </div>

          {/* Pendidikan laki-laki */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Pendidikan laki-laki

            </label>

            <select

              value={form.pendidikan_laki}

              onChange={(e) =>

                handleChange(

                  "pendidikan_laki",

                  e.target.value

                )

              }

              className={inputClass}

            >

              <option value="">

                -- pilih --

              </option>

              <option>

                Masih sekolah

              </option>

              <option>

                Putus sekolah

              </option>

              <option>

                Tidak sekolah

              </option>

            </select>

          </div>

          {/* Provinsi */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Provinsi

            </label>

            <div className="flex h-[50px] items-center rounded-2xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700">

              Jawa Barat

            </div>

            {errors.provinsi && (

              <p className={errorClass}>

                {errors.provinsi}

              </p>

            )}

          </div>

          {/* Kabupaten */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Kabupaten/Kota

            </label>

            <select

              value={form.kabupaten}

              onChange={(e) => {

                handleChange(

                  "kabupaten",

                  e.target.value

                );

                handleChange(

                  "kecamatan",

                  ""

                );

                handleChange(

                  "desa",

                  ""

                );

              }}

              disabled={loadingKabupaten}

              className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-100`}

            >

              <option value="">

                {loadingKabupaten

                  ? "Memuat kabupaten..."

                  : "-- pilih kabupaten/kota --"}

              </option>

              {kabupatenOptions.map(

                (kabupaten) => (

                  <option

                    key={kabupaten.id}

                    value={kabupaten.id}

                  >

                    {kabupaten.name}

                  </option>

                )

              )}

            </select>

            {errors.kabupaten && (

              <p className={errorClass}>

                {errors.kabupaten}

              </p>

            )}

          </div>

          {/* Kecamatan */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Kecamatan

            </label>

            <select

              value={form.kecamatan}

              onChange={(e) => {

                handleChange(

                  "kecamatan",

                  e.target.value

                );

                handleChange(

                  "desa",

                  ""

                );

              }}

              disabled={

                !form.kabupaten ||

                loadingKecamatan

              }

              className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-100`}

            >

              <option value="">

                {loadingKecamatan

                  ? "Memuat kecamatan..."

                  : !form.kabupaten

                    ? "Pilih kabupaten terlebih dahulu"

                    : "-- pilih kecamatan --"}

              </option>

              {kecamatanOptions.map(

                (kecamatan) => (

                  <option

                    key={kecamatan.id}

                    value={kecamatan.id}

                  >

                    {kecamatan.name}

                  </option>

                )

              )}

            </select>

            {errors.kecamatan && (

              <p className={errorClass}>

                {errors.kecamatan}

              </p>

            )}

          </div>

          {/* Desa */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Desa/Kelurahan

            </label>

            <select

              value={form.desa}

              onChange={(e) =>

                handleChange(

                  "desa",

                  e.target.value

                )

              }

              disabled={

                !form.kecamatan ||

                loadingDesa

              }

              className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-100`}

            >

              <option value="">

                {loadingDesa

                  ? "Memuat desa/kelurahan..."

                  : !form.kecamatan

                    ? "Pilih kecamatan terlebih dahulu"

                    : "-- pilih desa/kelurahan --"}

              </option>

              {desaOptions.map((desa) => (

                <option

                  key={desa.id}

                  value={desa.id}

                >

                  {desa.name}

                </option>

              ))}

            </select>

            {errors.desa && (

              <p className={errorClass}>

                {errors.desa}

              </p>

            )}

          </div>

          {/* ERROR WILAYAH */}

          {wilayahError && (

            <div className="sm:col-span-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

              {wilayahError}

            </div>

          )}

          {/* WAKTU AKAD */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Waktu/rencana akad

            </label>

            <input

              type="date"

              value={form.waktu_akad}

              onChange={(e) =>

                handleChange(

                  "waktu_akad",

                  e.target.value

                )

              }

              className={inputClass}

            />

          </div>

          {/* DISPENSASI */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Status pengajuan dispensasi

            </label>

            <select

              value={form.dispensasi}

              onChange={(e) =>

                handleChange(

                  "dispensasi",

                  e.target.value

                )

              }

              className={inputClass}

            >

              <option value="">

                -- pilih --

              </option>

              <option>

                Sudah

              </option>

              <option>

                Belum

              </option>

              <option>

                Tidak tahu

              </option>

            </select>

          </div>

          {/* PENDAMPINGAN */}

          <div>

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Apakah korban sudah didampingi?

            </label>

            <select

              value={form.korban_didampingi}

              onChange={(e) =>

                handleChange(

                  "korban_didampingi",

                  e.target.value

                )

              }

              className={inputClass}

            >

              <option value="">

                -- pilih --

              </option>

              <option>

                Sudah

              </option>

              <option>

                Belum

              </option>

              <option>

                Tidak tahu

              </option>

            </select>

          </div>

          {/* FAKTOR */}

          <div className="sm:col-span-2">

            <label className="mb-2 block text-sm font-medium text-slate-700">

              Faktor pendorong utama

            </label>

            <div className="flex flex-wrap gap-2">

              {[

                "Ekonomi",

                "Tekanan keluarga",

                "Hamil di luar nikah",

                "Adat/budaya",

                "Lainnya",

              ].map((factor) => {

                const selected =

                  form.faktor_pendorong.includes(

                    factor

                  );

                return (

                  <label

                    key={factor}

                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${

                      selected

                        ? "border-blue-500 bg-blue-50 text-blue-700"

                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"

                    }`}

                  >

                    <input

                      type="checkbox"

                      checked={selected}

                      onChange={() =>

                        toggleFactor(factor)

                      }

                      className="sr-only"

                    />

                    {factor}

                  </label>

                );

              })}

            </div>

          </div>

          {/* KRONOLOGI */}

          <div className="sm:col-span-2">

            <label className="mb-1 block text-sm font-medium text-slate-700">

              Deskripsi kronologi kasus

            </label>

            <textarea

              value={form.kronologi}

              onChange={(e) =>

                handleChange(

                  "kronologi",

                  e.target.value

                )

              }

              className={inputClass}

              rows={5}

              placeholder="Panduan: kapan diketahui, siapa yang terlibat, dan apa yang sudah dilakukan?"

            />

            {errors.kronologi && (

              <p className={errorClass}>

                {errors.kronologi}

              </p>

            )}

          </div>

        </div>

      );

    }

    // ===================================================

    // STEP 3

    // ===================================================

    return (

      <div className="space-y-5">

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* FOTO BUKTI */}

          <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/60 p-4">

            <label className="mb-2 block text-sm font-medium text-slate-700">

              Foto/bukti awal

            </label>

            <input

              type="file"

              accept="image/*,application/pdf"

              onChange={(e) =>

                handleFile(

                  "foto_bukti",

                  e.target.files?.[0] ||

                    null

                )

              }

              className="w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"

            />

            {form.foto_bukti && (

              <p className="mt-2 text-xs font-medium text-emerald-600">

                File dipilih:{" "}

                {form.foto_bukti.name}

              </p>

            )}

            {errors.foto_bukti && (

              <p className={errorClass}>

                {errors.foto_bukti}

              </p>

            )}

          </div>

          {/* DOKUMEN */}

          <div className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 p-4">

            <label className="mb-2 block text-sm font-medium text-slate-700">

              Dokumen pendukung lain

            </label>

            <input

              type="file"

              accept="image/*,application/pdf"

              onChange={(e) =>

                handleFile(

                  "dokumen_pendukung",

                  e.target.files?.[0] ||

                    null

                )

              }

              className="w-full text-sm text-slate-600 file:mr-3 file:rounded-full file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"

            />

            {form.dokumen_pendukung && (

              <p className="mt-2 text-xs font-medium text-emerald-600">

                File dipilih:{" "}

                {

                  form.dokumen_pendukung

                    .name

                }

              </p>

            )}

            {errors.dokumen_pendukung && (

              <p className={errorClass}>

                {

                  errors.dokumen_pendukung

                }

              </p>

            )}

          </div>

        </div>

        {/* PERSETUJUAN */}

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

          <div className="space-y-4">

            {/* KEBENARAN */}

            <div>

              <label className="flex items-start gap-3 text-sm text-slate-700">

                <input

                  type="checkbox"

                  checked={

                    form.checklist_kebenaran

                  }

                  onChange={(e) =>

                    handleChange(

                      "checklist_kebenaran",

                      e.target.checked

                    )

                  }

                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"

                />

                <span>

                  Saya menyatakan bahwa data

                  yang saya berikan adalah benar.

                </span>

              </label>

              {errors.checklist_kebenaran && (

                <p className={errorClass}>

                  {

                    errors.checklist_kebenaran

                  }

                </p>

              )}

            </div>

            {/* PDP */}

            <div>

              <label className="flex items-start gap-3 text-sm text-slate-700">

                <input

                  type="checkbox"

                  checked={

                    form.checklist_pdp

                  }

                  onChange={(e) =>

                    handleChange(

                      "checklist_pdp",

                      e.target.checked

                    )

                  }

                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"

                />

                <span>

                  Saya menyetujui pemrosesan data

                  pribadi sesuai UU PDP dan

                  perlindungan anak.

                </span>

              </label>

              {errors.checklist_pdp && (

                <p className={errorClass}>

                  {errors.checklist_pdp}

                </p>

              )}

            </div>

            {/* KERAHASIAAN */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">

                Opsi kerahasiaan identitas pelapor

              </label>

              <div className="flex flex-wrap gap-3">

                {[

                  {

                    value: "anonim",

                    label: "Anonim",

                  },

                  {

                    value: "rahasia",

                    label:

                      "Rahasia (hanya petugas)",

                  },

                  {

                    value: "biasa",

                    label:

                      "Biasa (tidak rahasia)",

                  },

                ].map((option) => {

                  const selected =

                    form.kerahasiaan ===

                    option.value;

                  return (

                    <label

                      key={option.value}

                      className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${

                        selected

                          ? "border-blue-500 bg-blue-50 text-blue-700"

                          : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"

                      }`}

                    >

                      <input

                        type="radio"

                        name="kerahasiaan"

                        checked={selected}

                        onChange={() =>

                          handleChange(

                            "kerahasiaan",

                            option.value

                          )

                        }

                        className="sr-only"

                      />

                      {option.label}

                    </label>

                  );

                })}

              </div>

              {errors.kerahasiaan && (

                <p className={errorClass}>

                  {errors.kerahasiaan}

                </p>

              )}

            </div>

          </div>

        </div>

      </div>

    );

  };

  return (

    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#dff7ff_0%,#eaf9ff_18%,#f2fbff_42%,#ffffff_72%,#eff7ff_100%)] px-4 py-10">

      {/* BACKGROUND */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(125,211,252,0.9),transparent_18%),radial-gradient(circle_at_78%_12%,rgba(147,197,253,0.75),transparent_22%),radial-gradient(circle_at_68%_72%,rgba(186,230,253,0.9),transparent_28%),radial-gradient(circle_at_48%_42%,rgba(255,255,255,0.95),transparent_30%)]" />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.14)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-sky-300/55 blur-3xl" />

      <div className="absolute right-0 top-4 h-96 w-96 rounded-full bg-cyan-200/45 blur-3xl" />

      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-200/45 blur-3xl" />

      <div className="relative mx-auto max-w-5xl">

        {/* HERO */}

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

                <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">

                  Ajukan laporan dengan aman & cepat

                </h1>

                <p className="mt-3 max-w-lg text-sm text-blue-50 md:text-base">

                  Simponi membantu masyarakat

                  melaporkan kasus dengan proses yang

                  jelas, aman, dan mudah dipahami.

                </p>

              </div>

              <div className="relative hidden min-h-[170px] flex-1 items-center justify-center lg:flex">

                <div className="absolute inset-x-8 top-4 h-24 rounded-full bg-white/10 blur-2xl" />

                <motion.div

                  initial={{

                    opacity: 0,

                    y: 18,

                    rotate: -8,

                  }}

                  animate={{

                    opacity: 1,

                    y: 0,

                    rotate: 0,

                  }}

                  transition={{

                    duration: 0.5,

                    ease: "easeOut",

                  }}

                  className="relative flex h-40 w-40 items-center justify-center rounded-[30px] border border-white/20 bg-white/10 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-sm"

                >

                  <div className="absolute inset-3 rounded-[24px] border border-dashed border-white/20" />

                  <div className="space-y-3 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#155DFC] shadow-lg">

                      <svg

                        viewBox="0 0 24 24"

                        className="h-7 w-7 fill-current"

                        aria-hidden="true"

                      >

                        <path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Zm0 9.5A2.5 2.5 0 1 0 12 6a2.5 2.5 0 0 0 0 5.5Z" />

                      </svg>

                    </div>

                    <div>

                      <p className="text-[10px] uppercase tracking-[0.28em] text-blue-100">

                        Protected

                      </p>

                      <p className="mt-1 text-2xl font-black">

                        24/7

                      </p>

                    </div>

                  </div>

                </motion.div>

              </div>

            </div>

          </div>

          {/* STEPS */}

          <div className="mt-6 grid gap-3 md:grid-cols-3">

            {steps.map((step, index) => {

              const isActive =

                index === currentStep;

              const isDone =

                index < currentStep;

              return (

                <div

                  key={step.id}

                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"

                >

                  <div

                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${

                      isActive

                        ? "bg-white text-[#155DFC] shadow-lg shadow-blue-900/20"

                        : isDone

                          ? "bg-emerald-400 text-white"

                          : "bg-white/10 text-white/80"

                    }`}

                  >

                    {isDone ? (

                      "✓"

                    ) : (

                      <StepIcon index={index} />

                    )}

                  </div>

                  <div className="min-w-0">

                    <p

                      className={`truncate text-sm font-semibold ${

                        isActive

                          ? "text-white"

                          : "text-blue-100"

                      }`}

                    >

                      {step.title}

                    </p>

                    <p className="truncate text-xs text-blue-100/80">

                      {step.caption}

                    </p>

                  </div>

                </div>

              );

            })}

          </div>

        </div>

        {/* FORM */}

        <form

          onSubmit={handleSubmit}

          className="relative overflow-hidden rounded-[30px] border border-sky-200 bg-[linear-gradient(135deg,#dff4ff_0%,#eefcff_28%,#ffffff_58%,#f0f9ff_100%)] p-4 shadow-[0_30px_90px_rgba(59,130,246,0.15)] backdrop-blur-2xl sm:p-6 lg:p-8"

        >

          <div className="absolute -right-16 top-10 h-40 w-40 rounded-full bg-sky-200/65 blur-3xl" />

          <div className="absolute -bottom-12 left-16 h-36 w-36 rounded-full bg-blue-100/80 blur-3xl" />

          <div className="absolute left-10 top-6 h-28 w-28 rounded-full bg-cyan-200/45 blur-3xl" />

          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky-400 to-transparent" />

          {/* SUBMIT MESSAGE */}

          {submitMessage.text && (

            <div

              className={`relative z-10 mb-5 rounded-2xl border px-4 py-3 text-sm ${

                submitMessage.type ===

                "success"

                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"

                  : "border-red-200 bg-red-50 text-red-700"

              }`}

            >

              {submitMessage.text}

            </div>

          )}

          {/* PROGRESS */}

          <div className="relative z-10 mb-6 h-2 w-full overflow-hidden rounded-full bg-slate-100">

            <motion.div

              className="h-full rounded-full bg-[linear-gradient(90deg,#155DFC_0%,#3f7cff_48%,#7aa7ff_100%)]"

              initial={{ width: 0 }}

              animate={{

                width: `${

                  ((currentStep + 1) /

                    steps.length) *

                  100

                }%`,

              }}

              transition={{

                duration: 0.35,

                ease: "easeOut",

              }}

            />

          </div>

          {/* CONTENT */}

          <AnimatePresence mode="wait">

            <motion.section

              key={currentStep}

              initial={{

                opacity: 0,

                x:

                  direction > 0

                    ? 50

                    : -50,

                y: 12,

                scale: 0.98,

              }}

              animate={{

                opacity: 1,

                x: 0,

                y: 0,

                scale: 1,

              }}

              exit={{

                opacity: 0,

                x:

                  direction > 0

                    ? -50

                    : 50,

                y: -12,

                scale: 0.98,

              }}

              transition={{

                duration: 0.35,

                ease: "easeOut",

              }}

              className="relative z-10 rounded-[26px] bg-gradient-to-br from-slate-50 to-white p-4 ring-1 ring-slate-100 sm:p-6"

            >

              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#155DFC]">

                    Langkah {currentStep + 1}

                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-800">

                    {steps[currentStep].title}

                  </h2>

                </div>

                <div className="w-fit rounded-full bg-[#155DFC]/5 px-3 py-1 text-xs font-medium text-[#155DFC]">

                  {

                    steps[currentStep]

                      .caption

                  }

                </div>

              </div>

              {renderStepContent()}

            </motion.section>

          </AnimatePresence>

          {/* BUTTON */}

          <div className="relative z-10 mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">

            <button

              type="button"

              onClick={goPrev}

              disabled={currentStep === 0}

              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"

            >

              Kembali

            </button>

            {currentStep <

            steps.length - 1 ? (

              <button

                type="button"

                onClick={goNext}

                className="rounded-full bg-[linear-gradient(135deg,#155DFC_0%,#2d6bff_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(21,93,252,0.35)] transition hover:scale-[1.01] hover:shadow-[0_16px_34px_rgba(21,93,252,0.42)]"

              >

                Lanjutkan

              </button>

            ) : (

              <button

                type="submit"

                disabled={isSubmitting}

                className="rounded-full bg-[linear-gradient(135deg,#10b981_0%,#059669_100%)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(5,150,105,0.35)] transition hover:scale-[1.01] hover:shadow-[0_16px_34px_rgba(5,150,105,0.42)] disabled:cursor-not-allowed disabled:opacity-70"

              >

                {isSubmitting

                  ? "Mengirim..."

                  : "Kirim Laporan"}

              </button>

            )}

          </div>

        </form>

      </div>

    </div>

  );

}