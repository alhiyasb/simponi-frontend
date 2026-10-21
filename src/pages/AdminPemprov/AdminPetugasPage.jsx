
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";

import {
  getAdminOfficers,
  createAdminOfficer,
  updateAdminOfficer,
  deleteAdminOfficer,
  toggleAdminOfficerStatus,
} from "../../services/api";

const EMPTY_FORM = {
  nip: "",
  email: "",
  full_name: "",
  password: "",
  kode_kabupaten: "",
};

function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}

function FormInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-slate-700"
      >
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0164DD] focus:ring-4 focus:ring-blue-50"
      />
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
  valueClass = "text-slate-900",
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <p className={`mt-2 text-3xl font-bold ${valueClass}`}>
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

export default function AdminPetugasPage() {
  const [officers, setOfficers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingOfficer, setEditingOfficer] = useState(null);

  const [form, setForm] = useState({ ...EMPTY_FORM });

  // Mengambil data petugas
  async function loadOfficers() {
    try {
      setIsLoading(true);

      const data = await getAdminOfficers();
      setOfficers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal mengambil petugas:", err);
      setError(err?.message || "Gagal mengambil data petugas.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOfficers();
  }, []);

  // Mengosongkan form
  function resetForm() {
    setForm({ ...EMPTY_FORM });
    setEditingOfficer(null);
    setShowForm(false);
  }

  // Membuka form tambah petugas
  function openCreateForm() {
    setError("");
    setSuccess("");
    setForm({ ...EMPTY_FORM });
    setEditingOfficer(null);
    setShowForm(true);
  }

  // Mengisi form dengan data petugas yang dipilih
  function handleEdit(officer) {
    setError("");
    setSuccess("");

    setForm({
      nip: officer.nip || "",
      email: officer.email || "",
      full_name: officer.full_name || "",
      password: "",
      kode_kabupaten: String(
        officer.kode_kabupaten ?? ""
      ),
    });

    setEditingOfficer(officer);
    setShowForm(true);
  }

  // Menangani perubahan input
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  // Menutup form
  function closeForm() {
    if (isSaving) return;
    resetForm();
  }

  // Menyimpan data petugas
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.nip.trim() ||
      !form.email.trim() ||
      !form.full_name.trim() ||
      !form.kode_kabupaten.trim()
    ) {
      setError(
        "Nama, NIP, email, dan kode kabupaten wajib diisi."
      );
      return;
    }

    if (!editingOfficer && !form.password.trim()) {
      setError("Password wajib diisi untuk akun baru.");
      return;
    }

    const kodeKabupaten = Number(form.kode_kabupaten);

    if (
      !Number.isFinite(kodeKabupaten) ||
      kodeKabupaten <= 0
    ) {
      setError(
        "Kode kabupaten harus berupa angka yang valid."
      );
      return;
    }

    const payload = {
      nip: form.nip.trim(),
      email: form.email.trim(),
      full_name: form.full_name.trim(),
      kode_kabupaten: kodeKabupaten,
    };

    // Password hanya dikirim saat diisi
    if (form.password.trim()) {
      payload.password = form.password;
    }

    try {
      setIsSaving(true);

      if (editingOfficer) {
        await updateAdminOfficer(
          editingOfficer.id,
          payload
        );

        setSuccess(
          "Data petugas berhasil diperbarui."
        );
      } else {
        await createAdminOfficer({
          ...payload,
          password: form.password,
        });

        setSuccess(
          "Akun Admin Pemda berhasil dibuat."
        );
      }

      resetForm();
      await loadOfficers();
    } catch (err) {
      console.error("Gagal menyimpan petugas:", err);
      setError(
        err?.message || "Gagal menyimpan data petugas."
      );
    } finally {
      setIsSaving(false);
    }
  }

  // Menghapus akun petugas
  async function handleDelete(officer) {
    const confirmed = window.confirm(
      `Yakin ingin menghapus akun petugas "${officer.full_name}"?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteAdminOfficer(officer.id);

      setSuccess("Akun petugas berhasil dihapus.");
      await loadOfficers();
    } catch (err) {
      console.error("Gagal menghapus petugas:", err);
      setError(
        err?.message || "Gagal menghapus akun petugas."
      );
    }
  }

  // Mengaktifkan atau menonaktifkan akun petugas
  async function handleToggleStatus(officer) {
    const nextStatus = !officer.is_active;

    const confirmed = window.confirm(
      `Yakin ingin ${
        nextStatus ? "mengaktifkan" : "menonaktifkan"
      } akun ${officer.full_name}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await toggleAdminOfficerStatus(
        officer.id,
        nextStatus
      );

      setSuccess(
        `Akun ${officer.full_name} berhasil ${
          nextStatus ? "diaktifkan" : "dinonaktifkan"
        }.`
      );

      await loadOfficers();
    } catch (err) {
      console.error("Gagal mengubah status:", err);
      setError(
        err?.message || "Gagal mengubah status petugas."
      );
    }
  }

  const activeCount = officers.filter(
    (officer) => officer.is_active
  ).length;

  const inactiveCount =
    officers.length - activeCount;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(1,100,221,0.14),_transparent_28%),linear-gradient(180deg,#f8fbff_0%,#eef5ff_100%)]">
        <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
          <div className="px-6 py-7 sm:px-8 lg:px-10">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#0164DD]">
                  Administrasi
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Manajemen Petugas
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Kelola akun Admin Pemda yang bertugas menangani
                  laporan di setiap kabupaten/kota.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0164DD] to-[#1386FF] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(1,100,221,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(1,100,221,0.28)]"
                >
                  <span className="text-lg leading-none">＋</span>
                  Tambah Petugas
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="px-6 py-7 sm:px-8 lg:px-10">
          {success && (
            <div
              role="status"
              className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 shadow-sm"
            >
              <p className="text-sm font-medium text-emerald-700">
                ✓ {success}
              </p>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 shadow-sm"
            >
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          <section className="relative mb-6 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0A5BD6] via-[#0673E3] to-[#53A6FF] p-7 text-white shadow-[0_22px_45px_rgba(1,100,221,0.22)] sm:p-8">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.22),_transparent_52%)]" />
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10" />
            <div className="absolute -bottom-14 right-20 h-44 w-44 rounded-full bg-white/10" />

            <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-100">
                  Super admin
                </p>

                <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                  Kelola tim Admin Pemda dengan lebih terstruktur.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100">
                  Pantau data petugas, status akun, dan wilayah kerja
                  secara cepat dari satu halaman yang lebih rapi dan
                  informatif.
                </p>
              </div>

              <div className="flex items-center gap-3 self-start rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-lg font-bold shadow-inner">
                  ↗
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-blue-100">
                    Total akun
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {officers.length} petugas
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              title="Total Petugas"
              value={officers.length}
              description="Akun Admin Pemda"
            />

            <SummaryCard
              title="Aktif"
              value={activeCount}
              description="Dapat masuk ke sistem"
              valueClass="text-emerald-600"
            />

            <SummaryCard
              title="Nonaktif"
              value={inactiveCount}
              description="Tidak dapat masuk"
              valueClass="text-slate-500"
            />
          </div>

          <section className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Daftar Petugas
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Daftar akun Admin Pemda yang terdaftar pada sistem
                  SIMPONI.
                </p>
              </div>

              <span className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {officers.length} terdaftar
              </span>
            </div>

            {isLoading ? (
              <div className="flex min-h-[250px] items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-[#0164DD]" />
                  <p className="mt-4 text-sm text-slate-500">
                    Memuat data petugas...
                  </p>
                </div>
              </div>
            ) : officers.length === 0 ? (
              <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-[#0164DD] shadow-inner shadow-blue-100">
                  ♙
                </div>

                <h3 className="mt-4 font-semibold text-slate-800">
                  Belum ada petugas
                </h3>

                <p className="mt-1 max-w-sm text-sm text-slate-400">
                  Tambahkan akun Admin Pemda untuk mulai mengelola
                  laporan wilayah.
                </p>

                <button
                  type="button"
                  onClick={openCreateForm}
                  className="mt-5 rounded-xl bg-[#0164DD] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0058C7]"
                >
                  Tambah Petugas
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80">
                      {[
                        "Petugas",
                        "NIP",
                        "Email",
                        "Kode Kabupaten",
                        "Status",
                        "Aksi",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {officers.map((officer) => (
                      <tr
                        key={officer.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-[#dbeeff] font-bold text-[#0164DD] shadow-sm">
                              {officer.full_name
                                ?.charAt(0)
                                ?.toUpperCase() || "P"}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {officer.full_name || "-"}
                              </p>

                              <p className="text-xs text-slate-400">
                                Admin Pemda
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {officer.nip || "-"}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-500">
                          {officer.email || "-"}
                        </td>

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                            {officer.kode_kabupaten ?? "-"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <StatusBadge active={officer.is_active} />
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(officer)}
                              disabled
                              title="Edit petugas belum tersedia di API backend"
                              className="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-400 transition"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleStatus(officer)}
                              className={`whitespace-nowrap rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                                officer.is_active
                                  ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                  : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                            >
                              {officer.is_active
                                ? "Nonaktifkan"
                                : "Aktifkan"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(officer)}
                              disabled
                              title="Hapus petugas belum tersedia di API backend"
                              className="cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-400 transition"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>

        {showForm && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeForm();
              }
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-petugas-title"
              className="relative z-[10000] max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[28px] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="border-b border-slate-100 bg-gradient-to-r from-[#f4f9ff] to-white px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0164DD]">
                      {editingOfficer ? "Perbarui" : "Baru"}
                    </p>
                    <h2
                      id="modal-petugas-title"
                      className="mt-2 text-xl font-bold text-slate-900"
                    >
                      {editingOfficer
                        ? "Edit Data Petugas"
                        : "Tambah Akun Petugas"}
                    </h2>
                  </div>

                  <button
                    type="button"
                    aria-label="Tutup modal"
                    onClick={closeForm}
                    disabled={isSaving}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
                  >
                    ×
                  </button>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  {editingOfficer
                    ? "Perbarui informasi akun Admin Pemda."
                    : "Buat akun baru untuk Admin Pemda."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-6">
                <FormInput
                  label="Nama Lengkap"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Contoh: Petugas Garut"
                  required
                />

                <FormInput
                  label="NIP"
                  name="nip"
                  value={form.nip}
                  onChange={handleChange}
                  placeholder="Masukkan NIP petugas"
                  required
                />

                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="petugas@pemda.id"
                  required
                />

                <FormInput
                  label={
                    editingOfficer
                      ? "Password Baru (Opsional)"
                      : "Password"
                  }
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={
                    editingOfficer
                      ? "Kosongkan jika tidak ingin mengubah password"
                      : "Masukkan password awal"
                  }
                  required={!editingOfficer}
                />

                <div>
                  <label
                    htmlFor="kode_kabupaten"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Kode Kabupaten/Kota
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="kode_kabupaten"
                    type="number"
                    name="kode_kabupaten"
                    value={form.kode_kabupaten}
                    onChange={handleChange}
                    placeholder="Contoh: 3205"
                    required
                    min="1"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0164DD] focus:ring-4 focus:ring-blue-50"
                  />

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Kode ini menentukan wilayah kerja Admin Pemda.
                  </p>
                </div>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeForm}
                    disabled={isSaving}
                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="rounded-xl bg-gradient-to-r from-[#0164DD] to-[#1386FF] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(1,100,221,0.2)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving
                      ? "Menyimpan..."
                      : editingOfficer
                        ? "Simpan Perubahan"
                        : "Buat Akun Petugas"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
