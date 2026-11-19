
import { useState } from "react";
import { Search, Plus, Pencil, Trash2, X, GraduationCap } from "lucide-react";
import { lecturers as initialLecturers } from "../data/lecturers";

export default function Lecturers() {
  const [lecturers, setLecturers] = useState(initialLecturers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const emptyForm = {
    name: "",
    nidn: "",
    email: "",
    prodi: "Informatika",
    expertise: "",
    research: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  const filteredLecturers = lecturers.filter((lecturer) => {
    const keyword = search.toLowerCase();

    return (
      lecturer.name.toLowerCase().includes(keyword) ||
      lecturer.nidn.toLowerCase().includes(keyword) ||
      lecturer.prodi.toLowerCase().includes(keyword) ||
      lecturer.expertise.some((item) =>
        item.toLowerCase().includes(keyword)
      )
    );
  });

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (lecturer) => {
    setEditingId(lecturer.id);

    setFormData({
      name: lecturer.name,
      nidn: lecturer.nidn,
      email: lecturer.email,
      prodi: lecturer.prodi,
      expertise: lecturer.expertise.join(", "),
      research: lecturer.research.join("\n"),
    });

    setError("");
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nidnExists = lecturers.some(
      (lecturer) =>
        lecturer.nidn === formData.nidn.trim() &&
        lecturer.id !== editingId
    );

    const emailExists = lecturers.some(
      (lecturer) =>
        lecturer.email.toLowerCase() === formData.email.trim().toLowerCase() &&
        lecturer.id !== editingId
    );

    if (nidnExists) {
      setError("NIDN sudah terdaftar.");
      return;
    }

    if (emailExists) {
      setError("Email sudah digunakan.");
      return;
    }

    const cleanData = {
      name: formData.name.trim(),
      nidn: formData.nidn.trim(),
      email: formData.email.trim(),
      prodi: formData.prodi,
      expertise: formData.expertise
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      research: formData.research
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    if (
      !cleanData.name ||
      !cleanData.nidn ||
      !cleanData.email ||
      cleanData.expertise.length === 0
    ) {
      setError("Lengkapi data dosen dan minimal satu bidang keahlian.");
      return;
    }

    if (editingId !== null) {
      setLecturers((prev) =>
        prev.map((lecturer) =>
          lecturer.id === editingId
            ? { ...lecturer, ...cleanData }
            : lecturer
        )
      );
    } else {
      setLecturers((prev) => [
        ...prev,
        { id: Date.now(), ...cleanData },
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Yakin ingin menghapus data dosen ini?"
    );

    if (confirmed) {
      setLecturers((prev) =>
        prev.filter((lecturer) => lecturer.id !== id)
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Data Dosen & Keahlian
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola profil, bidang keahlian, dan riwayat penelitian dosen.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          <Plus size={18} />
          Tambah Dosen
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg text-slate-800">
              {editingId !== null ? "Edit Data Dosen" : "Tambah Dosen"}
            </h2>

            <button
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Nama Dosen
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nama lengkap dosen"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  NIDN
                </label>
                <input
                  required
                  value={formData.nidn}
                  onChange={(e) =>
                    setFormData({ ...formData, nidn: e.target.value })
                  }
                  placeholder="Nomor NIDN"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="dosen@unklab.ac.id"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Program Studi
                </label>
                <select
                  value={formData.prodi}
                  onChange={(e) =>
                    setFormData({ ...formData, prodi: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none"
                >
                  <option>Informatika</option>
                  <option>Sistem Informasi</option>
                  <option>Teknologi Informasi</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">
                  Bidang Keahlian
                </label>
                <input
                  required
                  value={formData.expertise}
                  onChange={(e) =>
                    setFormData({ ...formData, expertise: e.target.value })
                  }
                  placeholder="Artificial Intelligence, Machine Learning, Data Mining"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Pisahkan setiap bidang keahlian menggunakan koma.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">
                  Riwayat Penelitian
                </label>
                <textarea
                  rows={4}
                  value={formData.research}
                  onChange={(e) =>
                    setFormData({ ...formData, research: e.target.value })
                  }
                  placeholder={"Satu judul penelitian per baris"}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Masukkan satu judul penelitian pada setiap baris.
                </p>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600"
              >
                Batal
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Simpan Data Dosen
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="relative w-full md:max-w-sm mb-5">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIDN, atau keahlian..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <p className="text-sm text-slate-500 mb-4">
          Total dosen: <strong>{lecturers.length}</strong>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredLecturers.map((lecturer) => (
            <div
              key={lecturer.id}
              className="border border-slate-200 rounded-xl p-5"
            >
              <div className="flex justify-between gap-3">
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <GraduationCap size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {lecturer.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      NIDN: {lecturer.nidn}
                    </p>
                    <p className="text-xs text-slate-500">
                      {lecturer.email}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {lecturer.prodi}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => openEditForm(lecturer)}
                    className="p-2 h-fit text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(lecturer.id)}
                    className="p-2 h-fit text-red-500 hover:bg-red-50 rounded-lg"
                    title="Hapus"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold text-slate-500 mb-2">
                  BIDANG KEAHLIAN
                </p>

                <div className="flex flex-wrap gap-2">
                  {lecturer.expertise.map((item, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-500 mb-2">
                  RIWAYAT PENELITIAN
                </p>

                <ul className="space-y-1.5">
                  {lecturer.research.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm text-slate-600 flex gap-2"
                    >
                      <span className="text-indigo-500">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {filteredLecturers.length === 0 && (
            <div className="lg:col-span-2 text-center py-10 text-slate-400">
              Data dosen tidak ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
